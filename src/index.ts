// noinspection JSUnusedGlobalSymbols - 库入口文件，导出供外部使用

/**
 * 主入口
 * 导出所有类型，供用户项目的 env.d.ts 使用
 */

// 共享类型
export type { Tab, TabInstance } from './shared/types'

// Layout 类型
export type {
  MenuItem,
  MenuGroup,
  MenuConfig,
  ElectronLayoutProps,
  TabContextMenuParams,
  TabContextMenuCommand,
  TabContextMenuResult,
  TabContextMenuConfig,
  ElectronLayoutApi,
} from './layout/types'
export { isMenuGroup } from './layout/types'

// About 类型
export type { ElectronAboutDialogProps } from './about/types'
