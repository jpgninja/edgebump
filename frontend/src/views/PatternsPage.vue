<script setup>
    import AddPatternButton from "../components/AddPatternButton.vue";
    import PatternsTable from "../components/PatternsTable.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-3xl text-white font-bold mb-6">
            Patterns
            <AddPatternButton />
        </h1>
        <PatternsTable />
    </div>
</template>
