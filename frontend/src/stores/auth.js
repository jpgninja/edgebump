// src/stores/auth.js
import { ref } from "vue"
import router from "../router"
    
export const isLoggedIn = ref(!!localStorage.getItem("token"))

export function login(token) {
  localStorage.setItem("token", token)
  isLoggedIn.value = true
  router.push("/dashboard")
}

export function logout() {
  localStorage.removeItem("token")
  isLoggedIn.value = false
  router.push("/")
}
