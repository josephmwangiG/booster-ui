<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Organization Settings</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Organization Settings
        </span>
      </div>
    </div>
    <div class="mt-5 bg-white p-6 xs:p-3">
      <div class="flex justify-between items-center">
        <h4 class="font-semibold">Organization Details</h4>
      </div>
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

            <el-form ref="itemFormRef" :model="formData" :rules="rules" label-width="auto" status-icon
              label-position="top" class="col-span-2">

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

              <div class="subscriptions">
                <h3 class="font-semibold text-sm text-gray-400 my-3">Organization Subscriptions</h3>
                <div v-for="module in moduleSubscriptions" :key="module.id">
                  <h3 class="font-semibold text-sm mb-2">{{ module.name }}</h3>
                  <el-checkbox v-model="module.is_subscribed" label="Is Subscribed" size="large" />
                  <el-checkbox v-model="module.is_active" label="Is Active" size="large" />
                </div>

              </div>
              <div class="mt-5 sm:mt-6 text-right">
                <button @click="submitForm()" type="button" class="btn-primary">
                  Update
                </button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useAdmUsersStore } from "@/store/admin/users.store";
import { useRouter } from "vue-router";

const emits = defineEmits(["exit-edit", "submit-form"]);
const store = useAdmUsersStore();
const router = useRouter();
const itemFormRef = ref<FormInstance>();
const formData = ref<any>({});
const moduleSubscriptions = ref<any>([]);

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

const submitForm = async () => {
  const res = await store.updateOrganization({
    id: router.currentRoute.value.params.id as string,
    modules: moduleSubscriptions.value,
  });
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

onMounted(async () => {
  await store.getOrganization(router.currentRoute.value.params.id as string);
  formData.value = {
    name: store.organization?.name,
    email: store.organization?.email,
    phone: store.organization?.phone,
    address: store.organization?.address,
    industry: store.organization?.industry,
    city: store.organization?.city,
  }

  let org_subs = store.organization?.subscriptions?.map((m: any) => m.module_id)

  console.log(org_subs);

  moduleSubscriptions.value = store.modules.map((module: any) => {
    let item = store.organization?.subscriptions?.find((m: any) => m.module_id == module.id)
    return {
      is_subscribed: org_subs?.includes(module.id) ? true : false,
      is_active: item && item.is_active,
      name: module.name,
      module_id: module.id
    }
  })

  console.log(moduleSubscriptions.value);

});
</script>

<style></style>
