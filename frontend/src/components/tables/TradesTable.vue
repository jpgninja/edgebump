<script setup>
import { ref, watch } from "vue";
import { formatDate } from "../../utils/date.js";
import { token } from "../../stores/auth.js";

import OpenTradeProgress from "../OpenTradeProgress.vue";
import EditControlButton from "../buttons/EditControlButton.vue";
import DeleteControlButton from "../buttons/DeleteControlButton.vue";
import AddButton from "../buttons/AddButton.vue";

const props = defineProps({
  trades: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(["edit", "delete"]);

// Local reactive copy for manipulation
const localTrades = ref([...props.trades]);

// Keep local copy in sync when parent updates prop
watch(
  () => props.trades,
  (newTrades) => {
    localTrades.value = [...newTrades];
  },
  { deep: true }
);

const deleteTrade = async (id) => {
  const res = await fetch(`http://localhost:3000/api/trades/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token.value}`
    }
  });

  if (res.ok) {
    localTrades.value = localTrades.value.filter((p) => p.id !== id);
    emits("delete", id);
  } else {
    console.error("Failed to delete trade");
  }
};
</script>

<template>
  <div v-if="localTrades.length" class="w-full max-w-[90rem] mx-auto p-6 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg overflow-hidden float hover:scale-[1.02] transition-transform">
    <table class="w-full table-auto text-white">
      <thead class="bg-slate-700/50 backdrop-blur-sm rounded-xl">
        <tr>
          <th class="text-left p-3 border-b border-white/10">Date</th>
          <th class="text-left p-3 border-b border-white/10">Pattern</th>
          <th class="text-left p-3 border-b border-white/10">Ticker</th>
          <th class="text-left p-3 border-b border-white/10">Direction</th>
          <th class="text-left p-3 border-b border-white/10">Entry</th>
          <th class="text-left p-3 border-b border-white/10">R:R</th>
          <th class="text-left p-3 border-b border-white/10">Progress</th>
          <th class="text-left p-3 border-b border-white/10">PnL</th>
          <th class="text-left p-3 border-b border-white/10">&nbsp;</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="trade in localTrades" :key="trade.id" class="hover:bg-slate-700/40 transition-colors rounded-lg">
          <td class="p-3 border-b border-white/10">{{ formatDate(trade.created_at) }}</td>
          <td class="p-3 border-b border-white/10 font-medium">{{ trade.pattern_name }}</td>
          <td class="p-3 border-b border-white/10">{{ trade.ticker.toUpperCase() }}</td>
          <td class="p-3 border-b border-white/10 capitalize">
            <span :class="trade.direction === 'long' ? 'text-green-400' : 'text-red-400'">{{ trade.direction }}</span>
          </td>
          <td class="p-3 border-b border-white/10">{{ trade.avg_entry }}</td>
          <td class="p-3 border-b border-white/10">1.4R</td>
          <td class="p-3 border-b border-white/10">
            <OpenTradeProgress
              :entry="trade.avg_entry"
              :tp="trade.take_profit"
              :sl="trade.stop_loss"
              :currentPrice="trade.currentPrice || trade.avg_entry"
            />
          </td>
          <td class="p-3 border-b border-white/10">
            {{ parseFloat(trade.total_pnl) > 0 ? trade.total_pnl : `(${ parseInt(trade.total_pnl, 10) })` }}
          </td>
          <td class="p-3 border-b border-white/10 align-middle">
            <div class="flex justify-center items-center gap-2">
              <EditControlButton :id="trade.id" routeName="trade_edit" />
              <DeleteControlButton
                :id="trade.id"
                confirmMessage="Are you sure you want to delete this trade?"
                :onDelete="deleteTrade"
                label="🗑️"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="text-center py-6">
    No Trades.
    <AddButton routeName="trade_create" label="Add Your First Trade"/>
  </div>
</template>
