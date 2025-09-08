<script setup>
import { ref, onMounted } from "vue"
import { login } from "../stores/auth.js"

const form = ref({ username: "", password: "" })

const submitForm = async () => {
  const res = await fetch(`http://localhost:3000/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form.value)
  })
  const data = await res.json()
  if ((data.token)) {
    login(data.token)
    console.log("User logged in")
  } else {
    console.error(data.error)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <form action="" @submit.prevent="submitForm" class="space-y-4">
        <input type="text" v-model="form.username" value="admin" placeholder="Username" class="w-full p-2 bg-gray-700 border border-gray-600 rounded" />
        <input type="password" v-model="form.password" placeholder="Password" class="w-full p-2 bg-gray-700 border border-gray-600 rounded" />
    </form>
      <button class="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow"
              @click="submitForm">
        Login
      </button>
  </div>
</template>