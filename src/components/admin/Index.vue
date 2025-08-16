<template>
  <div class="lg:flex relative min-h-screen">
    <!-- Body -->
    <div
      class="flex-1 w-full h-full lg:relative absolute inset-0 z-0 order-2 overflow-y-auto lg:ml-64"
    >
      <div class="header sticky top-0 z-20 bg-white">
        <nav
          class="flex items-center justify-between font-semibold p-4 shadow-md shadow-gray-200 bg-white h-20"
        >
          <div class="brand flex lg:hidden content-center align-center">
            <button
              class="mr-3"
              @click="
                showSidebar = !showSidebar;
                showNavbarMenu = false;
              "
            >
              <i class="ri-menu-3-line text-2xl"></i>
            </button>
            <span class="text-xl pt-[2px]">
              <span class="text-orange-500">SIFA</span>MART
            </span>
          </div>
          <div class="flex lg:hidden content-center">
            <button
              @click="
                showNavbarMenu = !showNavbarMenu;
                showSidebar = false;
              "
              class="inline-block items-center px-3 py-2 hover:border-white"
            >
              <i class="ri-menu-line"></i>
            </button>
          </div>

          <div
            class="w-full block flex-grow border border-white lg:flex lg:items-center lg:w-auto fixed lg:relative lg:top-0 bg-white top-16 left-0 z-20 p-4 lg:p-0"
            :class="
              showNavbarMenu ? 'block shadow-md shadow-gray-200' : 'hidden'
            "
          >
            <div class="text-sm lg:flex-grow capitalize align-center"></div>
            <div>
              <router-link :to="{ name: 'profile' }" class="px-2 capitalize">
                <i class="ri-user-follow-line mx-1"></i>
                {{ store?.user?.user_name }}
              </router-link>
              <button
                @click="logout"
                class="inline-block text-sm px-4 py-2 leading-none border rounded text-gray-500 border-gray-500 hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div class="h-full mb-20">
        <router-view v-if="!loading"> </router-view>
      </div>
    </div>
    <!-- End Body -->
    <!-- Sidebar -->
    <div
      class="sidebar w-64 bg-primary-700 text-white fixed flex flex-col text-sm inset-y-0 left-0 lg:-translate-x-0 transition duration-300 ease-in-out h-screen order-1"
      :class="
        showSidebar ? 'relative -translate-x-0 z-10 w-64' : '-translate-x-full'
      "
    >
      <div
        class="flex justify-between items-center px-5 py-4 w-full bg-white h-20 shadow-b shadow-md shadow-gray-primary-700 text-xl font-semibold text-black"
      >
        <span><span class="text-orange-500">SIFA</span>MART</span>
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
    .then(() => {
      localStorage.clear();
      router.push({ name: "login" });
    })
    .catch(() => {});
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
    router.push({ name: "login" });
  } else {
    await store.getUser();
    loading.value = false;
  }
});
</script>

<style>
/* .dataTables_paginate span a {
  color: red !important
} */
</style>