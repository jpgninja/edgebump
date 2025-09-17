<script setup>
  import { ref, onMounted } from "vue"
  import { RouterLink, RouterView } from "vue-router"
  import { isLoggedIn, token } from "./stores/auth"
  import { selectedAccount } from "./stores/account"
  import { selectAccount } from "./stores/account"
  
  import Footer from "./components/Footer.vue"
   
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
  <div class="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex flex-col overflow-hidden">
    <!-- Background blobs -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div class="absolute -bottom-28 -right-20 w-[520px] h-[520px] bg-gradient-to-r from-purple-700 to-indigo-500 rounded-full blur-3xl opacity-25 animate-bounce"></div>
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-2xl opacity-12 animate-[float_8s_ease-in-out_infinite]"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 bg-slate-800/60 backdrop-blur-lg border-b border-white/10 shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <!-- Logo -->
      <h1 class="text-2xl md:text-3xl font-extrabold gradient-text">
        <RouterLink v-if="!isLoggedIn" to="/" class="hover:scale-105 transition-transform">📈 EdgeBump</RouterLink>
        <RouterLink v-else to="/dashboard" class="hover:scale-105 transition-transform">📈 EdgeBump</RouterLink>
      </h1>

      <!-- Nav + Accounts -->
      <div class="flex items-center gap-4 flex-wrap">
        <!-- Accounts dropdown -->
        <select
          v-if="isLoggedIn"
          class="p-2 rounded-lg bg-slate-700 border border-gray-600 text-white hover:scale-105 transition-transform"
          v-model="selectedAccount.id"
          @change="selectAccount(accounts.find(a => a.id === selectedAccount.id))"
        >
          <option disabled value="">Select Account</option>
          <option v-for="a in accounts" :key="a.id" :value="a.id" :selected="a.id === selectedAccount.id">{{ a.name }}</option>
        </select>
        <nav class="flex items-center gap-4 flex-wrap">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="px-3 py-1 rounded-lg hover:bg-indigo-500/20 transition flex items-center"
          >
            {{ link.label }}
          </RouterLink>

          <span v-if="isLoggedIn" class="px-1 text-gray-500">|</span>

          <RouterLink
            v-if="isLoggedIn"
            to="/logout"
            class="px-3 py-1 rounded-lg hover:bg-red-500/20 transition flex items-center justify-center"
          >
            Logout
          </RouterLink>

        </nav>

      </div>
    </header>


    <!-- Main content -->
    <main class="flex-1 p-6 relative z-10">
      <RouterView />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style>
/* Optional gradient text helper */
.gradient-text {
  background: linear-gradient(to right, #8b5cf6, #ec4899, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>