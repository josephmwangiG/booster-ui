<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="name" class="flex-1" :label="'Property Name'">
          <el-input v-model="formData.name" placeholder="Enter property name" />
        </el-form-item>

        <el-form-item class="flex-1" label="Property Type" prop="type">
          <el-select v-model="formData.type" placeholder="Select a store">
            <el-option value="Residential" label="Residential">
            </el-option>
            <el-option value="Commercial" label="Commercial">
            </el-option>
          </el-select>
        </el-form-item>

      </div>

      <div class="lg:flex gap-3 py-2">
        <el-form-item prop="address" class="flex-1" :label="'Property address'">
          <el-input v-model="formData.address" placeholder="Enter property address" />
          <small>Enter property location</small>
        </el-form-item>
      </div>

      <div class="mt-5 sm:mt-6 text-right">
        <button @click="emits('close-modal')" type="button" class="btn-primary-outline">
          Close
        </button>

        <button @click="submitForm(itemFormRef)" type="button" :disabled="isSubmitting" class="btn-primary">
          {{ isSubmitting ? "Please wait..." : "Save" }}
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { PropertyForm } from "@/type/property.type";
import { usePropertiesStore } from "@/store/properties.store";

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const router = useRouter();
const store = usePropertiesStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<PropertyForm>(props.form as PropertyForm);
const isSubmitting = ref(false);



const rules = reactive<FormRules<PropertyForm>>({
  name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  type: [
    { required: true, message: "Please select type", trigger: "chnage" },
  ],

});



const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  isSubmitting.value = true;

  try {
    const res = await store.createProperty(formData);
    if (res.status == 200 || res.status == 201) {
      resetForm(itemFormRef.value as FormInstance);
      router.push({ name: "property", params: { id: res.data.id } });
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
