---
title: TOOL
date: 2026/06/01
tags:
 - TOOL
categories:
 - TOOL
---



## pnpm 的优点

#### 一、背景：npm / yarn 的依赖管理问题

##### 1. npm2（嵌套结构）

npm2 采用嵌套式 node_modules 结构：
```
node_modules/
  A/
    node_modules/
      B/
        node_modules/
          C/
```
问题：
- 依赖大量重复安装，占用磁盘空间大
- 目录层级过深（Windows 路径长度限制）
- 依赖结构复杂

---

##### 2. npm3 / yarn（扁平化结构）

npm3 和 yarn 采用 hoisting（扁平化）策略：

```
node_modules/
  A
  B
  C
```

优点：
- 减少重复依赖安装
- 提升依赖查找速度

缺点：
- 幽灵依赖问题（未声明依赖却可以使用）
- 依赖结构不稳定（安装顺序影响结果）
- 同一依赖不同版本仍会重复安装

---

#### 二、pnpm 的核心实现原理

pnpm 采用不同于扁平化的依赖管理方式。

##### 1. 全局 Store（内容寻址存储）

pnpm 会将所有依赖存储在全局 store：

~/.pnpm-store

特点：
- 每个依赖版本只存一份
- 使用内容 hash 标识
- 多项目共享依赖

---

##### 2. 硬链接 + 软链接结构

node_modules 并不直接存放真实文件，而是通过链接组织：

```
node_modules/
  lodash -> .pnpm/lodash@4.x
  react  -> .pnpm/react@18.x
```

```
node_modules/.pnpm/
  lodash@4.x（来自 store 的硬链接）
  react@18.x（来自 store 的硬链接）
```

结构说明：
- store：真实文件
- .pnpm：项目级依赖快照（硬链接）
- node_modules：软链接使用结构

---

#### 三、pnpm 的核心优势

##### 1. 节省磁盘空间

- 所有依赖只存一份
- 多项目共享 store
- 特别适合 monorepo

---

##### 2. 安装速度更快（多数场景）

- 不重复下载依赖
- 不重复解压依赖
- 直接复用 store 中内容

---

##### 3. 解决幽灵依赖问题

pnpm 默认严格依赖隔离：

- 只能使用 package.json 中声明的依赖
- 禁止隐式依赖访问

从机制上避免幽灵依赖

---

##### 4. 依赖结构更稳定

- 不依赖 hoisting 顺序
- 安装结果一致
- 依赖关系更清晰可预测

---

##### 5. monorepo 支持优秀

- 原生 workspace 支持
- 包之间通过软链接引用
- 依赖共享但保持隔离

---

#### 四、pnpm 的缺点

##### 1. 兼容性问题

部分旧项目依赖扁平结构：

- 可能出现 module not found
- 需要 shamefully-hoist 兼容

---

##### 2. 学习成本略高

需要理解：
- store
- hard link
- symlink
- virtual store

---

##### 3. 调试路径较复杂

node_modules -> .pnpm -> store

相比 npm 更绕

---

#### 五、总结

pnpm 通过“全局内容寻址存储 + 硬链接复用 + 软链接组织 node_modules”的方式，实现了依赖的高效复用与严格隔离，解决了 npm 和 yarn 在幽灵依赖与重复安装方面的问题，在磁盘利用率和 monorepo 场景下具有明显优势，但在老项目兼容性方面需要额外处理。
