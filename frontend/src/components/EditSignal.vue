<script setup>
import { ref } from "vue"

const form = ref({ name: "", description: "" })

const submitForm = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    console.log("Signal saved:", data)
    form.value.name = ""
    form.value.description = ""
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
    <h2 class="text-xl font-semibold mb-4">Add Signal</h2>
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
      <button type="submit"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow">
        Save Signal
      </button>
    </form>
  </div>
</template>
