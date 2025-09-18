<script setup>
import { ref, onMounted } from "vue"
import { token } from "../stores/auth.js";

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

const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
const submitForm = async () => {
  await fetch(`http://localhost:3000/auth/register`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(form.value)
  })
  console.log("User registered")
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <form action="" @submit.prevent="submitForm" class="space-y-4">
        <input type="text" v-model="form.username" placeholder="Username" class="w-full p-2 bg-gray-700 border border-gray-600 rounded" />
        <input type="password" v-model="form.password" placeholder="Password" class="w-full p-2 bg-gray-700 border border-gray-600 rounded" />
    </form>
      <button class="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow"
              @click="submitForm">
        Register
      </button>
  </div>
</template>