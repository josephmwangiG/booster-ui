<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="client_name" class="flex-1" :label="'Client Name'">
          <el-input v-model="formData.client_name" placeholder="Enter client name" />
        </el-form-item>
        <el-form-item prop="meter_number" class="flex-1" :label="'Meter Number'">
          <el-input v-model="formData.meter_number" placeholder="Enter meter number" />
        </el-form-item>
      </div>
      <div class="lg:flex gap-3">
        <el-form-item prop="phone" class="flex-1" :label="'Phone Number'">
          <el-input v-model="formData.phone" placeholder="Enter phone number" />
        </el-form-item>
        <el-form-item prop="email" class="flex-1" :label="'Email'">
          <el-input v-model="formData.email" placeholder="Enter email" />
        </el-form-item>
      </div>

      <el-form-item prop="alternative_phone" class="flex-1" :label="'Alternative Number'">
        <el-input v-model="formData.alternative_phone" placeholder="Enter alternative phone number" />
      </el-form-item>

      <div class="lg:flex gap-3 py-2">
        <el-form-item prop="id_number" class="flex-1" :label="'National ID'">
          <el-input v-model="formData.id_number" placeholder="Enter national id" />
        </el-form-item>
      </div>
      <div class="lg:flex gap-3 py-2">
        <el-form-item prop="address" class="flex-1" :label="'Address'">
          <el-input v-model="formData.address" placeholder="Enter address" />
        </el-form-item>
      </div>

      <div class="mt-5 sm:mt-6 text-right">
        <button @click="emits('close-modal')" type="button" class="btn-primary-outline">
          Close
        </button>

        <button @click="submitForm(itemFormRef)" type="button" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? "Please wait..." : (action === "create" ? "Save" : "Update") }}
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { WaterClientForm } from "@/type/water-client.type";
import { useWaterClientsStore } from "@/store/water-clients.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterClientsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<WaterClientForm>(props.form as WaterClientForm);
const isSubmitting = ref(false);

const rules = reactive<FormRules<WaterClientForm>>({
  client_name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  meter_number: [
    { required: true, message: "Please enter meter_number", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "Please enter phone", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  isSubmitting.value = true;

  try {
    if (props.action === "create") {
      const res = await store.createClient(formData);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        ElNotification({
          title: "Success",
          type: "success",
          message: "Client was created",
        })
      }
    } else {
      const res = await store.updateClient(formData);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        ElNotification({
          title: "Success",
          type: "success",
          message: "Client was updated",
        })
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

onMounted(() => {

});
</script>
<style lang=""></style>
