/**
 * 主入口
 * 导出所有类型，供用户项目的 env.d.ts 使用
 */

// 类型导出
export type {
  Tab,
  MenuItem,
  MenuGroup,
  MenuConfig,
  ElectronLayoutProps,
  ElectronAboutDialogProps,
  TabContextMenuParams,
  TabContextMenuCommand,
  TabContextMenuResult,
  TabContextMenuConfig,
  ElectronLayoutApi,
} from './shared/types'

// 工具函数
export { isMenuGroup } from './shared/types'
