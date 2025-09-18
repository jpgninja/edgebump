<script setup>
import { ref, onMounted } from "vue"
import EditAccount from "../EditAccount.vue"
import EditControlButton from "../buttons/EditControlButton.vue";
import DeleteControlButton from "../buttons/DeleteControlButton.vue";

import { selectAccount, selectedAccount } from "../../stores/account.js"
import { token } from "../../stores/auth.js"

const accounts = ref([])
const showForm = ref(false)
const currentEditAccount = ref(null)
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token.value}`
}

onMounted(async () => {
  await fetchAccounts()
})

const fetchAccounts = async () => {
  const res = await fetch("http://localhost:3000/api/accounts", { headers })
  accounts.value = await res.json()
}

const handleSaved = async () => {
  await fetchAccounts()
  closeForm()
}

const deleteAccount = async (id) => {
  if (!confirm("Are you sure you want to delete this account?")) return

  const res = await fetch(`http://localhost:3000/api/accounts/${id}`, {
    method: "DELETE",
    headers: headers
  })

  if (res.ok) {
    accounts.value = accounts.value.filter((a) => a.id !== id)
  } else {
    console.error("Failed to delete account")
  }
}

const selectAccountButtonClicked = async (account) => {
  console.log("Selecting account:", account)
  selectAccount(account)
}
</script>

<template>
  <div v-if="!showForm && accounts.length" class="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <table class="w-full">
      <thead>
        <tr>
          <th class="text-left p-2 border-b border-gray-600">Name</th>
          <th class="text-left p-2 border-b border-gray-600">Starting Balance</th>
          <th class="text-left p-2 border-b border-gray-600">Balance</th>
          <th class="text-left p-2 border-b border-gray-600">Change</th>
          <th class="text-left p-2 border-b border-gray-600"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in accounts" :key="account.id" :class="{ 'bg-gray-700': account.id === selectedAccount.id }">
          <td class="p-2 border-b border-gray-600">{{ account.name }}</td>
          <td class="p-2 border-b border-gray-600">{{ account.starting_balance }}</td>
          <td class="p-2 border-b border-gray-600">{{ account.balance }}</td>
          <td class="p-2 border-b border-gray-600">{{ account.balance - account.starting_balance }}</td>
          <td class="p-3 border-b border-white/10">
            <div class="flex justify-center items-center gap-2">
              <button v-if="account.id !== selectedAccount.id" @click="selectAccountButtonClicked(account)" class="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">
                Select
              </button>
              <EditControlButton :id="account.id" routeName="account_edit" />
              <DeleteControlButton :id="account.id" :onDelete="deleteAccount" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="showForm" class="mt-4">
    <EditAccount :account="currentEditAccount" @saved="handleSaved" />
  </div>
</template>
