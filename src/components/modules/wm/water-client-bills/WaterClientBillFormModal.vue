<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">


      <el-form-item prop="water_client_id" class="flex-1" :label="'Client'">
        <el-select v-model="formData.water_client_id" placeholder="Select a client" filterable @change="handleClientChange" :loading="loading">
          <el-option v-for="item in store.clientItems" :key="item.id" :label="`${item.client_name} (Meter No. ${item.meter_number})`" :value="item.id">
            <span style="float: left">{{ item.client_name }}</span>
            <span style="
              float: right;
              color: var(--el-text-color-secondary);
              font-size: 13px;
            ">
              Meter No. <span class="font-semibold">{{ item.meter_number }}</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <div class="lg:flex gap-3">
        <el-form-item prop="from" class="flex-1" :label="'Start Date'">
          <el-date-picker class="!w-full" v-model="formData.from" format="MMM DD YYYY" :disabled-date="disabledDate"
            value-format="YYYY-MM-DD" placeholder="Select a date" />
        </el-form-item>
        <el-form-item prop="to" class="flex-1" :label="'End Date'">
          <el-date-picker class="!w-full" v-model="formData.to" format="MMM DD YYYY" :disabled-date="disabledDate"
            value-format="YYYY-MM-DD" placeholder="Select a date" />
        </el-form-item>
      </div>

      <div class="lg:flex gap-3">

        <el-form-item prop="previous_meter_reading" class="flex-1" :label="'Previous Reading'">
          <el-input type="number" @focusout="getBillAmount" v-model="formData.previous_meter_reading"
            placeholder="Enter previous meter reading">
          </el-input>
        </el-form-item>
        <el-form-item type="number" @focusout="getBillAmount" prop="current_meter_reading" class="flex-1"
          :label="'Current Reading'">
          <el-input v-model="formData.current_meter_reading" placeholder="Enter current meter reading">
          </el-input>
        </el-form-item>
      </div>

      <el-form-item type="number" prop="consumption" class="flex-1" :label="'Consumption'">
        <el-input v-model="consumption" placeholder="Consumption" :disabled="true">
        </el-input>
      </el-form-item>

      <el-form-item type="number" prop="rate" class="flex-1" :label="'Rate per cubic meter'">
        <el-input @focusout="getBillAmount" v-model="formData.rate" placeholder="Enter rate per unit">
        </el-input>
      </el-form-item>

      <el-form-item type="number" prop="amount" class="flex-1" :label="'Bill Amount'">
        <el-input v-model="formData.amount" type="number" placeholder="Enter amount" />
      </el-form-item>

      <el-form-item prop="due_date" class="flex-1" :label="'Due Date'">
        <el-date-picker class="!w-full" v-model="formData.due_date" format="MMM DD YYYY"
          value-format="YYYY-MM-DD" placeholder="Select due date" />
      </el-form-item>
      <div class="mt-5 sm:mt-6 text-right">
        <button @click="emits('close-modal')" type="button" class="btn-primary-outline">
          Close
        </button>
        <button @click="submitForm(itemFormRef, 'Pending')" type="button" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? "Please wait..." : "Save" }}
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useWaterClientBillsStore } from "@/store/water-client-bills.store";
import { WaterClientBillForm } from "@/type/water-client.type";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterClientBillsStore();
const itemFormRef = ref<FormInstance>();
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
  ...props.form
} as WaterClientBillForm);
const loading = ref(true);
const isSubmitting = ref(false);

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const consumption = computed(() => {
  if (!formData.current_meter_reading || !formData.previous_meter_reading) return 0
  return Number(formData.current_meter_reading) - Number(formData.previous_meter_reading)
})


const validateCurrentMeterReading = (_rule: any, _value: any, callback: any) => {
  if (formData.current_meter_reading < formData.previous_meter_reading) {
    callback(new Error('Current reading should be greater than previous reading'))
  } else {
    callback()
  }
}
const validateBillDurationStart = (_rule: any, _value: any, callback: any) => {
  if (formData.from > formData.to) {
    callback(new Error('Start date should be less than end date'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<WaterClientBillForm>>({
  current_meter_reading: [
    { validator: validateCurrentMeterReading, message: "Current reading should be greater than previous reading", trigger: "blur" },
    { required: true, message: "Please enter amount", trigger: "blur" },
    { min: 0, message: "Please enter positive value", trigger: "blur" }
  ],
  from: [
    { required: true, message: "Please select start date", trigger: "change" },
    { validator: validateBillDurationStart, message: "Start date should be less than end date", trigger: "change" },
  ],
  water_client_id: [
    { required: true, message: "Please select a client", trigger: "change" },
  ],
  to: [
    { required: true, message: "Please select end date", trigger: "change" },
  ],
  rate: [
    { required: true, message: "Please enter amount", trigger: "blur" },
    { min: 0, message: "Please enter positive value", trigger: "blur" }
  ],
  previous_meter_reading: [
    { required: true, message: "Please enter amount", trigger: "blur" },
    { min: 0, message: "Please enter positive value", trigger: "blur" }
  ],
  due_date: [
    { required: true, message: "Please select due date", trigger: "change" },
  ],
});


const getBillAmount = (_e: any) => {
  formData.amount = (Number(formData.current_meter_reading) - Number(formData.previous_meter_reading)) * Number(formData.rate)
}

const handleClientChange = async (client_id: string) => {
  const lastBill = await store.getLastBill(client_id);
  if (lastBill) {
    formData.previous_meter_reading = lastBill.current_meter_reading;
  }
};

const submitForm = async (formEl: FormInstance | undefined, status: string) => {
  formData.payment_status = status
  if (!formEl) return;
  formEl.validate(async (valid, _fields) => {
    if (!valid) {
      return;
    } else {
      isSubmitting.value = true;
      try {
        console.log('Submitting form data:', formData);
        console.log('Action:', props.action);
        
        if (props.action == "create") {
          const res = await store.createWaterClientBill(formData);
          if (res.status == 200 || res.status == 201) {
            resetForm(itemFormRef.value as FormInstance);
            ElNotification({
              title: "Success",
              message: "Bill was created",
              type: "success",
            })
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
            })
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
  console.log('Client items loaded:', store.clientItems);
  console.log('Form data:', formData);
  loading.value = false;
});
</script>
<style lang=""></style>

