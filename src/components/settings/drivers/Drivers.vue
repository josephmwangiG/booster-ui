<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Drivers</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Drivers
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Drivers </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ store.drivers.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Drivers</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Drivers</h4>
            <span class="text-gray-400 text-sm"> {{ store.drivers.length }} items found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Driver
          </button>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Name
                </th>
                <th class="t-th">License Number</th>
                <th class="t-th">Email</th>
                <th class="t-th">Phone Number</th>
                <th class="t-th">ID Number</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in store.drivers" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <router-link :to="{ name: 'water-client', params: { id: item.id } }">
                    <span>{{
                      item.name
                    }}</span>

                  </router-link>
                </td>
                <td class="t-td">
                  {{
                    item.license_number
                  }}
                </td>
                <td class="t-td">
                  {{
                    item.email
                  }}
                </td>
                <td class="t-td">{{ item.phone_number }}</td>
                <td class="t-td font-semibold">
                  {{ item.national_id }}
                </td>

                <td class="t-td text-end">
                  <el-dropdown trigger="click">
                    <span
                      class="el-dropdown-link inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-100 px-2 py-1 lg:px-3 lg:py-2 text-sm text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50">
                      Action
                      <el-icon class="el-icon--right">
                        <i class="ri-arrow-down-s-line"></i>
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="editItem(item)">
                          <span class="font-semibold py-2"><i class="ri-edit-line text-orange-500"></i>
                            Edit</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%" :key="dialogVisible">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action === "create" ? "Add" : "Edit" }} Driver
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <DriverFormModal @close-modal="dialogVisible = false" :form="formData" :action="action">
      </DriverFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { initDataTable } from "@/composables/dataTables";
import { useDriversStore } from "@/store/drivers.store";

const DriverFormModal = defineAsyncComponent(
  () => import("@/components/settings/drivers/DriverFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const store = useDriversStore();
const formData = ref({});

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const addItem = () => {
  action.value = "create";
  formData.value = {};
  dialogVisible.value = true;
};


const editItem = (item: any) => {
  action.value = "edit";
  formData.value = item;
  dialogVisible.value = true;
};


onMounted(async () => {
  await store.getDrivers();
  initDataTable(dataTableRef.value);
  loading.value = false;

});
</script>

<style></style>
