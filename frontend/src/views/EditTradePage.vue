<script setup>
    import { ref, onMounted } from "vue";
    import { token } from "../stores/auth.js";
    import { useRouter, useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()
    const props = defineProps({
        id: [String, Number]
    })
    
    const tradeId = route.params.id
    const trade = ref({})
    const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
    onMounted(async () => {
        const trade_res = await fetch(`http://localhost:3000/api/trades/${tradeId}`, { headers });
        const data = await trade_res.json()
        trade.value = Array.isArray(data) ? data[0] : data
    })

    import EditTrade from "../components/EditTrade.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <EditTrade :trade="trade" />
    </div>
</template>
