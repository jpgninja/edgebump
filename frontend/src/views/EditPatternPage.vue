<script setup>
import { ref, onMounted } from "vue";
    const pattern = ref({})
    import EditPattern from "../components/EditPattern.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <EditPattern />
    </div>
</template>
