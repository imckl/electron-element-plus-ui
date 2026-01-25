/**
 * 关于对话框 - 主进程
 * 提供主进程侧的应用信息获取和菜单事件触发
 */

import { ipcMain, app, type BrowserWindow } from 'electron'
import { AboutChannels } from './channels'
import type { AppInfo } from './types'

/**
 * 设置关于对话框 IPC
 * 在创建窗口后调用
 *
 * @param window - 主窗口（用于发送菜单事件）
 *
 * @example
 * ```typescript
 * import { setupAboutDialog } from '@imckl/electron-element-plus-ui/main'
 *
 * // 创建窗口后调用
 * setupAboutDialog(mainWindow)
 * ```
 */
export function setupAboutDialog(window: BrowserWindow): void {
  ipcMain.handle(AboutChannels.GetAppInfo, (): AppInfo => ({
    appName: app.getName(),
    version: app.getVersion(),
  }))
}

/**
 * 触发显示关于对话框
 * 供主菜单「关于」项调用
 *
 * @param window - 目标窗口
 *
 * @example
 * ```typescript
 * import { showAboutDialog } from '@imckl/electron-element-plus-ui/main'
 *
 * // 菜单项
 * { label: '关于', click: () => showAboutDialog(mainWindow) }
 * ```
 */
export function showAboutDialog(window: BrowserWindow): void {
  window.webContents.send(AboutChannels.MenuShowAbout)
}

/**
 * 清理关于对话框 IPC
 * 移除 IPC 监听器
 */
export function cleanupAboutDialog(): void {
  ipcMain.removeHandler(AboutChannels.GetAppInfo)
}
