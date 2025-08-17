import { OrderForm } from "@/type/order.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    contacts: [] as any[],
    products: [] as any[],
    inventories: [] as any[],
    stores: [] as any[],
    salesOrders: [] as any[],
    sales: [] as any[],
    purchaseOrders: [] as any[],
    purchases: [] as any[],
    order: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getOrders() {
      const res = await axios.get("/api/sales-orders", this.headers);
      this.salesOrders = res.data.orders;
      this.products = res.data.products;
      this.contacts = res.data.contacts;
      this.stores = res.data.stores;
    },
    async getSales() {
      const res = await axios.get("/api/sales", this.headers);
      this.sales = res.data.orders;
      this.products = res.data.products;
      this.inventories = res.data.inventories;
      this.contacts = res.data.contacts;
      this.stores = res.data.stores;
    },
    async getPurchaseOrders() {
      const res = await axios.get("/purchase-orders", this.headers);
      this.purchaseOrders = res.data.orders;
      this.products = res.data.products;
      this.contacts = res.data.contacts;
      this.stores = res.data.stores;
    },
    async getPurchases() {
      const res = await axios.get("/purchases", this.headers);
      this.purchases = res.data.orders;
      this.products = res.data.products;
      this.contacts = res.data.contacts;
      this.stores = res.data.stores;
    },
    async createOrder(data: OrderForm) {
      try {
        const res = await axios.post("/orders", data, this.headers);

        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async getOrder(id: string) {
      const res = await axios.get("/orders/" + id, this.headers);

      this.stores = res.data.stores;
      this.products = res.data.products;
      this.order = res.data.order;
    },
    async updateOrder(data: OrderForm) {
      try {
        const res = await axios.put("/orders/" + data.id, data, this.headers);

        if (res.status == 200 || res.status == 201) {
          this.order = res.data;
        }

        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async generateInvoice(id: string) {
      try {
        const res = await axios.post(
          "/api/invoices",
          {
            order_id: id,
          },
          this.headers
        );

        if (res.status == 200 || res.status == 201) {
          this.order = res.data;
        }

        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async downloadOrder(id: string) {
      try {
        const res = await axios.get(
          "/orders/" + id + "/download",
          this.headers
        );

        // Create a new anchor element
        const link = document.createElement("a");

        // Set the href attribute to the Base64 string
        link.href = "data:application/pdf;base64," + res.data.file;

        // Set the download attribute with the desired file name
        link.download = res.data.file_name;

        // Append the anchor to the body
        document.body.appendChild(link);

        // Programmatically click the anchor to trigger the download
        link.click();

        // Remove the anchor from the document
        document.body.removeChild(link);

        return res;
      } catch (error: any) {
        return error.response;
      }
    },
  },
});
