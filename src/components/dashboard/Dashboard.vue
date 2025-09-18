<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p v-if="subscriptions.length > 0" class="text-gray-600">Select a dashboard to view</p>
        <p v-else class="text-gray-600">You have no active subscriptions. Please contact support.</p>
      </div>
      <div v-if="subscriptions.length > 0" class="relative">
        <select 
          v-model="activeDashboard" 
          @change="handleSelect($event.target.value)"
          class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option v-for="subscription in subscriptions" :key="subscription" :value="subscription">
            {{ subscription }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <i class="ri-arrow-down-s-line"></i>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div>
      <PropertiesDashboard v-if="activeDashboard === 'Properties'" />
      <WMDashboard v-if="activeDashboard === 'Water Management'" />
      <!-- Commented out until VendorDashboard component is implemented -->
      <!-- <VendorDashboard v-if="activeDashboard == 'Inventory'" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { computed, defineAsyncComponent, onMounted, ref } from "vue";

const PropertiesDashboard = defineAsyncComponent(
  () => import("@/components/dashboard/PropertiesDashboard.vue")
);

// Commented out until VendorDashboard component is implemented
// const VendorDashboard = defineAsyncComponent(
//   () => import("@/components/dashboard/VendorDashboard.vue")
// );
const WMDashboard = defineAsyncComponent(
  () => import("@/components/dashboard/WMDashboard.vue")
);

const store = useAuthStore();

const subscriptions = computed(() => {
  const org = store.user?.organization;
  if (!org || !Array.isArray(org.subscriptions)) return [];
  const subs = org.subscriptions
    .filter((sub: any) => sub && sub.is_active)
    .map((sub: any) => sub?.module?.name || sub?.plan_name)
    .filter((name: any) => typeof name === 'string' && name.length > 0);
  return subs;
});

const activeDashboard = ref(subscriptions.value.includes("Properties") ? "Properties" : subscriptions.value[0] || "");
const handleSelect = (dashboard: string) => {
  activeDashboard.value = dashboard;
};

onMounted(() => {
  if (subscriptions.value.length === 1) {
    // You can add a toast or a simple console log here to inform the user.
    // For example:
    // toast.info(`You have been directed to your default dashboard: ${activeDashboard.value}`);
  }
});
</script>
