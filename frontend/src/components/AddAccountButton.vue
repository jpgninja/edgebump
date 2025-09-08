<script setup>
import { ref } from "vue"
import EditAccount from "./EditAccount.vue"

const showForm = ref(false)
</script>

<template>
  <button @click="showForm = true"
          class="px-4 py-2 bg-purple-600 rounded text-sm hover:bg-purple-700">
    Add Account
  </button>

  <div v-if="showForm" class="mt-4">
    <EditAccount @close="showForm = false" />
  </div>
</template>