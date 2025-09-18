<script setup>
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  onDelete: {
    type: Function,
    required: true
  },
  label: {
    type: String,
    default: 'Delete'
  },
  classes: {
    type: String,
    default: 'p-2 bg-gray-700 rounded-sm text-xs text-gray-100 font-semibold shadow hover:bg-gray-600'
  },
  confirmMessage: {
    type: String,
    default: 'Are you sure you want to delete this item?'
  }
})

const handleDelete = () => {
  if (confirm(props.confirmMessage)) {
    props.onDelete(props.id)
  }
}
</script>

<template>
  <button :class="classes" @click="handleDelete">
    {{ label }}
  </button>
</template>
