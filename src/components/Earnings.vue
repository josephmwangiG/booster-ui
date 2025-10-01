<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Earnings</h1>
      <p class="text-gray-600">Track your revenue and financial performance</p>
    </div>

    <!-- Earnings Card -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="flex items-center">
        <div class="p-2 bg-green-100 rounded-lg">
          <i class="ri-money-dollar-circle-line text-green-600 text-xl"></i>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Earnings</p>
          <p class="text-2xl font-bold text-gray-900">{{ earnings }}</p>
        </div>
      </div>
    </div>

    <!-- Earnings Chart -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Earnings Over Time</h3>
      <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
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

    const series = [
      {
        name: "Earnings",
        data: [1200, 1900, 3200, 4200, 3800, 5500, 6200, 5800, 7200, 6800, 8200, 9000],
      },
    ];

    const chartOptions = {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2023-01-01T00:00:00.000Z",
          "2023-02-01T00:00:00.000Z",
          "2023-03-01T00:00:00.000Z",
          "2023-04-01T00:00:00.000Z",
          "2023-05-01T00:00:00.000Z",
          "2023-06-01T00:00:00.000Z",
          "2023-07-01T00:00:00.000Z",
          "2023-08-01T00:00:00.000Z",
          "2023-09-01T00:00:00.000Z",
          "2023-10-01T00:00:00.000Z",
          "2023-11-01T00:00:00.000Z",
          "2023-12-01T00:00:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    };

    return {
      earnings,
      series,
      chartOptions,
    };
  },
});
</script>

<style scoped></style>