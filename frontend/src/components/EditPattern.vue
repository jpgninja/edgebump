<script setup>
import { ref, onMounted, computed, nextTick } from "vue"
import { token } from '../stores/auth.js'
import { useRouter, useRoute } from 'vue-router'
import RulesList from "./RulesList.vue"

const router = useRouter()
const route = useRoute()

// Reactive state
const form = ref({
  id: null,
  name: "",
  description: "",
  timeframe_high: "",
  timeframe_medium: "",
  timeframe_low: ""
})
const rules = ref([""])
const ruleSuggestions = ref([])
const timeframes = ["1M","1w","1d","4h","1h","30m","15m","10m","5m","1m"]

const mediumOptions = computed(() => {
  if (!form.value.timeframe_high) return timeframes
  return timeframes.filter(tf => timeframes.indexOf(tf) > timeframes.indexOf(form.value.timeframe_high))
})

const lowOptions = computed(() => {
  if (!form.value.timeframe_medium) return timeframes
  return timeframes.filter(tf => timeframes.indexOf(tf) > timeframes.indexOf(form.value.timeframe_medium))
})

// Fetch pattern and autocomplete on mount
onMounted(async () => {
  const patternId = route.params.id
  if (patternId) {
    const res = await fetch(`http://localhost:3000/api/patterns/${patternId}`, {
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
    })
    const data = await res.json()
    if (data) {
      form.value = {
        id: data.id,
        name: data.name ?? "",
        description: data.description ?? "",
        timeframe_high: data.timeframe_high ?? "",
        timeframe_medium: data.timeframe_medium ?? "",
        timeframe_low: data.timeframe_low ?? ""
      }
      rules.value = (data.rules ?? []).map(r => r) // array of strings
      if (rules.value.length === 0) rules.value = [""]
    }
  }

  // Fetch all autocomplete rules
  const res = await fetch("http://localhost:3000/api/rules/autocomplete", {
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
  })
  const data = await res.json()
  ruleSuggestions.value = data.map(r => r.name)
})

const submitForm = async () => {
  try {
    const tokenValue = localStorage.getItem("token")
    const method = form.value.id ? "PUT" : "POST"
    const url = form.value.id
      ? `http://localhost:3000/api/patterns/${form.value.id}`
      : `http://localhost:3000/api/patterns`

    const payload = {
      name: form.value.name,
      description: form.value.description,
      timeframe_high: form.value.timeframe_high,
      timeframe_medium: form.value.timeframe_medium,
      timeframe_low: form.value.timeframe_low,
      rules: rules.value.map(r => ({ name: r })) // send as array of {name}
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenValue}` },
      body: JSON.stringify(payload)
    })
    const data = await res.json()

    if (data.error) throw new Error("Failed to save pattern: " + data.error)
    if (!form.value.id && data.id) form.value.id = data.id

    router.push({ name: 'patterns' })
  } catch (err) {
    console.error(err)
  }
}

const cancelEditHandler = () => router.push({ name: 'patterns' })
</script>


<template>
  <div class="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <input v-model="form.name" type="text" class="w-200 text-3xl font-semibold mb-4 bg-gray-800 font-bold mb-6" placeholder="Pattern Name" />
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">Timeframes</h2>
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
        <textarea v-model="form.description" rows="12" class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"></textarea>
      </div>

      <div class="mt-4">
        <label class="block text-sm mb-1">Pattern Rules</label>
        <RulesList
          v-model="rules"
          :suggestions="ruleSuggestions"
          @submit-form="submitForm"
        />
      </div>

      <button type="submit" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow">Save Pattern</button>
      <button type="button" @click="cancelEditHandler" class="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl shadow">Cancel</button>
    </form>
  </div>
</template>
