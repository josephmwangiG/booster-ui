import { StoreForm } from "@/type/store.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useStoresStore = defineStore("stores", {
  state: () => ({
    stores: [] as any[],
    brands: [] as any[],
    categories: [] as any[],
    store: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getStores() {
      const res = await axios.get("/api/stores", this.headers);
      this.stores = res.data;
    },
    async createStore(data: StoreForm) {
      const res = await axios.post("/api/stores", data, this.headers);

      this.stores.unshift(res.data);

      return res;
    },
    async getStore(id: string) {
      const res = await axios.get("/api/stores/" + id, this.headers);
      this.store = res.data;
    },
    async updateStore(data: StoreForm) {
      const res = await axios.put("/api/stores/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.store = res.data;
      }

      return res;
    },
    async uploadThumbnail(formData: any, id: string) {
      const res = await axios.post(
        "/api/stores/" + id + "/upload-thumbnail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.status == 200 || res.status == 201) {
        this.store = res.data;
      }

      return res;
    },
    async publishStore(id: string, is_published: boolean) {
      const res = await axios.put(
        "/api/stores/" + id + "/publish",
        {
          is_published: is_published,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      return res;
    },
  },
});
