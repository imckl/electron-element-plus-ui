/**
 * useTabManager
 * Tab 状态管理 composable，配合 ElectronLayout 使用
 */

import { ref, type Component, type Ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import type {
  TabConfig,
  TabInstance,
  UseTabManagerOptions,
  UseTabManagerReturn,
} from '../../shared/types'

/**
 * Tab 状态管理
 * 配合 ElectronLayout 使用，提供完整的 Tab 管理功能
 *
 * @param options - 配置选项
 * @returns Tab 状态和操作方法
 *
 * @example
 * ```typescript
 * import { useTabManager } from '@imckl/electron-element-plus-ui/renderer'
 * import HomePage from './components/HomePage.vue'
 * import SettingsPage from './components/SettingsPage.vue'
 *
 * type TabType = 'home' | 'settings'
 *
 * const {
 *   tabs,
 *   activeTabId,
 *   addTab,
 *   getComponent,
 *   handleClose,
 *   handleRename,
 * } = useTabManager<TabType>({
 *   tabs: {
 *     'home': { title: '主页', component: HomePage, closable: false },
 *     'settings': { title: '设置', component: SettingsPage },
 *   },
 *   initialTab: 'home',
 * })
 * ```
 */
export function useTabManager<T extends string = string>(
  options: UseTabManagerOptions<T>
): UseTabManagerReturn<T> {
  const { tabs: tabConfigs, initialTab } = options

  // 状态
  const tabs: Ref<TabInstance[]> = ref([])
  const activeTabId = ref<string>('')

  // ID 生成器
  let counter = 0
  function generateId(): string {
    return `tab-${++counter}`
  }

  /**
   * 获取 Tab 类型对应的组件
   */
  function getComponent(type: string): Component | undefined {
    return tabConfigs[type as T]?.component
  }

  /**
   * 添加新 Tab
   * @param type - Tab 类型
   * @param data - 传给组件的额外数据
   * @returns tabId
   */
  function addTab(type: T, data?: Record<string, unknown>): string {
    const config = tabConfigs[type]
    if (!config) {
      console.warn(`[useTabManager] Unknown tab type: ${type}`)
      return ''
    }

    const id = generateId()
    const isFirst = tabs.value.length === 0

    const newTab: TabInstance = {
      id,
      type,
      title: config.title,
      closable: isFirst ? false : (config.closable !== false),
      data,
    }

    tabs.value.push(newTab)
    activeTabId.value = id
    return id
  }

  /**
   * 移除 Tab（内部方法）
   */
  function removeTab(tabId: string): void {
    const index = tabs.value.findIndex(t => t.id === tabId)
    if (index === -1) return

    tabs.value.splice(index, 1)

    // 如果关闭的是当前 Tab，切换到相邻 Tab
    if (activeTabId.value === tabId && tabs.value.length > 0) {
      activeTabId.value = tabs.value[Math.min(index, tabs.value.length - 1)].id
    }
  }

  /**
   * 关闭 Tab（带确认对话框）
   * 传给 ElectronLayout @tab-close
   */
  async function handleClose(tabId: string | number): Promise<void> {
    const id = String(tabId)
    const tab = tabs.value.find(t => t.id === id)
    if (!tab || !tab.closable) return

    try {
      await ElMessageBox.confirm(
        '确定关闭此标签页吗？未保存的更改将丢失。',
        '关闭确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      removeTab(id)
    } catch {
      // 用户取消
    }
  }

  /**
   * 重命名 Tab
   * 传给 ElectronLayout @tab-rename
   */
  function handleRename(tabId: string, newTitle: string): void {
    const tab = tabs.value.find(t => t.id === tabId)
    if (tab) {
      tab.title = newTitle
    }
  }

  /**
   * 更新 Tab 标题
   * 供子组件通过 emit('title-change') 调用
   */
  function updateTitle(tabId: string, title: string): void {
    const tab = tabs.value.find(t => t.id === tabId)
    if (tab) {
      tab.title = title
    }
  }

  /**
   * 获取 Tab
   */
  function getTab(tabId: string): TabInstance | undefined {
    return tabs.value.find(t => t.id === tabId)
  }

  // 初始化
  if (initialTab) {
    addTab(initialTab)
  }

  return {
    tabs,
    activeTabId,
    addTab,
    updateTitle,
    getTab,
    getComponent,
    handleClose,
    handleRename,
  }
}
