import { createApp } from 'vue'
import App from './App2.vue'
import router from './router2.js'
// 导入全局样式表
import '@/assets/css/global.css'

const app = createApp(App)
app.use(router)
app.mount('#app2')

