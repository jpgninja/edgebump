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
    default: 'Edit'
  },
  classes: {
    type: String,
    default: 'px-3 py-2 bg-blue-600 rounded-sm text-xs text-white font-semibold shadow hover:scale-105 transition-transform'
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
