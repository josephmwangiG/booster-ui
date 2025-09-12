<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <el-form-item prop="tenant_bill_id" class="flex-1" :label="'Select Bill'">
        <el-select v-model="formData.tenant_bill_id" filterable placeholder="Select bill" :loading="loading" @change="onBillChange">
          <el-option v-for="item in unpaidBills" :key="item.tenant_bill_id" :label="`${item.tenant_name} - ${item.bill_number || item.period} (Balance: KES ${item.balance})`" :value="item.tenant_bill_id" />
        </el-select>
      </el-form-item>
              <div class="lg:flex gap-3">
          <el-form-item type="number" prop="amount" class="flex-1" :label="'Amount Paid'">
            <el-input v-model="formData.amount" type="number" placeholder="Enter amount">
            </el-input>

          </el-form-item>

        <el-form-item prop="payment_date" class="flex-1" :label="'Payment Date'">
          <el-date-picker class="!w-full" v-model="formData.payment_date" format="MMM DD YYYY"
            :disabled-date="disabledDate" value-format="YYYY-MM-DD" placeholder="Select a date" />
        </el-form-item>
      </div>
      <div class="lg:flex gap-3">
        <el-form-item prop="payment_method" class="flex-1" :label="'Payment Method'">
          <el-select v-model="formData.payment_method" filterable placeholder="Select payment method">
            <el-option label="Cash" value="Cash" />
            <el-option label="Mpesa" value="Mpesa" />
            <el-option label="Bank" value="Bank" />
          </el-select>
        </el-form-item>

        <el-form-item prop="payment_ref" class="flex-1" :label="'Payment Ref'">
          <el-input v-model="formData.payment_ref" placeholder="Enter payment ref" />
        </el-form-item>
      </div>

      <div class="mt-5 sm:mt-6 text-right">
        <button @click="emits('close-modal')" type="button" class="btn-primary-outline">
          Close
        </button>

        <button @click="submitForm(itemFormRef)" type="button" class="btn-primary">
          Save
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { TenantBillPaymentForm } from "@/type/tenant.type";
import { useTenantBillsStore } from "@/store/tenant-bills.store";

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useTenantBillsStore();
const itemFormRef = ref<FormInstance>();
const loading = ref(true);
const formData = reactive<TenantBillPaymentForm>(props.form as TenantBillPaymentForm);
const selectedBillDetails = ref<any>(null);

// Computed property to filter out paid bills and calculate balance
const unpaidBills = computed(() => {
  if (!store.tenantBills) return [];
  
  return store.tenantBills
    .filter(bill => {
      // Filter out bills that are fully paid
      const amount = Number(bill.amount) || 0;
      const amountPaid = Number(bill.amount_paid) || 0;
      return amount > amountPaid;
    })
    .map(bill => {
      const amount = Number(bill.amount) || 0;
      const amountPaid = Number(bill.amount_paid) || 0;
      const balance = amount - amountPaid;
      
      return {
        tenant_bill_id: bill.id,
        tenant_name: bill.tenant_name,
        bill_number: bill.bill_number,
        period: bill.period,
        amount: bill.amount,
        amount_paid: bill.amount_paid,
        payment_status: bill.payment_status,
        balance: balance.toFixed(2)
      };
    });
});

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const rules = reactive<FormRules<TenantBillPaymentForm>>({
  tenant_bill_id: [
    { required: true, message: "Please select bill", trigger: "change" },
  ],
  amount: [
    { required: true, message: "Please enter amount", trigger: "blur" },
    { 
      validator: (_, value, callback) => {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          callback(new Error("Amount must be greater than 0"));
        } else {
          callback();
        }
      }, 
      trigger: "blur" 
    },
  ],
  payment_date: [
    { required: true, message: "Please enter payment date", trigger: "change" },
  ],
  payment_method: [
    { required: true, message: "Please select payment method", trigger: "change" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid, _fields) => {
    if (!valid) {
      return;
          } else {
        try {
          // Ensure the form data is properly formatted
          const submissionData = {
            id: formData.id,
            tenant_bill_id: formData.tenant_bill_id,
            amount: Number(formData.amount) || 0,
            payment_date: formData.payment_date,
            payment_method: formData.payment_method,
            payment_ref: formData.payment_ref || ''
          };
          
          console.log('Submitting form data:', submissionData);
          console.log('Original form data:', formData);
          
          const res = await store.createTenantBillPayment(submissionData);
          if (res.status == 200 || res.status == 201) {
            // Show success message with utility breakdown
            const billData = res.data?.updated_bill || res.data;
            let message = "Tenant bill payment was created successfully.";
            
            if (billData?.bill_items && billData.bill_items.length > 0) {
              const utilities = billData.bill_items.filter((item: any) => item.item_name !== 'Rent');
              if (utilities.length > 0) {
                message += `\n\nUtilities included:\n${utilities.map((u: any) => `• ${u.item_name}: KES ${Number(u.amount).toLocaleString()}`).join('\n')}`;
              }
            }
            
            resetForm(itemFormRef.value as FormInstance);
            ElNotification({
              title: "Success",
              message: message,
              type: "success",
              duration: 5000
            });
            emits("close-modal");
          }
        } catch (error: any) {
          console.error('Form submission error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'An error occurred while creating the payment';
          ElNotification({
            title: "Error",
            message: errorMessage,
            type: "error",
          });
        }
      }
  });


};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // Reset the reactive form data
  Object.assign(formData, {
    id: null,
    tenant_bill_id: null,
    amount: null,
    payment_date: '',
    payment_ref: '',
    payment_method: ''
  });
  // Clear selected bill details
  selectedBillDetails.value = null;
};

