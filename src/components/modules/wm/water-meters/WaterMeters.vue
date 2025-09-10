<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Water Meters</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Water Meters
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Water Meters </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ store.waterMeters.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Water Meters</span>
          </div>

        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Water Meters</h4>
            <span class="text-gray-400 text-sm"> {{ filteredWaterMeters.length }} of {{ store.waterMeters.length }} items found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Meter
          </button>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Water Meters"
          :enable-category-filter="true"
          category-label="Type"
          :categories="meterTypeOptions"
          :enable-status-filter="true"
          :status-options="masterMeterOptions"
          @search="handleSearch"
          @category-filter="handleTypeFilter"
          @status-filter="handleMasterFilter"
          @clear-filters="handleClearFilters"
        />
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Meter Name
                </th>
                <th class="t-th">
                  Code Number
                </th>
                <th class="t-th">Type</th>
                <th class="t-th">Master Meter</th>
                <th class="t-th">Read Frequency</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in filteredWaterMeters" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.name || 'N/A' }}
                </td>
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.code_number }}
                </td>
                <td class="t-td">
                  {{
                    item.category
                  }}
                </td>

                <td class="t-td">
                  <span v-if="item.is_master" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    True
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    False
                  </span>
                </td>
                <td class="t-td">
                  {{
                    item.read_frequency
                  }}
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
            {{ action == "create" ? "Add" : "Edit" }} Water Meter
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <WaterMeterFormModal @close-modal="dialogVisible = false" :form="formData" :action="action"
        :key="(dialogVisible as any)"></WaterMeterFormModal>
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
import { useWaterMetersStore } from "@/store/water-meters.store";

const WaterMeterFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/water-meters/WaterMeterFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const formData = ref({});
const action = ref("create");
const store = useWaterMetersStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

// Search and filter state
const searchQuery = ref('');
const selectedType = ref('');
const selectedMasterStatus = ref('');

// Filter options
const meterTypeOptions = computed(() => {
  const types = [...new Set(store.waterMeters.map((meter: any) => meter.category))].filter(Boolean);
  return types.map(type => ({ value: type, label: type }));
});

const masterMeterOptions = [
  { value: 'true', label: 'Master Meter' },
  { value: 'false', label: 'Regular Meter' }
];

// Filtered water meters
const filteredWaterMeters = computed(() => {
  let filtered = store.waterMeters;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((meter: any) => 
      meter.name?.toLowerCase().includes(query) ||
      meter.code_number?.toLowerCase().includes(query) ||
      meter.category?.toLowerCase().includes(query) ||
      meter.read_frequency?.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (selectedType.value) {
    filtered = filtered.filter((meter: any) => meter.category === selectedType.value);
  }

  // Apply master meter filter
  if (selectedMasterStatus.value) {
    const isMaster = selectedMasterStatus.value === 'true';
    filtered = filtered.filter((meter: any) => meter.is_master === isMaster);
  }

  return filtered;
});

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
    handleColumnSearch(dataTableRef.value, 2, type); // Type column is now index 2
  }
};

const handleMasterFilter = (status: string) => {
  selectedMasterStatus.value = status;
  // Custom filtering for boolean master meter status
  if (dataTableRef.value) {
    const searchValue = status === 'true' ? 'True' : status === 'false' ? 'False' : '';
    handleColumnSearch(dataTableRef.value, 3, searchValue); // Master column is now index 3
  }
};

const handleClearFilters = () => {
  searchQuery.value = '';
  selectedType.value = '';
  selectedMasterStatus.value = '';
  if (dataTableRef.value) {
    clearAllFilters(dataTableRef.value);
  }
};

onMounted(async () => {
  await store.getWaterMeters();
  initDataTableWithSearch(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
