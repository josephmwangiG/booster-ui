<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">🛍️ Products</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span>
          <span class="text-blue-600 font-medium"> Products</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Products Card -->
    <div v-else class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 animate-slide-up">
      <div class="flex justify-between items-center">
        <div class="title">
          <h4 class="font-semibold text-lg text-gray-800">All Products</h4>
          <span class="text-gray-500 text-sm">
            You have
            <span class="font-semibold text-gray-700">
              {{ productsStore?.products?.length?.toLocaleString() || 0 }}
            </span>
            products
          </span>
        </div>
        <button
          @click="activeModal = true"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
        >
          ➕ Add Product
        </button>
      </div>

      <hr class="my-4" />

      <!-- Table -->
      <div class="overflow-x-auto w-full">
        <table ref="dataTableRef" class="w-full border-collapse text-sm">
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th class="t-th text-left">Product Name</th>
              <th class="t-th text-left">Category</th>
              <th class="t-th text-right">Price</th>
              <th class="t-th text-center">Status</th>
              <th class="t-th text-left">Created At</th>
              <th class="t-th text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in (productsStore?.products as any)"
              :key="index"
              :class="index % 2 != 0 ? 'bg-gray-50' : ''"
              class="hover:bg-blue-50/40 transition-colors duration-300"
            >
              <td class="t-td font-medium text-gray-700">{{ item.name }}</td>
              <td class="t-td">{{ item.category?.name || 'No category' }}</td>
              <td class="t-td text-right font-medium">{{ formatAmount(item.price) }}</td>
              <td class="t-td text-center">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full shadow-sm',
                    item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="t-td text-gray-600">{{ formatDate(item.created_at) }}</td>
              <td class="t-td text-center">
                <div class="flex justify-center space-x-2">
                  <button @click="editProduct(item)" class="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300">
                    Edit
                  </button>
                  <button @click="deleteProduct(item.id)" class="bg-red-100 text-red-700 hover:bg-red-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <ProductFormModal
    :modalActive="activeModal"
    @close-modal="activeModal = false"
    :form="formData"
    :action="action"
    @submit-form="handleFormSubmit"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { initDataTable, formatDate } from "@/composables/dataTables";
import { useAdmProductsStore } from "@/store/admin/products.store";
import { formatAmount } from "@/composables/helper_functions";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ProductFormModal from "./ProductFormModal.vue";

const dataTableRef = ref(null);

DataTable.use(DataTablesCore);
const loading = ref(true);
const productsStore = useAdmProductsStore();

const activeModal = ref(false);
const action = ref('create');
const formData = ref({});

const editProduct = (product: any) => {
  action.value = 'edit';
  formData.value = { ...product };
  activeModal.value = true;
};

const deleteProduct = async (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productsStore.deleteProduct(id);
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  }
};

const handleFormSubmit = () => {
  // Refresh the products list after form submission
  productsStore.getProducts();
};

onMounted(async () => {
  loading.value = true;
  try {
    await productsStore.getProducts();
  } catch (error) {
    console.error('Failed to fetch products:', error);
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
