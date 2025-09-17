<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const warplanSteps = ref([
  {
    title: "Step 1: Paper Trade Validation",
    description: "Begin your trading journey with confidence by validating each trading pattern through 50–100 simulated trades. Aim for a 60% win rate and an average R-multiple of 1.2 to ensure your strategies are profitable before risking real capital. Meticulously track outcomes, focusing on R-multiples, confluences, and max drawdown, to substantiate your trading edge in a safe, risk-free environment. This foundational step equips you with the assurance and data-driven insight needed to trade successfully with real funds.",
    points: [
      "Trade per Pattern: Validate each pattern with 50–100 simulated trades before committing real capital.",
      "Assumed Win Rate: Work with a 60% win rate and an average R-multiple of 1.2.",
      "Outcome Tracking: Keep meticulous records of R-multiples, confluences, and max drawdown to validate your strategies in a risk-free setting."
    ]
  },
  {
    title: "Step 2: Small Prop Firm Accounts",
	description: "Transition from theory to practice by starting with $20k–$50k in each prop firm account, managing risk by limiting each trade to 1% of account equity. Implement an effective account strategy by cycling through 3–5 accounts to thoroughly test and enhance your trading edge. Anticipate a substantial payout, around 80% of your generated profits, as you focus on steady, sustainable growth. This step ensures you can refine your strategies with real capital, enabling you to forge a path to consistent profitability.",
    points: [
      "Initial Capital: Start with $20k–$50k per prop firm account.",
      "Risk Management: Risk only 1% of account equity per trade.",
      "Account Strategy: Cycle through 3–5 accounts to rigorously test and refine your edge.",
      "Expected Payout: Anticipate an ~80% payout of generated profits, prioritizing consistent, sustainable progress."
    ]
  },
  {
    title: "Step 3: Scaling Capital",
	description: "Upon successfully completing 20–50 live trades, initiate a gradual increase in trade size, leveraging your proven performance with a steady 60% win rate and 1.2 R-multiple per trade. Set your sights on a substantial financial target—achieving a quarter-million dollar payout annually. By strategically scaling and cycling through accounts, you position yourself for sustained financial growth and trading success.",
    points: [
      "Progression Strategy: Upon completing 20–50 live trades, begin to gradually increase your trade size.",
      "Performance Assumptions: Maintain a 60% win rate and 1.2 R-multiple per trade as you scale.",
      "Financial Target: Aim for a quarter-million payout annually, leveraging strategic scaling and account cycling."
    ]
  },
  {
    title: "Step 4: Expected Monthly Payout",
	description: "Anticipate executing 20–30 trades per pattern each month, leading to an estimated profit of $4k–$6k per $50k account. With an 80% payout structure, this translates to a monthly income between $3.2k–$4.8k. This ensures your trading efforts are rewarded with tangible financial returns, forming the backbone of your fruitful trading journey.",
    points: [
      "Trade Volume: Conduct approximately 20–30 trades per pattern each month.",
      "Estimated Profit: Expect a monthly profit per $50k account between $4k–$6k.",
      "Payout Details: With an 80% payout, foresee $3.2k–$4.8k converted as monthly income, aligning your efforts with tangible financial rewards."
    ]
  },
  {
    title: "Step 5: Annual Projection",
	description: "Leverage multiple accounts to maximize your proven trading edge, setting an achievable goal of a quarter-million dollar annual payout. Maintain disciplined scaling across 3–5 accounts while adhering to key performance metrics: a 60% win rate, 1.2 R-multiple, and a maximum risk of 1% per trade. This disciplined approach positions you to confidently achieve your $250k per year target.",
    points: [
      "Account Cycling: Utilize multiple accounts to fully embody your proven edge.",
      "Achievable Goal: Consistently aim for a quarter-million annual payout by maintaining disciplined scaling across 3–5 accounts.",
      "Key Assumptions: Uphold a 60% win rate, 1.2 R-multiple, with a maximum risk of 1% per trade to confidently progress toward $250k/year."
    ]
  }
]);

onMounted(() => {
  gsap.utils.toArray('.warplan-step').forEach((step, i) => {
    gsap.from(step, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
      }
    });
  });

  gsap.from('.hero-title', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' });
  gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 font-sans text-gray-200">

    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-indigo-800 via-purple-900 to-pink-800 py-32">
      <div class="container mx-auto px-6 text-center">
        <h1 class="hero-title text-5xl md:text-6xl font-bold mb-6 text-white">A Predictable Path To Making $250,000 With Prop Firms</h1>
        <p class="pt-8 hero-subtitle text-lg md:text-xl max-w-4xl mx-auto text-gray-300">
		The Edge Warplan is your guaranteed method for achieving a $250k annual payout using prop firm accounts, designed through a meticulous approach that emphasizes slow and steady progress. This structured pathway lays out a clear, data-driven trajectory, ensuring success by methodically building on proven trading strategies. By following the warplan's calculated progression—rooted in concrete numbers and disciplined execution—you will harness the right balance of risk management and strategic scaling, making it clear and attainable how to reach your financial goals in trading.
        </p>
      </div>
    </section>

    <!-- Warplan Steps -->
    <section class="container mx-auto px-6 py-16 space-y-12">
      <h2 class="text-4xl font-bold text-center text-indigo-400 mb-12">Step-by-Step Edge Warplan</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div v-for="(step, idx) in warplanSteps" :key="idx" class="warplan-step bg-gray-800 rounded-3xl p-10 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
          <h3 class="text-2xl font-semibold mb-4 text-purple-400">{{ step.title }}</h3>
		  <p class="text-lg mt-4 mb-4 text-purple-100">{{ step.description }}</p>
          <ul class="list-disc ml-6 space-y-2">
            <li v-for="(point, i) in step.points" :key="i">{{ point }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gray-800 py-20 mt-12">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Your Roadmap to $250k Starts Here</h2>
        <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
          The Edge Warplan empowers ambitious traders to execute disciplined, profitable strategies while scaling their capital strategically.
        </p>
        <button class="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          Get Started Today
        </button>
      </div>
    </section>

  </div>
</template>

<style>
/* Optional subtle hover animation */
.warplan-step:hover {
  box-shadow: 0 25px 50px rgba(99, 102, 241, 0.4);
  transform: translateY(-6px) scale(1.03);
  transition: all 0.3s ease-in-out;
}
</style>
