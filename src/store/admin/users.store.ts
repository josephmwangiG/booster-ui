import { CategoryForm } from "@/type/category.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useAdmUsersStore = defineStore("adm-users", {
  state: () => ({
    users: [] as any[],
    user: null as any,
    organizations: [] as any[],
    modules: [] as any[],
    organization: {} as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getUsers() {
      const res = await axios.get("/app/adm/users", this.headers);
      this.users = res.data;
    },
 
    async createCategory(data: CategoryForm) {
      const res = await axios.post("/app/adm/categories", data, this.headers);

      this.users.unshift(res.data);

      return res;
    },
    async getUser(id: string) {
      const res = await axios.get("/app/adm/categories/" + id, this.headers);
      this.user = res.data;
    },
    async updateCategory(data: CategoryForm) {
      const res = await axios.put("/app/adm/categories/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.user = res.data;
      }

      return res;
    },
    async uploadThumbnail(formData: any, id: string) {
      const res = await axios.post(
        "/app/adm/categories/" + id + "/upload-thumbnail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.status == 200 || res.status == 201) {
        this.user = res.data;
      }

      return res;
    },

    async getOrganizations() {
      const res = await axios.get("/app/adm/organizations", this.headers);
      this.organizations = res.data;
    },
    async getOrganization(id: string) {
      const res = await axios.get("/app/adm/organizations/" + id, this.headers);
      this.organization = res.data.organization;
      this.modules = res.data.modules;
    },
    async updateOrganization(data: any) {
      try {
        const res = await axios.put("/app/adm/organizations/" + data.id, data, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        this.organization = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
  },
});
