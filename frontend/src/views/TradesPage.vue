<script setup>
    import AddTradeButton from "../components/AddTradeButton.vue";
    import TradesTable from "../components/TradesTable.vue";

</script>

<template>
    <div class="w-full mx-auto p-6">
        <h2 class="text-3xl text-white font-bold mb-6 mt-12">
            Open Trades
            <AddTradeButton />
        </h2>
        <TradesTable />

        <h2 class="text-3xl text-white font-bold mb-6 mt-12">Recent Trades</h2>
        <TradesTable />
    </div>
</template>
