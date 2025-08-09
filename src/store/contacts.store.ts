import { ContactForm, GroupForm } from "@/type/contact.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useContactsStore = defineStore("contacts", {
  state: () => ({
    customers: [] as any[],
    suppliers: [] as any[],
    contact_groups: [] as any[],
    contact: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getCustomers() {
      const res = await axios.get("/contacts-customers", this.headers);
      this.customers = res.data;
    },
    async getSuppliers() {
      const res = await axios.get("/contacts-suppliers", this.headers);
      this.suppliers = res.data;
    },
    async getContactGroups() {
      const res = await axios.get("/contacts-groups", this.headers);
      this.contact_groups = res.data;
    },
    async createContact(data: ContactForm) {
      const res = await axios.post("/contacts", data, this.headers);

      if (data.contact_type == "Customer") {
        this.customers.unshift(res.data);
      } else if (data.contact_type == "Supplier") {
        this.suppliers.unshift(res.data);
      } else {
        this.customers.unshift(res.data);
        this.suppliers.unshift(res.data);
      }

      return res;
    },
    async getContact(id: string) {
      const res = await axios.get("/contacts/" + id, this.headers);
      this.contact = res.data;
    },
    async updateContact(data: ContactForm) {
      const res = await axios.put("/contacts/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.contact = res.data;
      }

      return res;
    },
    async uploadImage(formData: any, id: string) {
      const res = await axios.post(
        "/contacts/" + id + "/media-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      return res;
    },
    async uploadThumbnail(formData: any, id: string) {
      const res = await axios.post(
        "/contacts/" + id + "/upload-thumbnail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.status == 200 || res.status == 201) {
        this.contact = res.data;
      }

      return res;
    },
    async removeMedia(id: string) {
      const res = await axios.delete("/contacts/" + id + "/media-remove", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return res;
    },

    // Groups
    async createGroup(data: GroupForm) {
      const res = await axios.post("/contacts-groups", data, this.headers);

     this.contact_groups.unshift(res.data);

      return res;
    },
  },
});
