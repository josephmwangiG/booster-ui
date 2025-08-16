<template>
  <div class="content-section">
    <div class="lg:px-20 px-3 py-10">
      <div class="w-full flex justify-center pb-12">
        <span class="text-xl font-semibold pt-[2px]">
          <span class="text-orange-500 text-xl font-semibold">SIFA</span>MART
        </span>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
        <div class="p-6 lg:p-12 mr-16 hidden lg:block">
          <h2 class="text-bold text-2xl">Get started!</h2>
          <p class="pt-4 mb-12 text-gray-400 text-sm">
            Sign up for a 30 days free trial account.
          </p>
          <div class="image mt-20">
            <img src="/images/img1.png" alt="" />
          </div>
        </div>
        <div
          class="login shadow-lg shadow-gray-200 rounded lg:p-20 px-6 pb-16 pt-8"
        >
          <div class="text text-2xl">
            <h3>Register</h3>
            <p class="pt-4 mb-12 text-gray-400 text-sm lg:hidden">
              Get started. Sign up for a 30 days free trial account.
            </p>
          </div>
          <div class="form-group mt-10">
            <label for="user_name" class="w-full text-sm">Username</label>
            <input
              type="text"
              v-model="formData.user_name"
              class="w-full border border-gray-400 py-2 lg:py-2 px-3 my-2 rounded"
              id="email"
              placeholder="Enter your user name"
            />
            <span class="text-[12px] text-red-400" v-if="errors.user_name">
              {{ errors.user_name[0] }}
            </span>
          </div>
          <div class="form-group mt-3">
            <label for="phone_number" class="w-full text-sm"
              >Phone Number</label
            >
            <input
              type="text"
              v-model="formData.phone_number"
              class="w-full border border-gray-400 py-2 lg:py-2 px-3 my-2 rounded"
              id="phone_number"
              placeholder="Enter your phone number"
            />
            <span class="text-[12px] text-red-400" v-if="errors.phone_number">
              {{ errors.phone_number[0] }}
            </span>
          </div>
          <div class="form-group mt-3">
            <label for="email" class="w-full text-sm">Email</label>
            <input
              type="email"
              v-model="formData.email"
              class="w-full border border-gray-400 py-2 lg:py-2 px-3 my-2 rounded"
              id="email"
              placeholder="Enter your email"
            />
            <span class="text-[12px] text-red-400" v-if="errors.email">
              {{ errors.email[0] }}
            </span>
          </div>
          <div class="grid lg:gap-6 grid-cols-1 lg:grid-cols-2">
            <div class="form-group mt-3">
              <label for="password" class="w-full text-sm">Your Password</label>
              <input
                type="password"
                class="w-full border border-gray-400 py-2 lg:py-2 px-3 my-2 rounded"
                id="password"
                v-model="formData.password"
                placeholder="Enter your password"
              />
              <span class="text-[12px] text-red-400" v-if="errors.password">
                {{ errors.password[0] }}
              </span>
            </div>
            <div class="form-group mt-3">
              <label for="password" class="w-full text-sm"
                >Confirm Password</label
              >
              <input
                type="password"
                v-model="formData.password_confirmation"
                class="w-full border border-gray-400 py-2 lg:py-2 px-3 my-2 rounded"
                id="password"
                placeholder="Confirm your password"
              />
            </div>
          </div>
          <p class="text-[12px] text-gray-400">
            Use 8 or more characters with a mix of letters, numbers & symbols.
          </p>
          <div
            class="form-group mt-3 flex justify-between items-center text-sm"
          >
            <div>
              <el-checkbox
                type="checkbox"
                v-model="formData.accept_terms"
                label="Accept terms and conditions"
              />
            </div>
          </div>
          <div
            class="form-group flex justify-between items-center mt-6 lg:mt-10 space-y-3"
          >
            <button
              @click="register"
              class="btn-primary"
            >
              {{ loading ? "Please wait..." : "Register" }}
            </button>
            <div>
              Have an account?
              <router-link
                :to="{ name: 'login' }"
                class="text-blue-500 semibold"
                >Sign in</router-link
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

const errors: any = ref({});
const loading = ref(false);

const store = useAuthStore();
const router = useRouter();
const formData = ref({
  type: router.currentRoute.value.query.type,
  user_name: "",
  email: "",
  phone_number: "",
  password: "",
  password_confirmation: "",
  accept_terms: false,
  base_url: window.location.origin + "/verify-account/",
});

const register = async () => {
  loading.value = true;
  const res = await store.register(formData.value);

  if (res.status == 201 || res.status == 200) {
    ElNotification({
      title: "Success",
      message: "Account was created",
      type: "success",
    });
    router.push({ name: "login" });
  } else if (res.status == 422) {
    errors.value = res.data.errors;
  } else {
    ElNotification({
      title: "Error",
      message: "Account could not be created. Please try again later!",
      type: "error",
    });
  }

  loading.value = false;
};

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push({ name: "dashboard" });
  }
});
</script>

<style></style>
