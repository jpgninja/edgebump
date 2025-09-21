<template>
  <div class="relative w-full">
    <input
      v-model="localValue"
      @keydown.enter.prevent="onEnter"
      @keydown.ctrl.enter.prevent="$emit('submit-form')"
      @keydown.arrow-up.prevent="focusPrev"
      @keydown.arrow-down.prevent="focusNext"
      @input="filterSuggestions"
      class="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder="Type a rule..."
      ref="inputRef"
    />
    <ul v-if="showSuggestions && filtered.length" class="absolute z-50 mt-1 w-full bg-gray-800 rounded shadow-lg max-h-48 overflow-auto">
        <li
        v-for="(s,i) in filtered"
        :key="i"
        @click="selectSuggestion(s)"
        class="suggestion-item flex items-center gap-2 p-2 bg-gray-800 rounded shadow-sm hover:bg-gray-700 transition cursor-pointer"
        :class="{ 'bg-indigo-600 text-white': i === highlighted }"
        >
        {{ s }}
        </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue"
import gsap from "gsap"

const props = defineProps({
  modelValue: String,
  suggestions: Array
})
const emit = defineEmits(["update:modelValue","add-below","focus-prev","focus-next","submit-form"])

const localValue = ref(props.modelValue || "")
const showSuggestions = ref(false)
const filtered = ref([])
const highlighted = ref(0)
const inputRef = ref(null)

watch(() => props.modelValue, val => localValue.value = val)

function filterSuggestions() {
  const val = localValue.value.toLowerCase()
  filtered.value = props.suggestions.filter(s => s.toLowerCase().includes(val))
  
  if (filtered.value.length) {
    showSuggestions.value = true
    nextTick(() => gsap.fromTo(".suggestion-item", 
      { opacity: 0, y: -5 }, 
      { opacity: 1, y: 0, stagger: 0.03, duration: 0.2 }
    ))
  } else {
    showSuggestions.value = false
  }
  
  emit("update:modelValue", localValue.value)
}


function selectSuggestion(s) {
  gsap.to(".suggestion-item", { opacity: 0, y: -5, duration: 0.15, onComplete: () => {
    localValue.value = s
    showSuggestions.value = false
    emit("update:modelValue", s)
  }})
}


function onEnter() {
  emit("add-below")
}

function focusPrev() { emit("focus-prev") }
function focusNext() { emit("focus-next") }
</script>
