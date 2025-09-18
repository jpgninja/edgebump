<script setup>
import EditControlButton from "../buttons/EditControlButton.vue";
import DeleteControlButton from "../buttons/DeleteControlButton.vue";
import AddButton from "../buttons/AddButton.vue";

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(["edit", "delete"]);
</script>

<template>
  <div v-if="users.length" class="w-full max-w-[90rem] mx-auto p-6 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg overflow-hidden float hover:scale-[1.02] transition-transform">
    <table class="w-full table-auto text-white">
      <thead class="bg-slate-700/50 backdrop-blur-sm rounded-xl">
        <tr>
          <th class="text-left p-3 border-b border-white/10">Date</th>

          <th class="text-left p-3 border-b border-white/10">&nbsp;</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="hover:bg-slate-700/40 transition-colors rounded-lg"
        >
          <td class="p-3 border-b border-white/10">{{ user.date || 'N/A' }}</td>
          <td class="p-3 border-b border-white/10 align-middle">
            <div class="flex justify-center items-center gap-2">
              <EditControlButton :id="user.id" routeName="user_edit" />
              <DeleteControlButton :id="user.id" :onDelete="deleteUser" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="text-center py-6">
    No Users.
    <AddButton routeName="user_create" label="Add Your First User"/>
  </div>
</template>
