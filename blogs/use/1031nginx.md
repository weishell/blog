---
title: 应用-nginx
date: 2025/04/08
tags:
 - nginx
categories:
 - 应用
---

## nginx

当在https服务中存在iframe使用了http请求，可能会被拦截，如果谷歌浏览器无法查看具体错误信息，可尝试使用`其他浏览器`如EDGE。
```
Mixed Content: The page at '<URL>' was loaded over HTTPS, but requested an insecure frame '<URL>'. This request has been blocked; the content must be served over HTTPS.

Mixed Content: The page at 'https://aaa.cn/ff?id=xxxx' was loaded over HTTPS, but requested an insecure frame 'http://yyy/onlinePreview?url=xxxx'.
This request has been blocked; the content must be served over HTTPS.
```

需要通过nginx代理处理：

```
server {
    listen 443 ssl;
    server_name xxxxxx;

    # SSL 证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/privkey.pem;

    # 代理预览服务
    location /proxy-preview {
        # proxy_pass http://xxxxx; # 如果可以配置变量的话,可适配多个环境
        proxy_pass ${ONENAME_XXX}/onlinePreview # ONENAME_XXX
        proxy_set_header Host $proxy_host;  # 传递目标域名
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 处理 URL 参数（关键！）
        proxy_set_header X-Original-URI $request_uri;
        proxy_redirect off;
    }

}
```

### 前端ci部署

如果集成了gitlab或者其他的部署，前端项目中ci目录去进行相应的配置，改变了本地的default.conf中的${SOME_ONE}之类的，实际还是要通过脚本更改到nginx。
```bash
#!/bin/bash

# 环境变量动态替换,生成实际的 nginx 配置文件
# 多个变量一次写入，防止覆盖
envsubst '${SOME_ONE}','${SOME_RWO}'  < /tmp/default.conf > /etc/nginx/conf.d/default.conf

# 把环境变量写入/tmp/index.html，通过构建生成实际的index.html文件
envsubst '${ENV}' < /tmp/index.html > /xxx/nginx/html/index.html
```
> 同时还需要如gitlab中.gitlab-ci.yml对应的文件,后端或者运维也需要在云服务上给对应的变量去设置对应的值
