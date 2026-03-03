---
title: 算法
date: 2025/12/11
tags:
 - js
categories:
 - 算法
---

## 复杂度

1. 算法的时间复杂度，定性（数量级）的描述算法运行的时间，用 O 符号表示。

常见的时间复杂度

- O(1) 常数级，无循环
- O(n) 线性，单层循环
- O(logn) 二分算法
- O(n*logn) 单层循环，嵌套二分算法
- O(n^2) 两层循环
- O(n^3) 三层循环，实际不可用

2. 空间复杂度：同时间复杂度，只是把时间换成空间。时间是 CPU 的消耗，空间是内存的消耗。



## 算法常见案例

#### 两数之和

```
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
```

1. 递归法：对于大型数组，递归可能导致调用栈溢出。
   
```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let index = 0;
    return findValue(nums, index, target);
};

function findValue(nums, index, target) {
    // 如果已经遍历完数组还没找到，返回空数组或null
    if (index >= nums.length - 1) {
        return null;
    }
    
    for(let j = index + 1; j < nums.length; j++) {
        if(nums[index] + nums[j] === target) {
            return [index, j];
        }
    }
    
    // 递归搜索下一个元素
    return findValue(nums, index + 1, target);
}

// 测试
const arr = twoSum([3, 2, 4], 6);
console.log(arr); // 应该输出 [1, 2]
```

2. 哈希表

```js
var twoSum = function(nums, target) {
    const map = new Map();
    for(let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if(map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [];
};
```

3. 双指针法：暴力循环法

```js
var twoSum = function(nums, target) {
    for(let i = 0; i < nums.length; i++) {
        for(let j = i + 1; j < nums.length; j++) {
            if(nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
};
```


##### 总结对比

方法	| 时间复杂度| 	空间复杂度| 	优点| 	缺点
-| -| -| -| -
递归方法| 	O(n²)| 	O(n)| 	递归思路清晰	| 栈溢出风险，性能最差
哈希表方法	| O(n)	| O(n)	| 最快，只需一次遍历	| 需要额外空间存储哈希表
双循环方法	| O(n²)| 	O(1)	| 空间效率最高，实现简单	| 时间效率低，大数据量慢


###### 实际应用建议
1. 优先使用哈希表方法 - 时间效率最高，是大数据量的首选
2. 如果内存极度受限 - 考虑双循环方法
3. 一般不推荐递归方法 - 既有双循环的时间复杂度，又有额外的栈空间开销

#### 计算股票的最大利润

```
给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。

你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
```

```js
// O(n²) 解法
var maxProfit = function(prices) {
    let maxProfit = 0;
    for(let i = 0; i < prices.length; i++) {
        for(let j = i + 1; j < prices.length; j++) {
            let profit = prices[j] - prices[i];
            if(profit > maxProfit) {
                maxProfit = profit;
            }
        }
    }
    return maxProfit;
};
```

```js
//更优的 O(n) 解法（一次遍历）
var maxProfit = function(prices) {
    let minPrice = Infinity;  // 记录至今为止的最低价格
    let maxProfit = 0;        // 记录最大利润
    
    for(let i = 0; i < prices.length; i++) {
        if(prices[i] < minPrice) {
            minPrice = prices[i];  
        } else if(prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;  
        }
    }
    
    return maxProfit;
};
```
