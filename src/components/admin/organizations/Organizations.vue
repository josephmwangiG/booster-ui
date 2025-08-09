<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Organizations</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Organizations
        </span>
      </div>
    </div>
    <div class="mt-5">
      <div class="shadow-md rounded py-5 px-3 bg-white">
        <div class="justify-between space-x-2 items-center flex">
          <div class="title">
            <h4 class="font-semibold">Organizations</h4>
            <span class="text-gray-400 text-sm">
              You have {{ store?.organizations?.length?.toLocaleString() }} organizations
            </span>
          </div>
        </div>
        <hr class="my-3" />
        <div class="overflow-x-auto w-full">
          <table ref="dataTableRef" class="w-full d-table">
            <thead class="t-head">
              <tr>
                <th class="t-th">Name</th>
                <th class="t-th">Email</th>
                <th class="t-th">Phone Number</th>
                <th class="t-th">Industry</th>
                <th class="t-th">Login</th>
                <th class="w-32 t-th">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in (store.organizations as any)" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td">
                  {{ item.name }}
                </td>
                <td class="t-td">
                  {{ item.email }}
                </td>
                <td class="t-td">
                  {{ item.phone }}
                </td>
                <td class="t-td">
                  {{ item?.industry }}
                </td>
                <td class="t-td">
                  {{ item.can_login ? "Yes" : "No" }}
                </td>

                <td class="t-td">
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
                        <el-dropdown-item>
                          <router-link class="font-semibold py-2" :to="{
                            name: 'admin-organization',
                            params: { id: item.id },
                          }"><i class="ri-external-link-line text-orange-500"></i>
                            View</router-link>
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
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { initDataTable } from "@/composables/dataTables";
import { useAdmUsersStore } from "@/store/admin/users.store";

const dataTableRef = ref(null);

DataTable.use(DataTablesCore);
const loading = ref(true);
const store = useAdmUsersStore();

onMounted(async () => {
  loading.value = true;
  await store.getOrganizations();
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
