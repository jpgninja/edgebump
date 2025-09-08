import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

// Set up environment variables.
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || "JWT_TOKEN_DEFAULT_VALUE"

export default (dbPromise) => {
    const router = express.Router()

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


    return router
}
