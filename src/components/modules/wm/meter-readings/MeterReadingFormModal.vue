<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <el-form-item prop="water_meter_id" class="flex-1" :label="'Meter'">
        <el-select v-model="formData.water_meter_id" placeholder="Select meter">
          <el-option v-for="meter in store.meters" :key="meter.id" :label="`${meter.name || 'N/A'} - ${meter.code_number}`" :value="meter.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="previous_meter_reading" class="flex-1" :label="'Previous Reading'">
        <el-input type="number" v-model="formData.previous_meter_reading" placeholder="Enter previous meter reading">
        </el-input>
      </el-form-item>
      <el-form-item prop="current_meter_reading" class="flex-1" :label="'Current Reading'">
        <el-input type="number" v-model="formData.current_meter_reading" placeholder="Enter current meter reading">
        </el-input>
      </el-form-item>
      <el-form-item prop="consumption" class="flex-1" :label="'Consumption'">
        <el-input v-model="consumption" placeholder="Consumption" :disabled="true" type="number">
        </el-input>
      </el-form-item>
      <el-checkbox v-model="record_collections" label="Record Collections" size="large" />

      <div class="collections" v-if="record_collections">
        <div class="flex justify-between my-3">
          <span class="font-semibold">Add collection by payment method</span>
          <button type="button" class="btn-primary-outline mr-0" @click.prevent="addCollection">
            Add
          </button>
        </div>

        <div class="flex gap-3 my-3" v-for="(collection, index) in collections" :key="index">
          <el-date-picker 
            v-model="collection.collection_date" 
            type="date" 
            placeholder="Collection Date" 
            format="MMM DD YYYY" 
            value-format="YYYY-MM-DD"
            class="flex-1" 
          />
          <el-select v-model="collection.payment_method" placeholder="Payment Method" class="flex-1">
            <el-option v-for="payment_method in store.payment_methods" :key="payment_method.id"
              :label="payment_method.name" :value="payment_method.name" />
          </el-select>
          <el-input v-model="collection.amount" placeholder="Amount" type="number" class="flex-1" :min="0" step="0.01">
          </el-input>
          <button type="button" @click="removeCollection(index)" class="btn-danger-outline" v-if="collections.length > 1">
            Remove
          </button>
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
import { computed, onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { MeterReadingForm } from "@/type/water-meter.type";
import { useWaterMetersStore } from "@/store/water-meters.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useWaterMetersStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<MeterReadingForm>(props.form as MeterReadingForm);

const record_collections = ref(false)
const collections = ref([
  {
    collection_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    payment_method: "",
    amount: 0
  }
])

const addCollection = () => {
  collections.value.push({
    collection_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    payment_method: "",
    amount: 0
  })
}

const removeCollection = (index: number) => {
  collections.value.splice(index, 1);
}

const consumption = computed(() => {
  if (!formData.current_meter_reading || !formData.previous_meter_reading) return 0
  return Number(formData.current_meter_reading) - Number(formData.previous_meter_reading)
})

const validateCurrentMeterReading = (_rule: any, _value: any, callback: any) => {
  const current = Number(formData.current_meter_reading);
  const previous = Number(formData.previous_meter_reading);
  
  if (isNaN(current) || isNaN(previous)) {
    callback();
    return;
  }
  
  if (current < previous) {
    callback(new Error('Current reading should be greater than previous reading'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<MeterReadingForm>>({
  water_meter_id: [
    { required: true, message: "select meter", trigger: "change" },
  ],
  previous_meter_reading: [
    { required: true, message: "Enter previous reading", trigger: "blur" },
  ],
  current_meter_reading: [
    { validator: validateCurrentMeterReading, message: "Current reading should be greater than previous reading", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, _fields) => {
    if (!valid) {
      return;
    } else {
      if (props.action === "create") {
        let data: any = {
          ...formData
        }

        if (record_collections.value) {
          // Ensure collection amounts are properly formatted as numbers
          const formattedCollections = collections.value.map(collection => ({
            ...collection,
            amount: Number(collection.amount) || 0
          }));
          
          data = {
            ...formData,
            collections: formattedCollections
          }
        }
        const res = await store.createMeterReading(data);
        if (res.status == 200 || res.status == 201) {
          resetForm(itemFormRef.value as FormInstance);
          emits("close-modal");
          emits("submit-form"); // Emit to parent to refresh data
          ElNotification({
            title: "Success",
            type: "success",
            message: "Meter reading was created successfully",
          })
        }
      } else {
        const res = await store.updateMeterReading(formData);
        if (res.status == 200 || res.status == 201) {
          resetForm(itemFormRef.value as FormInstance);
          emits("close-modal");
          emits("submit-form"); // Emit to parent to refresh data
          ElNotification({
            title: "Success",
            type: "success",
            message: "Meter reading was updated successfully",
          })
        }
      }
    }
  });



};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  
  // Reset collections to default state
  record_collections.value = false;
  collections.value = [{
    collection_date: new Date().toISOString().split('T')[0],
    payment_method: "",
    amount: 0
  }];
};

onMounted(async () => {
  await Promise.all([
    store.getMeters(),
    store.getPaymentMethods()
  ]);

  console.log(props.form);

  if (props.action == 'edit') {
    record_collections.value = props.form?.collections?.length > 0

    if (props.form?.collections?.length > 0) {
      collections.value = props.form?.collections
    }
  }
});
</script>
<style lang=""></style>