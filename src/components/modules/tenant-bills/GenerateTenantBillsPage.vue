<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Collect Bills</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Collect Bills
        </span>
      </div>
    </div>

    <div class="w-full mt-3 lg:mt-6">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="auto" status-icon label-position="top">
        
        <!-- Period Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <el-form-item prop="month" :label="'Month'">
            <el-select v-model="formData.month" placeholder="Select month" class="w-full">
              <el-option v-for="month in months" :key="month" :label="month" :value="month" />
            </el-select>
          </el-form-item>
          <el-form-item prop="year" :label="'Year'">
            <el-select v-model="formData.year" placeholder="Select year" class="w-full">
              <el-option v-for="year in years" :key="year" :label="year" :value="year" />
            </el-select>
          </el-form-item>
        </div>

        <!-- Tenant Bills Section -->
        <div v-if="allTenants.length > 0" class="space-y-6">
          <div v-for="tenant in allTenants" :key="tenant.id" class="rounded-xl shadow-sm" :class="getTenantCardClass(tenant)">
            <div class="p-4">
              <div class="flex items-start justify-between gap-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <p class="text-lg font-bold" :class="isTenantExcluded(tenant) ? 'text-red-600' : 'text-neutral-800'">
                      {{ tenant.tenant_name }}
                    </p>
                    <div v-if="isTenantExcluded(tenant)" class="flex items-center gap-1 text-red-500">
                      <i class="ri-close-circle-fill text-lg"></i>
                      <span class="text-xs font-medium">EXCLUDED</span>
                    </div>
                  </div>
                  <div v-for="tenancy in tenant.tenancies.filter((t: any) => t.active)" :key="tenancy.id">
                    <p class="text-sm" :class="isTenantExcluded(tenant) ? 'text-red-400' : 'text-neutral-500'">
                      Unit: {{ tenancy.unit?.unit_code || 'N/A' }} | Rent:
                      <span class="font-medium" :class="isTenantExcluded(tenant) ? 'text-red-500' : 'text-neutral-600'">KES {{ Number(tenancy.rent_amount || 0).toLocaleString() }}</span>
                    </p>
                  </div>
                  <!-- Exclusion reason -->
                  <div v-if="isTenantExcluded(tenant)" class="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p class="text-sm text-red-700 font-medium">
                      <i class="ri-information-line mr-1"></i>
                      {{ getExclusionReason(tenant) }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Utility Checkboxes -->
              <div v-if="!isTenantExcluded(tenant)" class="mt-4 flex items-center space-x-4">
                <div v-for="utility in utilities" :key="utility.id" class="flex items-center gap-2">
                  <input
                    :checked="isUtilitySelected(tenant.id, utility.id)"
                    @change="toggleUtility(tenant.id, utility.id, ($event.target as HTMLInputElement).checked)"
                    class="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    :id="`${utility.name.toLowerCase()}-${tenant.id}`"
                    :name="`${utility.name.toLowerCase()}-${tenant.id}`"
                    type="checkbox"
                  />
                  <label
                    class="text-sm font-medium text-gray-700"
                    :for="`${utility.name.toLowerCase()}-${tenant.id}`"
                  >{{ utility.name }}</label>
                </div>
              </div>
              
              <!-- Disabled utilities for excluded tenants -->
              <div v-else class="mt-4 flex items-center space-x-4 opacity-50">
                <div v-for="utility in utilities" :key="utility.id" class="flex items-center gap-2">
                  <input
                    disabled
                    class="h-4 w-4 rounded border-gray-300 text-gray-400"
                    :id="`${utility.name.toLowerCase()}-${tenant.id}`"
                    type="checkbox"
                  />
                  <label
                    class="text-sm font-medium text-gray-400"
                    :for="`${utility.name.toLowerCase()}-${tenant.id}`"
                  >{{ utility.name }}</label>
                </div>
              </div>
            </div>
                    
            <!-- Utility Inputs -->
            <div v-if="utilities.length > 0 && !isTenantExcluded(tenant)" class="border-t border-neutral-200 px-4 py-3">
              <div class="space-y-4">
                <div v-for="utility in utilities" :key="utility.id" v-show="isUtilitySelected(tenant.id, utility.id)">
                  <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                      <p class="font-medium text-neutral-700">
                        {{ utility.name }} Bill
                      </p>
                    </div>
                    <p class="font-medium text-neutral-800">KES {{ getUtilityAmount(tenant.id, utility.id).toLocaleString() }}</p>
                  </div>
                  <div class="mt-3 grid grid-cols-4 gap-2">
                    <input
                      :value="getUtilityInput(tenant.id, utility.id, 'prev_reading')"
                      class="w-full rounded-md border-neutral-300 text-sm shadow-sm bg-neutral-100 text-neutral-600"
                      placeholder="Prev Reading"
                      type="text"
                      readonly
                      title="Previous reading from database"
                    />
                    <input
                      :value="getUtilityInput(tenant.id, utility.id, 'current_reading')"
                      @input="updateUtilityInput(tenant.id, utility.id, 'current_reading', ($event.target as HTMLInputElement).value)"
                      class="w-full rounded-md border-neutral-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Current Reading"
                      type="text"
                    />
                    <input
                      :value="utility.rate"
                      class="w-full rounded-md border-neutral-300 text-sm shadow-sm bg-neutral-100 text-neutral-600"
                      placeholder="Rate"
                      type="text"
                      readonly
                    />
                    <input
                      :value="getUtilityAmount(tenant.id, utility.id)"
                      class="w-full rounded-md border-neutral-300 text-sm shadow-sm bg-neutral-100 text-neutral-600"
                      placeholder="Amount"
                      type="text"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>
          
            <!-- Individual Tenant Summary -->
            <div class="flex items-center justify-between rounded-b-xl px-4 py-3" :class="isTenantExcluded(tenant) ? 'bg-red-50' : 'bg-neutral-100'">
              <p class="font-semibold" :class="isTenantExcluded(tenant) ? 'text-red-700' : 'text-neutral-800'">
                {{ isTenantExcluded(tenant) ? 'Excluded from Billing' : 'Bill Summary' }}
              </p>
              <p v-if="!isTenantExcluded(tenant)" class="font-bold text-lg text-neutral-900">KES {{ getTenantTotal(tenant.id).toLocaleString() }}</p>
              <p v-else class="font-bold text-lg text-red-600">N/A</p>
            </div>
          </div>
        </div>

        <!-- No tenants message -->
        <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
          <div class="text-gray-400 text-lg mb-2">
            <i class="ri-user-line text-4xl"></i>
            </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No Tenants Found</h3>
          <p class="text-gray-500">Add tenants with active tenancies to generate bills.</p>
            </div>

        <!-- Total Bill Summary -->
        <div v-if="tenantsWithUnits.length > 0" class="mt-6">
          <h2 class="pt-4 pb-2 text-2xl font-bold text-neutral-900">
            Bill Summary
          </h2>
          <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div class="flex items-center justify-between bg-primary-500/10 px-4 py-4">
              <p class="text-lg font-semibold text-primary-500">
                Total Bill
              </p>
              <p class="text-2xl font-bold text-primary-500">KES {{ totalEstimatedAmount.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-end items-center mt-6">
          <button @click="goBack" type="button" class="btn-primary-outline w-full sm:w-auto">
            Cancel
          </button>
          <button @click="submitForm()" type="button" class="btn-primary w-full sm:w-auto" :disabled="loading">
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Bills...
            </span>
            <span v-else>Generate Bills</span>
          </button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { useTenantBillsStore } from "@/store/tenant-bills.store";
import { useTenantsStore } from "@/store/tenants.store";
import { useUtilitiesStore } from "@/store/utilities.store";

const router = useRouter();
const store = useTenantBillsStore();
const tenantsStore = useTenantsStore();
const utilitiesStore = useUtilitiesStore();

const formRef = ref<FormInstance>();
const loading = ref(false);

const formData = reactive<any>({
  month: '',
  year: '',
  meter_readings: [],
  utility_inputs: {}, // Store manual utility inputs per tenant/unit
  selected_utilities: {} // Store selected utilities per tenant
});

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear + 1];
  for (let i = currentYear; i > currentYear - 3; i--) {
    years.push(i);
  }
  return years;
});

