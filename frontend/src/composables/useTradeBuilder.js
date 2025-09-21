// composables/useTradeBuilder.js
import { ref, computed, reactive, watch } from "vue"

  // ---- Trade form state ----
  const form = reactive({
    id: null,
    pattern_id: null,
    pattern_name: "",
    direction: "",
    ticker: "",
    timeframe: "",
    entry_plan: null,
    stop_loss: null,
    take_profit: null,
    leverage: null,
    account_id: null,
    notes: "",
    signals: [],
    executions: []
  })
  const phases = ["plan", "execute", "review"]
  const currentPhase = ref("plan")

const tradeSummary = computed(() => {
  const e = parseFloat(form.entry_plan)
  const sl = parseFloat(form.stop_loss)
  const tp = parseFloat(form.take_profit)
  const pos = parseFloat(form.position_size) || 1

  const riskPerUnit = sl && e ? Math.abs(e - sl) : 0
  const rewardPerUnit = tp && e ? Math.abs(tp - e) : 0

  return {
    ticker: form.ticker,
    direction: e && tp ? (tp > e ? "long" : "short") : "",
    entry_plan: e,
    stop_loss: sl,
    take_profit: tp,
    rrRatio: riskPerUnit ? (rewardPerUnit / riskPerUnit).toFixed(2) : null,
    potentialLoss: riskPerUnit * pos,
    potentialGain: rewardPerUnit * pos,
    notes: form.notes,
    executions: form.executions || [],
    position: pos,
    pattern: form.pattern_id
  }
})

export function useTradeBuilder() {
  const switchPhase = (phase) => {
    if (phases.includes(phase)) currentPhase.value = phase
  }

  const addExecution = (side = "entry", price = null, amount = null) => {
    form.executions.push({ side, price, amount, pnl: null })
  }
  const removeExecution = (index) => form.executions.splice(index, 1)

  const rr = computed(() => {
    const e = parseFloat(form.entry_plan)
    const sl = parseFloat(form.stop_loss)
    const tp = parseFloat(form.take_profit)
    if (!e || !sl || !tp) return null
    return ((tp - e) / (e - sl)).toFixed(2)
  })

  return {
    form,
    phases,
    currentPhase,
    switchPhase,
    addExecution,
    removeExecution,
    rr,
    tradeSummary
  }
}
