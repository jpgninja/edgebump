<script setup>
    import AddButton from "../components/buttons/AddButton.vue";
    import AccountsTable from "../components/tables/AccountsTable.vue";
    import EditAccount from "../components/EditAccount.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-3xl text-white font-bold mb-6">
            Accounts
            <AddButton routeName="account_create" label="Add Account" />
        </h1>
        <AccountsTable />
    </div>
</template>
