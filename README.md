# @teojs/vite-plugin-normalizing-apis

一个 Vite 插件，用于自动化管理和规范化 API 接口。它可以自动扫描指定目录下的 API 文件，生成类型声明和虚拟模块，让你可以更优雅地管理和使用 API。

## 特性

- 📁 按目录结构自动组织 API
- 🔄 自动生成 TypeScript 类型声明
- 📝 支持自定义 API 模板
- 🚀 开发时热更新
- 💡 完整的类型提示

## 安装

```bash
# npm
npm install @teojs/vite-plugin-normalizing-apis -D

# yarn
yarn add @teojs/vite-plugin-normalizing-apis -D

# pnpm
pnpm add @teojs/vite-plugin-normalizing-apis -D
```

## 配置

### 1. 配置 Vite 插件

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import generatedApis from '@teojs/vite-plugin-normalizing-apis'

export default defineConfig({
  plugins: [
    generatedApis({
      apisDirs: 'src/service/apis', // API 文件存放目录
      dts: 'src/service/types.d.ts', // 类型声明文件输出路径
      tpl: 'src/service/tpl.ts', // API 模板文件路径
    }),
  ],
})
```

### 2. 添加类型声明引用

```ts
// types/vite-env.d.ts
/// <reference types="@teojs/vite-plugin-normalizing-apis/client" />
```

### 3. 导出 API

```ts
// src/service/index.ts
export * from 'virtual:normalizing-apis'
```

## 使用示例

### 1. 创建 API 文件

```ts
// src/service/apis/user/login.ts
import type { AxiosRequestConfig } from 'axios'
import http from '@/service/axios.config'

interface RequestConfig extends AxiosRequestConfig {
  data: {
    username: string
    password: string
  }
}

interface ResponseData {
  code: string
  message: string
  data: {
    token: string
    userId: string
  }
}

/**
 * @description 用户登录
 */
export default function api(config: RequestConfig): Promise<ResponseData> {
  return http<ResponseData>({
    method: 'post',
    url: '/api/user/login',
    ...config,
  })
}
```

### 2. 在组件中使用

```vue
<script setup lang="ts">
import { apis } from '@/service'

async function handleLogin() {
  try {
    const res = await apis.user.login({
      data: {
        username: 'admin',
        password: '123456',
      },
    })
    console.log('登录成功:', res.data)
  } catch (error) {
    console.error('登录失败:', error)
  }
}
</script>
```

## API 目录结构示例

```
src/service/apis/
├── user/
│   ├── login.ts
│   ├── logout.ts
│   └── profile.ts
├── product/
│   ├── list.ts
│   └── detail.ts
└── order/
    ├── create.ts
    └── list.ts
```

## 配置项说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| apisDirs | string | 是 | - | API 文件存放目录，相对于项目根目录 |
| dts | string | 是 | - | 类型声明文件的输出路径 |
| tpl | string | 否 | - | API 模板文件路径，新建 API 文件时会自动填充此模板内容 |

## 最佳实践

1. 将 API 按业务模块分类存放
2. 每个 API 文件只导出一个默认函数
3. 使用 TypeScript 编写 API，提供完整的类型定义
4. 为每个 API 添加清晰的注释说明

## 注意事项

1. API 文件必须导出默认函数
2. 确保 API 目录结构清晰合理
3. 建议使用 TypeScript 以获得更好的类型提示
4. 模板文件变更后需要重启开发服务器

## License

MIT
