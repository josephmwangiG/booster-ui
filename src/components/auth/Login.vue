<template>
  <div class="content-section">
    <div class="lg:px-20 px-3 py-10">
      <div class="w-full flex justify-center pb-12">
        <span class="text-xl font-semibold pt-[2px]">
          <span class="text-orange-500 text-xl font-semibold">SIFA</span>MART
        </span>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 text-sm">
        <div class="p-12 mr-16 hidden lg:block">
          <h2 class="text-bold text-2xl">Welcome!</h2>
          <p class="pt-4 mb-12 text-gray-400 text-sm">
            Login to access your account
          </p>
          <div class="image mt-20">
            <img src="/images/img1.png" alt="" />
          </div>
        </div>
        <div
          class="login shadow-lg shadow-gray-200 rounded lg:p-20 px-6 pb-16 pt-8 min-h-[85vh]"
        >
          <div class="text text-2xl">
            <h3>Login</h3>
            <p class="pt-4 mb-12 text-gray-400 text-sm lg:hidden">
              Login to access your account
            </p>
          </div>

          <div class="form-group mt-12">
            <label for="email" class="w-full text-sm">Email</label>
            <input
              type="email"
              v-model="formData.email"
              class="w-full border border-gray-400 py-2 px-3 my-2 rounded"
              id="email"
              placeholder="Enter your email"
            />
            <span class="text-[12px] text-red-400" v-if="errors.email">
              {{ errors.email[0] }}
            </span>
          </div>

          <div class="form-group mt-3">
            <label for="password" class="w-full text-sm">Password</label>
            <input
              type="password"
              v-model="formData.password"
              class="w-full border border-gray-400 py-2 px-3 my-2 rounded"
              id="password"
              placeholder="Enter your password"
            />
            <span class="text-[12px] text-red-400" v-if="errors.password">
              {{ errors.password[0] }}
            </span>
          </div>

          <div
            class="form-group mt-3 flex justify-between items-center text-sm"
          >
            <div>
              <el-checkbox label="Remember Me" v-model="formData.remember_me" />
            </div>

            <router-link :to="{ name: 'forgot-password' }"
              ><span class="semibold text-blue-500"
                >Forgot password?</span
              ></router-link
            >
          </div>
          <div
            class="form-group flex justify-between items-center mt-6 space-y-3 lg:mt-10"
          >
            <button @click="login" :disabled="loading" class="btn-primary">
              {{ loading ? "Please wait..." : "Sign in" }}
            </button>
            <div>
              Don’t have an account?
              <router-link
                :to="{ name: 'register' }"
                class="text-blue-500 semibold"
                >Sign up</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { ElNotification } from "element-plus";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const errors = ref<any>({});
const loading = ref(false);
const store = useAuthStore();
const formData = ref({
  email: "",
  password: "",
  remember_me: false,
});

const router = useRouter();

const login = async () => {
  loading.value = true;
  try {
    const res = await store.login(formData.value);
    if (res.status == 200) {
      if (router.currentRoute.value.query.redirect) {
        router.push({
          path: router.currentRoute.value.query.redirect as string,
        });
      } else {
        router.push({ name: "dashboard" });
        errors.value = {};
      }
    } else if (res.status == 422 && res.data.errors) {
      errors.value = res.data.errors;
    } else {
      ElNotification({
        title: "Error",
        type: "error",
        message: res.data.message,
      });
    }
  } catch (error: any) {
    ElNotification({
      title: "Error",
      type: "error",
      message: error?.response?.data?.message || "An unexpected error occurred.",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push({ name: "dashboard" });
  }
});
</script>

<style></style>
