<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="client_name" class="flex-1" :label="'Client Name'">
          <el-input v-model="formData.client_name" placeholder="Enter client name" />
        </el-form-item>
        <el-form-item prop="phone_number" class="flex-1" :label="'Phone Number'">
          <el-input v-model="formData.phone_number" placeholder="Enter phone number" @focusout="getClientBalance()" />
        </el-form-item>
      </div>
      <div class="lg:flex gap-3">
        <el-form-item prop="payment_method" class="flex-1" :label="'Payment Method'">
          <el-select v-model="formData.payment_method" placeholder="Select option" class="flex-1">
            <el-option v-for="payment_method in store.payment_methods" :key="payment_method.id"
              :label="payment_method.name" :value="payment_method.name" />
          </el-select>
        </el-form-item>

        <el-form-item prop="payment_date" label="Payment date" class="flex-1">
          <el-date-picker format="MMM DD YYYY" value-format="YYYY-MM-DD" v-model="formData.payment_date"
            aria-label="Pick a date" placeholder="Pick a date" style="width: 100%" />
        </el-form-item>
      </div>
      <div class="bg-green-100 p-3 mb-3 text-green-500 rounded" v-if="formData.phone_number && balance && balance > 0">
        Client has a total balance of {{ formatAmount(balance) }}
      </div>
      <div class="bg-red-100 p-3 mb-3 text-red-500 rounded" v-if="formData.phone_number && balance == 0">
        Client pending balance found for this phone number.
      </div>
      <el-form-item prop="amount" class="flex-1" :label="'Total Cost'">
        <el-input v-model="formData.amount" placeholder="Enter amount" />
      </el-form-item>

      <div class="mt-5 sm:mt-6 text-right">
        <button @click="emits('close-modal')" type="button" class="btn-primary-outline">
          Close
        </button>

        <button @click="submitForm(itemFormRef)" type="button" class="btn-primary" :disabled="balance == 0">
          {{ action === "create" ? "Save" : "Update" }}
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { CollectionPaymentForm } from "@/type/water-delivery.type";
import { useWaterCollectionsStore } from "@/store/water-collections.store";
import { formatAmount } from "@/composables/helper_functions";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterCollectionsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<CollectionPaymentForm>(props.form as CollectionPaymentForm);
const balance: any = ref(null);

const rules = reactive<FormRules<CollectionPaymentForm>>({
  client_name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  phone_number: [
    { required: true, message: "Please enter phone", trigger: "blur" },
  ],
  payment_method: [
    { required: true, message: "Please select option", trigger: "change" },
  ],
  payment_date: [
    { required: true, message: "Please select date", trigger: "change" },
  ],
  amount: [
    { required: true, message: "Please enter amount", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });


  if (props.action === "create") {
    const res = await store.createPayment(formData);
    if (res.status == 200 || res.status == 201) {
      resetForm(itemFormRef.value as FormInstance);
      emits("close-modal");
      ElNotification({
        title: "Success",
        type: "success",
        message: "Payment was created",
      })
    }
  }
};

const getClientBalance = async () => {
  if (!formData.phone_number) return
  const res =await store.getClientBalance(formData.phone_number);
  console.log(res)
  res.data.balance ? balance.value = res.data.balance : balance.value = 0
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(async () => {
  await store.getMeters()
});
</script>
<style lang=""></style>
