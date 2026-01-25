# useTabManager

Tab 状态管理 composable，配合 ElectronLayout 使用。

## 基本用法

```vue
<template>
  <ElectronLayout
    v-model:collapsed="isCollapsed"
    title="我的应用"
    :menu-items="menuItems"
    :tab-manager="tabManager"
  />
  <!-- 无需 @menu-select，菜单 index 匹配 Tab 类型时自动关联 -->
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

// 菜单配置 - index 与 Tab 类型保持一致
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

// 创建 Tab 管理器
const tabManager = useTabManager({
  tabs: {
    'home': {
      title: '主页',
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

## 菜单自动关联

当菜单 `index` 与 Tab 类型（`useTabManager` 配置的 key）一致时，点击菜单会自动打开对应 Tab。

```typescript
// 菜单 index = 'settings'
{ index: 'settings', label: '设置' }

// Tab 类型 key = 'settings'
tabs: {
  'settings': { title: '设置', component: SettingsPage }
}

// 匹配！点击菜单自动调用 tabManager.addTab('settings')
```

## TabConfig

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | ✓ | 默认标题 |
| `component` | `Component` | ✓ | 对应的 Vue 组件 |
| `closable` | `boolean` | - | 是否可关闭（默认 true，第一个 Tab 强制 false） |

## Options

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `tabs` | `Record<T, TabConfig>` | ✓ | Tab 类型配置 |
| `initialTab` | `T` | - | 初始打开的 Tab 类型 |

## 返回值（TabManager）

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

## 传递数据给组件

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

## 动态标题

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

## 新增 Tab 类型

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
