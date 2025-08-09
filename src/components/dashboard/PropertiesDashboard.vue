<template>
  <div class="" v-if="!loading">
    <div class="col-span-2 space-y-6 mt-6">
      <div class="grid gap-y-3 lg:gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <div class="relative flex flex-col bg-clip-border rounded bg-white text-gray-700">
          <div class="flex justify-between p-3 lg:p-4">
            <div
              class="bg-clip-border rounded overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg grid h-16 w-16 place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                class="w-6 h-6 text-white">
                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                <path fill-rule="evenodd"
                  d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                  clip-rule="evenodd"></path>
                <path
                  d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z">
                </path>
              </svg>
            </div>
            <div class="text-right">
              <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Total Bills
              </p>
              <h4 class="block antialiased tracking-normal font-sans font-semibold leading-snug text-blue-gray-900">
                {{
                  formatAmount(reportsStore.propertiesDashboardReports?.tenant_bills_payment.total_amount)
                }}
              </h4>
            </div>
          </div>
          <div class="border-t border-blue-gray-50 p-4 pt-8">
            <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
              <strong class="text-green-500">
                {{
                  formatAmount(reportsStore.propertiesDashboardReports.tenant_bills_payment?.paid_amount)
                }}</strong>&nbsp; bills paid
            </p>
          </div>
        </div>
        <div class="relative flex flex-col bg-clip-border rounded bg-white text-gray-700">
          <div class="flex justify-between p-3 lg:p-4">
            <div
              class="bg-clip-border rounded overflow-hidden bg-gradient-to-tr from-orange-500 to-orange-300 text-white shadow-orange-500/40 shadow-lg grid h-16 w-16 place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                class="w-6 h-6 text-white">
                <path
                  d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z">
                </path>
              </svg>
            </div>
            <div class="text-right">
              <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Total Balance
              </p>
              <h4 class="block antialiased tracking-normal font-sans font-semibold leading-snug text-blue-gray-900">
                KES
                {{
                  formatAmount(reportsStore.propertiesDashboardReports.tenant_bills_payment?.pending_amount)
                }}
              </h4>
            </div>
          </div>
          <div class="border-t border-blue-gray-50 p-4 pt-8">
            <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
              <strong class="text-green-500">
                {{
                  reportsStore.propertiesDashboardReports.tenant_bills_payment?.pending_amount /
                  reportsStore.propertiesDashboardReports.tenant_bills_payment?.total_amount * 100
                }}%</strong>&nbsp; unpaid bills.
            </p>
          </div>
        </div>
        <div class="relative flex flex-col bg-clip-border rounded bg-white text-gray-700">
          <div class="flex justify-between p-3 lg:p-4">
            <div
              class="bg-clip-border rounded overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg grid h-16 w-16 place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                class="w-6 h-6 text-white">
                <path fill-rule="evenodd"
                  d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="text-right">
              <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Tenants
              </p>
              <h4 class="block antialiased tracking-normal font-sans font-semibold leading-snug text-blue-gray-900">
                {{ formatNumber(reportsStore.propertiesDashboardReports.tenants) }}
              </h4>
            </div>
          </div>
          <div class="border-t border-blue-gray-50 p-4 pt-8">
            <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
              <strong class="text-green-500">{{ reportsStore.propertiesDashboardReports.tenancies.toLocaleString()
                }}</strong>&nbsp; active
              tenancies
            </p>
          </div>
        </div>
        <div class="relative flex flex-col bg-clip-border rounded bg-white text-gray-700">
          <div class="flex justify-between p-3 lg:p-4">
            <div
              class="bg-clip- border rounded overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg grid h-16 w-16 place-items-center">
              <i class="ri-hotel-line"></i>
            </div>
            <div class="text-right">
              <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Properties
              </p>
              <h4 class="block antialiased tracking-normal font-sans font-semibold leading-snug text-blue-gray-900">
                {{ formatNumber(reportsStore.propertiesDashboardReports.properties) }}
              </h4>
            </div>
          </div>
          <div class="border-t border-blue-gray-50 p-4 pt-8">
            <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
              <strong class="text-green-500">100%</strong>&nbsp; active properties
            </p>
          </div>
        </div>

      </div>
    </div>
    <div class="mt-2 lg:mt-5">
      <div class="overflow-auto">
        <div class="grid lg:grid-cols-3 grid-cols-1 lg:gap-6">
          <div class="col-span-1 space-y-6 p-6 mt-6 bg-white">
            <div class="flex justify-between">
              <h4 class="font-semibold">Collections Summary</h4>
            </div>
            <div id="chart">
              <apexchart type="donut" class="w-full" :options="options" :series="series"></apexchart>
            </div>
          </div>
          <div class="col-span-2 space-y-6 p-6 mt-6 bg-white">
            <div class="flex justify-between">
              <div class="heading">
                <h4>Pending Bills</h4>
                <span class="text-gray-400 text-sm">
                  Overview of unpaid bills
                </span>
              </div>
              <router-link :to="{ name: 'tenant-bills' }" class="btn-primary-outline my-auto">View All</router-link>
            </div>
            <div class="w-full overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr>
                    <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                      Bill #
                    </th>
                    <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                      Tenant
                    </th>
                    <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                      Period
                    </th>
                    <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                      Amount
                    </th>
                    <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-end">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="(item, index) in reportsStore.propertiesDashboardReports
                    .bills" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                    <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500 font-semibold hover:underline">
                      {{
                        item.bill_number
                      }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                      {{
                        item.tenant_name
                      }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                      {{
                        item.period
                      }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                      {{ formatAmount(item.amount) }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500 text-end">
                      {{ formatAmount(item.amount - item.amount_paid) }}
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
  <div class="mt-6" v-else>
    <div class="flex align-middle items-center justify-center bg-white min-h-[80vh]">
      <div class="flex gap-2">
        <div class="w-5 h-5 rounded-full animate-pulse transition duration-75 bg-orange-500"></div>
        <div class="w-5 h-5 rounded-full animate-pulse transition duration-75 bg-orange-500"></div>
        <div class="w-5 h-5 rounded-full animate-pulse transition duration-75 bg-orange-500"></div>
        <div class="w-5 h-5 rounded-full animate-pulse transition duration-75 bg-orange-500"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatAmount, formatNumber } from "@/composables/helper_functions";
import { useReportsStore } from "@/store/report.store";
import { onMounted, ref } from "vue";

const loading = ref(true);
const reportsStore = useReportsStore();

const series: any = ref([])

const options = ref({
})
onMounted(async () => {
  await reportsStore.getPropertiesDashboardReports();
  series.value = [
    Number(reportsStore.propertiesDashboardReports?.tenant_rent_utility_bills?.total_rent) || 0,
    Number(reportsStore.propertiesDashboardReports?.tenant_rent_utility_bills?.total_utilities) || 0,
  ];

  options.value = {
    chart: {
      type: "donut",
    },
    labels: [
      "Rent " + formatAmount(reportsStore.propertiesDashboardReports?.tenant_rent_utility_bills?.total_rent),
      "Utilities " + formatAmount(reportsStore.propertiesDashboardReports?.tenant_rent_utility_bills?.total_utilities),
    ],
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
  };

  loading.value = false;
});
</script>
