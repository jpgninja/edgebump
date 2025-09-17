// router.js
import { createRouter, createWebHistory } from "vue-router"

import { isLoggedIn, token, logout } from "./stores/auth"

// Global
import Home from "./views/Home.vue"
import Login from "./views/Login.vue"
import Register from "./views/Register.vue"


// Learning Portal.
import LearnPage from "./views/LearnPage.vue"
import EdgeRoadmap from "./views/learn/EdgeRoadmap.vue"
import EdgeWarplan from "./views/learn/EdgeWarplan.vue"

// User.
import DashboardPage from "./views/DashboardPage.vue"
import AccountPage from "./views/AccountPage.vue"
import AccountsPage from "./views/AccountsPage.vue"

// Patterns.
import PatternPage from "./views/PatternPage.vue"
import NewPatternPage from "./views/NewPatternPage.vue"
import EditPatternPage from "./views/EditPatternPage.vue"
import PatternsPage from "./views/PatternsPage.vue"

// Trades.
import TradePage from "./views/TradePage.vue"
import NewTradePage from "./views/NewTradePage.vue"
import EditTradePage from "./views/EditTradePage.vue"
import TradesPage from "./views/TradesPage.vue"

// Public routes (no authentication required)
const publicRoutes = [
  { path: "/", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register }
]

// Learning routes
const learnRoutes = [
  { path: "/learn", name: "learn", component: LearnPage },
  { path: "/learn/edge-roadmap", name: "edge-roadmap", component: EdgeRoadmap },
  { path: "/learn/edge-warplan", name: "edge-warplan", component: EdgeWarplan }
]

// Authenticated routes (requires login)
const authRoutes = [
  { path: "/account", name: "account", component: AccountPage, meta: { requiresAuth: true } },
  { path: "/accounts", name: "accounts", component: AccountsPage, meta: { requiresAuth: true } },
  { path: "/dashboard", name: "dashboard", component: DashboardPage, meta: { requiresAuth: true } }
]

// Pattern-related routes
const patternRoutes = [
  { path: "/patterns", name: "patterns", component: PatternsPage, meta: { requiresAuth: true } },
  { path: "/pattern/:id", name: "pattern", component: PatternPage, meta: { requiresAuth: true }, props: true },
  { path: "/pattern/edit", name: "pattern_new", component: NewPatternPage, meta: { requiresAuth: true } },
  { path: "/pattern/edit/:id", name: "pattern_edit", component: EditPatternPage, meta: { requiresAuth: true } }
]

// Trade-related routes
const tradeRoutes = [
  { path: "/trades", name: "trades", component: TradesPage, meta: { requiresAuth: true } },
  { path: "/trade/:id", name: "trade", component: TradePage, meta: { requiresAuth: true }, props: true },
  { path: "/trade/edit", name: "trade_new", component: NewTradePage, meta: { requiresAuth: true } },
  { path: "/trade/edit/:id", name: "trade_edit", component: EditTradePage, meta: { requiresAuth: true } }
]

// Combine all routes
export const routes = [
  ...publicRoutes,
  ...learnRoutes,
  ...authRoutes,
  ...patternRoutes,
  ...tradeRoutes
]

// Create router instance
const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return next("/login")
  }

  if (to.path === "/" && isLoggedIn.value) {
    return next("/dashboard")
  }

  next()
})


export default router
