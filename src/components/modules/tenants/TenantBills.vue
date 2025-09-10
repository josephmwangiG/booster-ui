<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Tenants</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Tenants ></span> Tenant Details
        </span>
      </div>
    </div>

    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Tenant  | {{ store.tenant?.tenant_name }}</h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ (store.tenant?.bills?.length || 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Bills</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (store.tenant?.bills ?? []).reduce((a: number, b: any) => Number(a) +
              Number(b.amount_paid), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Paid</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (store.tenant?.bills ?? []).reduce((a: number, b: any) => Number(a) + (Number(b.amount)
              - Number(b.amount_paid)), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>
      <nav class="flex space-x-8 mt-6" aria-label="Tabs">
        <router-link :to="{ name: 'tenancies', params: { id: store?.tenant?.id } }" class="tab-item">
          <span>Tenancies</span>
        </router-link>
        <span class="tab-item border-gray-700 text-gray-700">
          <span>Tenant Bills</span>
        </span>

      </nav>

      <div class="space-y-6 p-3 lg:p-6 lg:mt-6 bg-white col-span-3 !mt-0">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Bills</h4>
            <span class="text-gray-400 text-sm"> {{ (store?.tenant?.bills?.length || 0) }} items found </span>
          </div>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Bill #
                </th>
                <th class="t-th">Period</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Balance</th>
                <th class="t-th">Due Date</th>
                <th class="t-th">Status</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in (store.tenant?.bills ?? [])" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <router-link class="font-semibold py-2" :to="{
                    name: 'tenant-bill',
                    params: { id: item.id },
                  }">
                    {{ item.bill_number }}
                  </router-link>
                </td>

                <td class="t-td">
                  {{
                    item.period
                  }}
                </td>
                <td class="t-td">KES {{ item.amount.toLocaleString() }} </td>
                <td class="t-td">KES {{ item.payment_status == 'Paid' ? 0 : (item.amount -
                  item.amount_paid).toLocaleString() }} </td>

                <td class="t-td">
                  {{
                    formatDate(item.due_date)
                  }}
                </td>

                <td class="t-td">

                  <span v-if="item.payment_status == 'Paid'" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    {{ item.payment_status }}
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    {{ item.payment_status }}
                  </span>
                </td>

                <td class="t-td text-end">
                  <el-dropdown trigger="click">
                    <span
                      class="el-dropdown-link inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-100 px-2 py-1 lg:px-3 lg:py-2 text-sm text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50">
                      Action
                      <el-icon class="el-icon--right">
                        <i class="ri-arrow-down-s-line"></i>
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-item>
                        <router-link class="font-semibold py-2" :to="{
                          name: 'tenant-bill',
                          params: { id: item.id },
                        }"><i class="ri-external-link-line text-orange-500"></i>
                          View</router-link>
                      </el-dropdown-item>
                    </template>
                  </el-dropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { onMounted, ref } from "vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { useRouter } from "vue-router";
import { useTenantsStore } from "@/store/tenants.store";

const loading = ref(true);
const router = useRouter();
const store = useTenantsStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);


onMounted(async () => {
  await store.getTenant((router.currentRoute.value.params.id as string) || "");
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
