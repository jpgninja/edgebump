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
    window.location.href = "/dashboard"
  } else {
    console.error(data.error)
  }
}
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-4 w-3xl">
    <input type="text" v-model="form.username" placeholder="Username"
      class="w-full p-3 bg-slate-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition" />
    <input type="password" v-model="form.password" placeholder="Password"
      class="w-full p-3 bg-slate-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition" />
    <button type="submit"
      class="w-full mt-2 px-4 py-3 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-transform">
      Login
    </button>
  </form>
</template>