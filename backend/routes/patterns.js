import express from "express"

export default (dbPromise) => {
  const router = express.Router()

  // Get all active patterns
  router.get("/", async (req, res) => {
    try {
      const db = await dbPromise
      const patterns = await db.all(
        `SELECT id, name, description, timeframe_high, timeframe_medium, timeframe_low, created_at, updated_at
         FROM patterns
         WHERE user_id = ? AND status = 'active'`,
        [req.user.id]
      )

      for (const p of patterns) {
        const rules = await db.all(
          `SELECT r.name
           FROM pattern_rules pr
           JOIN rules r ON r.id = pr.rule_id
           WHERE pr.pattern_id = ?`,
          [p.id]
        )
        p.rules = rules.map(r => r.name)
      }

      res.json(patterns)
    } catch (err) {
      console.error("GET /api/patterns error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // Get pattern by id
  router.get("/:id", async (req, res) => {
    try {
      const db = await dbPromise
      const pattern = await db.get(
        `SELECT id, name, description, timeframe_high, timeframe_medium, timeframe_low, created_at, updated_at
         FROM patterns
         WHERE id = ? AND user_id = ?`,
        [req.params.id, req.user.id]
      )

      if (!pattern) {
        return res.status(404).json({ success: false, error: "Pattern not found" })
      }

      const rules = await db.all(
        `SELECT r.name
         FROM pattern_rules pr
         JOIN rules r ON r.id = pr.rule_id
         WHERE pr.pattern_id = ?`,
        [pattern.id]
      )
      pattern.rules = rules.map(r => r.name)

      res.json(pattern)
    } catch (err) {
      console.error("GET /api/patterns/:id error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // Create pattern
  router.post("/", async (req, res) => {
    const { name, description, rules = [], timeframe_high, timeframe_medium, timeframe_low } = req.body
    const userId = req.user.id

    try {
      const db = await dbPromise

      // -------------------------
      // 1. Insert pattern
      // -------------------------
      const result = await db.run(
        `INSERT INTO patterns (name, user_id, description, timeframe_high, timeframe_medium, timeframe_low)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, userId, description, timeframe_high, timeframe_medium, timeframe_low]
      )
      const patternId = result.lastID

      // -------------------------
      // 2. Upsert rules + attach via pattern_rules
      // -------------------------
      // -------------------------
      // 2. Upsert pattern_rules
      // -------------------------
      if (rules.length > 0) {
        for (const [i, rule] of rules.entries()) {
          // find existing rule by name
          let dbRule = await db.get("SELECT id FROM rules WHERE name = ?", [rule.name])
          if (!dbRule) {
            const result = await db.run(
              "INSERT INTO rules (name, description, created_by) VALUES (?, ?, ?)",
              [rule.name, rule.description ?? null, userId]
            )
            dbRule = { id: result.lastID }
          }

          // link pattern to rule
          await db.run(
            `INSERT OR IGNORE INTO pattern_rules (pattern_id, rule_id) VALUES (?, ?)`,
            [patternId, dbRule.id]
          )
        }
      }


      res.json({ success: true, id: patternId })
    } catch (err) {
      console.error("POST /api/patterns error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // Update pattern
  router.put("/:id", async (req, res) => {
    const { name, description, rules = [], timeframe_high, timeframe_medium, timeframe_low } = req.body
    const patternId = req.params.id
    const userId = req.user.id

    try {
      const db = await dbPromise

      // Get current pattern
      const current = await db.get(
        `SELECT * FROM patterns WHERE id = ? AND user_id = ?`,
        [patternId, userId]
      )
      if (!current) {
        return res.status(404).json({ success: false, error: "Pattern not found" })
      }

      // Prepare update fields
      const fields = []
      const values = []

      if (name && name !== current.name) {
        fields.push("name = ?")
        values.push(name)
      }
      if (description !== undefined && description !== current.description) {
        fields.push("description = ?")
        values.push(description)
      }
      if (timeframe_high !== undefined && timeframe_high !== current.timeframe_high) {
        fields.push("timeframe_high = ?")
        values.push(timeframe_high)
      }
      if (timeframe_medium !== undefined && timeframe_medium !== current.timeframe_medium) {
        fields.push("timeframe_medium = ?")
        values.push(timeframe_medium)
      }
      if (timeframe_low !== undefined && timeframe_low !== current.timeframe_low) {
        fields.push("timeframe_low = ?")
        values.push(timeframe_low)
      }

      if (fields.length > 0) {
        values.push(patternId, userId)
        await db.run(
          `UPDATE patterns 
           SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
           WHERE id = ? AND user_id = ?`,
          values
        )
      }

      // -------------------------
      // 2. Upsert rules + pattern_rules
      // -------------------------
      if (rules.length > 0) {
        // Clear existing
        await db.run("DELETE FROM pattern_rules WHERE pattern_id = ?", patternId)

        for (const [i, rule] of rules.entries()) {
          // find existing rule by name
          let dbRule = await db.get("SELECT id FROM rules WHERE name = ?", [rule.name])
          if (!dbRule) {
            const result = await db.run(
              "INSERT INTO rules (name, description, created_by) VALUES (?, ?, ?)",
              [rule.name, rule.description ?? null, userId]
            )
            dbRule = { id: result.lastID }
          }

          // re-link pattern to rule
          await db.run(
            `INSERT OR IGNORE INTO pattern_rules (pattern_id, rule_id) VALUES (?, ?)`,
            [patternId, dbRule.id]
          )
        }
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
