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
          <div class="image mt-20">
            <img src="/images/img1.png" alt="" />
          </div>
        </div>
        <div
          class="login shadow-lg shadow-gray-200 rounded lg:p-20 px-6 pb-16 pt-8 min-h-[85vh]"
        >
          <div class="text text-2xl">
            <h3>Reset Password</h3>
            <p class="pt-4 mb-12 text-gray-400 text-sm">
              Reset your account password.
            </p>
          </div>

          <div class="form-group mt-3">
            <label for="password" class="w-full text-sm">New Password</label>
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
          <p class="text-[12px] text-gray-400">
            Use 8 or more characters with a mix of letters, numbers & symbols.
          </p>

          <div
            class="form-group flex justify-between items-center mt-6 space-y-3 lg:mt-10"
          >
            <button
              @click="resetPassword"
              :disabled="loading"
              class="btn-primary"
            >
              {{ loading ? "Please wait..." : "Reset Password" }}
            </button>
            <div>
              Go back to
              <router-link
                :to="{ name: 'login' }"
                class="text-blue-500 semibold"
                >Login</router-link
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
const router = useRouter();
const formData = ref({
  password: "",
  password_confirmation: "",
});

const resetPassword = async () => {
  loading.value = true;
  const res = await store.resetPassword(
    formData.value,
    router.currentRoute.value.params.token as string
  );

  loading.value = false;

  if (res.status == 200) {
    ElNotification({
      title: "Success",
      type: "success",
      message: res.data.message,
    });

    errors.value = {};

    router.push({ name: "login" });
  }else if(res.status == 422 && res.data.errors){
    errors.value = res.data.errors;
  }else{
    ElNotification({
      title: "Error",
      type: "error",
      message: res.data.message,
    }); 
  }
};

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push({ name: "dashboard" });
  }
});
</script>

<style></style>
