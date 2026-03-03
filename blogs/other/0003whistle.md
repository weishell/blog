---
title: whistle
date: 2025/12/22
tags:
 - other
categories:
 - other
---


## 抓包工具whistle


```js
npm install -g whistle
```

启动
```
w2 start
```

### 配置代理

#### 方案1
为了让电脑的流量经过Whistle，你需要设置系统代理。

1. Windows：进入“设置” > “网络和Internet” > “代理”，在手动代理设置中，将地址设为 127.0.0.1，端口设为 8899 并保存。
2. macOS：进入“系统设置” > “网络” > 选择当前网络 > “详细信息” > “代理”，勾选网页代理(HTTP)和安全网页代理(HTTPS)，均填入 127.0.0.1 和 8899。

#### 方案2
Proxy SwitchyOmega 3  等插件配置


### 安装根证书（关键步骤）
这是抓取HTTPS请求的必要步骤。

在浏览器中打开Whistle管理界面 (http://127.0.0.1:8899)。

找到并点击 HTTPS 菜单，然后选择 Download RootCA 下载根证书。

下载后，双击证书文件，根据系统指引，将其安装到“受信任的根证书颁发机构”存储中。

> 注：部分浏览器（如Chrome）可能使用独立的证书库。如果抓包时HTTPS请求仍显示为“Tunnel”或失败，可能需要在浏览器设置中单独导入并信任该证书。
