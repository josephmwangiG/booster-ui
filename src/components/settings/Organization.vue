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
        <button class="btn-primary" @click="action = 'edit'">Edit Organization</button>
      </div>
      <EditOrganizationDetails v-if="action == 'edit'" @exit-edit="action = 'view'" />
      <OrganizationDetails v-if="action != 'edit'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const action = ref("view")

const EditOrganizationDetails = defineAsyncComponent(
  () => import("@/components/settings/EditOrganizationDetails.vue")
);
const OrganizationDetails = defineAsyncComponent(
  () => import("@/components/settings/OrganizationDetails.vue")
);
</script>

<style></style>
