import {
  PendingMoneyCollectionForm,
  WaterDeliveryForm,
} from "@/type/water-delivery.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useWaterCollectionsStore = defineStore("water-collections", {
  state: () => ({
    waterCollections: [] as any[],
    pendingWaterCollections: [] as any[],
    waterDeliverItems: [] as any[],
    waterCollectionsPayments: [] as any[],
    meters: [] as any[],
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
    async getWaterDeliveryItems() {
      const res = await axios.get(
        "/api/water-collections/get/delivery-items",
        this.headers
      );
      this.waterDeliverItems = res.data.deliveries;
      this.payment_methods = res.data.payment_methods;
    },
    async getDeliveryItems() {
      const res = await axios.get("/api/water-collections/get/items", this.headers);
      this.drivers = res.data.drivers;
      this.vehicles = res.data.vehicles;
      this.payment_methods = res.data.payment_methods;
    },
    async getMeters() {
      const res = await axios.get("/water-meters/get/items", this.headers);
      this.meters = res.data.meters;
      this.payment_methods = res.data.payment_methods;
    },
    async createWaterDelivery(data: WaterDeliveryForm) {
      const res = await axios.post("/api/water-collections", data, this.headers);

      this.waterCollections.unshift(res.data);

      return res;
    },

    async updateWaterDelivery(data: WaterDeliveryForm) {
      const res = await axios.put(
        "/api/water-collections/" + data.id,
        data,
        this.headers
      );

      if (res.status == 200 || res.status == 201) {
        this.waterCollections[
          this.waterCollections.findIndex((t: any) => t.id == data.id)
        ] = res.data;
      }

      return res;
    },

    async getWaterCollections() {
      const res = await axios.get("/api/water-collections", this.headers);
      this.waterCollections = res.data;
    },
    async getPendingWaterCollections() {
      const res = await axios.get("/pending-water-collections", this.headers);
      this.pendingWaterCollections = res.data;
    },

    async createPendingCollection(data: PendingMoneyCollectionForm) {
      const res = await axios.post(
        "/pending-water-collections",
        data,
        this.headers
      );

      this.pendingWaterCollections.unshift(res.data);

      return res;
    },
    async getPayments() {
      const res = await axios.get("/api/water-collection-payments", this.headers);
      this.waterCollectionsPayments = res.data;
    },


    async getClientBalance(phone_number: string) {
      return await axios.get("/api/water-collection-payments/get-client-balance/" + phone_number, this.headers);
    },

    async createPayment(data: any) {
      const res = await axios.post(
        "/api/water-collection-payments",
        data,
        this.headers
      );

      this.waterCollectionsPayments.unshift(res.data);

      return res;
    },
  },
});
