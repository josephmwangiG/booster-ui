import { CategoryForm } from "@/type/category.type";
import api from "@/api";
import { defineStore } from "pinia";

export const useAdmCategoriesStore = defineStore("adm-categories", {
  state: () => ({
    categories: [] as any[],
    category: null as any,
  }),
  actions: {
    async getCategories() {
      const res = await api.get("/app/adm/categories");
      this.categories = res.data;
    },
    async createCategory(data: CategoryForm) {
      const res = await api.post("/app/adm/categories", data);

      this.categories.unshift(res.data);

      return res;
    },
    async getCategory(id: string) {
      const res = await api.get("/app/adm/categories/" + id);
      this.category = res.data;
    },
    async updateCategory(data: CategoryForm) {
      const res = await api.put("/app/adm/categories/" + data.id, data);

      if (res.status == 200 || res.status == 201) {
        this.category = res.data;
      }

      return res;
    },
    async uploadThumbnail(formData: any, id: string) {
      const res = await api.post(
        "/app/adm/categories/" + id + "/upload-thumbnail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
