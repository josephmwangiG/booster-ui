import { defineStore } from "pinia";

type WaterConfigState = {
  defaultRatePerCubicMeter: number;
};

export const useWaterConfigStore = defineStore("water-config", {
  state: (): WaterConfigState => ({
    defaultRatePerCubicMeter: Number(localStorage.getItem("wm.defaultRate") || 0),
  }),
  actions: {
    setDefaultRate(rate: number) {
      const safe = Number(rate) || 0;
      this.defaultRatePerCubicMeter = safe;
      localStorage.setItem("wm.defaultRate", String(safe));
    },
  },
});


