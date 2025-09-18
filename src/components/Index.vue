<template>
  <div class="lg:flex relative min-h-screen bg-gray-100" v-if="!loading">
    <!-- Body -->
    <div class="flex-1 w-full h-full lg:relative absolute inset-0 z-0 order-2 overflow-y-auto lg:ml-64">
      <div class="header sticky top-0 z-20 bg-white">
        <nav class="flex items-center justify-between font-semibold p-4 shadow-md shadow-gray-200 bg-white h-20">
          <div class="brand flex lg:hidden content-center align-center">
            <button class="mr-3" @click="
              showSidebar = !showSidebar;
            showNavbarMenu = false;
            ">
              <i class="ri-menu-3-line text-2xl"></i>
            </button>
            <span class="text-xl pt-[2px]">
              <span
                class="inline-flex items-center justify-center h-[35px] w-[35px] rounded-full bg-gray-900 font-semibold text-white leading-none uppercase">
                {{ store?.user?.organization?.name?.slice(0, 2) || store?.user?.user_name?.slice(0, 2) }}
              </span> <span class="text-orange-500 text-xl">{{ store?.user?.organization?.name ||
                store?.user?.user_name }}</span>
            </span>
          </div>

          <div class=""></div>

          <div class="border border-white bg-white my-auto">
            <div class="text-sm lg:flex-grow capitalize align-center"></div>
            <router-link :to="{ name: 'profile' }" class="px-2 capitalize">
              <i class="ri-user-follow-line mx-1"></i>
              {{ store?.user?.user_name }}
            </router-link>
            <button @click="logout"
              class="inline-block text-sm px-4 py-2 leading-none border rounded text-gray-500 border-gray-500 hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0">
              Logout
            </button>
          </div>
        </nav>
      </div>
      <div class="h-full mb-20">
        <router-view> </router-view>
      </div>
    </div>
    <!-- End Body -->
    <!-- Sidebar -->
    <div
      class="sidebar w-64 bg-primary-700 text-white fixed flex flex-col text-sm inset-y-0 left-0 lg:-translate-x-0 transition duration-300 ease-in-out h-screen order-1"
      :class="showSidebar ? 'relative -translate-x-0 z-10 w-64' : '-translate-x-full'
        ">
      <div
        class="flex justify-between items-center px-5 py-4 w-full bg-white h-20 shadow-b shadow-md shadow-gray-primary-700 text-xl font-semibold text-black">
        <span class="text-xl">
          <span
            class="inline-flex items-center justify-center h-[35px] w-[35px] rounded-full bg-gray-900 font-semibold text-white leading-none uppercase">
            {{ store?.user?.organization?.name?.slice(0, 2) || store?.user?.user_name?.slice(0, 2) }}
          </span> <span class="text-orange-500 text-xl uppercase">{{ store?.user?.organization?.name ||
            store?.user?.user_name }}</span></span>
        <button class="ml-3 lg:hidden" @click="showSidebar = false">
          <i class="ri-close-line text-4xl text-primary-700"></i>
        </button>
      </div>
      <Sidebar />
    </div>
    <!-- End Sidebar -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Sidebar from "./Sidebar.vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.store";
import { ElMessageBox } from "element-plus";

const showSidebar = ref(false);
const showNavbarMenu = ref(false);

const loading = ref(true);
const route = useRoute();
const router = useRouter();
const store = useAuthStore();

const logout = () => {
  ElMessageBox.confirm(
    "Are you sure you want to log out. Continue?",
    "Confirm",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "",
    }
  )
    .then(async () => {
      await store.logout();
      router.push({ name: "login" });
    })
    .catch(() => { });
};

watch(
  () => route.name,
  (newRouteName, oldRouteName) => {
    if (newRouteName !== oldRouteName) {
      showSidebar.value = false;
      showNavbarMenu.value = false;
    }
  }
);

onMounted(async () => {
  if (!localStorage.getItem("token")) {
    router.push({
      name: "login",
      query: { redirect: router.currentRoute.value.fullPath },
    });
  } else {
    let res = await store.getUser();
    loading.value = false;
    if (res.status == 401) {
      localStorage.clear();
      window.location.href = `/login?redirect=${router.currentRoute.value.fullPath}`;
    }
  }
});
</script>

<style>
/* .dataTables_paginate span a {
  color: red !important
} */
</style>
