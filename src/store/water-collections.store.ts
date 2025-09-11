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
        "/water-collections/get/delivery-items",
        this.headers
      );
      this.waterDeliverItems = res.data.deliveries;
      this.payment_methods = res.data.payment_methods;
    },
    async getDeliveryItems() {
      try {
        console.log('Fetching delivery items with headers:', this.headers);
        const res = await axios.get("/water-collections/get/items", this.headers);
        console.log('Delivery items API response:', res.data);
        this.drivers = res.data.drivers || [];
        this.vehicles = res.data.vehicles || [];
        this.payment_methods = res.data.payment_methods || [];
        this.meters = res.data.water_meters || [];
        this.properties = res.data.water_clients || [];
        return res;
      } catch (error: any) {
        console.error('Error fetching delivery items:', error.response || error);
        this.drivers = [];
        this.vehicles = [];
        this.payment_methods = [];
        this.meters = [];
        this.properties = [];
        return error.response;
      }
    },
    async getMeters() {
      const res = await axios.get("/water-meters/get/items", this.headers);
      this.meters = res.data;
    },
    async createWaterDelivery(data: WaterDeliveryForm) {
      console.log('Creating water delivery with data:', data);
      const res = await axios.post("/water-collections", data, this.headers);
      console.log('API response:', res.data);

      this.waterCollections.unshift(res.data);
      console.log('Updated waterCollections array:', this.waterCollections);

      return res;
    },

    async updateWaterDelivery(data: WaterDeliveryForm) {
      const res = await axios.put(
        "/water-collections/" + data.id,
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
      const res = await axios.get("/water-collections", this.headers);
      this.waterCollections = res.data;
    },
    async getPendingWaterCollections() {
      const res = await axios.get("/pending-water-collections", this.headers);
      this.pendingWaterCollections = res.data;
    },

    // Note: createPendingCollection removed as the API endpoint only supports GET and HEAD methods
    // async createPendingCollection(data: PendingMoneyCollectionForm) {
    //   const res = await axios.post(
    //     "/pending-water-collections",
    //     data,
    //     this.headers
    //   );

    //   this.pendingWaterCollections.unshift(res.data);

    //   return res;
    // },
    async getPayments() {
      const res = await axios.get("/water-collection-payments", this.headers);
      this.waterCollectionsPayments = res.data;
    },


    async getClientBalance(phone_number: string) {
      return await axios.get("/water-collection-payments/get-client-balance/" + phone_number, this.headers);
    },

    async createPayment(data: any) {
      const res = await axios.post(
        "/water-collection-payments",
        data,
        this.headers
      );

      this.waterCollectionsPayments.unshift(res.data);

      return res;
    },
  },
});
