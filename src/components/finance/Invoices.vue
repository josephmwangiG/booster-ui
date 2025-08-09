<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Invoices</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Invoices
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Invoices </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">12</h2>
            <span class="text-gray-400 text-sm">Invoices</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES 4,560</h2>
            <span class="text-gray-400 text-sm">Complete</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">60,000</h2>
            <span class="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Invoices</h4>
            <span class="text-gray-400 text-sm"> Invoice records </span>
          </div>
          <button @click="dialogVisible = true" class="btn-primary my-auto">
            Create Invoice
          </button>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Invoice #
                </th>
                <th class="t-th">Order/Sale</th>
                <th class="t-th">Contact</th>
                <th class="t-th">Amount</th> 
                <th class="t-th">Paid</th> 
                <th class="t-th">Due Date</th>
                <th class="t-th">Status</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in store.invoices" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <router-link :to="{ name: 'invoice-details', params: { id: item.id } }">
                    {{ item.invoice_number }}
                  </router-link>
                </td>
                <td class="t-td cursor-pointer hover:text-blue-400"> <router-link :to="{ name: 'order', params: { id: item.order?.id } }">{{ item?.order?.order_number || item.order?.sale_number }}</router-link></td>
                <td class="t-td">
                  {{
                    item?.order?.contact.contact_category == "Business"
                      ? item?.order?.contact.business_name
                      : item?.order?.contact.first_name + " " + item?.order?.contact.last_name
                  }}
                </td>
               
                <td class="t-td font-semibold">
                  KES {{ Number(item.total_amount).toLocaleString() }}
                </td>
                <td class="t-td font-semibold">
                  KES {{ Number(item.amount_paid).toLocaleString() }}
                </td>
                <td class="t-td">{{ formatDate(item.due_date, false) }}</td>

                <td class="t-td">
                  <span v-if="item.payment_status == 'Pending'" class="p-1 rounded bg-blue-100 text-blue-500">
                    {{ item.payment_status }}
                  </span>
                  <span v-if="item.payment_status == 'Paid'" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    {{ item.payment_status }}
                  </span>
                  <span v-if="item.payment_status == 'Cancelled'" class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    {{ item.payment_status }}
                  </span>
                </td>
                <td class="t-td text-end">
                  <el-dropdown trigger="click">
                    <span
                      class="el-dropdown-link inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-100 px-2 py-1 lg:px-3 lg:py-2 text-sm text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50">
                      Action
                      <el-icon class="el-icon--right">
                        <i class="ri-arrow-down-s-line"></i>
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <router-link class="font-semibold py-2" :to="{
                            name: 'invoice-details',
                            params: { id: item.id },
                          }"><i class="ri-external-link-line text-orange-500"></i>
                            View</router-link>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
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
            Create Invoice
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <InvoiceFormModal @close-modal="dialogVisible = false" :form="formData"></InvoiceFormModal>
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
  await store.getInvoices();
  initDataTable(dataTableRef.value);
  loading.value = false;

});
</script>

<style></style>
