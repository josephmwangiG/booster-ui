import { DriverForm } from "@/type/driver.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useDriversStore = defineStore("drivers", {
  state: () => ({
    drivers: [] as any[],
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getDrivers() {
      const res = await axios.get("/drivers", this.headers);
      this.drivers = res.data;
    },
    async createDriver(data: DriverForm) {
      const res = await axios.post("/drivers", data, this.headers);

      this.drivers.unshift(res.data);

      return res;
    },
    async updateDriver(data: DriverForm) {
      const res = await axios.put(
        "/drivers/" + data.id,
        data,
        this.headers
      );

      if (res.status == 200 || res.status == 201) {
        this.drivers[
          this.drivers.findIndex((t: any) => t.id == data.id)
        ] = res.data;
      }

      return res;
    },
  },
});
