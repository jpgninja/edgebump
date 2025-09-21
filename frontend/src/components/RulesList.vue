<template>
  <draggable v-model="rules" item-key="name" handle=".drag-handle" @start="onDragStart" @end="onDragEnd" class="flex flex-col gap-2">
    <template #item="{ element, index }">
      <div class="flex items-center gap-2 p-2 bg-gray-800 rounded shadow-sm">
        <span class="drag-handle cursor-move px-2 py-1 bg-gray-700 text-white rounded">≡</span>
        <RuleInput
          v-model="rules[index]"
          :suggestions="suggestions"
          @add-below="addRule(index)"
          @focus-prev="focusRule(index - 1)"
          @focus-next="focusRule(index + 1)"
          @submit-form="$emit('submit-form')"
          :ref="ruleInputs[index]"
        />
      </div>
    </template>
  </draggable>
</template>


<script setup>
import { ref, watch, nextTick } from "vue"
import RuleInput from "./RuleInput.vue"
import gsap from "gsap"
import draggable from "vuedraggable"


const props = defineProps({
  modelValue: { type: Array, default: () => [""] },
  suggestions: { type: Array, default: () => [] }
})
const emit = defineEmits(["update:modelValue", "submit-form"])

const rules = ref([...props.modelValue])
watch(() => props.modelValue, v => { rules.value = [...v] })
watch(rules, v => emit("update:modelValue", v), { deep: true })

const ruleInputs = ref([])

function addRule(index) {
  rules.value.splice(index + 1, 0, "")
  nextTick(() => {
    // Auto-focus the newly added input
    ruleInputs.value[index + 1]?.focus()
    // Animate its appearance
    gsap.fromTo(
      ruleInputs.value[index + 1].$el,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
    )
  })
}

function focusRule(index) {
  if (index >= 0 && index < ruleInputs.value.length) {
    ruleInputs.value[index]?.focus()
  }
}

function onDragStart(evt) {
  gsap.to(evt.item, { scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.3)", duration: 0.2 })
}

function onDragEnd(evt) {
  gsap.to(evt.item, { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.2 })
}
</script>

