<template>
  <div>
    <div class="flex justify-between items-center mb-3">
      <div class="flex gap-2">
        <el-input v-model="query" placeholder="Search settings by name" class="w-64" />
      </div>
      <button class="btn-primary" type="button" @click="$emit('create')">New Setting</button>
    </div>
    <div v-if="store.loading" class="space-y-2">
      <el-skeleton animated :count="3">
        <template #template>
          <el-skeleton-item variant="p" style="width: 100%; height: 40px;" />
        </template>
      </el-skeleton>
    </div>

    <div v-else-if="filtered.length === 0" class="p-6 border border-dashed rounded text-center text-gray-500">
      No settings found. Click "New Setting" to add your first configuration.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="t-head">
          <tr>
            <th class="t-th">Name</th>
            <th class="t-th">Value</th>
            <th class="t-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filtered" :key="s.id || s.name" class="t-tr">
            <td class="t-td">{{ s.name }}</td>
            <td class="t-td truncate max-w-[360px]">
              <span v-if="typeof s.value === 'object'">JSON</span>
              <span v-else>{{ s.value }}</span>
            </td>
            <td class="t-td">
              <div class="flex gap-2">
                <button class="btn-primary-outline" @click="$emit('edit', s)">Edit</button>
                <button class="btn-danger-outline" @click="$emit('delete', s)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/store/settings.store';

const store = useSettingsStore();
const { items } = storeToRefs(store);

const query = ref('');

const filtered = computed(() => {
  const q = query.value.toLowerCase();
  return items.value.filter(i => {
    return !q || i.name.toLowerCase().includes(q);
  });
});
</script>

<style scoped>
</style>