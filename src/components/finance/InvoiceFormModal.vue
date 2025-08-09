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
      <div class="form-group">

        <el-form-item
          class="flex-1"
          label="Select Order/Sale"
          prop="order_id"
        >
          <el-select
            filterable
            v-model="formData.order_id"
            placeholder="Select an order"
          >
            <el-option
              v-for="order in store.salesOrders"
              :value="order.id"
              :key="order.value"
              :label="order.order_number || order.sale_number"
            >
              <span style="float: left">{{
                order.order_number || order.sale_number
              }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
              >
               KES {{ order.total_amount.toLocaleString() }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="form-group py-2">
        <el-form-item
          prop="due_date"
          class="!w-full"
          label="Due Date"
        >
          <el-date-picker
            class="!w-full"
            v-model="formData.due_date"
            format="MMM DD YYYY"
            value-format="YYYY-MM-DD"
            placeholder="Select a date"
          />
        </el-form-item>
      </div>

      <div class="mt-5 sm:mt-6 text-right">
        <button
          @click="emits('close-modal')"
          type="button"
          class="btn-primary-outline"
        >
          Close
        </button>

        <button
          @click="submitForm(itemFormRef)"
          type="button"
          class="btn-primary"
        >
          Save
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { useFinanceStore } from "@/store/finance.store";

export type InvoiceForm = {
  order_id: number;
  due_date: Date;
};

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const router = useRouter();
const store = useFinanceStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<InvoiceForm>(props.form as InvoiceForm);

const rules = reactive<FormRules<InvoiceForm>>({
  order_id: [
    { required: true, message: "Please select an order", trigger: "change" },
  ],
  due_date: [
    { required: true, message: "Please select a date", trigger: "change" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  const res = await store.createInvoice(formData);
  if (res.status == 200 || res.status == 201) {
    resetForm(itemFormRef.value as FormInstance);
    router.push({ name: "invoice-details", params: { id: res.data.invoice.id } });
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(async() => {
  await store.getOrders();
});
</script>
<style lang=""></style>
