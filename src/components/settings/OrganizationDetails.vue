<template>
  <div class="overflow-auto">
    <div class="col-span-4 space-y-6 mt-6">
      <table class="w-full font-semibold text-sm">
        <tr>
          <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
            Organization Name
          </td>
          <td>{{ store.user?.organization?.name }}</td>
        </tr>
        <tr>
          <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
            Industry
          </td>
          <td>{{ store.user?.organization?.industry }}</td>
        </tr>
        <tr>
          <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
            Contact Phone
          </td>
          <td>{{ store.user?.organization?.phone }}</td>
        </tr>
        <tr>
          <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
            Contact Email
          </td>
          <td>{{ store.user?.organization?.email }}</td>
        </tr>
        <tr>
          <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
            Address
          </td>
          <td>{{ store.user?.organization?.address }}</td>
        </tr>
        <tr>
          <td class="w-[160px] lg:w-1/3 text-gray-400 text-[13px] py-2">
            City
          </td>
          <td>{{ store.user?.organization?.city }}</td>
        </tr>

      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/store/auth.store';

const store = useAuthStore()

</script>
<style lang="">

</style>