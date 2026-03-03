---
title: 应用-webpack
date: 2025/04/01
tags:
 - js
 - webpack
categories:
 - 应用
 - webpack
---

# webpack



### process.env

#### process.env的本质
process.env是Node.js中的一个对象，包含当前进程的所有环境变量。例如：
```js
console.log(process.env); // 输出当前进程的所有环境变量
```
而NODE_ENV不是process.env的默认属性。它是用户自定义的环境变量，用于区分开发、测试、生产等环境。

#### 设置NODE_ENV的方法

1. 通过命令行设置（临时生效）
   
```bash
# Unix/Linux/macOS  
export NODE_ENV=production  
node app.js
```
 
2. Windows（使用 cross-env 跨平台兼容）
   
```bash
npx cross-env NODE_ENV=production node app.js
```
3. 通过.env文件设置（持久化配置）：
   
```bash
#.env 文件 
NODE_ENV=production
```
在代码中加载.env文件：
```js
require('dotenv').config(); // 使用 dotenv 库加载环境变量  
console.log(process.env.NODE_ENV); // 输出: "production"
```
4. **NODE_ENV的典型用途**

package.json
```json
{
 
  "scripts": {
    "dev": "cross-env NODE_ENV=development OTHER_CONTENT=XXXXX 其他命令"
 }
}
```

:::warning 不同环境

如果不使用插件cross-env，不同的环境配置写法不一致
```json
"scripts": {
    "dev-mac": "export NODE_ENV=development && node dev.js",
    "dev-win":  "set NODE_ENV=development && node dev.js"
}
```
:::

[参考链接](/blogs/plugin/0001plugin.html#通用类插件库)

构建工具配置：如Webpack、Vite等根据NODE_ENV决定构建模式（开发/生产）。
代码逻辑分支：
```js
if (process.env.NODE_ENV === 'production') {  
  // 生产环境逻辑  
} else {  
  // 开发环境逻辑  
}
```
## Configuration
由用户提供的配置对象，interface。
```js
const myWebpackConfig: Configuration = {
	// 配置
}
```

## webpack插件

### webpack-dev-server

```
"dev": "webpack-dev-server --config ./webpack.dev.config.js --mode development", // 会热更新，打包的内容会放在内容中而不是实际创建文件
"dev1": "webpack --config ./webpack.dev.config.js --mode development" //会打dist包，按照development环境，不做过多优化
```


### DefinePlugin（内置）
这个插件允许在构建过程中定义全局常量，这些常量可以在代码中被访问。由于Webpack在构建时处理这些常量，它们的值必须是`字符串`形式，以便正确替换。

#### 应用场景

1. html中设置值
   
```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
```

DefinePlugin允许在编译时创建配置的全局常量

```js
const path = require("path");
const { DefinePlugin } = require("webpack");
module.exports = {
  mode: "development",
  plugins: [
    new DefinePlugin({
      BASE_URL: "'./'",
	    __VUE_OPTIONS_API__: true, //vue3的配置，关闭option api，默认是false
    })
  ]
};

```
这个时候，编译template就可以正确的编译了，会读取到BASE_URL的值；

2. 在不同的环境可以通过process.env上注入一些可供使用的数据

```bash
cross-env NODE_ENV=development OTHER_CONTENT=XXXXX 其他命令
```
NODE_EN 和 OTHER_CONTENT就会在process.env上获取

```js
const settingData = Object.keys(obj).reduce((acc, key) => {
  acc[`PROCESS_ENV_${key.toUpperCase()}`] = JSON.stringify(obj[key]);
  return acc;
}, {});
// 使用示例：
// new webpack.DefinePlugin(settingData)
```

如果 Webpack 版本 >= 5，直接使用：

```js
import { Configuration, DefinePlugin } from 'webpack';
```
若版本 < 5，可能需要：

```js
const webpack = require('webpack');
const { DefinePlugin } = webpack;
```


对于动态值，建议使用 dotenv-webpack 或 Webpack 的 EnvironmentPlugin：
```js
import { EnvironmentPlugin } from 'webpack';

// webpack.config.ts
plugins: [
  new EnvironmentPlugin({
    API_URL: process.env.API_URL,
  }),
]
```

### EnvironmentPlugin（内置）

EnvironmentPlugin是使用DefinePlugin键的简写process.env.

接受EnvironmentPlugin一个键`数组`或一个将其键映射到其默认值的`对象`。
```js
new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']);
```
这相当于以下DefinePlugin应用程序：
```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
});
```
::: warning 警告
EnvironmentPlugin检查process.env指定的变量。如果缺少，它会搜索配置中提供的默认值。如果环境变量和默认值均未定义，则会抛出错误：“ EnvironmentPlugin-${key}环境变量是undefined”。
:::

### HtmlWebpackPlugin

该插件将生成一个 HTML5 文件，该文件使用script标签在正文中包含所有 webpack 包。按如下方式将插件添加到 webpack 配置中：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
  },
  plugins: [new HtmlWebpackPlugin()],
};
```
这将生成一个dist/index.html包含以下内容的文件：
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>webpack App</title>
  </head>
  <body>
    <script src="index_bundle.js"></script>
  </body>
</html>
```

