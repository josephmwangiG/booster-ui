import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VueApexCharts from 'vue3-apexcharts'
import { createPinia } from "pinia";
import { router } from "./router/index.ts";
import "remixicon/fonts/remixicon.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { initializeSanctum } from "./api/index";

// Initialize Sanctum CSRF cookie
initializeSanctum();

const app = createApp(App);

app.use(VueApexCharts)
app.use(createPinia());

app.use(router);
app.use(ElementPlus);

app.mount("#app");
