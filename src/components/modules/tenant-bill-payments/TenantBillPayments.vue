<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Tenant Bill Payments</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Tenant Bill Payments
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Tenant Payments </h4>
        <div class="grid grid-cols-4 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.tenantBillPayments.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Payments</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ totalAmount.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Bills</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ totalPaidAmount.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Paid</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ totalPendingAmount.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Pending</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Tenant Bills</h4>
            <span class="text-gray-400 text-sm"> {{ store.tenantBillPayments.length }} items found </span>
          </div>
          <div class="actions flex gap-2 my-auto">
            <button @click="dialogVisible = true" class="btn-primary my-auto">
              Add Payment
            </button>
          </div>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>

                <th class="t-th">
                  Payment #
                </th>
                <th class="t-th">Bill No.</th>
                <th class="t-th">
                  Tenant
                </th>
                <th class="t-th">P. Method</th>
                <th class="t-th">Ref</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Date</th>
                <th class="t-th">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in store.tenantBillPayments" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.payment_code }}
                </td>
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.bill_number }}
                </td>
                <td class="t-td">
                  {{
                    item.tenant_name
                  }}
                </td>
                <td class="t-td">
                  {{
                    item.payment_method
                  }}
                </td>
                <td class="t-td">
                  {{
                    item.payment_ref
                  }}
                </td>
                <td class="t-td">KES {{ item.amount.toLocaleString() }} </td>

                <td class="t-td">
                  {{
                    formatDate(item.payment_date)
                  }}
                </td>

                <td class="t-td">

                  <span v-if="item.status == 'Complete'" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    {{ item.status }}
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    {{ item.status }}
                  </span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Generate Bills
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <TenantBillPaymentFormModal @close-modal="dialogVisible = false" :form="formData" :action="action">
      </TenantBillPaymentFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref, computed } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { useTenantBillsStore } from "@/store/tenant-bills.store";

const TenantBillPaymentFormModal = defineAsyncComponent(
  () => import("@/components/modules/tenant-bill-payments/TenantBillPaymentFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const formData = ref({
  id: null,
  tenant_bill_id: null,
  amount: null,
  payment_date: '',
  payment_ref: '',
  payment_method: ''
});
const action = ref("create");
const store = useTenantBillsStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

// Computed properties for totals
const totalAmount = computed(() => {
  let total = 0;
  
  if (store.tenantBills && store.tenantBills.length > 0) {
    store.tenantBills.forEach(bill => {
      total += Number(bill.amount) || 0;
    });
  }
  
  return total;
});

const totalPaidAmount = computed(() => {
  let total = 0;
  
  if (store.tenantBillPayments && store.tenantBillPayments.length > 0) {
    store.tenantBillPayments.forEach(payment => {
      total += Number(payment.amount) || 0;
    });
  }
  
  return total;
});

const totalPendingAmount = computed(() => {
  let total = 0;
  
  // Calculate pending amount as total amount minus total paid
  const totalBillAmount = totalAmount.value;
  const totalPaid = totalPaidAmount.value;
  
  total = Math.max(0, totalBillAmount - totalPaid);
  
  return total;
});

onMounted(async () => {
  await Promise.all([
    store.getTenantBillPayments(),
    store.getTenantBills({})
  ]);
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
