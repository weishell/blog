---
title: HTML
date: 2026/03/03
tags:
 - HTML
categories:
 - HTML
---

## 谈谈 Meta 标签及常见属性

### 什么是 Meta 标签

`<meta>` 标签用于描述 HTML 文档的元数据信息（Metadata），这些信息不会直接展示给用户，而是提供给浏览器、搜索引擎、爬虫以及其他客户端程序使用。

常见作用：

- 指定字符编码
- 设置移动端视口
- SEO 优化
- 搜索引擎抓取控制
- 浏览器兼容配置
- PWA 配置
- 页面主题色配置


#### charset

用于指定页面字符编码。

```html
<meta charset="UTF-8">
```

注意：

-  HTML5 推荐使用 UTF-8
- 应尽量放在 head 前部
- 官方要求位于文档前 1024 字节内

作用：防止中文乱码

#### viewport

用于控制移动端视口。

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1.0"
>
```

作用：

```text
让页面宽度等于设备宽度
避免移动端默认缩放
```

常见属性：

##### width

width=device-width视口宽度等于设备宽度。

##### initial-scale

initial-scale=1 初始缩放比例。

##### minimum-scale

minimum-scale=1 最小缩放比例。

##### maximum-scale

maximum-scale=1 最大缩放比例。

##### user-scalable

user-scalable=no 是否允许用户缩放。

注意：默认允许缩放，并非默认 no


```html
<meta
  name="viewport"
  content="
    width=device-width,
    initial-scale=1,
    minimum-scale=1,
    maximum-scale=1,
    user-scalable=no
  "
>
```


#### viewport-fit

用于适配 iPhone 刘海屏、安全区域。

```html
<meta
  name="viewport"
  content="
    width=device-width,
    initial-scale=1,
    viewport-fit=cover
  "
>
```

可选值：
 
+ auto 默认值
+ contain 页面完全显示在安全区域内。
+ cover 页面覆盖整个屏幕。

配合 CSS：

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

常用于： iPhone X iPhone 11 - iPhone 15


#### referrer
现代安全中，控制 Referer 传递非常重要。`<meta name="referrer" content="...">` 是一个常见且实用的 meta，可以防止敏感信息泄露。

#### description

页面描述信息。

```html
<meta
  name="description"
  content="前端整理"
>
```

作用：SEO + 搜索结果摘要 + 社交分享摘要

#### theme-color

设置浏览器主题色。

```html
<meta
  name="theme-color"
  content="#1677ff"
>
```

效果：

```text
Android Chrome 地址栏颜色
PWA 标题栏颜色
```

#### keywords

页面关键词。

```html
<meta
  name="keywords"
  content="HTML,CSS,JavaScript"
>
```

说明：

```text
历史遗留属性
Google 基本忽略
现代 SEO 价值很低
```

#### x-dns-prefetch-control

控制 DNS 预解析。

```html
<meta
  http-equiv="x-dns-prefetch-control"
  content="on"
>
```

配合：

```html
<link
  rel="dns-prefetch"
  href="//cdn.xxx.com"
>
```

作用：

```text
减少 DNS 查询时间
提高资源加载速度
```


#### robots

控制搜索引擎抓取行为。

```html
<meta
  name="robots"
  content="index,follow"
>
```

常见值：
- index 允许索引。
- noindex 禁止索引。
- follow 允许继续抓取链接。
- nofollow 禁止继续抓取链接。
- none 等价 noindex,nofollow


##### author

指定页面作者。

```html
<meta
  name="author"
  content="John Doe"
>
```


#####  generator

指定页面生成工具。

```html
<meta
  name="generator"
  content="Vite"
>
```


##### copyright

版权声明。

```html
<meta
  name="copyright"
  content="Copyright © Company"
>
```




##### google notranslate

禁止 Chrome 自动翻译。

```html
<meta
  name="google"
  content="notranslate"
>
```

适用于：国际化项目/多语言系统


#### X-UA-Compatible

IE 浏览器兼容模式。

```html
<meta
  http-equiv="X-UA-Compatible"
  content="IE=edge"
>
```

作用：使用最新 IE 渲染模式,现代项目已很少使用。


#### Content-Type

声明 MIME 类型与字符集。

```html
<meta
  http-equiv="Content-Type"
  content="text/html;charset=utf-8"
>
```

HTML5 推荐：

```html
<meta charset="UTF-8">
```





##### renderer

360 浏览器私有属性。

```html
<meta
  name="renderer"
  content="webkit"
>
```

可选值：

```text
webkit
ie-comp
ie-stand
```

目前已较少使用。


##### 关于缓存控制

很多老项目会写：

```html
<meta http-equiv="Expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache">
```

但现代项目通常不推荐依赖 Meta 控制缓存。

推荐方式：

```http
Cache-Control
ETag
Last-Modified
```

由服务器响应头统一管理缓存策略。

##### http-equiv="refresh" 未提及
虽然这不是最佳实践（应使用服务器 301/302），但偶尔会有些：“如何实现页面定时刷新或跳转？” 补充一句说明其存在但不推荐会更完整。
