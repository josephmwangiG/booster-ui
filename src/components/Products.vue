<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <p class="text-gray-600">Manage your inventory</p>
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">
        New Product
      </button>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Product</th>
              <th scope="col" class="px-6 py-3">Price</th>
              <th scope="col" class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in (toRaw(productsStore.products) || [])" 
              :key="index" 
              class="bg-white border-b"
            >
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {{ item.name || '-' }}
              </td>
              <td class="px-6 py-4">{{ formatAmount(item.price) }}</td>
              <td class="px-6 py-4 text-right">
                <a href="#" class="font-medium text-blue-600 hover:underline">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, toRaw } from "vue";
import { useProductsStore } from "@/store/products.store";
import { formatAmount } from "@/composables/helper_functions";

const productsStore = useProductsStore();

onMounted(() => {
  productsStore.getProducts();
});
</script>
