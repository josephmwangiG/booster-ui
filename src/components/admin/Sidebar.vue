<template>
  <ul class="mt-2 p-2 flex-1 overflow-y-auto">
    <li class="">
      <router-link :to="{ name: 'admin-dashboard' }"
        :class="router.currentRoute.value.name === 'admin-dashboard' ? 'sidebar-menu-active' : 'sidebar-menu'"><i
          class="ri-speed-up-line mr-2"></i>
        Dashboard</router-link>
    </li>

    <li class="">
      <router-link :to="{ name: 'admin-users' }"
        :class="router.currentRoute.value.name === 'admin-users' ? 'sidebar-menu-active' : 'sidebar-menu'"><i
          class="ri-store-2-fill mr-2"></i> Users</router-link>
    </li>
    <li class="">
      <router-link :to="{ name: 'admin-organizations' }"
        :class="router.currentRoute.value.name === 'admin-organizations' ? 'sidebar-menu-active' : 'sidebar-menu'"><i
          class="ri-store-2-fill mr-2"></i> Organizations</router-link>
    </li>
    <li class="">
      <router-link :to="{ name: 'admin-stores' }"
        :class="router.currentRoute.value.name === 'admin-stores' ? 'sidebar-menu-active' : 'sidebar-menu'"><i
          class="ri-store-2-fill mr-2"></i> Stores</router-link>
    </li>

    <li>
      <button @click="productsDropdown = !productsDropdown" type="button"
        :class="router.currentRoute.value.name === 'admin-products' || router.currentRoute.value.name === 'admin-brands' ? 'sidebar-menu-active' : 'sidebar-menu'"
        class="flex items-center w-full sidebar-menu transition duration-200 ease-in-out group"
        aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
        <i class="ri-shopping-basket-2-line mr-3"></i>
        <span class="flex-1 text-left whitespace-nowrap">Products</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      <ul id="dropdown-example" class="pb-2" :class="productsDropdown ? 'show' : 'hidden'">
        <li>
          <router-link :to="{ name: 'admin-products' }" class="drop-menu py-4"
            :class="router.currentRoute.value.name === 'admin-products' ? 'text-orange-500' : ''"><i
              class="ri-circle-fill text-[8px] mr-2"></i>
            Products</router-link>
        </li>


      </ul>
    </li>
    <li>
      <button @click="contactsDropdown = !contactsDropdown" type="button"
        :class="router.currentRoute.value.name === 'admin-products' || router.currentRoute.value.name === 'admin-brands' ? 'sidebar-menu-active' : 'sidebar-menu'"
        class="flex items-center w-full sidebar-menu transition duration-200 ease-in-out group"
        aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
        <i class="ri-contacts-fill mr-3"></i>
        <span class="flex-1 text-left whitespace-nowrap">Contacts</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      <ul id="dropdown-example" class="pb-2" :class="contactsDropdown ? 'show' : 'hidden'">
        <li>
          <router-link :to="{ name: 'admin-suppliers' }" class="drop-menu py-4"
            :class="router.currentRoute.value.name === 'admin-suppliers' ? 'text-orange-500' : ''"><i
              class="ri-circle-fill text-[8px] mr-2"></i>
            Suppliers</router-link>
        </li>


      </ul>
    </li>

    <li class="">
      <router-link :to="{ name: 'admin-earnings' }"
        :class="router.currentRoute.value.name === 'admin-earnings' ? 'sidebar-menu-active' : 'sidebar-menu'"><i
          class="ri-wallet-2-line mr-2"></i>
        Purchases</router-link>
    </li>

    <li class="">
      <router-link :to="{ name: 'admin-orders' }"
        :class="router.currentRoute.value.name === 'admin-orders' ? 'sidebar-menu-active' : 'sidebar-menu'"><i
          class="ri-shopping-cart-2-fill mr-2"></i>
        Sales</router-link>
    </li>


    <li class="">
      <router-link :to="{ name: 'admin-reports' }"
        :class="router.currentRoute.value.name === 'admin-reports' ? 'sidebar-menu-active' : 'sidebar-menu'"><i
          class="ri-bar-chart-fill mr-2"></i>
        Reports</router-link>
    </li>
    <li>
      <button @click="settingsDropdown = !settingsDropdown" type="button"
        :class="router.currentRoute.value.name === 'admin-categories' ? 'sidebar-menu-active' : 'sidebar-menu'"
        class="flex items-center w-full sidebar-menu transition duration-200 ease-in-out group"
        aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
        <i class="ri-settings-3-fill mr-3"></i>

        <span class="flex-1 text-left whitespace-nowrap">Settings</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
    <li>
      <router-link :to="{ name: 'admin-categories' }" class="drop-menu"
        :class="router.currentRoute.value.name === 'admin-categories' ? 'text-orange-500' : ''"><i
          class="ri-circle-fill text-[8px] mr-2"></i> Categories</router-link>
    </li>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()

const contactsDropdown = ref(false);
const productsDropdown = ref(false);
const settingsDropdown = ref(false);
</script>
<style lang="">
</style>