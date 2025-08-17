import { InventoryAdjustmentForm, InventoryForm, InventoryMovementForm } from "@/type/inventory.type";
import axios from "axios";
import { defineStore } from "pinia";

export const useInventoriesStore = defineStore("inventories", {
  state: () => ({
    stores: [] as any[],
    products: [] as any[],
    contacts: [] as any[],
    inventories: [] as any[],
    inventoryList: [] as any[],
    inventoryMovements: [] as any[],
    inventoryAdjustments: [] as any[],
    inventory: null as any,
    headers: {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    },
  }),
  actions: {
    async getInventories() {
      const res = await axios.get("/api/inventories", this.headers);
      this.inventories = res.data.inventories;
      this.stores = res.data.stores;
      this.products = res.data.products;
      this.contacts = res.data.contacts;
    },
    async getInventoryMovements() {
      const res = await axios.get("/api/inventories-movements", this.headers);
      this.inventoryMovements = res.data.inventoryMovements;
      this.inventoryList = res.data.inventories;
      this.stores = res.data.stores;
    },
    async getInventoriesAdjustments() {
      const res = await axios.get("/api/inventories-adjustments", this.headers);
      this.inventoryAdjustments = res.data.inventoryAdjustments;
      this.inventoryList = res.data.inventories;
    },
    async createInventory(data: InventoryForm) {
      const res = await axios.post("/api/inventories", data, this.headers);

      this.inventories.unshift(res.data);

      return res;
    },
    async createInventoryAdjustment(data: InventoryAdjustmentForm) {
      const res = await axios.post(
        "/api/inventories-adjustments",
        data,
        this.headers
      );

      this.inventoryAdjustments.unshift(res.data);

      return res;
    },
    async createInventoryMovement(data: InventoryMovementForm) {
      const res = await axios.post(
        "/api/inventories-movements",
        data,
        this.headers
      );

      this.inventoryMovements.unshift(res.data);

      return res;
    },
    async getInventory(id: string) {
      const res = await axios.get("/api/inventories/" + id, this.headers);
      this.inventory = res.data.inventory;
      this.stores = res.data.stores;
      this.products = res.data.products;
      this.contacts = res.data.contacts;
    },
    async updateInventory(data: InventoryForm) {
      try{
        const res = await axios.put(
          "/api/inventories/" + data.id,
          data,
          this.headers
        );
  
        if (res.status == 200 || res.status == 201) {
          this.inventory = res.data;
        }
  
        return res;
      }catch(err:any){
        return err.response
      }
    },
    async publishInventory(id: string, is_published: boolean) {
      const res = await axios.put(
        "/api/inventories/" + id + "/publish",
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
