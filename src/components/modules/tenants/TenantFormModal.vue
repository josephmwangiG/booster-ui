<template>
  <div class="mt-2">
    <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">

      <div class="lg:flex gap-3">
        <el-form-item prop="name" class="flex-1" :label="'Tenant Name'">
          <el-input v-model="formData.tenant_name" placeholder="Enter tenant name" />
        </el-form-item>
        <el-form-item prop="email" class="flex-1" :label="'Email'">
          <el-input v-model="formData.email" placeholder="Enter email" />
        </el-form-item>

      </div>

      <el-form-item prop="phone" class="flex-1" :label="'Phone Number'">
        <el-input v-model="formData.phone" placeholder="Enter phone number" />
      </el-form-item>

      <el-form-item prop="emergency_phone" class="flex-1" :label="'Emergency Number'">
        <el-input v-model="formData.emergency_phone" placeholder="Enter emergency phone number" />
      </el-form-item>

      <div class="lg:flex gap-3 py-2">
        <el-form-item prop="id_number" class="flex-1" :label="'National ID'">
          <el-input v-model="formData.id_number" placeholder="Enter national id" />
        </el-form-item>
      </div>

      <!-- Property and Unit Selection -->
      <el-form-item prop="property_id" class="flex-1" :label="'Property'">
        <el-select v-model="formData.property_id" placeholder="Select a property" :loading="loading" @change="onPropertyChange">
          <el-option v-for="item in store.properties" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="unit_id" class="flex-1" :label="'Unit'">
        <el-select v-model="formData.unit_id" placeholder="Select a unit" :disabled="!formData.property_id">
          <el-option v-for="item in availableUnits" :key="item.id" :label="item.unit_code" :value="item.id"></el-option>
        </el-select>
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
import { onMounted, reactive, ref, computed } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { TenantForm } from "@/type/tenant.type";
import { useTenantsStore } from "@/store/tenants.store";

const props = defineProps({
  form: Object,
  action: String,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const router = useRouter();
const store = useTenantsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<TenantForm>(props.form as TenantForm);
const loading = ref(true);

const rules = reactive<FormRules<TenantForm>>({
  tenant_name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  property_id: [
    { required: true, message: "Please select property", trigger: "change" },
  ],
  unit_id: [
    { required: true, message: "Please select unit", trigger: "change" },
  ],
});

// Computed property for available units based on selected property
const availableUnits = computed(() => {
  if (formData.property_id) {
    const property = store.properties.find((item: any) => item.id == formData.property_id);
    return property?.units?.filter((unit: any) => unit.available) || [];
  }
  return [];
});

// Handle property change - reset unit selection
const onPropertyChange = () => {
  formData.unit_id = '';
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  if (props.action === "create") {
    const res = await store.createTenantWithTenancy(formData);
    
    if (res.status == 200 || res.status == 201) {
      resetForm(itemFormRef.value as FormInstance);
      router.push({ name: "tenancies", params: { id: res.data.tenant.id } });
      
      if (res.data.isExistingTenant) {
        ElNotification({
          title: "Success",
          type: "success",
          message: "Existing tenant found and assigned to new unit",
        });
      } else {
        ElNotification({
          title: "Success",
          type: "success",
          message: "New tenant created and assigned to unit",
        });
      }
    } else if (res.status == 400 && res.data.error === 'DUPLICATE_ACTIVE_TENANT') {
      ElNotification({
        title: "Duplicate Tenant",
        type: "error",
        message: res.data.message,
        duration: 5000,
      });
    } else {
      ElNotification({
        title: "Error",
        type: "error",
        message: "Failed to create tenant. Please try again.",
      });
    }
  } else {
    const res = await store.updateTenant(formData);
    if (res.status == 200 || res.status == 201) {
      resetForm(itemFormRef.value as FormInstance);
      emits("close-modal");
      ElNotification({
        title: "Success",
        type: "success",
        message: "Tenant was updated",
      })
    }
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
