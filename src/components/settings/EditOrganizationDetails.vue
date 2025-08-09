<template>
  <div class="overflow-auto">
    <div class="pace-y-6 my-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="col-span-1">
          <h3 class="font-semibold text-sm text-gray-400">Set contact details and </h3>
          <ul>
            <li class="text-sm my-3 list-disc">
              Contact information will be used by your clients for support.
            </li>
          </ul>
        </div>

        <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top"
          class="col-span-2">

          <div class="lg:flex gap-3">
            <el-form-item prop="name" class="flex-1" :label="'Organization Name'">
              <el-input v-model="formData.name" placeholder="Enter name" />
            </el-form-item>

            <div class="lg:flex gap-3 flex-1">
              <el-form-item prop="industry" class="flex-1" :label="'Industry of Operation'">
                <el-input v-model="formData.industry" placeholder="Enter industry" />
              </el-form-item>
            </div>
          </div>

          <div class="lg:flex gap-3">
            <el-form-item prop="email" class="flex-1" :label="'Contact Email'">
              <el-input v-model="formData.email" placeholder="Enter contact email" />
            </el-form-item>
            <el-form-item prop="phone" class="flex-1" :label="'Contact Phone Number'">
              <el-input v-model="formData.phone" placeholder="Enter contact phone number" />
            </el-form-item>

          </div>

          <el-form-item prop="address" class="flex-1" :label="'Address'">
            <el-input v-model="formData.address" placeholder="Enter address" />
          </el-form-item>

          <el-form-item prop="city" class="flex-1" :label="'City'">
            <el-input v-model="formData.city" placeholder="Enter city" />
          </el-form-item>
          <div class="mt-5 sm:mt-6 text-right">
            <button @click="submitForm(itemFormRef)" type="button" class="btn-primary">
              Update
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useAuthStore } from "@/store/auth.store";

const emits = defineEmits(["exit-edit", "submit-form"]);
const store = useAuthStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<any>({
  name: store.user?.organization?.name,
  email: store.user?.organization?.email,
  phone: store.user?.organization?.phone,
  address: store.user?.organization?.address,
  industry: store.user?.organization?.industry,
  city: store.user?.organization?.city,
});

const rules = reactive<FormRules<any>>({
  name: [
    { required: true, message: "Please enter name", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Please enter email", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "Please enter phone number", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });


  const res = await store.updateOrganization(formData);
  if (res.status == 200 || res.status == 201) {
    resetForm(itemFormRef.value as FormInstance);
    emits("exit-edit");
    ElNotification({
      title: "Success",
      type: "success",
      message: "Organization details updated!",
    })
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {

});
</script>
<style lang=""></style>
