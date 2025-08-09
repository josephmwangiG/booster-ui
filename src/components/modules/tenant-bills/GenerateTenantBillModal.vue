<template>
  <div class="mt-2">
    <div class="mt-5 sm:mt-6 text-center">
      <p class="text-gray-500 text-center pb-12">
        Are you sure you want to generate tenant bills for {{ formData.month }} {{ formData.year }}. This action can't
        be reversed.
      </p>
      <button @click="emits('close-modal')" type="button" class="btn-primary-outline">
        Close
      </button>

      <button @click="submitForm()" type="button" class="btn-primary">
        Generate Bills
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { ElNotification } from "element-plus";
import { useTenantBillsStore } from "@/store/tenant-bills.store";

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useTenantBillsStore();
const formData = reactive<any>(props.form);

const submitForm = async () => {
  const res = await store.generateTenantBills(formData);
  if (res.status == 200 || res.status == 201) {
    emits("close-modal");
    ElNotification({
      title: "Success",
      type: "success",
      message: "Bills generated successfully",
    })
  }
};



onMounted(() => {

});
</script>
<style lang=""></style>
