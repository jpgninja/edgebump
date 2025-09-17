<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

// Roadmap steps
const roadmapSteps = ref([
  {
    title: "Build Your Edge via Paper Trading",
    objective: "Validate your unique trading patterns to determine expectancy, win rate, and R-multiples.",
    benefit: "Avoid costly mistakes by perfecting your strategy in a risk-free environment.",
    save: "Save on emotional capital and financial losses by using paper trading as your testing ground.",
    metrics: [
      "Win rate per pattern",
      "Average R-multiple per trade",
      "Max drawdown",
      "Frequency of setups per week",
    ],
    tip: "Keep a log of contextual confluences including timeframe, ticker, signals, and macro conditions."
  },
  {
    title: "Analyze and Refine",
    objective: "Make data-driven decisions, turning trading from random shots in the dark into precision forecasting.",
    benefit: "Save time and ambiguity by refining your strategy with insightful analysis after 50–100 trades.",
    metrics: [
      "Average R per pattern",
      "Probability of hitting TP/SL",
      "Volatility ranges, refining entry rules, stop placements and leverage resizing."
    ]
  },
  {
    title: "Start Small with Real Capital",
    benefit: "Bridge the gap from practice to reality without committing your personal funds, minimizing financial risk.",
    save: "Protect your personal savings by leveraging prop firm accounts as your launchpad to real trading.",
    approach: "Trade with minimum risk size, mirroring proven paper trading setups and metrics."
  },
  {
    title: "Gradually Increase Exposure",
    benefit: "Utilize your refined skills in low-risk settings, gradually scaling exposure based on consistent performance.",
    save: "Avoid catastrophic losses by maintaining drawdown and scaling only when the edge is proven.",
    guidelines: [
      "Keep max drawdown <10–15% of account equity.",
      "Cycle through multiple prop accounts or slightly increase leverage."
    ]
  },
  {
    title: "Embrace a Risk Mindset",
    benefit: "Safeguard your longevity in trading by focusing on steady growth and risk management over thrill-seeking.",
    save: "Prevent burnout and financial devastation by managing bankrolls over chasing quick wins.",
    goal: "Doggedly compound small edges, ensuring continued growth and profitability."
  },
  {
    title: "Timeline & Milestones",
    benefit: "Define your success through clear milestones, motivating disciplined action and encouraging steady progression.",
    save: "Save on time and prevent wandering off-course by adhering to the timeline tailored to your trading journey.",
    stages: [
      "Paper Trading - Validate 2 patterns (50–100 trades per pattern)",
      "Analysis - Identify edge",
      "Prop Micro Account - First 1–2 months live (20–50 trades)",
      "Scaling - Use proven edge on full allocation (50–100 trades per pattern)",
      "Final Goal - Achieve ~$250k annualized payouts through 2–3 years of disciplined growth"
    ]
  }
]);

onMounted(() => {
  gsap.utils.toArray('.roadmap-step').forEach((step, i) => {
    gsap.from(step, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
      }
    });
  });

  // Animate header & hero text
  gsap.from('.hero-title', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' });
  gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 font-sans text-gray-200">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-purple-700 via-purple-900 to-indigo-900 py-32">
      <div class="container mx-auto px-6 text-center">
        <h1 class="hero-title text-5xl md:text-6xl font-bold mb-6 text-white">Unlock Your Trading Success</h1>
        <p class="hero-subtitle text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
          Follow the Trading Edge Roadmap to elevate your skills, gain clarity, and achieve real profitability.
        </p>
      </div>
    </section>

    <!-- Roadmap Steps -->
    <section class="container mx-auto px-6 py-16 space-y-12">
      <h2 class="text-4xl font-bold text-center text-purple-400 mb-12">Your Step-by-Step Trading Roadmap</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div 
          v-for="(step, idx) in roadmapSteps" 
          :key="idx" 
          class="roadmap-step bg-gray-800 rounded-3xl p-10 shadow-2xl hover:scale-[1.02] transition-transform duration-300"
        >
          <h3 class="text-2xl font-semibold mb-4 text-indigo-400">{{ step.title }}</h3>
          <div v-if="step.objective" class="mb-3">
            <span class="font-semibold">Objective:</span> {{ step.objective }}
          </div>
          <div v-if="step.benefit" class="mb-3">
            <span class="font-semibold">Benefit:</span> {{ step.benefit }}
          </div>
          <div v-if="step.save" class="mb-3">
            <span class="font-semibold">What You Save:</span> {{ step.save }}
          </div>
          <div v-if="step.metrics" class="mb-3">
            <span class="font-semibold">Metrics:</span>
            <ul class="list-disc ml-6 mt-1">
              <li v-for="(m, i) in step.metrics" :key="i">{{ m }}</li>
            </ul>
          </div>
          <div v-if="step.tip" class="mb-3 italic text-gray-400">Tip: {{ step.tip }}</div>
          <div v-if="step.approach" class="mb-3">{{ step.approach }}</div>
          <div v-if="step.guidelines" class="mb-3">
            <span class="font-semibold">Guidelines:</span>
            <ul class="list-disc ml-6 mt-1">
              <li v-for="(g, i) in step.guidelines" :key="i">{{ g }}</li>
            </ul>
          </div>
          <div v-if="step.goal" class="mb-3">
            <span class="font-semibold">Goal:</span> {{ step.goal }}
          </div>
          <div v-if="step.stages" class="mb-3">
            <span class="font-semibold">Stages to Success:</span>
            <ul class="list-disc ml-6 mt-1">
              <li v-for="(s, i) in step.stages" :key="i">{{ s }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
/* Optional: subtle floating animation for roadmap steps */
.roadmap-step:hover {
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.4);
  transform: translateY(-4px) scale(1.02);
  transition: all 0.3s ease-in-out;
}
</style>
