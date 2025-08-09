<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <el-form-item prop="unit_code" class="flex-1" :label="'Unit Code'">
        <el-input v-model="formData.unit_code" placeholder="Enter unit code" />
      </el-form-item>

      <el-form-item prop="rent" class="flex-1" :label="'Monthly Rent'">
        <el-input type="number" v-model="formData.rent" placeholder="Enter monthly rent" />
      </el-form-item>


      <div class="lg:flex gap-3">
        <div class="flex-1 lg:flex gap-3 py-2">
          <el-form-item prop="bedrooms" class="flex-1" :label="'Bedrooms'">
            <el-input type="number" v-model="formData.bedrooms" placeholder="Enter number of bedrooms" />
          </el-form-item>
        </div>
        <div class="flex-1 lg:flex gap-3 py-2">
          <el-form-item prop="bathrooms" class="flex-1" :label="'Bathrooms'">
            <el-input type="number" v-model="formData.bathrooms" placeholder="Enter number of bathrooms" />
          </el-form-item>
        </div>


      </div>


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
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { UnitForm } from "@/type/property.type";
import { usePropertiesStore } from "@/store/properties.store";

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = usePropertiesStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<UnitForm>(props.form as UnitForm);



const rules = reactive<FormRules<UnitForm>>({
  unit_code: [
    { required: true, message: "Please enter unit code", trigger: "blur" },
  ],
  rent: [
    { required: true, message: "Please enter rent", trigger: "blur" },
    { min: 0, message: "Rent must be greater than 0", trigger: "blur" },
  ],
});



const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });


  const res = await store.createUnit(formData);
  if (res.status == 200 || res.status == 201) {
    resetForm(itemFormRef.value as FormInstance);
    ElNotification({
      title: "Success",
      message: "Property unit was created",
      type: "success",
    })
    emits("close-modal");
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
