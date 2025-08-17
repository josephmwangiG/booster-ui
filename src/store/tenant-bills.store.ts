import { TenantBillPaymentForm } from "@/type/tenant.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useTenantBillsStore = defineStore("tenant-bills", {
  state: () => ({
    tenantBills: [] as any[],
    tenantBillItems: [] as any[],
    tenantBillPayments: [] as any[],
    units: [] as any[],
    tenantBill: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getTenantBills(params: any) {
      const res = await axios.get("/api/tenant-bills", {
        ...this.headers,
        params: { ...params },
      });
      this.tenantBills = res.data;
    },
    async getBillItems() {
      const res = await axios.get("/tenant-bill-items", {
        ...this.headers,
      });
      this.tenantBillItems = res.data;
    },
    async getTenantBillPayments() {
      const res = await axios.get("/api/tenant-payments", {
        ...this.headers,
      });
      this.tenantBillPayments = res.data;
    },

    async generateTenantBills(data: any) {
      const res = await axios.post("/api/tenant-bills", data, this.headers);

      this.tenantBills = res.data;

      return res;
    },
    async updateTenantBillItem(data: any) {
      const res = await axios.post(
        "/api/tenant-bills/items/update/" + data.id,
        data,
        this.headers
      );

      this.tenantBill = res.data;

      return res;
    },

    async createTenantBillPayment(data: TenantBillPaymentForm) {
      const res = await axios.post("/api/tenant-payments", data, {
        ...this.headers,
      });
      this.tenantBillPayments.unshift(res.data);

      return res;
    },
    async completeTenantBill(id: any) {
      const res = await axios.post(
        "/api/tenant-bills/complete/" + id,
        {},
        this.headers
      );

      this.tenantBill = res.data;

      return res;
    },

    async getTenantBill(id: string) {
      const res = await axios.get("/api/tenant-bills/" + id, this.headers);
      this.tenantBill = res.data;
    },
  },
});
