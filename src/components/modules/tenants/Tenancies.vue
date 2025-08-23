<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">Tenant Details</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Tenants ></span>
          <span class="text-blue-600 font-medium"> Tenant Details</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Tenant Details Card -->
    <div v-else>
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6 rounded-2xl shadow-lg animate-slide-up">
        <h4 class="font-semibold text-lg text-gray-800">Tenant | {{ store.tenant?.tenant_name }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 mt-4 gap-6">
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-gray-900">{{ store.tenant?.tenancies?.length.toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Tenancies</span>
          </div>
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-green-600">{{ store.tenant?.tenancies?.filter((t: any) => t.active).length.toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Active</span>
          </div>
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-red-600">{{ store.tenant?.tenancies?.filter((t: any) => !t.active).length.toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Expired</span>
          </div>
        </div>
      </div>

      <nav class="flex space-x-8 mt-6" aria-label="Tabs">
        <span class="tab-item border-gray-700 text-gray-700">
          <span>Tenancies</span>
        </span>
        <router-link
          :to="{ name: 'single-tenant-bills', params: { id: store?.tenant?.id } }"
          class="tab-item"
        >
          <span>Tenant Bills</span>
        </router-link>
      </nav>

      <div class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 mt-0 animate-slide-up">
        <div class="flex justify-between items-center">
          <div class="title">
            <h4 class="font-semibold text-lg text-gray-800">Tenancies</h4>
            <span class="text-gray-500 text-sm">
              {{ store?.tenant?.tenancies?.length }} items found
            </span>
          </div>
          <button
            @click="dialogVisible = true"
            class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
          >
            ➕ Add Tenancy
          </button>
        </div>

        <hr class="my-4" />

        <!-- Table -->
        <div class="overflow-x-auto w-full">
          <table class="w-full border-collapse text-sm" ref="dataTableRef">
            <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th class="t-th text-left">Property</th>
                <th class="t-th text-left">Unit</th>
                <th class="t-th text-right">Rent</th>
                <th class="t-th text-left">Start Date</th>
                <th class="t-th text-left">End Date</th>
                <th class="t-th text-center">Status</th>
                <th class="t-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(item, index) in store?.tenant?.tenancies"
                :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''"
                class="hover:bg-blue-50/40 transition-colors duration-300"
              >
                <td class="t-td font-semibold text-gray-700">{{ item.unit?.property?.name }}</td>
                <td class="t-td">{{ item.unit?.unit_code }}</td>
                <td class="t-td text-right font-medium">KES {{ Number(item.rent_amount).toLocaleString() }}</td>
                <td class="t-td">{{ formatDate(item.start_date) }}</td>
                <td class="t-td">{{ formatDate(item.end_date) }}</td>
                <td class="t-td text-center">
                  <span
                    v-if="item.active"
                    class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-green-100 text-green-800"
                  >
                    Active
                  </span>
                  <span
                    v-else
                    class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-red-100 text-red-800"
                  >
                    Expired
                  </span>
                </td>
                <td class="t-td text-center">
                  <button v-if="item.active" @click="endTenancy(item)" class="bg-red-100 text-red-700 hover:bg-red-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300">
                    End Tenancy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      style="min-width: 300px"
      width="40%"
    >
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Add Tenancy
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <TenancyFormModal
        @close-modal="dialogVisible = false"
        :form="formData"
      ></TenancyFormModal>
    </el-dialog>
    <el-dialog
      v-model="endTenancyDialogVisible"
      :show-close="false"
      style="min-width: 300px"
      width="40%"
      :key="endTenancyDialogVisible"
    >
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            End Tenancy
          </h3>
          <CloseBtnComponent @click="endTenancyDialogVisible = false" />
        </div>
      </template>
      <EndTenancyModal
        @close-modal="endTenancyDialogVisible = false"
        :form="formData"
      ></EndTenancyModal>
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
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

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
  loading.value = true;
  try {
    await store.getTenant((router.currentRoute.value.params.id as string) || "");
  } catch (error) {
    console.error("Failed to fetch tenant details:", error);
  } finally {
    loading.value = false;
  }
  initDataTable(dataTableRef.value);
});
</script>

<style scoped>
/* Modern table styles */
.t-th {
  @apply px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider;
}
.t-td {
  @apply px-4 py-3 text-sm text-gray-700;
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.7s ease-out;
}
</style>
