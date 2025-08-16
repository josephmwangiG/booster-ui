<template>
  <div class="content-section">
    <div class="lg:px-20 px-3 pt-20 lg:pt-40">
      <div class="w-full flex justify-center pb-12">
        <span class="text-xl font-semibold pt-[2px]">
          <span class="text-orange-500 text-xl font-semibold">SIFA</span>MART
        </span>
      </div>
      <div class="text-sm overflow-hidden">
        <div class="min-h-[40vh] flex flex-col items-center justify-center">
          <h1 class="text-5xl font-bold mb-8">Account Verified</h1>
          <p class="text-lg mb-8">
            Your account has been verified. Login to access your account.
          </p>
          <p class="text-lg mb-8">
            <router-link :to="{ name: 'login' }">
              <button class="btn-primary">Login</button>
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const store = useAuthStore();
const router = useRouter();



onMounted(async () => {
  await store.verifyAccount(
    router.currentRoute.value.params.token as string
  );

  if (localStorage.getItem("token")) {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    router.push({ name: user?.type === 'admin' ? 'admin-dashboard' : 'dashboard' });
  }
});
</script>

<style></style>
