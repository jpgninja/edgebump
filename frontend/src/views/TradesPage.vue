<script setup>
    import { ref, onMounted } from "vue";
    import AddButton from "../components/buttons/AddButton.vue";
    import TradesTable from "../components/tables/TradesTable.vue";
    import { token } from "../stores/auth.js";

    // Trades init.
    const trades = ref([])

    // Fetch Trades.
    const fetchTrades = async () => {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }

        const res = await fetch("http://localhost:3000/api/trades", { headers })
        if (!res.ok) {
            console.error("Failed to fetch trades")
            return
        }

        trades.value = await res.json()
    }

    // Edit.
    const onEdit = (trade) => {
        console.log("Edit trade:", trade);
    }

    // Delete.
    const onDelete = (id) => {
        trades.value = trades.value.filter(t => t.id !== id);
        console.log("Deleted trade:", id);
    }

    // On Mount.
    onMounted(fetchTrades)
</script>

<template>
    <div class="w-full mx-auto p-6">
        <h2 class="text-3xl text-white font-bold mb-6 mt-12">
            Open Trades
            <AddButton routeName="trade_create" label="Add Trade" />
        </h2>
        <TradesTable :trades="trades" @edit="onEdit" @delete="onDelete"/>

        <h2 class="text-3xl text-white font-bold mb-6 mt-12">Recent Trades</h2>
        <TradesTable :trades="trades" @edit="onEdit" @delete="onDelete"/>
    </div>
</template>
