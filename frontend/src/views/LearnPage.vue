<script setup>
import { RouterLink } from "vue-router";
import { onMounted, ref } from "vue";
import gsap from "gsap";

const roadmapPoints = ref([
  { x: 10, y: 100 },
  { x: 60, y: 80 },
  { x: 110, y: 120 },
  { x: 160, y: 70 },
  { x: 210, y: 110 },
  { x: 260, y: 60 },
]);

const warplanPoints = ref([
  { x: 10, y: 90 },
  { x: 60, y: 110 },
  { x: 110, y: 60 },
  { x: 160, y: 120 },
  { x: 210, y: 80 },
  { x: 260, y: 100 },
]);

const animateChart = (svgSelector, points) => {
  const svg = document.querySelector(svgSelector);
  if (!svg) return;

  let pathString = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathString += ` L${points[i].x},${points[i].y}`;
  }

  const path = svg.querySelector("path");
  path.setAttribute("d", pathString);
  path.setAttribute("stroke-dasharray", path.getTotalLength());
  path.setAttribute("stroke-dashoffset", path.getTotalLength());

  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 2,
    ease: "power2.inOut"
  });

  const dots = svg.querySelectorAll("circle");
  gsap.fromTo(
    dots,
    { opacity: 0, scale: 0 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.3,
      ease: "back.out(1.7)"
    }
  );
};

onMounted(() => {
  animateChart("#roadmap-chart", roadmapPoints.value);
  animateChart("#warplan-chart", warplanPoints.value);
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 font-sans text-gray-200">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-purple-700 via-purple-900 to-indigo-900 py-24">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-white">Education Portal: Master Your Trading Edge</h1>
        <p class="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
          Learn to track, analyze, and execute high-probability trades with clarity and precision.
        </p>
      </div>
    </section>

    <!-- Navigation -->
    <nav class="flex space-x-6 bg-gray-800 p-4 rounded-xl shadow-md mb-8 justify-center">
      <RouterLink to="/learn/edge-roadmap" class="text-gray-400 hover:text-white font-semibold transition-colors">Edge Roadmap</RouterLink>
      <RouterLink to="/learn/edge-warplan" class="text-gray-400 hover:text-white font-semibold transition-colors">Edge Warplan</RouterLink>
    </nav>

    <!-- Sections -->
    <section class="container mx-auto px-6 py-16 space-y-12">
      <div class="flex flex-col lg:flex-row lg:space-x-8 space-y-12 lg:space-y-0">
        <!-- Edge Roadmap -->
        <div class="flex-1 bg-gray-800 rounded-3xl p-10 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
          <h2 class="text-3xl font-semibold mb-4 text-purple-400">Edge Roadmap</h2>

          <!-- Light chart card on dark section -->
          <div class="w-full h-64 mb-6 relative bg-white rounded-xl overflow-hidden shadow-inner p-4">
            <svg id="roadmap-chart" viewBox="0 0 280 140" class="w-full h-full">
              <path fill="none" stroke="#7c3aed" stroke-width="3" />
              <circle v-for="(pt, idx) in roadmapPoints" :key="idx" :cx="pt.x" :cy="pt.y" r="4" fill="#7c3aed"/>
            </svg>
          </div>

          <p class="text-gray-300 leading-relaxed mb-4">
            Track patterns and signals visually. Higher highs and lower lows help you identify edges and market rhythm at a glance.
          </p>

          <RouterLink to="/learn/edge-roadmap" class="inline-block px-6 py-3 bg-purple-600 rounded-full text-white font-medium hover:bg-purple-500 shadow-lg transition-all duration-300">
            Explore Edge Roadmap
          </RouterLink>
        </div>

        <!-- Edge Warplan -->
        <div class="flex-1 bg-gray-800 rounded-3xl p-10 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
          <h2 class="text-3xl font-semibold mb-4 text-indigo-400">Edge Warplan</h2>

          <!-- Light chart card on dark section -->
          <div class="w-full h-64 mb-6 relative bg-white rounded-xl overflow-hidden shadow-inner p-4">
            <svg id="warplan-chart" viewBox="0 0 280 140" class="w-full h-full">
              <path fill="none" stroke="#4f46e5" stroke-width="3" />
              <circle v-for="(pt, idx) in warplanPoints" :key="idx" :cx="pt.x" :cy="pt.y" r="4" fill="#4f46e5"/>
            </svg>
          </div>

          <p class="text-gray-300 leading-relaxed mb-4">
            Scale your validated patterns with this actionable warplan. The chart illustrates trade sequence and risk progression naturally.
          </p>

          <RouterLink to="/learn/edge-warplan" class="inline-block px-6 py-3 bg-indigo-600 rounded-full text-white font-medium hover:bg-indigo-500 shadow-lg transition-all duration-300">
            Explore Edge Warplan
          </RouterLink>
        </div>
      </div>

    </section>
  </div>
</template>
