<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Properties</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Properties></span> Property Details
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Property  | {{ store.property?.name }}</h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.property?.units.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Units</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.property?.units.filter((u:any) => !u.available)?.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Occupied</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.property?.units.filter((u:any) => u.available)?.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Vacant</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Units</h4>
            <span class="text-gray-400 text-sm"> {{ store.property?.units.length }} units </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Unit
          </button>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Unit Code
                </th>
                <th class="t-th">Tenant</th>
                <th class="t-th">Rent</th>
                <th class="t-th">Bathrooms</th>
                <th class="t-th">Bedrooms</th>
                <th class="t-th">Status</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in store?.property?.units" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item?.unit_code || '-' }}
                </td>
                <td class="t-td">
                  {{ item?.tenancies?.length > 0 ? item?.tenancies[0]?.tenant?.tenant_name : "-" }}
                </td>
                <td class="t-td font-semibold">
                  KES {{ Number(item.rent).toLocaleString() }}
                </td>
                <td class="t-td">{{ item.bathrooms }}</td>
                <td class="t-td">{{ item.bedrooms }}</td>

                <td class="t-td">
                 
                  <span v-if="!item.available" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    Occupied
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                  Vacant
                  </span>
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
                        <el-dropdown-item @click="deleteItem(item.id)">
                          <span class="font-semibold py-2"><i class="ri-delete-bin-line text-red-500"></i>
                            Delete</span>
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
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{action == 'create' ? 'Add' : 'Edit'}} Unit
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <UnitFormModal @close-modal="dialogVisible = false" :form="formData" :action="action"></UnitFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { initDataTable } from "@/composables/dataTables";
import { useRouter } from "vue-router";
import { usePropertiesStore } from "@/store/properties.store";
import { ElNotification } from "element-plus";

const UnitFormModal = defineAsyncComponent(
  () => import("@/components/modules/properties/UnitFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const router = useRouter();
const store = usePropertiesStore();
const action = ref("create");

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const formData = ref({
  property_id: (router.currentRoute.value.params.id as string) || "",
});

const addItem = () => {
  action.value = "create";
  formData.value = {
    property_id: (router.currentRoute.value.params.id as string) || "",
  };
  dialogVisible.value = true;
};

const editItem = (item: any) => {
  action.value = "edit";
  formData.value = item;
  dialogVisible.value = true;
};

const deleteItem = async (id: string) => {
  try {
    await store.deleteUnit(id);
    ElNotification({
      title: "Success",
      message: "Unit deleted successfully",
      type: "success",
    });
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "An error occurred while deleting the unit",
      type: "error",
    });
  }
};


onMounted(async () => {
  await store.getProperty((router.currentRoute.value.params.id as string) || "");
  initDataTable(dataTableRef.value);
  loading.value = false;

});
</script>

<style></style>
