<template>
  <div>
    <h1>Earnings</h1>
    <p>Total Earnings: {{ earnings }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useFinanceStore } from "@/store/finance.store";

export default defineComponent({
  name: "Earnings",
  setup() {
    const financeStore = useFinanceStore();

    onMounted(() => {
      financeStore.getInvoices(); // Assuming this will fetch earnings data
    });

    const earnings = computed(() => {
      // Assuming earnings are calculated from invoices
      return financeStore.invoices.reduce((total, invoice) => total + invoice.total, 0);
    });

    return {
      earnings,
    };
  },
});
</script>

<style scoped></style>
