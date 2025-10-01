import { TenantBillPaymentForm } from "@/type/tenant.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useTenantBillsStore = defineStore("tenant-bills", {
  state: () => ({
    tenantBills: [] as any[],
    tenantBillItems: [] as any[],
    tenantBillPayments: [] as any[],
    units: [] as any[],
    tenantBill: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getTenantBills(params: any) {
      const res = await axios.get("/tenant-bills", {
        ...this.headers,
        params: { ...params },
      });
      this.tenantBills = res.data;
    },
    async getBillItems() {
      try {
        console.log('Fetching tenant bill items with headers:', this.headers);
        const res = await axios.get("/tenant-bill-items", {
          ...this.headers,
        });
        console.log('Tenant bill items API response:', res.data);
        console.log('First item structure:', res.data[0]);
        this.tenantBillItems = res.data || [];
        return res;
      } catch (error: any) {
        console.error('Error fetching tenant bill items:', error.response || error);
        this.tenantBillItems = [];
        return error.response;
      }
    },
    async getTenantBillsForPayment() {
      try {
        console.log('Fetching tenant bills for payment with headers:', this.headers);
        const res = await axios.get("/tenant-bills-for-payment", {
          ...this.headers,
        });
        console.log('Tenant bills for payment API response:', res.data);
        this.tenantBillItems = res.data || [];
        return res;
      } catch (error: any) {
        console.error('Error fetching tenant bills for payment:', error.response || error);
        this.tenantBillItems = [];
        return error.response;
      }
    },
    async getTenantBillPayments() {
      try {
        console.log('Fetching tenant bill payments with headers:', this.headers);
        const res = await axios.get("/tenant-payments", {
          ...this.headers,
        });
        console.log('Tenant bill payments API response:', res.data);
        this.tenantBillPayments = res.data || [];
        return res;
      } catch (error: any) {
        console.error('Error fetching tenant bill payments:', error.response || error);
        this.tenantBillPayments = [];
        return error.response;
      }
    },

    async generateTenantBills(data: any) {
      const res = await axios.post("/tenant-bills", data, this.headers);

      // Handle the new response format with bills array
      if (res.data?.bills) {
        this.tenantBills = res.data.bills;
      } else {
        this.tenantBills = res.data;
      }

      // Refresh bill items to include utilities after bill generation
      await this.getBillItems();

      return res;
    },
    async updateTenantBillItem(data: any) {
      const res = await axios.post(
        "/tenant-bills/items/update/" + data.id,
        data,
        this.headers
      );

      this.tenantBill = res.data;

      return res;
    },

    async createTenantBillPayment(data: TenantBillPaymentForm) {
      try {
        console.log('Creating tenant bill payment with data:', data);
        const res = await axios.post("/tenant-payments", data, {
          ...this.headers,
        });
        console.log('Tenant bill payment created successfully:', res.data);
        
        // Handle the new response format with payment and updated bill
        if (res.data.payment && res.data.updated_bill) {
          this.tenantBillPayments.unshift(res.data.payment);
          
          // Update the tenant bill if it's currently loaded
          if (this.tenantBill && this.tenantBill.id === res.data.updated_bill.id) {
            this.tenantBill = res.data.updated_bill;
          }
          
          // Update tenant bills list if it contains this bill
          const billIndex = this.tenantBills.findIndex(bill => bill.id === res.data.updated_bill.id);
          if (billIndex !== -1) {
            this.tenantBills[billIndex] = res.data.updated_bill;
          }
          
          // Also update bill items if they exist
          if (res.data.updated_bill.bill_items) {
            // Remove old items for this bill
            this.tenantBillItems = this.tenantBillItems.filter(item => item.tenant_bill_id !== res.data.updated_bill.id);
            // Add new items
            this.tenantBillItems.push(...res.data.updated_bill.bill_items);
          }
        } else {
          // Fallback for old response format
          this.tenantBillPayments.unshift(res.data);
        }
        
        return res;
      } catch (error: any) {
        console.error('Error creating tenant bill payment:', error.response?.data || error.message);
        console.error('Request data that failed:', data);
        throw error;
      }
    },
    async completeTenantBill(id: any) {
      const res = await axios.post(
        "/tenant-bills/complete/" + id,
        {},
        this.headers
      );

      this.tenantBill = res.data;

      return res;
    },

    async getTenantBill(id: string) {
      const res = await axios.get("/tenant-bills/" + id, this.headers);
      this.tenantBill = res.data;
    },

    async getPreviousMeterReadings(tenantId: string, utilityId: string, unitId: string) {
      try {
        const res = await axios.get("/tenant-bills/previous-readings", {
          ...this.headers,
          params: {
            tenant_id: tenantId,
            utility_id: utilityId,
            unit_id: unitId
          }
        });
        return res.data;
      } catch (error: any) {
        console.error('Error fetching previous meter readings:', error.response || error);
        return {
          success: false,
          previous_reading: 0,
          error: error.response?.data?.message || 'Failed to fetch previous readings'
        };
      }
    },
  },
});
