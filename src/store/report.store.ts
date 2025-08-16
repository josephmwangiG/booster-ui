import axios from "axios";
import { defineStore } from "pinia";

export type DashboardReport = {
  total_orders: number;
  total_sales: number;
  customers: number;
  suppliers: number;
  closed_orders: number;
  closed_sales: number;
  orders: any[];
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
        const res = await axios.get("/reports/vendor/dashboard", this.headers);
        this.dashboardReports = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async getPropertiesDashboardReports() {
      try {
        const res = await axios.get("/reports/properties/dashboard", this.headers);
        this.propertiesDashboardReports = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async getWMDashboardReports() {
      try {
        const res = await axios.get("/reports/wm/dashboard", this.headers);
        this.wmDashboardReports = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
  },
});
