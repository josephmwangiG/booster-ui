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
      <el-form-item prop="water_client_id" class="flex-1" :label="'Client'">
        <el-select
          v-model="formData.water_client_id"
          placeholder="Select a client"
          filterable
          @change="handleClientChange"
          :loading="loading"
        >
          <el-option
            v-for="item in validClientItems"
            :key="item.id"
            :label="`${item.client_name} (Meter No. ${item.meter_number})`"
            :value="item.id"
          >
            <span style="float: left">{{ item.client_name }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >
              Meter No.
              <span class="font-semibold">{{ item.meter_number }}</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <div class="lg:flex gap-3">
        <el-form-item prop="from" class="flex-1" :label="'Start Date'">
          <el-date-picker
            class="!w-full"
            v-model="formData.from"
            format="MMM DD YYYY"
            :disabled-date="disabledDate"
            value-format="YYYY-MM-DD"
            placeholder="Select a date"
          />
        </el-form-item>
        <el-form-item prop="to" class="flex-1" :label="'End Date'">
          <el-date-picker
            class="!w-full"
            v-model="formData.to"
            format="MMM DD YYYY"
            :disabled-date="disabledDate"
            value-format="YYYY-MM-DD"
            placeholder="Select a date"
          />
        </el-form-item>
      </div>

      <div class="lg:flex gap-3">
        <el-form-item
          prop="previous_meter_reading"
          class="flex-1"
          :label="'Previous Reading'"
        >
          <el-input
            type="number"
            v-model="formData.previous_meter_reading"
            placeholder="Enter previous meter reading"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          @focusout="getBillAmount"
          prop="current_meter_reading"
          class="flex-1"
          :label="'Current Reading'"
        >
          <el-input
            type="number"
            v-model="formData.current_meter_reading"
            placeholder="Enter current meter reading"
          >
          </el-input>
        </el-form-item>
      </div>

      <el-form-item prop="consumption" class="flex-1" :label="'Consumption'">
        <el-input
          type="number"
          v-model="consumption"
          placeholder="Consumption"
          :disabled="true"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="rate" class="flex-1" :label="'Rate per cubic meter'">
        <el-input
          type="number"
          @focusout="getBillAmount"
          v-model="formData.rate"
          placeholder="Enter rate per unit"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="amount" class="flex-1" :label="'Bill Amount'">
        <el-input
          v-model="formData.amount"
          type="number"
          placeholder="Enter amount"
        />
      </el-form-item>

      <el-form-item prop="due_date" class="flex-1" :label="'Due Date'">
        <el-date-picker
          class="!w-full"
          v-model="formData.due_date"
          format="MMM DD YYYY"
          value-format="YYYY-MM-DD"
          placeholder="Select due date"
        />
      </el-form-item>
      <div class="mt-5 sm:mt-6 text-right">
        <button
          @click="emits('close-modal')"
          type="button"
          class="btn-primary-outline"
        >
          Close
        </button>
        <button
          @click="submitForm(itemFormRef, 'Draft')"
          type="button"
          class="btn-primary mr-2"
          :disabled="isSubmitting"
        >
          {{
            isSubmitting
              ? "Please wait..."
              : action === "create"
              ? "Generate Draft Bill"
              : "Update Draft Bill"
          }}
        </button>
        <button
          @click="submitForm(itemFormRef, 'Pending')"
          type="button"
          class="btn-primary"
          :disabled="isSubmitting"
        >
          {{
            isSubmitting
              ? "Please wait..."
              : action === "create"
              ? "Save"
              : "Update"
          }}
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import {
  ElNotification,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { useWaterClientBillsStore } from "@/store/water-client-bills.store";
import { WaterClientBillForm } from "@/type/water-client.type";
import { useWaterConfigStore } from "@/store/water-config.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterClientBillsStore();
const itemFormRef = ref<FormInstance>();
const wmConfig = useWaterConfigStore();
const validClientItems = computed(() =>
  (store.clientItems || []).filter(
    (c: any) =>
      c.meter_number !== null &&
      c.meter_number !== undefined &&
      String(c.meter_number).trim() !== ""
  )
);
const formData = reactive<WaterClientBillForm>({
  id: null,
  water_client_id: "",
  previous_meter_reading: 0,
  current_meter_reading: 0,
  amount: 0,
  rate: 0,
  from: "",
  to: "",
  due_date: "",
  payment_status: "",
  ...props.form,
} as WaterClientBillForm);
const loading = ref(true);
const isSubmitting = ref(false);

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

const consumption = computed(() => {
  const current = Number(formData.current_meter_reading);
  const previous = Number(formData.previous_meter_reading);
  if (Number.isNaN(current) || Number.isNaN(previous)) return 0;
  return current - previous;
});

const validateCurrentMeterReading = (
  _rule: any,
  _value: any,
  callback: any
) => {
  if (
    Number(formData.current_meter_reading) <
    Number(formData.previous_meter_reading)
  ) {
    callback(
      new Error("Current reading should be greater than previous reading")
    );
  } else {
    callback();
  }
};
const validateBillDurationStart = (_rule: any, _value: any, callback: any) => {
  if (!formData.from || !formData.to) {
    return callback();
  }
  if (formData.from > formData.to) {
    return callback(
      new Error("Start date should be less than or equal to end date")
    );
  }
  return callback();
};

const rules = reactive<FormRules<WaterClientBillForm>>({
  current_meter_reading: [
    {
      validator: validateCurrentMeterReading,
      message: "Current reading should be greater than previous reading",
      trigger: "blur",
    },
    {
      required: true,
      message: "Please enter current meter reading",
      trigger: "blur",
    },
    { min: 0, message: "Please enter positive value", trigger: "blur" },
  ],
  from: [
    { required: true, message: "Please select start date", trigger: "change" },
    {
      validator: validateBillDurationStart,
      message: "Start date should be less than or equal to end date",
      trigger: "change",
    },
  ],
  water_client_id: [
    { required: true, message: "Please select a client", trigger: "change" },
  ],
  to: [
    { required: true, message: "Please select end date", trigger: "change" },
  ],
  rate: [
    { required: true, message: "Please enter rate", trigger: "blur" },
    { min: 0, message: "Please enter positive value", trigger: "blur" },
  ],
  previous_meter_reading: [
    {
      required: true,
      message: "Please enter current meter reading",
      trigger: "blur",
    },
  ],
  due_date: [
    { required: true, message: "Please select due date", trigger: "change" },
  ],
});

const getBillAmount = (_e: any) => {
  const amount =
    (Number(formData.current_meter_reading) -
      Number(formData.previous_meter_reading)) *
    Number(formData.rate);
  formData.amount = amount > 0 ? amount : 0;
};

const handleClientChange = async (client_id: string) => {
  loading.value = true;
  try {
    // Only auto-fill previous reading for new bills, not when editing existing bills
    if (props.action === "create") {
      const fetchLastBillWithRetry = async (
        retries = 2,
        delayMs = 500
      ): Promise<any | null> => {
        for (let attempt = 0; attempt <= retries; attempt++) {
          const result = await store.getLastBill(client_id);
          if (
            result &&
            result.current_meter_reading !== undefined &&
            result.current_meter_reading !== null
          ) {
            return result;
          }
          if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
        return null;
      };

      const lastBill = await fetchLastBillWithRetry();

      if (lastBill) {
        formData.previous_meter_reading =
          Number(lastBill.current_meter_reading) || 0;
        if (!formData.rate || Number(formData.rate) === 0) {
          formData.rate = Number(lastBill.rate) || formData.rate;
        }
      } else {
        // No previous bill found; default to 0 so form remains submittable
        formData.previous_meter_reading = 0;
      }
    }
  } finally {
    loading.value = false;
  }
};

const submitForm = async (formEl: FormInstance | undefined, status: string) => {
  formData.payment_status = status;
  if (!formEl) return;
  formEl.validate(async (valid, _fields) => {
    if (!valid) {
      return;
    } else {
      isSubmitting.value = true;
      try {
        if (props.action == "create") {
          const res = await store.createWaterClientBill(formData);
          if (res.status == 200 || res.status == 201) {
            resetForm(itemFormRef.value as FormInstance);
            ElNotification({
              title: "Success",
              message: "Bill was created",
              type: "success",
            });
            emits("close-modal");
          }
        } else {
          const res = await store.updateWaterClientBill(formData);
          if (res.status == 200 || res.status == 201) {
            resetForm(itemFormRef.value as FormInstance);
            ElNotification({
              title: "Success",
              message: "Bill was updated",
              type: "success",
            });
            emits("close-modal");
          }
        }
      } finally {
        isSubmitting.value = false;
      }
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(async () => {
  loading.value = true;
  await store.getClientItems();
  // Prefill default rate if creating and rate not provided
  if (
    props.action === "create" &&
    (!formData.rate || Number(formData.rate) === 0)
  ) {
    formData.rate = Number(wmConfig.defaultRatePerCubicMeter) || 0;
  }
  loading.value = false;
});
</script>
<style lang=""></style>
