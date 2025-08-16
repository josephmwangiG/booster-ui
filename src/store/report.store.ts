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
        const res = await api.get("/api/reports/vendor/dashboard");
        this.dashboardReports = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async getAdminDashboardReports() {
      try {
        const res = await api.get("/api/reports/admin/dashboard");
        this.dashboardReports = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async getPropertiesDashboardReports() {
      try {
        const res = await api.get("/api/reports/properties/dashboard");
        this.propertiesDashboardReports = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async getWMDashboardReports() {
      try {
        const res = await api.get("/api/reports/wm/dashboard");
        this.wmDashboardReports = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
  },
});
