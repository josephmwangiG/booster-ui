<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Profile</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Profile
        </span>
      </div>
    </div>
    <div class="mt-5">
      <div class="overflow-auto">
        <div class="col-span-4 space-y-6 p-6 mt-6 bg-white">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold">Profile Details</h4>
            <span class="py-2 px-3 bg-primary-700 text-sm text-white rounded"
              >Edit Profile</span
            >
          </div>
          <table class="w-full font-semibold text-sm">
            <tr>
              <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
                Full Name
              </td>
              <td>{{ store.user.user_name }}</td>
            </tr>
            <tr>
              <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
                Company
              </td>
              <td>{{store.user.vendor.name}}</td>
            </tr>
            <tr>
              <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
                Contact Phone
              </td>
              <td >{{store.user.phone_number}} | <span class="text-green-500">Verified</span></td>
            </tr>
            <tr>
              <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
                Company Site
              </td>
              <td>{{store.user.vendor.website}}</td>
            </tr>
            <tr>
              <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
                Country
              </td>
              <td >Kenya</td>
            </tr>
            <tr>
              <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
                Status
              </td>
              <td class="text-green-500">Active</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth.store';

const store = useAuthStore();
</script>

<style></style>
