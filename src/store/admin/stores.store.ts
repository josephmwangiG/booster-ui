import { CategoryForm } from "@/type/category.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useAdmStoresStore = defineStore("adm-stores", {
  state: () => ({
    stores: [] as any[],
    user: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getStores() {
      const res = await axios.get("/app/adm/stores", this.headers);
      this.stores = res.data;
    },
    async createCategory(data: CategoryForm) {
      const res = await axios.post("/app/adm/categories", data, this.headers);

      this.stores.unshift(res.data);

      return res;
    },
    async getUser(id: string) {
      const res = await axios.get("/app/adm/categories/" + id, this.headers);
      this.user = res.data;
    },
    async updateCategory(data: CategoryForm) {
      const res = await axios.put("/app/adm/categories/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.user = res.data;
      }

      return res;
    },
    async uploadThumbnail(formData: any, id: string) {
      const res = await axios.post(
        "/app/adm/categories/" + id + "/upload-thumbnail",
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
