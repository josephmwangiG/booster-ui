<template>
  <div>
    <h1>Categories</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.name }}</td>
        </tr>
      </tbody>
    </table>
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
