import { PaymentForm } from "@/type/finance.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useFinanceStore = defineStore("finance", {
  state: () => ({
    invoices: [] as any[],
    invoicesList: [] as any[],
    payments: [] as any[],
    stores: [] as any[],
    salesOrders: [] as any[],
    sales: [] as any[],
    purchaseOrders: [] as any[],
    purchases: [] as any[],
    invoice: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getInvoices() {
      const res = await axios.get("/invoices", this.headers);
      this.invoices = res.data.invoices;
    },
    async getPayments() {
      const res = await axios.get("/payments", this.headers);
      this.payments = res.data.payments;
      this.invoicesList = res.data.invoices;
    },
    async getOrders() {
      const res = await axios.get("list/orders", this.headers);
      this.salesOrders = res.data.orders;
    },

    async createInvoice(data: any) {
      try {
        const res = await axios.post("/invoices", data, this.headers);

        return res;
      } catch (error: any) {
        return error.response;
      }
    },

    async createPayment(data: PaymentForm) {
      try {
        const res = await axios.post("/payments", data, this.headers);
        this.payments.unshift(res.data);
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async getInvoice(id: string) {
      const res = await axios.get("/invoices/" + id, this.headers);
      this.invoice = res.data.invoice;
    },
    async updateInvoice(formData: any) {
      try {
        const res = await axios.put(
          "/invoices/" + formData.id,
          formData,
          this.headers
        );

        if (res.status == 200 || res.status == 201) {
          this.invoice = res.data;
        }

        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async downloadInvoice(id: string) {
      try {
        const res = await axios.get(
          "/invoices/" + id + "/download",
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
