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
        <h4 class="font-semibold">Tenant | {{ store.tenant?.tenant_name }}</h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.tenant?.tenancies?.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Tenancies</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.tenant?.tenancies?.filter((t: any) => t.active).length.toLocaleString()
              }}</h2>
            <span class="text-gray-400 text-sm">Active</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.tenant?.tenancies?.filter((t: any) => !t.active).length.toLocaleString()
              }}</h2>
            <span class="text-gray-400 text-sm">Expired</span>
          </div>
        </div>
      </div>
      <nav class="flex space-x-8 mt-6" aria-label="Tabs">
        <span class="tab-item border-gray-700 text-gray-700">
          <span>Tenancies</span>
        </span>
        <router-link :to="{ name: 'single-tenant-bills', params: { id: store?.tenant?.id } }" class="tab-item">
          <span>Tenant Bills</span>
        </router-link>

      </nav>

      <div class="space-y-6 p-3 lg:p-6 lg:mt-6 bg-white col-span-3 !mt-0">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Tenancies</h4>
            <span class="text-gray-400 text-sm"> {{ store?.tenant?.tenancies?.length }} items found </span>
          </div>
          <button @click="dialogVisible = true" class="btn-primary my-auto">
            Add Tenancy
          </button>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Property
                </th>
                <th class="t-th">
                  Unit
                </th>
                <th class="t-th">Rent</th>
                <th class="t-th">Start Date</th>
                <th class="t-th">End Date</th>
                <th class="t-th">Status</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in store?.tenant?.tenancies" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.unit?.property?.name }}
                </td>
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.unit?.unit_code }}
                </td>
                <td class="t-td font-semibold">
                  KES {{ Number(item.rent_amount).toLocaleString() }}
                </td>
                <td class="t-td">
                  {{ formatDate(item.start_date) }}
                </td>

                <td class="t-td">{{ formatDate(item.end_date) }}</td>

                <td class="t-td">

                  <span v-if="item.active" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    Active
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    Expired
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
                      <el-dropdown-menu>
                        <el-dropdown-item @click="endTenancy(item)" v-if="item.active">
                          <span class="font-semibold py-2"><i class="ri-close-line text-orange-500"></i>
                            End Tenancy</span>
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
            Add Tenancy
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <TenancyFormModal @close-modal="dialogVisible = false" :form="formData"></TenancyFormModal>
    </el-dialog>
    <el-dialog v-model="endTenancyDialogVisible" :show-close="false" style="min-width: 300px" width="40%" :key="endTenancyDialogVisible">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            End Tenancy
          </h3>
          <CloseBtnComponent @click="endTenancyDialogVisible = false" />
        </div>
      </template>
      <EndTenancyModal @close-modal="endTenancyDialogVisible = false" :form="formData"></EndTenancyModal>
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
import { useTenantsStore } from "@/store/tenants.store";

const TenancyFormModal = defineAsyncComponent(
  () => import("@/components/modules/tenants/TenancyFormModal.vue")
);

const EndTenancyModal = defineAsyncComponent(
  () => import("@/components/modules/tenants/EndTenancyModal.vue")
);


const dialogVisible = ref(false);
const endTenancyDialogVisible = ref(false);
const loading = ref(true);
const router = useRouter();
const store = useTenantsStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const formData = ref({
  tenant_id: (router.currentRoute.value.params.id as string) || "",
});

const endTenancy = (item: any) => {
  formData.value = item;
  endTenancyDialogVisible.value = true;
};


onMounted(async () => {
  await store.getTenant((router.currentRoute.value.params.id as string) || "");
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
