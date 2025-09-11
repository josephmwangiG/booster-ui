<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="name" class="flex-1" :label="'Meter Name'">
          <el-input v-model="formData.name" placeholder="Enter meter name" />
        </el-form-item>
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
      <div v-if="hasExistingMaster && props.action === 'create'" class="text-sm text-orange-600 mt-1">
        ⚠️ There is already a master meter in your organization
      </div>

      <div class="mt-5 sm:mt-6 text-right">
        <button @click="emits('close-modal')" type="button" class="btn-primary-outline">
          Close
        </button>

        <button @click="submitForm(itemFormRef)" type="button" :disabled="isSubmitting" class="btn-primary">
          {{ isSubmitting ? "Please wait..." : (action === "create" ? "Save" : "Update") }}
        </button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
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
const isSubmitting = ref(false);

const hasExistingMaster = computed(() => {
  return store.waterMeters.some((meter: any) => meter.is_master === true);
});

const rules = reactive<FormRules<WaterMeterForm>>({
  name: [
    { required: true, message: "Please enter meter name", trigger: "blur" },
  ],
  code_number: [
    { required: true, message: "Please enter code number", trigger: "blur" },
    { 
      validator: async (rule: any, value: any, callback: any) => {
        if (!value) {
          callback();
          return;
        }
        
        // Check if code number already exists
        const existingMeter = store.waterMeters.find((meter: any) => 
          meter.code_number === value && meter.id !== formData.id
        );
        
        if (existingMeter) {
          callback(new Error('This code number already exists'));
        } else {
          callback();
        }
      }, 
      trigger: "blur" 
    },
  ],
  category: [
    { required: true, message: "Select category", trigger: "change" },
  ],
  read_frequency: [
    { required: true, message: "Select an option", trigger: "change" },
  ],
  is_master: [
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (value && props.action === "create") {
          // Check if there's already a master meter
          const existingMaster = store.waterMeters.find((meter: any) => meter.is_master === true);
          
          if (existingMaster) {
            callback(new Error('Only one master meter is allowed. Please uncheck the existing master meter first.'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }, 
      trigger: "change" 
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, _fields) => {
    if (!valid) {
      return
    } else {
      isSubmitting.value = true;
      
      try {
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
      } catch (error: any) {
        console.error('Error creating/updating water meter:', error);
        
        // Handle validation errors from backend
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          
          // Show specific error messages
          if (errors.code_number) {
            ElNotification({
              title: "Validation Error",
              type: "error",
              message: errors.code_number[0],
            });
          } else if (errors.is_master) {
            ElNotification({
              title: "Validation Error",
              type: "error",
              message: errors.is_master[0],
            });
          } else {
            ElNotification({
              title: "Validation Error",
              type: "error",
              message: "Please check your input and try again",
            });
          }
        } else {
          ElNotification({
            title: "Error",
            type: "error",
            message: "An error occurred while saving the meter",
          });
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
  // Load water meters to enable validation
  await store.getWaterMeters();
});
</script>
<style lang=""></style>
