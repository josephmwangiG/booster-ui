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
          <table ref="dataTableRef" class="w-full d-table">
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
                  ${{ item.price?.toFixed(2) || '0.00' }}
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
                  <button class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button class="text-red-600 hover:text-red-800">Delete</button>
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
