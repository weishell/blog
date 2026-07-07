---
title: line-height
date: 2026/07/07
tags:
 - CSS
categories:
 - CSS
---

## `line-height` 的继承规则是什么？下面三种情况下，`p` 的 `line-height` 分别是多少？

这是一个经典的 CSS 面试题，主要考察候选人是否真正理解 **`line-height` 不同写法的继承规则**。

---

### 面试题

#### 第一题

```html
<div class="box">
  <p>Text</p>
</div>

<style>
.box {
  font-size: 30px;
  line-height: 40px;
}

p {
  font-size: 12px;
}
</style>
```

`p` 的 `line-height` 是多少？

**答案：**

```text
40px
```

**解析：**

父元素计算后的 `line-height` 是 `40px`，子元素直接继承这个计算值，因此：

```text
line-height = 40px
```

---

#### 第二题

```html
<div class="box">
  <p>Text</p>
</div>

<style>
.box {
  font-size: 30px;
  line-height: 2;
}

p {
  font-size: 12px;
}
</style>
```

`p` 的 `line-height` 是多少？

**答案：**

```text
24px
```

**解析：**

`line-height: 2` 是**无单位数字（number）**。

它继承的是数字 `2`，而不是计算后的像素值。

因此子元素重新计算：

```text
12 × 2 = 24px
```

---

#### 第三题

```html
<div class="box">
  <p>Text</p>
</div>

<style>
.box {
  font-size: 30px;
  line-height: 200%;
}

p {
  font-size: 20px;
}
</style>
```

`p` 的 `line-height` 是多少？

**答案：**

```text
60px
```

**解析：**

百分比是**相对于当前元素自身的 `font-size` 计算的**。

父元素先计算：

```text
30 × 200% = 60px
```

然后子元素继承的是**计算后的结果**：

```text
line-height = 60px
```

不会再根据自己的 `font-size: 20px` 重新计算。

---

### 面试官真正想考什么？

主要考察三个知识点：

- `line-height` 是否会继承
- 不同写法（长度、数字、百分比）的继承规则是否不同
- 是否理解 **继承的是值还是计算方式**

---

### 一张表记住

| 写法 | 子元素继承什么 | 示例 |
|------|---------------|------|
| `40px` | 计算后的长度 | 始终是 `40px` |
| `2` | 数字本身 | `自身 font-size × 2` |
| `200%` | 父元素计算后的长度 | `30 × 200% = 60px`，子元素直接继承 `60px` |

---

### 一句话总结

- **长度（px、em、rem 等计算后的长度）**：子元素直接继承计算后的值。
- **无单位数字（number）**：子元素继承数字，再用自己的 `font-size` 重新计算，这是最推荐的写法。
- **百分比（%）**：父元素先根据自己的 `font-size` 计算出长度，子元素继承这个计算后的长度，不会重新计算。
