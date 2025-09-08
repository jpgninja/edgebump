import express from "express"

export default (dbPromise) => {
  const router = express.Router()

  // Get all patterns for the logged-in user
  router.get("/", async (req, res) => {
    try {
      const db = await dbPromise
      const patterns = await db.all(
        "SELECT id, name, description FROM patterns WHERE user_id = ?",
        [req.user.id]
      )
      res.json(patterns)
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // Get single pattern
  router.get("/:id", async (req, res) => {
    const db = await dbPromise
    const pattern = await db.get("SELECT * FROM patterns WHERE id = ?", [req.params.id])
    if (!pattern) return res.status(404).json({ error: "Pattern not found" })
    res.json(pattern)
  })

  // Create or update pattern
  router.post("/", async (req, res) => {
    const { name, description, rules = [] } = req.body
    const userId = req.user.id

    try {
      const db = await dbPromise

      // -------------------------
      // 1. Insert pattern
      // -------------------------
      const result = await db.run(
        "INSERT INTO patterns (name, user_id, description) VALUES (?, ?, ?)",
        [name, userId, description]
      )
      const patternId = result.lastID

      // -------------------------
      // 2. Insert pattern_signals
      // -------------------------
      if (rules.length > 0) {
        const stmt = await db.prepare(
          `INSERT INTO pattern_signals (pattern_id, signal_id, type, "order") VALUES (?,?,?,?)`
        )
        for (const [i, rule] of rules.entries()) {
          await stmt.run(
            patternId,
            rule.signal_id,
            rule.type ?? "entry",
            rule.order ?? i
          )
        }
        await stmt.finalize()
      }

      res.json({ success: true, id: patternId })
    } catch (err) {
      console.error("POST /api/patterns error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })


  // Update pattern
  router.put("/:id", async (req, res) => {
    const { name, description, rules = [] } = req.body
    const patternId = req.params.id
    const userId = req.user.id

    try {
      const db = await dbPromise

      // -------------------------
      // 1. Update pattern
      // -------------------------
      const result = await db.run(
        "UPDATE patterns SET name = ?, description = ? WHERE id = ? AND user_id = ?",
        [name, description, patternId, userId]
      )
      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: "Pattern not found or not owned by user" })
      }

      // -------------------------
      // 2. Upsert pattern_signals
      // -------------------------
      await db.run("DELETE FROM pattern_signals WHERE pattern_id = ?", patternId)

      if (rules.length > 0) {
        const stmt = await db.prepare(
          `INSERT INTO pattern_signals (pattern_id, signal_id, type, "order") VALUES (?,?,?,?)`
        )
        for (const [i, rule] of rules.entries()) {
          await stmt.run(
            patternId,
            rule.signal_id,
            rule.type ?? "entry",
            rule.order ?? i
          )
        }
        await stmt.finalize()
      }

      res.json({ success: true })
    } catch (err) {
      console.error("PUT /api/patterns/:id error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })


  // Soft-delete pattern
  router.delete("/:id", async (req, res) => {
    const patternId = req.params.id
    const userId = req.user.id

    try {
      const db = await dbPromise
      const result = await db.run(
        "UPDATE patterns SET status = 'archived' WHERE id = ? AND user_id = ?",
        [patternId, userId]
      )

      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: "Pattern not found or not owned by user" })
      }

      res.json({ success: true })
    } catch (err) {
      console.error("DELETE /api/patterns/:id error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })


  return router
}
