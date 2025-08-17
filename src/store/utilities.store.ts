import { UtilityForm } from "@/type/utility.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useUtilitiesStore = defineStore("utilities", {
  state: () => ({
    utilities: [] as any[],
    units: [] as any[],
    properties: [] as any[],
    utility: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getUtilities() {
      const res = await axios.get("/api/utilities", this.headers);
      this.utilities = res.data;
    },
    async getProperties() {
      const res = await axios.get("/api/properties/get/items", this.headers);
      this.properties = res.data;
    },
    async createUtility(data: UtilityForm) {
      const res = await axios.post("/api/utilities", data, this.headers);

      this.utilities.unshift(res.data);

      return res;
    },

    async getUtility(id: string) {
      const res = await axios.get("/api/utilities/" + id, this.headers);
      this.utility = res.data;
    },
    async updateUtility(data: UtilityForm) {
      const res = await axios.put("/api/utilities/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.utilities[this.utilities.findIndex((t: any) => t.id == data.id)] =
          res.data;
      }

      return res;
    },
  },
});
