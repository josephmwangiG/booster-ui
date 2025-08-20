<template>
  <div class="p-4">
    <ul class="space-y-2">
      <li>
        <router-link :to="{ name: 'dashboard' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'dashboard' }">
          <i class="ri-speed-up-line mr-3"></i>
          <span>Dashboard</span>
        </router-link>
      </li>

      <li v-if="subscriptions.includes('Properties')">
        <h3 class="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">Property Management</h3>
        <ul class="space-y-2">
          <li>
            <router-link :to="{ name: 'properties' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/properties') }">
              <i class="ri-building-line mr-3"></i>
              <span>Properties</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'tenants' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/tenants') }">
              <i class="ri-contacts-fill mr-3"></i>
              <span>Tenants</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'tenant-bills' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/tenant-bills') }">
              <i class="ri-bill-line mr-3"></i>
              <span>Tenant Bills</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'tenant-bill-payments' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/tenant-bill-payments') }">
              <i class="ri-wallet-3-line mr-3"></i>
              <span>Tenant Payments</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'utilities' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/utilities') }">
              <i class="ri-water-percent-line mr-3"></i>
              <span>Utilities</span>
            </router-link>
          </li>
        </ul>
      </li>

      <li v-if="subscriptions.includes('Water Management')">
        <h3 class="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">Water Management</h3>
        <ul class="space-y-2">
          <li>
            <router-link :to="{ name: 'water-clients' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/water-clients') }">
              <i class="ri-group-line mr-3"></i>
              <span>Water Clients</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'water-client-bills' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/water-client-bills') }">
              <i class="ri-refund-2-line mr-3"></i>
              <span>Client Bills</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'water-client-bill-payments' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/water-client-bill-payments') }">
              <i class="ri-wallet-line mr-3"></i>
              <span>Client Payments</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'meter-readings' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/meter-readings') }">
              <i class="ri-dashboard-3-line mr-3"></i>
              <span>Meter Readings</span>
            </router-link>
          </li>
          <li>
            <button @click="toggleDropdown('collections')" class="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
              <i class="ri-coins-line mr-3"></i>
              <span class="flex-1 text-left">Money Collections</span>
              <i class="ri-arrow-down-s-line transform" :class="{ 'rotate-180': dropdowns.collections }"></i>
            </button>
            <ul v-if="dropdowns.collections" class="pl-8 space-y-2">
              <li>
                <router-link :to="{ name: 'money-collections' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'money-collections' }">Collections</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'pending-money-collections' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'pending-money-collections' }">Pending</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'collections-payments' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'collections-payments' }">Payments</router-link>
              </li>
            </ul>
          </li>
          <li>
            <button @click="toggleDropdown('deliveries')" class="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
              <i class="ri-caravan-fill mr-3"></i>
              <span class="flex-1 text-left">Water Deliveries</span>
              <i class="ri-arrow-down-s-line transform" :class="{ 'rotate-180': dropdowns.deliveries }"></i>
            </button>
            <ul v-if="dropdowns.deliveries" class="pl-8 space-y-2">
              <li>
                <router-link :to="{ name: 'vehicles' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'vehicles' }">Vehicles</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'water-delivery-records' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'water-delivery-records' }">Deliveries</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'water-delivery-payments' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'water-delivery-payments' }">Payments</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <li v-if="subscriptions.includes('Inventory')">
        <h3 class="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">Inventory Management</h3>
        <ul class="space-y-2">
          <li>
            <router-link :to="{ name: 'stores' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.path.startsWith('/stores') }">
              <i class="ri-store-2-fill mr-3"></i>
              <span>Stores</span>
            </router-link>
          </li>
          <li>
            <button @click="toggleDropdown('products')" class="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
              <i class="ri-shopping-basket-2-line mr-3"></i>
              <span class="flex-1 text-left">Products</span>
              <i class="ri-arrow-down-s-line transform" :class="{ 'rotate-180': dropdowns.products }"></i>
            </button>
            <ul v-if="dropdowns.products" class="pl-8 space-y-2">
              <li>
                <router-link :to="{ name: 'products' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'products' }">Products</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'brands' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'brands' }">Brands</router-link>
              </li>
            </ul>
          </li>
          <li>
            <button @click="toggleDropdown('inventories')" class="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
              <i class="ri-shopping-basket-2-line mr-3"></i>
              <span class="flex-1 text-left">Inventory</span>
              <i class="ri-arrow-down-s-line transform" :class="{ 'rotate-180': dropdowns.inventories }"></i>
            </button>
            <ul v-if="dropdowns.inventories" class="pl-8 space-y-2">
              <li>
                <router-link :to="{ name: 'inventories' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'inventories' }">Stock</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'stock-adjustment' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'stock-adjustment' }">Stock Adjustment</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'stock-movement' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'stock-movement' }">Stock Movement</router-link>
              </li>
            </ul>
          </li>
          <li>
            <button @click="toggleDropdown('contacts')" class="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
              <i class="ri-contacts-fill mr-3"></i>
              <span class="flex-1 text-left">Contacts</span>
              <i class="ri-arrow-down-s-line transform" :class="{ 'rotate-180': dropdowns.contacts }"></i>
            </button>
            <ul v-if="dropdowns.contacts" class="pl-8 space-y-2">
              <li>
                <router-link :to="{ name: 'suppliers' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'suppliers' }">Suppliers</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'customers' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'customers' }">Customers</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'contact-groups' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'contact-groups' }">Contact Groups</router-link>
              </li>
            </ul>
          </li>
          <li>
            <button @click="toggleDropdown('purchases')" class="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
              <i class="ri-wallet-2-line mr-3"></i>
              <span class="flex-1 text-left">Purchases</span>
              <i class="ri-arrow-down-s-line transform" :class="{ 'rotate-180': dropdowns.purchases }"></i>
            </button>
            <ul v-if="dropdowns.purchases" class="pl-8 space-y-2">
              <li>
                <router-link :to="{ name: 'purchases' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'purchases' }">Purchases</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'purchase-orders' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'purchase-orders' }">Purchase Orders</router-link>
              </li>
            </ul>
          </li>
          <li>
            <button @click="toggleDropdown('sales')" class="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
              <i class="ri-shopping-cart-2-fill mr-3"></i>
              <span class="flex-1 text-left">Sales</span>
              <i class="ri-arrow-down-s-line transform" :class="{ 'rotate-180': dropdowns.sales }"></i>
            </button>
            <ul v-if="dropdowns.sales" class="pl-8 space-y-2">
              <li>
                <router-link :to="{ name: 'sales' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'sales' }">Sales</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'orders' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'orders' }">Sales Orders</router-link>
              </li>
            </ul>
          </li>
          <li>
            <button @click="toggleDropdown('finance')" class="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
              <i class="ri-money-dollar-circle-line mr-3"></i>
              <span class="flex-1 text-left">Finance</span>
              <i class="ri-arrow-down-s-line transform" :class="{ 'rotate-180': dropdowns.finance }"></i>
            </button>
            <ul v-if="dropdowns.finance" class="pl-8 space-y-2">
              <li>
                <router-link :to="{ name: 'invoices' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'invoices' }">Invoices</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'payments' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'payments' }">Payments</router-link>
              </li>
            </ul>
          </li>
          <li>
            <router-link :to="{ name: 'reports' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'reports' }">
              <i class="ri-bar-chart-fill mr-3"></i>
              <span>Reports</span>
            </router-link>
          </li>
        </ul>
      </li>

      <li>
        <h3 class="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">Settings</h3>
        <ul class="space-y-2">
          <li>
            <router-link :to="{ name: 'organization' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'organization' }">
              <i class="ri-building-2-line mr-3"></i>
              <span>Organization</span>
            </router-link>
          </li>
          <li>
            <button @click="toggleDropdown('settings')" class="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
              <i class="ri-settings-3-fill mr-3"></i>
              <span class="flex-1 text-left">Settings</span>
              <i class="ri-arrow-down-s-line transform" :class="{ 'rotate-180': dropdowns.settings }"></i>
            </button>
            <ul v-if="dropdowns.settings" class="pl-8 space-y-2">
              <li v-if="subscriptions.includes('Water Management')">
                <router-link :to="{ name: 'drivers' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'drivers' }">Drivers</router-link>
              </li>
              <li v-if="subscriptions.includes('Water Management')">
                <router-link :to="{ name: 'water-meters' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'water-meters' }">Water Meters</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'payment-methods' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'payment-methods' }">Payment Methods</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'profile' }" class="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700" :class="{ 'bg-gray-700': $route.name === 'profile' }">Profile</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { computed, reactive } from "vue";

const store = useAuthStore();

const subscriptions = computed(() => {
  const org = store.user?.organization;
  if (!org || !Array.isArray(org.subscriptions)) return [];
  return org.subscriptions
    .filter((sub: any) => sub && sub.is_active)
    .map((sub: any) => sub?.module?.name || sub?.plan_name)
    .filter((name: any) => typeof name === 'string' && name.length > 0);
});

const dropdowns = reactive({
  collections: false,
  deliveries: false,
  products: false,
  inventories: false,
  contacts: false,
  purchases: false,
  sales: false,
  finance: false,
  settings: false,
});

const toggleDropdown = (name: keyof typeof dropdowns) => {
  dropdowns[name] = !dropdowns[name];
};
</script>