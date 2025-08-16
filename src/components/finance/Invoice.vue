<InvoiceDetails />
    <!-- <OrderItems /> -->
  </div>
</template>

<script setup lang="ts">
import { useFinanceStore } from "@/store/finance.store";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const loading = ref(true);
const router = useRouter();
const store = useFinanceStore();

const InvoiceDetails = defineAsyncComponent(
  () => import("@/components/finance/InvoiceDetails.vue")
);
// const OrderItems = defineAsyncComponent(
//   () => import("@/components/finance/OrderItems.vue")
// );

onMounted(async () => {
  await store.getInvoice(router.currentRoute.value.params.id as string);

  loading.value = false;
});
</script>

<style></style>
