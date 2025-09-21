<script setup>
import { computed } from "vue"
import { useTradeBuilder } from "../composables/useTradeBuilder"

const { form } = useTradeBuilder()

const addExecution = (side, price = "", amount = "") => {
  form.executions.push({ side, price: Number(price), amount: Number(amount), pnl: null })
}

const removeExecution = (index) => form.executions.splice(index, 1)

// Computed values
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
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-3xl font-bold">{{ form.ticker }} {{  form.pattern_name }}</h2>

    <!-- Current Price -->
    <div class="mb-4">
      <span class="block text-sm mb-1">Current Price:</span>
      <span class="p-2 my-2 inline-block rounded bg-gray-900 border border-gray-900">
        {{ form.executions.length ? form.executions[form.executions.length-1].price : 0 }}
      </span>
    </div>

    <!-- Executions -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Executions</h3>
      <div v-for="(exec, index) in form.executions" :key="index" class="grid grid-cols-4 gap-4 mb-2 items-end">
        <div>
          <label class="block text-sm mb-1">Side</label>
          <select v-model="exec.side" class="w-full p-2 rounded bg-gray-700 border border-gray-600">
            <option value="entry">Entry</option>
            <option value="exit">Exit</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1">Price</label>
          <input v-model.number="exec.price" type="number" step="0.01" class="w-full p-2 rounded bg-gray-700 border border-gray-600"/>
        </div>
        <div>
          <label class="block text-sm mb-1">Amount</label>
          <input v-model.number="exec.amount" type="number" step="0.01" class="w-full p-2 rounded bg-gray-700 border border-gray-600"/>
        </div>
        <div class="flex gap-2">
          <button type="button" @click="removeExecution(index)" class="px-2 py-1 bg-red-600 hover:bg-red-700 rounded">×</button>
        </div>
      </div>

      <div class="flex gap-2">
        <button type="button" @click="addExecution('entry')" class="px-3 py-1 bg-green-700 hover:bg-green-800 text-sm rounded">+ Entry</button>
        <button type="button" @click="addExecution('exit')" class="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-sm rounded">+ Exit</button>
      </div>
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-sm mb-1">Notes</label>
      <textarea v-model="form.notes" rows="3" class="w-full p-2 rounded bg-gray-700 border border-gray-600"></textarea>
    </div>
  </div>
</template>
