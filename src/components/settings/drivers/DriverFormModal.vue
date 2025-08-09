<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="name" class="flex-1" :label="'Name'">
          <el-input v-model="formData.name" placeholder="Enter name" />
        </el-form-item>
      </div>
      <div class="lg:flex gap-3">
        <el-form-item prop="phone_number" class="flex-1" :label="'Phone Number'">
          <el-input v-model="formData.phone_number" placeholder="Enter phone number" />
        </el-form-item>
        <el-form-item prop="email" class="flex-1" :label="'Email'">
          <el-input v-model="formData.email" placeholder="Enter email" />
        </el-form-item>
      </div>

      <div class="lg:flex gap-3 py-2">
        <el-form-item prop="national_id" class="flex-1" :label="'National ID'">
          <el-input v-model="formData.national_id" placeholder="Enter national id" />
        </el-form-item>
      </div>
      <div class="lg:flex gap-3 py-2">
        <el-form-item prop="license_number" class="flex-1" :label="'License Number'">
          <el-input v-model="formData.license_number" placeholder="Enter license number" />
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
import { DriverForm } from "@/type/driver.type";
import { useDriversStore } from "@/store/drivers.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useDriversStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<DriverForm>(props.form as DriverForm);

const rules = reactive<FormRules<DriverForm>>({
  name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  license_number: [
    { required: true, message: "Please enter license", trigger: "blur" },
  ],
  phone_number: [
    { required: true, message: "Please enter phone", trigger: "blur" },
  ],
  national_id: [
    { required: true, message: "Please enter national id", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });


  if (props.action === "create") {
    const res = await store.createDriver(formData);
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
    const res = await store.updateDriver(formData);
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
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {

});
</script>
<style lang=""></style>
