import { defineClientConfig } from "@vuepress/client"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default defineClientConfig({
  enhance({ app }) {
    // 注册ElementPlus
    app.use(ElementPlus)
    
    // 注册图标组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
})
