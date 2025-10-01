import { WaterClientForm } from "@/type/water-client.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useWaterClientsStore = defineStore("water-clients", {
  state: () => ({
    waterClients: [] as any[],
    units: [] as any[],
    properties: [] as any[],
    client: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getWaterClients() {
      const res = await axios.get("/api/water-clients", this.headers);
      this.waterClients = res.data;
    },
    async getProperties() {
      const res = await axios.get("/api/properties/get/items", this.headers);
      this.properties = res.data;
    },
    async createClient(data: WaterClientForm) {
      const res = await axios.post("/api/water-clients", data, this.headers);

      this.waterClients.unshift(res.data);

      return res;
    },

    async getClient(id: string) {
      const res = await axios.get("/api/water-clients/" + id, this.headers);
      this.client = res.data;
    },
    async updateClient(data: WaterClientForm) {
      const res = await axios.put(
        "/api/water-clients/" + data.id,
        data,
        this.headers
      );

      if (res.status == 200 || res.status == 201) {
        this.waterClients[
          this.waterClients.findIndex((t: any) => t.id == data.id)
        ] = res.data;
      }

      return res;
    },
  },
});