// Computed properties
const tenants = computed(() => tenantsStore.tenants || []);
const utilities = computed(() => utilitiesStore.utilities || []);

// Get all tenants with their exclusion status
const allTenants = computed(() => {
  return tenants.value.filter(tenant => 
    tenant.tenancies && tenant.tenancies.length > 0 && 
    tenant.tenancies.some((tenancy: any) => tenancy.unit_id && tenancy.active)
  );
});

// Filter tenants to only show those with active tenancies and assigned units
const tenantsWithUnits = computed(() => {
  return allTenants.value.filter(tenant => !isTenantExcluded(tenant));
});

const totalRentAmount = computed(() => {
  let total = 0;
  tenantsWithUnits.value.forEach(tenant => {
    tenant.tenancies?.filter((tenancy: any) => tenancy.active).forEach((tenancy: any) => {
      total += Number(tenancy.rent_amount) || 0;
    });
  });
  return total;
});

const totalUtilitiesAmount = computed(() => {
  let total = 0;
  tenantsWithUnits.value.forEach(tenant => {
    tenant.tenancies?.filter((tenancy: any) => tenancy.active).forEach(() => {
      utilities.value.forEach((utility: any) => {
        if (isUtilitySelected(tenant.id, utility.id)) {
          total += getUtilityAmount(tenant.id, utility.id);
        }
      });
    });
  });
  return total;
});

