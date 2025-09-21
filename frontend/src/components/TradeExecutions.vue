<script setup>
import { useTradeBuilder } from "../composables/useTradeBuilder"
import { computed } from "vue"

// Composables
const { form } = useTradeBuilder()

// Add execution
const addExecution = (side) => {
  form.executions.push({ side, price: "", amount: "", pnl: null })
}

// Remove execution
const removeExecution = (index) => {
  form.executions.splice(index, 1)
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h3>Executions</h3>
      <div v-for="(exec, i) in form.executions" :key="i" class="grid grid-cols-4 gap-2 mb-2">
        <select v-model="exec.side">
          <option value="entry">Entry</option>
          <option value="exit">Exit</option>
        </select>
        <input v-model="exec.price" type="number" step="0.01" placeholder="Price"/>
        <input v-model="exec.amount" type="number" step="0.01" placeholder="Amount"/>
        <button @click="removeExecution(i)">×</button>
      </div>
      <button @click="addExecution('entry')">+ Entry</button>
      <button @click="addExecution('exit')">+ Exit</button>
    </div>
    <div>
      <label></label>
      <textarea v-model="form.notes" rows="3"></textarea>
    </div>
  </div>
</template>
