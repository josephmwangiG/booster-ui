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
      try {
        console.log('Fetching properties with headers:', this.headers);
        const res = await axios.get("/api/properties/get/items", this.headers);
        console.log('Properties API response:', res.data);
        this.properties = res.data || [];
        return res;
      } catch (error: any) {
        console.error('Error fetching properties:', error.response || error);
        this.properties = [];
        return error.response;
      }
    },
    async createTenant(data: TenantForm) {
      const res = await axios.post("/api/tenants", data, this.headers);

      this.tenants.unshift(res.data);

      return res;
    },

    async checkExistingTenant(data: TenantForm) {
      // Check if tenant exists by email or ID number
      const existingTenant = this.tenants.find((tenant: any) => 
        tenant.email === data.email || tenant.id_number === data.id_number
      );
      return existingTenant;
    },

    async createTenantWithTenancy(data: TenantForm) {
      // Check for existing tenant
      const existingTenant = await this.checkExistingTenant(data);
      
      if (existingTenant) {
        // Check if tenant has active tenancy
        const hasActiveTenancy = existingTenant.tenancies && existingTenant.tenancies.some((t: any) => t.active);
        
        if (hasActiveTenancy) {
          return {
            status: 400,
            data: {
              error: 'DUPLICATE_ACTIVE_TENANT',
              message: 'A tenant with this email or ID number already has an active tenancy',
              existingTenant: existingTenant
            }
          };
        }

        // Tenant exists but no active tenancy - add new tenancy to existing tenant
        const property = this.properties.find((p: any) => p.id == data.property_id);
        const unit = property?.units?.find((u: any) => u.id == data.unit_id);
        const rentAmount = unit?.rent || 0;

        const tenancyData = {
          property_id: data.property_id,
          unit_id: data.unit_id,
          tenant_id: existingTenant.id,
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          rent_amount: rentAmount
        };

        const tenancyRes = await axios.post("/tenants/tenancies/create", tenancyData, this.headers);
        
        // Refresh the tenants list to get updated tenancy data
        await this.getTenants();

        return {
          status: tenancyRes.status,
          data: {
            tenant: existingTenant,
            tenancy: tenancyRes.data,
            isExistingTenant: true
          }
        };
      }

      // Create new tenant
      const tenantRes = await axios.post("/tenants", {
        tenant_name: data.tenant_name,
        email: data.email,
        phone: data.phone,
        emergency_phone: data.emergency_phone,
        id_number: data.id_number
      }, this.headers);

      if (tenantRes.status === 200 || tenantRes.status === 201) {
        // Get the rent amount from the selected unit
        const property = this.properties.find((p: any) => p.id == data.property_id);
        const unit = property?.units?.find((u: any) => u.id == data.unit_id);
        const rentAmount = unit?.rent || 0;

        // Then create the tenancy
        const tenancyData = {
          property_id: data.property_id,
          unit_id: data.unit_id,
          tenant_id: tenantRes.data.id,
          start_date: new Date().toISOString().split('T')[0], // Today's date
          end_date: '', // Will be set later
          rent_amount: rentAmount
        };

        const tenancyRes = await axios.post("/tenants/tenancies/create", tenancyData, this.headers);
        
        // Refresh the tenants list to get updated tenancy data
        await this.getTenants();

        return {
          status: tenancyRes.status,
          data: {
            tenant: tenantRes.data,
            tenancy: tenancyRes.data,
            isExistingTenant: false
          }
        };
      }

      return tenantRes;
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
