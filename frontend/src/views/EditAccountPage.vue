<script setup>
    import { ref, onMounted } from "vue";
    import { token } from "../stores/auth.js";

    const account = ref({})
    const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
    onMounted(async () => {
        const account_res = await fetch("http://localhost:3000/api/account/{id}", { headers });
        account.value = await account_res.json()
    })

    import EditAccount from "../components/EditAccount.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <EditAccount account="account" />
    </div>
</template>
