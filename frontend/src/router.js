// router.js
import { createRouter, createWebHistory } from "vue-router"

import { isLoggedIn, isSuperUser, token, logout } from "./stores/auth"

// Global
import Home from "./views/HomePage.vue"
import Login from "./views/LoginPage.vue"
import LogoutPage from "./views/LogoutPage.vue"
import Register from "./views/RegisterPage.vue"

// Learning Portal.
import LearnPage from "./views/LearnPage.vue"
import EdgeRoadmap from "./views/learn/EdgeRoadmapPage.vue"
import EdgeWarplan from "./views/learn/EdgeWarplanPage.vue"

// User.
import DashboardPage from "./views/DashboardPage.vue"
import SettingsPage from "./views/SettingsPage.vue"

// Accounts.
import AccountPage from "./views/AccountPage.vue"
import NewAccountPage from "./views/NewAccountPage.vue"
import EditAccountPage from "./views/EditAccountPage.vue"
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

// Users.
import UserPage from "./views/UserPage.vue"
import NewUserPage from "./views/NewUserPage.vue"
import EditUserPage from "./views/EditUserPage.vue"
import UsersPage from "./views/UsersPage.vue"

// Public routes (no authentication required)
const publicRoutes = [
  { path: "/", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
  { path: "/logout", name: "logout", component: LogoutPage },
  { path: "/register", name: "register", component: Register }
]

// Learning routes
const learnRoutes = [
  { path: "/learn", name: "learn", component: LearnPage },
  { path: "/learn/edge-roadmap", name: "edge-roadmap", component: EdgeRoadmap },
  { path: "/learn/edge-warplan", name: "edge-warplan", component: EdgeWarplan }
]

// Account routes.
const accountRoutes = [
  { path: "/accounts", name: "accounts", component: AccountsPage, meta: { requiresAuth: true } },
  { path: "/account/:id", name: "account", component: AccountPage, meta: { requiresAuth: true }, props: true },
  { path: "/account/edit", name: "account_create", component: NewAccountPage, meta: { requiresAuth: true } },
  { path: "/account/edit/:id", name: "account_edit", component: EditAccountPage, meta: { requiresAuth: true } }
]

const authRoutes = [
  { path: "/settings", name: "settings", component: SettingsPage, meta: { requiresAuth: true } },
  { path: "/dashboard", name: "dashboard", component: DashboardPage, meta: { requiresAuth: true } }
]

// Pattern-related routes
const patternRoutes = [
  { path: "/patterns", name: "patterns", component: PatternsPage, meta: { requiresAuth: true } },
  { path: "/pattern/:id", name: "pattern", component: PatternPage, meta: { requiresAuth: true }, props: true },
  { path: "/pattern/edit", name: "pattern_create", component: NewPatternPage, meta: { requiresAuth: true } },
  { path: "/pattern/edit/:id", name: "pattern_edit", component: EditPatternPage, meta: { requiresAuth: true } }
]

// Trade-related routes
const tradeRoutes = [
  { path: "/trades", name: "trades", component: TradesPage, meta: { requiresAuth: true } },
  { path: "/trade/:id", name: "trade", component: TradePage, meta: { requiresAuth: true }, props: true },
  { path: "/trade/edit", name: "trade_create", component: NewTradePage, meta: { requiresAuth: true } },
  { path: "/trade/edit/:id", name: "trade_edit", component: EditTradePage, meta: { requiresAuth: true } }
]

// Super-User routes
const superUserRoutes = [
  { path: "/users", name: "users", component: UsersPage, meta: { requiresAuth: true, requiresSuperUser: true } },
  { path: "/users/:id", name: "user", component: UserPage, meta: { requiresAuth: true, requiresSuperUser: true }, props: true },
  { path: "/users/edit", name: "user_create", component: NewUserPage, meta: { requiresAuth: true, requiresSuperUser: true } },
  { path: "/users/edit/:id", name: "user_edit", component: EditUserPage, meta: { requiresAuth: true, requiresSuperUser: true } }
]

// Combine all routes
export const routes = [
  ...publicRoutes,
  ...learnRoutes,
  ...authRoutes,
  ...accountRoutes,
  ...patternRoutes,
  ...tradeRoutes,
  ...superUserRoutes
]

// Create router instance
const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return next("/login")
  }

  if (to.path === "/" && isLoggedIn.value) {
    return next("/dashboard")
  }

  // Superuser guard
  if (to.meta.requiresSuperUser && !isSuperUser.value) {
    return next("/dashboard") // redirect normal users
  }

  next()
})



export default router
