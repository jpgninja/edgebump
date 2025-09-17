<script setup>
import { ref, onMounted } from "vue"
import EditPattern from "../EditPattern.vue"
import AddButton from "../buttons/AddButton.vue"
import EditControlButton from "../buttons/EditControlButton.vue"
import DeleteControlButton from "../buttons/DeleteControlButton.vue"

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

const patterns = ref([])
const showForm = ref(false)
const selectedPattern = ref(null)

onMounted(async () => {
  await fetchPatterns()
})

const fetchPatterns = async () => {
  const token = localStorage.getItem("token")
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }

  const pRes = await fetch("http://localhost:3000/api/patterns", { headers })
  patterns.value = await pRes.json()
}


const closeForm = () => {
  showForm.value = false
  selectedPattern.value = null
}

const handleSaved = async () => {
  await fetchPatterns()
  closeForm()
}

const deletePattern = async (id) => {
  if (!confirm("Are you sure you want to delete this pattern?")) return

  const token = localStorage.getItem("token")
  const res = await fetch(`http://localhost:3000/api/patterns/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })

  if (res.ok) {
    patterns.value = patterns.value.filter((p) => p.id !== id)
  } else {
    console.error("Failed to delete pattern")
  }
}

</script>

<template>
  <div v-if="!showForm && patterns.length" class="w-full max-w-[90rem] mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <table class="w-full table-auto text-white">
      <thead class="bg-slate-700/50 backdrop-blur-sm rounded-xl">
        <tr>
          <th class="text-left p-3 border-b border-white/10">Pattern</th>
          <th class="text-left p-3 border-b border-white/10">Confluences</th>
          <th class="text-left p-3 border-b border-white/10 align-center">Win Rate</th>
          <th class="text-left p-3 border-b border-white/10 align-center">Trades</th>
          <th class="text-left p-3 border-b border-white/10 align-center">Expected Return</th>
          <th class="text-left p-3 border-b border-white/10">&nbsp;</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="pattern in patterns" :key="pattern.id" class="hover:bg-slate-700/40 transition-colors rounded-lg">
          <td class="p-3 border-b border-white/10 font-medium">{{ pattern.name }}</td>

          <td class="p-3 border-b border-white/10">
            <ul class="flex flex-wrap gap-2">
              <li v-for="signal in pattern.rules" :key="signal.signal_id"
                class="bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full hover:scale-105 transition-transform">
                {{ signal.signal_name }}
              </li>
            </ul>
          </td>

          <td class="p-3 border-b border-white/10 text-center">
            <span :class="{
              'bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold': pattern.win_rate >= 60,
              'bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold': pattern.win_rate >= 40 && pattern.win_rate < 60,
              'bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold': pattern.win_rate < 40
            }">
              {{ pattern.win_rate ?? '0%' }}
            </span>
          </td>

          <td class="p-3 border-b border-white/10 text-center">{{ pattern.trade_count ?? 0 }}</td>

          <td class="p-3 border-b border-white/10 text-center">
            <span :class="{
              'bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold': pattern.expected_return >= 1,
              'bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold': pattern.expected_return >= 0 && pattern.expected_return < 1,
              'bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold': pattern.expected_return < 0
            }">
              {{ pattern.expected_return ?? 0 }}
            </span>
          </td>

          <td class="p-3 border-b border-white/10">
            <div class="flex justify-center items-center gap-2">
              <EditControlButton :id="pattern.id" routeName="pattern_edit" />
              <DeleteControlButton :id="pattern.id" :onDelete="deletePattern" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!patterns.length" class="p-4 text-white text-center">
      <p>No patterns found. Add your first pattern!</p>
      <AddButton routeName="pattern_create" label="Add Pattern" />
    </div>

  </div>
  <div v-if="showForm" class="mt-4">
    <EditPattern :pattern="selectedPattern" @close="closeForm" @saved="handleSaved" />
  </div>
</template>