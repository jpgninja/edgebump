import express from "express"

export default (dbPromise) => {
    const router = express.Router()

    // GET all accounts for logged-in user
    router.get("/", async (req, res) => {
    const db = await dbPromise
    try {
        const accounts = await db.all(
        "SELECT * FROM accounts WHERE user_id = ?",
        [req.user.id]   // comes from JWT middleware
        )
        res.json(accounts)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
    })

    // GET single account
    router.get("/:id", async (req, res) => {
        const db = await dbPromise
        try {
            const account = await db.get("SELECT * FROM accounts WHERE id = ?", [
                req.params.id,
            ]);
            if (!account) return res.status(404).json({ error: "Not found" });
            res.json(account);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // CREATE account
    router.post("/", async (req, res) => {
        const db = await dbPromise
        try {
            const {
                broker_id,
                account_number,
                name,
                account_type,
                currency,
                starting_balance,
            } = req.body;

            const result = await db.run(
                `INSERT INTO accounts 
       (user_id, broker_id, account_number, name, account_type, currency, starting_balance, balance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    req.user.id,
                    broker_id,
                    account_number,
                    name,
                    account_type,
                    currency,
                    starting_balance,
                    starting_balance,
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
                "broker_id",
                "account_number",
                "name",
                "account_type",
                "currency",
                "balance",
                "leverage",
                "max_risk_percent",
                "status",
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
                `UPDATE accounts SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                values
            );

            res.json({ updated: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // DELETE account
    router.delete("/:id", async (req, res) => {
        const db = await dbPromise
        try {
            await db.run("DELETE FROM accounts WHERE id = ?", [req.params.id]);
            res.json({ deleted: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router
}