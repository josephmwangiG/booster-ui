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
                  {{ action === 'create' ? 'Create New Product' : 'Edit Product' }}
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
                      <el-form-item label="Product Name" prop="name" class="flex-1">
                        <el-input
                          v-model="formData.name"
                          placeholder="Enter product name"
                        />
                      </el-form-item>
                      <el-form-item label="SKU" prop="SKU" class="flex-1">
                        <el-input
                          v-model="formData.SKU"
                          placeholder="Enter SKU"
                        />
                      </el-form-item>
                    </div>

                    <div class="lg:flex gap-3">
                      <el-form-item label="Short Description" prop="short_description" class="flex-1">
                        <el-input
                          v-model="formData.short_description"
                          placeholder="Enter short description"
                        />
                      </el-form-item>
                      <el-form-item label="Price" prop="price" class="flex-1">
                        <el-input
                          v-model="formData.price"
                          type="number"
                          placeholder="Enter price"
                        />
                      </el-form-item>
                    </div>

                    <div class="lg:flex gap-3">
                      <el-form-item label="Tags" prop="tags" class="flex-1">
                        <el-input
                          v-model="formData.tags"
                          placeholder="Enter tags (comma separated)"
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
                      <el-form-item label="Category IDs" prop="category_ids" class="flex-1">
                        <el-select
                          v-model="formData.category_ids"
                          multiple
                          placeholder="Select categories"
                        >
                          <el-option
                            v-for="category in categories"
                            :key="category.id"
                            :label="category.name"
                            :value="category.id"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="Brand IDs" prop="brand_ids" class="flex-1">
                        <el-select
                          v-model="formData.brand_ids"
                          multiple
                          placeholder="Select brands"
                        >
                          <el-option
                            v-for="brand in brands"
                            :key="brand.id"
                            :label="brand.name"
                            :value="brand.id"
                          />
                        </el-select>
                      </el-form-item>
                    </div>

                    <div class="lg:flex gap-3">
                      <el-form-item label="Returnable" prop="returnable" class="flex-1">
                        <el-select v-model="formData.returnable" placeholder="Select returnable status">
                          <el-option label="Yes" :value="true" />
                          <el-option label="No" :value="false" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="Refundable" prop="refundable" class="flex-1">
                        <el-select v-model="formData.refundable" placeholder="Select refundable status">
                          <el-option label="Yes" :value="true" />
                          <el-option label="No" :value="false" />
                        </el-select>
                      </el-form-item>
                    </div>

                    <el-form-item label="Thumbnail" prop="thumbnail">
                      <el-input
                        v-model="formData.thumbnail"
                        placeholder="Enter thumbnail URL"
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
                        {{ action === 'create' ? 'Create Product' : 'Update Product' }}
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
import { reactive, ref, onMounted, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ProductForm } from "@/type/product.type";
import { useAdmProductsStore } from "@/store/admin/products.store";

const props = defineProps({
  modalActive: Boolean,
  form: {
    type: Object as () => ProductForm | Record<string, any>,
    default: () => ({})
  },
  action: {
    type: String,
    default: 'create'
  }
});

const emits = defineEmits(["close-modal", "submit-form"]);
const store = useAdmProductsStore();
const itemFormRef = ref<FormInstance>();

const formData = reactive<ProductForm>({
  id: null,
  name: '',
  description: '',
  short_description: '',
  thumbnail: '',
  SKU: '',
  price: 0,
  returnable: false,
  refundable: false,
  tags: '',
  category_ids: [],
  brand_ids: [],
});

// Watch for form prop changes and update formData
watch(() => props.form, (newForm) => {
  if (newForm && typeof newForm === 'object') {
    Object.assign(formData, newForm);
  }
}, { immediate: true });

const categories = ref<Array<{id: string, name: string}>>([]);
const brands = ref<Array<{id: string, name: string}>>([]);

const rules = reactive<FormRules<ProductForm>>({
  name: [
    { required: true, message: "Please enter product name", trigger: "blur" },
  ],
  SKU: [
    { required: true, message: "Please enter SKU", trigger: "blur" },
  ],
  price: [
    { required: true, message: "Please enter price", trigger: "blur" },
    { type: "number", message: "Price must be a number", trigger: "blur" },
  ],
  short_description: [
    { required: true, message: "Please enter short description", trigger: "blur" },
  ],
  description: [
    { required: true, message: "Please enter description", trigger: "blur" },
  ],
  category_ids: [
    { required: true, message: "Please select at least one category", trigger: "change" },
  ],
  brand_ids: [
    { required: true, message: "Please select at least one brand", trigger: "change" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (!valid) return;
  });

  try {
    if (props.action === 'create') {
      const res = await store.createProduct(formData);
      if (res.status == 200 || res.status == 201) {
        resetForm(itemFormRef.value as FormInstance);
        emits("close-modal");
        emits("submit-form");
      }
    } else {
      const res = await store.updateProduct(formData);
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

onMounted(async () => {
  // TODO: Fetch categories and brands from API
  // For now, using empty arrays
  categories.value = [];
  brands.value = [];
});
</script>

<style scoped>
.btn-primary {
  @apply inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600;
}
</style>
