<script setup>
import { ref, onMounted } from "vue"
import EditPattern from "./EditPattern.vue"

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


const editPattern = (pattern) => {
  selectedPattern.value = pattern
  showForm.value = true
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
  <div v-if="!showForm && patterns.length" class="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <table class="w-full">
      <thead>
        <tr>
          <th class="text-left p-2 border-b border-gray-600">Pattern</th>
          <th class="text-left p-2 border-b border-gray-600">Confluences</th>
          <th class="text-left p-2 border-b border-gray-600">Win Rate</th>
          <th class="text-left p-2 border-b border-gray-600"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pattern in patterns" :key="pattern.id">
          <td class="p-2 border-b border-gray-600">{{ pattern.name }}</td>
          <td class="p-2 border-b border-gray-600">pattern confluences</td>
          <td class="p-2 border-b border-gray-600">34%</td>
          <td class="p-2 border-b border-gray-600 space-x-2">
            <button @click="editPattern(pattern)" class="px-2 py-1 bg-blue-900 hover:bg-blue-800 rounded text-sm">
              Edit
            </button>
            <button @click="deletePattern(pattern.id)" class="px-2 py-1 bg-red-900 hover:bg-red-800 rounded text-sm">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="showForm" class="mt-4">
    <EditPattern :pattern="selectedPattern" @close="closeForm" @saved="handleSaved" />
  </div>
</template>