const totalEstimatedAmount = computed(() => {
  return totalRentAmount.value + totalUtilitiesAmount.value;
});

// Methods for managing utility selection and inputs
const isUtilitySelected = (tenantId: number, utilityId: number) => {
  const key = `${tenantId}_${utilityId}`;
  return formData.selected_utilities[key] || false;
};

const toggleUtility = async (tenantId: number, utilityId: number, selected: boolean) => {
  const key = `${tenantId}_${utilityId}`;
  formData.selected_utilities[key] = selected;
  
  // Initialize utility inputs when selected
  if (selected) {
    const inputKey = `${tenantId}_${utilityId}`;
    if (!formData.utility_inputs[inputKey]) {
      // Get the tenant's unit ID for fetching previous readings
      const tenant = allTenants.value.find(t => t.id === tenantId);
      const activeTenancy = tenant?.tenancies?.find((t: any) => t.active);
      const unitId = activeTenancy?.unit_id;
      
      let previousReading = 0;
      
      // Fetch previous meter reading from database
      if (unitId) {
        try {
          const result = await store.getPreviousMeterReadings(tenantId.toString(), utilityId.toString(), unitId);
          if (result.success) {
            previousReading = result.previous_reading || 0;
          }
        } catch (error) {
          console.error('Error fetching previous reading:', error);
        }
      }
      
      formData.utility_inputs[inputKey] = {
        prev_reading: previousReading.toString(),
        current_reading: '',
        rate: utilities.value.find((u: any) => u.id === utilityId)?.rate || 0
      };
    }
  }
};

const getUtilityInput = (tenantId: number, utilityId: number, field: string) => {
  const key = `${tenantId}_${utilityId}`;
  const utilityInput = formData.utility_inputs[key];
  if (!utilityInput) return '';
  return utilityInput[field] || '';
};

const updateUtilityInput = (tenantId: number, utilityId: number, field: string, value: string) => {
  const key = `${tenantId}_${utilityId}`;
  if (!formData.utility_inputs[key]) {
    formData.utility_inputs[key] = {
      prev_reading: '',
      current_reading: '',
      rate: utilities.value.find((u: any) => u.id === utilityId)?.rate || 0
    };
  }
  formData.utility_inputs[key][field] = value;
};

const getUtilityAmount = (tenantId: number, utilityId: number) => {
  const key = `${tenantId}_${utilityId}`;
  const utilityInput = formData.utility_inputs[key];
  if (!utilityInput) return 0;
  
  const prevReading = parseFloat(utilityInput.prev_reading) || 0;
  const currentReading = parseFloat(utilityInput.current_reading) || 0;
  const rate = parseFloat(utilityInput.rate) || 0;
  
  const consumption = Math.max(0, currentReading - prevReading);
  return consumption * rate;
};

