<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="bg-white p-4 rounded border">
      <h3 class="font-semibold mb-3">Billing Dry-Run</h3>
      <p class="text-sm text-gray-500 mb-3">Simulate a billing cycle for a given period without creating actual invoices.</p>
      <el-form label-position="top" label-width="auto" class="space-y-3">
        <el-form-item label="Period">
          <el-date-picker class="w-full" v-model="period" type="daterange" range-separator="to" start-placeholder="Start date" end-placeholder="End date" />
        </el-form-item>
        <el-form-item label="Usage per tenant (m³)">
          <el-input class="w-full" v-model.number="assumptions.usage_m3" type="number" />
        </el-form-item>
        <button class="btn-primary w-full" @click="runDryRun" type="button" :disabled="loading.dryRun">
          <span v-if="loading.dryRun">Running...</span>
          <span v-else>Run</span>
        </button>
      </el-form>
      <div v-if="dryRun" class="mt-3 text-sm text-gray-700">
        <div>Total: {{ dryRun.total?.toLocaleString() }}</div>
        <div>Items: {{ dryRun.count }}</div>
      </div>
    </div>

    <div class="bg-white p-4 rounded border">
      <h3 class="font-semibold mb-3">Revenue Forecast</h3>
      <p class="text-sm text-gray-500 mb-3">Project future revenue based on monthly consumption and growth assumptions.</p>
      <el-form label-position="top" label-width="auto" class="space-y-3">
        <el-form-item label="Months">
          <el-input class="w-full" v-model.number="forecast.months" type="number" />
        </el-form-item>
        <el-form-item label="Base monthly m³">
          <el-input class="w-full" v-model.number="forecast.base_monthly_m3" type="number" />
        </el-form-item>
        <el-form-item label="Growth % per month">
          <el-input class="w-full" v-model.number="forecast.monthly_growth_pct" type="number" />
        </el-form-item>
        <button class="btn-primary w-full" @click="runForecast" type="button" :disabled="loading.forecast">
          <span v-if="loading.forecast">Running...</span>
          <span v-else>Run</span>
        </button>
      </el-form>
      <div v-if="forecastRes" class="mt-3 text-sm text-gray-700">Total Revenue: {{ forecastRes.total_revenue?.toLocaleString() }}</div>
    </div>

    <div class="bg-white p-4 rounded border">
      <h3 class="font-semibold mb-3">Collection Scenarios</h3>
      <p class="text-sm text-gray-500 mb-3">Model financial outcomes based on different collection and operational cost scenarios.</p>
      <el-form label-position="top" label-width="auto" class="space-y-3">
        <el-form-item label="Base revenue">
          <el-input class="w-full" v-model.number="collect.base_revenue" type="number" />
        </el-form-item>
        <el-form-item label="Collection %">
          <el-input class="w-full" v-model.number="collect.collection_rate_pct" type="number" />
        </el-form-item>
        <el-form-item label="Leakage %">
          <el-input class="w-full" v-model.number="collect.leakage_pct" type="number" />
        </el-form-item>
        <el-form-item label="Opex %">
          <el-input class="w-full" v-model.number="collect.opex_pct" type="number" />
        </el-form-item>
        <button class="btn-primary w-full" @click="runCollection" type="button" :disabled="loading.collection">
          <span v-if="loading.collection">Running...</span>
          <span v-else>Run</span>
        </button>
      </el-form>
      <div v-if="collectRes" class="mt-3 text-sm text-gray-700">Net After Opex: {{ collectRes.net_after_opex?.toLocaleString() }}</div>
    </div>

    <div class="bg-white p-4 rounded border">
      <h3 class="font-semibold mb-3">Generate Sample Data</h3>
      <p class="text-sm text-gray-500 mb-3">Create sample data for a specific module to populate the system for testing or demos.</p>
      <el-form label-position="top" label-width="auto" class="space-y-3">
        <el-form-item label="Module">
          <el-select class="w-full" v-model="sample.module" placeholder="Select module">
            <el-option label="Property Management" value="property_management" />
            <el-option label="Water Management" value="water_management" />
            <el-option label="Tenant Bills" value="tenant_bills" />
            <el-option label="Properties" value="properties" />
            <el-option label="Tenants" value="tenants" />
            <el-option label="Water Clients" value="water_clients" />
            <el-option label="Water Meters" value="water_meters" />
            <el-option label="Vehicles" value="vehicles" />
            <el-option label="Water Deliveries" value="water_deliveries" />
            <el-option label="Water Collections" value="water_collections" />
          </el-select>
        </el-form-item>
        <el-form-item label="Count">
          <el-input class="w-full" v-model.number="sample.count" type="number" />
        </el-form-item>
        <button class="btn-primary w-full" @click="generateSamples" type="button" :disabled="loading.samples">
          <span v-if="loading.samples">Generating...</span>
          <span v-else>Generate</span>
        </button>
      </el-form>
      <div v-if="sampleRes" class="mt-3 text-sm text-gray-700">
        Created: {{ sampleRes.count }}
      </div>
    </div>

    <div class="bg-white p-4 rounded border">
      <h3 class="font-semibold mb-3">Generate All Sample Data</h3>
      <p class="text-sm text-gray-500 mb-3">Populate the entire system with a complete set of sample data for a comprehensive demo.</p>
      <el-form label-position="top" label-width="auto" class="space-y-3">
        <button class="btn-primary w-full" @click="generateAllSamples" type="button" :disabled="loading.allSamples">
          <span v-if="loading.allSamples">Generating...</span>
          <span v-else>Generate All Data</span>
        </button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { ElNotification } from 'element-plus';

