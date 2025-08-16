<template>
  <div class="flex pt-4">
    <div class="bread-crumb">
      <h2 class="font-semibold text-lg">
        Invoice Details
      </h2>
      <span class="text-xs font-semibold">
        <span class="text-gray-400">Home > Invoices ></span>
        Invoice Details
      </span>
    </div>
  </div>
  <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="space-y-6 p-2 lg-px-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-1">
            <!-- <OrderDetailsCard :order="store.invoice.order" :labels="labels" /> -->
    </div>
    <div class="space-y-6 p-2 lg-px-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-1">
      <!-- <OrderContact :contact="store.invoice.order.contact" /> -->
    </div>
    <div class="space-y-6 p-2 lg-px-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-1">
      <InvoiceDetailsCard :invoice="store.invoice" />
    </div>
  </div>
  <el-form :label-position="'top'">
    <div class="w-full bg-white p-2 lg-px-3 lg:p-6 mt-3 lg:mt-6">
      <h4 class="font-semibold">Invoice details</h4>
      <div class="lg:grid-cols-3 grid grid-cols-1 gap-1 lg:gap-6">
        <div class="col-span-1 py-0 lg:py-2">
          <el-form-item label="Invoice Date">
            <el-date-picker v-model="store.invoice.created_at" format="MMM DD YYYY" value-format="YYYY-MM-DD"
              placeholder="Select date" class="!w-full" />
          </el-form-item>
        </div>
        <div class="col-span-1 py-0 lg:py-2">
          <el-form-item label="Due Date">
            <el-date-picker v-model="store.invoice.due_date" format="MMM DD YYYY" value-format="YYYY-MM-DD"
              placeholder="Select date" class="!w-full" />
          </el-form-item>
        </div>
        <div class="col-span-1 py-0 lg:py-2">
          <el-form-item label="Billing Address">
            <el-input v-model="store.invoice.order.billing_address" placeholder="Enter billing address"
              class="!w-full" />
          </el-form-item>
        </div>
      </div>
    </div>
  </el-form>

</template>

<script setup lang="ts">
import { useFinanceStore } from "@/store/finance.store";
import { defineAsyncComponent, onMounted, ref } from "vue";

// const OrderContact = defineAsyncComponent(
//   () => import("@/components/orders/OrderContact.vue")
// )

// const OrderDetailsCard = defineAsyncComponent(
//   () => import("@/components/orders/OrderDetailsCard.vue")
// )
const InvoiceDetailsCard = defineAsyncComponent(
  () => import("@/components/finance/InvoiceDetailsCard.vue")
)


const store = useFinanceStore();
const labels = ref({
  order_type: "",
  order_date: "",
});

onMounted(async () => {

  if (store.invoice.order.order_category === "Sales Order") {
    labels.value.order_type = "sales order";
    labels.value.order_date = "Order date";
  }

  if (store.invoice.order.order_category === "Sale") {
    labels.value.order_type = "sale";
    labels.value.order_date = "Sale date";
  }
  if (store.invoice.order.order_category === "Purchase Order") {
    labels.value.order_type = "purchase order";
    labels.value.order_date = "Order date";
  }

  if (store.invoice.order.order_category === "Purchase") {
    labels.value.order_type = "purchase";
    labels.value.order_date = "Purchase date";
  }
});
</script>

<style></style>