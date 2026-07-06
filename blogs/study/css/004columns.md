---
title: 三栏布局
date: 2026/07/03
tags:
 - CSS
categories:
 - CSS
---

## 三栏布局（左右固定，中间自适应）总结

> 已知父容器宽度为 `100%`，左右两栏固定 `300px`，中间自适应，共有哪些实现方式？

常见方案：

1. Float
2. Absolute
3. Flex（⭐⭐⭐⭐⭐）
4. Table
5. Grid（⭐⭐⭐⭐⭐）
6. 圣杯布局（Holy Grail Layout）
7. 双飞翼布局（Double Wing Layout）

---

#### 布局方案发展史（建议先理解）

CSS 布局的发展其实经历了几个阶段：

```text
Float
   │
   ▼
圣杯布局
   │
   ▼
双飞翼布局
   │
   ▼
Flex
   │
   ▼
Grid
```

为什么会这样演变？

- **最早只有 Float**，只能依赖浮动实现布局。
- 为了解决 **左右固定、中间自适应、SEO 更友好（中间内容优先渲染）**，出现了 **圣杯布局**。
- 圣杯布局存在父元素 `padding` 带来的问题，于是阿里提出了 **双飞翼布局**。
- 后来 CSS3 推出了 **Flex** 和 **Grid**，彻底解决了这些问题，因此圣杯和双飞翼逐渐退出历史舞台。

> **现代开发优先使用 Flex 或 Grid，圣杯和双飞翼更多作为经典面试题存在。**

---

### 一、Float 布局


左右两侧使用 `float` 脱离文档流，中间保持普通文档流，通过 `margin` 给左右留出空间。


```html
<div class="box">
    <div class="left"></div>
    <div class="right"></div>
    <div class="center"></div>
</div>
```


```css
.box{
    width:100%;
}

.box div{
    height:100px;
}

.left{
    float:left;
    width:300px;
}

.right{
    float:right;
    width:300px;
}

.center{
    margin:0 300px;
}
```

 优点

- 浏览器兼容最好
- 实现简单

 缺点

- 需要清除浮动，否则父元素高度塌陷
- 浮动容易影响后续布局
- 可维护性较差
- 不适合复杂页面布局

#### 面试补充

普通 Float 三栏布局中，**左右栏通常先写，中间内容最后写**。

因为：

- 左右栏先浮动，占据左右两侧。
- 中间元素仍然处于普通文档流，再通过 `margin` 避开左右浮动区域。

---

### 二、Absolute 布局


父元素设置 `position: relative`，三个子元素全部使用绝对定位。


```html
<div class="box">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
```


```css
.box{
    position:relative;
    width:100%;
    height:100px;
}

.box div{
    position:absolute;
    height:100%;
}

.left{
    left:0;
    width:300px;
}

.right{
    right:0;
    width:300px;
}

.center{
    left:300px;
    right:300px;
}
```

 优点

- 实现简单
- 不依赖 Float

 缺点

- 全部脱离文档流
- 父元素无法被内容撑开，需要自己维护高度
- 中间内容过高时容易出现内容溢出、背景无法延伸等问题
- 不适合内容高度未知的页面

---

### 三、Flex 布局（★★★★★ 推荐）


左右固定宽度，中间 `flex:1` 自动填充剩余空间。


```html
<div class="box">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
```


```css
.box{
    display:flex;
}

.left{
    flex:0 0 300px;
}

.right{
    flex:0 0 300px;
}

.center{
    flex:1;
}
```

 优点

- 代码最少
- 可维护性最好
- 天然支持等高布局
- 响应式简单
- 实际开发使用最多

 缺点

- IE9 不支持（现代项目几乎无需考虑）

---

### 四、Table 布局


利用 CSS Table 模拟表格布局。


```html
<div class="box">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
```


```css
.box{
    display:table;
    width:100%;
}

.box div{
    display:table-cell;
    height:100px;
}

.left,
.right{
    width:300px;
}
```

#### 优点

- 自动等高
- 浏览器兼容不错

### 缺点

- 灵活性较差
- 基本已被 Flex 替代

---

### 五、Grid 布局（★★★★★ 推荐）


直接定义三列即可。


```html
<div class="box">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
```

```css
.box{
    display:grid;
    grid-template-columns:300px 1fr 300px;
    height:100px;
}
```

优点

- 最直观
- 二维布局能力最强
- 非常适合后台系统、管理平台

缺点

- IE 不支持
- 老项目较少使用

---

### 六、圣杯布局（Holy Grail Layout）


在 Flex 和 Grid 出现之前，CSS 一直缺少一种优雅的三栏布局方案。

开发者希望同时满足：

- 左右固定宽度
- 中间自适应
- 中间内容最先加载（SEO 更友好）
- 三栏等高

这个问题长期被认为是 CSS 最经典的问题，因此称为：

> **Holy Grail（圣杯）布局**

---


**中间内容必须最先写。**

```html
<div class="parent">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
</div>
```

---

#### 实现步骤

 第一步：全部 Float

```css
.main,
.left,
.right{
    float:left;
}
```

---

 第二步：中间宽度占满

```css
.main{
    width:100%;
}
```

此时：

```text
+++++++++++++++++++++
|       main        |
+++++++++++++++++++++
left
right
```

---

第三步：利用负 margin 拉回左右栏

左侧：

```css
.left{
    margin-left:-100%;
}
```

这里的 `100%` 指的是 **父元素宽度**。

右侧：

```css
.right{
    margin-left:-200px;
}
```

这里负的是自己的宽度。

结果：

```text
left | main | right(遮住)
```

---

