<script setup>
import { ref, watch, onMounted } from "vue";
import gsap from "gsap";

const props = defineProps({
  entry: { type: Number, required: true },
  tp: { type: Number, required: true },
  sl: { type: Number, required: true },
  currentPrice: { type: Number, required: true }
})

const progressWidth = ref(0);

const animateProgress = () => {
  const range = props.tp - props.sl;
  let progress = (props.currentPrice - props.sl) / range * 100;
  progress = Math.max(0, Math.min(100, progress));

  gsap.to(progressWidth, { value: progress, duration: 1.5, ease: "power2.out" });
}

watch(() => props.currentPrice, animateProgress);
onMounted(animateProgress);
</script>

<template>
  <div class="w-full h-4 bg-gray-600 rounded-full overflow-hidden relative">
    <div
      class="h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full absolute left-0 top-0"
      :style="{ width: progressWidth + '%' }"
    ></div>
    <div
      class="w-3 h-3 bg-white rounded-full absolute top-1/2 -translate-y-1/2"
      :style="{ left: `calc(${progressWidth}% - 0.375rem)` }"
    ></div>
  </div>
</template>
