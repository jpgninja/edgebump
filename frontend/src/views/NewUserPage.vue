<script setup>
    import { ref, onMounted } from "vue";
    // import { token } from '../stores/auth.js'

    // const user = ref({})
    // onMounted(async () => {
    //     user.value = await (await fetch("http://localhost:3000/api/user/{id}", {
    //     headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    // })).json()
    // })

    import EditUser from "../components/EditUser.vue";
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-3xl text-white font-bold mb-6">
            New User
        </h1>
        <EditUser />
    </div>
</template>
