import { ref } from "vue"

export const selectedPattern = ref(JSON.parse(localStorage.getItem("selected_pattern")))

export function selectPattern(pattern) {
  localStorage.setItem("selected_pattern", JSON.stringify(pattern))
  selectedPattern.value = pattern
}