import { CategoryForm } from "@/type/category.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useAdmCategoriesStore = defineStore("adm-categories", {
  state: () => ({
    categories: [] as any[],
    category: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getCategories() {
      const res = await axios.get("/api/app/adm/categories", this.headers);
      this.categories = res.data;
    },
    async createCategory(data: CategoryForm) {
      const res = await axios.post("/api/app/adm/categories", data, this.headers);

      this.categories.unshift(res.data);

      return res;
    },
    async getCategory(id: string) {
      const res = await axios.get("/api/app/adm/categories/" + id, this.headers);
      this.category = res.data;
    },
    async updateCategory(data: CategoryForm) {
      const res = await axios.put("/api/app/adm/categories/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.category = res.data;
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
        this.category = res.data;
      }

      return res;
    },
  },
});
