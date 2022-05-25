import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'notyf/notyf.min.css';
import 'sweetalert2/src/sweetalert2.scss'

createApp(App).use(router).mount('#app')
