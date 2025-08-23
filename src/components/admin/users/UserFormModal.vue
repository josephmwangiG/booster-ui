<template>
  <Teleport to="body">
    <div
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      v-if="modalActive"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-[700px] w-full sm:p-6"
          >
            <div>
              <div class="modal-header flex justify-between items-center">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  {{ action === 'create' ? 'Create New User' : 'Edit User' }}
                </h3>
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100"
                  @click="emits('close-modal')"
                >
                  <i
                    class="ri-close-fill text-3xl text-green-600 text-bold"
                  ></i>
                </div>
              </div>
              <div class="mt-3 sm:mt-5 max-h-[80vh] overflow-y-auto">
                <div class="mt-2">
                  <el-form
                    ref="itemFormRef"
                    :model="formData"
                    :rules="rules"
                    label-width="auto"
                    status-icon
                    label-position="top"
                  >
                    <div class="lg:flex gap-3">
                      <el-form-item label="User Name" prop="user_name" class="flex-1">
                        <el-input
                          v-model="formData.user_name"
                          placeholder="Enter user name"
                        />
                      </el-form-item>
                      <el-form-item label="Email" prop="email" class="flex-1">
                        <el-input
                          v-model="formData.email"
                          type="email"
                          placeholder="Enter email address"
                        />
                      </el-form-item>
                    </div>

                    <div class="lg:flex gap-3">
                      <el-form-item label="Phone Number" prop="phone_number" class="flex-1">
                        <el-input
                          v-model="formData.phone_number"
                          placeholder="Enter phone number"
                        />
                      </el-form-item>
                      <el-form-item label="Password" prop="password" class="flex-1" v-if="action === 'create'">
                        <el-input
                          v-model="formData.password"
                          type="password"
                          placeholder="Enter password"
                        />
                      </el-form-item>
                    </div>

                    <div class="lg:flex gap-3">
                      <el-form-item label="User Type" prop="user_type" class="flex-1">
                        <el-select v-model="formData.user_type" placeholder="Select user type">
                          <el-option label="User" value="user" />
                          <el-option label="Vendor" value="vendor" />
                          <el-option label="Admin" value="admin" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="Can Login" prop="can_login" class="flex-1">
                        <el-select v-model="formData.can_login" placeholder="Select login status">
                          <el-option label="Yes" :value="true" />
                          <el-option label="No" :value="false" />
                        </el-select>
                      </el-form-item>
                    </div>

                    <div class="mt-5 sm:mt-6 text-right">
                      <button
                        @click="emits('close-modal')"
                        type="button"
                        class="inline-flex justify-center rounded-md border border-indigo-600 px-3 py-2 text-sm font-semibold shadow-sm mr-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Close
                      </button>

                      <button
                        @click="submitForm(itemFormRef)"
                        type="button"
                        class="btn-primary"
                      >
                        {{ action === 'create' ? 'Create User' : 'Update User' }}
                      </button>
                    </div>
                  </el-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useAdmUsersStore } from "@/store/admin/users.store";
import { watch } from 'vue';

const props = defineProps({
  modalActive: Boolean,
  form: Object,
  action: {
    type: String,
    default: 'create'
  }
});

const emits = defineEmits(["close-modal", "submit-form"]);
const store = useAdmUsersStore();
const itemFormRef = ref<FormInstance>();

const formData = reactive({
  id: null as string | null,
  user_name: '',
  email: '',
  phone_number: '',
  password: '',
  user_type: 'user',
  can_login: true,
});

// Watch for form prop changes and update formData
watch(() => props.form, (newForm) => {
  if (newForm && typeof newForm === 'object') {
    Object.assign(formData, newForm);
  }
}, { immediate: true });

const rules = reactive<FormRules>({
  user_name: [
    { required: true, message: "Please enter user name", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Please enter email", trigger: "blur" },
    { type: "email", message: "Please enter valid email", trigger: "blur" }
  ],
  phone_number: [
    { required: true, message: "Please enter phone number", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Please enter password", trigger: "blur" },
  ],
  user_type: [
    { required: true, message: "Please select user type", trigger: "change" },
  ],
  can_login: [
    { required: true, message: "Please select login status", trigger: "change" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  try {
    if (props.action === 'create') {
      const res = await store.createUser(formData);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        emits("submit-form");
      }
    } else {
      const res = await store.updateUser(formData);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        emits("submit-form");
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped>
.btn-primary {
  @apply inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600;
}
</style>
