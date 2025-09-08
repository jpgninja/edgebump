<script setup>
import { ref, onMounted } from "vue"
import { selectedAccount } from "../stores/account"
import { selectedTrade } from "../stores/trade"
import EditTrade from "./EditTrade.vue"
import OpenTradeProgress from "./OpenTradeProgress.vue"

const form = ref({
  pattern: "",
  direction: "long",
  price: "",
  leverage: "",
  entryNotes: "",
  exitNotes: "",
  postTradeNotes: "",
  signals: [] // store selected signal IDs
})
const showForm = ref(false)
const signals = ref([])
const trades = ref([])

onMounted(async () => {
  const token = localStorage.getItem("token")
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }

  // Fetch trades for the current account.
  await fetchTrades()

  // Fetch available signals for confluences  
  const sRes = await fetch("http://localhost:3000/api/signals", { headers })
  signals.value = await sRes.json()
})

/**
 * Fetches all trades for the current account and updates the trades
 * reactive state.
 */
 const fetchTrades = async () => {
  const token = localStorage.getItem("token")
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
  const tRes = await fetch(`http://localhost:3000/api/trades/${selectedAccount.value.id}`, { headers })
  trades.value = await tRes.json()
}

const editTrade = (trade) => {
  selectedTrade.value = trade
  showForm.value = true
  console.log("Editing trade:", trade)
}

const closeForm = () => {
  showForm.value = false
  selectedTrade.value = null
}

const handleSaved = async () => {
  await fetchTrades()
  closeForm()
}

const deleteTrade = async (id) => {
  if (!confirm("Are you sure you want to delete this trade?")) return


  const token = localStorage.getItem("token")
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }

  const res = await fetch(`http://localhost:3000/api/trades/${id}`, {
    method: "DELETE",
    headers
  })

  if (res.ok) {
    trades.value = trades.value.filter((t) => t.id !== id)
  } else {
    console.error("Failed to delete trade")
  }
}
</script>

<template>
  <div v-if="trades.length" class="max-w-full mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <div v-if="showForm" class="mt-4">
      <EditTrade :trade="selectedTrade" @close="closeForm" @saved="handleSaved" />
    </div>
    <table class="w-full table-auto">
      <thead>
        <tr>
          <th class="text-left p-2 border-b border-gray-600">Date</th>
          <th class="text-left p-2 border-b border-gray-600">Pattern</th>
          <th class="text-left p-2 border-b border-gray-600">Symbol</th>
          <th class="text-left p-2 border-b border-gray-600">Direction</th>
          <th class="text-left p-2 border-b border-gray-600">Entry</th>
          <th class="text-left p-2 border-b border-gray-600">Progress</th>
          <th class="text-left p-2 border-b border-gray-600">Confluences</th>
          <th class="text-left p-2 border-b border-gray-600">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trade in trades" :key="trade.id">
          <td class="p-2 border-b border-gray-600">Nov 13</td>
          <td class="p-2 border-b border-gray-600">{{ trade.pattern_name }}</td>
          <td class="p-2 border-b border-gray-600">{{ trade.symbol }}</td>
          <td class="p-2 border-b border-gray-600">{{ trade.direction }}</td>
          <td class="p-2 border-b border-gray-600">{{ trade.avg_entry }}</td>
          <td class="p-2 border-b border-gray-600">
            <OpenTradeProgress
              :entry="trade.avg_entry"
              :tp="trade.take_profit"
              :sl="trade.stop_loss"
              :currentPrice="trade.avg_entry + (trade.take_profit-trade.avg_entry) * (Math.random() * (0.920 - 0.4200) + 0.4200).toFixed(3) * (trade.direction === 'long' ? 1 : -1)"
            />
          </td>
          <td class="p-2 border-b border-gray-600">
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="signal in trade.signals"
                :key="signal.id"
                class="bg-blue-900 text-blue-100 text-xs font-medium px-2 py-1 rounded-sm"
              >
                {{ signal.name }}
              </li>
            </ul>
          </td>
          <td class="p-2 border-b border-gray-600 space-x-2">
            <button @click="editTrade(trade)" class="px-2 py-1 bg-gray-700 hover:bg-gray-800 rounded text-xs">
              Edit
            </button>
            <button @click="deleteTrade(trade.id)" class="px-2 py-1 bg-red-900 hover:bg-red-800 rounded text-xs">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>