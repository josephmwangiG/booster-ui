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
                  Create a product brand
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
                    <el-form-item label="Brand name" prop="name">
                      <el-input
                        v-model="formData.brand"
                        placeholder="Brand name"
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
                        Save
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
import { BrandForm } from "@/type/brand.type";
import { useBrandsStore } from "@/store/brands-categories.store";

const props = defineProps({
  modalActive: Boolean,
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useBrandsStore();
const itemFormRef = ref<FormInstance>();
const formData = reactive<BrandForm>(props.form as BrandForm);

const rules = reactive<FormRules<BrandForm>>({
  brand: [
    { required: true, message: "Please enter brand name", trigger: "blur" },
    
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  const res = await store.createBrand(formData);
  if (res.status == 200 || res.status == 201) {
    resetForm(itemFormRef.value as FormInstance);
    emits("close-modal");
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style lang=""></style>
