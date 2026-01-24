# @imckl/electron-element-plus-ui

Electron + Element Plus 应用的 UI 组件库。

## 特性

- **开箱即用**：提供标准的 Electron 应用布局
- **三栏布局**：Header + Sidebar + Main 结构
- **Tab 页管理**：内置 Tab 页容器
- **配置式菜单**：通过 `menuItems` 配置侧边栏菜单（推荐）
- **可折叠侧边栏**：支持展开/折叠
- **高度可定制**：通过 Slots 自定义各区域内容
- **TypeScript**：完整的类型支持

## 安装

```bash
npm install @imckl/electron-element-plus-ui
```

## 引入样式

在应用入口文件中导入样式：

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
    <!-- Tab 内容 -->
    <template #tab="{ tab }">
      <HomePage v-if="tab.type === 'home'" />
      <SettingsPage v-else-if="tab.type === 'settings'" />
    </template>
  </ElectronLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElectronLayout, type Tab, type MenuConfig } from '@imckl/electron-element-plus-ui/renderer'
import { House, Setting, Folder } from '@element-plus/icons-vue'

// 菜单配置
const menuItems: MenuConfig[] = [
  {
    index: 'main',
    icon: Folder,
    label: '主菜单',
    defaultOpen: true,
    children: [
      { index: 'home', icon: House, label: '首页' },
      { index: 'settings', icon: Setting, label: '设置' }
    ]
  }
]

// Tab 状态
const tabs = ref<Tab[]>([
  { id: '1', type: 'home', title: '首页', closable: false }
])
const activeTabId = ref('1')
const isCollapsed = ref(false)

function handleMenuSelect(index: string) {
  if (index === 'home' || index === 'settings') {
    addTab(index)
  }
}

function addTab(type: string) {
  const id = `tab-${Date.now()}`
  tabs.value.push({ id, type, title: type === 'home' ? '首页' : '设置', closable: true })
  activeTabId.value = id
}

function handleClose(tabId: string) {
  const index = tabs.value.findIndex(t => t.id === tabId)
  if (index > -1) {
    tabs.value.splice(index, 1)
    if (activeTabId.value === tabId && tabs.value.length > 0) {
      activeTabId.value = tabs.value[Math.min(index, tabs.value.length - 1)].id
    }
  }
}
</script>
```

## API

### Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 应用标题（必填） |
| `tabs` | `Tab[]` | - | Tab 列表（必填） |
| `menuItems` | `MenuConfig[]` | - | 菜单配置（推荐方式） |
| `headerHeight` | `string` | `'50px'` | 标题栏高度 |
| `sidebarWidth` | `string` | `'180px'` | 侧边栏宽度（展开） |
| `sidebarCollapsedWidth` | `string` | `'64px'` | 侧边栏宽度（折叠） |
| `showCollapseButton` | `boolean` | `true` | 是否显示折叠按钮 |

### v-model

| 名称 | 类型 | 说明 |
|------|------|------|
| `activeTab` | `string` | 当前激活的 Tab ID |
| `collapsed` | `boolean` | 侧边栏折叠状态 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `tab-close` | `(tabId: string)` | Tab 关闭请求 |
| `tab-contextmenu` | `(tab: Tab, event: MouseEvent)` | Tab 右键菜单 |
| `menu-select` | `(index: string)` | 菜单项选择（使用 menuItems 时） |

### Slots

| Slot | 参数 | 说明 |
|------|------|------|
| `header-left` | - | 标题左侧额外内容 |
| `header-right` | - | 标题右侧额外内容 |
| `sidebar` | `{ collapsed: boolean }` | 侧边栏内容（逃生舱，无 menuItems 时使用） |
| `tab` | `{ tab: Tab }` | Tab 页内容 |

### 类型定义

```typescript
interface Tab {
  id: string        // 唯一标识
  type: string      // 类型（用于条件渲染）
  title: string     // 显示标题
  closable?: boolean // 是否可关闭，默认 true
}

// 菜单项
interface MenuItem {
  index: string       // 唯一标识
  label: string       // 显示文本
  icon?: Component    // 图标组件
  disabled?: boolean  // 是否禁用
}

// 分组菜单
interface MenuGroup extends MenuItem {
  children: MenuItem[] // 子菜单项
  defaultOpen?: boolean // 默认展开
}

// 菜单配置
type MenuConfig = MenuItem | MenuGroup
```

## License

MIT
