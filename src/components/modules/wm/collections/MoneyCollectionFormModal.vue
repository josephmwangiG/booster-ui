<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="water_meter_id" class="flex-1" :label="'Select Water Meter'">
          <el-select v-model="formData.water_meter_id" placeholder="Select Water Meter" class="flex-1" :loading="loading" filterable>
            <el-option v-for="meter in store.meters" :key="meter.id" 
              :label="`${meter.code_number} - ${meter.name || 'N/A'}`"
              :value="meter.id" />
          </el-select>
        </el-form-item>
      </div>
      
      <div class="lg:flex gap-3">
        <el-form-item prop="collection_date" class="flex-1" :label="'Collection Date'">
          <el-date-picker format="MMM DD YYYY" value-format="YYYY-MM-DD" type="date"
            v-model="formData.collection_date" aria-label="Pick a date" placeholder="Pick a date" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="amount" class="flex-1" :label="'Amount'">
          <el-input v-model="formData.amount" placeholder="Enter amount" type="number" step="0.01" />
        </el-form-item>
      </div>

      <div class="lg:flex gap-3">
        <el-form-item prop="payment_method" class="flex-1" :label="'Payment Method'">
          <el-select v-model="formData.payment_method" placeholder="Payment Method" class="flex-1" :loading="loading">
            <el-option v-for="payment_method in store.payment_methods" :key="payment_method.id"
              :label="payment_method.name" :value="payment_method.name" />
          </el-select>
        </el-form-item>
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
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useWaterCollectionsStore } from "@/store/water-collections.store";
import { MoneyCollectionForm } from "@/type/water-delivery.type";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterCollectionsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<MoneyCollectionForm>(props.form as MoneyCollectionForm || {});
const loading = ref(true);
const isSubmitting = ref(false);

const rules = reactive<FormRules<MoneyCollectionForm>>({
  water_meter_id: [
    { required: true, message: "Please select a water meter", trigger: "change" },
  ],
  collection_date: [
    { required: true, message: "Please select collection date", trigger: "change" },
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

  isSubmitting.value = true;

  try {
    // Convert form data to match API expectations
    const apiData = {
      ...formData,
      water_client_id: null,
      phone_number: null,
      status: 'completed', // Default status since we removed the field
      notes: null
    };

    console.log('Submitting API data:', apiData);

    if (props.action === "create") {
      const res = await store.createWaterDelivery(apiData as any);
      console.log('Create response:', res);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        emits("submit-form", res.data);
        ElNotification({
          title: "Success",
          type: "success",
          message: "Money collection was created",
        })
      } else {
        ElNotification({
          title: "Error",
          type: "error",
          message: "Failed to create money collection",
        })
      }
    } else {
      const res = await store.updateWaterDelivery(apiData as any);
      console.log('Update response:', res);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        emits("submit-form", res.data);
        ElNotification({
          title: "Success",
          type: "success",
          message: "Money collection was updated",
        })
      } else {
        ElNotification({
          title: "Error",
          type: "error",
          message: "Failed to update money collection",
        })
      }
    }
  } catch (error) {
    console.error('Form submission error:', error);
    ElNotification({
      title: "Error",
      type: "error",
      message: "An error occurred while submitting the form",
    })
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(async() => {
  loading.value = true;
  await store.getDeliveryItems();
  loading.value = false;
});
</script>
<style lang=""></style>
