import { defineClientConfig} from '@vuepress/client'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
 
export default defineClientConfig(({ app }) => { 
  console.log(`defineClientAppEnhance`)
  app.use(ElementPlus)
})