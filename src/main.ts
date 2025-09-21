import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'



declare global {
  interface Window {
    CESIUM_BASE_URL: string
  }
}

createApp(App)
.use(router)
.mount('#app')