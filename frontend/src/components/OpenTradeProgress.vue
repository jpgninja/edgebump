<template>
  <div class="w-full max-w-md">
    <div class="relative w-full h-4 rounded overflow-hidden bg-gray-600">
      <div
        class="h-full transition-all duration-300"
        :class="barColor"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>
    <div class="flex justify-between text-xs text-gray-400 mt-1">
      <span>Entry</span>
      <span>{{ endLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  entry: { type: Number, required: true },
  tp: { type: Number, required: true },
  sl: { type: Number, required: true },
  currentPrice: { type: Number, required: true } // user input
})

const isLong = computed(() => props.tp > props.entry)
const targetPrice = computed(() => isLong.value ? props.tp : props.sl)
const range = computed(() => Math.abs(targetPrice.value - props.entry))
const distance = computed(() => Math.abs(props.currentPrice - props.entry))
const progressPercent = computed(() => range.value ? Math.min(100, (distance.value / range.value) * 100) : 0)

const endLabel = computed(() => isLong.value ? "TP" : "SL")
const barColor = computed(() => isLong.value ? "bg-green-500" : "bg-red-600")
</script>
