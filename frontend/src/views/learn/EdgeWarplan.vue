<script setup>
</script>

<template>
	<div class="max-w-6xl mx-auto p-8 bg-gray-900 text-white rounded-3xl shadow-xl space-y-8">
		<h1 class="text-4xl font-bold mb-4">Edge Warplan</h1>

		<div class="max-w-6xl mx-auto p-8 bg-gray-900 text-white rounded-3xl shadow-xl space-y-8">
			<h1 class="text-4xl font-bold text-purple-400 mb-4">Rollout Plan: From Paper Trading to $250k</h1>
			<p class="text-gray-300 text-lg mb-6">Concrete numbers and scaling assumptions for executing patterns with
				prop firm accounts.</p>

			<!-- Step 1: Initial Paper Trades -->
			<section class="bg-gray-800 p-6 rounded-2xl shadow-md space-y-3">
				<h2 class="text-2xl font-semibold text-purple-300">Step 1: Paper Trade Validation</h2>
				<ul class="list-disc list-inside text-gray-300 space-y-1">
					<li>Trade per pattern: <strong>50–100 simulated trades</strong></li>
					<li>Assumed win rate: <strong>60%</strong></li>
					<li>Average R-multiple: <strong>1.2</strong></li>
					<li>Track outcomes: R-multiples, confluences, max drawdown</li>
				</ul>
				<div class="mt-4 w-full bg-gray-700 rounded-full h-6">
					<div class="bg-green-500 h-6 rounded-full" style="width: 60%;"></div>
				</div>
				<p class="text-gray-400 text-sm mt-1">Simulated win rate: 60%</p>
			</section>

			<!-- Step 2: Prop Firm Testing -->
			<section class="bg-gray-800 p-6 rounded-2xl shadow-md space-y-3">
				<h2 class="text-2xl font-semibold text-purple-300">Step 2: Small Prop Firm Accounts</h2>
				<ul class="list-disc list-inside text-gray-300 space-y-1">
					<li>Initial capital: <strong>$20k–$50k per account</strong></li>
					<li>Risk per trade: <strong>1% of account equity</strong></li>
					<li>Number of accounts: Cycle through <strong>3–5</strong> to test edge</li>
					<li>Expected monthly payout: ~80% of profits</li>
				</ul>

				<!-- Risk/Reward bar -->
				<div class="mt-4 w-full bg-gray-700 h-4 rounded-full">
					<div class="bg-red-500 h-4 rounded-full" style="width: 1%;"></div>
				</div>
				<p class="text-gray-400 text-sm mt-1">Max risk per trade: 1% of account</p>
			</section>

			<!-- Step 3: Scaling Trades -->
			<section class="bg-gray-800 p-6 rounded-2xl shadow-md space-y-3">
				<h2 class="text-2xl font-semibold text-purple-300">Step 3: Scaling Capital</h2>
				<ul class="list-disc list-inside text-gray-300 space-y-1">
					<li>After 20–50 live trades, increase trade size gradually</li>
					<li>Assume 60% win rate, 1.2 R-multiple per trade</li>
					<li>Target: ~Quarter million payout per year</li>
				</ul>

				<!-- R-multiple progression -->
				<div class="mt-4 flex space-x-1 h-24">
					<div class="bg-purple-500 flex-1 rounded" style="height: 50%;"></div>
					<div class="bg-purple-500 flex-1 rounded" style="height: 120%;"></div>
					<div class="bg-purple-500 flex-1 rounded" style="height: 80%;"></div>
					<div class="bg-purple-500 flex-1 rounded" style="height: 150%;"></div>
					<div class="bg-purple-500 flex-1 rounded" style="height: 70%;"></div>
				</div>
				<p class="text-gray-400 text-sm mt-1">Average R-multiple per trade</p>
			</section>

			<!-- Step 4: Monthly Payout Estimation -->
			<section class="bg-gray-800 p-6 rounded-2xl shadow-md space-y-3">
				<h2 class="text-2xl font-semibold text-purple-300">Step 4: Expected Monthly Payout</h2>
				<ul class="list-disc list-inside text-gray-300 space-y-1">
					<li>Number of trades per month: ~20–30 per pattern</li>
					<li>Assume 60% win rate, 1.2 R-multiple</li>
					<li>Expected monthly profit per $50k account: <strong>$4k–$6k</strong></li>
					<li>Payout @ 80%: <strong>$3.2k–$4.8k</strong></li>
				</ul>

				<!-- Profit bar -->
				<div class="mt-4 w-full bg-gray-700 h-6 rounded-full">
					<div class="bg-green-500 h-6 rounded-full" style="width: 8%;"></div>
				</div>
				<p class="text-gray-400 text-sm mt-1">Approximate % of account converted to payout</p>
			</section>

			<!-- Step 5: Yearly Target -->
			<section class="bg-gray-800 p-6 rounded-2xl shadow-md space-y-3">
				<h2 class="text-2xl font-semibold text-purple-300">Step 5: Annual Projection</h2>
				<ul class="list-disc list-inside text-gray-300 space-y-1">
					<li>Cycle multiple accounts with proven edge</li>
					<li>Quarter million payout achievable with 3–5 accounts and disciplined scaling</li>
					<li>Key assumptions: 60% win rate, 1.2 R-multiple, max 1% risk per trade</li>
				</ul>

				<div class="mt-4 flex justify-between space-x-2">
					<div class="bg-green-500 flex-1 h-8 rounded" style="width: 25%;"></div>
					<div class="bg-green-500 flex-1 h-8 rounded" style="width: 25%;"></div>
					<div class="bg-green-500 flex-1 h-8 rounded" style="width: 25%;"></div>
					<div class="bg-green-500 flex-1 h-8 rounded" style="width: 25%;"></div>
				</div>
				<p class="text-gray-400 text-sm mt-1">Quarterly accumulation toward $250k/year</p>
			</section>
		</div>
	</div>
</template>
