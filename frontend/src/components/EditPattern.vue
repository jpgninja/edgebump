<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { token } from '../stores/auth.js'
import Multiselect from 'vue-multiselect'
import draggable from 'vuedraggable'
import { selectedPattern } from '../stores/pattern.js'

// Define props.
const props = defineProps({
  pattern: {
    type: Object,
    default: () => ({ id: "", name: "Untitled Pattern", description: "", rules: [] })
  }
})

// Define emits.
const emit = defineEmits(["saved", "close"])

// Define reactive state.
const form = ref({
  id: null,
  name: "",
  description: "",
  rules: [],
  timeframe_high: "",
  timeframe_medium: "",
  timeframe_low: ""
})
const rules = ref([])           // selected signals for this pattern
const allSignals = ref([])      // options to choose from
const newRule = ref(null)
const timeframes = ["1m", "5m", "10m", "15m", "30m", "1h", "4h", "1d", "1w", "1M"].reverse()


const mediumOptions = computed(() => {
  if (!form.timeframe_high) return timeframes
  return timeframes.filter(tf => timeframes.indexOf(tf) <= timeframes.indexOf(form.timeframe_high))
})

const lowOptions = computed(() => {
  if (!form.timeframe_medium) return timeframes
  return timeframes.filter(tf => timeframes.indexOf(tf) <= timeframes.indexOf(form.timeframe_medium))
})

// populate form + rules when pattern prop changes
watch(
  () => props.pattern,
  (p) => {
    if (p) {
      form.value = { id: p.id ?? null, name: p.name ?? "", description: p.description ?? "" }
      rules.value = (p.rules ?? []).map(r => ({ id: r.signal_id, name: r.signal_name, type: r.type, order: r.order }))
    }
  },
  { immediate: true }
)

onMounted(async () => {
  allSignals.value = await (await fetch("http://localhost:3000/api/signals", {
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
  })).json()
})

const addRule = (signal) => {
  if (!rules.value.find(r => r.id === signal.id)) {
    rules.value.push({ ...signal, order: rules.value.length })
  }
  newRule.value = null
}

const submitForm = async () => {
  console.log("Submitting form:", form.value, "with rules:", rules.value)
  try {
    const token = localStorage.getItem("token")
    const method = form.value.id ? "PUT" : "POST"
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
    const url = form.value.id
      ? `http://localhost:3000/api/patterns/${form.value.id}`
      : `http://localhost:3000/api/patterns`

    const payload = {
      name: form.value.name,
      description: form.value.description,
      rules: rules.value.map((r, i) => ({
        signal_id: r.id,
        type: r.type ?? "entry",
        order: i
      }))
    }

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload)
    })
    const data = await res.json()

    if (data.error) {
      throw new Error("Failed to save pattern: " + data.error)
    }

    console.log("Pattern saved successfully")
    emit("saved")
    emit("close")

  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm mb-1 hidden">Name</label>
        <input v-model="form.name" type="text" class="w-200 text-3xl font-semibold mb-4 bg-gray-800 font-bold mb-6" />
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-4">Timeframes</h2>
        <p class="mb-4">Select the timeframes that this pattern applies to.</p>
        <div class="grid grid-cols-3 gap-6">
          <div>
            <label class="block text-sm mb-1">High Timeframe</label>
            <select v-model="form.timeframe_high" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600">
              <option value="" disabled>Select a timeframe</option>
              <option v-for="tf in timeframes" :key="tf" :value="tf">{{ tf }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Medium Timeframe</label>
            <select v-model="form.timeframe_medium" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600">
              <option value="" disabled>Select a timeframe</option>
              <option v-for="tf in mediumOptions" :key="tf" :value="tf">{{ tf }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Low Timeframe</label>
            <select v-model="form.timeframe_low" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600">
              <option value="" disabled>Select a timeframe</option>
              <option v-for="tf in lowOptions" :key="tf" :value="tf">{{ tf }}</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <label class="block text-sm mb-1">Description</label>
        <textarea v-model="form.description" rows="12"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"></textarea>
      </div>
      <div class="mt-4">
        <label class="block text-sm mb-1">Pattern Rules</label>
        <draggable v-model="rules" item-key="id" class="flex flex-wrap gap-2">
          <template #item="{ element }">
              <span class="px-2 py-1 bg-blue-600 rounded-md cursor-move text-white">
                {{ element.name }}
              </span>
          </template>
        </draggable>

        <multiselect v-model="newRule" :options="allSignals" label="name" track-by="id" placeholder="Add confluence"
          @select="addRule" class="mt-2 w-full border-none text-sm" />
      </div>
      <button type="submit" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow">
        Save Pattern
      </button>
      <button type="button" @click="$emit('close')"
        class="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl shadow">
        Cancel
      </button>
    </form>
  </div>
</template>
