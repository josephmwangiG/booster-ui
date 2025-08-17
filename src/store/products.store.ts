import { ProductForm } from "@/type/product.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useProductsStore = defineStore("products", {
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
      const res = await axios.get("/api/products", this.headers);
      this.products = res.data;
    },
    async createProduct(data: ProductForm) {
      const res = await axios.post("/api/products", data, this.headers);

      this.products.unshift(res.data);

      return res;
    },
    async getProduct(id: string) {
      const res = await axios.get("/api/products/" + id, this.headers);
      this.product = res.data;
    },
    async updateProduct(data: ProductForm) {
      const res = await axios.put("/api/products/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.product = res.data;
      }

      return res;
    },
    async uploadImage(formData: any, id: string) {
      const res = await axios.post(
        "/api/products/" + id + "/media-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      return res;
    },
    async uploadThumbnail(formData: any, id: string) {
      const res = await axios.post(
        "/api/products/" + id + "/upload-thumbnail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.status == 200 || res.status == 201) {
        this.product = res.data;
      }

      return res;
    },
    async removeMedia(id: string) {
      const res = await axios.delete("/api/products/" + id + "/media-remove", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return res;
    },
    async publishProduct(id: string, is_published: boolean) {
      const res = await axios.put(
        "/api/products/" + id + "/publish",
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
