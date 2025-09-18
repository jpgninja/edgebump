<script setup>
    import { ref, onMounted } from "vue";
    import { token } from "../stores/auth.js";
    import EditUser from "../components/EditUser.vue";

    const user = ref({})
    const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token.value}` }
    onMounted(async () => {
        const user_res = await fetch("http://localhost:3000/api/user/{id}", { headers });
        user.value = await user_res.json()
    })

</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <EditUser user="user" />
    </div>
</template>
