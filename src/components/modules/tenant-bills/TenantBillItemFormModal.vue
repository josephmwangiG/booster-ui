<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <el-form-item prop="previous_meter_reading" class="flex-1" :label="'Previous Reading'"
        v-if="formData.utility && formData.utility.category == 'Meter Reading'">
        <el-input type="number" @focusout="getBillAmount" v-model="formData.previous_meter_reading"
          placeholder="Enter previous meter reading">
        </el-input>
      </el-form-item>
      <el-form-item type="number" @focusout="getBillAmount" prop="current_meter_reading" class="flex-1"
        :label="'Current Reading'" v-if="formData.utility && formData.utility.category == 'Meter Reading'">
        <el-input v-model="formData.current_meter_reading" placeholder="Enter current meter reading">
        </el-input>
      </el-form-item>

      <el-form-item type="number" prop="consumption" class="flex-1" :label="'Consumption'"
        v-if="formData.utility && formData.utility.category == 'Meter Reading'">
        <el-input v-model="consumption" placeholder="Consumption" :disabled="true">
        </el-input>
      </el-form-item>

      <el-form-item type="number" prop="rate" class="flex-1" :label="'Rate'" v-if="formData.utility">
        <el-input @focusout="getBillAmount" v-model="rate" placeholder="Enter rate">
        </el-input>
      </el-form-item>

      <el-form-item type="number" prop="amount" class="flex-1" :label="'Bill Amount'">
        <el-input v-model="formData.amount" type="number" placeholder="Enter amount" />
      </el-form-item>

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
import { TenantBillItemForm } from "@/type/tenant.type";
import { useTenantBillsStore } from "@/store/tenant-bills.store";

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useTenantBillsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<TenantBillItemForm>(props.form as TenantBillItemForm);

const rate = ref(formData.utility?.rate)

const consumption = computed(() => {
  if (!formData.current_meter_reading || !formData.previous_meter_reading) return 0
  return Number(formData.current_meter_reading) - Number(formData.previous_meter_reading)
})


const validateCurrentMeterReading = (_rule: any, _value: any, callback: any) => {
  if (formData?.utility && formData.utility.category == "Meter Reading") {
    if (formData.current_meter_reading < formData.previous_meter_reading) {
      callback(new Error('Current reading should be greater than previous reading'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const rules = reactive<FormRules<TenantBillItemForm>>({
  current_meter_reading: [
    { validator: validateCurrentMeterReading, message: "Current reading should be greater than previous reading", trigger: "blur" },
  ],
  amount: [
    { required: true, message: "Please enter amount", trigger: "blur" },
  ],
});


const getBillAmount = (_e: any) => {
  if (formData.utility && formData.utility.category == "Meter Reading") {
    formData.amount = (Number(formData.current_meter_reading) - Number(formData.previous_meter_reading)) * Number(rate.value)
  } else {
    formData.amount = Number(rate)
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid, _fields) => {
    if (!valid) {
      return;
    } else {
      const res = await store.updateTenantBillItem(formData);
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
