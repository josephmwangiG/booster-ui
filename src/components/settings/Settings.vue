<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Settings</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Settings
        </span>
      </div>
    </div>

    <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="All Settings" name="list">
          <SettingsList @create="openCreate" @edit="openEdit" @delete="onDelete" />
          <div v-if="store.loading" class="mt-3"></div>
        </el-tab-pane>
        <el-tab-pane label="Water" name="water">
          <WaterSettings />
        </el-tab-pane>
        <el-tab-pane label="Simulations" name="simulations">
          <Simulations />
        </el-tab-pane>
      </el-tabs>
    </div>

    <SettingEditor v-model="editorOpen" :value="editing" @save="onSave" @close="closeEditor" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessageBox, ElNotification } from 'element-plus';
import SettingsList from '@/components/settings/SettingsList.vue';
import SettingEditor from '@/components/settings/SettingEditor.vue';
import Simulations from '@/components/settings/Simulations.vue';
import WaterSettings from '@/components/settings/wm/WaterSettings.vue';
import { useSettingsStore, type SettingRecord } from '@/store/settings.store';

const activeTab = ref('list');

const store = useSettingsStore();
onMounted(() => store.fetch().catch(() => {}));

const editorOpen = ref(false);
const editing = ref<SettingRecord | null>(null);

const openCreate = () => { editing.value = null; editorOpen.value = true; };
const openEdit = (s: SettingRecord) => { editing.value = { ...s }; editorOpen.value = true; };
const closeEditor = () => { editorOpen.value = false; };

const onSave = async (payload: SettingRecord) => {
  try {
    if (payload.id) await store.update(payload.id, payload);
    else await store.create(payload);
    ElNotification({ title: 'Saved', message: 'Setting saved', type: 'success' });
    editorOpen.value = false;
  } catch (e) {
    ElNotification({ title: 'Error', message: 'Failed to save setting', type: 'error' });
  }
};

const onDelete = async (s: SettingRecord) => {
  try {
    await ElMessageBox.confirm('Delete this setting?', 'Confirm', { type: 'warning' });
    if (s.id) await store.remove(s.id);
    ElNotification({ title: 'Deleted', message: 'Setting deleted', type: 'success' });
  } catch {}
};
</script>

<style scoped>
</style>


