---
title: slatejs
date: 2025/04/17
tags:
 - 插件库
categories:
 - plugin
---

# slatejs


## slatejs常见问题


### Editor.withoutNormalizing
在 Slate.js 中，Editor.withoutNormalizing 的作用是 批量操作时临时禁用自动规范化（Normalization）。它的使用与否会直接影响编辑器对文档结构的处理逻辑和性能表现。以下是具体区别分析：

```js
Editor.withoutNormalizing(editor, () => { 
  Transforms.removeNodes(editor, { at: path1 });
  insertFun(editor, path1);
  Transforms.select(editor, path1);
});
```

##### 特点：
1. 禁用自动规范化： 在回调函数内的所有操作（removeNodes、insertEmptyParagraph、select）期间，Slate 的自动规范化逻辑会被临时禁用。
2. 合并规范化： 所有操作完成后，仅触发一次规范化（而不是每个操作后都触发）。
3. 性能优化： 避免多次中间状态的规范化计算，提升连续操作的性能。
4. 操作原子性：确保多个操作被视为一个原子操作，避免中间状态不一致。

#### 何时应该使用 Editor.withoutNormalizing？
1. 连续多个操作（如删除节点 + 插入新内容 + 聚焦）。
2. 性能敏感场景（如高频内容更新）。
3. `路径依赖操作（避免中间规范化导致路径失效）。`
4. `输入法兼容性优化（如中文/日文输入）。`


### Transform.delete与removeNodes的区别

关键区别
特性	|Transform.delete	|Transform.removeNodes
-|-|-
操作目标	|文本内容（字符）|	节点（如段落、图片）
参数	|范围（Range）|	路径（Path）
影响范围	|修改文本，不删除节点|	直接移除节点
合并相邻节点|	可能合并文本节点|	不合并，直接删除

示例场景：

+ 删除文字：选中一段文字并按退格键 → 使用 Transform.delete。
+ 删除整个段落：右键删除某个段落块 → 使用 Transform.removeNodes。

```js
Transforms.delete(editor: Editor, options?)
Delete text in the document.

Options: {
 at?: Location, distance?: number,
 unit?: 'character' | 'word' | 'line' | 'block', //颗粒度
 reverse?: boolean,
 hanging?: boolean,
 voids?: boolean
}
```

```js
// 这种明确了删除位置，可以删除对应的block块
Transforms.delete(editor,{at:[1]})
// 如过没有明确位置，删除对应的选区，如果没有选区，则删除光标后的内容（包括复杂的插件如图片，如果光标位于两个段落之间，会合并两个段落）
Transforms.delete(editor)
```
removeNodes如果光标在某一行，没加其他参数，就会删除当前节点
```js
// 而removeNodes是针对节点层的，即使这种写法，也是删除整个节点1
Transforms.removeNodes(editor, {
   at: {
     anchor: { path: [1], offset: 3 },
     focus: { path: [1], offset: 5 }
   }
 })
```

  :::tip 提示
  总结：delete 通常针对**文本**，removeNodes针对**节点**。
  :::

### Editor.node 和 Node.get
```js
type NodeEntry<T extends Node = Node> = [T, Path]
type Location = Path | Point | Range
Editor.node(editor: Editor, at: Location, options?) => NodeEntry
// 获取某个位置的节点。
```
```js
Node.get(root: Node, path: Path) => Node
// 获取特定 所引用的后代节点path。如果路径为空数组，则获取根节点本身。
Node.getIf(root: Node, path: Path) => Node | undefined
// 获取指定路径的后代节点，undefined如果该节点不存在则返回。这是一种更安全的替代方案，Node.get()因为即使路径无效也不会抛出错误。
```

```js
const [node, path1] = Editor.node(editor, path0);
const node  = Node.get(editor, path0)
```

> 当创建的实例editor上符合Node的构造，也可以指定Node.get(editor,xxx)此时结果和Editor.node一致
> path0可以是相对路径，所以path1最后相当于对路径规整，二者可能相等，也可能不一致

### slatejs其他注意事项

1. 光标：某些操作会影响光标的位置，需要使用event.prevent()做额外处理

### slatejs类似插件库
1. Plate：基于 Slate.js 构建的富文本编辑器框架，专注于插件化开发，提供核心、插件、组件和原语四大模块，支持高度定制化和扩展性。[链接](https://github.com/udecode/plate)
2. TipTap：无头（Headless）富文本编辑器框架，支持完全自定义 UI 和实时协作功能。[链接](https://github.com/ueberdosis/tiptap)
3. Lexical：由 Facebook 开发的可扩展文本编辑器框架，强调可靠性、可访问性和性能。[链接](https://github.com/facebook/lexical)
