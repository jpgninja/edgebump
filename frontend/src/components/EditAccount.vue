<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  account: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(["close", "saved"])

// local form state
const form = ref({ ...props.account })

// rehydrate when prop changes (important if editing different accounts)
watch(
  () => props.account,
  (newVal) => {
    form.value = { ...newVal }
  },
  { immediate: true }
)


onMounted(async () => {
  const token = localStorage.getItem("token")
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }

  // Load accounts
  const aRes = await fetch("http://localhost:3000/api/accounts", { headers })
  accounts.value = await aRes.json()

  // Load brokers (for dropdown)
//   const bRes = await fetch("http://localhost:3000/api/brokers", { headers })
//   brokers.value = await bRes.json()
  brokers.value = [
    { id: 1, name: 'Interactive Brokers' },
    { id: 2, name: 'Think Or Swim' },
    { id: 3, name: 'Prop Firm Challenge' }
  ] // --- IGNORE ---
})

const submitForm = async () => {
  const token = localStorage.getItem("token")
  const method = form.value.id ? "PUT" : "POST"
  const url = form.value.id
    ? `http://localhost:3000/api/accounts/${form.value.id}`
    : "http://localhost:3000/api/accounts"

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(form.value)
  })

  emit("saved")
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <h2 class="text-xl font-semibold mb-4">Edit Account</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
    <input type="hidden" v-model="form.id" />

      <!-- Friendly Name -->
      <div>
        <label class="block text-sm mb-1">Account Name</label>
        <input v-model="form.name" type="text"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
      </div>

      <!-- Broker -->
      <div>
        <label class="block text-sm mb-1">Broker</label>
        <select v-model="form.broker_id"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600">
          <option disabled value="">Select broker</option>
          <option v-for="b in brokers" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </div>

      <!-- Account Number -->
      <div>
        <label class="block text-sm mb-1">Account Number</label>
        <input v-model="form.account_number" type="text"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
      </div>

      <!-- Account Type -->
      <div>
        <label class="block text-sm mb-1">Type</label>
        <select v-model="form.account_type"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600">
          <option value="spot">Spot</option>
          <option value="margin">Margin</option>
          <option value="futures">Futures</option>
          <option value="forex">Forex</option>
          <option value="paper_trading">Paper Trading</option>
        </select>
      </div>

      <!-- Starting Balance -->
      <div>
        <label class="block text-sm mb-1">Starting Balance</label>
        <input v-model="form.starting_balance" type="number" step="0.01"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
      </div>

      <!-- Balance -->
       <!--
      <div>
        <label class="block text-sm mb-1">Current Balance</label>
        <input v-model="form.balance" disabled type="number" value="102508.09" step="0.01"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
      </div>
        -->

      <!-- Leverage -->
      <div>
        <label class="block text-sm mb-1">Leverage</label>
        <input v-model="form.leverage" type="number" step="1"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
      </div>

      <!-- Max Risk % -->
      <div>
        <label class="block text-sm mb-1">Max Account Risk % per Trade</label>
        <input v-model="form.max_risk_percent" type="number" step="0.1"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm mb-1">Notes</label>
        <textarea v-model="form.notes"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"></textarea>
      </div>

      <!-- Submit -->
      <button type="submit"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-sm rounded-lg shadow">
        Save Account
      </button>
      <button type="button" class="px-4 ml-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm shadow"
              @click="$emit('close')">
        Cancel
      </button>
    </form>
  </div>
</template>
