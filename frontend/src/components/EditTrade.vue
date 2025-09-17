<script setup>
import { ref, watch, onMounted } from "vue"
import Multiselect from "vue-multiselect"
import { selectedAccount } from "../stores/account"
import { token } from "../stores/auth"

const props = defineProps({
  trade: Object
})

// Define emits.
const emit = defineEmits(["saved", "close"])

const form = ref({
  id: null,
  pattern_id: null,
  direction: "long",
  ticker: "",
  timeframe: "",
  entry_plan: "",
  stop_loss: "",
  take_profit: "",
  leverage: "",
  account_id: null,        // add account selector later
  notes: "",
  signals: [],             // { signal_id, type, order, signal_value }
  executions: []           // { side, price, amount, pnl }
})

const saving = ref(false)
const message = ref("")
const patterns = ref([])
const signals = ref([])

// Populate form when trade prop changes
watch(
  () => props.trade,
  async (newTrade) => {
    if (newTrade?.id) {
      const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }

      // Fetch full trade with signals + executions
      const res = await fetch(`http://localhost:3000/api/trades/${newTrade.id}`, { headers })
      const resData = await res.json()

      // Defensive check.
      if (!resData || resData.length === 0) {
        return
      }

      // Map API response to form structure.
      const tradeData = resData[0]
      form.value = {
        id: tradeData.id,
        pattern_id: tradeData.pattern_id ?? null,
        direction: tradeData.direction ?? "long",
        ticker: tradeData.ticker ?? "",
        timeframe: tradeData.timeframe ?? "",
        entry_plan: tradeData.entry_plan ?? "",
        stop_loss: tradeData.stop_loss ?? "",
        take_profit: tradeData.take_profit ?? "",
        leverage: tradeData.leverage ?? "",
        account_id: tradeData.account_id ?? selectedAccount.value?.id ?? null,
        notes: tradeData.notes ?? "",
        signals: (tradeData.signals ?? []).map(s => ({
          ...s,
          name: s.name ?? s.signal_value ?? s.signal_id
        })),
        executions: tradeData.executions?.length
          ? tradeData.executions
          : [{ side: "entry", price: "", amount: "", pnl: null }]
      }
    }
  },
  { immediate: true }
)


onMounted(async () => {
  const token = localStorage.getItem("token")
  const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }

  patterns.value = await (await fetch("http://localhost:3000/api/patterns", { headers })).json()
  signals.value = await (await fetch("http://localhost:3000/api/signals", { headers })).json()

  // If no executions exist, add a default entry
  if (form.value.executions.length === 0) addExecution('entry')
})

// Add a new execution
const addExecution = (side, price = "", amount = "") => {
  form.value.executions.push({ side, price, amount, pnl: null })
}

// Remove an execution
const removeExecution = (index) => form.value.executions.splice(index, 1)

// Submit form.
const submitForm = async () => {
  saving.value = true
  message.value = ""
  try {
    const token = localStorage.getItem("token")
    const tradeId = form.value.id ?? "new"
    const method = tradeId === "new" ? "POST" : "PUT"

    const payload = {
      ...form.value,
      account_id: selectedAccount.value.id,
      executions: form.value.executions.map((e, i) => ({
        side: e.side ?? "entry",
        price: e.price ?? null,
        amount: e.amount ?? null,
        pnl: e.pnl ?? null,
        order: i
      })),
      signals: form.value.signals.map((s, i) => ({
        signal_id: s.signal_id ?? s.id ?? s,
        type: s.type ?? "entry",
        order: s.order ?? i,
        signal_value: s.signal_value ?? null
      }))
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    } 
    const res = await fetch(`http://localhost:3000/api/trades/${tradeId}`, {
      method,
      headers,
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (data.success) {
      message.value = "Trade saved successfully!"
      // emit saved event to parent
      emit("saved", data.tradeId)

      // auto-close form after short delay
      setTimeout(() => emit("close"), 1000)
    } else {
      message.value = `Error: ${data.error || "Unknown error"}`
    }
  } catch (err) {
    console.error(err)
    message.value = `Error: ${err.message}`
  } finally {
    saving.value = false
  }
}
</script>


<template>
  <div class="max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <h2 class="text-2xl font-bold mb-6">Edit Trade</h2>

    <form @submit.prevent="submitForm" class="space-y-6">

      <!-- Top row: Pattern & Account -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1">Pattern</label>
          <select v-model="form.pattern_id" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600">
            <option value="" disabled>Select a pattern</option>
            <option v-for="p in patterns" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1">Ticker</label>
          <input v-model="form.ticker" type="text" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
        </div>
      </div>

      <!-- Pair & Direction -->
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

      <!-- Price & leverage -->
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
          <input disabled="true" :value="((form.take_profit - form.entry_plan) / (form.entry_plan - form.stop_loss)).toFixed(2)" type="number" step="0.01" class="w-full p-2 rounded-lg bg-gray-800"/>
        </div>
      </div>

      <!-- Signals / Confluences -->
      <div>
        <label class="block text-sm mb-1">Signals / Confluences</label>
        <multiselect
          v-model="form.signals"
          :options="signals"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Search and add signals"
          label="name"
          track-by="id"
          :taggable="true"
        />
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
        <button type="button" @click="addExecution('entry')" class="px-3 py-1 bg-green-700 hover:bg-green-800 text-sm rounded mr-2">+ Entry</button>
        <button type="button" @click="addExecution('exit')" class="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-sm rounded">+ Exit</button>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm mb-1">Notes</label>
        <textarea v-model="form.notes" rows="3" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"></textarea>
      </div>

      <div v-if="message" class="mb-4 px-4 py-2 rounded text-sm"
        :class="message.startsWith('Error') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'">
        {{ message }}
      </div>
      <div v-if="message" class="mb-4 p-2 rounded text-sm"
        :class="message.startsWith('Error') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'">
        {{ message }}
      </div>

      <!-- Submit -->
      <div class="flex gap-4">
        <button type="submit" :disabled="saving" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow disabled:opacity-50">
          {{ saving ? 'Saving...' : 'Save Trade' }}
        </button>
        <button type="button" @click="$emit('close')" class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow">Cancel</button>
      </div>
    </form>
  </div>
</template>


