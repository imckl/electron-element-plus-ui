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
}
