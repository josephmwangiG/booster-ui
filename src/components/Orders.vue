<template>
  <div>
    <h1>Orders</h1>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.customer.name }}</td>
          <td>{{ order.total }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useOrdersStore } from "@/store/orders.store";

export default defineComponent({
  name: "Orders",
  setup() {
    const ordersStore = useOrdersStore();

    onMounted(() => {
      ordersStore.getOrders();
    });

    const orders = computed(() => ordersStore.salesOrders);

    return {
      orders,
    };
  },
});
</script>

<style scoped></style>
