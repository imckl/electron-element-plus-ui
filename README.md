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
import { setupTabContextMenu, setupAboutDialog, showAboutDialog } from '@imckl/electron-element-plus-ui/main'

// 创建窗口后调用
setupTabContextMenu(mainWindow)
setupAboutDialog(mainWindow)

// 菜单项（可选）
{ label: '关于', click: () => showAboutDialog(mainWindow) }
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
      <component
        :is="getComponent(tab.type)"
        v-bind="tab.data"
        @title-change="(title) => updateTitle(tab.id, title)"
      />
    </template>
  </ElectronLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElectronLayout,
  useAboutDialog,
  useTabManager,
  type MenuConfig,
} from '@imckl/electron-element-plus-ui/renderer'
import HomePage from './components/HomePage.vue'
import { House, Folder } from '@element-plus/icons-vue'

type TabType = 'home'

// 关于对话框
useAboutDialog({
  appName: '我的应用',
  copyright: '© 2026',
})

// Tab 管理
const {
  tabs, activeTabId, addTab, updateTitle, getComponent, handleClose, handleRename,
} = useTabManager<TabType>({
  tabs: {
    'home': { title: '首页', component: HomePage, closable: false },
  },
  initialTab: 'home',
})

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

const isCollapsed = ref(false)

function handleMenuSelect(index: string) {
  // 处理菜单点击
}
</script>
```

## 组件文档

- [ElectronLayout](./docs/ElectronLayout.md) - 三栏布局组件
- [useTabManager](./docs/useTabManager.md) - Tab 状态管理
- [关于对话框](./docs/ElectronAboutDialog.md) - useAboutDialog / ElectronAboutDialog

## 开发

```bash
# 跳过下载 Electron binary（构建时不需要）
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install
npm run build
```

## 注意事项

### Preload 入口设计

用户项目需要将此库的 preload 入口打包进 preload 脚本（Electron 沙盒限制）。本库的 preload 入口设计遵循以下原则：

- ✅ 只包含 `contextBridge` 和 `ipcRenderer` 调用
- ✅ 只依赖纯常量和类型定义
- ❌ 不引入渲染进程代码（Vue 组件等）
- ❌ 不暴露危险的 Node.js API（fs、child_process 等）
- ❌ 不引入大型依赖库

## License

MIT
