<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">
      <div class="lg:flex gap-3">

        <el-form-item class="flex-1" label="Select Invoice" prop="invoice_id" Contact>
          <el-select filterable v-model="formData.invoice_id" placeholder="Select an invoice">
            <el-option v-for="invoice in store.invoicesList" :value="invoice.id" :key="invoice.id"
              :label="invoice.invoice_number">
              <span style="float: left">{{ invoice.invoice_number }}</span>
              <span style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                ">
                {{ invoice.store_name ? invoice.store_name + " - " : "" }} KES {{ (Number(invoice.total_amount) -
                  Number(invoice.amount_paid)).toLocaleString() }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="payment_date" class="flex-1" label="Payment Date">
          <el-date-picker class="!w-full" v-model="formData.payment_date" format="MMM DD YYYY" value-format="YYYY-MM-DD"
            placeholder="Select a date" />
        </el-form-item>
      </div>
      <div class="lg:flex gap-3 py-2">

        <el-form-item class="flex-1" label="Payment Method" prop="payment_method">
          <el-select v-model="formData.payment_method" placeholder="Select a payment method">
            <el-option :value="'Cash'"> Cash</el-option>
            <el-option :value="'Mpesa'"> Mpesa</el-option>
            <el-option :value="'Bank'"> Bank</el-option>
            <el-option :value="'Other'"> Other</el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="payment_reference" class="flex-1" label="Payment Reference">
          <el-input class="!w-full" v-model="formData.payment_reference" placeholder="Enter a payment reference" />
        </el-form-item>
      </div>

      <div class="form-group">
        <el-form-item prop="amount" class="!w-full" label="Amount Paid">
          <el-input type="number" class="!w-full" v-model="formData.amount" format="MMM DD YYYY"
            value-format="YYYY-MM-DD" placeholder="Enter amount" />
        </el-form-item>
      </div>
      <div class="form-group py-2">
        <el-form-item prop="notes" class="!w-full" label="Notes">
          <el-input type="textarea" rows="3" class="!w-full" v-model="formData.notes" placeholder="Description" />
        </el-form-item>
      </div>

      <div class="form-group py-2 text-blue-500 bg-blue-50 rounded p-2">
        Transactions records can't be updated once created.
      </div>

      <div class="mt-5 sm:mt-6 text-right">
        <button @click="emits('close-modal')" type="button" class="btn-primary-outline">
          Close
        </button>

        <button @click="submitForm(itemFormRef)" type="button" class="btn-primary" v-if="action === 'create'">
          Save
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { PaymentForm } from "@/type/finance.type";
import { useFinanceStore } from "@/store/finance.store";

const props = defineProps({
  form: Object,
  action: String
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useFinanceStore();
const itemFormRef = ref<FormInstance>();
const errors = ref<any>({});
const formData = reactive<PaymentForm>(props.form as PaymentForm);

const rules = reactive<FormRules<PaymentForm>>({
  invoice_id: [
    { required: true, message: "Please select an invoice", trigger: "change" },
  ],
  amount: [
    { required: true, message: "Please enter an amount", trigger: "blur" },
  ],
  payment_date: [
    { required: true, message: "Please select a date", trigger: "change" },
  ],
  payment_method: [
    {
      required: true,
      message: "Please select a payment method",
      trigger: "change",
    },
  ],

});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  const res = await store.createPayment(formData);
  if (res.status == 200 || res.status == 201) {
    resetForm(itemFormRef.value as FormInstance);
    emits('close-modal')
    ElNotification({
      title: 'Success',
      message: 'Payment created successfully',
      type: 'success',
    })
  } else if (res.status == 422) {
    errors.value = res.data.errors
  } else {
    ElNotification({
      title: 'Error',
      message: 'Something went wrong. Please try again',
      type: 'error',
    })
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  console.log(props.form);
  if (props.action == 'edit' && (props.form as any).invoice?.payment_status == "Paid") {
    store.invoicesList.push((props.form as any).invoice)
  }
});
</script>
<style lang=""></style>
