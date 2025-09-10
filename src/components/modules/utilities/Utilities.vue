<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Utilities</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Utilities
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Utilities </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ store.utilities.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Utilities</span>
          </div>

        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Utilities</h4>
            <span class="text-gray-400 text-sm"> {{ filteredUtilities.length }} of {{ store.utilities.length }} items found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Utility
          </button>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Utilities"
          :enable-category-filter="true"
          category-label="Payment Type"
          :categories="paymentTypeOptions"
          @search="handleSearch"
          @category-filter="handleCategoryFilter"
          @clear-filters="handleClearFilters"
        />
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Utility Name
                </th>
                <th class="t-th">Payment Type</th>
                <th class="t-th">Rate</th>
                <th class="t-th">Unit</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in filteredUtilities" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.name }}
                </td>
                <td class="t-td">
                  {{
                    item.category
                  }}
                </td>
                <td class="t-td">KES {{ item.rate.toLocaleString() }}</td>
                <td class="t-td">{{ item.unit || 'unit' }}</td>

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
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action == "create" ? "Add" : "Edit" }} Utility
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <UtilityFormModal @close-modal="dialogVisible = false" :form="formData" :action="action"
        :key="(dialogVisible as any)"></UtilityFormModal>
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
import { useUtilitiesStore } from "@/store/utilities.store";

const UtilityFormModal = defineAsyncComponent(
  () => import("@/components/modules/utilities/UtilityFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const formData = ref({});
const action = ref("create");
const store = useUtilitiesStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

// Search and filter state
const searchQuery = ref('');
const selectedCategory = ref('');

// Payment type options for filtering
const paymentTypeOptions = computed(() => {
  const categories = [...new Set(store.utilities.map((utility: any) => utility.category))].filter(Boolean);
  return categories.map(category => ({ value: category, label: category }));
});

// Filtered utilities
const filteredUtilities = computed(() => {
  let filtered = store.utilities;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((utility: any) => 
      utility.name?.toLowerCase().includes(query) ||
      utility.category?.toLowerCase().includes(query) ||
      utility.rate?.toString().includes(query) ||
      utility.unit?.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter((utility: any) => utility.category === selectedCategory.value);
  }

  return filtered;
});

const addItem = () => {
  action.value = "create";
  formData.value = {
    id: null,
    name: '',
    category: '',
    rate: '',
    unit: ''
  };
  dialogVisible.value = true;
};

const editItem = (item: any) => {
  action.value = "edit";
  formData.value = item;
  dialogVisible.value = true;
};

// Search and filter handlers
const handleSearch = (query: string) => {
  searchQuery.value = query;
  if (dataTableRef.value) {
    dtHandleSearch(dataTableRef.value, query);
  }
};

const handleCategoryFilter = (category: string) => {
  selectedCategory.value = category;
  if (dataTableRef.value) {
    handleColumnSearch(dataTableRef.value, 1, category); // Payment Type column is index 1
  }
};

const handleClearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  if (dataTableRef.value) {
    clearAllFilters(dataTableRef.value);
  }
};

onMounted(async () => {
  await store.getUtilities();
  initDataTableWithSearch(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
