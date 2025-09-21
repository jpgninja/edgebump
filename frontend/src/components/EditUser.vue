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
const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }

// Populate form when trade prop changes
watch(
  () => props.trade,
  async (newUser) => {
    if (newUser?.id) {

      // Fetch full user
      const res = await fetch(`http://localhost:3000/api/users/${newUser.id}`, { headers })
      const resData = await res.json()

      // Defensive check.
      if (!resData || resData.length === 0) {
        return
      }

      // Map API response to form structure.
      const user = resData[0]
      form.value = {
        id: user.id,
        username: user.username ?? "",
        email: user.email ?? "",
      }
    }
  },
  { immediate: true }
)

// Submit form.
const submitForm = async () => {
  saving.value = true
  message.value = ""
  try {
    const userId = form.value.id ?? "new"
    const method = userId === "new" ? "POST" : "PUT"

    const payload = {
      ...form.value
    }

    const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method,
      headers,
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (data.success) {
      message.value = "User saved successfully!"
      // emit saved event to parent
      emit("saved", data.userId)

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

const cancelEditHandler = () => router.push({ name: 'users' })
</script>


<template>
  <div class="max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <h2 class="text-2xl font-bold mb-6">Edit User</h2>

    <div v-if="message" class="mb-4 px-4 py-2 rounded text-sm"
      :class="message.startsWith('Error') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'">
      {{ message }}
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">

      <div class="grid grid-cols-4 gap-4">
        <div>
          <label class="block text-sm mb-1">Username</label>
          <input v-model="form.username" type="text" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"/>
        </div>
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input v-model="form.email" type="text" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"/>
        </div>
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input v-model="form.password" type="password" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"/>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex gap-4">
        <button type="submit" :disabled="saving" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow disabled:opacity-50">
          {{ saving ? 'Saving...' : 'Save User' }}
        </button>
        <button type="button" @click="cancelEditHandler" class="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl shadow">Cancel</button>
      </div>
    </form>
  </div>
</template>


