/**
 * Tab 右键菜单
 * 在主进程中创建原生菜单
 */

import { ipcMain, Menu, type BrowserWindow, type MenuItemConstructorOptions } from 'electron'
import { IpcChannels } from '../shared/channels'
import type { TabContextMenuParams, TabContextMenuConfig, TabContextMenuResult } from '../shared/types'

/**
 * 设置 Tab 右键菜单
 * 在创建窗口后调用
 *
 * @param window - 主窗口
 * @param config - 可选配置
 *
 * @example
 * ```typescript
 * import { setupTabContextMenu } from '@imckl/electron-element-plus-ui/main'
 *
 * // 创建窗口后调用
 * setupTabContextMenu(mainWindow)
 *
 * // 或者自定义配置
 * setupTabContextMenu(mainWindow, {
 *   renameLabel: '重命名',
 *   closeLabel: '关闭',
 *   unclosableTypes: ['home'],
 * })
 * ```
 */
export function setupTabContextMenu(
  window: BrowserWindow,
  config: TabContextMenuConfig = {}
): void {
  const {
    renameLabel = '重命名',
    closeLabel = '关闭',
    unclosableTypes = ['home'],
  } = config

  ipcMain.handle(
    IpcChannels.TabContextMenuShow,
    (_event, params: TabContextMenuParams) => {
      const canClose = !unclosableTypes.includes(params.tabType)

      const template: MenuItemConstructorOptions[] = [
        {
          label: renameLabel,
          click: () => {
            const result: TabContextMenuResult = {
              tabId: params.tabId,
              command: 'rename',
            }
            window.webContents.send(IpcChannels.TabContextMenuCommand, result)
          },
        },
        { type: 'separator' },
        {
          label: closeLabel,
          enabled: canClose,
          click: () => {
            const result: TabContextMenuResult = {
              tabId: params.tabId,
              command: 'close',
            }
            window.webContents.send(IpcChannels.TabContextMenuCommand, result)
          },
        },
      ]

      const menu = Menu.buildFromTemplate(template)
      menu.popup()
    }
  )
}

/**
 * 清理 Tab 右键菜单
 * 移除 IPC 监听器
 */
export function cleanupTabContextMenu(): void {
  ipcMain.removeHandler(IpcChannels.TabContextMenuShow)
}
