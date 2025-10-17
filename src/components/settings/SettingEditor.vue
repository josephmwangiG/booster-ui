<template>
  <el-dialog v-model="open" :title="model.id ? 'Edit Setting' : 'New Setting'" width="560px">
    <div class="space-y-3">
      <el-input v-model="model.name" placeholder="Name (e.g., app.name)" />
      <div>
        <label class="text-sm text-gray-500">Value</label>
        <el-input v-model="val" type="textarea" :rows="6" placeholder='Enter value here. For JSON, use {"key":"value"}' />
        <small class="text-gray-500">Can be a string, number, boolean, or valid JSON.</small>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <button class="btn-primary-outline mr-2" @click="emit('close')">Cancel</button>
        <button class="btn-primary" :disabled="!model.name" @click="onSave">Save</button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import type { SettingRecord } from '@/store/settings.store';

const props = defineProps<{ modelValue: boolean; value?: SettingRecord | null }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'save', v: SettingRecord): void; (e: 'close'): void }>();

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const model = reactive<SettingRecord>({ name: '', value: '' });

watch(() => props.value, (v) => {
  Object.assign(model, v || { name: '', value: '' });
});

const val = computed({
  get: () => {
    try {
      return typeof model.value === 'string' ? model.value : JSON.stringify(model.value, null, 2);
    } catch {
      return '';
    }
  },
  set: (v: string) => {
    try {
      model.value = JSON.parse(v);
    } catch {
      model.value = v;
    }
  }
});

const onSave = () => {
  emit('save', { ...model });
};
</script>

<style scoped>
</style>