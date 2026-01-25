# Layout 模块

Electron 应用的标准三栏布局：Header + Sidebar + Main（Tab 页容器）。

**包含：**
- `ElectronLayout` - 布局组件
- `useTabManager` - Tab 状态管理

**内置功能：**
- Tab 右键菜单（原生菜单，需配合主进程和预加载脚本）
- 重命名对话框
- **菜单自动关联 Tab**（当菜单 `index` 匹配 Tab 类型时）

---

## 前置配置

### 主进程

```typescript
// src/main/index.ts
import { setupTabContextMenu } from '@imckl/electron-element-plus-ui/main'

// 创建窗口后调用
setupTabContextMenu(mainWindow)

// 可选：自定义配置
setupTabContextMenu(mainWindow, {
  renameLabel: '重命名',
  closeLabel: '关闭',
  unclosableTypes: ['home'], // 不可关闭的 Tab 类型
})
```

### 预加载脚本

```typescript
// src/preload/index.ts
import { exposeLayoutApi } from '@imckl/electron-element-plus-ui/preload'

exposeLayoutApi()
```

### 类型声明

```typescript
// src/env.d.ts
import type { ElectronLayoutApi } from '@imckl/electron-element-plus-ui'

declare global {
  interface Window {
    electronLayoutApi: ElectronLayoutApi
  }
}
```

---

## 基本用法

配合 `useTabManager` 使用，实现最简化的 Tab 管理：

```vue
<template>
  <ElectronLayout
    v-model:collapsed="isCollapsed"
    title="我的应用"
    :menu-items="menuItems"
    :tab-manager="tabManager"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElectronLayout,
  useTabManager,
  type MenuConfig,
} from '@imckl/electron-element-plus-ui/renderer'
import { House, Setting, Folder } from '@element-plus/icons-vue'
import HomePage from './components/HomePage.vue'
import SettingsPage from './components/SettingsPage.vue'

const isCollapsed = ref(false)

// 菜单配置 - index 与 Tab 类型一致，自动关联
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

// Tab 管理器
const tabManager = useTabManager({
  tabs: {
    'home': {
      title: '首页',
      component: HomePage,
      closable: false,
    },
    'settings': {
      title: '设置',
      component: SettingsPage,
    },
  },
  initialTab: 'home',
})
</script>
```

---

## 菜单自动关联 Tab

当菜单项的 `index` 与 `tabManager.componentMap` 的 key 匹配时，点击菜单会自动调用 `tabManager.addTab(index)`。

```typescript
// 菜单配置
{ index: 'settings', label: '设置' }  // index = 'settings'

// Tab 配置
const tabManager = useTabManager({
  tabs: {
    'settings': { ... }  // key = 'settings'，与菜单 index 匹配
  }
})

// 点击菜单「设置」→ 自动打开 settings Tab
```

> **注意**：`@menu-select` 事件仍会触发，用于处理非 Tab 类型的菜单项（如打开外部链接等）。

---

## ElectronLayout

### Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 应用标题（必填） |
| `tabManager` | `TabManager` | - | Tab 管理器（必填，由 useTabManager 创建） |
| `menuItems` | `MenuConfig[]` | - | 菜单配置（推荐方式） |
| `headerHeight` | `string` | `'50px'` | 标题栏高度 |
| `sidebarWidth` | `string` | `'180px'` | 侧边栏宽度（展开） |
| `sidebarCollapsedWidth` | `string` | `'64px'` | 侧边栏宽度（折叠） |
| `showCollapseButton` | `boolean` | `true` | 是否显示折叠按钮 |
| `renameDialogTitle` | `string` | `'重命名标签'` | 重命名对话框标题 |

### v-model

| 名称 | 类型 | 说明 |
|------|------|------|
| `collapsed` | `boolean` | 侧边栏折叠状态 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `menu-select` | `(index: string)` | 菜单项选择（用于处理非 Tab 菜单项） |

### Slots

| Slot | 参数 | 说明 |
|------|------|------|
| `header-left` | - | 标题左侧额外内容 |
| `header-right` | - | 标题右侧额外内容 |
| `sidebar` | `{ collapsed: boolean }` | 侧边栏内容（逃生舱，无 menuItems 时使用） |
| `tab` | `{ tab: TabInstance }` | Tab 页内容（逃生舱，无匹配组件时使用） |

### 类型定义

#### MenuConfig

```typescript
// 菜单项
interface MenuItem {
  index: string       // 唯一标识（与 Tab 类型一致时自动关联）
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

### 使用 #sidebar Slot（逃生舱）

当 `menuItems` 无法满足需求时，可以使用 `#sidebar` slot 完全自定义侧边栏：

```vue
<ElectronLayout :tab-manager="tabManager" ...>
  <template #sidebar="{ collapsed }">
    <el-menu :collapse="collapsed" :collapse-transition="false">
      <el-menu-item index="home" @click="tabManager.addTab('home')">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
    </el-menu>
  </template>
</ElectronLayout>
```

> **注意**：使用 `#sidebar` slot 时，不要同时传入 `menuItems`，否则 `menuItems` 优先。

---

## useTabManager

Tab 状态管理 composable。

### TabConfig

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | ✓ | 默认标题 |
| `component` | `Component` | ✓ | 对应的 Vue 组件 |
| `closable` | `boolean` | - | 是否可关闭（默认 true，第一个 Tab 强制 false） |

### Options

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `tabs` | `Record<string, TabConfig>` | ✓ | Tab 类型配置 |
| `initialTab` | `string` | - | 初始打开的 Tab 类型 |

### 返回值（TabManager）

| 属性/方法 | 类型 | 说明 |
|----------|------|------|
| `tabs` | `Ref<TabInstance[]>` | Tab 列表 |
| `activeTabId` | `Ref<string>` | 当前激活的 Tab ID |
| `componentMap` | `Record<string, Component>` | 组件映射 |
| `addTab` | `(type, data?) => string` | 添加 Tab，返回 tabId |
| `updateTitle` | `(tabId, title) => void` | 更新标题 |
| `handleClose` | `(tabId) => Promise<void>` | 关闭 Tab（带确认对话框） |
| `handleRename` | `(tabId, title) => void` | 重命名 Tab |
| `getTab` | `(tabId) => TabInstance` | 获取 Tab |
| `getComponent` | `(type) => Component` | 获取组件 |

### 传递数据给组件

```typescript
// 添加 Tab 时传入数据
const tabId = tabManager.addTab('customer-detail', { customerId: 123 })

// 数据会通过 v-bind="tab.data" 传给组件
```

```vue
<!-- CustomerDetail.vue -->
<script setup>
defineProps<{
  customerId: number
}>()
</script>
```

### 动态标题

子组件通过 emit 通知更新标题：

```vue
<!-- DataPage.vue -->
<script setup>
const emit = defineEmits<{
  (e: 'title-change', title: string): void
}>()

// 当数据变化时更新标题
watch(fileName, (name) => {
  if (name) {
    emit('title-change', `数据 - ${name}`)
  }
})
</script>
```

### 新增 Tab 类型

只需在配置中添加一行：

```typescript
const tabManager = useTabManager({
  tabs: {
    // 现有配置...

    // 新增
    'customer-list': {
      title: '客户列表',
      component: CustomerList,
    },
  },
})
```

模板无需修改，`componentMap` 会自动包含新组件。
