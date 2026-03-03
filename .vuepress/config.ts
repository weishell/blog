import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'

export default defineUserConfig({
  title: "未必",
  description: "Just playing around",
  // bundler: viteBundler(),
  bundler: viteBundler({
    viteOptions: {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use "element-plus/theme-chalk/src/index.scss" as *;`
          }
        }
      }
    }
  }),
  head: [
      ['link', { rel: 'icon', href: '/logo.png' }],
  ],
  // bundler: webpackBundler(),
  theme: recoTheme({
    logo: "/logo.png",
    author: "weishan",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/weishell/vuepress2",
    docsBranch: "main",
    docsDir: "example",
    lastUpdatedText: "最后更新",
    // series 为原 sidebar
    series: {
      "/docs/theme-reco/": [
        {
          text: "module one",
          children: ["home", "theme"],
        },
        {
          text: "module two",
          children: ["api", "plugin"],
        },
      ],
      "/docs/top/":[
        {
          text:'前端基础',
          children:['0001object']
        }
      ]
    },
    navbar: [
      { text: "主页", link: "/" },
      { text: "分类", link: "/categories/reco/1.html" },
      { text: "标签", link: "/tags/chajianku/1.html" },
      {
        text: "Docs",
        children: [
          { text: "vuepress-reco", link: "/docs/theme-reco/theme" },
          {text:"top",link:'/docs/top/0001object'},
          { text: "vuepress-theme-reco", link: "/blogs/other/guide" },
        ],
      },
    ],
    // commentConfig: {
    //   type: 'valine',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
});
