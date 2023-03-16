import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import element from "element-plus"
import jQuery from 'jquery'
import './assets/main.css'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import uCore from './js/core/uAnimeCore.js'
import uExt from './js/core/uAnimeEx.js'

const app = createApp(App)
app.config.globalProperties.$ = jQuery
uCore.initCore()
app.config.globalProperties.uCore = uCore
app.config.globalProperties.uExt = uExt
app.config.globalProperties.toRaw = function(obj) {
    return JSON.parse(JSON.stringify(obj))
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router).use(element)
app.mount('#app')
