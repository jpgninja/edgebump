<script setup>
    import { ref, onMounted } from "vue";
    import AddButton from "../components/buttons/AddButton.vue";
    import UsersTable from "../components/tables/UsersTable.vue";
    import { token } from "../stores/auth.js";


    // Users init.
    const users = ref([])

    // Fetch Users.
    const fetchUsers = async () => {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.value}`
        }

        const res = await fetch("http://localhost:3000/api/users", { headers })
        if (!res.ok) {
            console.error("Failed to fetch users")
            return
        }

        users.value = await res.json()
    }

    // Edit.
    const onEdit = (user) => {
        console.log("Edit user:", user);
    }

    // Delete.
    const onDelete = (id) => {
        users.value = users.value.filter(t => t.id !== id);
        console.log("Deleted user:", id);
    }

    // On Mount.
    onMounted(fetchUsers)
</script>

<template>
    <div class="w-full mx-auto p-6">
        <h2 class="text-3xl text-white font-bold mb-6 mt-12">
            Users
            <AddButton routeName="user_create" label="Add User" />
        </h2>
        <UsersTable :users="users" @edit="onEdit" @delete="onDelete"/>
    </div>
</template>
