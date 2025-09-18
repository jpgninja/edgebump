import express from "express"

export default (dbPromise) => {
    const router = express.Router()

    // GET all accounts for logged-in user
    router.get("/", async (req, res) => {
    const db = await dbPromise
    try {
        const accounts = await db.all("SELECT * FROM users")
        res.json(accounts)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
    })

    // GET single account
    router.get("/:id", async (req, res) => {
        const db = await dbPromise
        try {
            const account = await db.get("SELECT * FROM users WHERE id = ?", [
                req.params.id,
            ]);
            if (!account) return res.status(404).json({ error: "Not found" });
            res.json(account);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // CREATE user
    router.post("/", async (req, res) => {
        const db = await dbPromise
        try {
            const {
                username,
                email,
                password_hash,
            } = req.body;

            const result = await db.run(
                `INSERT INTO users 
                (username, email, password_hash)
                VALUES (?, ?, ?)`,
                [
                    username,
                    email,
                    password_hash,
                ]
            );

            res.status(201).json({ id: result.lastID });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // UPDATE account
    router.put("/:id", async (req, res) => {
        const db = await dbPromise
        try {
            const fields = [

            ];
            const updates = [];
            const values = [];

            fields.forEach((f) => {
                if (req.body[f] !== undefined) {
                    updates.push(`${f} = ?`);
                    values.push(req.body[f]);
                }
            });

            if (updates.length === 0) return res.json({ updated: false });

            values.push(req.params.id);

            await db.run(
                `UPDATE users SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                values
            );

            res.json({ updated: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Soft delete this user by setting them to archived.
    router.delete("/:id", async (req, res) => {
        const db = await dbPromise
        try {
            await db.run("DELETE FROM users WHERE id = ?", [req.params.id]);
            res.json({ deleted: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router
}