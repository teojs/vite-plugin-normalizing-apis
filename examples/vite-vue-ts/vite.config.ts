import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import generatedApis from '@teojs/vite-plugin-normalizing-apis'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    generatedApis({
      apisDirs: 'src/service/apis',
      dts: 'src/service/types.d.ts',
      tpl: 'src/service/tpl.ts',
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
