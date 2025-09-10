import axios from "axios";
import { defineStore } from "pinia";

export type LoginFormData = {
  email?: string;
  password?: string;
  password_confirmation?: string;
  remember_me?: boolean;
};

export type RegisterFormData = {
  user_name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async login(data: LoginFormData) {
      try {
        const res = await axios.post("/login", data, {});

        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.token;

        this.user = res.data.user;

        return res;
      } catch (err: any) {
        return err.response;
      }
    },
    async logout() {
      try {
        const res = await axios.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        // Clear local state and headers
        localStorage.clear();
        delete axios.defaults.headers.common["Authorization"];
        this.user = null;

        return res;
      } catch (err: any) {
        // Even if API fails, ensure local logout
        localStorage.clear();
        delete axios.defaults.headers.common["Authorization"];
        this.user = null;
        return err?.response || { status: 200 };
      }
    },
    async forgotPassword(data: LoginFormData) {
      try {
        const res = await axios.post("/forgot-password", data, {});

        return res;
      } catch (err: any) {
        return err.response;
      }
    },
    async resetPassword(data: LoginFormData, token: string) {
      try {
        const res = await axios.post("/reset-password/" + token, data, {});

        return res;
      } catch (err: any) {
        return err.response;
      }
    },
    async verifyAccount(token: string) {
      try {
        const res = await axios.post("/verify-account/" + token, {}, {});

        return res;
      } catch (err: any) {
        return err.response;
      }
    },

    async register(data: RegisterFormData) {
      try {
        const res = await axios.post("/register", data, {});
        return res;
      } catch (err: any) {
        return err.response;
      }
    },

    async getUser() {
      try {
        const res = await axios.get("/get-user", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        this.user = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
    async updateOrganization(data: any) {
      try {
        const res = await axios.post("/update-organization", data, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        this.user = res.data;
        return res;
      } catch (error: any) {
        return error.response;
      }
    },
  },
});
