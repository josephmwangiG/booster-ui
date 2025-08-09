<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="client_name" class="flex-1" :label="'Client Name'">
          <el-input v-model="formData.client_name" placeholder="Enter client name" />
        </el-form-item>
        <el-form-item prop="address" class="flex-1" :label="'Address (Delivery Location)'">
          <el-input v-model="formData.address" placeholder="Enter address" />
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
      <div class="lg:flex gap-3">
        <el-form-item prop="capacity" class="flex-1" :label="'Delivery Capacity'">
          <el-input v-model="formData.capacity" placeholder="Enter capacity" />
        </el-form-item>
        <el-form-item prop="amount" class="flex-1" :label="'Total Cost'">
          <el-input v-model="formData.amount" placeholder="Enter amount" />
        </el-form-item>
      </div>
      <div class="lg:flex gap-3">
        <el-form-item prop="vehicle_id" class="flex-1" :label="'Select Vehicle'">
          <el-select v-model="formData.vehicle_id" placeholder="Vehicle" class="flex-1">
            <el-option v-for="vehicle in store.vehicles" :key="vehicle.id" :label="vehicle.number_plate"
              :value="vehicle.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="driver_if" class="flex-1" :label="'Select Driver'">
          <el-select v-model="formData.driver_id" placeholder="Driver" class="flex-1">
            <el-option v-for="driver in store.drivers" :key="driver.id"
              :label="driver.name" :value="driver.id" />
          </el-select>
        </el-form-item>

      </div>
      <div class="lg:flex gap-3">
        <el-form-item prop="departure_time" label="Departure Time">
          <el-date-picker format="MMM DD YYYY hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" type="datetime"
            v-model="formData.departure_time" aria-label="Pick a time" placeholder="Pick a time" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="return_time" label="Return Time">
          <el-date-picker format="MMM DD YYYY hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" v-model="formData.return_time"
            aria-label="Pick a time" placeholder="Pick a time" style="width: 100%" />
        </el-form-item>

      </div>

      <el-checkbox v-model="formData.record_payment" label="Record Payment" size="large" v-if="action === 'create'"/>

      <div class="collections" v-if="formData.record_payment">
        <el-form-item prop="payment_method" label="Payment Method">
          <el-select v-model="formData.payment_method" placeholder="Payment Method" class="flex-1">
            <el-option v-for="payment_method in store.payment_methods" :key="payment_method.id"
              :label="payment_method.name" :value="payment_method.name" />
          </el-select>
        </el-form-item>
        <el-form-item prop="amount_paid" label="Amount Paid">
          <el-input v-model="formData.amount_paid" placeholder="Amount Paid" type="number" class="flex-1">
          </el-input>
        </el-form-item>
        <div class="lg:flex gap-3">
          <el-form-item prop="payment_reference" label="Payment Reference">
            <el-input v-model="formData.payment_reference" placeholder="Enter payment reference" class="flex-1">
            </el-input>
          </el-form-item>
          <el-form-item prop="payment_date" label="Payment date">
            <el-date-picker format="MMM DD YYYY" value-format="YYYY-MM-DD" v-model="formData.payment_date"
              aria-label="Pick a time" placeholder="Payment date" style="width: 100%" />
          </el-form-item>
        </div>
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
import { WaterDeliveryForm } from "@/type/water-delivery.type";
import { useWaterDeliveriesStore } from "@/store/water-deliveries.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterDeliveriesStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<WaterDeliveryForm>(props.form as WaterDeliveryForm);

const rules = reactive<FormRules<WaterDeliveryForm>>({
  client_name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  capacity: [
    { required: true, message: "Please enter capacity", trigger: "blur" },
  ],
  phone_number: [
    { required: true, message: "Please enter phone", trigger: "blur" },
  ],
  driver_id: [
    { required: true, message: "Please select option", trigger: "change" },
  ],
  vehicle_id: [
    { required: true, message: "Please select option", trigger: "change" },
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
        message: "Client was created",
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
        message: "Client was updated",
      })
    }
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(async() => {
  await store.getDeliveryItems()
});
</script>
<style lang=""></style>
