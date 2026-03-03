---
title: typescript
date: 2025/04/30
tags:
 - js
 - typescript
categories:
 - typescript
---

## typescript 


### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": false,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "typeRoots": ["./customeType/*.d.ts", "node_modules/@types"]
  },
  "include": ["./src/**/*", "./customeType/**/*.d.ts"],
  "exclude": ["node_modules",'xxxx']
}
```

### compilerOptions配置详解

配置项	|默认值|	作用描述|推荐值/示例	|注意事项
-|-|-|-|-
target|	es3	|指定编译后的 ECMAScript 目标版本（如 es5, es6, es2022）。	|es6 或 esnext|	现代项目建议 es6 以上以获得更好的性能和体积优化。
lib|	[]	|指定包含的内置 API 类型（如 dom, esnext, es2022）。|	["dom", "dom.iterable", "esnext"]	|浏览器项目需包含 dom，Node.js 项目需包含 esnext。
module|	commonjs|	指定模块规范（commonjs, es6, esnext, umd 等）。|	esnext（前端项目）或 commonjs（Node.js）|	`现代前端项目推荐 esnext 以支持 Tree Shaking。`
moduleResolution|	classic|	模块解析策略（node 或 classic）。|	node	|必须与 module 兼容（如 esnext + node）。
esModuleInterop|	false|	`允许通过 import 导入 CommonJS 模块（如 React）。` |	true	|开启以实现 CommonJS/ESM 互操作性。
strict|	false	|启用所有严格类型检查（包含 noImplicitAny, strictNullChecks 等子选项）。|	true	|建议始终开启以确保类型安全。
noImplicitAny	|false	|`禁止隐式的 any 类型（需显式声明）`|	true	|若从 JS 迁移可暂时关闭。
strictNullChecks|	false	|强制检查 null 和 undefined。|	true|	避免 undefined is not a function 错误。
strictFunctionTypes|	false	|对函数参数进行严格逆变检查。|	true	|增强函数类型安全性。
strictBindCallApply	|false	|对 bind, call, apply 方法严格检查参数。|	true	|避免运行时参数错误。
forceConsistentCasingInFileNames|	false|	强制文件名大小写一致性。|	true|	避免跨平台（Windows/Linux）文件引用问题。
skipLibCheck|	false|	跳过对声明文件（.d.ts）的类型检查。|	true（大型项目加速编译）	|`可能掩盖第三方库类型错误，慎用`
resolveJsonModule|	false	|允许导入 JSON 文件。	|true	|需配合 "module": "esnext" 或 "commonjs"。
allowJs	|false	|允许编译 JavaScript 文件。|	true（混合 TS/JS 项目）|	配合 checkJs 使用可对 JS 文件进行类型检查。
checkJs|	false|	对 JavaScript 文件进行类型检查（需 allowJs: true）。|	true	|逐步迁移 JS 到 TS 时有用。
jsx	|preserve|	处理 JSX 的方式（react, react-jsx, preserve, react-native）。|	"react-jsx"（React 17+）|	`React 17+ 使用新型 JSX 转换，无需手动引入 React。`
baseUrl|	undefined|	解析非相对模块的基目录。|	"."	|需配合 paths 使用。
paths|	{}	|`模块路径别名映射（如 @/* -> ./src/*）。`|	`{ "@/*": ["./src/*"] }`	|需在打包工具（Webpack/Vite）中同步配置别名。
typeRoots|	`node_modules/@types`|	指定类型声明文件的搜索目录。|	["./typesxxx", "node_modules/@types"]|	自定义类型文件应放在 ./typesxxx 目录下。
types|	[]|	显式包含特定的类型声明包（如 ["node", "react"]）。|	[]|（自动加载所有 typeRoots 下的类型）	若指定，则只加载列出的类型。
noEmit|	false|	不生成编译输出文件（仅类型检查）。|	true（配合 Babel/SWC 使用）|	需其他工具处理编译（如 Babel）。
isolatedModules|	false|	确保每个文件可作为独立模块编译（Babel 必需）。|	true	|使用 Babel 或 SWC 时必须开启。
allowSyntheticDefaultImports|	false	|允许从无默认导出的模块中默认导入（如 import React from 'react'）。|	true|	需与 esModuleInterop: true 配合使用。
useDefineForClassFields	|false	|使用 Object.defineProperty 定义类字段（符合 ECMAScript 标准）。	|true（面向现代浏览器）	|某些旧代码可能需要关闭此选项。
experimentalDecorators|	false	|启用装饰器语法（如 Angular 或 MobX）。	|true	|需配合 emitDecoratorMetadata 使用（若需要反射元数据）。
emitDecoratorMetadata	|false	|为装饰器生成类型元数据（需 experimentalDecorators: true）。|	true|（使用 TypeORM 或类反射库时）	会增加输出代码体积。
sourceMap	|false	|生成 .map 文件以调试原始 TypeScript 代码。|	true	|生产环境建议关闭。
outDir	|undefined	|指定编译输出目录（如 dist）。|	"./dist"	|需关闭 noEmit 或使用其他工具处理输出。
rootDir|	undefined|	指定输入文件的根目录（用于控制输出目录结构）。|	"./src"	|确保所有输入文件在此目录下。
composite|	false	|启用项目引用（Project References）优化。	|true（大型 Monorepo 项目）	|需配合 references 配置使用。

当 forceConsistentCasingInFileNames: false 时：在不区分大小写的文件系统（如 Windows）中可能不会报错，但会导致以下问题：在区分大小写的系统（如 Linux）中运行时崩溃。Git 仓库中可能意外出现重复文件（如 MyComponent.tsx 和 mycomponent.tsx）。

