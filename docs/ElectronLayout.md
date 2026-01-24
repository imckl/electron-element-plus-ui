# ElectronLayout

Electron 应用的标准三栏布局组件：Header + Sidebar + Main（Tab 页容器）。

## 基本用法

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
      <SettingsPage v-else-if="tab.type === 'settings'" />
    </template>
  </ElectronLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElectronLayout, type Tab, type MenuConfig } from '@imckl/electron-element-plus-ui/renderer'
import { House, Setting, Folder } from '@element-plus/icons-vue'

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

const tabs = ref<Tab[]>([
  { id: '1', type: 'home', title: '首页', closable: false }
])
const activeTabId = ref('1')
const isCollapsed = ref(false)

function handleMenuSelect(index: string) {
  addTab(index)
}

function addTab(type: string) {
  const id = `tab-${Date.now()}`
  tabs.value.push({ id, type, title: type, closable: true })
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

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 应用标题（必填） |
| `tabs` | `Tab[]` | - | Tab 列表（必填） |
| `menuItems` | `MenuConfig[]` | - | 菜单配置（推荐方式） |
| `headerHeight` | `string` | `'50px'` | 标题栏高度 |
| `sidebarWidth` | `string` | `'180px'` | 侧边栏宽度（展开） |
| `sidebarCollapsedWidth` | `string` | `'64px'` | 侧边栏宽度（折叠） |
| `showCollapseButton` | `boolean` | `true` | 是否显示折叠按钮 |

## v-model

| 名称 | 类型 | 说明 |
|------|------|------|
| `activeTab` | `string` | 当前激活的 Tab ID |
| `collapsed` | `boolean` | 侧边栏折叠状态 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `tab-close` | `(tabId: string)` | Tab 关闭请求 |
| `tab-contextmenu` | `(tab: Tab, event: MouseEvent)` | Tab 右键菜单 |
| `menu-select` | `(index: string)` | 菜单项选择（使用 menuItems 时） |

## Slots

| Slot | 参数 | 说明 |
|------|------|------|
| `header-left` | - | 标题左侧额外内容 |
| `header-right` | - | 标题右侧额外内容 |
| `sidebar` | `{ collapsed: boolean }` | 侧边栏内容（逃生舱，无 menuItems 时使用） |
| `tab` | `{ tab: Tab }` | Tab 页内容 |

## 类型定义

### Tab

```typescript
interface Tab {
  id: string        // 唯一标识
  type: string      // 类型（用于条件渲染）
  title: string     // 显示标题
  closable?: boolean // 是否可关闭，默认 true
}
```

### MenuConfig

```typescript
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

## 使用 #sidebar Slot（逃生舱）

当 `menuItems` 无法满足需求时，可以使用 `#sidebar` slot 完全自定义侧边栏：

```vue
<ElectronLayout ...>
  <template #sidebar="{ collapsed }">
    <el-menu :collapse="collapsed" :collapse-transition="false">
      <el-menu-item index="home" @click="addTab('home')">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
    </el-menu>
  </template>
</ElectronLayout>
```

> **注意**：使用 `#sidebar` slot 时，不要同时传入 `menuItems`，否则 `menuItems` 优先。