如果有多个 webpack ***入口点***，它们都将包含`<script>`在生成的 HTML 中的标签中。

如果 webpack 的输出中有任何 CSS 资源（例如，使用`MiniCssExtractPlugin`提取的 CSS ），那么这些资源将包含在生成的 HTML 元素`<link>`中的标签中`<head>`。



#### HtmlWebpackPlugin复杂用法

```js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        // 默认启用的选项（可省略）
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        // 显式开启默认关闭的选项
        keepClosingSlash: true,
        minifyJS: true,     // 依赖 Terser 或 UglifyJS
        minifyCSS: true,    // 依赖 cssnano 或 clean-css
        minifyURLs: true
      }
    })
  ]
};
```

| 属性名                          | 类型                    | 作用描述                                                                 | 默认值                   |
|---------------------------------|-------------------------|-------------------------------------------------------------------------|--------------------------|
| `caseSensitive`                | `boolean`               | 区分大小写处理属性（适用于自定义 HTML 标签）                            | `false`                  |
| `collapseBooleanAttributes`    | `boolean`               | 省略布尔属性值（如 `disabled="disabled"` → `disabled`）                 | `false`                  |
| `collapseInlineTagWhitespace`  | `boolean`               | 折叠 `display:inline` 元素间空白（需开启 `collapseWhitespace`）         | `false`                  |
| `collapseWhitespace`           | `boolean`               | 折叠文本节点中的空白符（换行、多余空格等）                              | `false`                  |
| `conservativeCollapse`         | `boolean`               | 折叠空白时至少保留 1 个空格（需开启 `collapseWhitespace`）              | `false`                  |
| `continueOnParseError`         | `boolean`               | 忽略 HTML 解析错误继续压缩                                              | `false`                  |
| `customAttrAssign`             | `RegExp[]`              | 自定义属性赋值规则的正则表达式（如 `{{value}}`）                        | `[]`                     |
| `customAttrCollapse`           | `RegExp`                | 删除指定属性值的换行符（如 `/ng-class/`）                               | `undefined`              |
| `customAttrSurround`           | `RegExp[]`              | 自定义属性包围规则的正则表达式（如 `<div {{#if}}...{{/if}}>`）          | `[]`                     |
| `customEventAttributes`        | `RegExp[]`              | 指定需压缩 JS 的自定义事件属性（如 `ng-click`）                         | `[/^on[a-z]{3,}$/]`      |
| `decodeEntities`               | `boolean`               | 直接使用 Unicode 字符（如 `&copy;` → `©`）                             | `false`                  |
| `html5`                        | `boolean`               | 按 HTML5 规范解析输入                                                   | `true`                   |
| `ignoreCustomComments`         | `RegExp[]`              | 忽略匹配的注释（如 `<!--! 重要注释 -->`）                               | `[/^!/, /^\s*#/]`        |
| `ignoreCustomFragments`        | `RegExp[]`              | 忽略匹配的代码块（如 `<?php ... ?>`）                                   | `[/<%[\s\S]*?%>/]` 等    |
| `includeAutoGeneratedTags`     | `boolean`               | 插入 HTML 解析器自动生成的标签（如 `<tbody>`）                          | `true`                   |
| `keepClosingSlash`             | `boolean`               | 保留自闭合标签的斜杠（如 `<img />`）                                    | `false`                  |
| `maxLineLength`                | `number`                | 压缩后最大行长度（自动换行）                                            | `undefined`              |
| `minifyCSS`                    | `boolean \| object \| function` | 压缩内联 CSS（基础压缩无需工具，深度优化需 `cssnano`）                  | `false`                  |
| `minifyJS`                     | `boolean \| object \| function` | 压缩内联 JS（默认使用 `terser`）                                        | `false`                  |
| `minifyURLs`                   | `boolean \| string \| function` | 压缩 URL（如 `href="javascript:void(0)"` → `href="javascript:;"`）      | `false`                  |
| `noNewlinesBeforeTagClose`     | `boolean`               | 不在闭合标签前换行（如 `</div>` 前不留空行）                            | `false`                  |
| `preserveLineBreaks`           | `boolean`               | 保留标签间的换行符（需开启 `collapseWhitespace`）                       | `false`                  |
| `preventAttributesEscaping`    | `boolean`               | 禁止转义属性值（如 `href="foo&bar"` 不转义）                            | `false`                  |
| `processConditionalComments`   | `boolean`               | 压缩条件注释（如 `<!--[if IE]>...<![endif]-->`）                        | `false`                  |
| `processScripts`               | `string[]`              | 指定要压缩的 `<script>` 类型（如 `text/ng-template`）                   | `[]`                     |
| `quoteCharacter`               | `string`                | 指定属性引号类型（`'` 或 `"`）                                          | `undefined`              |
| `removeAttributeQuotes`        | `boolean`               | 删除属性值引号（如 `id="foo"` → `id=foo`）                              | `false`                  |
| `removeComments`               | `boolean`               | 删除所有 HTML 注释（如 `<!-- 注释 -->`）                                | `false`                  |
| `removeEmptyAttributes`        | `boolean \| function`   | 删除空值属性（如 `disabled=""`）                                        | `false`                  |
| `removeEmptyElements`          | `boolean`               | 删除空内容元素（如 `<div></div>`）                                      | `false`                  |
| `removeOptionalTags`           | `boolean`               | 删除可选标签（如 `<html>`、`<body>`）                                   | `false`                  |
| `removeRedundantAttributes`    | `boolean`               | 删除冗余属性（如 `<input type="text">` → `<input>`）                    | `false`                  |
| `removeScriptTypeAttributes`   | `boolean`               | 删除 `<script>` 的 `type="text/javascript"`                             | `false`                  |
| `removeStyleLinkTypeAttributes`| `boolean`               | 删除 `<style>` 和 `<link>` 的 `type="text/css"`                         | `false`                  |
| `removeTagWhitespace`          | `boolean`               | 删除标签间所有空格（可能导致布局异常）                                  | `false`                  |
| `sortAttributes`               | `boolean`               | 按使用频率排序属性                                                      | `false`                  |
| `sortClassName`                | `boolean`               | 按使用频率排序 CSS 类名                                                 | `false`                  |
| `trimCustomFragments`          | `boolean`               | 修剪 `ignoreCustomFragments` 匹配块周围的空白                           | `false`                  |
| `useShortDoctype`              | `boolean`               | 使用 HTML5 短文档类型（`<!DOCTYPE html>`）                              | `false`                  |


