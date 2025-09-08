export function calculateTradeMetrics(executions) {
  const entryExecs = executions.filter(e => e.side === "entry")
  const exitExecs = executions.filter(e => e.side === "exit")

  // Weighted average prices
  const totalEntrySize = entryExecs.reduce((sum, e) => sum + e.amount, 0)
  const avg_entry = totalEntrySize
    ? entryExecs.reduce((sum, e) => sum + e.price * e.amount, 0) / totalEntrySize
    : null

  const totalExitSize = exitExecs.reduce((sum, e) => sum + e.amount, 0)
  const avg_exit = totalExitSize
    ? exitExecs.reduce((sum, e) => sum + e.price * e.amount, 0) / totalExitSize
    : null

  // Move per unit
  const move = avg_exit != null && avg_entry != null ? avg_exit - avg_entry : null

  // ROI in $ and %
  const total_outlay = entryExecs.reduce((sum, e) => sum + e.price * e.amount, 0)
  const total_return = exitExecs.reduce((sum, e) => sum + e.price * e.amount, 0)
  const roi = total_return - total_outlay
  const roi_pct = total_outlay ? (roi / total_outlay) * 100 : null

  const total_size = totalEntrySize

  return { avg_entry, avg_exit, move, roi, roi_pct, total_size, total_outlay }
}

