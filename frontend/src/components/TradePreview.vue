<script setup>
import { computed } from "vue"
import { useTradeBuilder } from "../composables/useTradeBuilder"
import MarkdownIt from "markdown-it"

const { tradeSummary } = useTradeBuilder()
const md = new MarkdownIt()

// Computed accessors
const ticker = computed(() => tradeSummary.ticker || '')
const direction = computed(() => tradeSummary.direction || '')
const entryPlan = computed(() => tradeSummary.entry_plan || '')
const stopLoss = computed(() => tradeSummary.stop_loss || '')
const takeProfit = computed(() => tradeSummary.take_profit || '')
const rrRatio = computed(() => tradeSummary.rrRatio || '')
const potentialLoss = computed(() => tradeSummary.potentialLoss?.toFixed(2) || '0')
const potentialGain = computed(() => tradeSummary.potentialGain?.toFixed(2) || '0')
const notesHtml = computed(() => md.render(tradeSummary.notes || ''))
const executions = computed(() => tradeSummary.executions || [])
const pattern = computed(() => tradeSummary.pattern || '')



// Total Position
const totalPosition = computed(() => {
  return form.executions.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
})

// Average Entry
const avgEntry = computed(() => {
  const entries = form.executions.filter(e => e.side === "entry")
  const total = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  if (!total) return 0
  const weightedSum = entries.reduce((sum, e) => sum + (parseFloat(e.price) || 0) * (parseFloat(e.amount) || 0), 0)
  return (weightedSum / total).toFixed(2)
})

</script>

<template>
  <div class="space-y-4 p-4 bg-gray-900 text-white rounded-lg">
    <h2 class="text-2xl font-bold">Trade Log</h2>
    <p><strong>Ticker:</strong> {{ ticker }}</p>
    <p><strong>Pattern:</strong> {{ pattern }}</p>
    <p><strong>Direction:</strong> {{ direction }}</p>
    <p><strong>Entry / SL / TP:</strong> {{ entryPlan }} / {{ stopLoss }} / {{ takeProfit }}</p>
    <p><strong>Risk to Reward:</strong> {{ rrRatio }}R</p>
    <p><strong>Risk:</strong> -{{ potentialLoss }}</p>
    <p><strong>Reward:</strong> {{ potentialGain }}</p>

    <div>
      <h3>Executions</h3>
      <ul>
        <li v-for="(exec, i) in executions" :key="i">
          {{ exec.side }}: {{ exec.price }} × {{ exec.amount }}
        </li>
      </ul>
    </div>

    <div>
      <h3>Notes</h3>
      <div v-html="notesHtml"></div>
    </div>
  </div>
</template>
