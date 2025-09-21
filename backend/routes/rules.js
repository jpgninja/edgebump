// routes/rules.js
import express from "express"

export default (dbPromise) => {
  const router = express.Router()
  // Autocomplete: return all unique rules user has used across their patterns
  router.get("/autocomplete", async (req, res) => {
    try {
      const db = await dbPromise
      const rules = await db.all(
        `SELECT DISTINCT r.id, r.name
        FROM rules r
        JOIN pattern_rules pr ON pr.rule_id = r.id
        JOIN patterns p ON p.id = pr.pattern_id
        WHERE p.user_id = ?
        ORDER BY r.name ASC`,
        [req.user.id]
      )
      res.json(rules)
    } catch (err) {
      console.error("GET /api/rules/autocomplete error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // (Optional) Get rule by id
  router.get("/:id", async (req, res) => {
    try {
      const db = await dbPromise
      const rule = await db.get(`SELECT id, name, description FROM rules WHERE id = ?`, [req.params.id])
      if (!rule) return res.status(404).json({ success: false, error: "Rule not found" })
      res.json(rule)
    } catch (err) {
      console.error("GET /api/rules/:id error:", err)
      res.status(500).json({ success: false, error: err.message })
    }
  })

  return router
}
