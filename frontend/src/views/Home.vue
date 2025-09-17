<script setup>
</script>

<template>
    <div class="relative text-white overflow-hidden">
        <!-- Background animated blobs (kept as simple divs so global styles stay consistent) -->
        <div class="absolute inset-0 -z-10 overflow-hidden">
            <div class="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div class="absolute -bottom-28 -right-20 w-[520px] h-[520px] bg-gradient-to-r from-purple-700 to-indigo-500 rounded-full blur-3xl opacity-25 animate-bounce"></div>
            <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-2xl opacity-12 animate-[float_8s_ease-in-out_infinite]"></div>
        </div>

        <!-- HERO -->
        <section class="relative text-center py-24 px-6">
            <div class="max-w-5xl mx-auto">
            <h1 class="text-5xl md:text-6xl font-extrabold mb-4 fade-in">
                EdgeBump
            </h1>
            <p class="text-2xl md:text-3xl font-semibold gradient-text mb-6">
                Transform Chaos into Consistency: Day Traders Achieve Mastery in Weeks, Not Years
            </p>

            <p class="max-w-3xl mx-auto text-lg text-gray-300 mb-8 fade-in">
                Uncover your trading edge without the endless cycle of trial, error, and overwhelm. EdgeBump provides a clear, repeatable framework to build, refine, and scale your trading strategy efficiently and effectively.
            </p>

            <div class="flex items-center justify-center gap-4">
                <a
                class="inline-flex items-center gap-3 px-8 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 shadow-2xl hover:scale-105 transition-transform transform"
                href="#cta"
                >
                Join EdgeBump — Get Started
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>

                <a class="px-6 py-3 rounded-full border border-white/10 text-sm hover:bg-white/5 transition" href="#roadmap">See Roadmap</a>
            </div>
            </div>
        </section>

        <!-- Brief intro strip -->
        <div class="max-w-6xl mx-auto px-6">
            <div class="rounded-3xl p-4 md:p-6 bg-gradient-to-br from-black/40 to-slate-900/30 border border-white/6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="text-left">
                <div class="text-sm text-slate-300">What it is • Who it's for • What you get</div>
                <div class="mt-2 text-base md:text-lg text-gray-200">
                EdgeBump analyzes your trades, validates patterns, and gives you the roadmap to scale on prop accounts — so aspiring and intermediate day traders get consistent payouts without guessing or gambling.
                </div>
            </div>
            <div class="flex gap-3">
                <a class="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 font-semibold hover:scale-105 transition" href="#cta">Start Free Trial</a>
                <a class="px-4 py-2 rounded-lg border border-white/8 text-sm hover:bg-white/3 transition" href="#features">How it works</a>
            </div>
            </div>
        </div>

        <!-- WHO / WHAT / WHAT DO I GET (3-column stacked on small screens) -->
        <section class="py-16 px-6">
            <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <!-- WHAT -->
            <article class="p-6 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-white/6 shadow-md float hover:shadow-2xl transition-shadow">
                <h3 class="text-xl font-bold gradient-text mb-3">What Is EdgeBump?</h3>
                <p class="text-gray-300">
                <strong>Forge profitable trading habits from confusion, leaving behind endless uncertainty.</strong>
                EdgeBump offers clarity and confidence for aspiring and intermediate traders by providing a proven roadmap to discover, test, and refine your unique trading edge.
                </p>
            </article>

            <!-- WHO -->
            <article class="p-6 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-white/6 shadow-md float hover:shadow-2xl transition-shadow">
                <h3 class="text-xl font-bold gradient-text mb-3">Who Is It For?</h3>
                <p class="text-gray-300">
                <strong>Gain confidence with structured guidance.</strong>
                If you’re new and drowning in guru noise, or intermediate and stuck in overtrading cycles — EdgeBump is designed for you to build a systematic path to trading success.
                </p>
            </article>

            <!-- WHAT DO I GET -->
            <article class="p-6 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-white/6 shadow-md float hover:shadow-2xl transition-shadow">
                <h3 class="text-xl font-bold gradient-text mb-3">What Do I Get?</h3>
                <p class="text-gray-300">
                <strong>Accelerate your trading journey with proven roadmaps that protect capital.</strong>
                You get the full EdgeBump Roadmap (Foundation → Backtest & Validate → Go Live → Scale & Refine) plus checklists, templates, and field-tested strategies to shortcut years of trial-and-error.
                </p>
            </article>
            </div>
        </section>

        <!-- ROADMAP (detailed but punchy) -->
        <section id="roadmap" class="py-20 px-6 bg-gradient-to-b from-black via-slate-900 to-black">
            <div class="max-w-5xl mx-auto text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-extrabold gradient-text mb-4">Your Roadmap to a Consistent Edge</h2>
            <p class="text-gray-400 max-w-2xl mx-auto">
                A short, battle-tested path from paper validation to prop-firm scaling — designed so traders can find a repeatable edge and grow payouts without blowing accounts.
            </p>
            </div>

            <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <div class="p-6 rounded-2xl bg-slate-800/50 border border-white/6 shadow float hover:scale-[1.02] transition-transform">
                <h4 class="font-bold mb-2 gradient-text">1. Build — Paper Trade</h4>
                <p class="text-gray-300">Validate setups with 50–100 simulated trades. Track expectancy, win rate, R-multiples, and drawdown so you know what truly works.</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-800/50 border border-white/6 shadow float hover:scale-[1.02] transition-transform">
                <h4 class="font-bold mb-2 gradient-text">2. Analyze & Refine</h4>
                <p class="text-gray-300">EdgeBump surfaces patterns with positive expectancy so you can tighten entries, optimize stops, and improve sizing — faster.</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-800/50 border border-white/6 shadow float hover:scale-[1.02] transition-transform">
                <h4 class="font-bold mb-2 gradient-text">3. Go Live & Scale</h4>
                <p class="text-gray-300">Start small on prop micro accounts, keep rules strict, and scale exposure only after 20–50 consistent live trades.</p>
            </div>
            </div>
        </section>

        <!-- WARPLAN summary with numbers -->
        <section id="warplan" class="py-16 px-6">
            <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div class="space-y-4">
                <h3 class="text-3xl font-extrabold gradient-text">Warplan to $250k</h3>
                <p class="text-gray-300">Concrete assumptions and a repeatable rollout for traders who want to scale into consistent payouts without reckless risk-taking.</p>

                <ul class="mt-4 space-y-2 text-gray-300">
                <li>• 50–100 trades per pattern to validate edge</li>
                <li>• Start with $20k–$50k prop accounts, risk 1% per trade</li>
                <li>• Cycle 3–5 accounts to diversify and scale payouts</li>
                <li>• Target 20–30 trades / month per pattern for rhythm and compounding</li>
                </ul>
            </div>

            <div class="p-6 rounded-2xl bg-gradient-to-br from-indigo-700/10 to-pink-600/8 border border-white/6 shadow-md">
                <div class="grid grid-cols-2 gap-4">
                <div class="p-4">
                    <div class="text-2xl font-bold">60%</div>
                    <div class="text-sm text-gray-400">Assumed Win Rate</div>
                </div>
                <div class="p-4">
                    <div class="text-2xl font-bold">1.2R</div>
                    <div class="text-sm text-gray-400">Avg R-multiple</div>
                </div>
                <div class="p-4">
                    <div class="text-2xl font-bold">20–30</div>
                    <div class="text-sm text-gray-400">Trades / month / pattern</div>
                </div>
                <div class="p-4">
                    <div class="text-2xl font-bold">$3.2k–$4.8k</div>
                    <div class="text-sm text-gray-400">Expected payout / mo (@80%) per $50k account</div>
                </div>
                </div>
            </div>
            </div>
        </section>

        <!-- Benefits CTA -->
        <section id="cta" class="py-20 px-6 text-center">
            <div class="max-w-4xl mx-auto">
            <h3 class="text-4xl font-extrabold mb-4">Start Transforming Chaos into Consistency — Beginning Today</h3>
            <p class="text-lg text-gray-300 mb-8">Enough with uncertain trades. Find your edge, protect your capital, and scale with confidence.</p>

            <div class="flex items-center justify-center gap-4">
                <a class="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 font-bold text-lg shadow-2xl hover:scale-105 transition-transform" href="#">
                Join EdgeBump Now
                </a>

                <a class="px-6 py-3 rounded-full border border-white/10 text-sm hover:bg-white/5 transition" href="#">
                Request Demo
                </a>
            </div>

            <p class="text-sm text-gray-500 mt-6">Includes checklists, templates, and field-tested strategies to dramatically reduce the learning curve.</p>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-12 text-center text-gray-500 text-sm border-t border-slate-700">
            © 2025 EdgeBump. All rights reserved.
        </footer>
    </div>
</template>

<style scoped>
    body { font-family: 'Inter', sans-serif; }
    .gradient-text { background: linear-gradient(90deg, #6366f1, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .fade-in { animation: fadeIn 1s ease-in forwards; opacity: 0; }
    @keyframes fadeIn { to { opacity: 1; } }
    .float { transition: transform 0.3s ease; }
    .float:hover { transform: translateY(-6px) scale(1.03); }
</style>