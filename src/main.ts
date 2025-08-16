import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VueApexCharts from 'vue3-apexcharts'
import { createPinia } from "pinia";
import axios from "axios";
import { router } from "./router/index.ts";
import "remixicon/fonts/remixicon.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";


axios.defaults.headers.common = {
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest"
};

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || `${window.location.origin}/api`;

const app = createApp(App);

app.use(VueApexCharts)
app.use(createPinia());

app.use(router);
app.use(ElementPlus);

app.mount("#app");
