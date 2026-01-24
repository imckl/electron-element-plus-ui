import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      // 确保为所有入口生成类型声明
      include: ['src/**/*.ts', 'src/**/*.vue'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'main/index': resolve(__dirname, 'src/main/index.ts'),
        'preload/index': resolve(__dirname, 'src/preload/index.ts'),
        'renderer/index': resolve(__dirname, 'src/renderer/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs'
        return `${entryName}.${ext}`
      },
    },
    rollupOptions: {
      external: [
        'vue',
        'electron',
        'element-plus',
        '@element-plus/icons-vue',
      ],
      output: {
        globals: {
          vue: 'Vue',
          electron: 'electron',
          'element-plus': 'ElementPlus',
        },
      },
    },
  },
})
