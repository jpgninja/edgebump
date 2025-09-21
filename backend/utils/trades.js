// utils/trades.js

/**
 * Normalize execution amount based on side + trade direction.
 * - For longs: entry = +, exit = -
 * - For shorts: entry = -, exit = +
 */
function normalizedAmount(exec, direction = "long") {
  const amt = exec.amount || 0;
  if (direction === "long") {
    return exec.side === "entry" ? amt : -amt;
  } else if (direction === "short") {
    return exec.side === "entry" ? -amt : amt;
  }
  return amt;
}

/**
 * Weighted average price of executions, using normalized amounts.
 */
function weightedAvg(executions, direction) {
  if (!executions.length) return null;

  const totalAmount = executions.reduce(
    (sum, e) => sum + Math.abs(normalizedAmount(e, direction)),
    0
  );
  if (totalAmount === 0) return null;

  const weightedSum = executions.reduce(
    (sum, e) => sum + e.price * Math.abs(normalizedAmount(e, direction)),
    0
  );
  return weightedSum / totalAmount;
}

/**
 * Enrich trades with derived fields:
 * - executions + signals scoped to the trade
 * - avgEntry, avgExit (weighted averages)
 * - realizedPnl (sum of execution PnL)
 * - position (net open units, direction-aware)
 * - status (active/closed)
 * - totalPositionSize (absolute sum of entry amounts)
 * - totalPositionValue (dollar outlay at avgEntry)
 */
export function enrich(trades, executions, signals) {
  return trades.map((trade) => {
    if (!trade) return {};

    // Attach executions/signals for this trade
    const tradeExecutions = executions.filter((e) => e.trade_id === trade.id);
    const tradeSignals = signals.filter((s) => s.trade_id === trade.id);

    // Break out entries/exits for easier math
    const entries = tradeExecutions.filter((e) => e.side === "entry");
    const exits = tradeExecutions.filter((e) => e.side === "exit");

    // Position = sum of normalized amounts
    const netPos = tradeExecutions.reduce(
      (sum, e) => sum + normalizedAmount(e, trade.direction),
      0
    );

    // Weighted average entry/exit prices
    const avgEntry = weightedAvg(entries, trade.direction);
    const avgExit = weightedAvg(exits, trade.direction);

    // Realized PnL = sum over executions
    // Realized PnL = sum over pnl of all executions
    const realizedPnl = tradeExecutions.reduce((sum, e) => {
      return sum + (e.pnl || 0)
    }, 0)

    // Trade status based on open position
    const status = netPos === 0 ? "closed" : "active";

    // Total position size (entry value in $ terms)
    const totalPositionSize = entries.reduce(
      (sum, e) => sum + (e.amount || 0),
      0
    )

    // Total position value in dollars (based on avg entry)
    const totalPositionValue = avgEntry && totalPositionSize ? avgEntry * totalPositionSize : null;

    // ROI = Realized PnL / Total Position Size
    const roi = totalPositionSize > 0 ? realizedPnl / totalPositionSize : 0;

    return {
      ...trade,
      executions: tradeExecutions,
      signals: tradeSignals,
      avgEntry,
      avgExit,
      realizedPnl,
      position: netPos,
      status,
      totalPositionSize,
      totalPositionValue,
      roi,
    };
  });
}
