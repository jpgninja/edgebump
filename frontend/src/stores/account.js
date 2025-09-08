import { ref } from "vue"

export const selectedAccount = ref(JSON.parse(localStorage.getItem("selected_account")))

export function selectAccount(account) {
  localStorage.setItem("selected_account", JSON.stringify(account))
  selectedAccount.value = account
}