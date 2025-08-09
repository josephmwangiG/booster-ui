<template>
  <div class="flex justify-between">
    <router-link :to="{ name: 'invoice-details', params: { id: invoice?.id } }" v-if="invoice">
      <h4 class="font-semibold">Invoice #{{ invoice?.invoice_number }}</h4>
    </router-link>
    <button class="text-green-500 font-semibold text-sm rounded bg-green-50 p-1"
      v-if="invoice?.payment_status == 'Paid'">
      <i class="ri-check-line py-1"></i> Paid
    </button>
    <button class="text-red-500 font-semibold text-sm rounded bg-red-50 p-1"
      v-if="invoice?.payment_status == 'Overdue' || invoice?.payment_status == 'Cancelled'">
      <i class="ri-close-line py-1"></i> {{ invoice?.payment_status }}
    </button>
    <button class="text-blue-500 font-semibold text-sm rounded bg-blue-50 p-1"
      v-if="invoice?.payment_status == 'Pending'">
      <i class="ri-progress-3-line py-1"></i> Pending
    </button>
  </div>

  <div class="overflow-x-auto w-full" v-if="invoice">
    <table class="w-full">
      <tbody class="divide-y divide-gray-100">
        <tr>
          <td class="t-td"><i class="ri-money-pound-box-fill"></i> Total Amount</td>
          <td class="t-td font-semibold">KES {{ invoice?.total_amount.toLocaleString() }}</td>
        </tr>
        <tr>
          <td class="t-td">
            <i class="ri-bank-card-line"></i> Amount Paid
          </td>
          <td class="t-td font-semibold">KES {{ invoice?.amount_paid.toLocaleString() }}</td>
        </tr>
        <tr v-if="invoice?.payment_status != 'Paid'">
          <td class="t-td">
            <i class="ri-calendar-fill"></i> Due Date
          </td>
          <td class="t-td font-semibold">{{ invoice?.due_date ? formatDate(invoice?.due_date) : "--" }}
          </td>
        </tr>
        <tr v-if="invoice?.payment_status == 'Paid'">
          <td class="t-td">
            <i class="ri-calendar-fill"></i> Payment Date
          </td>
          <td class="t-td font-semibold">{{ invoice?.payment_date ? formatDate(invoice?.payment_date) :
            "--" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="text-center py-7" v-if="generate_invoice && !invoice">
    <h4 class="font-semibold pb-5">Invoice has not been generated yet</h4>
    <button class="btn-primary-outline" @click="$emit('generate-invoice')">
      Generate invoice
    </button>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/composables/dataTables';

defineProps({
  invoice: Object,
  generate_invoice: Boolean
})

defineEmits(['generate-invoice'])
</script>

<style></style>
