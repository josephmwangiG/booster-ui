<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Properties</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Properties
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Properties </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ store.properties.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Properties</span>
          </div>
       
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Properties</h4>
            <span class="text-gray-400 text-sm"> {{ filteredProperties.length }} of {{ store.properties.length }} items found  </span>
          </div>
          <button @click="dialogVisible = true" class="btn-primary my-auto">
            Create Property
          </button>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Properties"
          :enable-category-filter="true"
          category-label="Type"
          :categories="propertyTypeOptions"
          @search="handleSearch"
          @category-filter="handleTypeFilter"
          @clear-filters="handleClearFilters"
        />
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Property Name
                </th>
                <th class="t-th">Type</th>
                <th class="t-th">Address</th>
                <th class="t-th">Units</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in filteredProperties" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <router-link :to="{ name: 'property', params: { id: item.id } }">
                    <span>{{
                      item.name
                      }}</span>

                  </router-link>
                </td>
                <td class="t-td">
                  {{
                    item.type
                  }}
                </td>
                <td class="t-td">{{ item.address }}</td>
                <td class="t-td font-semibold">
                  {{ Number(item.units_count || 0).toLocaleString() }}
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
                        <el-dropdown-item>
                          <router-link class="font-semibold py-2" :to="{
                            name: 'property',
                            params: { id: item.id },
                          }"><i class="ri-external-link-line text-orange-500"></i>
                            View</router-link>
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
            Create Property
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <PropertyFormModal @close-modal="dialogVisible = false" :form="formData"></PropertyFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref, computed } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import SearchAndFilter from "@/components/shared/SearchAndFilter.vue";
import { initDataTableWithSearch, handleSearch as dtHandleSearch, handleColumnSearch, clearAllFilters } from "@/composables/dataTables";
import { usePropertiesStore } from "@/store/properties.store";

const PropertyFormModal = defineAsyncComponent(
  () => import("@/components/modules/properties/PropertyFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const store = usePropertiesStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const formData = {};

// Search and filter state
const searchQuery = ref('');
const selectedType = ref('');

// Property type options for filtering
const propertyTypeOptions = computed(() => {
  const types = [...new Set(store.properties.map((prop: any) => prop.type))].filter(Boolean);
  return types.map(type => ({ value: type, label: type }));
});

// Filtered properties
const filteredProperties = computed(() => {
  let filtered = store.properties;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((property: any) => 
      property.name?.toLowerCase().includes(query) ||
      property.type?.toLowerCase().includes(query) ||
      property.address?.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (selectedType.value) {
    filtered = filtered.filter((property: any) => property.type === selectedType.value);
  }

  return filtered;
});

// Search and filter handlers
const handleSearch = (query: string) => {
  searchQuery.value = query;
  if (dataTableRef.value) {
    dtHandleSearch(dataTableRef.value, query);
  }
};

const handleTypeFilter = (type: string) => {
  selectedType.value = type;
  if (dataTableRef.value) {
    handleColumnSearch(dataTableRef.value, 1, type); // Type column is index 1
  }
};

const handleClearFilters = () => {
  searchQuery.value = '';
  selectedType.value = '';
  if (dataTableRef.value) {
    clearAllFilters(dataTableRef.value);
  }
};

onMounted(async () => {
  await store.getProperties();
  initDataTableWithSearch(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
