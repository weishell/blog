---
title: 应用-视频相关
date: 2025/03/30
tags:
 - js
 - video
categories:
 - 应用
---


## 前端视频

H5支持VIDEO标签的使用，使得前端可以更好的去实现视频播放的功能，在此基础上，出现了很多的播放器。

### xgplayer



### plyr



### 视频的注意事项

> 视频如果默认实现分片操作，状态码为`206`，后端如果再包一层，可能会造成浏览器自身的分片失效，会**持续下载整个视频**。需要注意！

> 2.4MB transferred over network， resourcesize：10.5MB,当实现了206分片后，悬浮到network上可以看到resourcesize会持续变化，当拖动滚动条时，会有新的一次请求发生
