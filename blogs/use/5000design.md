
---
title: 思想-设计
date: 2025/05/28
tags:
 - js
categories:
 - 思想
---

# 思想1

## 事件回滚思想

当给的数据中，有部分数据在操作中发现不符合规范，所有的操作都需要还原，如果先遍历一次判断是否有不符合的数据，则数据量较大时比较浪费时间，可考虑时间回滚的思维

方案 |	时间复杂度	|空间复杂度	|优点|	缺点
-|-|-|-|-
预检查方案|	O(2n) → O(n)|	O(1)|	数据安全，用户体验好	| 多一次遍历，仍为线性
事务回滚方案|	O(n)|	O(n) |	单次遍历	|需记录状态，实现复杂

```js
const updateIndentWithRollback = (params) => {
  const { editor, currentIndex, matchList, listId, indent } = params;
  
  // 1. 准备工作
  const opDelta = 1;
  const MAX = 20;
  const MIN = 0;
  
  // 2. 创建"后悔药"容器
  const undoList = []; // 存储要恢复的信息：{ 节点位置, 原始缩进值 }
  
  try {
    // 3. 收集要修改的节点位置
    const targets = [matchList[currentIndex][1]]; // 当前节点位置
    
    // 添加后续子节点位置
    for (let i = currentIndex + 1; i < matchList.length; i++) {
      const [item, path] = matchList[i];
      if (item.style.indent <= indent) break;
      targets.push(path);
    }
    
    // 4. 保存原始状态（制作后悔药）
    targets.forEach(path => {
      const node = Node.get(editor, path);
      undoList.push({
        path,
        origIndent: node.style.indent // 记住原来的缩进值
      });
    });
    
    // 5. 检查并计算新值
    const newValues = [];
    for (const { path, origIndent } of undoList) {
      const newIndent = origIndent + opDelta;
      
      // 检查是否超出范围
      if (newIndent > MAX || newIndent < MIN) {
        throw new Error(`缩进值超出范围`);
      }
      
      newValues.push({ path, newIndent });
    }
    
    // 6. 执行实际修改
    newValues.forEach(({ path, newIndent }) => {
      const node = Node.get(editor, path);
      Transform.setNodes(editor, {
        style: { ...node.style, indent: newIndent }
      }, { at: path });
    });
    
    // 7. 更新列表
    updateList(xxx);
    
  } catch (error) {
    // 8. 吃"后悔药"回滚
    undoList.forEach(({ path, origIndent }) => {
      const node = Node.get(editor, path);
      Transform.setNodes(editor, {
        style: { ...node.style, indent: origIndent } // 恢复原始值
      }, { at: path });
    });
    
    console.error('操作失败已回滚', error);
  }
};
```
