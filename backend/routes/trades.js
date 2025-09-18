import express from "express"
import { enrich } from "../utils/trades.js";

export default (dbPromise) => {
  const router = express.Router()

  // Select all trades for the authenticated user.
  router.get("/", async (req, res) => {
    try {
      const db = await dbPromise
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ error: "Unauthorized" })

      // 1. Fetch trades
      const trades = await db.all(
        `SELECT * FROM trades
        WHERE user_id = ?
        ORDER BY created_at DESC`,
        [userId]
      )

      if (!trades || trades.length === 0) return res.json([])

      const ids = trades.map(t => t.id)
      const placeholders = ids.map(() => "?").join(",")

      // 2. Fetch executions
      const executions = await db.all(
        `SELECT * FROM trade_executions
        WHERE trade_id IN (${placeholders})
        ORDER BY created_at ASC`,
        ids
      )

      // 3. Fetch signals
      const signals = await db.all(
        `SELECT ts.trade_id, ts.type, ts."order", ts.signal_value,
                s.id AS signal_id, s.name AS signal_name
        FROM trade_signals ts
        JOIN signals s ON ts.signal_id = s.id
        WHERE ts.trade_id IN (${placeholders})
        ORDER BY ts.trade_id, ts."order" ASC`,
        ids
      )

      // 4. Enrich trades with executions + signals
      const enrichedTrades = enrich(trades, executions, signals)

      res.json(enrichedTrades)
    } catch (err) {
      console.error("GET /api/trades error:", err)
      res.status(500).json({ error: "Failed to load trades" })
    }
  })


  // Select a specific trade by ID for the authenticated user.
  router.get("/:id", async (req, res) => {
    try {
      const db = await dbPromise;
      const userId = req.user?.id;
      const tradeId = parseInt(req.params.id);

      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      if (!tradeId) return res.status(400).json({ error: "trade_id is required" });

      // 1. Fetch the trade
      const trades = await db.all(
        `SELECT * FROM trades
        WHERE user_id = ? AND id = ?
        ORDER BY created_at DESC`,
        [userId, tradeId]
      );

      if (!trades || trades.length === 0) return res.json([]);

      const ids = trades.map((t) => t.id);
      const placeholders = ids.map(() => "?").join(",");

      // 2. Fetch executions
      const executions = await db.all(
        `SELECT * FROM trade_executions
        WHERE trade_id IN (${placeholders})
        ORDER BY created_at ASC`,
        ids
      );

      // 3. Fetch signals
      const signals = await db.all(
        `SELECT ts.trade_id, ts.type, ts."order", ts.signal_value,
                s.id AS signal_id, s.name AS signal_name
        FROM trade_signals ts
        JOIN signals s ON ts.signal_id = s.id
        WHERE ts.trade_id IN (${placeholders})
        ORDER BY ts.trade_id, ts."order" ASC`,
        ids
      );

      // 4. Enrich
      const enrichedTrades = enrich(trades, executions, signals);

      res.json(enrichedTrades[0]); // only one trade expected
    } catch (err) {
      console.error("GET /api/trades/:id error:", err);
      res.status(500).json({ error: "Failed to load trade" });
    }
  });


  // Create or update a trade.
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

  // Update a trade.
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
      console.log("Trade update keys:", keys);
      const assignments = keys.map(k => `${k}=?`).join(",");
      console.log("Trade update assignments:", assignments);
      const values = [account_id, ...Object.values(tradeData), id, userId];
      console.log("Trade update values:", values);
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
          console.log("Inserting signal:", sig, i);
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
      console.log("Executions to insert:", executions);
      if (executions.length > 0) {
        const stmt = await db.prepare(
          `INSERT INTO trade_executions (trade_id, side, price, amount, pnl) VALUES (?,?,?,?,?)`
        );
        for (const exec of executions) {
          console.log("Inserting execution:", exec);
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

  // Soft delete a trade.
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
