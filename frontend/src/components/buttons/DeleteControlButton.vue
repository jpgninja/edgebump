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
    default: 'px-3 py-2 bg-red-700 rounded-sm text-xs text-white font-semibold shadow hover:scale-105 transition-transform'
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
