import { TenancyForm, TenantForm } from "@/type/tenant.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useTenantsStore = defineStore("tenants", {
  state: () => ({
    tenants: [] as any[],
    units: [] as any[],
    properties: [] as any[],
    tenant: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getTenants() {
      const res = await axios.get("/api/tenants", this.headers);
      this.tenants = res.data;
    },
    async getProperties() {
      const res = await axios.get("/api/properties/get/items", this.headers);
      this.properties = res.data;
    },
    async createTenant(data: TenantForm) {
      const res = await axios.post("/api/tenants", data, this.headers);

      this.tenants.unshift(res.data);

      return res;
    },

    async createTenancy(data: TenancyForm) {
      const res = await axios.post(
        "/api/tenants/tenancies/create",
        data,
        this.headers
      );

      this.tenant = res.data;

      return res;
    },


    async endTenancy(data: TenancyForm) {
      const res = await axios.post(
        "/api/tenants/tenancies/end/" + data.id,
        {},
        this.headers
      );

      this.tenant = res.data;

      return res;
    },

    async getTenant(id: string) {
      const res = await axios.get("/api/tenants/" + id, this.headers);
      this.tenant = res.data;
    },
    async updateTenant(data: TenantForm) {
      const res = await axios.put("/api/tenants/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.tenants[this.tenants.findIndex((t: any) => t.id == data.id)] =
          res.data;
      }

      return res;
    },
  },
});
