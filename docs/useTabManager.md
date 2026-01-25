# useTabManager

Tab 状态管理 composable，配合 ElectronLayout 使用。

## 推荐用法

使用 `componentMap` 和 `onTitleChange`，无需 slot：

```typescript
import {
  ElectronLayout,
  useTabManager,
} from '@imckl/electron-element-plus-ui/renderer'
import HomePage from './components/HomePage.vue'
import SettingsPage from './components/SettingsPage.vue'

type TabType = 'home' | 'settings'

const {
  tabs,
  activeTabId,
  addTab,
  updateTitle,
  componentMap,
  handleClose,
  handleRename,
} = useTabManager<TabType>({
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
```

```vue
<ElectronLayout
  v-model:active-tab="activeTabId"
  :tabs="tabs"
  :component-map="componentMap"
  :on-title-change="updateTitle"
  @tab-close="handleClose"
  @tab-rename="handleRename"
/>
```

## 自定义渲染（逃生舱）

如需完全自定义 Tab 内容渲染，可使用 `#tab` slot：

```vue
<ElectronLayout
  v-model:active-tab="activeTabId"
  :tabs="tabs"
  @tab-close="handleClose"
  @tab-rename="handleRename"
>
  <template #tab="{ tab }">
    <component
      :is="getComponent(tab.type)"
      v-bind="tab.data"
      @title-change="(title) => updateTitle(tab.id, title)"
      @custom-event="handleCustom"
    />
  </template>
</ElectronLayout>
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

## 返回值

| 属性/方法 | 类型 | 说明 |
|----------|------|------|
| `tabs` | `Ref<TabInstance[]>` | Tab 列表 |
| `activeTabId` | `Ref<string>` | 当前激活的 Tab ID |
| `addTab` | `(type, data?) => string` | 添加 Tab，返回 tabId |
| `updateTitle` | `(tabId, title) => void` | 更新标题 |
| `getTab` | `(tabId) => TabInstance` | 获取 Tab |
| `getComponent` | `(type) => Component` | 获取组件（用于 slot 方式） |
| `componentMap` | `Record<string, Component>` | 组件映射（传给 ElectronLayout） |
| `handleClose` | `(tabId) => Promise<void>` | 关闭处理器（带确认对话框） |
| `handleRename` | `(tabId, title) => void` | 重命名处理器 |

## 传递数据给组件

```typescript
// 添加 Tab 时传入数据
const tabId = addTab('customer-detail', { customerId: 123 })

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

子组件通过 emit 通知父组件更新标题：

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
const { ... } = useTabManager({
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