const period = ref<[Date, Date] | null>(null);
const assumptions = ref<any>({ usage_m3: 10 });
const dryRun = ref<any | null>(null);

const forecast = ref<any>({ months: 6, base_monthly_m3: 1000, monthly_growth_pct: 2 });
const forecastRes = ref<any | null>(null);

const collect = ref<any>({ base_revenue: 100000, collection_rate_pct: 85, leakage_pct: 5, opex_pct: 30 });
const collectRes = ref<any | null>(null);

const sample = ref<any>({ module: '', count: 5 });
const sampleRes = ref<any | null>(null);

const loading = ref({
  dryRun: false,
  forecast: false,
  collection: false,
  samples: false,
  allSamples: false,
});

const runDryRun = async () => {
  loading.value.dryRun = true;
  try {
    const [start, end] = period.value || [] as any;
    const res = await axios.post('/simulations/billing-dry-run', {
      period_start: start?.toISOString(),
      period_end: end?.toISOString(),
      assumptions: assumptions.value,
    }, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
    dryRun.value = res.data;
  } catch {
    ElNotification({ title: 'Error', message: 'Failed to run dry-run', type: 'error' });
  } finally {
    loading.value.dryRun = false;
  }
};

const runForecast = async () => {
  loading.value.forecast = true;
  try {
    const res = await axios.post('/simulations/revenue-forecast', {
      months: forecast.value.months,
      assumptions: {
        base_monthly_m3: forecast.value.base_monthly_m3,
        monthly_growth_pct: forecast.value.monthly_growth_pct,
      },
    }, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
    forecastRes.value = res.data;
  } catch {
    ElNotification({ title: 'Error', message: 'Failed to run forecast', type: 'error' });
  } finally {
    loading.value.forecast = false;
  }
};

const runCollection = async () => {
  loading.value.collection = true;
  try {
    const res = await axios.post('/simulations/collection-scenarios', { assumptions: collect.value }, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
    collectRes.value = res.data;
  } catch {
    ElNotification({ title: 'Error', message: 'Failed to run collection scenario', type: 'error' });
  } finally {
    loading.value.collection = false;
  }
};

const generateSamples = async () => {
  if (!sample.value.module) {
    ElNotification({ title: 'Validation', message: 'Select a module', type: 'warning' });
    return;
  }
  loading.value.samples = true;
  try {
    const res = await axios.post('/simulations/generate-sample-data', {
      module: sample.value.module,
      count: sample.value.count,
    }, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
    sampleRes.value = res.data;
    ElNotification({ title: 'Success', message: `Created ${res.data.count} records`, type: 'success' });
  } catch (e: any) {
    ElNotification({ title: 'Error', message: e?.response?.data?.message || 'Failed to generate sample data', type: 'error' });
  } finally {
    loading.value.samples = false;
  }
};

const generateAllSamples = async () => {
  loading.value.allSamples = true;
  try {
    const res = await axios.post('/simulations/generate-all-sample-data', {}, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
    ElNotification({ title: 'Success', message: `Sample data generation started.`, type: 'success' });
  } catch (e: any) {
    ElNotification({ title: 'Error', message: e?.response?.data?.message || 'Failed to generate all sample data', type: 'error' });
  } finally {
    loading.value.allSamples = false;
  }
};
</script>

<style scoped>
</style>


