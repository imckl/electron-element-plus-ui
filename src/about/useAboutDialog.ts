/**
 * useAboutDialog
 * 开箱即用的关于对话框 composable
 */

import { ref, h, render, onUnmounted, watchEffect, getCurrentInstance } from 'vue'
import ElectronAboutDialog from './ElectronAboutDialog.vue'
import type { UseAboutDialogOptions } from './types'

/**
 * 使用关于对话框
 * 自动监听菜单事件、获取版本号、显示对话框
 *
 * @param options - 配置选项
 * @returns 对话框控制方法
 *
 * @example
 * ```typescript
 * import { useAboutDialog } from '@imckl/electron-element-plus-ui/renderer'
 *
 * // 在 setup 中调用，自动监听菜单「关于」事件
 * useAboutDialog({
 *   appName: '我的应用',
 *   copyright: '© 2026'
 * })
 * ```
 */
export function useAboutDialog(options: UseAboutDialogOptions) {
  const visible = ref(false)
  const version = ref('')

  // 获取当前组件实例的 appContext（用于 Element Plus 组件正常工作）
  const appContext = getCurrentInstance()?.appContext

  // 创建挂载容器
  const container = document.createElement('div')
  document.body.appendChild(container)

  // 渲染函数
  function updateRender() {
    const vnode = h(ElectronAboutDialog, {
      modelValue: visible.value,
      'onUpdate:modelValue': (v: boolean) => {
        visible.value = v
      },
      appName: options.appName,
      version: version.value,
      copyright: options.copyright,
      icon: options.icon,
      iconColor: options.iconColor,
    })

    // 继承 appContext 使 Element Plus 组件正常工作
    if (appContext) {
      vnode.appContext = appContext
    }

    render(vnode, container)
  }

  // 监听响应式变化自动重新渲染
  watchEffect(() => {
    updateRender()
  })

  // 显示对话框
  async function show() {
    if (window.electronLayoutApi) {
      const info = await window.electronLayoutApi.getAppInfo()
      version.value = info.version
    }
    visible.value = true
  }

  // 监听菜单事件
  if (window.electronLayoutApi) {
    window.electronLayoutApi.onMenuShowAbout(show)
  }

  // 清理
  onUnmounted(() => {
    window.electronLayoutApi?.removeAboutListener()
    render(null, container)
    container.remove()
  })

  return { show }
}
