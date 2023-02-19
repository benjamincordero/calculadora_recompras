import { createApp } from "vue";
import "./style.css";
import "./index.css";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import "tw-elements";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
//axios.defaults.withCredentials = true;

const app = createApp(App);

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);
app.mount("#app");
