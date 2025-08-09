<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Tenant Bills</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Tenant Bills
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Tenant Bills </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.tenantBills.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Tenant Bills</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.tenantBills.reduce((a, b) => Number(a) + Number(b.amount_paid),
              0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Paid</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.tenantBills.reduce((a, b) => Number(a) + (Number(b.amount) -
              Number(b.amount_paid)), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Tenant Bills</h4>
            <span class="text-gray-400 text-sm"> {{ store.tenantBills.length }} items found </span>
          </div>
          <div class="actions flex gap-2 my-auto">
            <el-select @change="filterBills" placeholder="Year" v-model="params.year" clearable
              class="!w-[110px] !py-1 h-[42px]">
              <el-option v-for="item in years" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select @change="filterBills" v-model="params.month" placeholder="Month" clearable
              class="!w-[110px] !py-1 h-[42px]">
              <el-option v-for="item in months" :key="item" :label="item" :value="item" />
            </el-select>
            <button @click="dialogVisible = true" class="btn-primary my-auto mt-1 h-[35px]"
              v-if="store.tenantBills.length == 0 && params.year && params.month">
              Generate Bills
            </button>
          </div>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Bill #
                </th>
                <th class="t-th">
                  Tenant
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
              <tr v-for="(item, index) in store.tenantBills" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <router-link class="font-semibold py-2" :to="{
                    name: 'tenant-bill',
                    params: { id: item.id },
                  }">
                    {{ item.bill_number }}
                  </router-link>
                </td>
                <td class="t-td">
                  {{ item.tenant_name }}
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
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="30%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Generate Bills
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <GenerateTenantBillModal @close-modal="dialogVisible = false" :form="params" :action="action">
      </GenerateTenantBillModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { useTenantBillsStore } from "@/store/tenant-bills.store";

const GenerateTenantBillModal = defineAsyncComponent(
  () => import("@/components/modules/tenant-bills/GenerateTenantBillModal.vue")
);

const params = ref({
  year: "",
  month: "",
})

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear + 1];
  for (let i = currentYear; i > currentYear - 3; i--) {
    years.push(i);
  }
  return years;
});


const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const store = useTenantBillsStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const filterBills = () => {
  store.getTenantBills(params.value);
}

onMounted(async () => {
  await store.getTenantBills({});
  initDataTable(dataTableRef.value);
  loading.value = false;

});
</script>

<style></style>
