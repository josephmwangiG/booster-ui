<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Generate Bills</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Generate Bills
        </span>
      </div>
    </div>

    <div class="w-full mt-3 lg:mt-6 p-3 lg:p-6 bg-white">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="auto"
        status-icon
        label-position="top"
      >
        <!-- Period Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <el-form-item prop="month" :label="'Month'">
            <el-select
              v-model="formData.month"
              placeholder="Select month"
              class="w-full"
            >
              <el-option
                v-for="month in months"
                :key="month"
                :label="month"
                :value="month"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="year" :label="'Year'">
            <el-select
              v-model="formData.year"
              placeholder="Select year"
              class="w-full"
            >
              <el-option
                v-for="year in years"
                :key="year"
                :label="year"
                :value="year"
              />
            </el-select>
          </el-form-item>
        </div>

        <!-- Tenant Bills Section -->
        <div v-if="formData.bills.length > 0" class="space-y-6">
          <div
            v-for="bill in formData.bills"
            :key="bill.tenant_id"
            class="rounded shadow !bg-gray-50 border border-gray-100"
            :class="getTenantCardClass(bill)"
          >
            <div class="p-4">
              <div class="flex items-start justify-between gap-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <p
                      class="text-lg font-bold"
                      :class="
                        isTenantExcluded(bill)
                          ? 'text-red-600'
                          : 'text-neutral-800'
                      "
                    >
                      {{ bill.tenant_name }}
                    </p>
                    <div
                      v-if="isTenantExcluded(bill)"
                      class="flex items-center gap-1 text-red-500"
                    >
                      <i class="ri-close-circle-fill text-lg"></i>
                      <span class="text-xs font-medium">EXCLUDED</span>
                    </div>
                  </div>
                  <div>
                    <p
                      class="text-sm"
                      :class="
                        isTenantExcluded(bill)
                          ? 'text-red-400'
                          : 'text-neutral-500'
                      "
                    >
                      Unit: {{ bill.unit_name }} | Rent:
                      <span
                        class="font-medium"
                        :class="
                          isTenantExcluded(bill)
                            ? 'text-red-500'
                            : 'text-neutral-600'
                        "
                        >KES
                        {{
                          Number(bill.rent_amount || 0).toLocaleString()
                        }}</span
                      >
                    </p>
                  </div>
                  <!-- Exclusion reason -->
                  <div
                    v-if="isTenantExcluded(bill)"
                    class="mt-2 p-2 bg-red-50 border border-red-200 rounded-md"
                  >
                    <p class="text-sm text-red-700 font-medium">
                      <i class="ri-information-line mr-1"></i>
                      {{ getExclusionReason(bill) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Utility Checkboxes -->
              <div
                v-if="!isTenantExcluded(bill)"
                class="mt-4 flex items-center space-x-4"
              >
                <div
                  v-for="utility in bill.utilities"
                  :key="utility.id"
                  class="flex items-center gap-2"
                >
                  <input
                    v-model="utility.is_checked"
                    @change="
                      toggleUtility(
                        bill.id,
                        utility,
                        ($event.target as HTMLInputElement).checked,
                        bill.unit_id
                      )
                    "
                    class="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    :id="`${utility.name.toLowerCase()}-${bill.id}`"
                    :name="`${utility.name.toLowerCase()}-${bill.id}`"
                    type="checkbox"
                  />
                  <label
                    class="text-sm font-medium text-gray-700"
                    :for="`${utility.name.toLowerCase()}-${bill.id}`"
                    >{{ utility.name }}</label
                  >
                </div>
              </div>

              <!-- Disabled utilities for excluded tenants -->
              <div v-else class="mt-4 flex items-center space-x-4 opacity-50">
                <div
                  v-for="utility in bill.utilities"
                  :key="utility.id"
                  class="flex items-center gap-2"
                >
                  <input
                    disabled
                    class="h-4 w-4 rounded border border-gray-300 text-gray-400"
                    :id="`${utility.name.toLowerCase()}-${bill.id}`"
                    type="checkbox"
                  />
                  <label
                    class="text-sm font-medium text-gray-400"
                    :for="`${utility.name.toLowerCase()}-${bill.id}`"
                    >{{ utility.name }}</label
                  >
                </div>
              </div>
            </div>

            <!-- Utility Inputs -->
            <div
              v-if="bill.utilities.length > 0 && !isTenantExcluded(bill)"
              class="px-4 py-3"
            >
              <div class="space-y-4 border-t border-gray-300">
                <div
                  v-for="utility in bill.utilities"
                  :key="utility.id"
                  v-show="utility.is_checked"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                      <p class="font-medium text-neutral-700">
                        {{ utility.name }} Bill
                      </p>
                    </div>
                    <p class="font-medium text-neutral-800">
                      KES
                      {{ utility.amount ? utility.amount.toLocaleString() : 0 }}
                    </p>
                  </div>
                  <div class="mt-3 grid grid-cols-4 gap-2">
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700">
                        Prev. Reading
                      </label>
                      <input
                        v-model="utility.prev_reading"
                        class="w-full rounded-md border border-gray-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2"
                        placeholder="Prev Reading"
                        type="number"
                        title="Previous reading"
                        @input="getUtilityTotal(utility)"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700">
                        Current Reading
                      </label>
                      <input
                        v-model="utility.current_reading"
                        @input="getUtilityTotal(utility)"
                        class="w-full rounded-md border border-gray-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2"
                        placeholder="Current Reading"
                        type="number"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700">
                        Rate per Unit
                      </label>
                      <input
                        :value="utility.rate"
                        class="w-full rounded-md border border-gray-300 text-sm shadow-sm bg-neutral-100 text-neutral-600 p-2"
                        placeholder="Rate"
                        type="number"
                        readonly
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700">
                        Total Amount
                      </label>
                      <input
                        v-model="utility.amount"
                        class="w-full rounded-md border border-gray-300 text-sm shadow-sm bg-neutral-100 text-neutral-600 p-2"
                        placeholder="Amount"
                        type="number"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Individual Tenant Summary -->
            <div
              class="flex items-center justify-between rounded-b-xl px-4 py-3"
              :class="isTenantExcluded(bill) ? 'bg-red-50' : 'bg-neutral-100'"
            >
              <p
                class="font-semibold"
                :class="
                  isTenantExcluded(bill) ? 'text-red-700' : 'text-neutral-800'
                "
              >
                {{
                  isTenantExcluded(bill)
                    ? "Excluded from Billing"
                    : "Bill Summary"
                }}
              </p>
              <p
                v-if="!isTenantExcluded(bill)"
                class="font-bold text-lg text-neutral-900"
              >
                KES {{ getTenantTotal(bill).toLocaleString() }}
              </p>
              <p v-else class="font-bold text-lg text-red-600">N/A</p>
            </div>
          </div>
        </div>

        <!-- No tenants message -->
        <div v-else class="text-center py-8 bg-gray-50 !rounded">
          <div class="text-gray-400 text-lg mb-2">
            <i class="ri-user-line text-4xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">
            No Tenants Found
          </h3>
          <p class="text-gray-500">
            Add tenants with active tenancies to generate bills.
          </p>
        </div>

        <!-- Total Bill Summary -->
        <div v-if="tenantsWithUnits.length > 0" class="mt-6">
          <h2 class="pt-4 pb-2 text-2xl font-bold text-neutral-900">
            Bill Summary
          </h2>
          <div class="rounded bg-gray-100 shadow-sm">
            <div class="flex items-center justify-between px-4 py-4">
              <p class="text-lg font-semibold text-primary-500">Total Bill</p>
              <p class="text-2xl font-bold text-primary-500">
                KES {{ totalEstimatedAmount.toLocaleString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-3 justify-end items-center mt-6"
        >
          <button
            @click="goBack"
            type="button"
            class="btn-primary-outline w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            @click="submitForm(true)"
            type="button"
            class="btn-primary-outline w-full sm:w-auto"
            :disabled="loading"
          >
            <span v-if="loading && isDraft" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Draft...
            </span>
            <span v-else>Generate Draft</span>
          </button>
          <button
            @click="submitForm(false)"
            type="button"
            class="btn-primary w-full sm:w-auto"
            :disabled="loading"
          >
            <span v-if="loading && !isDraft" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
import {
  ElNotification,
  type FormInstance,
  type FormRules,
} from "element-plus";
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
const isDraft = ref(false);

const formData = reactive<any>({
  month: "",
  year: "",
  bills: [],
});

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
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
const utilities = computed(() => {
  const list = utilitiesStore.utilities || [];
  const seenIds = new Set<string | number>();
  return list.filter((u: any) => {
    const id = u?.id;
    if (seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });
});

// Get all tenants with their exclusion status
const allTenants = computed(() => {
  return tenants.value.filter(
    (tenant) =>
      tenant.tenancies &&
      tenant.tenancies.length > 0 &&
      tenant.tenancies.some((tenancy: any) => tenancy.unit_id && tenancy.active)
  );
});

// Filter tenants to only show those with active tenancies and assigned units
const tenantsWithUnits = computed(() => {
  return allTenants.value.filter((tenant) => !isTenantExcluded(tenant));
});

const totalEstimatedAmount = computed(() => {
  let total = 0;
  formData.bills.forEach((bill: any) => {
    total += getTenantTotal(bill);
  });
  return total;
});


const toggleUtility = async (
  tenantId: number,
  utility: any,
  selected: boolean,
  unitId: string
) => {
  // Initialize utility inputs when selected
  if (selected) {
    let previousReading = 0;

    // Fetch previous meter reading from database
    if (unitId) {
      try {
        const result = await store.getPreviousMeterReadings(
          tenantId.toString(),
          utility.id.toString(),
          String(unitId)
        );
        if (result.success) {
          previousReading = result.previous_reading || 0;
        }
      } catch (error) {
        console.error("Error fetching previous reading:", error);
      }
    }

    utility.prev_reading = previousReading;
  } else {
    utility.prev_reading = 0;
  }
};

const getUtilityTotal = (utility: any) => {
  const amount =
    (Number(utility.current_reading) - Number(utility.prev_reading)) *
    Number(utility.rate);
  utility.amount = amount > 0 ? amount : 0;
};

const getTenantTotal = (bill: any) => {
  let total = 0;

  // Add rent amount
  total += Number(bill.rent_amount) || 0;

  // Add utility amounts
  bill.utilities
    .filter((utility: any) => utility.is_checked)
    .forEach((utility: any) => {
      total += utility.amount || 0;
    });

  return total;
};

// Check if a tenant is excluded from billing
const isTenantExcluded = (tenant: any) => {
  if (!formData.month || !formData.year) return false;

  const monthNumber =
    new Date(`${formData.month} 1, ${formData.year}`).getMonth() + 1;
  const endOfMonth = new Date(Number(formData.year), monthNumber, 0);

  // Check if tenant has no active tenancies
  const hasActiveTenancies =
    tenant.tenancies && tenant.tenancies.some((tenancy: any) => tenancy.active);
  if (!hasActiveTenancies) return false;

  // Check if tenant joined after billing period
  const tenantCreatedAt = new Date(tenant.created_at);
  if (tenantCreatedAt > endOfMonth) return false;

  // Note: We can't check for existing bills or monthly limits here without API calls
  // This would need to be handled by the backend and passed to the frontend

  return false;
};

// Get the reason why a tenant is excluded
const getExclusionReason = (tenant: any) => {
  if (!formData.month || !formData.year) return "";

  const monthNumber =
    new Date(`${formData.month} 1, ${formData.year}`).getMonth() + 1;
  const endOfMonth = new Date(Number(formData.year), monthNumber, 0);

  // Check if tenant has no active tenancies
  const hasActiveTenancies =
    tenant.tenancies && tenant.tenancies.some((tenancy: any) => tenancy.active);
  if (!hasActiveTenancies) {
    return "No active tenancies";
  }

  // Check if tenant joined after billing period
  const tenantCreatedAt = new Date(tenant.created_at);
  if (tenantCreatedAt > endOfMonth) {
    const joinDate = tenantCreatedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `Joined on ${joinDate} which is after ${formData.month} ${formData.year}`;
  }

  return "Unknown reason";
};

// Get CSS class for tenant card based on exclusion status
const getTenantCardClass = (tenant: any) => {
  if (isTenantExcluded(tenant)) {
    return "bg-red-50 border border-red-200";
  }
  return "bg-neutral-50";
};

const rules = reactive<FormRules>({
  month: [
    { required: true, message: "Please select month", trigger: "change" },
  ],
  year: [{ required: true, message: "Please select year", trigger: "change" }],
});

const goBack = () => {
  router.push({ name: "tenant-bills" });
};

const submitForm = async (draft = false) => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    loading.value = true;
    isDraft.value = draft;

    formData.draft = draft;
    formData.year = Number(formData.year).toString();

    const res = await store.generateTenantBills(formData);
    if (res.status == 200 || res.status == 201) {
      let message = draft
        ? "Draft bills generated"
        : "Bills generated successfully";

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
      router.push({ name: "tenant-bills" });
    }
  } catch (error: any) {
    console.error("Error generating bills:", error);
    ElNotification({
      title: "Error",
      type: "error",
      message: error.response?.data?.message || "Failed to generate bills. Fill all required fields.",
    });
  } finally {
    loading.value = false;
    isDraft.value = false;
  }
};

onMounted(async () => {
  await Promise.all([tenantsStore.getTenants(), utilitiesStore.getUtilities()]);

  let bills = allTenants.value.map((tenant: any) => {
    const items = tenant.tenancies
      .filter((tenancy: any) => tenancy.active)
      .map((tenancy: any) => {
        return {
          id: tenant.id,
          tenant_name: tenant.tenant_name,
          tenant_id: tenant.id,
          tenancy_id: tenancy.id,
          unit_id: tenancy.unit_id,
          unit_name: tenancy.unit.unit_code,
          rent_amount: tenancy.rent_amount,
          utilities: utilities.value.map((u: any) => ({
            ...u,
            prev_reading: 0,
            current_reading: 0,
            amount: 0,
          })),
        };
      });

    return items;
  });

  formData.bills = bills.flat();
});
</script>
