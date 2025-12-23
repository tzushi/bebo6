import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { createAnalytics } from './plugins/analytics'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Google Analytics を初期化
createAnalytics(app, router)

app.mount('#app')