第四步：父元素 padding 留空间

```css
.parent{
    padding:0 200px;
    box-sizing:border-box;
}
```

否则左右栏会覆盖中间内容。

---

 第五步：relative 调整左右栏

左侧：

```css
.left{
    position:relative;
    left:-200px;
}
```

右侧：

```css
.right{
    position:relative;
    left:200px;
}
```

> **说明：**
>
> 这里写成 `left:200px` 或 `right:-200px` 效果完全等价，本质都是相对于当前位置向右移动 `200px`。

---

#### 为什么圣杯布局需要 relative？

因为父元素使用了：

```css
padding-left
padding-right
```

左右栏通过负 `margin` 拉回来以后，实际上仍然位于内容区域，需要再移动到 **padding 区域**。

因此需要：

```css
position:relative;
```

进行最后一次调整。

---

##### 完整代码

```css
.parent{
    padding:0 200px;
    box-sizing:border-box;
}

.main{
    float:left;
    width:100%;
}

.left{
    float:left;
    width:200px;
    margin-left:-100%;
    position:relative;
    left:-200px;
}

.right{
    float:left;
    width:200px;
    margin-left:-200px;
    position:relative;
    left:200px;
}
```

---

### 七、双飞翼布局（Double Wing Layout）

双飞翼布局是阿里提出的经典方案。

它和圣杯布局最大的区别：

> **不再使用父元素 padding，而是在中间增加一层 wrapper，通过 wrapper 的 margin 留出左右空间。**



```html
<div class="parent">

    <div class="main">
        <div class="content"></div>
    </div>

    <div class="left"></div>
    <div class="right"></div>

</div>
```



```css
.main{
    float:left;
    width:100%;
}

.content{
    margin:0 200px;
}

.left{
    float:left;
    width:200px;
    margin-left:-100%;
}

.right{
    float:left;
    width:200px;
    margin-left:-200px;
}
```

---

#### 为什么双飞翼布局不用 relative？

因为预留空间已经放到了：

```css
.content{
    margin:0 200px;
}
```

左右栏拉回来以后，本身就在正确的位置。

因此：

- 不需要 padding
- 不需要 relative

这也是它相比圣杯布局最大的改进。

---

### 为什么圣杯和双飞翼都要求 main 写在最前？

很多人知道必须这样写，却不知道原因。

原因有两个：

#### ① 布局原因

`.main` 设置：

```css
width:100%;
```

必须先占满一整行。

之后左右栏才能利用：

```css
margin-left:-100%;
margin-left:-自身宽度;
```

拉回到同一行。

如果左右栏先写，整个布局过程就无法成立。

---

#### ② SEO 原因

HTML 从上到下解析。

把主要内容放最前面：

- 浏览器更早开始渲染正文
- 搜索引擎更容易优先抓取主要内容

因此早期大型网站大量采用这种写法。

---

#### 圣杯布局 VS 双飞翼布局

| 对比项 | 圣杯布局 | 双飞翼布局 |
|---------|----------|-----------|
| 中间内容优先渲染 | ✅ | ✅ |
| SEO 更友好 | ✅ | ✅ |
| 使用 Float | ✅ | ✅ |
| 使用负 Margin | ✅ | ✅ |
| 父元素需要 Padding | ✅ | ❌ |
| 中间需要 Wrapper | ❌ | ✅ |
| 左右需要 Relative 定位 | ✅ | ❌ |
| DOM 层级 | 少 | 多一层 |
| 实现复杂度 | 略高 | 略低 |
| 现代开发推荐 | ⭐ | ⭐ |

---

#### 圣杯布局和双飞翼布局相比现代布局还有优势吗？

**基本没有。**

它们最大的价值已经不是实际开发，而是：

- 理解 CSS 布局原理
- 面试经典考点
- 阅读和维护老项目代码

现代开发中：

- 一维布局优先使用 **Flex**
- 二维布局优先使用 **Grid**

基本可以完全替代圣杯和双飞翼。

---

#### 实际开发推荐

| 场景 | 推荐方案 |
|------|----------|
| 后台管理系统 | ⭐⭐⭐⭐⭐ Flex |
| 官网、复杂页面 | ⭐⭐⭐⭐⭐ Grid |
| 老项目维护 | Float、圣杯、双飞翼 |
| 面试 | 圣杯、双飞翼（重点掌握原理） |

---

### 面试总结

> 三栏布局常见实现方式包括 Float、Absolute、Flex、Table、Grid、圣杯布局和双飞翼布局。

其中：

- **Flex** 是现代开发最常用的方案，代码简单、维护方便，适合绝大多数一维布局。
- **Grid** 更适合复杂的二维布局，能够更直观地描述页面结构。
- **Float、Table、Absolute** 主要用于兼容老项目或理解历史方案。
- **圣杯布局** 和 **双飞翼布局** 都诞生于 Flex 和 Grid 出现之前，目标是在仅依赖 Float 的条件下，实现左右固定、中间自适应，并保证中间内容优先渲染。
- **圣杯布局** 通过父元素 `padding` 预留空间，再利用 `relative` 将左右栏移动到 `padding` 区域。
- **双飞翼布局** 将预留空间放到中间内容（wrapper）的 `margin` 中，因此无需父元素 `padding` 和 `relative` 定位，布局更加稳定，但会增加一层 DOM。
- **现代项目几乎都会优先选择 Flex 或 Grid**，圣杯布局和双飞翼布局更多用于理解 CSS 布局演进过程以及应对前端面试。
- 圣杯布局和双飞翼布局都利用了margin-left负值往左移动原理，双飞翼的外层设计，不需要再额外定位操作。

