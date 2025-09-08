import { ref } from "vue"

export const selectedTrade = ref(JSON.parse(localStorage.getItem("selected_trade")))

export function selectTrade(trade) {
  localStorage.setItem("selected_trade", JSON.stringify(trade))
  selectedTrade.value = trade
}