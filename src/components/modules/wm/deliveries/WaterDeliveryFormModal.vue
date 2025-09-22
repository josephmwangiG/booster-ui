<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="client_name" class="flex-1" :label="'Client Name'">
          <el-input v-model="formData.client_name" placeholder="Enter client name" />
        </el-form-item>
      </div>
      <div class="lg:flex gap-3">
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
        <el-form-item prop="capacity" class="flex-1" :label="'Delivery Capacity (Liters)'">
          <el-input v-model="formData.capacity" type="number" placeholder="Enter capacity in liters" />
        </el-form-item>
        <el-form-item prop="amount" class="flex-1" :label="'Total Cost'">
          <el-input v-model="formData.amount" type="number" placeholder="Enter amount" />
        </el-form-item>
      </div>

      

      <div class="lg:flex gap-3">
        <el-form-item prop="vehicle_id" class="flex-1" :label="'Select Vehicle'">
          <el-select v-model="formData.vehicle_id" placeholder="Vehicle" class="flex-1" :loading="loading">
            <el-option v-for="vehicle in store.vehicles" :key="vehicle.id" 
              :label="`${vehicle.plate_number} - ${vehicle.brand || 'N/A'} ${vehicle.model || 'N/A'}`"
              :value="vehicle.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="driver_id" class="flex-1" :label="'Select Driver'">          
            <el-select v-model="formData.driver_id" placeholder="Driver" class="flex-1" :loading="loading">
              <el-option v-for="driver in store.drivers" :key="driver.id"
                :label="driver.user_name" :value="driver.id" />
            </el-select>
        </el-form-item>

      </div>
      <div class="lg:flex gap-3">
        <el-form-item prop="departure_time" label="Departure Time">
          <el-date-picker format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" type="datetime"
            v-model="formData.departure_time" aria-label="Pick a time" placeholder="Pick a time" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="return_time" label="Return Time">
          <el-date-picker format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" v-model="formData.return_time"
            aria-label="Pick a time" placeholder="Pick a time" style="width: 100%" />
        </el-form-item>

      </div>

      <!-- Notes field moved to bottom -->
      <div class="lg:flex gap-3">
        <el-form-item prop="notes" class="flex-1" :label="'Notes (Optional)'">
          <el-input v-model="formData.notes" placeholder="Enter any additional notes" />
        </el-form-item>
      </div>

      <el-checkbox v-model="formData.record_payment" label="Record Payment" size="large" v-if="action === 'create'"/>

      <div class="collections" v-if="formData.record_payment">
        <el-form-item prop="payment_method" label="Payment Method">
                      <el-select v-model="formData.payment_method" placeholder="Payment Method" class="flex-1" :loading="loading">
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

        <button @click="submitForm(itemFormRef)" type="button" :disabled="isSubmitting" class="btn-primary">
          {{ isSubmitting ? "Please wait..." : (action === "create" ? "Save" : "Update") }}
        </button>
      </div>
    </el-form>
  </div>

  <!-- Driver Modal -->
  <teleport to="body">
    <el-dialog v-model="driverModalVisible" :show-close="false" style="min-width: 300px" width="40%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            Add Driver
          </h3>
          <button @click="driverModalVisible = false" class="text-gray-400 hover:text-gray-600">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
      </template>
      <DriverFormModal @close-modal="closeDriverModal" :form="{}" action="create" />
    </el-dialog>
  </teleport>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, defineAsyncComponent } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { WaterDeliveryForm } from "@/type/water-delivery.type";
import { useWaterDeliveriesStore } from "@/store/water-deliveries.store";
import { useAuthStore } from "@/store/auth.store";

const DriverFormModal = defineAsyncComponent(
  () => import("@/components/settings/drivers/DriverFormModal.vue")
);

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterDeliveriesStore();
const authStore = useAuthStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<WaterDeliveryForm>({
  ...props.form as WaterDeliveryForm,
  organization_id: authStore.user?.organization_id || 1, // Set organization_id from user data
});
const driverModalVisible = ref(false);
const loading = ref(true);
const isSubmitting = ref(false);


const rules = reactive<FormRules<WaterDeliveryForm>>({
  client_name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  address: [
    { required: true, message: "Please enter address", trigger: "blur" },
  ],
  capacity: [
    { required: true, message: "Please enter capacity", trigger: "blur" },
  ],
  amount: [
    { required: true, message: "Please enter amount", trigger: "blur" },
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
  departure_time: [
    { required: true, message: "Please select departure time", trigger: "change" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  isSubmitting.value = true;

  try {
    // Ensure numeric fields are properly converted
    const submitData = {
      ...formData,
      capacity: Number(formData.capacity) || 0,
      amount: Number(formData.amount) || 0,
      amount_paid: formData.amount_paid ? Number(formData.amount_paid) : null,
    };

    if (props.action === "create") {
      const res = await store.createWaterDelivery(submitData);
      if (res.status == 200 || res.status == 201) {
        // If payment recording is enabled, create the payment
        if (formData.record_payment && formData.amount_paid) {
          const paymentData = {
            water_delivery_id: res.data.id,
            amount: formData.amount_paid,
            payment_date: formData.payment_date,
            payment_method: formData.payment_method,
            payment_reference: formData.payment_reference,
            notes: formData.notes
          };
          
          const paymentRes = await store.createWaterDeliveryItemPayment(paymentData);
          if (paymentRes.status == 200 || paymentRes.status == 201) {
            // Mark the delivery as completed since payment was recorded
            await store.markWaterDeliveryComplete(res.data.id);
          }
        }
        
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        ElNotification({
          title: "Success",
          type: "success",
          message: "Water delivery was created successfully",
        })
      }
    } else {
      const res = await store.updateWaterDelivery(submitData);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        ElNotification({
          title: "Success",
          type: "success",
          message: "Water delivery was updated successfully",
        })
      }
    }
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // Reset payment fields
  formData.record_payment = false;
  formData.amount_paid = undefined;
  formData.payment_date = undefined;
  formData.payment_method = undefined;
  formData.payment_reference = undefined;
  // Reset other fields
  formData.notes = undefined;
};

const closeDriverModal = async () => {
  driverModalVisible.value = false;
  // Refresh the drivers list after adding a new driver
  await store.getDeliveryItems();
};


onMounted(async() => {
  loading.value = true;
  await store.getDeliveryItems();
  
  // Ensure organization_id is set
  if (!formData.organization_id) {
    formData.organization_id = authStore.user?.organization_id || 1;
  }
  
  loading.value = false;
});
</script>
<style lang=""></style>
