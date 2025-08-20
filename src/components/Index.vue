<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div :class="`w-64 bg-gray-900 text-white flex-shrink-0 transition-all duration-300 ${showSidebar ? 'block' : 'hidden'} lg:block`">
      <div class="flex items-center justify-between h-20 px-5 bg-gray-800">
        <router-link :to="{ name: 'dashboard' }" class="text-xl font-bold text-white">Booster</router-link>
        <button class="lg:hidden" @click="showSidebar = false">
          <i class="ri-close-line text-2xl"></i>
        </button>
      </div>
      <Sidebar />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="flex items-center justify-between p-4 bg-white border-b">
        <div class="flex items-center">
          <button class="lg:hidden mr-3" @click="showSidebar = !showSidebar">
            <i class="ri-menu-3-line text-2xl"></i>
          </button>
          <h1 class="text-xl font-semibold text-gray-800">{{ $route.name }}</h1>
        </div>

        <div class="flex items-center">
          <div class="relative">
            <button @click="showUserMenu = !showUserMenu" class="flex items-center space-x-2">
              <span class="font-semibold text-gray-700">{{ store?.user?.user_name }}</span>
              <i class="ri-arrow-down-s-line"></i>
            </button>
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <router-link :to="{ name: 'profile' }" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</router-link>
              <a href="#" @click.prevent="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="p-6">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Sidebar from "./Sidebar.vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.store";

const showSidebar = ref(false);
const showUserMenu = ref(false);

const loading = ref(true);
const route = useRoute();
const router = useRouter();
const store = useAuthStore();

const logout = () => {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    router.push({ name: "login" });
  }
};

watch(
  () => route.name,
  () => {
    showSidebar.value = false;
    showUserMenu.value = false;
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
    if (res.status == 200 && res.data) {
      const u = res.data;
      localStorage.setItem("user", JSON.stringify({ id: u.id, type: u.type || 'user' }));
    }
  }
});
</script>