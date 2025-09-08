<script setup>
    import AddAccountButton from "../components/AddAccountButton.vue";
    import AccountsTable from "../components/AccountsTable.vue";
    import EditAccount from "../components/EditAccount.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-3xl text-white font-bold mb-6">
            Accounts
            <AddAccountButton />
        </h1>
        <AccountsTable />
    </div>
</template>
