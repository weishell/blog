---
title: OTHER
date: 2026/05/21
tags:
 - OTHER
categories:
 - OTHER
---

现象|可能原因|解决方案|备注
-|-|-|-
秒传功能无效|公司网络安全限制|白名单|当时定位时，只是文件类的非常慢，视频类的虽然不快，但是总体速度只是慢了3-4倍，而文件慢了30倍，所以定位方向不好确定，以为是库的配置问题，或者是因为做了采样过于优化的问题，最后回家操作发现MD5速度还是很快的
ws关不掉|作为子页面嵌入，iframe一直没被销毁|-|因为为了优化启动速度，做了个iframe壳子一直用活，但是因此子页面无法销毁，ws一直挂着的，通过network中对应ws的time状态一直是挂起(pending)确定问题
https中嵌入http页面无反馈|HTTPS 页面要求所有资源也必须是安全的（HTTPS 或 wss），否则攻击者可以篡改 HTTP 内容，从而劫持你的 HTTPS 页面。iframe 属于主动混合内容（可以执行脚本、修改 DOM），风险极高，所以浏览器一律拦截。|把 iframe 的源升级为 HTTPS|谷歌可能看不到报错，edge控制台可能有这个报错：`Mixed Content: The page at 'https://example.com/' was loaded over HTTPS,but requested an insecure frame 'http://other.com/'. This request has beenblocked; the content must be served over HTTPS.`
url打不开链接|有#等特殊字符|需要转义|是局部转义，不去转链接中路由部分的斜杠等信息，而且是因为链接中后续接了?xxx=xxx等参数的情况下需要，如果没有这个场景，可能也不需要这样处理的
