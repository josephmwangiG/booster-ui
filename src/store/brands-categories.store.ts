import { BrandForm } from "@/type/brand.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useBrandsStore = defineStore("brands", {
  state: () => ({
    brands: [] as any[],
    categories: [] as any[],
    Brand: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getBrands() {
      const res = await axios.get("/api/brands", this.headers);
      this.brands = res.data.brands;
      this.categories = res.data.categories;
    },
    async createBrand(data: BrandForm) {
      const res = await axios.post("/api/brands", data, this.headers);

      this.brands.unshift(res.data);

      return res;
    },
    async getBrand(id: string) {
      const res = await axios.get("/api/brands/" + id, this.headers);
      this.Brand = res.data;
    },
    async updateBrand(data: BrandForm) {
      const res = await axios.put("/api/brands/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.Brand = res.data;
      }

      return res;
    },
  },
});