const onBillChange = async (value: string) => {
  if (!value) {
    selectedBillDetails.value = null;
    formData.amount = null;
    return;
  }
  
  try {
    // Find the selected bill from the unpaid bills
    const selectedBill = unpaidBills.value.find(bill => bill.tenant_bill_id === value);
    if (selectedBill) {
      // Autofill the amount with the remaining balance
      const balance = Number(selectedBill.balance);
      formData.amount = balance > 0 ? balance : null;
      
      selectedBillDetails.value = {
        totalAmount: selectedBill.amount,
        amountPaid: selectedBill.amount_paid || 0,
        balance: selectedBill.balance,
        status: selectedBill.payment_status,
        utilities: store.tenantBillItems.filter(item => item.tenant_bill_id === value)
      };
    } else {
      // If not found in unpaid bills, try to fetch it from store
      const storeBill = store.tenantBills.find(bill => bill.id === value);
      if (storeBill) {
        const amount = Number(storeBill.amount) || 0;
        const amountPaid = Number(storeBill.amount_paid) || 0;
        const balance = amount - amountPaid;
        
        formData.amount = balance > 0 ? balance : null;
        
        selectedBillDetails.value = {
          totalAmount: storeBill.amount,
          amountPaid: storeBill.amount_paid || 0,
          balance: balance,
          status: storeBill.payment_status,
          utilities: store.tenantBillItems.filter(item => item.tenant_bill_id === value)
        };
      } else {
        // If not found in store, try to fetch it
        await store.getTenantBill(value);
        if (store.tenantBill) {
          const amount = Number(store.tenantBill.amount) || 0;
          const amountPaid = Number(store.tenantBill.amount_paid) || 0;
          const balance = amount - amountPaid;
          
          formData.amount = balance > 0 ? balance : null;
          
          selectedBillDetails.value = {
            totalAmount: store.tenantBill.amount,
            amountPaid: store.tenantBill.amount_paid || 0,
            balance: balance,
            status: store.tenantBill.payment_status,
            utilities: store.tenantBill.bill_items || []
          };
        }
      }
    }
  } catch (error) {
    console.error('Error fetching bill details:', error);
    selectedBillDetails.value = null;
    formData.amount = null;
  }
};



onMounted(async () => {
  await Promise.all([
    store.getTenantBillsForPayment(),
    store.getTenantBills({})
  ]);
  loading.value = false;
});
</script>
<style lang=""></style>
