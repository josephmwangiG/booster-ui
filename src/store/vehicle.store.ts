import { VehicleForm } from "@/type/vehicle.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useVehiclesStore = defineStore("vehicles", {
  state: () => ({
    vehicles: [] as any[],
    vehicle: {} as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {

    async getVehicles() {
      const res = await axios.get("/vehicles", this.headers);
      this.vehicles = res.data;
    },

    async createVehicle(data: VehicleForm) {
      const res = await axios.post("/vehicles", data, this.headers);

      this.vehicles.unshift(res.data);

      return res;
    },

    async getVehicle(id: string) {
      const res = await axios.get("/vehicles/" + id, this.headers);
      this.vehicle = res.data;
    },
    async updateVehicle(data: VehicleForm) {
      const res = await axios.put("/vehicles/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.vehicles[this.vehicles.findIndex((t: any) => t.id == data.id)] =
          res.data;
      }

      return res;
    },
  },
});
