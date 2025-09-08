import express from "express"
import { calculateTradeMetrics } from "../utils/tradeMetrics.js"

// SELECT * FROM v_trade_summary



export default (dbPromise) => {
  const router = express.Router()

  router.get("/:account_id", async (req, res) => {
    try {
      const db = await dbPromise
      const userId = req.user?.id
      const accountId = parseInt(req.params.account_id)

      if (!userId) return res.status(401).json({ error: "Unauthorized" })
      if (!accountId) return res.status(400).json({ error: "account_id is required" })

      // Fetch summarized trades
      const trades = await db.all(
        `SELECT * FROM v_trade_summary 
        WHERE user_id=? AND account_id=?
        ORDER BY created_at DESC`,
        [userId, accountId]
      )

      if (!trades || trades.length === 0) return res.json([])

      // Fetch signals
      const ids = trades.map(t => t.id)
      const placeholders = ids.map(() => "?").join(',')
      const tradeSignals = await db.all(
        `SELECT ts.trade_id, ts.type, ts."order", ts.signal_value,
                s.id AS signal_id, s.name AS signal_name
        FROM trade_signals ts
        JOIN signals s ON ts.signal_id = s.id
        WHERE ts.trade_id IN (${placeholders})
        ORDER BY ts.trade_id, ts."order" ASC`,
        ids
      )

      // Map signals to trades
      const tradeMap = new Map()
      trades.forEach(t => tradeMap.set(t.id, { ...t, signals: [] }))
      for (const sig of tradeSignals) {
        const entry = tradeMap.get(sig.trade_id)
        if (entry) entry.signals.push({
          id: sig.signal_id,
          name: sig.signal_name,
          value: sig.signal_value,
          type: sig.type,
          order: sig.order
        })
      }

      res.json(Array.from(tradeMap.values()))
    } catch (err) {
      console.error("GET /api/trades error:", err)
      res.status(500).json({ error: "Failed to load trades" })
    }
  })

  router.post("/:id", async (req, res) => {
    const db = await dbPromise
    const userId = req.user.id
    const { id } = req.params
    const { signals = [], executions = [], account_id, ...tradeData } = req.body

    if (!account_id) return res.status(400).json({ success: false, error: "account_id is required" })

    try {
      let tradeId

      // -------------------------
      // 1. Create or update trade
      // -------------------------
      if (id === "new") {
        const keys = ["user_id", "account_id", ...Object.keys(tradeData)]
        const placeholders = keys.map(() => "?").join(",")
        const values = [userId, account_id, ...Object.values(tradeData)]
        const result = await db.run(
          `INSERT INTO trades (${keys.join(",")}) VALUES (${placeholders})`,
          values
        )
        tradeId = result.lastID
      } else {
        const keys = ["account_id", ...Object.keys(tradeData)]
        const assignments = keys.map(k => `${k}=?`).join(",")
        const values = [account_id, ...Object.values(tradeData), id, userId]
        await db.run(
          `UPDATE trades SET ${assignments} WHERE id=? AND user_id=?`,
          ...values
        )
        tradeId = parseInt(id)
      }

      // -------------------------
      // 2. Upsert signals
      // -------------------------
      await db.run("DELETE FROM trade_signals WHERE trade_id=?", tradeId)
      if (signals.length > 0) {
        const stmt = await db.prepare(
          `INSERT INTO trade_signals (trade_id, signal_id, type, "order", signal_value) VALUES (?,?,?,?,?)`
        )
        for (const [i, sig] of signals.entries()) {
          await stmt.run(
            tradeId,
            sig.signal_id,
            sig.type ?? "entry",
            sig.order ?? i,
            sig.signal_value ?? null
          )
        }
        await stmt.finalize()
      }

      // -------------------------
      // 3. Upsert executions
      // -------------------------
      await db.run("DELETE FROM trade_executions WHERE trade_id=?", tradeId)
      if (executions.length > 0) {
        const stmt = await db.prepare(
          `INSERT INTO trade_executions (trade_id, side, price, amount, pnl) VALUES (?,?,?,?,?)`
        )
        for (const [i, exec] of executions.entries()) {
          await stmt.run(
            tradeId,
            exec.side ?? "entry",
            exec.price ?? null,
            exec.amount ?? null,
            exec.pnl ?? null
          )
        }
        await stmt.finalize()
      }

      res.json({ success: true, tradeId })
    } catch (err) {
      console.error("POST /api/trades/:id error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })

  router.put("/:id", async (req, res) => {
    const db = await dbPromise;
    const userId = req.user.id;
    const { id } = req.params;
    const { signals = [], executions = [], account_id, ...tradeData } = req.body;

    if (!account_id) return res.status(400).json({ success: false, error: "account_id is required" });

    // Prevent updating archived trades
    const existingTrade = await db.get(
      "SELECT status FROM trades WHERE id=? AND user_id=?",
      [id, userId]
    );
    if (!existingTrade || existingTrade.status === "archived") {
      return res.status(400).json({ success: false, error: "Cannot update archived trade" });
    }

    try {
      // -------------------------
      // 1. Update trade
      // -------------------------
      const keys = ["account_id", ...Object.keys(tradeData)];
      const assignments = keys.map(k => `${k}=?`).join(",");
      const values = [account_id, ...Object.values(tradeData), id, userId];
      await db.run(`UPDATE trades SET ${assignments} WHERE id=? AND user_id=?`, values);

      // -------------------------
      // 2. Upsert signals
      // -------------------------
      await db.run("DELETE FROM trade_signals WHERE trade_id=?", id);
      if (signals.length > 0) {
        const stmt = await db.prepare(
          `INSERT INTO trade_signals (trade_id, signal_id, type, "order", signal_value) VALUES (?,?,?,?,?)`
        );
        for (const [i, sig] of signals.entries()) {
          await stmt.run(
            id,
            sig.signal_id,
            sig.type ?? "entry",
            sig.order ?? i,
            sig.signal_value ?? null
          );
        }
        await stmt.finalize();
      }

      // -------------------------
      // 3. Upsert executions
      // -------------------------
      await db.run("DELETE FROM trade_executions WHERE trade_id=?", id);
      if (executions.length > 0) {
        const stmt = await db.prepare(
          `INSERT INTO trade_executions (trade_id, side, price, amount, pnl) VALUES (?,?,?,?,?)`
        );
        for (const exec of executions) {
          await stmt.run(
            id,
            exec.side ?? "entry",
            exec.price ?? null,
            exec.amount ?? null,
            exec.pnl ?? null
          );
        }
        await stmt.finalize();
      }

      res.json({ success: true, tradeId: parseInt(id) });
    } catch (err) {
      console.error("PUT /api/trades/:id error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    const db = await dbPromise;
    const userId = req.user.id;
    const { id } = req.params;

    try {
      // -------------------------
      // 1. Archive the trade
      // -------------------------
      const result = await db.run(
        `UPDATE trades SET status='archived' WHERE id=? AND user_id=?`,
        [id, userId]
      );

      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: "Trade not found or already archived" });
      }

      // -------------------------
      // 2. Optional: clear signals & executions
      // -------------------------
      // await db.run("DELETE FROM trade_signals WHERE trade_id=?", id);
      // await db.run("DELETE FROM trade_executions WHERE trade_id=?", id);

      res.json({ success: true, tradeId: parseInt(id) });
    } catch (err) {
      console.error("DELETE /api/trades/:id error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });


  return router
}
