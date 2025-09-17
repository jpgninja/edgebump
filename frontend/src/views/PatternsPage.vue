<script setup>
    import AddButton from "../components/buttons/AddButton.vue";
    import PatternsTable from "../components/tables/PatternsTable.vue";
</script>

<template>
    <div class="w-full max-w-[90rem] mx-auto p-6 ">
        <h1 class="text-3xl text-white font-bold mb-6">
            Patterns
            <AddButton routeName="pattern_create" label="Add Pattern" />
        </h1>
        <PatternsTable />
    </div>
</template>
