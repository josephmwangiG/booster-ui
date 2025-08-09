<template>
  <div class="content-section bg-gray-100 min-h-[100vh]">
    <div class="bg-white">
      <div class="max-w-6xl mx-auto h-16 flex align-middle content-center items-center justify-between px-5">
        <span class="text-xl font-semibold">
          <span class="text-orange-500 text-xl font-semibold">SIFA</span>MART
        </span>
        <router-link :to="{ name: 'login' }">
          <button class="btn-primary-outline">
            Login
          </button>
        </router-link>
      </div>

    </div>
    <div class="bg-gray-900">
      <section class="text-center text-white py-12 lg:py-24  max-w-6xl mx-auto">
        <h1 class="font-bold text-2xl lg:text-3xl py-5">
          Streamline Your Business Operations
        </h1>
        <p class="max-w-[240px] lg:max-w-[300px] mx-auto">
          Get started for free with our essential business management tools.
        </p>
      </section>
    </div>
    <div class=" max-w-6xl mx-auto">
      <section class="py-12 lg:py-24 px-5">
        <div class="grid grid-cols-1 lg:grid-cols-3 lg:space-y-0 space-y-3">
          <div class="col-span-1 text-center p-3 lg:p-8 bg-white">
            <h1 class="pb-4 font-bold text-xl">SMART<span> Business Tools</span></h1>

            <p class="text-gray-700 py-3">
              Choose the tools that best suits your business needs and get the most relevant tools for your goals.
            </p>
          </div>
          <div class="col-span-1 text-center p-3 lg:p-8 bg-orange-500 text-white">
            <h1 class="pb-4 font-bold text-xl">Properties management</h1>
            <p class="text-gray-50 py-3">
              Utilize our property management tools to efficiently handle rents and utilities, ensuring smooth
              operations
              and better tenant satisfaction.
            </p>
            <router-link :to="{ name: 'register', query: { type: 'Properties' } }">
              <button class="border border-white p-2 rounded-lg mt-2">
                Get Started
              </button>
            </router-link>
          </div>
          <div class="col-span-1 text-center p-3 lg:p-8 bg-white">
            <h1 class="pb-4 font-bold text-xl">Inventory management</h1>
            <p class="text-gray-700 py-3">Use our inventory management tools to efficiently manage your inventory,
              clients, and payments, keeping
              your
              business running smoothly.</p>
            <router-link :to="{ name: 'register', query: { type: 'Inventory' } }">
              <button class="btn-primary-outline mt-2">
                Get Started
              </button>
            </router-link>
          </div>
        </div>
      </section>

    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

if (localStorage.getItem('token')) {
  router.push({ name: "dashboard" });
}

</script>

<style></style>
