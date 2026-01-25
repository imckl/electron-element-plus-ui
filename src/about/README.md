# About 模块

应用关于对话框，显示应用名称、版本号、图标和版权信息。

## 使用方式

提供两种使用方式：

| 方式 | 适用场景 |
|------|---------|
| `useAboutDialog` | **推荐** - 开箱即用，自动处理菜单事件和版本获取 |
| `ElectronAboutDialog` | 需要完全自定义控制时使用 |

---

## useAboutDialog（推荐）

一行代码即可完成关于对话框的完整功能。

### 主进程配置

```typescript
// src/main/index.ts
import { setupAboutDialog, showAboutDialog } from '@imckl/electron-element-plus-ui/main'

// 创建窗口后调用
setupAboutDialog(mainWindow)

// 菜单项触发
{ label: '关于', click: () => showAboutDialog(mainWindow) }
```

### 渲染进程使用

```typescript
// src/renderer/App.vue
import { useAboutDialog } from '@imckl/electron-element-plus-ui/renderer'

// 在 setup 中调用，自动监听菜单「关于」事件
useAboutDialog({
  appName: '我的应用',
  copyright: '© 2026 我的公司',
})
```

### Options

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `appName` | `string` | ✓ | 应用名称 |
| `copyright` | `string` | - | 版权信息 |
| `icon` | `Component` | - | 图标组件（默认 `Monitor`） |
| `iconColor` | `string` | - | 图标颜色（默认 `#409eff`） |

### 返回值

```typescript
const { show } = useAboutDialog(options)

// 手动显示对话框（可选，通常由菜单自动触发）
show()
```

---

## ElectronAboutDialog 组件

需要完全自定义控制时使用此组件。

### 基本用法

```vue
<template>
  <el-button @click="aboutDialogVisible = true">关于</el-button>

  <ElectronAboutDialog
    v-model="aboutDialogVisible"
    app-name="我的应用"
    :version="appVersion"
    copyright="© 2026 我的公司"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElectronAboutDialog } from '@imckl/electron-element-plus-ui/renderer'

const aboutDialogVisible = ref(false)
const appVersion = ref('1.0.0')
</script>
```

### 自定义图标

```vue
<template>
  <ElectronAboutDialog
    v-model="aboutDialogVisible"
    app-name="我的应用"
    :version="appVersion"
    :icon="Rocket"
    icon-color="#67c23a"
    copyright="© 2026"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElectronAboutDialog } from '@imckl/electron-element-plus-ui/renderer'
import { Rocket } from '@element-plus/icons-vue'

const aboutDialogVisible = ref(false)
const appVersion = ref('1.0.0')
</script>
```

### Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `boolean` | - | 对话框显示状态（v-model） |
| `appName` | `string` | - | 应用名称（必填） |
| `version` | `string` | - | 版本号（必填） |
| `icon` | `Component` | `Monitor` | 图标组件 |
| `iconColor` | `string` | `'#409eff'` | 图标颜色 |
| `copyright` | `string` | - | 版权信息（可选） |
| `width` | `string` | `'360px'` | 对话框宽度 |

### 结合菜单触发

如果不使用 `useAboutDialog`，需要手动处理菜单事件：

```vue
<template>
  <ElectronAboutDialog
    v-model="aboutDialogVisible"
    app-name="我的应用"
    :version="appVersion"
    copyright="© 2026"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElectronAboutDialog } from '@imckl/electron-element-plus-ui/renderer'

const aboutDialogVisible = ref(false)
const appVersion = ref('')

async function showAbout() {
  const info = await window.electronLayoutApi.getAppInfo()
  appVersion.value = info.version
  aboutDialogVisible.value = true
}

onMounted(() => {
  window.electronLayoutApi.onMenuShowAbout(showAbout)
})

onUnmounted(() => {
  window.electronLayoutApi.removeAboutListener()
})
</script>
```
