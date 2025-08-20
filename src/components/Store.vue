<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Stores</h1>
        <p class="text-gray-600">Manage your stores</p>
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">
        New Store
      </button>
    </div>

    <!-- Stores List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Name</th>
              <th scope="col" class="px-6 py-3">Location</th>
              <th scope="col" class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder Data -->
            <tr class="bg-white border-b">
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Main Store</td>
              <td class="px-6 py-4">New York, NY</td>
              <td class="px-6 py-4 text-right">
                <a href="#" class="font-medium text-blue-600 hover:underline">Edit</a>
              </td>
            </tr>
            <tr class="bg-white border-b">
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Warehouse</td>
              <td class="px-6 py-4">Los Angeles, CA</td>
              <td class="px-6 py-4 text-right">
                <a href="#" class="font-medium text-blue-600 hover:underline">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Store",
});
</script>

<style scoped></style>