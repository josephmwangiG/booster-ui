import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    name: "login",
    path: "/login",
    component: () => import("@/components/auth/Login.vue"),
    meta: {
      require_auth: false,
      title: "Login",
    },
  },
  {
    name: "forgot-password",
    path: "/forgot-password",
    component: () => import("@/components/auth/ForgotPassword.vue"),
    meta: {
      require_auth: false,
      title: "Forgot Password",
    },
  },
  {
    name: "reset-password",
    path: "/reset-password/:token",
    component: () => import("@/components/auth/ResetPassword.vue"),
    meta: {
      require_auth: false,
      title: "Reset Password",
    },
  },
  {
    name: "verify-account",
    path: "/verify-account/:token",
    component: () => import("@/components/auth/VerifyAccount.vue"),
    meta: {
      require_auth: false,
      title: "Reset Password",
    },
  },
  {
    name: "register",
    path: "/register",
    component: () => import("@/components/auth/Register.vue"),
    meta: {
      require_auth: false,
      title: "Register",
    },
  },
  {
    name: "home",
    path: "/",
    component: () => import("@/components/Index.vue"),
    children: [
      {
        name: "dashboard",
        path: "/dashboard",
        alias: "/",
        component: () => import("@/components/dashboard/Dashboard.vue"),
        meta: {
          require_auth: true,
          title: "Dashboard",
        },
      },
      // INVENTORY MODULE
      {
        name: "profile",
        path: "/settings/profile",
        component: () => import("@/components/settings/Profile.vue"),
        meta: {
          require_auth: true,
          title: "Profile",
        },
      },
      {
        name: "organization",
        path: "/settings/organization",
        component: () => import("@/components/settings/Organization.vue"),
        meta: {
          require_auth: true,
          title: "Organization",
        },
      },
      {
        name: "payment-methods",
        path: "/settings/payment-methods",
        component: () =>
          import("@/components/settings/payment-methods/PaymentMethods.vue"),
        meta: {
          require_auth: true,
          title: "Payment Methods",
        },
      },
      {
        name: "drivers",
        path: "/settings/drivers",
        component: () => import("@/components/settings/drivers/Drivers.vue"),
        meta: {
          require_auth: true,
          title: "Drivers",
        },
      },
      {
        name: "invoices",
        path: "finance/invoices",
        component: () => import("@/components/finance/Invoices.vue"),
        meta: {
          require_auth: true,
          title: "Invoices",
        },
      },
      {
        name: "invoice-details",
        path: "finance/invoices/:id",
        component: () => import("@/components/finance/Invoice.vue"),
        meta: {
          require_auth: true,
          title: "Invoice Details",
        },
      },
      {
        name: "payments",
        path: "finance/payments",
        component: () => import("@/components/finance/Payments.vue"),
        meta: {
          require_auth: true,
          title: "Payments",
        },
      },
      // PROPERTIES MODULE
      {
        name: "properties",
        path: "/properties",
        component: () =>
          import("@/components/modules/properties/Properties.vue"),
        meta: {
          require_auth: true,
          title: "Properties",
        },
      },
      {
        name: "property",
        path: "/properties/:id",
        component: () => import("@/components/modules/properties/Property.vue"),
        meta: {
          require_auth: true,
          title: "Property",
        },
      },
      {
        name: "tenants",
        path: "/tenants",
        component: () => import("@/components/modules/tenants/Tenants.vue"),
        meta: {
          require_auth: true,
          title: "Tenants",
        },
      },
      {
        name: "tenancies",
        path: "/tenants/:id/tenancies",
        component: () => import("@/components/modules/tenants/Tenancies.vue"),
        meta: {
          require_auth: true,
          title: "Tenancies",
        },
      },
      {
        name: "single-tenant-bills",
        path: "/tenants/:id/bills",
        component: () => import("@/components/modules/tenants/TenantBills.vue"),
        meta: {
          require_auth: true,
          title: "Tenant Bills",
        },
      },
      {
        name: "utilities",
        path: "/utilities",
        component: () => import("@/components/modules/utilities/Utilities.vue"),
        meta: {
          require_auth: true,
          title: "Utilities",
        },
      },
      {
        name: "tenant-bills",
        path: "/tenant-bills",
        component: () =>
          import("@/components/modules/tenant-bills/TenantBills.vue"),
        meta: {
          require_auth: true,
          title: "Tenant Bills",
        },
      },
      {
        name: "tenant-bill",
        path: "/tenant-bills/:id",
        component: () =>
          import("@/components/modules/tenant-bills/TenantBill.vue"),
        meta: {
          require_auth: true,
          title: "Tenant Bill",
        },
      },
      {
        name: "tenant-bill-payments",
        path: "/tenant-bill-payments",
        component: () =>
          import(
            "@/components/modules/tenant-bill-payments/TenantBillPayments.vue"
          ),
        meta: {
          require_auth: true,
          title: "Tenant Bill Payments",
        },
      },
      {
        name: "water-meters",
        path: "/water-meters",
        component: () =>
          import("@/components/modules/wm/water-meters/WaterMeters.vue"),
        meta: {
          require_auth: true,
          title: "Water Meters",
        },
      },
      {
        name: "meter-readings",
        path: "/meter-readings",
        component: () =>
          import("@/components/modules/wm/meter-readings/MeterReadings.vue"),
        meta: {
          require_auth: true,
          title: "Meter Readings",
        },
      },
      {
        name: "water-clients",
        path: "/water-clients",
        component: () =>
          import("@/components/modules/wm/clients/WaterClients.vue"),
        meta: {
          require_auth: true,
          title: "Water Clients",
        },
      },
      {
        name: "water-client",
        path: "/water-clients/:id",
        component: () =>
          import("@/components/modules/wm/clients/WaterClient.vue"),
        meta: {
          require_auth: true,
          title: "Water Client",
        },
      },
      {
        name: "water-client-bills",
        path: "/water-client-bills",
        component: () =>
          import(
            "@/components/modules/wm/water-client-bills/WaterClientBills.vue"
          ),
        meta: {
          require_auth: true,
          title: "Water Client Bills",
        },
      },
      {
        name: "water-client-bill-payments",
        path: "/water-client-bill-payments",
        component: () =>
          import(
            "@/components/modules/wm/water-client-bill-payments/WaterClientBillPayments.vue"
          ),
        meta: {
          require_auth: true,
          title: "Client Water Bill Payments",
        },
      },
      {
        name: "vehicles",
        path: "/water-deliveries/vehicles",
        component: () =>
          import("@/components/modules/wm/vehicles/Vehicles.vue"),
        meta: {
          require_auth: true,
          title: "Vehicles",
        },
      },
      {
        name: "water-delivery-records",
        path: "/water-deliveries/records",
        component: () =>
          import("@/components/modules/wm/deliveries/WaterDeliveries.vue"),
        meta: {
          require_auth: true,
          title: "Water Deliveries",
        },
      },
      {
        name: "money-collections",
        path: "/collections/money-collections",
        component: () =>
          import("@/components/modules/wm/collections/MoneyCollections.vue"),
        meta: {
          require_auth: true,
          title: "Money Collections",
        },
      },
      {
        name: "pending-money-collections",
        path: "/collections/pending-money-collections",
        component: () =>
          import("@/components/modules/wm/pending-collections/PendingMoneyCollections.vue"),
        meta: {
          require_auth: true,
          title: "Pending Money Collections",
        },
      },
      {
        name: "collections-payments",
        path: "/collections/collections-payments",
        component: () =>
          import("@/components/modules/wm/collections-payments/CollectionPayments.vue"),
        meta: {
          require_auth: true,
          title: "Collection Payments",
        },
      },
      {
        name: "water-delivery-payments",
        path: "/water-deliveries/payments",
        component: () =>
          import(
            "@/components/modules/wm/water-delivery-payments/WaterDeliveryPayments.vue"
          ),
        meta: {
          require_auth: true,
          title: "Water Delivery Payments",
        },
      },
    ],
  },
  {
    name: "admin-home",
    path: "/app/adm",
    component: () => import("@/components/admin/Index.vue"),
    meta: {
      require_auth: true,
      isAdmin: true,
    },
    children: [
      {
        name: "admin-dashboard",
        path: "dashboard",
        alias: "/app/adm",
        component: () => import("@/components/admin/dashboard/Dashboard.vue"),
        meta: {
          require_auth: true,
          title: "Dashboard",
        },
      },
      {
        name: "admin-profile",
        path: "profile",
        component: () => import("@/components/admin/profile/Profile.vue"),
        meta: {
          require_auth: true,
          title: "Profile",
        },
      },
      {
        name: "admin-stores",
        path: "stores",
        component: () => import("@/components/admin/stores/Stores.vue"),
        meta: {
          require_auth: true,
          title: "Stores",
        },
      },
      {
        name: "admin-store",
        path: "stores/:id",
        component: () => import("@/components/admin/stores/Store.vue"),
        meta: {
          require_auth: true,
          title: "Store",
        },
      },
      {
        name: "admin-products",
        path: "products",
        component: () => import("@/components/admin/products/Products.vue"),
        meta: {
          require_auth: true,
          title: "Products",
        },
      },
      {
        name: "admin-product",
        path: "products/:action/:id",
        component: () => import("@/components/admin/products/Product.vue"),
        meta: {
          require_auth: true,
          title: "Product",
        },
      },
      {
        name: "admin-users",
        path: "users",
        component: () => import("@/components/admin/users/Users.vue"),
        meta: {
          require_auth: true,
          title: "users",
        },
      },
      {
        name: "admin-organizations",
        path: "organizations",
        component: () =>
          import("@/components/admin/organizations/Organizations.vue"),
        meta: {
          require_auth: true,
          title: "organizations",
        },
      },
      {
        name: "admin-organization",
        path: "organizations/:id",
        component: () =>
          import("@/components/admin/organizations/Organization.vue"),
        meta: {
          require_auth: true,
          title: "organization",
        },
      },
      {
        name: "admin-categories",
        path: "categories",
        component: () => import("@/components/admin/categories/Categories.vue"),
        meta: {
          require_auth: true,
          title: "categories",
        },
      },
      {
        name: "admin-category",
        path: "categories/:id",
        component: () => import("@/components/admin/categories/Category.vue"),
        meta: {
          require_auth: true,
          title: "categories",
        },
      },

      {
        name: "admin-earnings",
        path: "earnings",
        component: () => import("@/components/admin/earnings/Earnings.vue"),
        meta: {
          require_auth: true,
          title: "Earnings",
        },
      },
      {
        name: "admin-orders",
        path: "orders",
        component: () => import("@/components/admin/orders/Orders.vue"),
        meta: {
          require_auth: true,
          title: "Orders",
        },
      },
      {
        name: "admin-order",
        path: "order",
        component: () => import("@/components/admin/orders/Order.vue"),
        meta: {
          require_auth: true,
          title: "Orders",
        },
      },
    ],
  },
];

export const router: any = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to: any, _from: any) => {
  let title = "Home";
  if (to.meta.title) {
    title = to.meta.title;
  }
  document.title = title;

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.type === "admin";

  if (to.matched.some((record) => record.meta.require_auth)) {
    if (!token) {
      return { name: "login", query: { redirect: to.fullPath } };
    }

    const requiresAdmin = to.matched.some((record) => record.meta.isAdmin);

    if (requiresAdmin && !isAdmin) {
      return { name: "dashboard" };
    }

    if (to.name === "dashboard" && isAdmin) {
      return { name: "admin-dashboard" };
    }
  } else {
    // Public routes
    if (token && (to.name === 'login' || to.name === 'register')) {
      return { name: isAdmin ? 'admin-dashboard' : 'dashboard' };
    }
  }
});
