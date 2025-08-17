import { CategoryForm } from "@/type/category.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useAdmProductsStore = defineStore("adm-products", {
  state: () => ({
    products: [] as any[],
    product: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getProducts() {
      const res = await axios.get("/api/app/adm/products", this.headers);
      this.products = res.data;
    },
    async getProduct(id: string) {
      const res = await axios.get("/api/app/adm/products/" + id, this.headers);
      this.product = res.data;
    },
    async createProduct(data: any) {
      const res = await axios.post("/api/app/adm/products", data, this.headers);
      this.products.unshift(res.data);
      return res;
    },
    async updateProduct(data: any) {
      const res = await axios.put(
        "/api/app/adm/products/" + data.id,
        data,
        this.headers
      );

      if (res.status == 200 || res.status == 201) {
        this.product = res.data;
      }

      return res;
    },
    async deleteProduct(id: string) {
      const res = await axios.delete("/api/app/adm/products/" + id, this.headers);
      this.products = this.products.filter(p => p.id !== id);
      return res;
    },
  },
});
