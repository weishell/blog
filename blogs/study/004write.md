---
title: WRITE
date: 2026/03/03
tags:
 - JS
categories:
 - JS
---

### 防抖和节流

```html
<!DOCTYPE html>
<html>
<head>
    <title>Debounce 用法示例</title>
</head>
<body>
    <h3>防抖示例（打开控制台查看输出）</h3>
    <input type="text" id="searchInput" placeholder="输入内容触发防抖搜索" />
    <button id="cancelBtn">手动取消未执行的搜索</button>

    <script>
        // 定义防抖函数（你提供的版本）
        function debounce(fn, wait, immediate = false) {
            let timer = null;
            function debounced(...args) {
                const context = this;
                if (timer) clearTimeout(timer);

                if (immediate && !timer) {
                    fn.apply(context, args);
                }

                timer = setTimeout(() => {
                    if (!immediate) {
                        fn.apply(context, args);
                    }
                    timer = null;
                }, wait);
            }

            debounced.cancel = function() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                    console.log('防抖任务已取消');
                }
            };

            return debounced;
        }

        // 原始函数：模拟搜索请求
        function search(query) {
            console.log(`执行搜索：${query}`);
            // 实际场景中这里会发 AJAX 请求
        }

        // 创建防抖版本，等待 500ms
        const debouncedSearch = debounce(search, 500);

        // 监听输入框事件
        const input = document.getElementById('searchInput');
        input.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });

        // 手动取消按钮
        document.getElementById('cancelBtn').addEventListener('click', () => {
            debouncedSearch.cancel();
        });

        // --- 额外演示：通过代码模拟连续调用并取消 ---
        console.log('开始模拟连续调用...');
        const testFn = debounce((msg) => console.log(msg), 300);

        testFn('调用1'); // 触发立即执行？immediate=false 所以不会立即执行
        testFn('调用2'); // 重置定时器
        testFn('调用3'); // 重置定时器，只有最后一次有效

        // 2秒后取消最后一个调用（如果还没执行）
        setTimeout(() => {
            testFn.cancel(); // 取消未执行的定时器
            console.log('已取消最后一个防抖调用');
        }, 200);

        // 再演示一个 immediate=true 的例子
        const immediateFn = debounce((msg) => console.log('立即执行:', msg), 300, true);
        console.log('immediate 模式：第一次立即执行');
        immediateFn('A'); // 立即输出
        immediateFn('B'); // 被忽略（timer 不为空）
        setTimeout(() => immediateFn('C'), 400); // 400ms后 timer 已重置，会立即执行
    </script>
</body>
</html>
```

```js
function throttle(fn, wait, options = { leading: true, trailing: true }) {
    let timer = null;
    let previous = 0; // 上次执行的时间戳

    function throttled(...args) {
        const context = this;
        const now = Date.now();

        // 如果 leading 设为 false，则将 previous 设为当前时间，使第一次不满足条件
        if (!previous && options.leading === false) {
            previous = now;
        }

        const remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            // 时间差达到 wait，执行函数
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            previous = now;
            fn.apply(context, args);
        } else if (!timer && options.trailing !== false) {
            // 距离下次执行还有剩余时间，且允许末尾执行，设置定时器
            timer = setTimeout(() => {
                // 如果 leading 为 false，需要重置 previous 为 0 或当前时间？
                // 标准实现：如果 leading 为 false，则 previous 置为 0，让下一次触发重新判断
                previous = options.leading === false ? 0 : Date.now();
                timer = null;
                fn.apply(context, args);
            }, remaining);
        }
    }

    // 取消功能
    throttled.cancel = function() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        previous = 0; // 重置上次执行时间
    };

    return throttled;
}
```
