<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Product Details</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Products ></span> {{ store?.product?.name || 'Loading...' }}
        </span>
      </div>
    </div>
    <div class="mt-5">
      <div class="shadow-md rounded py-5 px-3 bg-white">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading product details...</p>
        </div>
        <div v-else-if="store?.product">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold mb-4">Product Information</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Product Name</label>
                  <p class="mt-1 text-sm text-gray-900">{{ store.product.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <p class="mt-1 text-sm text-gray-900">{{ store.product.description || 'No description' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Category</label>
                  <p class="mt-1 text-sm text-gray-900">{{ store.product.category?.name || 'No category' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Price</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatAmount(store.product.price) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    store.product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ store.product.status }}
                  </span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Created At</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(store.product.created_at) }}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-4">Actions</h3>
              <div class="space-y-3">
                <button class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Edit Product
                </button>
                <button class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-600">Product not found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAdmProductsStore } from "@/store/admin/products.store";
import { formatAmount } from "@/composables/helper_functions";
import { formatDate } from "@/composables/dataTables";

const route = useRoute();
const store = useAdmProductsStore();
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    const productId = route.params.id as string;
    await store.getProduct(productId);
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }
  loading.value = false;
});
</script>

<style></style>
