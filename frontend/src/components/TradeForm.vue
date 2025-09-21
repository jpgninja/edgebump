<script setup>
import { ref } from "vue"
import Multiselect from "vue-multiselect"
import useTradeBuilder from "../composables/useTradeBuilder"
import TradePreview from "./TradePreview.vue"

const props = defineProps({
  trade: Object
})

const emit = defineEmits(["saved", "close"])

// Initialize trade builder composable
const { form, phases, currentPhase, nextPhase, prevPhase, addExecution, removeExecution, preview, submitTrade, saving, message } = useTradeBuilder({ trade, emit })

</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg space-y-6">
    
    <!-- Feedback -->
    <div v-if="message" :class="message.startsWith('Error') ? 'bg-red-600' : 'bg-green-600'" class="px-4 py-2 rounded text-sm">
      {{ message }}
    </div>

    <!-- Phase Navigation -->
    <div class="flex justify-between mb-4">
      <button v-if="currentPhase.value > 0" @click="prevPhase" class="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700">← Back</button>
      <span class="font-semibold text-lg">{{ phases[currentPhase.value].label }}</span>
      <button v-if="currentPhase.value < phases.length - 1" @click="nextPhase" class="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700">Next →</button>
    </div>

    <!-- Phase Content -->
    <div>
      <!-- Render each phase based on currentPhase -->
      <component :is="phases[currentPhase.value].component" 
                 :form="form" 
                 :addExecution="addExecution" 
                 :removeExecution="removeExecution"
                 :signals="phases[currentPhase.value].signals"
                 />
    </div>

    <!-- Live preview -->
    <div>
      <h3 class="text-lg font-bold mb-2">Trade Preview</h3>
      <TradePreview :data="preview"/>
    </div>

    <!-- Submit -->
    <div class="flex justify-end gap-4">
      <button @click="submitTrade" :disabled="saving.value" class="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50">
        {{ saving.value ? "Saving..." : "Save Trade" }}
      </button>
    </div>

  </div>
</template>
