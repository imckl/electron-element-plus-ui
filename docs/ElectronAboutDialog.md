# ElectronAboutDialog

应用关于对话框组件，显示应用名称、版本号、图标和版权信息。

## 基本用法

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

## 自定义图标

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

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `boolean` | - | 对话框显示状态（v-model） |
| `appName` | `string` | - | 应用名称（必填） |
| `version` | `string` | - | 版本号（必填） |
| `icon` | `Component` | `Monitor` | 图标组件 |
| `iconColor` | `string` | `'#409eff'` | 图标颜色 |
| `copyright` | `string` | - | 版权信息（可选） |
| `width` | `string` | `'360px'` | 对话框宽度 |

## 完整示例

结合菜单触发：

```vue
<template>
  <ElectronLayout ...>
    <!-- 其他内容 -->
  </ElectronLayout>

  <ElectronAboutDialog
    v-model="aboutDialogVisible"
    app-name="我的应用"
    :version="appVersion"
    copyright="© 2026 我的公司"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElectronLayout, ElectronAboutDialog } from '@imckl/electron-element-plus-ui/renderer'

const aboutDialogVisible = ref(false)
const appVersion = ref('')

async function showAbout() {
  const info = await window.electronAPI.getAppInfo()
  appVersion.value = info.version
  aboutDialogVisible.value = true
}

onMounted(() => {
  // 监听菜单"关于"事件
  window.electronAPI.onMenuShowAbout(showAbout)
})

onUnmounted(() => {
  window.electronAPI.removeAboutListeners()
})
</script>
```
