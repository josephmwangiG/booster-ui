import { WaterDeliveryForm } from "@/type/water-delivery.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useWaterDeliveriesStore = defineStore("water-deliveries", {
  state: () => ({
    waterDeliveries: [] as any[],
    waterDeliverItems: [] as any[],
    waterDeliveriesPayments: [] as any[],
    drivers: [] as any[],
    vehicles: [] as any[],
    payment_methods: [] as any[],
    properties: [] as any[],
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getWaterDeliveries() {
      const res = await axios.get("/water-deliveries", this.headers);
      this.waterDeliveries = res.data;
    },
    async getWaterDeliveryItems() {
      const res = await axios.get(
        "/water-deliveries/get/delivery-items",
        this.headers
      );
      this.waterDeliverItems = res.data.deliveries;
      this.payment_methods = res.data.payment_methods;
    },
    async getDeliveryItems() {
      const res = await axios.get("/water-deliveries/get/items", this.headers);
      this.drivers = res.data.drivers;
      this.vehicles = res.data.vehicles;
      this.payment_methods = res.data.payment_methods;
    },
    async createWaterDelivery(data: WaterDeliveryForm) {
      const res = await axios.post("/water-deliveries", data, this.headers);

      this.waterDeliveries.unshift(res.data);

      return res;
    },

    async updateWaterDelivery(data: WaterDeliveryForm) {
      const res = await axios.put(
        "/water-deliveries/" + data.id,
        data,
        this.headers
      );

      if (res.status == 200 || res.status == 201) {
        this.waterDeliveries[
          this.waterDeliveries.findIndex((t: any) => t.id == data.id)
        ] = res.data;
      }

      return res;
    },
    async getPayments() {
      const res = await axios.get("/api/water-deliveries-payments", this.headers);
      this.waterDeliveriesPayments = res.data;
    },

    async createWaterDeliveryItemPayment(data: any) {
      const res = await axios.post(
        "/api/water-deliveries-payments",
        data,
        this.headers
      );

      this.waterDeliveriesPayments.unshift(res.data);

      return res;
    },
  },
});
