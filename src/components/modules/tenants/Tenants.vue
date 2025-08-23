<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">Tenants</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span>
          <span class="text-blue-600 font-medium"> Tenants</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Tenants Card -->
    <div v-else class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 animate-slide-up">
      <div class="flex justify-between items-center">
        <div class="title">
          <h4 class="font-semibold text-lg text-gray-800">All Tenants</h4>
          <span class="text-gray-500 text-sm">
            You have
            <span class="font-semibold text-gray-700">
              {{ store.tenants?.length?.toLocaleString() || 0 }}
            </span>
            tenants
          </span>
        </div>
        <button
          @click="addItem"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
        >
          ➕ Add Tenant
        </button>
      </div>

      <hr class="my-4" />

      <!-- Table -->
      <div class="overflow-x-auto w-full">
        <table class="w-full border-collapse text-sm" ref="dataTableRef">
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th class="t-th text-left">Tenant Name</th>
              <th class="t-th text-left">Email</th>
              <th class="t-th text-left">Phone Number</th>
              <th class="t-th text-left">Emergency Number</th>
              <th class="t-th text-left">ID Number</th>
              <th class="t-th text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in store.tenants"
              :key="index"
              :class="index % 2 != 0 ? 'bg-gray-50' : ''"
              class="hover:bg-blue-50/40 transition-colors duration-300"
            >
              <td class="t-td font-semibold text-gray-700">
                <router-link
                  :to="{ name: 'tenancies', params: { id: item.id } }"
                  class="hover:text-blue-600"
                >
                  {{ item.tenant_name }}
                </router-link>
              </td>
              <td class="t-td">{{ item.email }}</td>
              <td class="t-td">{{ item.phone }}</td>
              <td class="t-td">{{ item.emergency_phone }}</td>
              <td class="t-td font-medium">{{ item.id_number }}</td>
              <td class="t-td text-center">
                <div class="flex justify-center space-x-2">
                  <router-link
                    :to="{ name: 'tenancies', params: { id: item.id } }"
                    class="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300"
                  >
                    View
                  </router-link>
                  <button @click="editItem(item)" class="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300">
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
            {{ action === "create" ? "Add" : "Edit" }} Tenant
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <TenantFormModal
        @close-modal="dialogVisible = false"
        :form="formData"
        :action="action"
        :key="(dialogVisible as any)"
      ></TenantFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { initDataTable } from "@/composables/dataTables";
import { useTenantsStore } from "@/store/tenants.store";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const TenantFormModal = defineAsyncComponent(
  () => import("@/components/modules/tenants/TenantFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const store = useTenantsStore();
const formData = ref({});

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const addItem = () => {
  action.value = "create";
  formData.value = {};
  dialogVisible.value = true;
};

const editItem = (item: any) => {
  action.value = "edit";
  formData.value = item;
  dialogVisible.value = true;
};

onMounted(async () => {
  loading.value = true;
  try {
    await store.getTenants();
  } catch (error) {
    console.error("Failed to fetch tenants:", error);
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
