<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { isLoggedIn } from "../stores/auth.js"

const router = useRouter()

// Links based on user status
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

const links = computed(() => isLoggedIn.value ? userLinks : guestLinks)

// Easter egg for scroll reward
const showReward = ref(false)
onMounted(() => {
  const footer = document.querySelector("#app-footer")
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) showReward.value = true
  }, { threshold: 0.5 })
  if (footer) observer.observe(footer)
})
</script>

<template>
  <footer id="app-footer" class="relative z-10 py-8 mt-auto bg-gray-900 text-gray-400 border-t border-white/10">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <!-- Navigation Links -->
      <nav class="flex flex-wrap justify-center md:justify-start gap-4">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-sm hover:text-white transition-colors"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <!-- Scroll Reward / Easter Egg -->
      <div v-if="showReward" class="text-green-400 text-sm font-semibold animate-pulse">
        🎉 You made it to the bottom! Keep exploring.
      </div>

      <!-- Copyright -->
      <div class="text-xs text-gray-500 mt-2 md:mt-0">
        © 2025 EdgeBump. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Optional: subtle background gradient for visual depth */
#app-footer {
  background: linear-gradient(180deg, #111827 0%, #1f2937 100%);
}
</style>
