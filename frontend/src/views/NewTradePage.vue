<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import TradeBuilder from "../components/TradeBuilder.vue"
import { selectedAccount } from "../stores/account"
import { token } from "../stores/auth"
import { useTradeBuilder } from "../composables/useTradeBuilder"

const router = useRouter()
const { form } = useTradeBuilder()
const saving = ref(false)
const message = ref("")

const submitForm = async () => {
  saving.value = true
  message.value = ""
  try {
    const tradeId = form.id ?? "new"
    const method = tradeId === "new" ? "POST" : "PUT"

    const payload = {
      ...form,
      account_id: selectedAccount.value.id,
      executions: form.executions.map((e, i) => ({
        side: e.side ?? "entry",
        price: e.price ?? null,
        amount: e.amount ?? null,
        pnl: e.pnl ?? null,
        order: i
      })),
      signals: form.signals.map((s, i) => ({
        signal_id: s.signal_id ?? s.id ?? s,
        type: s.type ?? "entry",
        order: s.order ?? i,
        signal_value: s.signal_value ?? null
      }))
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token.value}`
    }

    const res = await fetch(`http://localhost:3000/api/trades/${tradeId}`, {
      method,
      headers,
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (data.success) {
      message.value = "Trade saved successfully!"
      setTimeout(() => router.push({ name: "trades" }), 1000)
    } else {
      message.value = `Error: ${data.error || "Unknown error"}`
    }
  } catch (err) {
    console.error(err)
    message.value = `Error: ${err.message}`
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <div v-if="message" class="mb-4 px-4 py-2 rounded text-sm"
         :class="message.startsWith('Error') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'">
      {{ message }}
    </div>

    <!-- Multi-step Trade Builder -->
    <TradeBuilder @save="submitForm" />
  </div>
</template>
