<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Products</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Products
        </span>
      </div>
    </div>
    <div class="mt-5">
      <div class="shadow-md rounded py-5 px-3 bg-white">
        <div class="justify-between space-x-2 items-center flex">
          <div class="title">
            <h4 class="font-semibold">Products</h4>
            <span class="text-gray-400 text-sm">
              You have {{ store?.products?.length?.toLocaleString() || 0 }} products
            </span>
          </div>
          <button @click="activeModal = true" class="bg-primary-700 rounded text-white text-sm py-2 px-3">
            Add Product
          </button>
        </div>
        <hr class="my-3" />
        <div class="overflow-x-auto w-full">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading products...</p>
          </div>
          <table v-else ref="dataTableRef" class="w-full d-table">
            <thead class="t-head">
              <tr>
                <th class="t-th">Product Name</th>
                <th class="t-th">Category</th>
                <th class="t-th">Price</th>
                <th class="t-th">Status</th>
                <th class="t-th">Created At</th>
                <th class="w-32 t-th">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in (store?.products as any)" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td">
                  {{ item.name }}
                </td>
                <td class="t-td">
                  {{ item.category?.name || 'No category' }}
                </td>
                <td class="t-td">
                  ${{ (Number(item.price) || 0).toFixed(2) }}
                </td>
                <td class="t-td">
                  <span :class="item.status === 'active' ? 'text-green-600' : 'text-red-600'">
                    {{ item.status }}
                  </span>
                </td>
                <td class="t-td">
                  {{ new Date(item.created_at).toLocaleDateString() }}
                </td>
                <td class="t-td">
                  <button @click="editProduct(item)" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button @click="deleteProduct(item.id)" class="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { initDataTable } from "@/composables/dataTables";
import { useAdmProductsStore } from "@/store/admin/products.store";

const dataTableRef = ref(null);

DataTable.use(DataTablesCore);
const loading = ref(true);
const store = useAdmProductsStore();

const activeModal = ref(false);

const editProduct = (product: any) => {
  console.log('Edit product:', product);
  // TODO: Implement edit functionality - open modal or navigate to edit page
};

const deleteProduct = async (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await store.deleteProduct(id);
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await store.getProducts();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
