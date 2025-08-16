<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Money Collection</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Money Collection
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Money Collection </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ store.waterCollections.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Records</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterCollections.reduce((a, b) =>
              Number(a) + Number(b.amount), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Records</h4>
            <span class="text-gray-400 text-sm"> {{ store.waterCollections.length }} items found </span>
          </div>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">Date</th>
                <th class="t-th">Meter</th>
                <th class="t-th">Payment Method</th>
                <th class="t-th">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in store.waterCollections" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ formatDate(item.created_at) }}
                </td>
                <td class="t-td font-semibold">
                  {{
                    item.code_number
                    }}
                </td>
                <td class="t-td font-semibold">
                  {{ item.payment_method }}
                </td>
                <td class="t-td font-semibold">
                  {{ formatAmount(item.amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%" :key="dialogVisible">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action === "create" ? "Add" : "Edit" }} Water Delivery
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <WaterDeliveryFormModal @close-modal="dialogVisible = false" :form="formData" :action="action">
      </WaterDeliveryFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { formatAmount } from "@/composables/helper_functions";
import { useWaterCollectionsStore } from "@/store/water-collections.store";

const WaterDeliveryFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/deliveries/WaterDeliveryFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const store = useWaterCollectionsStore();
const formData = ref({});

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);




onMounted(async () => {
  await store.getWaterCollections();
  initDataTable(dataTableRef.value);
  loading.value = false;

});
</script>

<style></style>
