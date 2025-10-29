<template>
  <div class="mt-2">
    <el-form
      ref="itemFormRef"
      :model="formData"
      :rules="rules"
      label-width="auto"
      status-icon
      label-position="top"
    >
      <div class="lg:flex gap-3">
        <el-form-item
          prop="water_delivery_id"
          class="flex-1"
          :label="'Select Delivery'"
        >
          <el-select
            v-model="formData.water_delivery_id"
            placeholder="Select a delivery"
            filterable
            :loading="loading"
          >
            <el-option
              v-for="item in store.waterDeliverItems"
              :key="item.id"
              :label="item.ref"
              :value="item.id"
            >
              <span style="float: left">{{ item.ref }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
              >
                <span class="font-semibold"
                  >{{ item.client_name }}-{{ item.phone }}</span
                >
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="lg:flex gap-3">
        <div class="flex-1">
          <el-form-item prop="amount" label="Amount Paid">
            <el-input
              v-model="formData.amount"
              placeholder="Amount Paid"
              type="number"
              class="flex-1 !w-full"
            >
            </el-input>
          </el-form-item>
        </div>
        <div class="flex-1">
          <el-form-item prop="payment_method" label="Payment Method">
            <el-select
              v-model="formData.payment_method"
              placeholder="Payment Method"
              class="flex-1 !w-full"
              :loading="loading"
            >
              <el-option
                v-for="payment_method in store.payment_methods"
                :key="payment_method.id"
                :label="payment_method.name"
                :value="payment_method.name"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="lg:flex gap-3">
        <div class="flex-1">
          <el-form-item prop="payment_reference" label="Payment Reference">
            <el-input
              v-model="formData.payment_reference"
              placeholder="Enter payment reference"
              class="flex-1"
            >
            </el-input>
          </el-form-item>
        </div>

        <div class="flex-1">
          <el-form-item prop="payment_date" label="Payment date">
            <el-date-picker
              format="MMM DD YYYY"
              value-format="YYYY-MM-DD"
              v-model="formData.payment_date"
              aria-label="Pick a time"
              placeholder="Payment date"
              style="width: 100%"
            />
          </el-form-item>
        </div>
      </div>

      <div class="mt-5 sm:mt-6 flex justify-end gap-3">
        <button
          @click="emits('close-modal')"
          type="button"
          class="btn-primary-outline !mr-0"
        >
          Close
        </button>

        <button
          @click="submitForm(itemFormRef, 'completed')"
          type="button"
          :disabled="isSubmitting"
          class="btn-primary"
        >
          {{ isSubmitting ? "Please wait..." : "Save" }}
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
  ElNotification,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { WaterDeliveryPaymentForm } from "@/type/water-delivery.type";
import { useWaterDeliveriesStore } from "@/store/water-deliveries.store";

const props = defineProps({
  form: Object,
  action: String,
});

const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterDeliveriesStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<WaterDeliveryPaymentForm>({
  ...(props.form as WaterDeliveryPaymentForm),
});
const loading = ref(true);
const isSubmitting = ref(false);

const rules = reactive<FormRules<WaterDeliveryPaymentForm>>({
  water_delivery_id: [
    { required: true, message: "Please enter name", trigger: "change" },
  ],
  payment_date: [
    { required: true, message: "Please select date", trigger: "change" },
  ],
  payment_reference: [
    { required: true, message: "Please enter reference", trigger: "blur" },
  ],
  payment_method: [
    {
      required: true,
      message: "Please select payment method",
      trigger: "change",
    },
  ],
  amount: [{ required: true, message: "Please enter amount", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined, status: string) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  isSubmitting.value = true;

  try {
    // Ensure numeric fields are properly converted
    const submitData = {
      ...formData,
      status: status,
    };

    if (props.action === "create") {
      const res = await store.createWaterDeliveryItemPayment(submitData);
      if (res.status == 200 || res.status == 201) {
        // Payment is created server-side during creation when record_payment is set, avoid duplicate client creation

        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        emits("submit-form");
        ElNotification({
          title: "Success",
          type: "success",
          message: "Payment was created successfully",
        });
      }
    }
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(async () => {
  loading.value = true;
  await store.getWaterDeliveryItems();

  loading.value = false;
});
</script>
<style lang=""></style>
