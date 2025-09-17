<script setup>
  import { ref, onMounted } from "vue"
  import { RouterLink, RouterView } from "vue-router"
  import { isLoggedIn, token } from "./stores/auth"
  import { selectedAccount } from "./stores/account"
  import { selectAccount } from "./stores/account"
   
  const guestLinks = [
    { to: "/learn", label: "Learn" },
    { to: "/learn/edge-roadmap", label: "Roadmap" },
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" }
  ]
  
  const userLinks = [
    { to: "/learn", label: "Learn" },
    { to: "/trades", label: "Trades" },
    { to: "/patterns", label: "Patterns" },
    { to: "/accounts", label: "Accounts" }
  ]
  
  const links = ref([])
  if (isLoggedIn.value) {
    links.value = userLinks
  } else {
    links.value = guestLinks
  }

  const accounts = ref([])

  onMounted(async () => {
    await fetchAccounts()
  })

  const fetchAccounts = async () => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
    }

    if (isLoggedIn.value) {
      const res = await fetch("http://localhost:3000/api/accounts", { headers })
      accounts.value = await res.json()
    }
  }
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header class="bg-gray-800 shadow p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">
        <RouterLink v-if="!isLoggedIn" to="/" class="">📈 EdgeBump</RouterLink>
        <RouterLink v-else to="/dashboard" class="">📈 EdgeBump</RouterLink>
      </h1>
      <select v-if="isLoggedIn" class="p-2 rounded-md bg-gray-700 border border-gray-600" v-model="selectedAccount.id" @change="selectAccount(accounts.find(a => a.id === selectedAccount.id))">
        <option disabled value="">Select Account</option>
        <option v-for="a in accounts" :key="a.id" :value="a.id" :selected="a.id === selectedAccount.id">{{ a.name }}</option>
      </select>
      <nav class="space-x-4">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to"
          class="hover:underline">
          {{ link.label }}
        </RouterLink>

        <span v-if="isLoggedIn" class="px-1 text-gray-500">|</span>
        <a v-if="isLoggedIn" @click="logout" class="hover:underline">Logout</a>
      </nav>
    </header>

    <!-- Main content -->
    <main class="flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>


<style>
/* Optional global tweaks */
</style>
