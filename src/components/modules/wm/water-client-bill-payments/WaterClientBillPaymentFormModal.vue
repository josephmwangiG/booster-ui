<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <el-form-item prop="water_client_bill_id" class="flex-1" :label="'Select Bill'">
        <el-select v-model="formData.water_client_bill_id" filterable placeholder="Select bill">
          <el-option v-for="item in store.clientBillItems " :key="item.id" :label="item.bill_number" :value="item.id" />
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

        <button @click="submitForm(itemFormRef)" type="button" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? "Please wait..." : "Save" }}
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useWaterClientBillsStore } from "@/store/water-client-bills.store";
import { WaterClientBillPaymentForm } from "@/type/water-client.type";

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterClientBillsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<WaterClientBillPaymentForm>(props.form as WaterClientBillPaymentForm);
const isSubmitting = ref(false);

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const rules = reactive<FormRules<WaterClientBillPaymentForm>>({
  water_client_bill_id: [
    { required: true, message: "Please select bill", trigger: "change" },
  ],
  amount: [
    { required: true, message: "Please enter amount", trigger: "blur" },
    { min: 0.01, message: "Amount must be greater than 0", trigger: "blur" },
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
        isSubmitting.value = true;
        try {
          // Ensure the form data is properly formatted
          const submissionData = {
            id: formData.id,
            water_client_bill_id: formData.water_client_bill_id,
            amount: Number(formData.amount),
            payment_date: formData.payment_date,
            payment_method: formData.payment_method,
            payment_ref: formData.payment_ref || ''
          };
          
          console.log('Submitting form data:', submissionData);
          console.log('Original form data:', formData);
          
          const res = await store.createWaterClientBillPayment(submissionData);
          if (res.status == 200 || res.status == 201) {
            resetForm(itemFormRef.value as FormInstance);
            ElNotification({
              title: "Success",
              message: "Client bill payment was created",
              type: "success",
            })
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
        } finally {
          isSubmitting.value = false;
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
    water_client_bill_id: null,
    amount: null,
    payment_date: '',
    payment_ref: '',
    payment_method: ''
  });
};

onMounted(() => {
  store.getBillItems();
});
</script>
<style lang=""></style>
