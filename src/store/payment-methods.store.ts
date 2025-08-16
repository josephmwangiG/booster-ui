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
      try {
        const res = await axios.get("/payment-methods", this.headers);
        this.paymentMethods = Array.isArray(res.data)
          ? res.data
          : (res.data?.payment_methods ?? []);
        return res;
      } catch (error: any) {
        // Ensure state remains consistent and avoid throwing in mounted hooks
        this.paymentMethods = [];
        return error?.response ?? null;
      }
    },

    async createPaymentMethod(data: PaymentMethodForm) {
      try {
        const res = await axios.post("/payment-methods", data, this.headers);
        if (res?.data) {
          this.paymentMethods.unshift(res.data);
        }
        return res;
      } catch (error: any) {
        return error?.response ?? null;
      }
    },
    async updatePaymentMethod(data: PaymentMethodForm) {
      try {
        const res = await axios.put(
          "/payment-methods/" + data.id,
          data,
          this.headers
        );

        if (res.status == 200 || res.status == 201) {
          const indexOfUpdated = this.paymentMethods.findIndex(
            (existingItem: any) => existingItem.id == data.id
          );
          if (indexOfUpdated !== -1) {
            this.paymentMethods[indexOfUpdated] = res.data;
          }
        }

        return res;
      } catch (error: any) {
        return error?.response ?? null;
      }
    },
  },
});
