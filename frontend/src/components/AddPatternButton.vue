<script setup>
import { ref } from "vue"
import EditPattern from "./EditPattern.vue"
import router from "../router";

const showForm = ref(false)
</script>

<template>
  <router-link :to="{ name: 'pattern_new' }" class="px-4 py-2 bg-purple-600 rounded text-sm hover:bg-purple-700">
    Add Pattern
  </router-link>
</template>