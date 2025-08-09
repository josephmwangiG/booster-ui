<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Users</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Users
        </span>
      </div>
    </div>
    <div class="mt-5">
      <div class="shadow-md rounded py-5 px-3 bg-white">
        <div class="justify-between space-x-2 items-center flex">
          <div class="title">
            <h4 class="font-semibold">Users</h4>
            <span class="text-gray-400 text-sm">
              You have {{ store?.users?.length?.toLocaleString() }} users
            </span>
          </div>
          <button @click="activeModal = true" class="bg-primary-700 rounded text-white text-sm py-2 px-3">
            Add User
          </button>
        </div>
        <hr class="my-3" />
        <div class="overflow-x-auto w-full">
          <table ref="dataTableRef" class="w-full d-table">
            <thead class="t-head">
              <tr>
                <th class="t-th">User</th>
                <th class="t-th">Email</th>
                <th class="t-th">Phone Number</th>
                <th class="t-th">Type</th>
                <th class="t-th">Login</th>
                <th class="w-32 t-th">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in (store.users as any)" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td">
                  {{ item.user_name }}
                </td>
                <td class="t-td">
                  {{ item.email }}
                </td>
                <td class="t-td">
                  {{ item.phone_number }}
                </td>
                <td class="t-td">
                  {{ item?.vendor ? "Vendor" : "User" }}
                </td>
                <td class="t-td">
                  {{ item.can_login ? "Yes" : "No" }}
                </td>

                <td class="t-td">Edit Delete</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <BrandFormModal :modalActive="activeModal" @close-modal="activeModal = false" :form="formData"></BrandFormModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import BrandFormModal from "./BrandFormModal.vue";
import { initDataTable } from "@/composables/dataTables";
import { useAdmUsersStore } from "@/store/admin/users.store";

const dataTableRef = ref(null);

const formData = {
  name: "",
};

DataTable.use(DataTablesCore);
const loading = ref(true);
const store = useAdmUsersStore();

const activeModal = ref(false);

onMounted(async () => {
  loading.value = true;
  await store.getUsers();
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
