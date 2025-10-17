import { defineStore } from "pinia";
import axios from "axios";

export type SettingRecord = {
  id?: string;
  name: string;
  value: any;
  created_at?: string;
  updated_at?: string;
};

type SettingsState = {
  items: SettingRecord[];
  loading: boolean;
  headers: { headers: { Authorization: string | null } };
};

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsState => ({
    items: [],
    loading: false,
    headers: { headers: { Authorization: "Bearer " + localStorage.getItem("token") } },
  }),
  actions: {
    async fetch(params?: Record<string, any>) {
      this.loading = true;
      try {
        const res = await axios.get("/settings", { ...this.headers, params });
        const raw = Array.isArray(res.data?.data) ? res.data.data : res.data;
        this.items = (raw || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          value: s.value,
          created_at: s.created_at,
          updated_at: s.updated_at,
        }));
      } finally {
        this.loading = false;
      }
    },
    async create(payload: SettingRecord) {
      const body: any = { name: payload.name, value: payload.value };
      const res = await axios.post("/settings", body, this.headers);
      const s = res.data;
      const created: SettingRecord = {
        id: s.id,
        name: s.name ?? payload.name,
        value: s.value,
        created_at: s.created_at,
        updated_at: s.updated_at,
      };
      this.items.unshift(created);
      return created;
    },
    async update(id: string, payload: Partial<SettingRecord>) {
      const body: any = {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.value !== undefined ? { value: payload.value } : {}),
      };
      const res = await axios.put(`/settings/${id}` , body, this.headers);
      const s = res.data;
      const updated: SettingRecord = {
        id: s.id,
        name: s.name ?? payload.name ?? "",
        value: s.value,
        created_at: s.created_at,
        updated_at: s.updated_at,
      };
      const idx = this.items.findIndex((it) => it.id === id);
      if (idx >= 0) this.items[idx] = updated;
      return updated;
    },
    async remove(id: string) {
      const res = await axios.delete(`/settings/${id}`, this.headers);
      if (res.status === 200 || res.status === 204) {
        this.items = this.items.filter((s) => s.id !== id);
      }
    },
  },
});

function inferType(value: any): 'string' | 'number' | 'boolean' | 'json' | 'secret' {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (value !== null && typeof value === 'object') return 'json';
  return 'string';
}