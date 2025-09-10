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
      const res = await axios.get("/water-client-bills", {
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
      try {
        console.log('Fetching client items with headers:', this.headers);
        const res = await axios.get("/water-client-items", {
          ...this.headers,
        });
        console.log('Client items API response:', res.data);
        this.clientItems = res.data || [];
        return res;
      } catch (error: any) {
        console.error('Error fetching client items:', error.response || error);
        this.clientItems = [];
        return error.response;
      }
    },
    async getWaterClientBillPayments() {
      const res = await axios.get("/water-client-payments", {
        ...this.headers,
      });
      this.clientBillPayments = res.data;
    },

    async generateWaterClientBills(data: any) {
      const res = await axios.post("/water-client-bills", data, this.headers);

      this.clientBills = res.data;

      return res;
    },
    async createWaterClientBill(data: any) {
      const res = await axios.post(
        "/water-client-bills",
        data,
        this.headers
      );

      this.clientBills.unshift(res.data);

      return res;
    },
    async updateWaterClientBill(data: any) {
      const res = await axios.put(
        "/water-client-bills/" + data.id,
        data,
        this.headers
      );

      this.clientBills[this.clientBills.indexOf(this.clientBills.find((item: any) => item.id === data.id))] = res.data;

      return res;
    },

    async createWaterClientBillPayment(data: WaterClientBillPaymentForm) {
      try {
        console.log('Creating water client bill payment with data:', data);
        const res = await axios.post("/water-client-payments", data, {
          ...this.headers,
        });
        console.log('Water client bill payment created successfully:', res.data);
        this.clientBillPayments.unshift(res.data);
        return res;
      } catch (error: any) {
        console.error('Error creating water client bill payment:', error.response?.data || error.message);
        console.error('Request data that failed:', data);
        throw error;
      }
    },
    async completeWaterClientBill(id: any) {
      const res = await axios.post(
        "/water-client-bills/complete/" + id,
        {},
        this.headers
      );

      this.tenantBill = res.data;

      return res;
    },

    async getWaterClientBill(id: string) {
      const res = await axios.get("/water-client-bills/" + id, this.headers);
      this.tenantBill = res.data;
    },
    async getLastBill(client_id: string) {
      const res = await axios.get(`/water-client-bills/last-bill/${client_id}`, this.headers);
      return res.data;
    },
  },
});