const getTenantTotal = (tenantId: number) => {
  const tenant = tenantsWithUnits.value.find(t => t.id === tenantId);
  if (!tenant) return 0;
  
  let total = 0;
  
  // Add rent amount
  tenant.tenancies?.filter((tenancy: any) => tenancy.active).forEach((tenancy: any) => {
    total += Number(tenancy.rent_amount) || 0;
  });
  
  // Add utility amounts
  utilities.value.forEach((utility: any) => {
    if (isUtilitySelected(tenantId, utility.id)) {
      total += getUtilityAmount(tenantId, utility.id);
    }
  });
  
  return total;
};

// Check if a tenant is excluded from billing
const isTenantExcluded = (tenant: any) => {
  if (!formData.month || !formData.year) return false;
  
  const monthNumber = new Date(`${formData.month} 1, ${formData.year}`).getMonth() + 1;
  const endOfMonth = new Date(Number(formData.year), monthNumber, 0);
  
  // Check if tenant has no active tenancies
  const hasActiveTenancies = tenant.tenancies && tenant.tenancies.some((tenancy: any) => tenancy.active);
  if (!hasActiveTenancies) return true;
  
  // Check if tenant joined after billing period
  const tenantCreatedAt = new Date(tenant.created_at);
  if (tenantCreatedAt > endOfMonth) return true;
  
  // Note: We can't check for existing bills or monthly limits here without API calls
  // This would need to be handled by the backend and passed to the frontend
  
  return false;
};

// Get the reason why a tenant is excluded
const getExclusionReason = (tenant: any) => {
  if (!formData.month || !formData.year) return '';
  
  const monthNumber = new Date(`${formData.month} 1, ${formData.year}`).getMonth() + 1;
  const endOfMonth = new Date(Number(formData.year), monthNumber, 0);
  
  // Check if tenant has no active tenancies
  const hasActiveTenancies = tenant.tenancies && tenant.tenancies.some((tenancy: any) => tenancy.active);
  if (!hasActiveTenancies) {
    return 'No active tenancies';
  }
  
  // Check if tenant joined after billing period
  const tenantCreatedAt = new Date(tenant.created_at);
  if (tenantCreatedAt > endOfMonth) {
    const joinDate = tenantCreatedAt.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    return `Joined on ${joinDate} which is after ${formData.month} ${formData.year}`;
  }
  
  return 'Unknown reason';
};

// Get CSS class for tenant card based on exclusion status
const getTenantCardClass = (tenant: any) => {
  if (isTenantExcluded(tenant)) {
    return 'bg-red-50 border border-red-200';
  }
  return 'bg-neutral-50';
};

const rules = reactive<FormRules>({
  month: [
    { required: true, message: "Please select month", trigger: "change" },
  ],
  year: [
    { required: true, message: "Please select year", trigger: "change" },
  ],
});

const goBack = () => {
  router.push({ name: 'tenant-bills' });
};

