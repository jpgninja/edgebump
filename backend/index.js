import express from "express"
import cors from "cors"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import { fileURLToPath } from "url"

// Set up environment variables.
import dotenv from "dotenv"
dotenv.config()

// Get global __dirname in ES module scope.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Static imports (best practice)
import tradesRoutes from "./routes/trades.js"
import patternsRoutes from "./routes/patterns.js"
import signalsRoutes from "./routes/signals.js"
import accountsRoutes from "./routes/accounts.js"
import usersRoutes from "./routes/users.js"
import rulesRoutes from "./routes/rules.js"
import authRoutes from "./routes/auth.js"
import { jwtAuth } from "./middleware/auth.js"

// App setup
const app = express()
app.use(cors())
app.use(express.json())
// app.use(apiKeyAuth)

// DB connection
const dbPromise = open({
  filename: path.join(__dirname, "../db/trades.db"),
  driver: sqlite3.Database
})

// Routes
app.use("/api/trades", jwtAuth, tradesRoutes(dbPromise))
app.use("/api/patterns", jwtAuth, patternsRoutes(dbPromise))
app.use("/api/signals", jwtAuth, signalsRoutes(dbPromise))
app.use("/api/accounts", jwtAuth, accountsRoutes(dbPromise))
app.use("/api/users", jwtAuth, usersRoutes(dbPromise))
app.use("/api/rules", jwtAuth, rulesRoutes(dbPromise))

app.use("/auth", authRoutes(dbPromise))

app.listen(3000, () => console.log("API running on http://localhost:3000"))
