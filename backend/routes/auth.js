import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

// Set up environment variables.
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || "JWT_TOKEN_DEFAULT_VALUE"

export default (dbPromise) => {
    const router = express.Router()

    router.post("/verify", async (req, res) => {
        const authHeader = req.headers["authorization"]
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Invalid auth token" })
        }

        const token = authHeader.split(" ")[1]
        if (!token) {
            return res.status(401).json({ error: "Invalid auth token" })
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET)
            return res.json({ ok: true, decoded })
        } catch (err) {
            return res.status(401).json({ ok: false })
        }
    })

    router.post("/register", async (req, res) => {
        const { username, password, email } = req.body
        const hashed = await bcrypt.hash(password, 10)
        // insert user into DB
    })

    router.post("/login", async (req, res) => {
        const { username, password } = req.body
        try {
            const db = await dbPromise
            // fetch user, compare password with bcrypt.compare
            const user = await db.get("SELECT * FROM users WHERE username = ?", username)

            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" })
            }

            const isValid = await bcrypt.compare(password, user.password_hash)
            if (!isValid) {
                return res.status(402).json({ error: "Invalid credentials" })
            }

            const token = jwt.sign({ id: user.id, type: user.user_type }, JWT_SECRET, { expiresIn: "12h" })
            return res.json({ token })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ error: "Internal server error" })
        }
    })

    router.post("/register", async (req, res) => {
        const { username, password, email } = req.body
        try {
            const db = await dbPromise

            // check if username already exists
            const existing = await db.get("SELECT id FROM users WHERE username = ?", username)
            if (existing) {
                return res.status(409).json({ error: "Username already taken" })
            }

            // hash password
            const saltRounds = 10
            const password_hash = await bcrypt.hash(password, saltRounds)

            // insert user
            const result = await db.run(
                "INSERT INTO users (username, password_hash, email, user_type) VALUES (?, ?, ?, ?)",
                [username, password_hash, email || null, "user"]
            )

            // generate token
            const token = jwt.sign({ id: result.lastID, type: "user" }, JWT_SECRET, { expiresIn: "12h" })
            return res.json({ token })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ error: "Internal server error" })
        }
    })

    return router
}
