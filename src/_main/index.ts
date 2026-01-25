// noinspection JSUnusedGlobalSymbols - 库入口文件，导出供外部使用

/**
 * 主进程入口
 */

export { setupTabContextMenu, cleanupTabContextMenu } from '../layout/main'
export { setupAboutDialog, showAboutDialog, cleanupAboutDialog } from '../about/main'
export type { TabContextMenuConfig } from '../layout/types'