const submitForm = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    loading.value = true;
    
    // Prepare data for submission - convert to the format expected by backend
    const utilityInputsForBackend: any = {};
    
    // Process utility inputs for each eligible tenant only
    tenantsWithUnits.value.forEach(tenant => {
      if (!isTenantExcluded(tenant)) {
        tenant.tenancies?.filter((tenancy: any) => tenancy.active).forEach((tenancy: any) => {
          utilities.value.forEach((utility: any) => {
            if (isUtilitySelected(tenant.id, utility.id)) {
              const key = `${tenant.id}_${tenancy.id}_${utility.id}`;
              const utilityInput = formData.utility_inputs[`${tenant.id}_${utility.id}`];
              if (utilityInput) {
                const prevReading = parseFloat(utilityInput.prev_reading) || 0;
                const currentReading = parseFloat(utilityInput.current_reading) || 0;
                const consumption = Math.max(0, currentReading - prevReading);
                utilityInputsForBackend[key] = consumption;
              }
            }
          });
        });
      }
    });
    
    const dataToSend = {
      month: formData.month,
      year: String(formData.year),
      meter_readings: [], // No meter readings needed
      utility_inputs: utilityInputsForBackend // Include processed utility inputs
    };
    
    console.log("Form data being sent:", dataToSend);
    console.log("Utility inputs for backend:", utilityInputsForBackend);
    console.log("Selected utilities:", formData.selected_utilities);
    console.log("Raw utility inputs:", formData.utility_inputs);
    
    const res = await store.generateTenantBills(dataToSend);
    if (res.status == 200 || res.status == 201) {
      let message = "Bills generated successfully";
      
      // Add SMS results to notification if available
      if (res.data?.sms_results) {
        const smsResults = res.data.sms_results;
        message += `. SMS sent: ${smsResults.sent}, Failed: ${smsResults.failed}, Skipped: ${smsResults.skipped}`;
      }
      
      ElNotification({
        title: "Success",
        type: "success",
        message: message,
        duration: 6000, // Show longer to read SMS results
      });
      // Navigate back to tenant bills page
      router.push({ name: 'tenant-bills' });
    }
  } catch (error: any) {
    console.error("Error generating bills:", error);
    ElNotification({
      title: "Error",
      type: "error",
      message: error.response?.data?.message || "Failed to generate bills",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Load tenants and utilities data
  await Promise.all([
    tenantsStore.getTenants(),
    utilitiesStore.getUtilities()
  ]);
  
  // Debug: Log utilities to see if they're loaded
  console.log('Utilities loaded:', utilities.value);
  console.log('Tenants with units:', tenantsWithUnits.value);
});
</script>

<style scoped>
/* CSS Variables matching the proposed design */
:root {
  --primary-500: #ff8801;
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
}

/* Responsive form improvements */
.el-form-item {
  margin-bottom: 16px;
}

/* Better spacing on mobile */
@media (max-width: 640px) {
  .el-form-item {
    margin-bottom: 12px;
  }
  
  .el-form-item__label {
    font-size: 14px;
    margin-bottom: 6px;
  }
}

/* Tenant card styling */
.tenant-card {
  background-color: var(--neutral-50);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.tenant-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Utility checkbox styling */
.utility-checkbox {
  accent-color: var(--primary-500);
}

.utility-checkbox:checked {
  background-color: var(--primary-500);
  border-color: var(--primary-500);
}

/* Input styling to match proposed design */
input[type="text"] {
  border: 1px solid var(--neutral-300);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  transition: all 0.2s ease;
}

input[type="text"]:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(255, 136, 1, 0.1);
}

input[type="text"]:read-only {
  background-color: var(--neutral-100);
  color: var(--neutral-600);
}

/* Summary section styling */
.bill-summary {
  background-color: var(--neutral-100);
  border-radius: 0 0 12px 12px;
  padding: 12px 16px;
}

.total-bill-summary {
  background-color: rgba(255, 136, 1, 0.1);
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
}

/* Action buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

@media (min-width: 640px) {
  .action-buttons {
    flex-direction: row;
    gap: 16px;
  }
}

/* Loading spinner */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Utility input grid styling */
.utility-input-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 12px;
}

@media (max-width: 640px) {
  .utility-input-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}

/* Color classes for text */
.text-primary-500 {
  color: var(--primary-500);
}

.text-neutral-800 {
  color: var(--neutral-800);
}

.text-neutral-700 {
  color: var(--neutral-700);
}

.text-neutral-600 {
  color: var(--neutral-600);
}

.text-neutral-500 {
  color: var(--neutral-500);
}

.text-neutral-900 {
  color: var(--neutral-900);
}

.bg-primary-500\/10 {
  background-color: rgba(255, 136, 1, 0.1);
}

.bg-neutral-50 {
  background-color: var(--neutral-50);
}

.bg-neutral-100 {
  background-color: var(--neutral-100);
}

.border-neutral-200 {
  border-color: var(--neutral-200);
}

.border-neutral-300 {
  border-color: var(--neutral-300);
}

/* Focus ring for primary color */
.focus\:ring-primary-500:focus {
  --tw-ring-color: rgba(255, 136, 1, 0.5);
}

.focus\:border-primary-500:focus {
  border-color: var(--primary-500);
}
</style>
