# @teojs/vite-plugin-normalizing-apis

将每个接口分为单个文件存放，此插件会自动生成types文件，和虚拟模块供一次性引用，无需再手动去写配置和单个引入。

## 如何使用

### 安装

```bash
pnpm add @teojs/vite-plugin-normalizing-apis -D
```

### 配置
```ts
// vite.config.ts
import generatedApis from '@teojs/vite-plugin-normalizing-apis'

export default defineConfig({
  plugins: [
    generatedApis({
      apisDirs: 'src/service/apis',
      dts: 'src/service/types.d.ts',
      tpl: 'src/service/tpl.ts',
    }),
  ],
})
```

```ts
// types/vite-env.d.ts
/// <reference types="@teojs/vite-plugin-normalizing-apis/client" />
```

```ts
// src/service/index.ts
export * from 'virtual:normalizing-apis'
```

```ts
// src/service/apis/comm/login.ts
import type { AxiosRequestConfig } from 'axios'
import http from '@/service/axios.config'

interface IRequestConfig extends AxiosRequestConfig {
  data: {
    username: string
    password: string
  }
}

interface IResponseData {
  code: string
  message: string
  body: {
    token: string
  }
}

/**
 * @description demo
 */
export default function api(ctx: IRequestConfig): Promise<IResponseData> {
  return http<IResponseData>({
    method: 'post',
    url: '/api/demo',
    ...ctx,
  })
}
```

```vue
<script setup lang="ts">
import { apis } from '@service'

function login() {
  apis.comm
    .login({
      data: {
        username: '',
        password: '',
      },
    })
    .then((e) => {
      /// ...
    })
}
</script>
```

## 例子

```bash
git clone https://github.com/teojs/vite-plugin-normalizing-apis.git
cd vite-plugin-normalizing-apis
pnpm i
pnpm dev:demo
```

## 参数

| 字段            | 描述 |
| --------------- | ---------------- |
| apisDirs          | 存放接口的目录     |
| dts            |  声明文件输出路径       |
| tpl    |  模板文件路径，将在开发模式下自动为每个新的空ts文件填充模板    |
