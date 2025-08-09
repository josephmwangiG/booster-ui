import { PaymentMethodForm } from "@/type/payment-method.type";
import axios from "axios";
import { defineStore } from "pinia";

export const usePaymentMethodsStore = defineStore("payment-methods", {
  state: () => ({
    paymentMethods: [] as any[],
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getPaymentMethods() {
      const res = await axios.get("/payment-methods", this.headers);
      this.paymentMethods = res.data;
    },

    async createPaymentMethod(data: PaymentMethodForm) {
      const res = await axios.post("/payment-methods", data, this.headers);

      this.paymentMethods.unshift(res.data);

      return res;
    },
    async updatePaymentMethod(data: PaymentMethodForm) {
      const res = await axios.put(
        "/payment-methods/" + data.id,
        data,
        this.headers
      );

      if (res.status == 200 || res.status == 201) {
        this.paymentMethods[
          this.paymentMethods.findIndex((t: any) => t.id == data.id)
        ] = res.data;
      }

      return res;
    },
  },
});
