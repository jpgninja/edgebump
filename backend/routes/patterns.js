import express from "express"

export default (dbPromise) => {
  const router = express.Router()

  // Get all patterns for the logged-in user
  router.get("/", async (req, res) => {
    try {
      const db = await dbPromise

      // 1. Get all active patterns for the user
      const patterns = await db.all(
        `
        SELECT 
          p.id,
          p.name,
          p.description,
          (
            SELECT COUNT(*)
            FROM trades t
            WHERE t.pattern_id = p.id
          ) AS trade_count
        FROM patterns p
        WHERE p.user_id = ? AND p.status = 'active'
        `,
        [req.user.id]
      )


      // 2. Get all rules for these patterns
      const patternIds = patterns.map(p => p.id)
      let rules = []
      if (patternIds.length > 0) {
        const placeholders = patternIds.map(() => "?").join(",")
        rules = await db.all(
          `SELECT ps.pattern_id, ps.signal_id, ps.type, ps."order", s.name AS signal_name
          FROM pattern_signals ps
          LEFT JOIN signals s ON ps.signal_id = s.id
          WHERE ps.pattern_id IN (${placeholders})
          ORDER BY ps.pattern_id, ps."order"`,
          patternIds
        )
      }

      // 3. Nest rules under their patterns
      const patternsWithRules = patterns.map(p => ({
        ...p,
        rules: rules.filter(r => r.pattern_id === p.id)
      }))

      res.json(patternsWithRules)
    } catch (err) {
      console.error("GET /api/patterns error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // Get single pattern
  // Get single pattern
  router.get("/:id", async (req, res) => {
    try {
      const db = await dbPromise

      // Fetch the main pattern
      const pattern = await db.get(
        "SELECT * FROM patterns WHERE id = ?",
        [req.params.id]
      )
      if (!pattern) return res.status(404).json({ error: "Pattern not found" })

      // Fetch associated rules/signals
      const rules = await db.all(
        `SELECT ps.id as pattern_signal_id,
                ps.type,
                ps."order",
                s.id as signal_id,
                s.name as signal_name,
                s.description as signal_description,
                s.value_type
        FROM pattern_signals ps
        JOIN signals s ON ps.signal_id = s.id
        WHERE ps.pattern_id = ?
        ORDER BY ps."order" ASC`,
        [pattern.id]
      )

      // Combine pattern + rules into one object
      const response = {
        ...pattern,
        rules
      }

      res.json(response)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
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

      // Get current pattern
      const current = await db.get("SELECT name, description FROM patterns WHERE id = ? AND user_id = ?", [patternId, userId])
      if (!current) {
        return res.status(404).json({
          success: false,
          error: "Pattern not found" 
        })
      }

      // Prepare update fields
      const fields = []
      const values = []

      if (req.body.name && req.body.name !== current.name) {
        fields.push("name = ?")
        values.push(req.body.name)
      }

      // Always update description (or do similar check)
      if (req.body.description !== undefined) {
        fields.push("description = ?")
        values.push(req.body.description)
      }

      if (fields.length === 0) {
        return res.json({ success: true }) // nothing to update
      }

      // Append WHERE clause values
      values.push(req.params.id)

      // Run update
      
      // -------------------------
      // 1. Update pattern
      // -------------------------
      const result = await db.run(
        `UPDATE patterns SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
        [...values, userId]
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
