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

const rules = reactive<FormRules<TenantForm>>({
  tenant_name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],

});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });


  if (props.action === "create") {
    const res = await store.createTenant(formData);
    if (res.status == 200 || res.status == 201) {
      resetForm(itemFormRef.value as FormInstance);
      router.push({ name: "tenancies", params: { id: res.data.id } });
      ElNotification({
        title: "Success",
        type: "success",
        message: "Tenant was created",
      })
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

onMounted(() => {

});
</script>
<style lang=""></style>
