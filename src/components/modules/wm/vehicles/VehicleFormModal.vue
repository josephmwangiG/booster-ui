<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

        <el-form-item prop="number_plate" class="flex-1" :label="'Number Plate'">
          <el-input v-model="formData.number_plate" placeholder="Enter number plate" />
        </el-form-item>
        <el-form-item prop="capacity" class="flex-1" :label="'Capacity in litres'">
          <el-input type="number" v-model="formData.capacity" placeholder="Enter capacity" />
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
import { VehicleForm } from "@/type/vehicle.type";
import { useVehiclesStore } from "@/store/vehicle.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useVehiclesStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<VehicleForm>(props.form as VehicleForm);

const rules = reactive<FormRules<VehicleForm>>({
  number_plate: [
    { required: true, message: "Please enter number plate", trigger: "blur" },
  ],

  capacity: [
    { required: true, message: "Please enter capacity", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, _fields) => {
    if (!valid) {
      return
    } else {
      if (props.action === "create") {
        const res = await store.createVehicle(formData);
        if (res.status == 200 || res.status == 201) {
          resetForm(itemFormRef.value as FormInstance);
          emits("close-modal");
          ElNotification({
            title: "Success",
            type: "success",
            message: "Vehicle was created",
          })
        }
      } else {
        const res = await store.updateVehicle(formData);
        if (res.status == 200 || res.status == 201) {
          resetForm(itemFormRef.value as FormInstance);
          emits("close-modal");
          ElNotification({
            title: "Success",
            type: "success",
            message: "Vehicle was updated",
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
