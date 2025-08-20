<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
        <p class="text-gray-600">Manage your product categories</p>
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">
        New Category
      </button>
    </div>

    <!-- Categories Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id" class="bg-white border-b">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {{ category.name }}
            </td>
            <td class="px-6 py-4 text-right">
              <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useAdmCategoriesStore } from "@/store/admin/categories.store";

export default defineComponent({
  name: "Categories",
  setup() {
    const categoriesStore = useAdmCategoriesStore();

    onMounted(() => {
      categoriesStore.getCategories();
    });

    const categories = computed(() => categoriesStore.categories);

    return {
      categories,
    };
  },
});
</script>

<style scoped></style>