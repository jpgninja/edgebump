<script setup>
    import { RouterLink } from "vue-router";
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-purple-700 via-purple-900 to-indigo-900 py-24">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">Education Portal: Master Your Trading Edge</h1>
        <p class="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 animate-fadeIn delay-200">
          The Education Portal is your launchpad for understanding how to identify, track, and execute high-probability trades. 
          Whether you're just starting out or refining your approach, this portal is designed for traders who want to build real skills, not just follow tips. 
          From foundational concepts to stepwise scaling strategies, the portal gives you both the perspective and tools to accelerate your trading journey.
        </p>
      </div>
    </section>

    <!-- Place at the top of the Learn page, under the main title -->
    <nav class="flex space-x-6 bg-gray-800 p-4 rounded-xl shadow-md mb-8">
    <RouterLink 
        to="/learn/edge-roadmap" 
        class="text-gray-400 hover:text-white transition-colors duration-300 font-semibold">
        Edge Roadmap
    </RouterLink>

    <RouterLink 
        to="/learn/edge-warplan" 
        class="text-gray-400 hover:text-white transition-colors duration-300 font-semibold">
        Edge Warplan
    </RouterLink>
    </nav>


    <!-- Sections -->
    <section class="container mx-auto px-6 py-16 space-y-12">
      
      <!-- Edge Roadmap -->
      <div class="bg-gray-800 rounded-3xl p-10 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
        <h2 class="text-3xl font-semibold mb-4 text-purple-400">Edge Roadmap</h2>

        <div class="w-full h-40 mb-6 relative overflow-hidden rounded-xl bg-gray-700">
        <div class="absolute bottom-0 left-0 w-1 h-32 bg-purple-400 animate-bounce-slow rounded"></div>
        <div class="absolute bottom-0 left-10 w-1 h-24 bg-purple-500 animate-bounce-slower rounded"></div>
        <div class="absolute bottom-0 left-20 w-1 h-36 bg-purple-300 animate-bounce-slow rounded"></div>
        <div class="absolute bottom-0 left-32 w-1 h-28 bg-purple-400 animate-bounce-slower rounded"></div>
        </div>

        <p class="text-gray-300 mb-6 leading-relaxed">
          Your journey begins with the Edge Roadmap. This section guides you through the patterns, signals, and trade setups that experienced traders use, but in a way that makes sense for someone still learning to spot them in real time. You'll practice tracking setups, analyzing outcomes, and building the habits that turn insight into consistent decision-making. By the end, you'll understand how to organize your trades, recognize your edge, and start seeing meaningful patterns emerge in the market.
        </p>
        <RouterLink to="/learn/edge-roadmap" class="inline-block px-6 py-3 bg-purple-600 rounded-full text-white font-medium hover:bg-purple-500 shadow-lg transition-all duration-300">
          Explore Edge Roadmap
        </RouterLink>
      </div>

      <!-- Edge Warplan -->
      <div class="bg-gray-800 rounded-3xl p-10 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
        <h2 class="text-3xl font-semibold mb-4 text-indigo-400">Edge Warplan</h2>

        <div class="w-full h-40 flex items-end justify-between space-x-2 mb-6 bg-gray-700 rounded-xl p-2 overflow-hidden">
        <div class="w-4 bg-green-400 rounded-t-lg animate-rise" style="height: 25%;"></div>
        <div class="w-4 bg-purple-500 rounded-t-lg animate-rise-delay" style="height: 50%;"></div>
        <div class="w-4 bg-green-300 rounded-t-lg animate-rise" style="height: 40%;"></div>
        <div class="w-4 bg-purple-400 rounded-t-lg animate-rise-delay" style="height: 60%;"></div>
        <div class="w-4 bg-green-500 rounded-t-lg animate-rise" style="height: 35%;"></div>
        </div>

        <p class="text-gray-300 mb-6 leading-relaxed">
          Once you've validated your patterns, the Edge Warplan shows how to scale them methodically. This is for traders ready to manage real capital while keeping risk controlled. You'll follow a stepwise approach: sizing trades according to account risk, projecting R-multiples, tracking performance, and gradually increasing exposure as confidence grows. By the end, you'll have a tangible plan to turn your proven setups into a disciplined growth strategy that evolves with your skill.
        </p>
        <RouterLink to="/learn/edge-warplan" class="inline-block px-6 py-3 bg-indigo-600 rounded-full text-white font-medium hover:bg-indigo-500 shadow-lg transition-all duration-300">
          Explore Edge Warplan
        </RouterLink>
      </div>

    </section>
  </div>
</template>

<style>
/* Roadmap - Bouncing bars */
@keyframes bounce-slow {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
}
@keyframes bounce-slower {
  0%, 100% { transform: scaleY(0.6); }
  50% { transform: scaleY(1); }
}
.animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
.animate-bounce-slower { animation: bounce-slower 3s ease-in-out infinite; }

/* Warplan - Rising bars */
@keyframes rise {
  0% { transform: translateY(100%); }
  50% { transform: translateY(0%); }
  100% { transform: translateY(100%); }
}
@keyframes rise-delay {
  0% { transform: translateY(100%); }
  50% { transform: translateY(0%); }
  100% { transform: translateY(100%); }
}
.animate-rise { animation: rise 2s ease-in-out infinite; }
.animate-rise-delay { animation: rise-delay 2.5s ease-in-out infinite; }

/* Fade In Animation */
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px);}
  100% { opacity: 1; transform: translateY(0);}
}
.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}
.animate-fadeIn.delay-200 {
  animation-delay: 0.2s;
}
</style>

