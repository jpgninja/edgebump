export async function upsertTradeSignals(db, tradeId, signals) {
  await db.run("DELETE FROM trade_signals WHERE trade_id=?", tradeId)
  if (!signals?.length) return
  const placeholders = signals.map(() => "(?, ?, ?, ?, ?)").join(", ")
  const values = signals.flatMap(s => [tradeId, s.signal_id, s.signal_value || null, s.type || "entry", s.order || null])
  await db.run(`INSERT INTO trade_signals (trade_id, signal_id, signal_value, type, "order") VALUES ${placeholders}`, values)
}
