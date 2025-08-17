import { CategoryForm } from "@/type/category.type";
import api from "@/api";
import { defineStore } from "pinia";

export const useAdmProductsStore = defineStore("adm-products", {
  state: () => ({
    products: [] as any[],
    product: null as any,
  }),
  actions: {
    async getProducts() {
      const res = await api.get("/app/adm/products");
      this.products = res.data;
    },
    async getProduct(id: string) {
      const res = await api.get("/app/adm/products/" + id);
      this.product = res.data;
    },
    async createProduct(data: any) {
      const res = await api.post("/app/adm/products", data);
      this.products.unshift(res.data);
      return res;
    },
    async updateProduct(data: any) {
      const res = await api.put(
        "/app/adm/products/" + data.id,
        data
      );

      if (res.status == 200 || res.status == 201) {
        this.product = res.data;
      }

      return res;
    },
    async deleteProduct(id: string) {
      const res = await api.delete("/app/adm/products/" + id);
      this.products = this.products.filter(p => p.id !== id);
      return res;
    },
  },
});
