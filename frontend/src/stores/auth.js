// src/stores/auth.js
import { ref } from "vue"
import router from "../router"

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(base64))
    return payload
  } catch (e) {
    return null
  }
}

// Boolean check if logged in user is a Super Admin.
function isSuperUserToken(token) {
  const payload = parseJwt(token)
  if (!payload || !payload.type) {
    return false
  }
  return payload.type === 'superadmin'
}

// Boolean check if session token is valid.
function isTokenValid(token) {
  const payload = parseJwt(token)
  if (!payload || !payload.exp) {
    return false
  }
  const now = Math.floor(Date.now() / 1000)
  return payload.exp > now
}

// Login method.
export function login(newToken) {
  localStorage.setItem("token", newToken)
  token.value = newToken
  isLoggedIn.value = true
  router.push("/dashboard")
}

// Logout method.
export function logout() {
  localStorage.removeItem("token")
  token.value = null
  isLoggedIn.value = false
  router.push("/login")
}

// Grabs the auth token. Internal function.
function getAuthToken() {
  const token = localStorage.getItem("token")
  if (token && isTokenValid(token)) {
    return token
  }

  // Remove invalid or expired token.
  logout()
  return false
}

// Exports.
export const token = ref(localStorage.getItem("token"))
export const isSuperUser = ref(!!(token.value && isSuperUserToken(token.value)))
export const isLoggedIn = ref(!!(token.value && isTokenValid(token.value)))