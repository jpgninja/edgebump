import express from "express"

export default (dbPromise) => {
  const router = express.Router()

  // Get all signals.
  router.get("/", async (req, res) => {
    const db = await dbPromise
    const signals = await db.all("SELECT * FROM signals")
    res.json(signals)
  })

  // Create a new signal.
  router.post("/", async (req, res) => {
    const { name, description } = req.body
    try {
      const db = await dbPromise
      const stmt = await db.run(
        "INSERT INTO signals (name, description) VALUES (?, ?)",
        name, description
      )
      res.json({ success: true, id: stmt.lastID })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  })

  return router
}
