<script setup>
import { ref } from "vue"
import EditPattern from "./EditPattern.vue"

const showForm = ref(false)
</script>

<template>
  <button @click="showForm = true"
          class="px-4 py-2 bg-purple-600 rounded text-sm hover:bg-purple-700">
    Add Pattern
  </button>

  <div v-if="showForm" class="mt-4">
    <EditPattern v-if="showForm" @close="showForm = false" @saved="showForm = false" />
  </div>
</template>