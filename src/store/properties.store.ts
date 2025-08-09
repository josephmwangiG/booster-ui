import { PropertyForm, UnitForm } from "@/type/property.type";
import axios from "axios";
import { defineStore } from "pinia";

export const usePropertiesStore = defineStore("properties", {
  state: () => ({
    properties: [] as any[],
    property: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getProperties() {
      const res = await axios.get("/properties", this.headers);
      this.properties = res.data;
    },
    async createProperty(data: PropertyForm) {
      const res = await axios.post("/properties", data, this.headers);

      this.properties.unshift(res.data);

      return res;
    },
    async createUnit(data: UnitForm) {
      const res = await axios.post("/properties/units/create", data, this.headers);

      this.property = res.data;

      return res;
    },
    async getProperty(id: string) {
      const res = await axios.get("/properties/" + id, this.headers);
      this.property = res.data;
    },
    async updateProperty(data: PropertyForm) {
      const res = await axios.put("/properties/" + data.id, data, this.headers);

      if (res.status == 200 || res.status == 201) {
        this.property = res.data;
      }

      return res;
    },
    async uploadImage(formData: any, id: string) {
      const res = await axios.post(
        "/properties/" + id + "/media-upload",
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
        "/properties/" + id + "/upload-thumbnail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.status == 200 || res.status == 201) {
        this.property = res.data;
      }

      return res;
    },
    async removeMedia(id: string) {
      const res = await axios.delete("/properties/" + id + "/media-remove", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return res;
    },
    async publishProperty(id: string, is_published: boolean) {
      const res = await axios.put(
        "/properties/" + id + "/publish",
        {
          is_published: is_published,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      return res;
    },
  },
});
