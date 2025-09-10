<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="water_client_id" class="flex-1" :label="'Select Client'">
          <el-select v-model="formData.water_client_id" placeholder="Select Client" class="flex-1" :loading="loading" filterable>
            <el-option v-for="client in store.properties" :key="client.id" 
              :label="`${client.client_name} - ${client.phone}`"
              :value="client.id" />
          </el-select>
        </el-form-item>
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
        <el-form-item prop="phone_number" class="flex-1" :label="'Phone Number'">
          <el-input v-model="formData.phone_number" placeholder="Enter phone number" />
        </el-form-item>
      </div>

      <div class="lg:flex gap-3">
        <el-form-item prop="driver_id" class="flex-1" :label="'Select Driver (Optional)'">
          <el-select v-model="formData.driver_id" placeholder="Driver" class="flex-1" :loading="loading">
            <el-option v-for="driver in store.drivers" :key="driver.id"
              :label="driver.user_name" :value="driver.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="vehicle_id" class="flex-1" :label="'Select Vehicle (Optional)'">
          <el-select v-model="formData.vehicle_id" placeholder="Vehicle" class="flex-1" :loading="loading">
            <el-option v-for="vehicle in store.vehicles" :key="vehicle.id" 
              :label="`${vehicle.plate_number} - ${vehicle.brand || 'N/A'} ${vehicle.model || 'N/A'}`"
              :value="vehicle.id" />
          </el-select>
        </el-form-item>
      </div>

      <div class="lg:flex gap-3">
        <el-form-item prop="status" class="flex-1" :label="'Status'">
          <el-select v-model="formData.status" placeholder="Status" class="flex-1">
            <el-option label="Pending" value="pending" />
            <el-option label="Completed" value="completed" />
            <el-option label="Cancelled" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item prop="notes" class="flex-1" :label="'Notes (Optional)'">
          <el-input v-model="formData.notes" placeholder="Enter notes" type="textarea" />
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
import { useWaterCollectionsStore } from "@/store/water-collections.store";

interface MoneyCollectionForm {
  id?: string;
  water_client_id?: string;
  water_meter_id?: string;
  collection_date?: string;
  amount?: number;
  payment_method?: string;
  phone_number?: string;
  driver_id?: string;
  vehicle_id?: string;
  status?: string;
  notes?: string;
}

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterCollectionsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<MoneyCollectionForm>(props.form as MoneyCollectionForm || {});
const loading = ref(true);

const rules = reactive<FormRules<MoneyCollectionForm>>({
  water_client_id: [
    { required: true, message: "Please select a client", trigger: "change" },
  ],
  water_meter_id: [
    { required: true, message: "Please select a water meter", trigger: "change" },
  ],
  collection_date: [
    { required: true, message: "Please select collection date", trigger: "change" },
  ],
  amount: [
    { required: true, message: "Please enter amount", trigger: "blur" },
  ],
  status: [
    { required: true, message: "Please select status", trigger: "change" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  if (props.action === "create") {
    const res = await store.createWaterDelivery(formData);
    if (res.status == 200 || res.status == 201) {
      resetForm(itemFormRef.value as FormInstance);
      emits("close-modal");
      ElNotification({
        title: "Success",
        type: "success",
        message: "Money collection was created",
      })
    }
  } else {
    const res = await store.updateWaterDelivery(formData);
    if (res.status == 200 || res.status == 201) {
      resetForm(itemFormRef.value as FormInstance);
      emits("close-modal");
      ElNotification({
        title: "Success",
        type: "success",
        message: "Money collection was updated",
      })
    }
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
