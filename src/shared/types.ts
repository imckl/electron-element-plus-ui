/**
 * 共享类型定义
 * 供 main、preload、renderer 三进程使用
 */

import type { Component, Ref } from 'vue'

// ============ Tab 定义 ============

/** Tab 页基础定义 */
export interface Tab {
  /** 唯一标识 */
  id: string
  /** 类型（用于条件渲染） */
  type: string
  /** 显示标题 */
  title: string
  /** 是否可关闭，默认 true */
  closable?: boolean
}

/** Tab 运行时对象（扩展 Tab，用于 useTabManager） */
export interface TabInstance extends Tab {
  /** 是否可关闭（覆盖为必填） */
  closable: boolean
  /** 额外数据（传给组件的 props） */
  data?: Record<string, unknown>
}

// ============ 菜单配置 ============

/** 菜单项基础属性 */
interface MenuItemBase {
  /** 唯一标识 */
  index: string
  /** 显示文本 */
  label: string
  /** 图标组件（可选） */
  icon?: Component
  /** 是否禁用 */
  disabled?: boolean
}

/** 普通菜单项（叶子节点） */
export interface MenuItem extends MenuItemBase {}

/** 分组菜单（有子菜单） */
export interface MenuGroup extends MenuItemBase {
  /** 子菜单项 */
  children: MenuItem[]
  /** 默认展开 */
  defaultOpen?: boolean
}

/** 菜单配置（可以是分组或普通项） */
export type MenuConfig = MenuItem | MenuGroup

/** 判断是否为分组 */
export function isMenuGroup(item: MenuConfig): item is MenuGroup {
  return 'children' in item && Array.isArray(item.children)
}

// ============ ElectronLayout Props ============

/** ElectronLayout Props */
export interface ElectronLayoutProps {
  /** 应用标题 */
  title: string
  /** Tab 管理器 */
  tabManager: TabManager
  /** 菜单配置（推荐方式，与 #sidebar slot 二选一） */
  menuItems?: MenuConfig[]
  /** 标题栏高度，默认 '50px' */
  headerHeight?: string
  /** 侧边栏宽度（展开），默认 '180px' */
  sidebarWidth?: string
  /** 侧边栏宽度（折叠），默认 '64px' */
  sidebarCollapsedWidth?: string
  /** 是否显示折叠按钮，默认 true */
  showCollapseButton?: boolean
  /** 重命名对话框标题，默认 '重命名标签' */
  renameDialogTitle?: string
}

// ============ Tab 右键菜单 ============

/** Tab 右键菜单显示参数 */
export interface TabContextMenuParams {
  /** Tab ID */
  tabId: string
  /** Tab 类型（用于判断是否可关闭等） */
  tabType: string
}

/** Tab 右键菜单命令 */
export type TabContextMenuCommand = 'rename' | 'close'

/** Tab 右键菜单命令结果 */
export interface TabContextMenuResult {
  /** Tab ID */
  tabId: string
  /** 命令 */
  command: TabContextMenuCommand
}

/** Tab 右键菜单配置（主进程用） */
export interface TabContextMenuConfig {
  /** 重命名菜单项文本，默认 '重命名' */
  renameLabel?: string
  /** 关闭菜单项文本，默认 '关闭' */
  closeLabel?: string
  /** 不可关闭的 Tab 类型列表（如 ['home']） */
  unclosableTypes?: string[]
}

// ============ 应用信息 ============

/** 应用信息 */
export interface AppInfo {
  /** 应用名称 */
  appName: string
  /** 版本号 */
  version: string
}

// ============ useAboutDialog ============

/** useAboutDialog 配置 */
export interface UseAboutDialogOptions {
  /** 应用名称 */
  appName: string
  /** 版权信息 */
  copyright?: string
  /** 图标组件 */
  icon?: Component
  /** 图标颜色 */
  iconColor?: string
}

// ============ Preload API ============

/** ElectronLayout Preload API 类型 */
export interface ElectronLayoutApi {
  /** 显示 Tab 右键菜单 */
  showTabContextMenu: (params: TabContextMenuParams) => void
  /** 监听 Tab 右键菜单命令 */
  onTabContextMenuCommand: (callback: (result: TabContextMenuResult) => void) => void
  /** 移除 Tab 右键菜单监听器 */
  removeTabContextMenuListener: () => void

  /** 获取应用信息 */
  getAppInfo: () => Promise<AppInfo>
  /** 监听菜单「关于」事件 */
  onMenuShowAbout: (callback: () => void) => void
  /** 移除「关于」监听器 */
  removeAboutListener: () => void
}

// ============ ElectronAboutDialog Props ============

/** 关于对话框 Props */
export interface ElectronAboutDialogProps {
  /** 应用名称 */
  appName: string
  /** 版本号 */
  version: string
  /** 图标组件 */
  icon?: Component
  /** 图标颜色，默认 '#409eff' */
  iconColor?: string
  /** 版权信息 */
  copyright?: string
  /** 对话框宽度，默认 '360px' */
  width?: string
}

// ============ useTabManager ============

/** Tab 配置项 */
export interface TabConfig {
  /** 默认标题 */
  title: string
  /** 对应的组件 */
  component: Component
  /** 是否可关闭（默认 true，第一个 Tab 强制 false） */
  closable?: boolean
}

/** useTabManager 配置 */
export interface UseTabManagerOptions {
  /** Tab 类型配置 */
  tabs: Record<string, TabConfig>
  /** 初始 Tab 类型 */
  initialTab?: string
}

/** Tab 管理器（供 ElectronLayout 使用） */
export interface TabManager {
  /** Tab 列表 */
  tabs: Ref<TabInstance[]>
  /** 当前激活的 Tab ID */
  activeTabId: Ref<string>
  /** 组件映射 */
  componentMap: Record<string, Component>
  /** 添加新 Tab，返回 tabId */
  addTab: (type: string, data?: Record<string, unknown>) => string
  /** 更新标题 */
  updateTitle: (tabId: string, title: string) => void
  /** 关闭 Tab */
  handleClose: (tabId: string | number) => Promise<void>
  /** 重命名 Tab */
  handleRename: (tabId: string, newTitle: string) => void
}

/** useTabManager 返回值 */
export interface UseTabManagerReturn extends TabManager {
  /** 获取 Tab */
  getTab: (tabId: string) => TabInstance | undefined
  /** 获取 Tab 类型对应的组件 */
  getComponent: (type: string) => Component | undefined
}
