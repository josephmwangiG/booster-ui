import { WaterDeliveryForm } from "@/type/water-delivery.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useWaterDeliveriesStore = defineStore("water-deliveries", {
  state: () => ({
    waterDeliveries: [] as any[],
    waterDeliverItems: [] as any[],
    waterDeliveriesPayments: [] as any[],
    drivers: [] as any[],
    vehicles: [] as any[],
    payment_methods: [] as any[],
    properties: [] as any[],
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getWaterDeliveries() {
      const res = await axios.get("/water-deliveries", this.headers);
      this.waterDeliveries = res.data;
    },
    async getWaterDeliveryItems() {
      const res = await axios.get(
        "/water-deliveries/get/delivery-items",
        this.headers
      );
      this.waterDeliverItems = res.data.deliveries;
      this.payment_methods = res.data.payment_methods;
    },
    async getDeliveryItems() {
      try {
        console.log('Fetching delivery items with headers:', this.headers);
        const res = await axios.get("/water-deliveries/get/items", this.headers);
        console.log('Delivery items API response:', res.data);
        this.drivers = res.data.drivers || [];
        this.vehicles = res.data.vehicles || [];
        this.payment_methods = res.data.payment_methods || [];
        return res;
      } catch (error: any) {
        console.error('Error fetching delivery items:', error.response || error);
        this.drivers = [];
        this.vehicles = [];
        this.payment_methods = [];
        return error.response;
      }
    },
    async createWaterDelivery(data: WaterDeliveryForm) {
      const res = await axios.post("/water-deliveries", data, this.headers);

      this.waterDeliveries.unshift(res.data);

      return res;
    },

    async updateWaterDelivery(data: WaterDeliveryForm) {
      const res = await axios.put(
        "/water-deliveries/" + data.id,
        data,
        this.headers
      );

      if (res.status == 200 || res.status == 201) {
        this.waterDeliveries[
          this.waterDeliveries.findIndex((t: any) => t.id == data.id)
        ] = res.data;
      }

      return res;
    },
    async getPayments() {
      const res = await axios.get("/api/water-deliveries-payments", this.headers);
      this.waterDeliveriesPayments = res.data;
    },

    async createWaterDeliveryItemPayment(data: any) {
      const res = await axios.post(
        "/api/water-deliveries-payments",
        data,
        this.headers
      );

      // The component will refresh the list, so we don't need to unshift here
      // this.waterDeliveriesPayments.unshift(res.data);

      return res;
    },

    async markWaterDeliveryComplete(deliveryId: number) {
      const res = await axios.patch(
        `/water-deliveries/${deliveryId}/complete`,
        {},
        this.headers
      );

      if (res.status === 200 || res.status === 201) {
        // Sync the delivery from API response (status could be delivered-but-unpaid or paid+completed)
        const updated = res.data;
        const deliveryIndex = this.waterDeliveries.findIndex((delivery: any) => delivery.id === deliveryId);
        if (deliveryIndex !== -1) {
          this.waterDeliveries[deliveryIndex] = {
            ...this.waterDeliveries[deliveryIndex],
            ...updated,
          };
        }
      }

      return res;
    },

    // Method to set test data for demonstration
    setTestData() {
      this.waterDeliveriesPayments = [
        {
          "id": 1,
          "organization_id": "9fd45a7f-80b3-4046-866f-c92ecc924508",
          "water_delivery_id": 1,
          "payment_method_id": "9fd4623a-3558-4f92-b8c1-686989a1c781",
          "amount": "44000.00",
          "payment_date": "2025-09-08T00:00:00.000000Z",
          "reference_number": "MPESAW311",
          "notes": null,
          "created_at": "2025-09-08T15:32:33.000000Z",
          "updated_at": "2025-09-08T15:32:33.000000Z",
          "water_delivery": {
            "id": 1,
            "organization_id": "9fd45a7f-80b3-4046-866f-c92ecc924508",
            "driver_id": "9fd46319-cd5a-4275-9e87-c5e905878d1f",
            "vehicle_id": 1,
            "water_client_id": "9fd463be-c2a4-4ea4-96f9-b8b912de6f74",
            "delivery_date": "2025-09-08T00:00:00.000000Z",
            "quantity_liters": 300,
            "price_per_liter": "13.33",
            "total_amount": "4000.00",
            "status": "pending",
            "notes": null,
            "created_at": "2025-09-08T15:32:33.000000Z",
            "updated_at": "2025-09-08T15:32:33.000000Z"
          },
          "payment_method": {
            "id": "9fd4623a-3558-4f92-b8c1-686989a1c781",
            "organization_id": "9fd45a7f-80b3-4046-866f-c92ecc924508",
            "name": "Paybill",
            "created_at": "2025-09-08T15:28:18.000000Z",
            "updated_at": "2025-09-08T15:28:18.000000Z",
            "deleted_at": null
          }
        }
      ];
    },
  },
});
