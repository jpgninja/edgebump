<script setup>
import { ref } from "vue"
import EditTrade from "./EditTrade.vue"

const showForm = ref(false)
</script>

<template>
  <button v-if="!showForm" @click="showForm = true" class="px-4 py-2 bg-purple-600 rounded text-sm hover:bg-purple-700">
    Add Trade
  </button>

  <div v-if="showForm" class="mt-4">
    <EditTrade @close="showForm = false" />
  </div>
</template>