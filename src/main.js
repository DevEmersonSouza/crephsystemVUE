import { createApp } from 'vue';
import './style.css'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config';
import axios from 'axios';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import ToastService from 'primevue/toastservice';
import Vue3Signature from "vue3-signature"

import 'primeicons/primeicons.css'; // Importe os estilos de PrimeIcons
import "primeflex/primeflex.css";
import 'primevue/resources/themes/saga-blue/theme.css';       // Tema do PrimeVue
import 'primevue/resources/primevue.min.css';                 // CSS do PrimeVue
import 'primeicons/primeicons.css';                           // Ícones do PrimeIcons
import '/node_modules/primeflex/primeflex.css'
import 'material-icons/iconfont/material-icons.css';
import 'material-symbols';

const app = createApp(App)

app.config.globalProperties.$axios = axios;
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(Vue3Signature);

app.component('DialogPin', Dialog);
app.component('ProgressSpinner', ProgressSpinner);

app.mount('#app');