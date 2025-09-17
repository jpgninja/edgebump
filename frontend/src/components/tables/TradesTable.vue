<script setup>
import { defineProps, defineEmits } from "vue";
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
</script>

<template>
  <div v-if="trades.length" class="w-full max-w-[90rem] mx-auto p-6 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg overflow-hidden float hover:scale-[1.02] transition-transform">
    <table class="w-full table-auto text-white">
      <thead class="bg-slate-700/50 backdrop-blur-sm rounded-xl">
        <tr>
          <th class="text-left p-3 border-b border-white/10">Date</th>
          <th class="text-left p-3 border-b border-white/10">Pattern</th>
          <th class="text-left p-3 border-b border-white/10">Ticker</th>
          <th class="text-left p-3 border-b border-white/10">Direction</th>
          <th class="text-left p-3 border-b border-white/10">Entry</th>
          <th class="text-left p-3 border-b border-white/10">Progress</th>
          <th class="text-left p-3 border-b border-white/10">Confluences</th>
          <th class="text-left p-3 border-b border-white/10">&nbsp;</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="trade in trades"
          :key="trade.id"
          class="hover:bg-slate-700/40 transition-colors rounded-lg"
        >
          <td class="p-3 border-b border-white/10">{{ trade.date || 'N/A' }}</td>
          <td class="p-3 border-b border-white/10 font-medium">{{ trade.pattern_name }}</td>
          <td class="p-3 border-b border-white/10">{{ trade.ticker.toUpperCase() }}</td>
          <td class="p-3 border-b border-white/10 capitalize">
            <span :class="trade.direction === 'long' ? 'text-green-400' : 'text-red-400'">{{ trade.direction }}</span>
          </td>
          <td class="p-3 border-b border-white/10">{{ trade.avg_entry }}</td>
          <td class="p-3 border-b border-white/10">
            <OpenTradeProgress
              :entry="trade.avg_entry"
              :tp="trade.take_profit"
              :sl="trade.stop_loss"
              :currentPrice="trade.currentPrice || trade.avg_entry"
            />
          </td>
          <td class="p-3 border-b border-white/10">
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="signal in trade.signals || []"
                :key="signal.id"
                class="bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full hover:scale-105 transition-transform"
              >
                {{ signal.name }}
              </li>
            </ul>
          </td>
          <td class="p-3 border-b border-white/10 align-middle">
            <div class="flex justify-center items-center gap-2">
              <EditControlButton :id="trade.id" @click="$emit('edit', trade)" />
              <DeleteControlButton :id="trade.id" :onDelete="() => $emit('delete', trade.id)" />
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
