<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Tenants</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Tenants
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Tenants </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ filteredTenants.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Active Tenants</span>
          </div>
          
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Active Tenants</h4>
            <span class="text-gray-400 text-sm"> {{ filteredTenants.length }} active tenants found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Tenant
          </button>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Tenants"
          @search="handleSearch"
          @clear-filters="handleClearFilters"
        />
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef" v-if="filteredTenants.length > 0">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Tenant Name
                </th>
                <th class="t-th">Email</th>
                <th class="t-th">Phone Number</th>
                <th class="t-th">Emergency Number</th>
                <th class="t-th">ID Number</th>
                <th class="t-th">Property</th>
                <th class="t-th">Unit</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in filteredTenants" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <router-link :to="{ name: 'tenancies', params: { id: item.id } }">
                    <span>{{
                      item.tenant_name
                      }}</span>

                  </router-link>
                </td>
                <td class="t-td">
                  {{
                    item.email
                  }}
                </td>
                <td class="t-td">{{ item.phone }}</td>
                <td class="t-td">{{ item.emergency_phone }}</td>
                <td class="t-td font-semibold">
                  {{ item.id_number }}
                </td>
                <td class="t-td">
                  {{ getPropertyName(item) }}
                </td>
                <td class="t-td">
                  {{ getUnitName(item) }}
                </td>

                <td class="t-td text-end">
                  <el-dropdown trigger="click" teleported>
                    <span
                      class="el-dropdown-link inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-100 px-2 py-1 lg:px-3 lg:py-2 text-sm text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50">
                      Action
                      <el-icon class="el-icon--right">
                        <i class="ri-arrow-down-s-line"></i>
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <router-link class="font-semibold py-2" :to="{
                            name: 'tenancies',
                            params: { id: item.id },
                          }"><i class="ri-external-link-line text-orange-500"></i>
                            View</router-link>
                        </el-dropdown-item>
                        <el-dropdown-item @click="editItem(item)">
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
          
          <!-- No active tenants message -->
          <div v-else class="text-center py-12">
            <div class="text-gray-400 text-lg mb-2">
              <i class="ri-user-line text-4xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No Active Tenants</h3>
            <p class="text-gray-500 mb-4">There are currently no tenants with active tenancies.</p>
            <button @click="addItem" class="btn-primary">
              Add First Tenant
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action === "create" ? "Add" : "Edit" }} Tenant
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <TenantFormModal @close-modal="dialogVisible = false" :form="formData" :action="action" :key="(dialogVisible as any)"></TenantFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref, computed } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import SearchAndFilter from "@/components/shared/SearchAndFilter.vue";
import { initDataTableWithSearch, handleSearch as dtHandleSearch, clearAllFilters } from "@/composables/dataTables";
import { useTenantsStore } from "@/store/tenants.store";

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

// Search and filter state
const searchQuery = ref('');

// Filtered tenants - only show tenants with active tenancies
const filteredTenants = computed(() => {
  let filtered = store.tenants.filter((tenant: any) => {
    // Only show tenants with active tenancies
    return tenant.tenancies && tenant.tenancies.some((t: any) => t.active);
  });

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((tenant: any) => 
      tenant.tenant_name?.toLowerCase().includes(query) ||
      tenant.email?.toLowerCase().includes(query) ||
      tenant.phone?.toLowerCase().includes(query) ||
      tenant.emergency_phone?.toLowerCase().includes(query) ||
      tenant.id_number?.toLowerCase().includes(query) ||
      getPropertyName(tenant)?.toLowerCase().includes(query) ||
      getUnitName(tenant)?.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const addItem = () => {
  action.value = "create";
  formData.value = {
    id: null,
    tenant_name: '',
    email: '',
    phone: '',
    emergency_phone: '',
    id_number: '',
    property_id: '',
    unit_id: ''
  };
  dialogVisible.value = true;
};

const editItem = (item: any) => {
  action.value = "edit";
  
  // Extract property_id and unit_id from active tenancy
  let property_id = '';
  let unit_id = '';
  
  if (item.tenancies && item.tenancies.length > 0) {
    const activeTenancy = item.tenancies.find((t: any) => t.active);
    if (activeTenancy && activeTenancy.unit) {
      unit_id = activeTenancy.unit.id;
      if (activeTenancy.unit.property) {
        property_id = activeTenancy.unit.property.id;
      }
    }
  }
  
  formData.value = {
    ...item,
    property_id: property_id,
    unit_id: unit_id
  };
  dialogVisible.value = true;
};

const getPropertyName = (tenant: any) => {
  if (tenant.tenancies && tenant.tenancies.length > 0) {
    const activeTenancy = tenant.tenancies.find((t: any) => t.active);
    if (activeTenancy && activeTenancy.unit && activeTenancy.unit.property) {
      return activeTenancy.unit.property.name;
    }
  }
  return 'No Property Assigned';
};

const getUnitName = (tenant: any) => {
  if (tenant.tenancies && tenant.tenancies.length > 0) {
    const activeTenancy = tenant.tenancies.find((t: any) => t.active);
    if (activeTenancy && activeTenancy.unit) {
      return activeTenancy.unit.unit_code;
    }
  }
  return 'No Unit Assigned';
};

// Search and filter handlers
const handleSearch = (query: string) => {
  searchQuery.value = query;
  if (dataTableRef.value) {
    dtHandleSearch(dataTableRef.value, query);
  }
};

const handleClearFilters = () => {
  searchQuery.value = '';
  if (dataTableRef.value) {
    clearAllFilters(dataTableRef.value);
  }
};

onMounted(async () => {
  await store.getTenants();
  initDataTableWithSearch(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
