import { defineStore } from "pinia";
import axios from "axios";

type WaterConfigState = {
  defaultRatePerCubicMeter: number;
};

export const useWaterConfigStore = defineStore("water-config", {
  state: (): WaterConfigState => ({
    defaultRatePerCubicMeter: Number(localStorage.getItem("wm.defaultRate") || 0),
  }),
  actions: {
    async syncFromSettings() {
      try {
        const headers = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } };
        const res = await axios.get('/settings', { ...headers, params: { module: 'water', search: 'water.default_rate_per_m3' } });
        const list = Array.isArray(res.data?.data) ? res.data.data : res.data;
        const existing = list.find((x: any) => x.key === 'water.default_rate_per_m3');
        const val = Number(existing?.value?.value ?? existing?.value ?? NaN);
        if (!Number.isNaN(val)) {
          this.defaultRatePerCubicMeter = val;
          localStorage.setItem("wm.defaultRate", String(val));
        }
      } catch {}
    },
    async setDefaultRate(rate: number) {
      const safe = Number(rate) || 0;
      this.defaultRatePerCubicMeter = safe;
      localStorage.setItem("wm.defaultRate", String(safe));
      try {
        const headers = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } };
        // try update existing key else create
        // naive: attempt create; if fails due to unique, fallback to search+update
        const payload = { module: 'water', key: 'water.default_rate_per_m3', type: 'number', value: { value: safe }, description: 'Default water rate per m3' };
        try {
          await axios.post('/settings', payload, headers);
        } catch (_e: any) {
          // try find and update (best-effort)
          const res = await axios.get('/settings', { ...headers, params: { module: 'water', search: 'water.default_rate_per_m3' } });
          const list = Array.isArray(res.data?.data) ? res.data.data : res.data;
          const existing = list.find((x: any) => x.key === 'water.default_rate_per_m3');
          if (existing?.id) {
            await axios.put(`/settings/${existing.id}`, { value: { value: safe } }, headers);
          }
        }
      } catch {}
    },
  },
});


