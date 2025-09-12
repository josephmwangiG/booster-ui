<template>
  <div class="mt-2">
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

      <!-- Utilities Section -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-4 text-gray-700">Utilities</h4>
        <p class="text-sm text-gray-600 mb-4">
          Enter the utility quantities for each tenant and unit. The total will be calculated automatically using the utility rates.
        </p>
        
        <div v-if="utilities.length > 0" class="space-y-4 max-h-96 overflow-y-auto pr-2">
          <div v-for="tenant in tenantsWithUnits" :key="tenant.id" class="border rounded-lg p-4 bg-gray-50">
            <h5 class="font-medium text-gray-800 mb-3">{{ tenant.tenant_name }}</h5>
            
            <div v-for="tenancy in tenant.tenancies.filter((t: any) => t.active)" :key="tenancy.id" class="ml-2 md:ml-4 mb-4">
              <div class="text-sm text-gray-600 mb-2">Unit: {{ tenancy.unit?.unit_code || 'N/A' }}</div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="utility in utilities" :key="utility.id" class="bg-white p-3 rounded border utility-card">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <span class="text-sm font-medium">{{ utility.name }}</span>
                    <span class="text-xs px-2 py-1 rounded w-fit bg-green-100 text-green-800">
                      {{ utility.category }}
                    </span>
                  </div>
                  
                  <div class="text-sm text-gray-600 mb-2">
                    Rate: KES {{ utility.rate }}/{{ utility.unit || 'unit' }}
                  </div>
                  
                  <!-- Manual input field for utility quantity -->
                  <div class="mt-2">
                    <label class="block text-xs text-gray-500 mb-1">Quantity ({{ utility.unit || 'units' }})</label>
                    <el-input
                      :model-value="getUtilityInput(tenant.id, tenancy.id, utility.id)"
                      type="number"
                      placeholder="0"
                      :min="0"
                      step="0.01"
                      size="small"
                      @input="updateUtilityInput(tenant.id, tenancy.id, utility.id, $event)"
                      class="utility-input"
                    >
                    </el-input>
                    <div v-if="getUtilityInput(tenant.id, tenancy.id, utility.id)" class="text-xs text-green-600 mt-1">
                      Total: KES {{ (Number(getUtilityInput(tenant.id, tenancy.id, utility.id)) * Number(utility.rate)).toLocaleString() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No utilities message -->
        <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
          <div class="text-gray-400 text-lg mb-2">
            <i class="ri-tools-line text-4xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No Utilities Found</h3>
          <p class="text-gray-500">Add utilities to include them in bill generation.</p>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <h5 class="font-medium text-orange-800 mb-3">Bill Generation Summary</h5>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-orange-700">
          <div class="flex items-center gap-2">
            <span class="font-medium">Month:</span>
            <span>{{ formData.month }} {{ formData.year }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Tenants:</span>
            <span>{{ tenantsWithUnits.length }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Utilities:</span>
            <span>{{ utilities.length }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Rent Total:</span>
            <span class="font-semibold">KES {{ totalRentAmount.toLocaleString() }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Utilities Total:</span>
            <span class="font-semibold">KES {{ totalUtilitiesAmount.toLocaleString() }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Grand Total:</span>
            <span class="font-semibold text-lg">KES {{ totalEstimatedAmount.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-end items-center mt-6">
        <button @click="emits('close-modal')" type="button" class="btn-primary-outline w-full sm:w-auto">
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
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { ElNotification, type FormInstance, type FormRules } from "element-plus";
import { useTenantBillsStore } from "@/store/tenant-bills.store";
import { useTenantsStore } from "@/store/tenants.store";
import { useUtilitiesStore } from "@/store/utilities.store";

const props = defineProps({
  form: Object,
});
const emits = defineEmits(["close-modal", "submit-form"]);
const store = useTenantBillsStore();
const tenantsStore = useTenantsStore();
const utilitiesStore = useUtilitiesStore();

const formRef = ref<FormInstance>();
const loading = ref(false);

const formData = reactive<any>({
  month: props.form?.month || '',
  year: props.form?.year || '',
  meter_readings: [],
  utility_inputs: {} // Store manual utility inputs per tenant/unit
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

// Filter tenants to only show those with active tenancies and assigned units
const tenantsWithUnits = computed(() => {
  return tenants.value.filter(tenant => 
    tenant.tenancies && tenant.tenancies.length > 0 && 
    tenant.tenancies.some((tenancy: any) => tenancy.unit_id && tenancy.active)
  );
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
    tenant.tenancies?.filter((tenancy: any) => tenancy.active).forEach((tenancy: any) => {
      utilities.value.forEach((utility: any) => {
        const utilityKey = `${tenant.id}_${tenancy.id}_${utility.id}`;
        const utilityQuantity = formData.utility_inputs[utilityKey];
        // Handle both string and number values
        if (utilityQuantity !== undefined && utilityQuantity !== null && utilityQuantity !== '') {
          const numQuantity = typeof utilityQuantity === 'number' ? utilityQuantity : parseFloat(utilityQuantity);
          if (!isNaN(numQuantity)) {
            const utilityTotal = numQuantity * (Number(utility.rate) || 0);
            total += utilityTotal;
            console.log(`Adding utility ${utility.name} for tenant ${tenant.tenant_name}: ${numQuantity} x ${utility.rate} = ${utilityTotal}, running total: ${total}`);
          }
        }
      });
    });
  });
  console.log('Total utilities amount:', total);
  return total;
});

const totalEstimatedAmount = computed(() => {
  return totalRentAmount.value + totalUtilitiesAmount.value;
});

// Methods for managing utility inputs
const getUtilityInput = (tenantId: number, tenancyId: number, utilityId: number) => {
  const key = `${tenantId}_${tenancyId}_${utilityId}`;
  const value = formData.utility_inputs[key];
  return value === undefined || value === null ? '' : String(value);
};

const updateUtilityInput = (tenantId: number, tenancyId: number, utilityId: number, value: string) => {
  const key = `${tenantId}_${tenancyId}_${utilityId}`;
  // Convert to number and store, or store empty string if invalid
  const numValue = parseFloat(value);
  const finalValue = isNaN(numValue) ? '' : numValue;
  formData.utility_inputs[key] = finalValue;
  console.log(`Updated utility input for key ${key}: "${value}" -> ${finalValue}`);
};

const rules = reactive<FormRules>({
  month: [
    { required: true, message: "Please select month", trigger: "change" },
  ],
  year: [
    { required: true, message: "Please select year", trigger: "change" },
  ],
});

const submitForm = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    loading.value = true;
    
    // Prepare data for submission
    const dataToSend = {
      month: formData.month,
      year: String(formData.year),
      meter_readings: [], // No meter readings needed
      utility_inputs: formData.utility_inputs // Include manual utility inputs
    };
    
    console.log("Form data being sent:", dataToSend);
    
    const res = await store.generateTenantBills(dataToSend);
    
    // Handle success case (200/201 status with actual bills created)
    if (res.status == 200 || res.status == 201) {
      const success = res.data?.success !== false;
      const billsCreated = res.data?.bills_created_count || 0;
      const isError = res.data?.error === true;
      
      if (isError || (success === false && billsCreated === 0)) {
        // Error case - no bills can be generated, don't close modal
        let message = res.data?.message || "Cannot generate bills.";
        
        // If we have excluded tenants info, show them in a detailed notification
        if (res.data?.excluded_tenants && res.data.excluded_tenants.length > 0) {
          message += `\n\n${res.data.excluded_tenants.length} tenant(s) were excluded:\n\n`;
          res.data.excluded_tenants.forEach((reason: string, index: number) => {
            message += `${index + 1}. ${reason}\n`;
          });
        }
        
        ElNotification({
          title: "Cannot Generate Bills",
          type: "error",
          message: message,
          duration: 15000,
          dangerouslyUseHTMLString: false
        });
        
        // Don't close modal or emit submit-form for errors
        return;
      } else if (success && billsCreated > 0) {
        // Success with bills created - close modal and refresh
        emits("submit-form");
        emits("close-modal");
        
        let message = res.data?.message || `${billsCreated} bills generated successfully`;
        if (res.data?.excluded_tenants && res.data.excluded_tenants.length > 0) {
          message += `\n\n${res.data.excluded_tenants.length} tenant(s) were excluded:\n\n`;
          res.data.excluded_tenants.forEach((reason: string, index: number) => {
            message += `${index + 1}. ${reason}\n`;
          });
        }
        
        ElNotification({
          title: "Success",
          type: "success",
          message: message,
          duration: 10000
        });
      }
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

/* Utility category badges */
.utility-category {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.utility-category.flat-rate {
  background-color: #dcfce7;
  color: #166534;
}

.utility-category.meter-reading {
  background-color: #dbeafe;
  color: #1e40af;
}

/* Meter reading inputs */
.meter-reading-inputs {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
}

/* Summary section improvements */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .summary-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
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

/* Utility input styling */
.utility-input {
  width: 100%;
}

.utility-input .el-input__wrapper {
  border-radius: 6px;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

.utility-input .el-input__wrapper:hover {
  border-color: #9ca3af;
}

.utility-input .el-input__wrapper.is-focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Utility card enhancements */
.utility-card {
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.utility-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
