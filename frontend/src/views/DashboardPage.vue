<script setup>
    import AddButton from "../components/buttons/AddButton.vue";
    import TradesTable from "../components/tables/TradesTable.vue";
</script>

<template>
    <div class="max-w-6xl mx-auto p-6 space-y-12">
    <!-- Open Positions -->
    <section class="space-y-6">
        <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl md:text-4xl font-extrabold gradient-text">Open Positions</h1>
        <AddButton routeName="trade_create" label="Add Trade" />
        </div>

        <div class="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg overflow-hidden float hover:scale-[1.02] transition-transform">
        <TradesTable />
        </div>
    </section>

    <!-- Recent Trades -->
    <section class="space-y-6">
        <h1 class="text-3xl md:text-4xl font-extrabold gradient-text mb-4">Recent Trades</h1>

        <div class="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg overflow-hidden float hover:scale-[1.02] transition-transform">
        <TradesTable />
        </div>
    </section>
    </div>
</template>


<style>
/* Gradient text helper for headers */
.gradient-text {
  background: linear-gradient(to right, #8b5cf6, #ec4899, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
