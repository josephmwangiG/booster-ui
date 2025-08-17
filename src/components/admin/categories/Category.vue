<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Category Details</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Categories ></span> {{ store?.category?.name || 'Loading...' }}
        </span>
      </div>
    </div>
    <div class="mt-5">
      <div class="shadow-md rounded py-5 px-3 bg-white">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading category details...</p>
        </div>
        <div v-else-if="store?.category">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold mb-4">Category Information</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Category Name</label>
                  <p class="mt-1 text-sm text-gray-900">{{ store.category.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <p class="mt-1 text-sm text-gray-900">{{ store.category.description || 'No description' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    store.category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ store.category.status }}
                  </span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Created At</label>
                  <p class="mt-1 text-sm text-gray-900">{{ new Date(store.category.created_at).toLocaleDateString() }}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-4">Actions</h3>
              <div class="space-y-3">
                <button class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Edit Category
                </button>
                <button class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-600">Category not found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAdmCategoriesStore } from "@/store/admin/categories.store";

const route = useRoute();
const store = useAdmCategoriesStore();
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    const categoryId = route.params.id as string;
    await store.getCategory(categoryId);
  } catch (error) {
    console.error('Failed to fetch category:', error);
  }
  loading.value = false;
});
</script>

<style></style>
