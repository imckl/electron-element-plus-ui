/**
 * 渲染进程入口
 */

// 组件
export { default as ElectronLayout } from './components/ElectronLayout.vue'
export { default as ElectronAboutDialog } from './components/ElectronAboutDialog.vue'

// Composables
export { useAboutDialog } from './composables'

// 类型
export type {
  Tab,
  MenuItem,
  MenuGroup,
  MenuConfig,
  ElectronLayoutProps,
  ElectronAboutDialogProps,
  UseAboutDialogOptions,
} from '../shared/types'

// 工具函数
export { isMenuGroup } from '../shared/types'
