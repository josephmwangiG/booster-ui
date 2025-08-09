import { MeterReadingForm, WaterMeterForm } from "@/type/water-meter.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useWaterMetersStore = defineStore("water-meters", {
  state: () => ({
    waterMeters: [] as any[],
    meterReadings: [] as any[],
    units: [] as any[],
    meters: [] as any[],
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
      const res = await axios.post("/water-meters", data, this.headers);

      this.waterMeters.unshift(res.data);

      return res;
    },

    async getWaterMeter(id: string) {
      const res = await axios.get("/water-meters/" + id, this.headers);
      this.waterMeter = res.data;
    },
    async updateWaterMeter(data: WaterMeterForm) {
      const res = await axios.put("/water-meters/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.waterMeters[this.waterMeters.findIndex((t: any) => t.id == data.id)] =
          res.data;
      }

      return res;
    },

    async getMeterReadings() {
      const res = await axios.get("/meter-readings", this.headers);
      this.meterReadings = res.data;
    },
    async getMeters() {
      const res = await axios.get("/water-meters/get/items", this.headers);
      this.payment_methods = res.data.payment_methods;
      this.meters = res.data.meters;
    },
    async createMeterReading(data: MeterReadingForm) {
      const res = await axios.post("/meter-readings", data, this.headers);

      this.meterReadings.unshift(res.data);

      return res;
    },
    async updateMeterReading(data: MeterReadingForm) {
      const res = await axios.put("/meter-readings/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.meterReadings[this.meterReadings.findIndex((t: any) => t.id == data.id)] =
          res.data;
      }

      return res;
    },
  },
});
