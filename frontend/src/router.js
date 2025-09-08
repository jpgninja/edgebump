// router.js
import { createRouter, createWebHistory } from "vue-router"

// Import views
import Home from "./views/Home.vue"
import Login from "./views/Login.vue"
import Register from "./views/Register.vue"
import DashboardPage from "./views/DashboardPage.vue"
import AccountPage from "./views/AccountPage.vue"
import PatternsPage from "./views/PatternsPage.vue"
import TradesPage from "./views/TradesPage.vue"
import AccountsPage from "./views/AccountsPage.vue"
import LearnPage from "./views/LearnPage.vue"
import EdgeRoadmap from "./views/learn/EdgeRoadmap.vue"
import EdgeWarplan from "./views/learn/EdgeWarplan.vue"

// Define routes
const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/account", component: AccountPage, meta: { requiresAuth: true } },
    { path: "/patterns", component: PatternsPage, meta: { requiresAuth: true } },
    { path: "/trades", component: TradesPage, meta: { requiresAuth: true } },
    { path: "/accounts", component: AccountsPage, meta: { requiresAuth: true } },
    { path: "/dashboard", component: DashboardPage, meta: { requiresAuth: true } },
    { path: "/learn", component: LearnPage },
    { path: "/learn/edge-roadmap", component: EdgeRoadmap },
    { path: "/learn/edge-warplan", component: EdgeWarplan }
]

// Create router instance
const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token")

  if (to.meta.requiresAuth && !isLoggedIn) return next("/login")
  if (isLoggedIn && to.path === "/login") return next("/dashboard")
  
  next()
})


export default router
