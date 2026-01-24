# @imckl/electron-element-plus-ui

Electron + Element Plus 应用的 UI 组件库。

## 特性

- **开箱即用**：提供标准的 Electron 应用布局
- **三栏布局**：Header + Sidebar + Main 结构
- **Tab 页管理**：内置 Tab 页容器
- **配置式菜单**：通过 `menuItems` 配置侧边栏菜单
- **可折叠侧边栏**：支持展开/折叠
- **TypeScript**：完整的类型支持

## 安装

```bash
npm install @imckl/electron-element-plus-ui
```

## 引入样式

```typescript
// src/renderer/index.ts 或 main.ts
import '@imckl/electron-element-plus-ui/dist/style.css'
```

## 快速开始

```vue
<template>
  <ElectronLayout
    title="我的应用"
    :tabs="tabs"
    :menu-items="menuItems"
    v-model:active-tab="activeTabId"
    v-model:collapsed="isCollapsed"
    @tab-close="handleClose"
    @menu-select="handleMenuSelect"
  >
    <template #tab="{ tab }">
      <HomePage v-if="tab.type === 'home'" />
    </template>
  </ElectronLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElectronLayout, type Tab, type MenuConfig } from '@imckl/electron-element-plus-ui/renderer'
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

function handleMenuSelect(index: string) {
  // 处理菜单点击
}

function handleClose(tabId: string) {
  // 处理 Tab 关闭
}
</script>
```

## 组件文档

- [ElectronLayout](./docs/ElectronLayout.md) - 三栏布局组件

## License

MIT
