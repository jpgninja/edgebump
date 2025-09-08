export async function saveTrade(db, userId, tradeData, tradeId=null) {
  // validate pattern belongs to this user
  // @TODO: we need to find out how to get out the pattern-id so I commented this out
  // if (pattern_id) {
  //   const pattern = await db.get(
  //     "SELECT id FROM patterns WHERE id = ? AND user_id = ?",
  //     [pattern_id, userId]
  //   )
  //   if (!pattern) {
  //     return res.status(400).json({ error: "Invalid pattern_id" })
  //   }
  // }

  if (!tradeId || tradeId === "new") {
    const stmt = await db.run(
      `INSERT INTO trades (user_id, ${Object.keys(tradeData).join(", ")})
       VALUES (?, ${Object.keys(tradeData).map(()=>"?").join(", ")})`,
      userId, ...Object.values(tradeData)
    )
    return stmt.lastID
  } else {
    await db.run(
      `UPDATE trades SET ${Object.keys(tradeData).map(k=>k+"=?").join(", ")}, updated_at=CURRENT_TIMESTAMP
       WHERE id=? AND user_id=?`,
      ...Object.values(tradeData), tradeId, userId
    )
    return tradeId
  }
}
