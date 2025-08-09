<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="code_number" class="flex-1" :label="'Code Number'">
          <el-input v-model="formData.code_number" placeholder="Enter meter code number" />
        </el-form-item>
      </div>

      <el-form-item prop="category" class="flex-1" :label="'Category'">
        <el-select v-model="formData.category" placeholder="Select category">
          <el-option label="Raw Water" value="Raw Water" />
          <el-option label="Pure Water" value="Pure Water" />
        </el-select>
      </el-form-item>

      <el-form-item prop="read_frequency" class="flex-1" :label="'Meter reading frequency'">
        <el-select v-model="formData.read_frequency" placeholder="Select category">
          <el-option label="Daily" value="Daily" />
          <el-option label="Weekly" value="Weekly" />
          <el-option label="BiWeekly" value="BiWeekly" />
          <el-option label="Monthly" value="Monthly" />
        </el-select>
      </el-form-item>

      <el-checkbox v-model="formData.is_master" label="This is the master meter" />

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
import { WaterMeterForm } from "@/type/water-meter.type";
import { useWaterMetersStore } from "@/store/water-meters.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterMetersStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<WaterMeterForm>(props.form as WaterMeterForm);

const rules = reactive<FormRules<WaterMeterForm>>({
  code_number: [
    { required: true, message: "Please enter code number", trigger: "blur" },
  ],

  category: [
    { required: true, message: "Select category", trigger: "change" },
  ],
  read_frequency: [
    { required: true, message: "Select an option", trigger: "change" },
  ],

});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, _fields) => {
    if (!valid) {
      return
    } else {
      if (props.action === "create") {
        const res = await store.createWaterMeter(formData);
        if (res.status == 200 || res.status == 201) {
          resetForm(itemFormRef.value as FormInstance);
          emits("close-modal");
          ElNotification({
            title: "Success",
            type: "success",
            message: "Meter was created",
          })
        }
      } else {
        const res = await store.updateWaterMeter(formData);
        if (res.status == 200 || res.status == 201) {
          resetForm(itemFormRef.value as FormInstance);
          emits("close-modal");
          ElNotification({
            title: "Success",
            type: "success",
            message: "Meter was updated",
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
