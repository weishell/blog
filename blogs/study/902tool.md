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


## pnpm 中硬链接与软链接的作用

### 1. npm 存在的问题

在 npm 中，每个项目都会维护自己独立的 `node_modules`：

```text
project-a
└── node_modules
    └── lodash

project-b
└── node_modules
    └── lodash
```

即使两个项目使用的是同一个版本的 `lodash`，磁盘中仍然会保存两份文件。

这会带来几个问题：

- 占用大量磁盘空间
- 安装时需要频繁复制文件
- `node_modules` 体积庞大
- 安装速度受磁盘 IO 影响较大

---

### 2. pnpm 的核心思想

pnpm 通过以下三种机制解决上述问题：

```text
Content Addressable Store（内容寻址存储）
+
Hard Link（硬链接）
+
Symbolic Link（软链接）
```

#### Content Addressable Store（CAS）

所有下载过的包都会被统一存放到全局 Store：

```text
~/.pnpm-store
```

例如：

```text
~/.pnpm-store
└── lodash@4.17.21
```

同一个版本的包只会存储一次。

多个项目共享这一份文件，从根本上减少磁盘占用。

---

### 3. 硬链接（Hard Link）的作用

当项目安装依赖时，pnpm 并不会把 Store 中的文件复制到项目目录。

而是通过硬链接将文件映射到项目中的 `.pnpm` 目录：

```text
~/.pnpm-store
└── lodash

project
└── node_modules
    └── .pnpm
        └── lodash@4.17.21
```

实际结构类似：

```text
store/lodash/index.js
        ↑
    Hard Link
        ↓
.pnpm/lodash/index.js
```

#### 硬链接特点

多个文件名指向同一个 inode：

```text
inode123
├── store/lodash/index.js
└── .pnpm/lodash/index.js
```

因此：

- 文件内容只保存一份
- 几乎不额外占用磁盘空间
- 创建速度远快于复制文件

#### 注意

硬链接链接的是文件，而不是目录。

因此实际上是：

```text
store
└── lodash
    ├── index.js
    ├── package.json
    └── ...
```

每个文件分别建立硬链接到：

```text
.pnpm/lodash@4.17.21/node_modules/lodash
```

---

### 4. 为什么需要 .pnpm 目录

很多人以为 `.pnpm` 只是缓存目录，其实不是。

`.pnpm` 的真正作用是：

**在项目内构建一棵符合 Node.js 模块解析规则的依赖树。**

例如：

```text
node_modules
└── .pnpm
    └── express@4.18.2
        └── node_modules
            └── express
```

Node.js 在执行：

```js
require('express')
```

时，依然能够按照标准的模块查找规则工作。

---

### 5. 软链接（Symbolic Link）的作用

项目根目录中的依赖并不是真实目录，而是软链接：

```text
node_modules
└── express -> .pnpm/express@4.18.2/node_modules/express
```

访问流程如下：

```text
require('express')

↓

node_modules/express

↓（软链接）

.pnpm/express@4.18.2/node_modules/express

↓（硬链接）

~/.pnpm-store
```

因此形成了完整结构：

```text
node_modules
    ↓ 软链接

.pnpm
    ↓ 硬链接

.pnpm-store
```

---

### 6. 为什么 pnpm 能解决幽灵依赖（Ghost Dependency）

#### npm 的扁平化结构

假设项目安装了：

```json
{
  "dependencies": {
    "react": "^18"
  }
}
```

但开发者写了：

```js
import _ from 'lodash'
```

虽然项目没有声明 lodash：

```json
{
  "dependencies": {
    "react": "^18"
  }
}
```

代码却可能正常运行。

原因是 npm 会把很多依赖提升（hoist）到顶层：

```text
node_modules
├── react
├── lodash
├── axios
```

导致未声明的依赖也能被访问。

这种现象称为：

```text
Ghost Dependency（幽灵依赖）
```

---

#### pnpm 的结构

pnpm 会严格维护依赖关系：

```text
express
└── node_modules
    └── body-parser
```

每个包只能访问：

```json
dependencies
```

中明确声明的依赖。

如果没有安装：

```js
require('lodash')
```

将直接报错。

因此：

- 依赖关系更加清晰
- 避免线上环境问题
- 符合 Node.js 官方模块解析规范

---

### 7. pnpm 为什么安装速度快

#### 原因一：全局缓存

同一个包只下载一次：

```text
下载一次
永久复用
```

---

#### 原因二：硬链接代替文件复制

传统方式：

```text
复制文件
```

pnpm：

```text
创建硬链接
```

大量减少磁盘 IO。

---

#### 原因三：Content Addressable Store

pnpm 使用内容寻址存储（CAS）：

```text
文件内容
   ↓
计算 Hash
   ↓
作为存储地址
```

内容完全相同的文件：

```text
Hash 相同
    ↓
只存储一次
```

进一步减少磁盘占用。

---

### 8. pnpm 整体工作流程

```text
npm install express

        ↓

下载包

        ↓

存入 ~/.pnpm-store

        ↓

通过硬链接创建到 .pnpm

        ↓

通过软链接暴露到 node_modules

        ↓

Node.js 正常加载依赖
```

最终目录结构：

```text
node_modules
├── express -> .pnpm/express@4.18.2/node_modules/express
└── .pnpm
    └── express@4.18.2
        └── node_modules
            └── express
                ↑
             Hard Link
                ↑
~/.pnpm-store
```

---

### 总结

pnpm 通过 **Content Addressable Store + 硬链接 + 软链接** 实现高效依赖管理。

- 所有包统一存储在全局 Store 中；
- Store 中的文件通过硬链接映射到项目的 `.pnpm` 目录；
- 根目录 `node_modules` 通过软链接暴露依赖入口；
- 同一个包只存储一次，显著节省磁盘空间；
- 硬链接代替文件复制，大幅提升安装速度；
- `.pnpm` 构建符合 Node.js 规范的依赖树；
- 每个包只能访问自己声明的依赖，从而彻底解决幽灵依赖问题。

这也是 pnpm 相比 npm 和 Yarn Classic 的核心优势。


