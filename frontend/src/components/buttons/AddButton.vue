<script setup>
import { useRouter } from 'vue-router'

// Props for flexibility
const props = defineProps({
  routeName: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Add'
  },
  classes: {
    type: String,
    default: 'px-3 py-2 bg-purple-600 rounded-lg text-xs text-white font-semibold shadow hover:scale-105 transition-transform'
  }
})

const router = useRouter()

const goToAdd = () => {
  router.push({ name: props.routeName })
}
</script>

<template>
  <button :class="classes" @click="goToAdd">
    {{ label }}
  </button>
</template>

