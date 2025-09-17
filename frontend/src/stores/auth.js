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

function isTokenValid(token) {
  const payload = parseJwt(token)
  if (!payload || !payload.exp) {
    return false
  }
  const now = Math.floor(Date.now() / 1000)
  return payload.exp > now
}



export function login(newToken) {
  localStorage.setItem("token", newToken)
  token.value = newToken
  isLoggedIn.value = true
  router.push("/dashboard")
}

export function logout() {
  localStorage.removeItem("token")
  token.value = null
  isLoggedIn.value = false
  router.push("/login")
}

function getAuthToken() {
  const token = localStorage.getItem("token")
  if (token && isTokenValid(token)) {
    return token
  }

  // Remove invalid or expired token.
  logout()
  return false
}

export const token = ref(localStorage.getItem("token"))
export const isLoggedIn = ref(!!(token.value && isTokenValid(token.value)))