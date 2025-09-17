import jwt from "jsonwebtoken"
// Set up environment variables.
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const jwtAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid auth token" })
  }

  const token = authHeader.split(" ")[1]
  if (!token || !JWT_SECRET) {
    return res.status(401).json({ error: "Missing auth token or secret" })
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: "Invalid auth token" })
  }
}
