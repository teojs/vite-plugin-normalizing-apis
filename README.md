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
