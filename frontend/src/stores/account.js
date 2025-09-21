import { ref, computed, watch } from "vue"

// Raw account object
const _selectedAccount = ref(
  JSON.parse(localStorage.getItem("selected_account")) || null
)

// Expose reactive id for v-model binding
export const selectedAccountId = computed({
  get: () => _selectedAccount.value?.id || "",
  set: (id) => {
    const account = accounts.value.find(a => a.id === id) || null
    _selectedAccount.value = account
    localStorage.setItem("selected_account", JSON.stringify(account))
  }
})

// Expose selected account object
export const selectedAccount = computed(() => _selectedAccount.value)

// List of accounts (to be populated in App.vue)
export const accounts = ref([])

// Watch accounts list; auto-select first account if none selected
watch(accounts, (newAccounts) => {
  if (!_selectedAccount.value && newAccounts.length) {
    selectedAccountId.value = newAccounts[0].id
  }
})

export function selectAccount(account) {
  _selectedAccount.value = account
  localStorage.setItem("selected_account", JSON.stringify(account))
}
