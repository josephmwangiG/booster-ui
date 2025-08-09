<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="name" class="flex-1" :label="'Payment Method'">
          <el-input v-model="formData.name" placeholder="Enter payment method" />
        </el-form-item>
      </div>

      <div class="mt-5 sm:mt-6 text-right">
        <button @click="emits('close-modal')" type="button" class="btn-primary-outline">
          Close
        </button>

        <button @click="submitForm(itemFormRef)" type="button" class="btn-primary">
          {{ action === "create" ? "Save" : "Update" }}
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { usePaymentMethodsStore } from "@/store/payment-methods.store";
import { PaymentMethodForm } from "@/type/payment-method.type";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = usePaymentMethodsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<PaymentMethodForm>(props.form as PaymentMethodForm);

const rules = reactive<FormRules<PaymentMethodForm>>({
  name: [
    { required: true, message: "Please enter payment method", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, _fields) => {
    if (!valid) {
      return
    } else {
      if (props.action === "create") {
        const res = await store.createPaymentMethod(formData);
        if (res.status == 200 || res.status == 201) {
          resetForm(itemFormRef.value as FormInstance);
          emits("close-modal");
          ElNotification({
            title: "Success",
            type: "success",
            message: "Payment method created!",
          })
        }
      } else {
        const res = await store.updatePaymentMethod(formData);
        if (res.status == 200 || res.status == 201) {
          resetForm(itemFormRef.value as FormInstance);
          emits("close-modal");
          ElNotification({
            title: "Success",
            type: "success",
            message: "Payment method updated!",
          })
        }
      }
    }
  });



};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {

});
</script>
<style lang=""></style>
