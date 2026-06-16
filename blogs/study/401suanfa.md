---
title: 算法
date: 2026/06/16
tags:
 - 算法
categories:
 - 算法
---

## 1. 判断一个单词是否回文

回文是指把相同的词汇或句子，在上下文中调换位置或颠倒过来，产生首尾回环的情趣，叫做回文，也叫回环。比如 `redivider`。

#### 方法一：使用 reverse()
O(n) + O(m) + O(n) = O(2n + m) ≈ O(n)（常数系数和低阶项忽略）

```js
function checkPalindrom(str) {
	return str == str.split('').reverse().join('');
}
```

##### 改进版本（去除空格和大小写敏感）

```js
// 去掉代码中空格
function checkPalindrom(str) {
  str = str.replace(/\W/g, '').toLowerCase();
  return (str == str.split('').reverse().join(''));
}
```

#### 方法二：手动反转字符串

思路：将单词换成字符串A，从后往前循环字符串A，将循环出来的字符拼接成新的字符串B，比较字符串A和B，得出结论。

> 从计算机科学理论（大 O 记法）严格来讲，这是 O(n²)（因为 += 被视为重分配拷贝）,但是现代浏览器的V8引擎实现优化了接近 O(n)

```js
function isPalindrome(x) {
	let str = x + '';
	let newStr = '';
	for(let i = str.length - 1; i >= 0; i --) {
		newStr += str[i]
	}
	return newStr === str;
}
```

#### 方法三：中心对称比较

以中间数为节点，判断左右两边首尾是否相等。

> 中心对称比较（双指针）—— 时间 O(n)，空间 O(1)

```js
/**
 * 以中间数为节点，判断左右两边首尾是否相等
 * @param {number} x
 * @return {boolean}
 */
function isPalindrome(x) {
  x = '' + x
  for(let i = 0 ; i < x.length/2; i++) {
    if (x[i] !== x[x.length - i - 1]) {
      return false
    }
  }
  return true
}
```

## 2. 去掉一组整型数组的重复值

<!-- 比如 -->
输入：
[1,2,3,12,1,14,3]

输出：
[1,2,3,12,14]

#### 方法1：哈希表（对象键值对）

时间复杂度：O(n)（只需遍历原数组一遍）

空间复杂度：O(n)（哈希表 + 新数组）
```js
let unique = function(arr) {
	let hashTable = {};
	let data = [];
	for(let i = 0 ; i < arr.length; i ++) {
		if(!hashTable[arr[i]]) {
			hashTable[arr[i]] = true;
			data.push(arr[i]);
		}
	}
	return data;
}
module.exports = unique;
```

#### 方法二：

时间复杂度：O(n)（插入 Set 为 O(1) 均摊，展开为 O(n)）

空间复杂度：O(n)（Set 占一份内存 + 新数组占一份内存，常数系数稍大）
```js
function unique (arr) {
  return Array.from(new Set(arr))
}

或简写为：
[...new Set(arr)] 

```

#### 方法3
性能极差：双重循环 + 数组元素的物理移动。
```js
function unique(arr){            
        for(var i=0; i<arr.length; i++){
            for(var j=i+1; j<arr.length; j++){
                if(arr[i]==arr[j]){         //第一个等同于第二个，splice方法删除第二个
                    arr.splice(j,1);
                    j--;
                }
            }
        }
return arr;
}
```

#### 方法4：
时间复杂度：O(n²)（外层 n 次，内层 indexOf 扫描新数组，平均长度 n/2）

空间复杂度：O(n)（新数组存放结果）
```js
function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i]) === -1) {
            array.push(arr[i])
        }
    }
    return array;
}
```
