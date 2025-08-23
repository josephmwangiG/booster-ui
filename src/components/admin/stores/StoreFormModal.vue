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
                  {{ action === 'create' ? 'Create New Store' : 'Edit Store' }}
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
                      <el-form-item label="Store Name" prop="store_name" class="flex-1">
                        <el-input
                          v-model="formData.store_name"
                          placeholder="Enter store name"
                        />
                      </el-form-item>
                      <el-form-item label="Contact Number" prop="contact_number" class="flex-1">
                        <el-input
                          v-model="formData.contact_number"
                          placeholder="Enter contact number"
                        />
                      </el-form-item>
                    </div>

                    <div class="lg:flex gap-3">
                      <el-form-item label="Address Line 1" prop="address_line_1" class="flex-1">
                        <el-input
                          v-model="formData.address_line_1"
                          placeholder="Enter address line 1"
                        />
                      </el-form-item>
                      <el-form-item label="City" prop="city" class="flex-1">
                        <el-input
                          v-model="formData.city"
                          placeholder="Enter city"
                        />
                      </el-form-item>
                    </div>

                    <div class="lg:flex gap-3">
                      <el-form-item label="Postal Code" prop="postal_code" class="flex-1">
                        <el-input
                          v-model="formData.postal_code"
                          placeholder="Enter postal code"
                        />
                      </el-form-item>
                      <el-form-item label="Short Description" prop="short_description" class="flex-1">
                        <el-input
                          v-model="formData.short_description"
                          placeholder="Enter short description"
                        />
                      </el-form-item>
                    </div>

                    <el-form-item label="Description" prop="description">
                      <el-input
                        v-model="formData.description"
                        type="textarea"
                        :rows="3"
                        placeholder="Enter detailed description"
                      />
                    </el-form-item>

                    <div class="lg:flex gap-3">
                      <el-form-item label="Facebook" prop="facebook" class="flex-1">
                        <el-input
                          v-model="formData.facebook"
                          placeholder="Enter Facebook URL"
                        />
                      </el-form-item>
                      <el-form-item label="Instagram" prop="instagram" class="flex-1">
                        <el-input
                          v-model="formData.instagram"
                          placeholder="Enter Instagram URL"
                        />
                      </el-form-item>
                    </div>

                    <el-form-item label="Website" prop="website">
                      <el-input
                        v-model="formData.website"
                        placeholder="Enter website URL"
                      />
                    </el-form-item>

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
                        {{ action === 'create' ? 'Create Store' : 'Update Store' }}
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
import { StoreForm } from "@/type/store.type";
import { useAdmStoresStore } from "@/store/admin/stores.store";
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
const store = useAdmStoresStore();
const itemFormRef = ref<FormInstance>();

const formData = reactive<StoreForm>({
  id: null,
  store_name: '',
  contact_number: '',
  address_line_1: '',
  short_description: '',
  description: '',
  city: '',
  postal_code: '',
  facebook: '',
  website: '',
  instagram: '',
});

// Watch for form prop changes and update formData
watch(() => props.form, (newForm) => {
  if (newForm && typeof newForm === 'object') {
    Object.assign(formData, newForm);
  }
}, { immediate: true });

const rules = reactive<FormRules<StoreForm>>({
  store_name: [
    { required: true, message: "Please enter store name", trigger: "blur" },
  ],
  contact_number: [
    { required: true, message: "Please enter contact number", trigger: "blur" },
  ],
  address_line_1: [
    { required: true, message: "Please enter address", trigger: "blur" },
  ],
  city: [
    { required: true, message: "Please enter city", trigger: "blur" },
  ],
  short_description: [
    { required: true, message: "Please enter short description", trigger: "blur" },
  ],
  description: [
    { required: true, message: "Please enter description", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  try {
    if (props.action === 'create') {
      const res = await store.createStore(formData);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        emits("submit-form");
      }
    } else {
      const res = await store.updateStore(formData);
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
