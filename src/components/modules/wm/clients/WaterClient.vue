<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Clients</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Clients ></span> Client Details
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Client | {{ store?.client?.client_name }}</h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.client?.bills?.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Bills</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.client?.bills.reduce((a: any, b: any) => Number(a) +
              Number(b.amount_paid),
              0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Paid</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.client?.bills.reduce((a: any, b: any) => Number(a) + (Number(b.amount) -
              Number(b.amount_paid)), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Bills</h4>
            <span class="text-gray-400 text-sm"> {{ store?.client?.tenancies?.length }} items found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Bill
          </button>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Bill #
                </th>
                <th class="t-th">From</th>
                <th class="t-th">To</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Balance</th>
                <th class="t-th">Due Date</th>
                <th class="t-th">Status</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in store?.client?.bills" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.bill_number }}
                </td>
                <td class="t-td">
                  {{ formatDate(item.from) }}
                </td>
                <td class="t-td">
                  {{ formatDate(item.to) }}
                </td>
                <td class="t-td font-semibold">
                  KES {{ Number(item.amount).toLocaleString() }}
                </td>
                <td class="t-td font-semibold">
                  KES {{ (Number(item.amount) - Number(item.amount_paid)).toLocaleString() }}
                </td>

                <td class="t-td">{{ formatDate(item.due_date) }}</td>

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
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Add Bill
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <WaterClientBillFormModal @close-modal="dialogVisible = false" :form="formData"></WaterClientBillFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { useRouter } from "vue-router";
import { useWaterClientsStore } from "@/store/water-clients.store";

const WaterClientBillFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/water-client-bills/WaterClientBillFormModal.vue")
);

const formData = ref({})

const dialogVisible = ref(false);
const loading = ref(true);
const router = useRouter();
const store = useWaterClientsStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const addItem = () => {
  dialogVisible.value = true;
  formData.value = {
    water_client_id: (router.currentRoute.value.params.id as string) || "",
  };

}

onMounted(async () => {
  await store.getClient((router.currentRoute.value.params.id as string) || "");
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
