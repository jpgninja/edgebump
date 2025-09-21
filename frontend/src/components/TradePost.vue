<script setup>
import { ref, computed } from "vue"
import { useTradeBuilder } from "../composables/useTradeBuilder"
import MarkdownIt from "markdown-it"

const { form } = useTradeBuilder()
const md = new MarkdownIt()

// Render notes as HTML
const renderedNotes = computed(() => md.render(form.notes || ""))
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">3. Post Trade Review</h2>

    <!-- Notes Input -->
    <div>
      <label class="block text-sm mb-1">Review Notes</label>
      <textarea v-model="form.notes" rows="6" class="w-full p-2 rounded bg-gray-700 border border-gray-600"></textarea>
    </div>

    <!-- Live Preview -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Preview</h3>
      <div class="p-4 rounded bg-gray-900 border border-gray-800 prose prose-invert max-w-none" v-html="renderedNotes"></div>
    </div>
  </div>
</template>
