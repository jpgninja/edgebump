<script setup>
import gsap from 'gsap'
import { ref, watch, onMounted } from "vue"
import { useTradeBuilder } from "../composables/useTradeBuilder"
import { selectedAccount } from "../stores/account"
import { token } from "../stores/auth"
import TradePlan from "./TradePlan.vue"
import TradeExecute from "./TradeExecute.vue"
import TradeReview from "./TradeReview.vue"
import TradePreview from "./TradePreview.vue"

const { form } = useTradeBuilder()
const currentStep = ref(1)
const progressBar = ref(null)

const updateProgress = (step) => {
  if (!progressBar.value) return
  const percentageTmp = (step - 1) / 2 * 100 // 3 steps
  const percentage = percentageTmp > 0 ? percentageTmp : 5
  gsap.to(progressBar.value, { width: `${percentage}%`, duration: 0.5, ease: 'power2.out' })
}

// Animate on mount
onMounted(() => updateProgress(currentStep.value))

// Animate whenever currentStep changes
watch(currentStep, (newStep) => updateProgress(newStep))


const nextStep = () => {
  if (currentStep.value === 1) {
    const entry = parseFloat(form.entry_plan)
    const sl = parseFloat(form.stop_loss)
    const tp = parseFloat(form.take_profit)

    // if (isNaN(entry) || isNaN(sl) || isNaN(tp)) {
    //   alert("Please fill Entry, Stop Loss, and Take Profit before continuing.")
    //   return
    // }

    // // Optional: basic logic checks
    // if (entry === sl || entry === tp) {
    //   alert("Entry price cannot be the same as Stop Loss or Take Profit.")
    //   return
    // }

    // if (tp <= entry && form.direction === "long") {
    //   alert("Take Profit should be higher than Entry for a long trade.")
    //   return
    // }

    // if (tp >= entry && form.direction === "short") {
    //   alert("Take Profit should be lower than Entry for a short trade.")
    //   return
    // }
  }

  if (currentStep.value < 3) currentStep.value++
}




const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const saving = ref(false)
const message = ref("")

const submitTrade = async () => {
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

    const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
    const res = await fetch(`http://localhost:3000/api/trades/${tradeId}`, {
      method,
      headers,
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (data.success) {
      message.value = "Trade saved successfully!"
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
  <div class="max-w-5xl mx-auto p-8 bg-gray-800 text-white rounded-2xl shadow-lg space-y-6">
    <!-- Step Indicator with Progress Bar -->
    <!-- <div class="w-full bg-slate-600 rounded-lg px-4 py-2 pt-6 mb-6">
        <div class="relative w-full h-3 bg-blue-500 rounded-full mb-6 overflow-hidden">
            <div
                ref="progressBar"
                class="h-3 bg-blue-500 rounded-full w-0"
            ></div>
            </div>
            <div class="flex justify-between text-sm mb-4 text-gray-300 font-medium">
            <div :class="currentStep === 1 ? 'text-white font-bold' : ''">Phase 1: Planning</div>
            <div :class="currentStep === 2 ? 'text-white font-bold' : ''">Phase 2: Trading</div>
            <div :class="currentStep === 3 ? 'text-white font-bold' : ''">Phase 3: Review</div>
        </div>
    </div> -->

    <!-- Flash message -->
    <div v-if="message" class="mb-4 p-2 rounded text-sm"
      :class="message.startsWith('Error') ? 'bg-yellow-800' : 'bg-green-800'">
      {{ message }}
    </div>

    <!-- Step Components -->
    <div class="grid grid-cols-2 gap-4 mt-2">
      <div>
        <div v-if="currentStep === 1">
          <TradePlan />
        </div>
        <div v-else-if="currentStep === 2">
          <TradeExecute />
        </div>
        <div v-else>
          <TradeReview />
        </div>
            <!-- Navigation Buttons -->
    <div class="flex justify-between mt-6">
      <button v-if="currentStep > 1" @click="prevStep" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg">Edit
        Plan</button>
      <div class="flex gap-2 ml-auto">
        <button v-if="currentStep < 3" @click="nextStep"
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg">Enter Trade</button>
        <button v-if="currentStep === 3" @click="submitTrade" :disabled="saving"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
          {{ saving ? 'Saving...' : 'Save Trade' }}
        </button>
      </div>
    </div>
      </div>
      <div>
        <TradePreview 
          :ticker="form.ticker"
          :direction="form.direction"
          :entry="form.entry_plan"
          :stop-loss="form.stop_loss"
          :take-profit="form.take_profit"
          :risk-to-reward="rrRatio"
          :risk="potentialLoss"
          :reward="potentialGain" />
      </div>
    </div>

  </div>
</template>
