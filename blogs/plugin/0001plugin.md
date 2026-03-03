---
title: 前端库和插件合集
date: 2025/03/29
tags:
 - 插件库
categories:
 - plugin
---

## 插件库合集


### 框架类插件库

+ [vue](https://cn.vuejs.org/guide/introduction):vue框架官网，响应式组件化开发
+ [react](https://react.docschina.org/):react官网
+ [angular](https://www.angular.cn/):angular框架官网
+ [jQuery](https://jquery.com/):jQuery官网

### 通用类插件库
+ js-cookie: 处理 **cookie** 插件
+ js-file-download: **下载** 插件 [地址](/fast/1007download.html#利用插件下载文件-js-file-download)
+ downloadjs: **下载** 插件 注意是否支持视频的合理处理
+ console:第三方集成无法看到 **控制台** 时使用 [npm install vconsole]
+ chalk:日志颜色提醒[地址](https://www.npmjs.com/package/chalk)
+ lazyload: **懒加载** [lazyload](https://www.npmjs.com/package/lazyload)
+ clipboard: **复制粘贴** [clipboard](https://clipboardjs.com/)
+ moment **日期格式** [moment](http://momentjs.cn/)
+ dayjs Moment.js轻量化方案 [dayjs](https://www.npmjs.com/package/dayjs)
+ mockjs mock数据 [mockjs](http://mockjs.com/)
+ json-server: 模拟数据库，更方便增删改查
+ svg-captcha 验证码生成[svg-captcha](https://www.npmjs.com/package/svg-captcha)
+ nodemailer 发送邮件:[nodemailer](https://www.npmjs.com/package/nodemailer)
+ lodash 前端工具库: [lodash](https://www.npmjs.com/package/lodash) [官网](https://www.lodashjs.com/)
+ marked markdown简单的插件 [marked](https://github.com/markedjs/marked)
+ video.js  播放器插件 [video.js](https://videojs.com/)
+ xgplayer 西瓜视频
+ mitt 文件监听触发事件，不依赖任何框架[mitt](https://www.npmjs.com/package/mitt)
+ decimal.js: js计算，精度丢失问题解决[decimal.js](https://www.npmjs.com/package/decimal.js)
+ qs:处理url转成对象或者对象转成url拼接&的字符[qs](https://www.npmjs.com/package/qs)
+ querystringify:比qs更轻便处理数据使用的库
+ pubSub-js:一个用于发布订阅的插件[pubSub-js](https://www.npmjs.com/package/pubsub-js)
+ clipboard:复制粘贴插件[clipboard](https://www.npmjs.com/package/clipboard)
+ fastclick:解决移动端300ms延迟[fastclick](https://www.npmjs.com/package/fastclick)
+ cheerio:主要是为了用在服务器端(或客户端xss防范)需要对DOM进行操作的地方
+ xss:防范xss攻击插件
+ localforage:本地存储优雅降级方案
+ gsap:一个动画库[官网](https://greensock.com/)
+ uuid:前端想生成一个独一无二的id时可以使用
+ yjs:一个CRDT 基础库，主要用作协同开发
+ prettiter:代码格式化工具
+ commitlint:代码提交校验格式
+ pako:传输数据大的时候可压缩解压插件
+ esprima:用于多用途分析的 ECMAScript 解析基础结构
+ superagent：一个可用于浏览器端和Node服务端的小型渐进式客户端HTTP请求库
+ puppeteer ：自动化浏览器爬虫可用
+ postcss-px-to-viewport：px转vw插件[插件](https://www.npmjs.com/package/postcss-px-to-viewport?activeTab=code)
+ is-hotkey:兼容性不错的快捷键插件[插件](https://www.npmjs.com/package/is-hotkey)
+ @emtion:css样式库[官网](https://emotion.sh/docs/introduction)
+ highlight.js：https://www.npmjs.com/package/highlight.js
+ modernizr:检测浏览器对HTML5CSS3兼容性的插件[modernizr](https://www.npmjs.com/package/modernizr)
+ du-i8n：国际化
+ emoji-mart:表情选择
+ @hocuspocus/provider:提供协同服务用
+ slate.js:富文本编辑器插件
  - slate-dom
  - slate-history
  - slate-react
  - slate-hyperscript
+ slate-yjs: slate协同用的插件，已不维护
+ js-base64：专门用于处理 Base64 编码与解码,常与文件有关
+ p-limit: 限制并发
+ fullcalendar:日历插件 [官网](https://fullcalendar.io/)
+ remark:提供 Markdown 处理管道，用于修复和标准化 Markdown 格式
+ autofitjs:适应屏幕[官网](https://auto-plugin.github.io/autofit.js/)
+ recorder-core：音频处理，可以用来把实时传输给后端，应用场景：音频转文字
+ lazysizes:图片懒加载插件
+ codemirror：代码编辑器

```js
import { Base64 } from 'js-base64'
var url = 'http://127.0.0.1:8080/file/test.txt'; //要预览文件的访问地址
window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
```


### 工具类插件
+ cross-env： 是一个常用的 Node.js 工具，用于在不同操作系统上设置环境变量，简化跨平台项目的环境配置

Windows 使用 set 命令设置环境变量（如 set NODE_ENV=production），而类 Unix 系统使用 export（如 export NODE_ENV=production）。

在package.json中
```json
{
  "scripts": {
    "build:prod": "cross-env NODE_ENV=production webpack --mode production",
    "build:dev": "cross-env NODE_ENV=development webpack --mode development"
  }
}
```
在命令行中
```bash
# 设置单个环境变量
cross-env NODE_ENV=production npm run build

# 设置多个环境变量
cross-env API_URL=https://api.example.com DEBUG=true node app.js
```

+ source-map
+ @sentry/webpack-plugin：一个为 Sentry 提供源映射和发布管理支持的 Webpack 插件。
+ npm-run-all ：管理复杂构建流程和开发工作流的实用工具， 是一个用于并行或串行运行多个 npm 脚本的 CLI 工具。它可以帮助你更高效地管理和组织 package.json 中的脚本命令。

### vue类插件

+ @riophae/vue-treeselect: select多层级选择插件 [介绍](https://www.vue-treeselect.cn/) [使用](/vue/012vuetree.html#vue-treeselect)
+ vue-croppa: 图片上传及多功能插件 [介绍](https://zhanziyang.github.io/vue-croppa/#/)
+ vue-lazyload: [懒加载](https://github.com/hilongjw/vue-lazyload)
+ vue-print-nb: [选中内容打印](https://github.com/Power-kxLee/vue-print-nb)
+ vue-virtual-scroller:[vue虚拟列表滚动插件](https://www.npmjs.com/package/vue-virtual-scroller)
+ vue-virtual-scroll-list:[vue虚拟列表滚动插件](https://www.npmjs.com/package/vue-virtual-scroll-list)
+ vxe-table：[vue表格专属插件](https://xuliangzhan_admin.gitee.io/vxe-table/#/table/start/install):存在滚动条抖动问题？
+ vue-lazyload: [vue懒加载](https://www.npmjs.com/package/vue-lazyload)
+ vuex-persistedstate:[vuex数据持久化](https://github.com/robinvdvleuten/vuex-persistedstate)
+ vuex-persist:[vuex数据持久化](https://github.com/championswimmer/vuex-persist)
+ umyui: ***一款支持vue2和虚拟表格的ui***  [umyui](http://www.umyui.com/)
+ vue-json-viewer:在页面上优化`json`文件样式
+ vue-clipboard2:复制粘贴插件
+ vue2-datepicker:解决vue2elementui插件不能在range模式下切换年份的插件

### react类插件
+ redux [地址](https://redux.js.org/)
+ react-redux [地址](https://www.redux.org.cn/docs/react-redux/)
+ redux-thunk [地址](https://github.com/reduxjs/redux-thunk/)
+ redux-saga [地址](https://github.com/redux-saga/redux-saga)
+ mobx：数据流管理插件
+ ahooks：react hooks插件
+ react-drawio:流程图插件：配置按钮有的版本存在问题，测试在V26.0.16版本中就避免了这个问题，此外它还支持UML类图插件。可以利用libs参数控制左侧应该展示的控件。（存在一定的样式问题，以及图片会被转成base64，如果做接口上传要额外注意）
+ react-intersection-observer：这是一个基于 React 的Intersection Observer API实现， 用于通知您元素何时进入或离开视口。它包含了Hooks、渲染属性和普通的 children实现。
+ @uiw/react-codemirror:React 的 CodeMirror 组件


### 移动端插件

### 图形类插件
+ html2canvas **一键复制页面具体内容** [html2canvas](http://html2canvas.hertzen.com/documentation)
+ xmind-embed-viewer：xmind预览插件
+ ExcelJS
+ xlsx
+ ~~@cyntler/react-doc-viewer：可以处理很多格式的预览，但是其中有的必须是公网地址的路径，所以如果考虑私密的话，不能采用。~~`且控制台一直在报一些警告`(不推荐)
+ pdf-dist:pdf预览插件
+ @vue-office：[text](https://501351981.github.io/vue-office/examples/docs/guide/js-preview.html)
+ ~~react-file-viewer:效果极差，避坑，注意它还不能在一个页面同时存在两个组件，pdf预览控制台报错，execl预览下过差且交互报错~~
+ docx-preview
+ @excalidraw/excalidraw:手绘风格画板
+ tldraw:画板组件，**商用不可隐藏水印**
+ mermaid: 可以通过代码转成图形的一种库，run和render都可以渲染，run不适合多图同时展示，因为存在绘制位置不对场景
+ cropper.js：图片裁剪插件，默认的话，创建的实例每次裁剪的时候会带着时间戳去请求一次图片，这样图片比较大的情况下，就会影响性能。有个参数配置可以关闭closeorigin:false，这样就可以不加时间戳，但是此时需要后端去配合处理图片的cors跨域问题，注意的是，最后图片img标签需要加上`crossOrigin='anonymous'` ，可以避免裁剪的时候又闪烁现象。

```html
   <img
    id='xxxx'
    src='xxxx'
    crossOrigin='anonymous'
/>
```

### 3D类插件库
+ threejs
+ babylon
+ cesium
+ Photo Sphere Viewer **全景图** 插件 [地址](https://photo-sphere-viewer.js.org/)

+ embed-drawio:有两种模式实现流程图，一是独立编辑器（回退到初始数据再点一次就是直接无数据了），二是本地搭建drawio系统后交互（虽然需要自己搭建后台，但是不存在无法保存和回退丢失数据的情况）


### node插件
+ fs-extra：node文件处理模块
+ spark-md5: `加密插件，比md5方法更多`,支持增量计算,用来处理切片上传hash值计算
+ formidable:处理上传文件图片
+ @hocuspocus/server：协同服务端用
+ Whistle:前端抓包工具插件
+ pino:日志工具，不适用于前端
+ glob

> spark-md5在应用中，发现读取file文件中的md等类型文档非常耗时，会获取的hash值比较慢，测试的文件是大约30M需要1min，视频的话不会那么慢，使用好的电脑mac M4计算的不受影响。一开始以为是电脑设备的原因，好的电脑能扛住运算所以秒算，但是这也不符合一个使用率那么高的库会出现不同系统上速度天壤之别，最后回家用自己的电脑发现比公司的快两三百倍，大概率是公司网络安全的问题，会阻塞读取直到自己检查文件没问题才结束，而视频也比正常电脑慢了三四倍，只是没有那么明显而已

```js
async calculateHashSample(){
      // 1个G的文件，抽样后5M以内
      // hash一样，文件不一定一样
      // hash不一样，文件一定不一样
      return new Promise(resolve=>{
        const spark = new sparkMD5.ArrayBuffer()
        const reader = new FileReader()

        const file = this.file
        const size = file.size
        const offset = 2*1024*1024
        // 第一个2M，最后一个区块数据全要
        let chunks = [file.slice(0,offset)]

        let cur = offset
        while(cur<size){
          if(cur+offset>=size){
            // 最后一个区快
            chunks.push(file.slice(cur, cur+offset))

          }else{
            // 中间的区块
            const mid = cur+offset/2
            const end = cur+offset
            chunks.push(file.slice(cur, cur+2))
            chunks.push(file.slice(mid, mid+2))
            chunks.push(file.slice(end-2, end))
          }
          cur+=offset
        }
        // 中间的，取前中后各2各字节
        reader.readAsArrayBuffer(new Blob(chunks))
        reader.onload = e=>{
          spark.append(e.target.result)
          this.hashProgress = 100
          resolve(spark.end())
        }
      })
    },

```
  
### egg插件
+ egg-router-group : 后端路由接口分组
+ egg-mongoose : 连接mongdb使用
+ egg-validate : 校验接口数据

### css插件
+ animate **动画** css库[地址](https://animate.style/)
+ normalize.css **浏览器默认css一致性** [cnpm i  normalize.css --save]
+ reset.css 重置浏览器样式
+ @emotion/css ：css in js

```tsx
// cx相当于classname的合集，而css可以理解为一个单独的类
import { cx, css } from '@emotion/css'


const arr = [xx,xxx,xxx]

const class1 = css`
   width:32px;
   height:32px;
   background:blue;
   border-radius:16px;
   margin:0 2px;
   flex:1;
   line-height: 32px;
   text-align: center;
`

const class2 = css`
  background:green;
  color:#fff;
`


export const C1 = props => {
    return (<>
        {arr.map(i => <div key={i className={class1}>{xxxx}</div>)}
        <div className={cx(class1,class2,css`font-szie:35px`)}>xxxx</div>
  </>)
}
```

### UI插件库
+ elementui
+ elementplus
+ antd
+ vant
  

  


### 一些其他网站地址
+ [gemini](https://gemini.google.com/app)
+ [deepseek](https://www.deepseek.com/) :基础方案还行，细致的不行
+ [文心一言](https://yiyan.baidu.com/)
+ [豆包](https://www.doubao.com/chat/)
+ [NPM](https://www.npmjs.com/)
+ [netlify](https://www.netlify.com/):静态网站托管服务
+ [github](https://github.com/):github官方
+ [MDN](https://developer.mozilla.org/zh-CN/)
+ [stackoverflow](https://stackoverflow.com/)
+ [caniuse](https://caniuse.com/#home):浏览器兼容性
+ [colordrop](https://www.colordrop.io/flat/)颜色搭配网站
+ [drawio官网](https://app.diagrams.net/?culture=en-us&country=US)drawio官网
+ [kkfileview](https://www.kkview.cn/):预览文件用，内部坑多，如果需要在https网站预览，需要nginx代理，而其内部很多路径是相对路径，代理时可能会出现较多问题，需要逐步修理，另外他的缓存机制不合理，缓存同名文件，存在bug，需要后端修改。（如果预览跳转新页面则无所谓），kk的预览转换很消耗性能，最好能设置好秒传功能，这样只需要转换一次，降低服务端的压力，同时它的xlsx预览不支持缓存，时基于luckysheet实现的，大文件预览设备不行的话就会有问题
+ [双越面试题网](https://www.mianshipai.com/)
+ [react学习](https://react.iamkasong.com/)
+ [univer](https://github.com/dream-num/univer)
+ [weibook](https://weibook.netlify.app/)
+ [developer.chrome](https://developer.chrome.com/docs/devtools/overview?hl=zh-cn)
+ [Libraries.io](https://libraries.io/)
+ [drawnix](https://github.com/plait-board/drawnix):绘图网站，可本地部署
