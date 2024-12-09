import path from 'node:path'
import generatedApis from '@teojs/vite-plugin-normalizing-apis'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

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
