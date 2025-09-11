import { MeterReadingForm, WaterMeterForm } from "@/type/water-meter.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useWaterMetersStore = defineStore("water-meters", {
  state: () => ({
    waterMeters: [] as any[],
    meterReadings: [] as any[],
    units: [] as any[],
    meters: [] as any[],
    clientItems: [] as any[],
    payment_methods: [] as any[],
    waterMeter: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getWaterMeters() {
      const res = await axios.get("/water-meters", this.headers);
      this.waterMeters = res.data;
    },

    async createWaterMeter(data: WaterMeterForm) {
      try {
        const res = await axios.post("/water-meters", data, this.headers);

        this.waterMeters.unshift(res.data);

        return res;
      } catch (error) {
        throw error;
      }
    },

    async getWaterMeter(id: string) {
      const res = await axios.get("/water-meters/" + id, this.headers);
      this.waterMeter = res.data;
    },
    async updateWaterMeter(data: WaterMeterForm) {
      try {
        const res = await axios.put("/water-meters/" + data.id, data, this.headers);

        if (res.status == 200 || res.status == 201) {
          this.waterMeters[this.waterMeters.findIndex((t: any) => t.id == data.id)] =
            res.data;
        }

        return res;
      } catch (error) {
        throw error;
      }
    },

    async getMeterReadings() {
      const res = await axios.get("/meter-readings", this.headers);
      this.meterReadings = res.data;
    },
    async getMeters() {
      try {
        console.log('Fetching meters with headers:', this.headers);
        const res = await axios.get("/water-meters/get/items", this.headers);
        console.log('Meters API response:', res.data);
        // API returns an array of meters: [{ id, code_number }, ...]
        this.meters = res.data;
        return res;
      } catch (error: any) {
        console.error('Error fetching meters:', error.response || error);
        this.meters = [];
        return error.response;
      }
    },
    async getClientItems() {
      try {
        console.log('Fetching client items with headers:', this.headers);
        const res = await axios.get("/water-client-items", this.headers);
        console.log('Client items API response:', res.data);
        this.clientItems = res.data;
        return res;
      } catch (error: any) {
        console.error('Error fetching client items:', error.response || error);
        this.clientItems = [];
        return error.response;
      }
    },
    async getPaymentMethods() {
      const res = await axios.get("/payment-methods", this.headers);
      this.payment_methods = res.data;
    },
    async createMeterReading(data: MeterReadingForm) {
      const res = await axios.post("/meter-readings", data, this.headers);

      // Refresh meter readings to get complete data with relationships
      await this.getMeterReadings();

      // If collections were created, refresh the collections data
      if (data.collections && data.collections.length > 0) {
        // Import the collections store to refresh data
        const { useWaterCollectionsStore } = await import('./water-collections.store');
        const collectionsStore = useWaterCollectionsStore();
        await collectionsStore.getWaterCollections();
        await collectionsStore.getPayments();
      }

      return res;
    },
    async updateMeterReading(data: MeterReadingForm) {
      const res = await axios.put("/meter-readings/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        // Refresh meter readings to get complete data with relationships
        await this.getMeterReadings();
      }

      return res;
    },
  },
});
