---
title: fixed非视口参考点
date: 2026/03/05
tags:
 - CSS
categories:
 - CSS
---


## 为什么 `position: fixed` 有时候会失效？它真的失效了吗？

这是一个经典的 CSS 面试题，主要考察候选人对 **定位（Positioning）** 和 **Containing Block（包含块）** 的理解，而不是死记结论。

---

### 面试题

下面这段代码，为什么 `fixed` 没有固定在浏览器左上角？

```html
<div class="parent">
  <div class="fixed">fixed</div>
</div>
```

```css
.parent {
  margin: 100px;
  transform: translateX(100px);
  border: 2px solid red;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 120px;
  height: 60px;
  background: #409eff;
}
```

很多人说：

> `position: fixed` 失效了。

这种说法对吗？为什么？

还有哪些属性会导致这种现象？

---


主要考察以下几个知识点：

- `position: fixed` 默认的定位参考系是什么
- 什么是 Containing Block（包含块）
- 为什么 `transform` 会影响 `fixed`
- 哪些 CSS 属性会创建新的 Containing Block
- "fixed 失效"到底是现象还是本质

| 属性            | 本职工作                 | 为什么影响 `fixed`                              |
| ------------- | -------------------- | ------------------------------------------ |
| `filter`      | 图片滤镜（模糊、灰度、亮度等）      | 创建新的包含块（Containing Block）                  |
| `perspective` | 3D 透视，让 3D 变换有近大远小效果 | 创建新的包含块                                    |
| `transform`   | 2D/3D 变换（位移、旋转、缩放等）  | 创建新的包含块                                    |
| `will-change` | 告诉浏览器某些属性即将变化，提前优化渲染 | 如果声明的是 `transform`、`filter` 等，浏览器可能提前创建包含块 |


---

### 标准回答

#### 1、正常情况下，`fixed` 相对于视口定位

默认情况下：

```css
position: fixed;
top: 0;
left: 0;
```

浏览器会以 **Viewport（视口）** 作为定位参考系。

示意图：

```text
Viewport
┌────────────────────┐
│ fixed              │
│                    │
│                    │
└────────────────────┘
```

因此无论页面怎么滚动，元素都会固定在浏览器窗口中。

---

#### 2、为什么会看起来"失效"？

如果某个祖先元素设置了：

```css
transform
```

例如：

```css
.parent {
    transform: translateX(100px);
}
```

浏览器会创建一个新的 **Containing Block（包含块）**。

此时：

```text
Viewport

↓

.parent（Containing Block）

↓

.fixed
```

`fixed` 的定位参考系就不再是 Viewport，而变成了 `.parent`。


浏览器(Viewport)

┌──────────────────────────────┐
│                              │
│          parent              │
│     ┌──────────────────┐     │
│     │ fixed            │     │
│     │                  │     │
│     └──────────────────┘     │
└──────────────────────────────┘

因此：

```css
top: 0;
left: 0;
```

表示的是：

距离 `.parent` 左上角的位置。

所以它看起来像失效了。

实际上：

> **没有失效，只是定位参考系发生了变化。**

---

#### 3、什么是 Containing Block（包含块）？

Containing Block 可以理解为：

> **定位元素计算坐标时所参考的坐标系。**

例如：

正常情况下：

```text
Containing Block

↓

Viewport
```

而当祖先创建新的 Containing Block 后：

```text
Containing Block

↓

.parent
```

所以：

```css
top
left
right
bottom
```

都会基于新的包含块进行计算。

---

#### 4、哪些属性会创建新的 Containing Block？

常见的有：

```css
transform
perspective
filter
backdrop-filter
```

例如：

```css
.parent {
    filter: blur(2px);
}
```

或者：

```css
.parent {
    perspective: 1000px;
}
```

都会使子元素中的 `position: fixed` 不再相对于视口，而是相对于该祖先定位。

此外：

```css
will-change: transform;
```

浏览器可能会提前按照 `transform` 的方式处理，也可能创建新的包含块，因此也可能影响 `fixed` 的定位。

> 注意：并不是 `will-change` 指定任意属性都会影响 `fixed`，通常只有像 `transform`、`filter` 等本身会创建包含块的属性才会产生这种效果。

---

#### 5、这些属性本身是干什么的？

**`transform`**

用于元素的 2D、3D 变换，例如：

```css
transform: translate();
transform: rotate();
transform: scale();
```

---

**`filter`**

用于添加图像滤镜，例如：

```css
filter: blur(5px);
filter: grayscale(100%);
filter: brightness(120%);
```

---

**`perspective`**

用于设置 3D 透视距离，使元素具有近大远小的立体效果。

通常配合：

```css
transform: rotateY();
transform: rotateX();
```

一起使用。

---

**`will-change`**

用于告诉浏览器：

> 这个元素即将发生某种变化。

浏览器会提前做好优化，提高动画或过渡性能。

例如：

```css
will-change: transform;
```

---

### 常见误区

#### 误区一：`position: fixed` 失效了

错误。

真正发生的是：

> **定位参考系从 Viewport 变成了新的 Containing Block。**

---

#### 误区二：只有父元素会影响 `fixed`

错误。

只要是**最近的祖先元素**创建了新的 Containing Block，无论是：

- 父元素
- 爷爷元素
- 更高层祖先

都会影响 `fixed`。

浏览器始终选择最近的那个。

---

#### 误区三：`transform` 才会影响 `fixed`

错误。

除了：

```css
transform
```

还有：

```css
perspective
filter
backdrop-filter
```

以及部分：

```css
will-change
```

都会产生相同的效果。

---

### 一句话总结

> `position: fixed` 默认相对于视口（Viewport）定位，但当最近祖先元素设置了 `transform`、`filter`、`perspective`、`backdrop-filter`（以及部分 `will-change` 场景）时，这些属性会创建新的 **Containing Block（包含块）**，浏览器会把它作为 `fixed` 的定位参考系。因此 `fixed` 并没有失效，只是定位参考系从视口变成了最近的包含块。


### 完整案例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>fixed + transform</title>

<style>
body {
  margin: 0;
  height: 2000px;
  background: #f5f5f5;
}

/* 父元素 */
.parent {
  width: 500px;
  height: 300px;
  margin: 100px auto;
  border: 5px solid red;

  /* 关键代码 */
/*这几处代码只要打开一处，当前fixed的参考系就换变成parent为基准点*/

  /* transform: translateX(100px); */
/* filter: grayscale(100%); */
 /* will-change: transform; */
  /* perspective:1000px; */
  background: #fff;
}

/* fixed */
.fixed {
  position: fixed;
  top: 0;
  left: 0;

  width: 120px;
  height: 60px;
  background: #409eff;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  height: 1500px;
}
</style>
</head>

<body>

<div class="parent">
  <div class="fixed">
    我是 fixed
  </div>
</div>

<div class="content"></div>

</body>
</html>
```
