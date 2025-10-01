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
        <div class="flex gap-2">
          <button class="btn-primary" @click="action = 'edit'">Edit Organization</button>
          <button class="btn-primary" @click="goToManageSubscriptions">Manage Subscriptions</button>
        </div>
      </div>
      <EditOrganizationDetails v-if="action == 'edit'" @exit-edit="action = 'view'" />
      <OrganizationDetails v-if="action != 'edit'" />
      <div class="mt-6">
        <h4 class="font-semibold mb-2">Active Subscriptions</h4>
        <div v-if="subscriptions.length === 0" class="text-sm text-gray-500">No active subscriptions.</div>
        <ul v-else class="list-disc ml-5 text-sm">
          <li v-for="sub in subscriptions" :key="sub">{{ sub }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'vue-router';

const action = ref("view")

const EditOrganizationDetails = defineAsyncComponent(
  () => import("@/components/settings/EditOrganizationDetails.vue")
);
const OrganizationDetails = defineAsyncComponent(
  () => import("@/components/settings/OrganizationDetails.vue")
);

const store = useAuthStore()
const router = useRouter()

const subscriptions = computed(() => {
  const org = store.user?.organization
  if (!org || !Array.isArray(org.subscriptions)) return [] as string[]
  return org.subscriptions
    .filter((sub: any) => sub && sub.is_active)
    .map((sub: any) => sub?.module?.name || sub?.plan_name)
    .filter((name: any) => typeof name === 'string' && name.length > 0)
})

const goToManageSubscriptions = () => {
  const id = store.user?.organization?.id
  if (id) {
    router.push({ name: 'admin-organization', params: { id } })
  }
}
</script>

<style></style>
