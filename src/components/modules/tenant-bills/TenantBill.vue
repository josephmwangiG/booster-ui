<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Tenant Bills</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Tenant Bills ></span> Bill Details
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Bill Details | {{ store.tenantBill?.bill_number }} - {{ store.tenantBill?.tenant?.tenant_name }}</h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.tenantBill?.amount }}</h2>
            <span class="text-gray-400 text-sm">Total Bill</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.tenantBill?.bill_items?.length }}</h2>
            <span class="text-gray-400 text-sm">Items</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.tenantBill?.amount_paid.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Amount Paid</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Bill Items</h4>
            <span class="text-gray-400 text-sm"> {{ store?.tenantBill?.bill_items?.length }} items </span>
          </div>
          <div class="flex justify-end gap-2">
            <button @click="completeDialogVisible = true" class="btn-primary my-auto" v-if="store.tenantBill?.payment_status == 'Draft'">
              Complete
            </button>
            <button @click="dialogVisible = true" class="btn-primary my-auto hidden">
              Add Item
            </button>
          </div>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Item
                </th>
                <th class="t-th">Unit</th>
                <th class="t-th">Previous M. Reading</th>
                <th class="t-th">Current M. Reading</th>
                <th class="t-th">Consumption</th>
                <th class="t-th">Amount</th>
                <th class="t-th text-end" v-if="store.tenantBill?.payment_status == 'Draft'">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in store?.tenantBill?.bill_items" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.item_name }}
                </td>
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.unit?.unit_code }}
                </td>
                <td class="t-td font-semibold">
                  {{ item?.utility && item.utility.category == "Meter Reading" ?
                    Number(item.previous_meter_reading).toLocaleString() : "-" }}
                </td>
                <td class="t-td font-semibold">
                  {{ item?.utility && item.utility.category == "Meter Reading" ?
                    Number(item.current_meter_reading).toLocaleString() : "-" }}
                </td>
                <td class="t-td font-semibold">
                  {{ item?.utility && item.utility.category == "Meter Reading" ?
                    (Number(item.current_meter_reading) - Number(item.previous_meter_reading)).toLocaleString() : "-" }} {{ item?.utility && item.utility.category == "Meter Reading" ? "Units" : "" }}
                </td>
                <td class="t-td font-semibold">
                  KES {{ Number(item.amount).toLocaleString() }}
                </td>
                <td class="t-td text-end" v-if="store.tenantBill?.payment_status == 'Draft'">
                  <el-dropdown trigger="click">
                    <span
                      class="el-dropdown-link inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-100 px-2 py-1 lg:px-3 lg:py-2 text-sm text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50">
                      Action
                      <el-icon class="el-icon--right">
                        <i class="ri-arrow-down-s-line"></i>
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="editItem(item)" v-if="store.tenantBill?.payment_status == 'Draft'">
                          <span class="font-semibold py-2"><i class="ri-edit-line text-orange-500"></i>
                            Edit</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
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
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action == "create" ? "Add" : "Edit" }} Bill Item
          </h3>
          <CloseBtnComponent @click="closeModal" />
        </div>
      </template>
      <TenantBillItemFormModal @close-modal="closeModal" :form="formData" :action="action"
        :key="(dialogVisible as any)">
      </TenantBillItemFormModal>
    </el-dialog>

    <el-dialog v-model="completeDialogVisible" :show-close="false" style="min-width: 300px" width="30%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Complete Bill Editing
          </h3>
          <CloseBtnComponent @click="completeDialogVisible = false" />
        </div>
      </template>
      <CompleteTenantBillModal @close-modal="completeDialogVisible = false" :form="params"
        :key="(completeDialogVisible as any)">
      </CompleteTenantBillModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { initDataTable } from "@/composables/dataTables";
import { useRouter } from "vue-router";
import { useTenantBillsStore } from "@/store/tenant-bills.store";

const TenantBillItemFormModal = defineAsyncComponent(
  () => import("@/components/modules/tenant-bills/TenantBillItemFormModal.vue")
);
const CompleteTenantBillModal = defineAsyncComponent(
  () => import("@/components/modules/tenant-bills/CompleteTenantBillModal.vue")
);

const completeDialogVisible = ref(false);
const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const router = useRouter();
const store = useTenantBillsStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const params = ref({
  id: router.currentRoute.value.params.id as string,
});
const formData = ref({
});

const editItem = (item: any) => {
  action.value = "edit";
  formData.value = { ...item };
  dialogVisible.value = true;
};

const closeModal = () => {
  dialogVisible.value = false;
  formData.value = {};
};

onMounted(async () => {
  await store.getTenantBill((router.currentRoute.value.params.id as string) || "");
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
