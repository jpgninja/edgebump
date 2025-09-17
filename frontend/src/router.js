// router.js
import { createRouter, createWebHistory } from "vue-router"

import { isLoggedIn, token, logout } from "./stores/auth"

// Import views
import Home from "./views/Home.vue"
import Login from "./views/Login.vue"
import Register from "./views/Register.vue"
import DashboardPage from "./views/DashboardPage.vue"
import AccountPage from "./views/AccountPage.vue"
import PatternsPage from "./views/PatternsPage.vue"
import PatternPage from "./views/PatternPage.vue"
import TradesPage from "./views/TradesPage.vue"
import AccountsPage from "./views/AccountsPage.vue"
import LearnPage from "./views/LearnPage.vue"
import EdgeRoadmap from "./views/learn/EdgeRoadmap.vue"
import EdgeWarplan from "./views/learn/EdgeWarplan.vue"
import NewPatternPage from "./views/NewPatternPage.vue"
import EditPatternPage from "./views/EditPatternPage.vue"

// Define routes
const routes = [
    { path: "/", name: "home", component: Home },
    { path: "/login", name: "login", component: Login },
    { path: "/register", namecomponent: Register },
    { path: "/account", name: "account", component: AccountPage, meta: { requiresAuth: true },},
    { path: "/patterns", name: "patterns", component: PatternsPage, meta: { requiresAuth: true } },
    { path: "/pattern/:id", name: "pattern", component: PatternPage, meta: { requiresAuth: true }, props: true },
    { path: "/pattern/edit", name: "pattern_new", component: NewPatternPage, meta: { requiresAuth: true } },
    { path: "/pattern/edit/:id", name: "pattern_edit", component: EditPatternPage, meta: { requiresAuth: true } },
    { path: "/trades", name: "trades", component: TradesPage, meta: { requiresAuth: true } },
    { path: "/accounts", name: "accounts", component: AccountsPage, meta: { requiresAuth: true } },
    { path: "/dashboard", name: "dashboard", component: DashboardPage, meta: { requiresAuth: true } },
    { path: "/learn", name: "learn", component: LearnPage },
    { path: "/learn/edge-roadmap", name: "edge-roadmap", component: EdgeRoadmap },
    { path: "/learn/edge-warplan", name: "edge-warplan", component: EdgeWarplan }
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
