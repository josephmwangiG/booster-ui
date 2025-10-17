<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Water Settings</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Settings > Water
        </span>
      </div>
    </div>
    <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6 max-w-xl">
      <h4 class="font-semibold mb-4">Default Rate</h4>
      <el-form :model="form" label-position="top" label-width="auto">
        <el-form-item label="Rate per cubic meter (KES)">
          <el-input v-model.number="form.rate" type="number" placeholder="Enter default rate" />
        </el-form-item>
        <div class="flex gap-2">
          <button class="btn-primary" type="button" @click="save">Save</button>
          <button class="btn-primary-outline" type="button" @click="reset">Reset</button>
        </div>
      </el-form>
    </div>
  </div>
  
</template>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { ElNotification } from "element-plus";
import { useWaterConfigStore } from "@/store/water-config.store";

const waterConfig = useWaterConfigStore();

const form = reactive({
  rate: Number(waterConfig.defaultRatePerCubicMeter) || 0,
});

const save = () => {
  waterConfig.setDefaultRate(Number(form.rate) || 0);
  ElNotification({ title: "Saved", message: "Default rate updated", type: "success" });
};

const reset = () => {
  form.rate = Number(waterConfig.defaultRatePerCubicMeter) || 0;
};

onMounted(async () => {
  try {
    await waterConfig.syncFromSettings();
  } finally {
    form.rate = Number(waterConfig.defaultRatePerCubicMeter) || 0;
  }
});
</script>

<style scoped>
</style>


