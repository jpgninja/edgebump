<script setup>
import { computed } from "vue"
import { useTradeBuilder } from "../composables/useTradeBuilder"

const { form } = useTradeBuilder()

// Computed totals for review
const entries = computed(() => form.executions.filter(e => e.side === "entry"))
const exits = computed(() => form.executions.filter(e => e.side === "exit"))

const weightedAvgEntry = computed(() => {
  const total = entries.value.reduce((acc, e) => acc + (e.price * e.amount), 0)
  const amount = entries.value.reduce((acc, e) => acc + e.amount, 0)
  return amount ? total / amount : 0
})

const netPosition = computed(() => {
  const entryAmount = entries.value.reduce((acc, e) => acc + e.amount, 0)
  const exitAmount = exits.value.reduce((acc, e) => acc + e.amount, 0)
  return entryAmount - exitAmount
})

const unrealizedPnL = computed(() => {
  const lastPrice = form.executions.length ? form.executions[form.executions.length - 1].price : 0
  return netPosition.value * (lastPrice - weightedAvgEntry.value)
})

const riskReward = computed(() => {
  return form.entry_plan && form.stop_loss && form.take_profit
    ? ((form.take_profit - form.entry_plan) / (form.entry_plan - form.stop_loss)).toFixed(1)
    : "N/A"
})
</script>

<template>
  <div class="space-y-4 p-4 bg-gray-800 text-white rounded-lg">
    <h2 class="text-xl font-bold">3. Trade Review</h2>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <p><strong>Ticker:</strong> {{ form.ticker }}</p>
        <p><strong>Direction:</strong> {{ form.direction }}</p>
        <p><strong>Pattern:</strong> {{ form.pattern_id || "N/A" }}</p>
        <p><strong>Timeframe:</strong> {{ form.timeframe || "N/A" }}</p>
      </div>

      <div>
        <p><strong>Entry:</strong> {{ form.entry_plan }}</p>
        <p><strong>Stop Loss:</strong> {{ form.stop_loss }}</p>
        <p><strong>Take Profit:</strong> {{ form.take_profit }}</p>
        <p><strong>R:R:</strong> {{ riskReward }}</p>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Signals / Confluences</h3>
      <ul class="list-disc list-inside">
        <li v-for="(s, i) in form.signals" :key="i">{{ s.name || s.signal_value || s }}</li>
      </ul>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Executions</h3>
      <ul class="list-disc list-inside">
        <li v-for="(exec, i) in form.executions" :key="i">
          {{ exec.side }}: {{ exec.price }} × {{ exec.amount }} | PnL: {{ exec.pnl ?? "N/A" }}
        </li>
      </ul>
    </div>

    <div class="p-4 bg-gray-900 rounded-lg border border-gray-800">
      <p><strong>Weighted Avg Entry:</strong> {{ weightedAvgEntry.toFixed(2) }}</p>
      <p><strong>Net Position:</strong> {{ netPosition.toFixed(2) }}</p>
      <p><strong>Unrealized PnL:</strong> {{ unrealizedPnL.toFixed(2) }}</p>
    </div>

    <div>
      <label class="block text-sm mb-1">Notes</label>
      <textarea v-model="form.notes" rows="3" class="w-full p-2 rounded bg-gray-700 border border-gray-600"></textarea>
    </div>
  </div>
</template>
