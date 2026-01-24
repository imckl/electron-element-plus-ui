import type { Component } from 'vue'

/** Tab 页定义 */
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
  /** Tab 列表 */
  tabs: Tab[]
  /** 标题栏高度，默认 '50px' */
  headerHeight?: string
  /** 侧边栏宽度（展开），默认 '180px' */
  sidebarWidth?: string
  /** 侧边栏宽度（折叠），默认 '64px' */
  sidebarCollapsedWidth?: string
  /** 是否显示折叠按钮，默认 true */
  showCollapseButton?: boolean
  /** 菜单配置（推荐方式，与 #sidebar slot 二选一） */
  menuItems?: MenuConfig[]
}
