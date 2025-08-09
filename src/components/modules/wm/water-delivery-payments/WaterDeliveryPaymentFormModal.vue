<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <el-form-item prop="water_delivery_id" class="flex-1" :label="'Delivery Number'">
        <el-select v-model="formData.water_delivery_id" filterable placeholder="Select delivery">
          <el-option v-for="item in store.waterDeliverItems " :key="item.id" :label="item.delivery_number" :value="item.id" />
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
            <el-option :label="payment_method.name" :value="payment_method.name" v-for="payment_method in store.payment_methods" :key="payment_method.id"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="payment_reference" class="flex-1" :label="'Payment Ref'">
          <el-input v-model="formData.payment_reference" placeholder="Enter payment ref" />
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
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useWaterDeliveriesStore } from "@/store/water-deliveries.store";
import { WaterDeliveryPaymentForm } from "@/type/water-delivery.type";

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterDeliveriesStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<WaterDeliveryPaymentForm>(props.form as WaterDeliveryPaymentForm);

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const rules = reactive<FormRules<WaterDeliveryPaymentForm>>({
  water_delivery_id: [
    { required: true, message: "Please select delivery", trigger: "change" },
  ],
  amount: [
    { required: true, message: "Please enter amount", trigger: "blur" },
    { min: 1, message: "Amount must be greater than 0", trigger: "blur" },
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
      const res = await store.createWaterDeliveryItemPayment(formData);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        ElNotification({
          title: "Success",
          message: "Payment was created",
          type: "success",
        })
        emits("close-modal");
      }
    }
  });


};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  store.getWaterDeliveryItems();
});
</script>
<style lang=""></style>
