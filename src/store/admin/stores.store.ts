import { StoreForm } from "@/type/store.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useAdmStoresStore = defineStore("adm-stores", {
  state: () => ({
    stores: [] as any[],
    store: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getStores() {
      const res = await axios.get("/api/app/adm/stores", this.headers);
      this.stores = res.data;
    },

    async createStore(data: StoreForm) {
      const res = await axios.post("/api/app/adm/stores", data, this.headers);
      this.stores.unshift(res.data);
      return res;
    },

    async updateStore(data: StoreForm) {
      const res = await axios.put("/api/app/adm/stores/" + data.id, data, this.headers);
      if (res.status == 200 || res.status == 201) {
        const index = this.stores.findIndex(s => s.id === data.id);
        if (index !== -1) {
          this.stores[index] = res.data;
        }
      }
      return res;
    },

    async deleteStore(id: string) {
      const res = await axios.delete("/api/app/adm/stores/" + id, this.headers);
      if (res.status == 200 || res.status == 201) {
        this.stores = this.stores.filter(s => s.id !== id);
      }
      return res;
    },

    async getStore(id: string) {
      const res = await axios.get("/api/app/adm/stores/" + id, this.headers);
      this.store = res.data;
      return res;
    },

    // Legacy category methods (keeping for backward compatibility)
    async createCategory(data: any) {
      const res = await axios.post("/api/app/adm/categories", data, this.headers);
      this.stores.unshift(res.data);
      return res;
    },

    async updateCategory(data: any) {
      const res = await axios.put("/api/app/adm/categories/" + data.id, data, this.headers);
      if (res.status == 200 || res.status == 201) {
        this.user = res.data;
      }
      return res;
    },

    async uploadThumbnail(formData: any, id: string) {
      const res = await axios.post(
        "/api/app/adm/categories/" + id + "/upload-thumbnail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.status == 200 || res.status == 201) {
        this.user = res.data;
      }

      return res;
    },
  },
});
