import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
// 导入全局样式表
import './assets/css/global.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

