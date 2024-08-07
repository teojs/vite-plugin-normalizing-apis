import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    name: '@teojs/vite-plugin-normalizing-apis',
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    minify: !options.watch,
    clean: true,
    dts: true,
  }
})
