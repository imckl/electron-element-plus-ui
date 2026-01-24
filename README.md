# @imckl/electron-element-plus-ui

Electron + Element Plus 应用的 UI 组件库。

## 特性

- **开箱即用**：提供标准的 Electron 应用布局
- **三栏布局**：Header + Sidebar + Main 结构
- **Tab 页管理**：内置 Tab 页容器、右键菜单、重命名对话框
- **配置式菜单**：通过 `menuItems` 配置侧边栏菜单
- **可折叠侧边栏**：支持展开/折叠
- **跨进程支持**：提供 main、preload、renderer 三进程入口
- **TypeScript**：完整的类型支持

## 安装

```bash
npm install @imckl/electron-element-plus-ui
```

## 快速开始

### 1. 主进程配置

```typescript
// src/main/index.ts
import { setupTabContextMenu } from '@imckl/electron-element-plus-ui/main'

// 创建窗口后调用
setupTabContextMenu(mainWindow)
```

### 2. 预加载脚本配置

```typescript
// src/preload/index.ts
import { exposeLayoutApi } from '@imckl/electron-element-plus-ui/preload'

// 暴露 API 到渲染进程
exposeLayoutApi()
```

### 3. 类型声明

```typescript
// src/env.d.ts
import type { ElectronLayoutApi } from '@imckl/electron-element-plus-ui'

declare global {
  interface Window {
    electronLayoutApi: ElectronLayoutApi
  }
}
```

### 4. 渲染进程使用

```typescript
// src/renderer/index.ts
import '@imckl/electron-element-plus-ui/dist/style.css'
```

```vue
<template>
  <ElectronLayout
    title="我的应用"
    :tabs="tabs"
    :menu-items="menuItems"
    v-model:active-tab="activeTabId"
    v-model:collapsed="isCollapsed"
    @tab-close="handleClose"
    @tab-rename="handleRename"
    @menu-select="handleMenuSelect"
  >
    <template #tab="{ tab }">
      <HomePage v-if="tab.type === 'home'" />
    </template>
  </ElectronLayout>

  <ElectronAboutDialog
    v-model="aboutDialogVisible"
    app-name="我的应用"
    :version="appVersion"
    copyright="© 2026"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElectronLayout,
  ElectronAboutDialog,
  type Tab,
  type MenuConfig,
} from '@imckl/electron-element-plus-ui/renderer'
import { House, Folder } from '@element-plus/icons-vue'

const menuItems: MenuConfig[] = [
  {
    index: 'main',
    icon: Folder,
    label: '主菜单',
    defaultOpen: true,
    children: [
      { index: 'home', icon: House, label: '首页' }
    ]
  }
]

const tabs = ref<Tab[]>([{ id: '1', type: 'home', title: '首页', closable: false }])
const activeTabId = ref('1')
const isCollapsed = ref(false)
const aboutDialogVisible = ref(false)
const appVersion = ref('1.0.0')

function handleMenuSelect(index: string) {
  // 处理菜单点击
}

function handleClose(tabId: string) {
  // 处理 Tab 关闭
}

function handleRename(tabId: string, newTitle: string) {
  const tab = tabs.value.find(t => t.id === tabId)
  if (tab) tab.title = newTitle
}
</script>
```

## 组件文档

- [ElectronLayout](./docs/ElectronLayout.md) - 三栏布局组件
- [ElectronAboutDialog](./docs/ElectronAboutDialog.md) - 关于对话框组件

## 开发

```bash
# 跳过下载 Electron binary（构建时不需要）
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install
npm run build
```

## License

MIT
