<script setup>
import { token } from '../stores/auth.js'
import { ref, reactive, onMounted } from "vue";

const trade = ref({})
const showEdit = ref(false)
const saving = ref(false)
const message = ref("")

const props = defineProps({ id: String })

// Fetch trade data
onMounted(async () => {
  const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
  const res = await fetch(`http://localhost:3000/api/trades/${props.id}`, { headers })
  trade.value = await res.json()

  // initialize form
  Object.assign(form, {
    pattern_id: trade.value.pattern_id || '',
    ticker: trade.value.ticker || '',
    timeframe: trade.value.timeframe || '',
    direction: trade.value.direction || 'long',
    leverage: trade.value.leverage || 1,
    entry_plan: trade.value.entry_plan || 0,
    stop_loss: trade.value.stop_loss || 0,
    take_profit: trade.value.take_profit || 0,
    signals: trade.value.signals || [],
    executions: trade.value.executions || [],
    notes: trade.value.notes || ''
  })
})

const form = reactive({
  pattern_id: '',
  ticker: '',
  timeframe: '',
  direction: 'long',
  leverage: 1,
  entry_plan: 0,
  stop_loss: 0,
  take_profit: 0,
  signals: [],
  executions: [],
  notes: ''
})

// Signals and executions management
function addExecution(type = 'entry') {
  form.executions.push({ side: type, price: 0, amount: 0 })
}
function removeExecution(index) {
  form.executions.splice(index, 1)
}

// Save trade
async function submitForm() {
  saving.value = true
  try {
    const res = await fetch(`http://localhost:3000/api/trades/${props.id}`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` },
      body: JSON.stringify(form)
    })
    if (!res.ok) throw new Error("Failed to save trade")
    trade.value = await res.json()
    message.value = "Trade saved successfully!"
    showEdit.value = false
  } catch (err) {
    message.value = "Error saving trade: " + err.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
<div class="max-w-6xl mx-auto p-6 space-y-8">

  <!-- Trade Header -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl md:text-4xl font-extrabold gradient-text">
      {{ trade.ticker?.toUpperCase() }} — {{ trade.pattern_name }}
    </h1>
    <button @click="showEdit = !showEdit"
      class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform">
      {{ showEdit ? 'Close Editor' : 'Edit Trade' }}
    </button>
  </div>

  <!-- Inline Edit Panel -->
  <transition name="fade-slide">
    <div v-if="showEdit" class="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg p-6 space-y-6 hover:scale-[1.01] transition-transform">

      <form @submit.prevent="submitForm" class="space-y-6">

        <!-- Top row: Pattern & Ticker -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Pattern</label>
            <input v-model="form.pattern_id" type="text" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
          </div>
          <div>
            <label class="block text-sm mb-1">Ticker</label>
            <input v-model="form.ticker" type="text" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
          </div>
        </div>

        <!-- Timeframe / Direction / Leverage -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm mb-1">Timeframe</label>
            <input v-model="form.timeframe" type="text" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
          </div>
          <div>
            <label class="block text-sm mb-1">Direction</label>
            <select v-model="form.direction" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600">
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Leverage</label>
            <input v-model="form.leverage" type="number" step="1" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"/>
          </div>
        </div>

        <!-- Entry / SL / TP / R:R -->
        <div class="grid grid-cols-4 gap-4">
          <div>
            <label class="block text-sm mb-1">Entry Plan</label>
            <input v-model="form.entry_plan" type="number" step="0.01" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"/>
          </div>
          <div>
            <label class="block text-sm mb-1">Stop Loss</label>
            <input v-model="form.stop_loss" type="number" step="0.01" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"/>
          </div>
          <div>
            <label class="block text-sm mb-1">Take Profit</label>
            <input v-model="form.take_profit" type="number" step="0.01" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"/>
          </div>
          <div>
            <span class="block text-sm mb-1">R:R</span>
            <input disabled type="number" :value="((form.take_profit - form.entry_plan) / (form.entry_plan - form.stop_loss)).toFixed(2)" class="w-full p-2 rounded-lg bg-gray-800"/>
          </div>
        </div>

        <!-- Signals / Confluences -->
        <div>
          <label class="block text-sm mb-1">Signals / Confluences</label>
          <div class="flex flex-wrap gap-2">
            <span v-for="signal in form.signals" :key="signal.id" class="bg-blue-900 text-blue-100 text-xs font-medium px-2 py-1 rounded-sm">{{ signal.name }}</span>
            <button type="button" class="px-2 py-1 bg-green-700 text-white rounded hover:bg-green-800 transition" @click="form.signals.push({id: Date.now(), name: 'New Signal'})">+ Add</button>
          </div>
        </div>

        <!-- Executions -->
        <div>
          <h3 class="text-lg font-semibold mb-2">Executions</h3>
          <div v-for="(exec, index) in form.executions" :key="index" class="grid grid-cols-4 gap-4 mb-2 items-end">
            <div>
              <label class="block text-sm mb-1">Side</label>
              <select v-model="exec.side" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600">
                <option value="entry">Entry</option>
                <option value="exit">Exit</option>
              </select>
            </div>
            <div>
              <label class="block text-sm mb-1">Price</label>
              <input v-model="exec.price" type="number" step="0.01" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"/>
            </div>
            <div>
              <label class="block text-sm mb-1">Amount</label>
              <input v-model="exec.amount" type="number" step="0.01" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"/>
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
          <textarea v-model="form.notes" rows="3" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"></textarea>
        </div>

        <!-- Messages -->
        <div v-if="message" class="px-4 py-2 rounded text-sm" :class="message.startsWith('Error') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'">
          {{ message }}
        </div>

        <!-- Submit / Cancel -->
        <div class="flex gap-4">
          <button type="submit" :disabled="saving" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow disabled:opacity-50 transition">
            {{ saving ? 'Saving...' : 'Save Trade' }}
          </button>
          <button type="button" @click="showEdit = false" class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow transition">Cancel</button>
        </div>

      </form>
    </div>
  </transition>

</div>
</template>

<style>
.gradient-text {
  background: linear-gradient(to right, #8b5cf6, #ec4899, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
