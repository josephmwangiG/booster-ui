<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="client_name" class="flex-1" :label="'Client Name'">
          <el-input v-model="formData.client_name" placeholder="Enter client name" />
        </el-form-item>
        <el-form-item prop="phone_number" class="flex-1" :label="'Phone Number'">
          <el-input v-model="formData.phone_number" placeholder="Enter phone number" />
        </el-form-item>
      </div>
      <el-form-item prop="water_meter_id" class="flex-1" :label="'Select Meter'">
        <el-select v-model="formData.water_meter_id" placeholder="Select option" class="flex-1">
          <el-option v-for="meter in store.meters" :key="meter.id" :label="meter.code_number"
            :value="meter.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="amount" class="flex-1" :label="'Total Cost'">
        <el-input v-model="formData.amount" placeholder="Enter amount" />
      </el-form-item>

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
import { PendingMoneyCollectionForm } from "@/type/water-delivery.type";
import { useWaterCollectionsStore } from "@/store/water-collections.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterCollectionsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<PendingMoneyCollectionForm>(props.form as PendingMoneyCollectionForm);

const rules = reactive<FormRules<PendingMoneyCollectionForm>>({
  client_name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  phone_number: [
    { required: true, message: "Please enter phone", trigger: "blur" },
  ],
  water_meter_id: [
    { required: true, message: "Please select option", trigger: "change" },
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
    // Note: Creating pending collections is not supported as the API endpoint only allows GET and HEAD methods
    ElNotification({
      title: "Not Supported",
      type: "warning",
      message: "Creating pending collections is not currently supported. The API only allows viewing existing collections.",
    });
    emits("close-modal");
    return;
  }
};



onMounted(async () => {
  await store.getMeters()
});
</script>
<style lang=""></style>
