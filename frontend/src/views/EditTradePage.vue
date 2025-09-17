<script setup>
import { ref, onMounted } from "vue";
    const pattern = ref({})
    // onMounted(async () => {
    //     pattern.value = await (await fetch("http://localhost:3000/api/pattern/{id}", {
    //     headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    // })).json()
    // })

    import EditTrade from "../components/EditTrade.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <EditTrade />
    </div>
</template>
