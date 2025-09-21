<script setup>
import { ref, computed, watch, onMounted } from "vue"
import Multiselect from "vue-multiselect"
import { useTradeBuilder } from "../composables/useTradeBuilder"
import { token } from "../stores/auth"
import TradePreview from "./TradePreview.vue"

const { form } = useTradeBuilder()

const patterns = ref([])
const signals = ref([])
const rules = ref([])
const positionSize = ref(1) // default units
const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }

onMounted(async () => {
  patterns.value = await (await fetch("http://localhost:3000/api/patterns", { headers })).json()
  signals.value = await (await fetch("http://localhost:3000/api/signals", { headers })).json()
})

// Watch for entry_plan and take_profit changes.
watch([() => form.entry_plan, () => form.take_profit], () => {
  form.direction = (form.entry_plan && form.take_profit)
    ? (form.take_profit > form.entry_plan ? 'long' : 'short')
    : null
})

// Watch for pattern change.
watch(() => form.pattern_id, async (newId) => {
  if (!newId) { rules.value = []; return }
  const pattern = await (await fetch(`http://localhost:3000/api/patterns/${newId}`, { headers })).json()
  rules.value = pattern.rules.map(r => ({ name: r, checked: false })) // add checkbox state
})


// Computed values
const riskPerUnit = computed(() => Math.abs(form.entry_plan - form.stop_loss))
const rewardPerUnit = computed(() => Math.abs(form.take_profit - form.entry_plan))
const potentialGain = computed(() => rewardPerUnit.value * positionSize.value)
const potentialLoss = computed(() => riskPerUnit.value * positionSize.value)
const rrRatio = computed(() => riskPerUnit.value ? (rewardPerUnit.value / riskPerUnit.value).toFixed(1) : 0)

const direction = computed(() => {
  if (!form.entry_plan || !form.take_profit) return null
  return form.take_profit > form.entry_plan ? 'long' : 'short'
})

</script>

<template>
  <div class="space-y-4">
    <h2 class="text-3xl font-bold">Plan Your Trade</h2>

    <!-- Pattern & Ticker -->
    <div>
      <label class="block text-sm mb-1">Pattern</label>
      <select v-model="form.pattern_id" class="w-full p-2 rounded bg-gray-700 border border-gray-600">
        <option value="" disabled>Select a pattern</option>
        <option v-for="p in patterns" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
    </div>
    <div class="grid grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block text-sm mb-1">Ticker</label>
        <input v-model="form.ticker" type="text" class="w-full p-2 rounded bg-gray-700 border border-gray-600" />
      </div>

      <div>
        <label class="block text-sm mb-1">Direction</label>
        <div class="inline-block px-6 py-2 rounded-lg text-white font-semibold" :class="{
          'bg-green-600': form.take_profit > form.entry_plan,
          'bg-red-600': form.take_profit < form.entry_plan
        }">
          {{ form.direction === 'long' ? 'Long' : form.direction === 'short' ? 'Short' : '' }}
        </div>
      </div>
    </div>

    <!-- Signals / Confluences -->
    <div>
      <label class="block text-sm mb-1">Signals</label>
      <Multiselect v-model="form.signals" :options="signals" :multiple="true" :close-on-select="false"
        :clear-on-select="false" :preserve-search="true" placeholder="Search and add signals" label="name" track-by="id"
        :taggable="true" />
    </div>

    <!-- Rules -->
    <div>
      <div v-for="(rule, i) in rules" :key="rule.id" class="flex items-center gap-2">
        <input type="checkbox" v-model="rule.checked" />
        <span>{{ rule.name }}</span>
      </div>
    </div>

    <!-- Entry/SL/TP & R:R -->
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div>
        <label class="block text-sm mb-1 text-red-400">Stop Loss</label>
        <input v-model="form.stop_loss" type="number" step="0.01"
          class="w-full p-2 rounded bg-gray-700 border border-gray-600" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-cool-gray-400">Entry Price</label>
        <input v-model="form.entry_plan" type="number" step="0.01"
          class="w-full p-2 rounded bg-gray-700 border border-gray-600" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-green-400">Take Profit</label>
        <input v-model="form.take_profit" type="number" step="0.01"
          class="w-full p-2 rounded bg-gray-700 border border-gray-600" />
      </div>
    </div>

    <!-- Position Size -->
    <div class="grid grid-cols-2 gap-4 mt-2">
      <div>
        <label class="block text-sm mb-1">Position Size</label>
        <input v-model="positionSize" type="number" step="0.01"
          class="w-full p-2 rounded bg-gray-700 border border-gray-600" />
      </div>
      <div>
        <label class="block text-sm mb-2">&nbsp;</label>
        <span
          class="p-3 rounded-sm mt-2 ml-4 text-sm text-gray-100 shadow bg-gray-600 hover:bg-gray-700 cursor-pointer">
          Half
        </span>
        <span
          class="p-3 rounded-sm mt-2 ml-4 text-sm text-gray-100 shadow bg-gray-600 hover:bg-gray-700 cursor-pointer">
          Full
        </span>
      </div>
    </div>
  </div>
</template>
