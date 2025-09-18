<script setup>
import { ref, watch, onMounted } from "vue";
import gsap from "gsap";

const isWinningTrade = Math.random() < (55 / 100);


const props = defineProps({
  entry: { type: Number, required: true },
  tp: { type: Number, required: true },
  sl: { type: Number, required: true },
  currentPrice: { type: Number, required: true }
})

const classGlobal = "h-4 bg-gradient-to-r rounded-md absolute left-0 top-0"
const classColors = isWinningTrade ? "from-green-300 to-green-500" : "from-yellow-400 to-orange-500";
const classes = `${classGlobal} ${classColors}`;
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
  <div class="w-full h-4 bg-gray-600 rounded-md overflow-hidden relative">
    <div
      :class=classes
      :style="{ width: progressWidth + '%' }"
    ></div>
    <div
      class="w-3 h-3 bg-white rounded-md absolute top-1/2 -translate-y-1/2"
      :style="{ left: `calc(${progressWidth}% - 0.375rem)` }"
    ></div>
  </div>
</template>
