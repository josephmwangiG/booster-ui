<template>
  <div>
    <h1>Products</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useProductsStore } from "@/store/products.store";

export default defineComponent({
  name: "Products",
  setup() {
    const productsStore = useProductsStore();

    onMounted(() => {
      productsStore.getProducts();
    });

    const products = computed(() => productsStore.products);

    return {
      products,
    };
  },
});
</script>

<style scoped></style>
