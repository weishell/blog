---
title: object
date: 2025/04/20
---


## Object



### Object.entries与Array.entries对比

Object.entries() 和 Array.prototype.entries() 都用于获取键值对条目，但它们在用法、返回类型和应用场景上有显著差异。以下是它们的对比：

1. 调用方式与所属对象
Object.entries() 是 Object 的静态方法，需传入对象作为参数：

```js
const obj = { a: 1, b: 2 };
const entries = Object.entries(obj); // [ ['a', 1], ['b', 2] ]
```
Array.prototype.entries()是数组实例的方法，需通过数组调用：

```js
const arr = ['a', 'b'];
const iterator = arr.entries(); // 返回迭代器
```
2. 返回类型
   
Object.entries()返回一个二维数组，包含对象的可枚举属性键值对。

```js
// 示例输出：
[ ['key1', value1], ['key2', value2], ... ]
```

Array.prototype.entries():返回一个迭代器对象，可通过 for...of 或 next() 遍历，生成 [index, value] 形式的数组。

```
// 示例迭代结果：
for (const [index, value] of arr.entries()) {
  console.log(index, value); // 0 'a', 1 'b'
}
```

3. 处理的数据结构
   
Object.entries() 处理对象的自身可枚举属性，包括普通对象、数组（视为键值对集合）等。

```js
const arr = [1, , 3];
arr.foo = 'bar';
console.log(Object.entries(arr)); 
// 输出：[ ['0', 1], ['2', 3], ['foo', 'bar'] ]
```
Array.prototype.entries():处理数组的所有索引（包括稀疏位置），生成 [index, value]。空位的 value 为 undefined。

```js
const sparseArr = [1, , 3];
const iterator = sparseArr.entries();
console.log([...iterator]); 
// 输出：[ [0, 1], [1, undefined], [2, 3] ]
```

4. 稀疏数组处理

Object.entries() 忽略未赋值的稀疏索引，仅包含实际存在的属性。

Array.prototype.entries() 遍历所有索引（从 0 到 length-1），未赋值的索引对应 undefined。

5. 使用场景

Object.entries() 常用于对象转数组结构后的遍历或操作：

```js
// 遍历对象属性
for (const [key, value] of Object.entries(obj)) { ... }

// 转为 Map
const map = new Map(Object.entries(obj));
```

Array.prototype.entries(): 适用于需要同时操作数组索引和值的场景：

```js
// 获取索引和值
for (const [index, value] of arr.entries()) { ... }
```

##### 总结
特性	| Object.entries()	| Array.prototype.entries()
--------------------	| ------------------	| ------------------------
调用方式	|Object.entries(obj)	|arr.entries()
返回类型	|二维数组	|迭代器对象
处理目标	|对象的可枚举属性|	数组的所有索引（包括稀疏位置）
稀疏数据	|忽略未赋值的属性|	包含空位，值为 undefined
典型场景	|对象转数组、遍历属性、转为 Map	| 同时操作数组的索引和值