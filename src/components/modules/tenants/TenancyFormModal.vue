<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <el-form-item prop="property_id" class="flex-1" :label="'Property'">
        <el-select v-model="formData.property_id" placeholder="Select a property" :loading="loading">
          <el-option v-for="item in store.properties" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="unit_id" class="flex-1" :label="'Unit'">
        <el-select @change="getRentAmount" v-model="formData.unit_id" placeholder="Select a unit">
          <el-option v-for="item in unit_items" :key="item.id" :label="item.unit_code" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="rent_amount" class="flex-1" :label="'Monthly Rent'">
        <el-input v-model="formData.rent_amount" type="number" placeholder="Enter monthly rent" />
      </el-form-item>

    

      <div class="lg:flex gap-3">
        <div class="flex-1 lg:flex gap-3 py-2">
          <el-form-item prop="start_date" class="flex-1" :label="'Start Date'">
            <el-date-picker class="!w-full" v-model="formData.start_date" format="MMM DD YYYY" value-format="YYYY-MM-DD"
              placeholder="Select a date" />
          </el-form-item>
        </div>
        <div class="flex-1 lg:flex gap-3 py-2">
          <el-form-item prop="end_date" class="flex-1" :label="'End Date'">
            <el-date-picker class="!w-full" v-model="formData.end_date" format="MMM DD YYYY" :disabled-date="disabledDate" value-format="YYYY-MM-DD"
              placeholder="Select a date" />
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
import { computed, onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useTenantsStore } from "@/store/tenants.store";
import { TenancyForm } from "@/type/tenant.type";

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useTenantsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<TenancyForm>(props.form as TenancyForm);
const loading = ref(true);

const disabledDate = (time: Date) => {
  return time.getTime() < Date.now()
}

const rules = reactive<FormRules<TenancyForm>>({
  unit_id: [
    { required: true, message: "Please select unit", trigger: "change" },
  ],
  rent_amount: [
    { required: true, message: "Please enter rent", trigger: "blur" },
    { min: 0, message: "Rent must be greater than 0", trigger: "blur" },
  ],
});

const unit_items = computed(() => {
  if(formData.property_id){
    return store.properties.find((item: any) => item.id == formData.property_id)?.units.filter((item: any) => item.available)
  }else{
    return []
  }
})

const getRentAmount = (_e: any) => {
  if(formData.unit_id){
    formData.rent_amount = unit_items.value.find((item: any) => item.id == formData.unit_id)?.rent
  }else{
    formData.rent_amount = 0
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });


  const res = await store.createTenancy(formData);
  if (res.status == 200 || res.status == 201) {
    resetForm(itemFormRef.value as FormInstance);
    ElNotification({
      title: "Success",
      message: "Tenancy was created",
      type: "success",
    })
    emits("close-modal");
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(async () => {
  loading.value = true;
  await store.getProperties();
  loading.value = false;
});
</script>
<style lang=""></style>
