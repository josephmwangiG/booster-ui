<template>
    <AdminDashboard v-if="authStore.user.type === 'admin'"/>
    <div v-else class="content">
        <div class="top-section">
            <div class="bread-crumb">
                <h5 class="font-semibold">Dashboard</h5>
                <span class="text-sm">
                    <span class="text-gray-400">Home ></span> Dashboard
                </span>
            </div>
        </div>
        <div class="mt-5">
            <div class="overflow-auto">
                <div class="grid lg:grid-cols-3 grid-cols-1 lg:gap-6">
                    <div class="col-span-1 space-y-6 p-6 mt-6 bg-white">
                        <div class="flex justify-between">
                            <h4 class="font-semibold">Products Summary</h4>
                        </div>
                        <div id="chart">
                            <apexchart
                              v-if="Array.isArray(series) && series.length > 0 && series.some((v: any) => v > 0) && options && (options as any).chart && (options as any).chart.type"
                              type="donut"
                              class="w-full"
                              :options="options"
                              :series="series"
                            />
                            <div v-else class="text-gray-400 text-sm py-6">No data available</div>
                        </div>
                    </div>
                    <div class="col-span-2 space-y-6 p-6 mt-6 bg-white">
                        <h4>Orders Report</h4>
                        <span class="text-gray-400 text-sm">
                            Total {{ (reportsStore.dashboardReports?.orders || []).length }} recent orders
                        </span>
                        <div class="w-full overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr>
                                        <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                                            Item
                                        </th>
                                        <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                                            Order ID
                                        </th>
                                        <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                                            Date Sold
                                        </th>
                                        <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                                            Price
                                        </th>
                                        <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="(item, index) in (toRaw(reportsStore.dashboardReports.orders) || [])" :key="index"
                                        :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                                        <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                                            {{ item.category || '-' }}
                                        </td>
                                        <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                                            {{ item.order_number || '-' }}
                                        </td>
                                        <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                                            {{ formatDate(item.created_at) }}
                                        </td>
                                        <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                                            {{ formatAmount(item.total) }}
                                        </td>
                                        <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                                            Actions
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/auth.store";
import { useReportsStore } from "@/store/report.store";
import { formatAmount } from "@/composables/helper_functions";
import { formatDate } from "@/composables/dataTables";
import AdminDashboard from "./AdminDashboard.vue";
import { toRaw } from "vue";

const authStore = useAuthStore();
const reportsStore = useReportsStore();



const series = ref<any[]>([]);
const options = ref({});

onMounted(async () => {
    if (authStore.user.type !== 'admin') {
        await reportsStore.getVendorDashboardReports();
        console.log("Hammond!");
        const rawOrders = toRaw(reportsStore.dashboardReports.orders);
        console.log(rawOrders);

        const vendor = (authStore.user && authStore.user.vendor) ? authStore.user.vendor : {} as any;
        series.value = [
            vendor.stores_count || 0,
            vendor.products_count || 0,
            vendor.brands_count || 0,
        ];

        options.value = {
            chart: {
                type: "donut",
            },
            labels: [
                "Stores " + authStore.user.vendor.stores_count,
                "Products " + authStore.user.vendor.products_count,
                "Brands " + authStore.user.vendor.brands_count,
            ],
            dataLabels: {
                enabled: true,
                formatter: function (_val: any, opts: any) {
                    return series.value[opts.seriesIndex];
                },
                dropShadow: {
                    enabled: false,
                },
            },
        };
    }
});
</script>

<style></style>
