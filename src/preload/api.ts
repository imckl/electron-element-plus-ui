/**
 * Preload API
 * 暴露给渲染进程的 API
 */

import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannels } from '../shared/channels'
import type { ElectronLayoutApi, TabContextMenuParams, TabContextMenuResult, AppInfo } from '../shared/types'

const API_KEY = 'electronLayoutApi'

/**
 * 暴露 Layout API 到渲染进程
 *
 * @example
 * ```typescript
 * // src/preload/index.ts
 * import { exposeLayoutApi } from '@imckl/electron-element-plus-ui/preload'
 *
 * exposeLayoutApi()
 * ```
 *
 * 渲染进程中通过 window.electronLayoutApi 访问：
 * ```typescript
 * window.electronLayoutApi.showTabContextMenu({ tabId: '1', tabType: 'home' })
 * ```
 */
export function exposeLayoutApi(): void {
  const api: ElectronLayoutApi = {
    showTabContextMenu: (params: TabContextMenuParams) => {
      ipcRenderer.invoke(IpcChannels.TabContextMenuShow, params)
    },

    onTabContextMenuCommand: (callback: (result: TabContextMenuResult) => void) => {
      ipcRenderer.on(IpcChannels.TabContextMenuCommand, (_event, result) => {
        callback(result)
      })
    },

    removeTabContextMenuListener: () => {
      ipcRenderer.removeAllListeners(IpcChannels.TabContextMenuCommand)
    },

    getAppInfo: (): Promise<AppInfo> => {
      return ipcRenderer.invoke(IpcChannels.GetAppInfo)
    },

    onMenuShowAbout: (callback: () => void) => {
      ipcRenderer.on(IpcChannels.MenuShowAbout, callback)
    },

    removeAboutListener: () => {
      ipcRenderer.removeAllListeners(IpcChannels.MenuShowAbout)
    },
  }

  contextBridge.exposeInMainWorld(API_KEY, api)
}
