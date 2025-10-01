<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">📄 Invoices</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span>
          <span class="text-blue-600 font-medium"> Invoices</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Invoices Card -->
    <div v-else class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 animate-slide-up">
      <div class="flex justify-between items-center">
        <div class="title">
          <h4 class="font-semibold text-lg text-gray-800">All Invoices</h4>
          <span class="text-gray-500 text-sm">
            You have
            <span class="font-semibold text-gray-700">
              {{ store.invoices?.length?.toLocaleString() || 0 }}
            </span>
            invoices
          </span>
        </div>
        <button
          @click="dialogVisible = true"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
        >
          ➕ Create Invoice
        </button>
      </div>

      <hr class="my-4" />

      <!-- Table -->
      <div class="overflow-x-auto w-full">
        <table class="w-full border-collapse text-sm" ref="dataTableRef">
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th class="t-th text-left">Invoice #</th>
              <th class="t-th text-left">Order/Sale</th>
              <th class="t-th text-left">Contact</th>
              <th class="t-th text-right">Amount</th>
              <th class="t-th text-right">Paid</th>
              <th class="t-th text-left">Due Date</th>
              <th class="t-th text-center">Status</th>
              <th class="t-th text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in store.invoices"
              :key="index"
              :class="index % 2 != 0 ? 'bg-gray-50' : ''"
              class="hover:bg-blue-50/40 transition-colors duration-300"
            >
              <td class="t-td font-semibold text-gray-700">
                <router-link
                  :to="{ name: 'invoice-details', params: { id: item.id } }"
                  class="hover:text-blue-600"
                >
                  {{ item.invoice_number }}
                </router-link>
              </td>
              <td class="t-td">
                <router-link
                  :to="{ name: 'order', params: { id: item.order?.id } }"
                  class="hover:text-blue-600"
                >
                  {{ item?.order?.order_number || item.order?.sale_number }}
                </router-link>
              </td>
              <td class="t-td">
                {{
                  item?.order?.contact.contact_category == "Business"
                    ? item?.order?.contact.business_name
                    : item?.order?.contact.first_name +
                      " " +
                      item?.order?.contact.last_name
                }}
              </td>
              <td class="t-td text-right font-medium">
                KES {{ Number(item.total_amount).toLocaleString() }}
              </td>
              <td class="t-td text-right font-medium">
                KES {{ Number(item.amount_paid).toLocaleString() }}
              </td>
              <td class="t-td">{{ formatDate(item.due_date, false) }}</td>
              <td class="t-td text-center">
                <span
                  v-if="item.payment_status == 'Pending'"
                  class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-blue-100 text-blue-800"
                >
                  {{ item.payment_status }}
                </span>
                <span
                  v-if="item.payment_status == 'Paid'"
                  class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-green-100 text-green-800"
                >
                  {{ item.payment_status }}
                </span>
                <span
                  v-if="item.payment_status == 'Cancelled'"
                  class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-red-100 text-red-800"
                >
                  {{ item.payment_status }}
                </span>
              </td>
              <td class="t-td text-center">
                <router-link
                  :to="{ name: 'invoice-details', params: { id: item.id } }"
                  class="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300"
                >
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <teleport to="body">
    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      style="min-width: 300px"
      width="40%"
    >
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Create Invoice
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <InvoiceFormModal
        @close-modal="dialogVisible = false"
        :form="formData"
      ></InvoiceFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { useFinanceStore } from "@/store/finance.store";
import { defineAsyncComponent } from "vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const InvoiceFormModal = defineAsyncComponent(
  () => import("./InvoiceFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const store = useFinanceStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const formData = {};

onMounted(async () => {
  loading.value = true;
  try {
    await store.getInvoices();
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
  } finally {
    loading.value = false;
  }
  initDataTable(dataTableRef.value);
});
</script>

<style scoped>
/* Modern table styles */
.t-th {
  @apply px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider;
}
.t-td {
  @apply px-4 py-3 text-sm text-gray-700;
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.7s ease-out;
}
</style>
