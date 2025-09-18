<template>
  <div class="search-and-filter-container mb-4">
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
      <!-- Search Input -->
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Search {{ entityName }}
        </label>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="`Search ${entityName.toLowerCase()}...`"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="onSearch"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="ri-search-line text-gray-400"></i>
          </div>
        </div>
      </div>

      <!-- Date Range Filter (if enabled) -->
      <div v-if="enableDateFilter" class="flex-1 lg:flex-initial lg:min-w-[300px]">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <div class="flex gap-2">
          <input
            v-model="dateFrom"
            type="date"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="onDateFilter"
          />
          <span class="flex items-center text-gray-500">to</span>
          <input
            v-model="dateTo"
            type="date"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="onDateFilter"
          />
        </div>
      </div>

      <!-- Category/Type Filter (if enabled) -->
      <div v-if="enableCategoryFilter && categories.length > 0" class="flex-1 lg:flex-initial lg:min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ categoryLabel }}
        </label>
        <select
          v-model="selectedCategory"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="onCategoryFilter"
        >
          <option value="">All {{ categoryLabel }}</option>
          <option v-for="category in categories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>
      </div>

      <!-- Status Filter (if enabled) -->
      <div v-if="enableStatusFilter && statusOptions.length > 0" class="flex-1 lg:flex-initial lg:min-w-[150px]">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          v-model="selectedStatus"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="onStatusFilter"
        >
          <option value="">All Status</option>
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>

      <!-- Clear Filters Button -->
      <div class="flex-initial">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <i class="ri-refresh-line mr-1"></i>
          Clear
        </button>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap gap-2">
      <span class="text-sm text-gray-600">Active filters:</span>
      <span v-if="searchQuery" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Search: "{{ searchQuery }}"
        <button @click="clearSearch" class="ml-1 text-blue-600 hover:text-blue-800">
          <i class="ri-close-line text-xs"></i>
        </button>
      </span>
      <span v-if="dateFrom || dateTo" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Date: {{ dateFrom || 'Start' }} - {{ dateTo || 'End' }}
        <button @click="clearDateFilter" class="ml-1 text-green-600 hover:text-green-800">
          <i class="ri-close-line text-xs"></i>
        </button>
      </span>
      <span v-if="selectedCategory" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        {{ categoryLabel }}: {{ getCategoryLabel(selectedCategory) }}
        <button @click="clearCategoryFilter" class="ml-1 text-purple-600 hover:text-purple-800">
          <i class="ri-close-line text-xs"></i>
        </button>
      </span>
      <span v-if="selectedStatus" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        Status: {{ getStatusLabel(selectedStatus) }}
        <button @click="clearStatusFilter" class="ml-1 text-orange-600 hover:text-orange-800">
          <i class="ri-close-line text-xs"></i>
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Props
interface Props {
  entityName: string;
  enableDateFilter?: boolean;
  enableCategoryFilter?: boolean;
  enableStatusFilter?: boolean;
  categories?: Array<{ value: string; label: string }>;
  statusOptions?: Array<{ value: string; label: string }>;
  categoryLabel?: string;
  initialSearchQuery?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialCategory?: string;
  initialStatus?: string;
}

const props = withDefaults(defineProps<Props>(), {
  enableDateFilter: false,
  enableCategoryFilter: false,
  enableStatusFilter: false,
  categories: () => [],
  statusOptions: () => [],
  categoryLabel: 'Category',
  initialSearchQuery: '',
  initialDateFrom: '',
  initialDateTo: '',
  initialCategory: '',
  initialStatus: '',
});

// Emits
const emit = defineEmits<{
  search: [query: string];
  dateFilter: [dateFrom: string, dateTo: string];
  categoryFilter: [category: string];
  statusFilter: [status: string];
  clearFilters: [];
}>();

// Reactive data
const searchQuery = ref(props.initialSearchQuery);
const dateFrom = ref(props.initialDateFrom);
const dateTo = ref(props.initialDateTo);
const selectedCategory = ref(props.initialCategory);
const selectedStatus = ref(props.initialStatus);

// Computed
const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || dateFrom.value || dateTo.value || selectedCategory.value || selectedStatus.value);
});

// Methods
const onSearch = () => {
  emit('search', searchQuery.value);
};

const onDateFilter = () => {
  emit('dateFilter', dateFrom.value, dateTo.value);
};

const onCategoryFilter = () => {
  emit('categoryFilter', selectedCategory.value);
};

const onStatusFilter = () => {
  emit('statusFilter', selectedStatus.value);
};

const clearFilters = () => {
  searchQuery.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  selectedCategory.value = '';
  selectedStatus.value = '';
  emit('clearFilters');
};

const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '');
};

const clearDateFilter = () => {
  dateFrom.value = '';
  dateTo.value = '';
  emit('dateFilter', '', '');
};

const clearCategoryFilter = () => {
  selectedCategory.value = '';
  emit('categoryFilter', '');
};

const clearStatusFilter = () => {
  selectedStatus.value = '';
  emit('statusFilter', '');
};

const getCategoryLabel = (value: string) => {
  const category = props.categories.find(c => c.value === value);
  return category ? category.label : value;
};

const getStatusLabel = (value: string) => {
  const status = props.statusOptions.find(s => s.value === value);
  return status ? status.label : value;
};

// Watch for prop changes
watch(() => props.initialSearchQuery, (newVal) => {
  searchQuery.value = newVal;
});

watch(() => props.initialDateFrom, (newVal) => {
  dateFrom.value = newVal;
});

watch(() => props.initialDateTo, (newVal) => {
  dateTo.value = newVal;
});

watch(() => props.initialCategory, (newVal) => {
  selectedCategory.value = newVal;
});

watch(() => props.initialStatus, (newVal) => {
  selectedStatus.value = newVal;
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
