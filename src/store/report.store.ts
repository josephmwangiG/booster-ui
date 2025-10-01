import api from "@/api";
import { defineStore } from "pinia";

export type DashboardReport = {
  total_orders: number;
  total_sales: number;
  customers: number;
  suppliers: number;
  closed_orders: number;
  closed_sales: number;
  orders: any[];
  total_users: number;
  total_organizations: number;
  total_stores: number;
  total_products: number;
  total_properties: number;
};

export const useReportsStore = defineStore("reports", {
  state: () => ({
    dashboardReports: {} as DashboardReport,
    propertiesDashboardReports: {} as any,
    wmDashboardReports: {} as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getVendorDashboardReports() {
      try {
        const res = await api.get("/reports/vendor/dashboard");
        this.dashboardReports = res.data;
        return res.data.orders;
      } catch (error: any) {
        console.error('Failed to fetch vendor dashboard reports:', error);
        // Set default values to prevent errors
        this.dashboardReports = {
          total_orders: 0,
          total_sales: 0,
          customers: 0,
          suppliers: 0,
          closed_orders: 0,
          closed_sales: 0,
          orders: [],
          total_users: 0,
          total_organizations: 0,
          total_stores: 0,
          total_products: 0,
          total_properties: 0
        };
        return error.response;
      }
    },
    async getAdminDashboardReports() {
      try {
        const res = await api.get("/reports/admin/dashboard");
        this.dashboardReports = res.data;
        return res;
      } catch (error: any) {
        console.error('Failed to fetch admin dashboard reports:', error);
        // Set default values to prevent errors
        this.dashboardReports = {
          total_orders: 0,
          total_sales: 0,
          customers: 0,
          suppliers: 0,
          closed_orders: 0,
          closed_sales: 0,
          orders: [],
          total_users: 0,
          total_organizations: 0,
          total_stores: 0,
          total_products: 0,
          total_properties: 0
        };
        return error.response;
      }
    },
    async getPropertiesDashboardReports() {
      try {
        const res = await api.get("/reports/properties/dashboard");
        this.propertiesDashboardReports = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
        async getWMDashboardReports() {
      try {
        const res = await api.get("/reports/wm/dashboard");
        this.wmDashboardReports = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    }
  }
});
