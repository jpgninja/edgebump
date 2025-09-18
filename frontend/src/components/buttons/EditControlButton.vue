<script setup>
import { useRouter } from 'vue-router'

// Props for flexibility
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  routeName: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: '✏️'
  },
  classes: {
    type: String,
    default: 'p-2 bg-gray-600 rounded-sm text-xs text-gray-100 font-semibold shadow hover:bg-gray-500'
  }
})

const router = useRouter()

const goToEdit = () => {
  router.push({ name: props.routeName, params: { id: props.id } })
}
</script>

<template>
  <button :class="classes" @click="goToEdit">
    {{ label }}
  </button>
</template>
