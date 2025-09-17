<script setup>
    import { ref, onMounted } from "vue";
    // import { token } from '../stores/auth.js'

    // const trade = ref({})
    // onMounted(async () => {
    //     trade.value = await (await fetch("http://localhost:3000/api/trade/{id}", {
    //     headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    // })).json()
    // })

    import EditTrade from "../components/EditTrade.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-3xl text-white font-bold mb-6">
            New Trade
        </h1>
        <EditTrade />
    </div>
</template>