大多数选项默认是禁用的。

| 选项 | 说明 | 默认 |
|--------------------------------|-----------------|---------|
| `caseSensitive` | 以区分大小写的方式处理属性（对于自定义 HTML 标签有用）| `false` |
| `collapseBooleanAttributes` | [从布尔属性中省略属性值](http://perfectionkills.com/experimenting-with-html-minifier#collapse_boolean_attributes) | `false` |
| `collapseInlineTagWhitespace` | 折叠时，`display:inline;` 元素之间不要留任何空格。必须与 `collapseWhitespace=true` | `false` | 一起使用
| `collapseWhitespace` | [折叠文档树中文本节点的空白](http://perfectionkills.com/experimenting-with-html-minifier#collapse_whitespace) | `false` |
| `conservativeCollapse` | 始终折叠至 1 个空格（永不完全移除）。必须与 `collapseWhitespace=true` | `false` | 一起使用
| `continueOnParseError` | [处理解析错误](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors)而不是中止。| `false` |
| `customAttrAssign` | 允许支持自定义属性分配表达式的正则表达式数组（例如 `'<div flex?="{{mode != cover}}"></div>'`）| `[ ]` |
| `customAttrCollapse` | 指定自定义属性以删除换行符的正则表达式（例如 `/ng-class/`）| |
| `customAttrSurround` | 允许支持自定义属性环绕表达式的正则表达式数组（例如 `<input {{#if value}}checked="checked"{{/if}}>`）| `[ ]` |
| `customEventAttributes` | 正则表达式数组，允许支持 `minifyJS` 的自定义事件属性（例如 `ng-click`）| `[ /^on[az]{3,}$/ ]` |
| `decodeEntities` | 尽可能使用直接 Unicode 字符 | `false` |
| `html5` | 根据 HTML5 规范解析输入 | `true` |
| `ignoreCustomComments` | 正则表达式数组，允许在匹配时忽略某些注释 | `[ /^!/, /^\s*#/ ]` |
| `ignoreCustomFragments` | 正则表达式数组，允许在匹配时忽略某些片段（例如 `<?php ... ?>`、`{{ ... }}` 等）| `[ /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/ ]` |
| `includeAutoGeneratedTags` | 插入 HTML 解析器生成的标签 | `true` |
| `keepClosingSlash` | 保留单例元素的尾部斜杠 | `false` |
| `maxLineLength` | 指定最大行长度。压缩输出将在有效的 HTML 分割点处用换行符分割 |
| `minifyCSS` | 最小化样式元素和样式属性中的 CSS（使用 [clean-css](https://github.com/jakubpawlowicz/clean-css)）| `false`（可以是 `true`、`Object`、`Function(text, type)`）|
| `minifyJS` | 压缩脚本元素和事件属性中的 JavaScript (使用 [Terser](https://github.com/terser/terser)) | `false` (可以是 `true`, `Object`, `Function(text, inline)`) |
| `minifyURLs` | 缩小各种属性中的 URL (使用 [relateurl](https://github.com/stevenvachon/relateurl)) | `false` (可以是 `String`, `Object`, `Function(text)`) |
| `noNewlinesBeforeTagClose` | 绝不要在关闭元素的标签前添加换行符 | `false` |
| `preserveLineBreaks` | 当标签之间的空白包含换行符时，始终折叠为 1 个换行符（绝不会将其完全移除）。必须与 `collapseWhitespace=true` | `false` | 一起使用
| `preventAttributesEscaping` | 防止属性值的转义 | `false` |
| `processConditionalComments` | 通过 minifier 处理条件注释的内容 | `false` |
| `processScripts` | 与要通过压缩器处理的脚本元素类型相对应的字符串数组（例如 `text/ng-template`、`text/x-handlebars-template` 等）| `[ ]` |
| `quoteCharacter` | 用于属性值的引号类型（' 或 "）| |
| `removeAttributeQuotes` | [尽可能删除属性周围的引号](http://perfectionkills.com/experimenting-with-html-minifier#remove_attribute_quotes) | `false` |
| `removeComments` | [删除 HTML 注释](http://perfectionkills.com/experimenting-with-html-minifier#remove_comments) | `false` |
| `removeEmptyAttributes` | [删除所有仅含空格值的属性](http://perfectionkills.com/experimenting-with-html-minifier#remove_empty_or_blank_attributes) | `false` (可以是 `true`、`Function(attrName, tag)`) |
| `removeEmptyElements` | [删除所有内容为空的元素](http://perfectionkills.com/experimenting-with-html-minifier#remove_empty_elements) | `false` |
| `removeOptionalTags` | [删除可选标签](http://perfectionkills.com/experimenting-with-html-minifier#remove_optional_tags) | `false` |
| `removeRedundantAttributes` | [当值与默认值匹配时删除属性。](http://perfectionkills.com/experimenting-with-html-minifier#remove_redundant_attributes) | `false` |
| `removeScriptTypeAttributes` | 从 `script` 标签中删除 `type="text/javascript"`。其他 `type` 属性值保持不变 | `false` |
| `removeStyleLinkTypeAttributes`| 从 `style` 和 `link` 标签中删除 `type="text/css"`。其他 `type` 属性值保持不变 | `false` |
| `removeTagWhitespace` | 尽可能删除属性之间的空格。**请注意，这将导致无效的 HTML！** | `false` |
| `sortAttributes` | [按频率对属性进行排序](#sorting-attributes--style-classes) | `false` |
| `sortClassName` | [按频率对样式类进行排序](#sorting-attributes--style-classes) | `false` |
| `trimCustomFragments` | 修剪 `ignoreCustomFragments` 周围的空白。| `false` |
| `useShortDoctype` | [将 `doctype` 替换为简短 (HTML5) 文档类型](http://perfectionkills.com/experimenting-with-html-minifier#use_short_doctype) | `false` |



## 实际操作

### react中分包懒加载

> 注意webpack中的cacheGroups对应的分包chunk为async，否则不会懒加载，会在首次加载中把资源加载，然后懒加载时只会加载一个很小的类似映射的文件（本地会看到的确是懒加载，但是线上不行，所以还是用async而不是all）

```tsx
// 动态加载Prism.js
const loadPrism = async () => {
  if (window.__prism) {
    return window.__prism
  }

  try {
    // 动态导入Prism.js核心
    const prismModule = await import('prismjs')
    const Prism = prismModule.default
    
    // 动态加载需要的语言支持（根据你的实际需要添加）
    await import('prismjs/components/prism-javascript')
    await import('prismjs/components/prism-typescript')
    await import('prismjs/components/prism-jsx')
    await import('prismjs/components/prism-tsx')
    await import('prismjs/components/prism-css')
    await import('prismjs/components/prism-markdown')
    await import('prismjs/components/prism-json')
    await import('prismjs/components/prism-bash')
    await import('prismjs/components/prism-yaml')
    
    // 动态加载样式 - 使用 Prism 官方主题
    await import('prismjs/themes/prism-tomorrow.css') // 或 prism-okaidia.css, prism-coy.css 等
    
    // 导入自定义样式（如果有的话）
    await import('../../prism.css')
    
    // 将Prism挂载到window上
    window.__prism = Prism
    return Prism
  } catch (error) {
    //。。。。
  }
}

// 当存在代码时采取加载分包
useEffect(() => {
  if (daima && daimaRef.current) {
    // 异步加载Prism.js并高亮代码
    loadPrism()
      .then(prism => {
        if (daimaRef.current) {
          // 设置 Prism 配置
          prism.configure({
            // 可选：设置 tab 替换为空格
            // tabReplace: '  ',
            // 可选：设置默认语言
            defaultLanguage: 'javascript',
            // 可选：自动检测语言
            detectLanguage: true
          })
          // 高亮代码块
          prism.highlightElement(daimaRef.current)
          
        }
      })
      .catch(error => {
		//。。。。
      })
  }
}, [daima])
```



```ts
    splitChunks: {
	  minSize: 50 * 1024,
      chunks: 'all',
      maxAsyncRequests: 12,
	  hidePathInfo: true,
      maxInitialRequests: 8,
      automaticNameDelimiter: '-',
      cacheGroups: {
        // 添加 Prism.js 缓存组
        prismVendor: {
          test: /[\\/]node_modules[\\/](prismjs)[\\/]/,
          name: 'prism-vendor',
          priority: 35,
          chunks: 'async', // 因为代码高亮通常是异步使用，所以用 async
          enforce: true
        },
        // 保持原有的其他缓存组...
        editorPlugins: {
          test: /[\\/]src[\\/](views|components)[\\/]/,
          name: 'conent-xxx-vendor',
          priority: 20,
          chunks: 'all',
          enforce: true
        },
        // ... 其他配置
      }
    },
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  },
 
})

```

### webpack分splitChunks
```js
// webpack.config.js 的 splitChunks 部分调整：
splitChunks: {
  chunks: 'all',
  minSize: 20000, // 小于不拆分
  maxSize: 200 * 1024 * 1024, //大于考虑拆分
  maxAsyncRequests: 10,      // 全局：10
  maxInitialRequests: 8,     // 全局：8
  cacheGroups: {
    react: {
      test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|scheduler|prop-types)[\\/]/,
      name: 'react-vendor',
      priority: 20,
      reuseExistingChunk: true,//决定：是否复用已有 chunk
    },
    utility: {
      test: /[\\/]node_modules[\\/](lodash|moment|axios)[\\/]/,
      name: 'utility-vendor',
      priority: 15,
    },
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      priority: 10,
      maxAsyncRequests: 6, // 控制异步拆分数量
      maxInitialRequests: 6  // 控制首屏拆分数量
    },
  
  },
}
```

1. 如果一个模块小于minSize，它不会被拆分（因为小于minSize）。
2. 如果一个模块大于maxSize，Webpack会尝试把它拆分成多个maxSize大小的chunk（因为大于maxSize）。
3. 如果一个模块等于maxSize，它会被作为一个单独的chunk，不会拆分。

```js
// 全局宽松，分组严格
maxAsyncRequests: 12,      // 全局允许12个异步请求
maxInitialRequests: 10,     // 全局允许10个初始请求
defaultVendor: {
  maxAsyncRequests: 8,     // 但分组最多只拆8个
  maxInitialRequests: 8,   // 首屏分组最多8个
}
```


[webpack](https://bqq9knyjcuo.feishu.cn/docx/VtaxdlwLVoGNUexHiSYcSS4MnTd?from=from_copylink)
