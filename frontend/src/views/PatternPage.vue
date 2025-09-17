<script setup>
    import { token } from '../stores/auth.js'
    import { ref, onMounted } from "vue";

    const pattern = ref({})

    const props = defineProps({
        id: String
    })

    onMounted(async () => {
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
        const res = await fetch(`http://localhost:3000/api/patterns/${props.id}`, { headers })
        pattern.value = await res.json()
    })
    import EditPatternButton from "../components/EditPatternButton.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-3xl text-white font-bold mb-6">
            {{ pattern.name }}
            <EditPatternButton />
        </h1>

        <p>{{ pattern.description }}</p>

        <h2 class="text-2xl text-white font-bold mb-4 mt-8">Rules</h2>
        <ul class="list-disc list-inside">
            <li v-for="rule in pattern.rules" :key="rule.id">
                {{ rule.signal_name }} ({{ rule.type }})
            </li>
        </ul>

        <h2 class="text-2xl text-white font-bold mb-4 mt-8">Confluences</h2>
        <ul class="list-disc list-inside">
            <li v-for="confluence in pattern.confluences" :key="confluence.id">
                {{ confluence.signal_name }} ({{ confluence.type }})
            </li>
        </ul>

        <h2 class="text-2xl text-white font-bold mb-4 mt-8">Timeframes</h2>
        <ul class="list-disc list-inside">
            <li class="mb-2">
                <strong>High Timeframe:</strong> {{ pattern.timeframe_high ?? 'None' }}
            </li>
            <li class="mb-2" v-if="pattern.timeframe_medium">
                <strong>Medium Timeframe:</strong> {{ pattern.timeframe_medium }}
            </li>
            <li class="mb-2">
                <strong>Low Timeframe:</strong> {{ pattern.timeframe_low ?? 'None' }}
            </li>
        </ul>
    </div>
</template>
