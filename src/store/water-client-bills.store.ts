import { WaterClientBillPaymentForm } from "@/type/water-client.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useWaterClientBillsStore = defineStore("water-client-bills", {
  state: () => ({
    clientBills: [] as any[],
    clientBillItems: [] as any[],
    clientItems: [] as any[],
    clientBillPayments: [] as any[],
    units: [] as any[],
    tenantBill: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getWaterClientBills() {
      const res = await axios.get("/api/water-client-bills", {
        ...this.headers,
      });
      this.clientBills = res.data;
    },
    async getBillItems() {
      const res = await axios.get("/water-client-bill-items", {
        ...this.headers,
      });
      this.clientBillItems = res.data;
    },
    async getClientItems() {
      const res = await axios.get("/water-client-items", {
        ...this.headers,
      });
      this.clientItems = res.data;
    },
    async getWaterClientBillPayments() {
      const res = await axios.get("/api/water-client-payments", {
        ...this.headers,
      });
      this.clientBillPayments = res.data;
    },

    async generateWaterClientBills(data: any) {
      const res = await axios.post("/api/water-client-bills", data, this.headers);

      this.clientBills = res.data;

      return res;
    },
    async createWaterClientBill(data: any) {
      const res = await axios.post(
        "/api/water-client-bills",
        data,
        this.headers
      );

      this.clientBills.unshift(res.data);

      return res;
    },
    async updateWaterClientBill(data: any) {
      const res = await axios.put(
        "/api/water-client-bills/" + data.id,
        data,
        this.headers
      );

      this.clientBills[this.clientBills.indexOf(this.clientBills.find((item: any) => item.id === data.id))] = res.data;

      return res;
    },

    async createWaterClientBillPayment(data: WaterClientBillPaymentForm) {
      const res = await axios.post("/api/water-client-payments", data, {
        ...this.headers,
      });
      this.clientBillPayments.unshift(res.data);

      return res;
    },
    async completeWaterClientBill(id: any) {
      const res = await axios.post(
        "/api/water-client-bills/complete/" + id,
        {},
        this.headers
      );

      this.tenantBill = res.data;

      return res;
    },

    async getWaterClientBill(id: string) {
      const res = await axios.get("/api/water-client-bills/" + id, this.headers);
      this.tenantBill = res.data;
    },
  },
});
