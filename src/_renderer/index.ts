// noinspection JSUnusedGlobalSymbols - 库入口文件，导出供外部使用

/**
 * 渲染进程入口
 */

// 组件
export { default as ElectronLayout } from '../layout/ElectronLayout.vue'
export { default as ElectronAboutDialog } from '../about/ElectronAboutDialog.vue'

// Composables
export { useAboutDialog } from '../about/useAboutDialog'
export { useTabManager } from '../layout/useTabManager'

// 共享类型
export type { Tab, TabInstance } from '../_shared/types'

// Layout 类型
export type {
  MenuItem,
  MenuGroup,
  MenuConfig,
  ElectronLayoutProps,
  TabConfig,
  TabManager,
  UseTabManagerOptions,
  UseTabManagerReturn,
} from '../layout/types'
export { isMenuGroup } from '../layout/types'

// About 类型
export type {
  ElectronAboutDialogProps,
  UseAboutDialogOptions,
} from '../about/types'
