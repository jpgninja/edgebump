<script setup>
import draggable from 'vuedraggable'
import Multiselect from 'vue-multiselect'
import { ref, watch, onMounted } from "vue"

const rules = ref([])           // selected signals for this pattern
const allSignals = ref([])      // options to choose from
const newRule = ref(null)
const props = defineProps({
  pattern: {
    type: Object,
    default: () => ({ name: "", description: "" })
  }
})

onMounted(async () => {
  const token = localStorage.getItem("token")
  allSignals.value = await (await fetch("http://localhost:3000/api/signals", {
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  })).json()
})

const emit = defineEmits(["saved", "close"])

const form = ref({ ...props.pattern })

// rehydrate form when parent passes a new pattern
watch(
  () => props.pattern,(val) => {
  if (val) form.value = { ...val }
  else form.value = { id: null, name: "", description: "" }
}, { immediate: true })

// When a pattern is loaded, populate its rules
watch(() => props.pattern, (val) => {
  if (val?.rules) {
    rules.value = val.rules.map(r => ({ id: r.signal_id, name: r.name, order: r.order }))
  } else {
    rules.value = []
  }
}, { immediate: true })

const addRule = (signal) => {
  if (!rules.value.find(r => r.id === signal.id)) {
    rules.value.push({ ...signal, order: rules.value.length })
  }
  newRule.value = null
}

const submitForm = async () => {
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
      ...form.value,
      rules: rules.value.map((r, i) => ({ signal_id: r.id, order: i }))
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

    if (res.ok) {
      console.log("Pattern saved successfully")
      emit("saved")
      emit("close")
    }
    
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <h2 class="text-xl font-semibold mb-4">Add Pattern</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm mb-1">Name</label>
        <input v-model="form.name" type="text"
               class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600" />
      </div>
      <div>
        <label class="block text-sm mb-1">Description</label>
        <textarea v-model="form.description" rows="2"
                  class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"></textarea>
      </div>
      <div class="mt-4">
        <label class="block text-sm mb-1">Pattern Rules</label>
        <draggable v-model="rules" item-key="id" class="flex flex-wrap gap-2">
          <template #item="{ element }">
            <span class="px-2 py-1 bg-blue-600 rounded-full cursor-move text-white">
              {{ element.name }}
            </span>
          </template>
        </draggable>

        <!-- Add new signal -->
        <multiselect
          v-model="newRule"
          :options="allSignals"
          label="name"
          track-by="id"
          placeholder="Add a signal"
          @select="addRule"
          class="mt-2 w-full"
        />
      </div>
      <button type="submit"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow">
        Save Pattern
      </button>
      <button type="button" @click="$emit('close')"
              class="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl shadow">
        Cancel
      </button>
    </form>
  </div>
</template>
