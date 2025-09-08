<script setup>
    import AddTradeButton from "../components/AddTradeButton.vue";
    import TradesTable from "../components/TradesTable.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-3xl text-white font-bold mb-6">
            Open Positions
            <AddTradeButton />
        </h1>
        <TradesTable />
        <h1 class="text-3xl text-white font-bold mb-6">Recent Trades</h1>
        <TradesTable />
    </div>
</template>
