<template>
  <div class="content">
    <div class="top-section flex justify-between">
      <div class="bread-crumb">
        <h5 class="font-semibold">Dashboard</h5>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Dashboard
        </span>
      </div>
      <div class="" v-if="subscriptions.length > 1">
        <el-menu :ellipsis="false" class="el-menu-demo rounded hover:rounded my-auto" mode="horizontal" background-color="#071437"
          text-color="#fff" active-text-color="#fff">
          <el-sub-menu index="1">
            <template #title> <span class="font-semibold text-sm">{{ activeDashboard }}</span> </template>
            <el-menu-item index="2-1" v-for="subscription in subscriptions"><span class="font-semibold" 
                @click="handleSelect(subscription)">{{ subscription }}</span></el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </div>
    <PropertiesDashboard v-if="activeDashboard == 'Properties'" />
    <WMDashboard v-if="activeDashboard == 'Water Management'" />
    
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { computed, defineAsyncComponent, onMounted, ref } from "vue";


const PropertiesDashboard = defineAsyncComponent(
  () => import("@/components/dashboard/PropertiesDashboard.vue")
);
const WMDashboard = defineAsyncComponent(
  () => import("@/components/dashboard/WMDashboard.vue")
);

const store = useAuthStore();

const subscriptions = computed(() => {
  const org = store.user?.organization
  if (!org || !Array.isArray(org.subscriptions)) return []
  const subs = org.subscriptions
    .filter((sub: any) => sub && sub.is_active)
    .map((sub: any) => sub?.module?.name || sub?.plan_name)
    .filter((name: any) => typeof name === 'string' && name.length > 0)
  return subs
})



const activeDashboard = ref(subscriptions.value[0] ? subscriptions.value[0] : "")
const handleSelect = (dashboard: string) => {
  activeDashboard.value = dashboard
}

onMounted(async () => {
});
</script>
