<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="name" class="flex-1" :label="'Utility Name'">
          <el-input v-model="formData.name" placeholder="Enter utility name" />
        </el-form-item>


      </div>

      <el-form-item prop="category" class="flex-1" :label="'Payment Type'">
        <el-select v-model="formData.category" placeholder="Select payment type">
          <el-option label="Meter Reading" value="Meter Reading" />
          <el-option label="Flat Rate" value="Flat Rate" />
        </el-select>
      </el-form-item>

      <el-form-item prop="rate" class="flex-1" :label="'Rate'">
        <el-input v-model="formData.rate" placeholder="Enter amount charged" />
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
import { UtilityForm } from "@/type/utility.type";
import { useUtilitiesStore } from "@/store/utilities.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useUtilitiesStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<UtilityForm>(props.form as UtilityForm);



const rules = reactive<FormRules<UtilityForm>>({
  name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  rate: [
    { required: true, message: "Enter amount", trigger: "blur" },
  ],
  category: [
    { required: true, message: "Select category", trigger: "change" },
  ],

});



const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  if (props.action === "create") {
    const res = await store.createUtility(formData);
    if (res.status == 200 || res.status == 201) {
      resetForm(itemFormRef.value as FormInstance);
      emits("close-modal");
      ElNotification({
        title: "Success",
        type: "success",
        message: "Utility was created",
      })
    }
  } else {
    const res = await store.updateUtility(formData);
    if (res.status == 200 || res.status == 201) {
      resetForm(itemFormRef.value as FormInstance);
      emits("close-modal");
      ElNotification({
        title: "Success",
        type: "success",
        message: "Utility was updated",
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
