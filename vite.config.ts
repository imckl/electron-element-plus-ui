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
      // 映射下划线前缀路径到无前缀路径
      // 源码: src/_renderer/ → 输出: dist/renderer/
      beforeWriteFile: (filePath, content) => {
        // 转换文件输出路径
        const newPath = filePath
          .replace('/_renderer/', '/renderer/')
          .replace('/_main/', '/main/')
          .replace('/_preload/', '/preload/')
          .replace('/_shared/', '/shared/')
        // 转换文件内容中的 import 路径
        const newContent = content
          .replace(/\/_renderer\//g, '/renderer/')
          .replace(/\/_main\//g, '/main/')
          .replace(/\/_preload\//g, '/preload/')
          .replace(/\/_shared\//g, '/shared/')
        return { filePath: newPath, content: newContent }
      },
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'main/index': resolve(__dirname, 'src/_main/index.ts'),
        'preload/index': resolve(__dirname, 'src/_preload/index.ts'),
        'renderer/index': resolve(__dirname, 'src/_renderer/index.ts'),
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
