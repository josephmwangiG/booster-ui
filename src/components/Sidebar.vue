<template>
  <ul class="p-2 pb-10 flex-1 overflow-y-auto  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-orange-400">
    <li class="">
      <router-link :to="{ name: 'dashboard' }" :class="router.currentRoute.value.name === 'dashboard'
        ? 'sidebar-menu-active'
        : 'sidebar-menu'
        "><i class="ri-speed-up-line mr-2"></i> Dashboard</router-link>
    </li>

    <div v-if="subscriptions.includes('Properties')">
      <li class="p-3 pt-4 pb-2 uppercase text-xs font-semibold text-gray-500">
        Property Management
      </li>
      <li class="">
        <router-link :to="{ name: 'properties' }" :class="router.currentRoute.value.path.startsWith('/properties')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-building-line mr-2"></i> Properties</router-link>
      </li>

      <li class="">
        <router-link :to="{ name: 'tenants' }" :class="router.currentRoute.value.path.startsWith('/tenants')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-contacts-fill mr-2"></i> Tenants</router-link>
      </li>

      <li class="">
        <router-link :to="{ name: 'tenant-bills' }" :class="router.currentRoute.value.path.startsWith('/tenant-bills')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-bill-line mr-2"></i> Tenant Bills</router-link>
      </li>
      <li class="">
        <router-link :to="{ name: 'tenant-bill-payments' }" :class="router.currentRoute.value.path.startsWith('/tenant-bill-payments')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-wallet-3-line mr-2"></i> Tenant Payments</router-link>
      </li>

      <li class="">
        <router-link :to="{ name: 'utilities' }" :class="router.currentRoute.value.path.startsWith('/utilities')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-water-percent-line mr-2"></i> Utilities</router-link>
      </li>

    </div>

    <div v-if="subscriptions.includes('Water Management')">
      <li class="p-3 pt-4 pb-2 uppercase text-xs font-semibold text-gray-500">
        Water Management
      </li>


      <li class="">
        <router-link :to="{ name: 'water-clients' }" :class="router.currentRoute.value.path.startsWith('/water-clients')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-group-line mr-2"></i> Water Clients</router-link>
      </li>

      <li class="">
        <router-link :to="{ name: 'water-client-bills' }" :class="router.currentRoute.value.path.startsWith('/water-client-bills')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-refund-2-line mr-2"></i> Client Bills</router-link>
      </li>
      <li class="">
        <router-link :to="{ name: 'water-client-bill-payments' }" :class="router.currentRoute.value.path.startsWith('/water-client-bill-payments')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-wallet-line mr-2"></i> Client Payments</router-link>
      </li>

      <li class="">
        <router-link :to="{ name: 'meter-readings' }" :class="router.currentRoute.value.path.startsWith('/meter-readings')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-dashboard-3-line mr-2"></i> Meter Readings</router-link>
      </li>

      <li>
        <button @click="collectionsDropdown = !collectionsDropdown" type="button" :class="router.currentRoute.value.path.startsWith('/collections')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          " class="flex items-center w-full transition duration-200 ease-in-out group" aria-controls="dropdown-example"
          data-collapse-toggle="dropdown-example">
          <i class="ri-coins-line mr-3"></i>
          <span class="flex-1 text-left whitespace-nowrap">Money Collections</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <ul id="dropdown-example" class="pb-2" :class="collectionsDropdown ? 'show' : 'hidden'">
          <li>
            <router-link :to="{ name: 'money-collections' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'money-collections'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i>
              Collections</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'pending-money-collections' }" class="drop-menu pb-3" :class="router.currentRoute.value.name === 'pending-money-collections'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Pending</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'collections-payments' }" class="drop-menu" :class="router.currentRoute.value.name === 'collections-payments'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Payments</router-link>
          </li>
        </ul>
      </li>


      <li>
        <button @click="deliveriesDropdown = !deliveriesDropdown" type="button" :class="router.currentRoute.value.path.startsWith('/water-deliveries')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          " class="flex items-center w-full transition duration-200 ease-in-out group" aria-controls="dropdown-example"
          data-collapse-toggle="dropdown-example">
          <i class="ri-caravan-fill mr-3"></i>
          <span class="flex-1 text-left whitespace-nowrap">Water Deliveries</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <ul id="dropdown-example" class="pb-2" :class="deliveriesDropdown ? 'show' : 'hidden'">
          <li>
            <router-link :to="{ name: 'vehicles' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'vehicles'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i>
              Vehicles</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'water-delivery-records' }" class="drop-menu pb-3" :class="router.currentRoute.value.name === 'water-delivery-records'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Deliveries</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'water-delivery-payments' }" class="drop-menu" :class="router.currentRoute.value.name === 'water-delivery-payments'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Payments</router-link>
          </li>
        </ul>
      </li>

    </div>


    <div v-if="subscriptions.includes('Inventory')">

      <li class="p-3 pt-3 pb-2 uppercase text-xs font-semibold text-gray-500">
        Inventory Management
      </li>

      <li class="">
        <router-link :to="{ name: 'stores' }" :class="router.currentRoute.value.path.startsWith('/stores')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-store-2-fill mr-2"></i> Stores</router-link>
      </li>

      <li>
        <button @click="productsDropdown = !productsDropdown" type="button" :class="router.currentRoute.value.path.startsWith('/products')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          " class="flex items-center w-full transition duration-200 ease-in-out group" aria-controls="dropdown-example"
          data-collapse-toggle="dropdown-example">
          <i class="ri-shopping-basket-2-line mr-3"></i>
          <span class="flex-1 text-left whitespace-nowrap">Products</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <ul id="dropdown-example" class="pb-2" :class="productsDropdown ? 'show' : 'hidden'">
          <li>
            <router-link :to="{ name: 'products' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'products'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i>
              Products</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'brands' }" class="drop-menu" :class="router.currentRoute.value.name === 'brands'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Brands</router-link>
          </li>
        </ul>
      </li>
      <li>
        <button @click="inventoriesDropdown = !inventoriesDropdown" type="button" :class="router.currentRoute.value.path.startsWith('/inventories')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          " class="flex items-center w-full transition duration-200 ease-in-out group" aria-controls="dropdown-example"
          data-collapse-toggle="dropdown-example">
          <i class="ri-shopping-basket-2-line mr-3"></i>
          <span class="flex-1 text-left whitespace-nowrap">Inventory</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <ul id="dropdown-example" class="pb-2" :class="inventoriesDropdown ? 'show' : 'hidden'">
          <li>
            <router-link :to="{ name: 'inventories' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'inventories'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Stock</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'stock-adjustment' }" class="drop-menu pb-4" :class="router.currentRoute.value.name === 'stock-adjustment'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Stock
              Adjustment</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'stock-movement' }" class="drop-menu" :class="router.currentRoute.value.name === 'stock-movement'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Stock
              Movement</router-link>
          </li>
        </ul>
      </li>
      <li>
        <button @click="contactsDropdown = !contactsDropdown" type="button" :class="router.currentRoute.value.path.startsWith('/contacts')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          " class="flex items-center w-full sideb ar-menu transition duration-200 ease-in-out group"
          aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
          <i class="ri-contacts-fill mr-3"></i>
          <span class="flex-1 text-left whitespace-nowrap">Contacts</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <ul id="dropdown-example" class="pb-2" :class="contactsDropdown ? 'show' : 'hidden'">
          <li>
            <router-link :to="{ name: 'suppliers' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'suppliers'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i>
              Suppliers</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'customers' }" class="drop-menu pb-4" :class="router.currentRoute.value.name === 'customers'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i>
              Customers</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'contact-groups' }" class="drop-menu" :class="router.currentRoute.value.name === 'contact-groups'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Contact
              Groups</router-link>
          </li>
        </ul>
      </li>
      <li>
        <button @click="purchasesDropdown = !purchasesDropdown" type="button" :class="router.currentRoute.value.path.startsWith('/purchases')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          " class="flex items-center w-full sidebar-menu transition duration-200 ease-in-out group"
          aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
          <i class="ri-wallet-2-line mr-3"></i>
          <span class="flex-1 text-left whitespace-nowrap">Purchases</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <ul id="dropdown-example" class="pb-2" :class="purchasesDropdown ? 'show' : 'hidden'">
          <li>
            <router-link :to="{ name: 'purchases' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'purchases'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i>
              Purchases</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'purchase-orders' }" class="drop-menu" :class="router.currentRoute.value.name === 'purchase-orders'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Purchase
              Orders</router-link>
          </li>
        </ul>
      </li>
      <li>
        <button @click="salesDropdown = !salesDropdown" type="button" :class="router.currentRoute.value.path.startsWith('/sales')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          " class="flex items-center w-full sidebar-menu transition duration-200 ease-in-out group"
          aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
          <i class="ri-shopping-cart-2-fill mr-3"></i>
          <span class="flex-1 text-left whitespace-nowrap">Sales</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <ul id="dropdown-example" class="pb-2" :class="salesDropdown ? 'show' : 'hidden'">
          <li>
            <router-link :to="{ name: 'sales' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'sales'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Sales</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'orders' }" class="drop-menu" :class="router.currentRoute.value.name === 'orders'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Sales
              Orders</router-link>
          </li>
        </ul>
      </li>

      <li>
        <button @click="financeDropdown = !financeDropdown" type="button" :class="router.currentRoute.value.path.startsWith('/finance')
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          " class="flex items-center w-full sidebar-menu transition duration-200 ease-in-out group"
          aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
          <i class="ri-money-dollar-circle-line mr-3"></i>
          <span class="flex-1 text-left whitespace-nowrap">Finance</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <ul id="dropdown-example" class="pb-2" :class="financeDropdown ? 'show' : 'hidden'">
          <li>
            <router-link :to="{ name: 'invoices' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'invoices'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i>
              Invoices</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'payments' }" class="drop-menu" :class="router.currentRoute.value.name === 'payments'
              ? 'text-orange-500'
              : ''
              "><i class="ri-circle-fill text-[8px] mr-2"></i> Payments
            </router-link>
          </li>
        </ul>
      </li>

      <li class="">
        <router-link :to="{ name: 'products' }" :class="router.currentRoute.value.name === 'reports'
          ? 'sidebar-menu-active'
          : 'sidebar-menu'
          "><i class="ri-bar-chart-fill mr-2"></i> Reports</router-link>
      </li>
    </div>
    <li class="p-3 pt-3 pb-2 uppercase text-xs font-semibold text-gray-500">
      Settings
    </li>
    <li class="">
      <router-link :to="{ name: 'organization' }" :class="router.currentRoute.value.name === 'organization'
        ? 'sidebar-menu-active'
        : 'sidebar-menu'
        "><i class="ri-building-2-line mr-2"></i> Organization</router-link>
    </li>
    <li>
      <button @click="settingsDropdown = !settingsDropdown" type="button" :class="router.currentRoute.value.path.startsWith('/settings')
        ? 'sidebar-menu-active'
        : 'sidebar-menu'
        " class="flex items-center w-full sidebar-menu transition duration-200 ease-in-out group"
        aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
        <i class="ri-settings-3-fill mr-3"></i>

        <span class="flex-1 text-left whitespace-nowrap">Settings</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      <ul id="dropdown-example" :class="settingsDropdown ? 'show' : 'hidden'" class="pb-2">
        <li v-if="subscriptions.includes('Water Management')">
          <router-link :to="{ name: 'drivers' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'drivers'
            ? 'text-orange-500'
            : ''
            "><i class="ri-circle-fill text-[8px] mr-2"></i> Drivers</router-link>
        </li>
        <li v-if="subscriptions.includes('Water Management')">
          <router-link :to="{ name: 'water-meters' }" class="drop-menu pb-3" :class="router.currentRoute.value.name == 'water-meters'
            ? 'text-orange-500'
            : ''
            "><i class="ri-circle-fill text-[8px] mr-2"></i> Water Meters</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'payment-methods' }" class="drop-menu pb-3" :class="router.currentRoute.value.name === 'payment-methods'
            ? 'text-orange-500'
            : ''
            "><i class="ri-circle-fill text-[8px] mr-2"></i> Payment Methods</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'profile' }" class="drop-menu py-3" :class="router.currentRoute.value.name === 'profile'
            ? 'text-orange-500'
            : ''
            "><i class="ri-circle-fill text-[8px] mr-2"></i> Profile</router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useAuthStore();

const subscriptions = computed(() => {
  const org = store.user?.organization
  if (!org || !Array.isArray(org.subscriptions)) return []
  const subs = org.subscriptions
    .filter((sub: any) => sub && sub.is_active)
    .map((sub: any) => sub?.module?.name || sub?.plan_name)
    .filter((name: any) => typeof name === 'string' && name.length > 0)
  return subs
})

const contactsDropdown = ref(false);
const productsDropdown = ref(false);
const settingsDropdown = ref(false);
const salesDropdown = ref(false);
const purchasesDropdown = ref(false);
const financeDropdown = ref(false);
const inventoriesDropdown = ref(false);
const deliveriesDropdown = ref(false);
const collectionsDropdown = ref(false);
</script>
<style lang=""></style>
