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
        name: "notifications",
        path: "/settings/notifications",
        component: () => import("@/components/settings/notifications/Notifications.vue"),
        meta: {
          require_auth: true,
          title: "Notifications",
        },
      },
      {
        name: "notification-details",
        path: "/settings/notifications/:id",
        component: () => import("@/components/settings/notifications/NotificationDetails.vue"),
        meta: {
          require_auth: true,
          title: "Notification Details",
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
        name: "generate-tenant-bills",
        path: "/generate-tenant-bills",
        component: () => import("@/components/modules/tenant-bills/GenerateTenantBillsPage.vue"),
        meta: {
          require_auth: true,
          title: "Generate Tenant Bills",
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
        path: "/settings/water-meters",
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

  if (to.matched.some((record: any) => record.meta.require_auth)) {
    if (!token) {
      return { name: "login", query: { redirect: to.fullPath } };
    }

    const requiresAdmin = to.matched.some((record: any) => record.meta.isAdmin);

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
