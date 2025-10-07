<template>
  <div class="min-h-screen bg-white" style="font-family: Inter, 'Noto Sans', sans-serif">
    <div class="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <main class="flex-1 px-4 pb-8">
        <div class="py-4">
          <h2 class="text-2xl font-bold text-[var(--neutral-900)]">
            Collect Bills
          </h2>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>

        <!-- Bills Collection Interface -->
        <div v-else class="space-y-6">
          <!-- Individual Bill Cards -->
          <div 
            v-for="bill in tenantBills" 
            :key="bill.id" 
            class="mb-6 rounded-xl bg-neutral-50 shadow-sm"
          >
            <div class="p-4">
              <div class="flex items-start justify-between gap-4">
                <div class="flex flex-col gap-1">
                  <p class="text-lg font-bold text-[var(--neutral-800)]">
                    {{ bill.tenant_name }}
                  </p>
                  <p class="text-sm text-[var(--neutral-500)]">
                    Rent:
                    <span class="font-medium text-[var(--neutral-600)]">
                      KES {{ getRentAmount(bill).toLocaleString() }}
                    </span>
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="bill.payment_status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'"
                  >
                    {{ bill.payment_status }}
                  </span>
                </div>
              </div>

              <!-- Utility Checkboxes -->
              <div class="mt-4 flex items-center space-x-4">
                <div 
                  v-for="utility in getBillUtilities(bill.id)" 
                  :key="utility.id"
                  class="flex items-center gap-2"
                >
                  <input
                    :id="`${utility.item_name.toLowerCase()}-${bill.id}`"
                    :name="`${utility.item_name.toLowerCase()}-${bill.id}`"
                    v-model="selectedUtilities[bill.id]"
                    :value="utility.id"
                    class="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    type="checkbox"
                  />
                  <label
                    :for="`${utility.item_name.toLowerCase()}-${bill.id}`"
                    class="text-sm font-medium text-gray-700"
                  >
                    {{ utility.item_name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Utility Details Section -->
            <div v-if="selectedUtilities[bill.id]?.length > 0" class="border-t border-[var(--neutral-200)] px-4 py-3">
              <div class="space-y-4">
                <div 
                  v-for="utility in getSelectedUtilities(bill.id)" 
                  :key="utility.id"
                  class="border-t border-[var(--neutral-200)] pt-4 first:border-t-0 first:pt-0"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                      <p class="font-medium text-[var(--neutral-700)]">
                        {{ utility.item_name }} Bill
                      </p>
                    </div>
                    <p class="font-medium text-[var(--neutral-800)]">
                      KES {{ Number(utility.amount).toLocaleString() }}
                    </p>
                  </div>
                  
                  <!-- Meter Reading Inputs -->
                  <div v-if="utility.utility?.category === 'Meter Reading'" class="mt-3 grid grid-cols-4 gap-2">
                    <input
                      v-model="meterReadings[bill.id][utility.id].previous"
                      class="w-full rounded-md border-neutral-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Prev Reading"
                      type="number"
                      @input="calculateUtilityAmount(bill.id, utility.id)"
                    />
                    <input
                      v-model="meterReadings[bill.id][utility.id].current"
                      class="w-full rounded-md border-neutral-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Current Reading"
                      type="number"
                      @input="calculateUtilityAmount(bill.id, utility.id)"
                    />
                    <input
                      v-model="meterReadings[bill.id][utility.id].rate"
                      class="w-full rounded-md border-neutral-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Rate"
                      type="number"
                      step="0.01"
                      @input="calculateUtilityAmount(bill.id, utility.id)"
                    />
                    <input
                      v-model="meterReadings[bill.id][utility.id].amount"
                      class="w-full rounded-md border-neutral-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Amount"
                      type="number"
                      step="0.01"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Bill Summary for Individual Bill -->
            <div class="flex items-center justify-between rounded-b-xl bg-[var(--neutral-100)] px-4 py-3">
              <p class="font-semibold text-[var(--neutral-800)]">Bill Summary</p>
              <p class="font-bold text-lg text-[var(--neutral-900)]">
                KES {{ getBillTotal(bill.id).toLocaleString() }}
              </p>
            </div>
          </div>

          <!-- Overall Bill Summary -->
          <div v-if="tenantBills.length > 0" class="mt-8">
            <h2 class="pt-4 pb-2 text-2xl font-bold text-[var(--neutral-900)]">
              Bill Summary
            </h2>
            <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
              <div class="flex items-center justify-between bg-primary-500/10 px-4 py-4">
                <p class="text-lg font-semibold text-[var(--primary-500)]">
                  Total Bill
                </p>
                <p class="text-2xl font-bold text-[var(--primary-500)]">
                  KES {{ getTotalBillAmount().toLocaleString() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Payment Form -->
          <div v-if="getTotalBillAmount() > 0" class="mt-8">
            <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-6">
              <h3 class="text-lg font-semibold text-[var(--neutral-800)] mb-4">Payment Details</h3>
              
              <el-form ref="paymentFormRef" :model="paymentForm" :rules="paymentRules" label-width="auto" status-icon>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <el-form-item prop="payment_method" label="Payment Method">
                    <el-select v-model="paymentForm.payment_method" placeholder="Select payment method" class="w-full">
                      <el-option label="Cash" value="Cash" />
                      <el-option label="Mpesa" value="Mpesa" />
                      <el-option label="Bank" value="Bank" />
                    </el-select>
                  </el-form-item>

                  <el-form-item prop="payment_ref" label="Payment Reference">
                    <el-input v-model="paymentForm.payment_ref" placeholder="Enter payment reference" />
                  </el-form-item>

                  <el-form-item prop="payment_date" label="Payment Date">
                    <el-date-picker 
                      v-model="paymentForm.payment_date" 
                      type="date" 
                      placeholder="Select payment date"
                      format="MMM DD YYYY"
                      value-format="YYYY-MM-DD"
                      class="w-full"
                    />
                  </el-form-item>

                  <el-form-item prop="total_amount" label="Total Amount">
                    <el-input 
                      :model-value="getTotalBillAmount().toLocaleString()" 
                      readonly 
                      class="w-full"
                    >
                      <template #prefix>KES</template>
                    </el-input>
                  </el-form-item>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button 
                    @click="resetForm" 
                    type="button" 
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Reset
                  </button>
                  <button 
                    @click="submitPayments" 
                    type="button" 
                    :disabled="isSubmitting"
                    class="px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
                  >
                    {{ isSubmitting ? 'Processing...' : 'Process Payments' }}
                  </button>
                </div>
              </el-form>
            </div>
          </div>

          <!-- No Bills Message -->
          <div v-if="!loading && tenantBills.length === 0" class="text-center py-12">
            <div class="text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No bills found</h3>
              <p class="mt-1 text-sm text-gray-500">There are no tenant bills available for collection.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useTenantBillsStore } from "@/store/tenant-bills.store";

const store = useTenantBillsStore();
const loading = ref(true);
const isSubmitting = ref(false);
const paymentFormRef = ref<FormInstance>();

// Reactive data
const selectedUtilities = reactive<Record<string, string[]>>({});
const meterReadings = reactive<Record<string, Record<string, any>>>({});
const paymentForm = reactive({
  payment_method: '',
  payment_ref: '',
  payment_date: '',
  total_amount: 0
});

// Computed properties
const tenantBills = computed(() => store.tenantBills || []);

// Form validation rules
const paymentRules = reactive<FormRules>({
  payment_method: [
    { required: true, message: "Please select payment method", trigger: "change" },
  ],
  payment_ref: [
    { required: true, message: "Please enter payment reference", trigger: "blur" },
  ],
  payment_date: [
    { required: true, message: "Please select payment date", trigger: "change" },
  ],
});

// Methods
const getRentAmount = (bill: any) => {
  const rentItem = bill.bill_items?.find((item: any) => item.item_name === 'Rent');
  return rentItem ? Number(rentItem.amount) : 0;
};

const getBillUtilities = (billId: string) => {
  return store.tenantBillItems.filter(item => 
    item.tenant_bill_id === billId && item.item_name !== 'Rent'
  );
};

const getSelectedUtilities = (billId: string) => {
  const selectedIds = selectedUtilities[billId] || [];
  return getBillUtilities(billId).filter(utility => selectedIds.includes(utility.id));
};

const calculateUtilityAmount = (billId: string, utilityId: string) => {
  const reading = meterReadings[billId]?.[utilityId];
  if (reading && reading.previous && reading.current && reading.rate) {
    const units = Number(reading.current) - Number(reading.previous);
    reading.amount = (units * Number(reading.rate)).toFixed(2);
  }
};

const getBillTotal = (billId: string) => {
  let total = getRentAmount(tenantBills.value.find(bill => bill.id === billId));
  
  const selectedUtils = getSelectedUtilities(billId);
  selectedUtils.forEach(utility => {
    if (utility.utility?.category === 'Meter Reading') {
      const reading = meterReadings[billId]?.[utility.id];
      if (reading?.amount) {
        total += Number(reading.amount);
      }
    } else {
      total += Number(utility.amount);
    }
  });
  
  return total;
};

const getTotalBillAmount = () => {
  return tenantBills.value.reduce((total, bill) => total + getBillTotal(bill.id), 0);
};

const initializeMeterReadings = () => {
  tenantBills.value.forEach(bill => {
    if (!meterReadings[bill.id]) {
      meterReadings[bill.id] = {};
    }
    
    getBillUtilities(bill.id).forEach(utility => {
      if (utility.utility?.category === 'Meter Reading') {
        meterReadings[bill.id][utility.id] = {
          previous: utility.previous_meter_reading || 0,
          current: utility.current_meter_reading || 0,
          rate: utility.rate || 0,
          amount: utility.amount || 0
        };
      }
    });
  });
};

const resetForm = () => {
  // Reset selected utilities
  Object.keys(selectedUtilities).forEach(billId => {
    selectedUtilities[billId] = [];
  });
  
  // Reset meter readings
  Object.keys(meterReadings).forEach(billId => {
    Object.keys(meterReadings[billId]).forEach(utilityId => {
      const utility = getBillUtilities(billId).find(u => u.id === utilityId);
      if (utility) {
        meterReadings[billId][utilityId] = {
          previous: utility.previous_meter_reading || 0,
          current: utility.current_meter_reading || 0,
          rate: utility.rate || 0,
          amount: utility.amount || 0
        };
      }
    });
  });
  
  // Reset payment form
  Object.assign(paymentForm, {
    payment_method: '',
    payment_ref: '',
    payment_date: '',
    total_amount: 0
  });
  
  if (paymentFormRef.value) {
    paymentFormRef.value.resetFields();
  }
};

const submitPayments = async () => {
  if (!paymentFormRef.value) return;
  
  await paymentFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    isSubmitting.value = true;
    
    try {
      const payments = [];
      
      // Create payment for each bill with selected utilities
      for (const bill of tenantBills.value) {
        const selectedUtils = getSelectedUtilities(bill.id);
        if (selectedUtils.length === 0) continue;
        
        const billTotal = getBillTotal(bill.id);
        if (billTotal <= 0) continue;
        
        payments.push({
          id: null,
          tenant_bill_id: bill.id,
          amount: billTotal,
          payment_date: paymentForm.payment_date,
          payment_method: paymentForm.payment_method,
          payment_ref: paymentForm.payment_ref
        });
      }
      
      if (payments.length === 0) {
        ElNotification({
          title: "Warning",
          message: "No payments to process. Please select utilities for at least one bill.",
          type: "warning",
        });
        return;
      }
      
      // Process payments
      for (const payment of payments) {
        await store.createTenantBillPayment(payment);
      }
      
      ElNotification({
        title: "Success",
        message: `Successfully processed ${payments.length} payment(s).`,
        type: "success",
        duration: 5000
      });
      
      // Reset form and reload data
      resetForm();
      await loadData();
      
    } catch (error: any) {
      console.error('Payment processing error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while processing payments';
      ElNotification({
        title: "Error",
        message: errorMessage,
        type: "error",
      });
    } finally {
      isSubmitting.value = false;
    }
  });
};

const loadData = async () => {
  try {
    loading.value = true;
    await Promise.all([
      store.getBillItems(),
      store.getTenantBills({})
    ]);
    initializeMeterReadings();
  } catch (error) {
    console.error('Error loading data:', error);
    ElNotification({
      title: "Error",
      message: "Failed to load bill data",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style>
:root {
  --primary-500: #ff8801;
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
}
</style>