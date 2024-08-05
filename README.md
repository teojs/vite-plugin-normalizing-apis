# @teojs/vite-plugin-normalizing-apis

## How to use

### Install

```bash
pnpm add @teojs/vite-plugin-normalizing-apis -D
```

### Configure
```ts
// vite.config.ts
import generatedApis from '@teojs/vite-plugin-normalizing-apis'

export default defineConfig({
  plugins: [
    generatedApis({
      apisDirs: 'src/service/apis',
      dts: 'src/service/types/api.d.ts',
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
