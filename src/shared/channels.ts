/**
 * IPC 通道常量
 * 使用唯一前缀避免与用户项目冲突
 */

const PREFIX = '@imckl/eui:'

export const IpcChannels = {
  /** 显示 Tab 右键菜单 */
  TabContextMenuShow: `${PREFIX}tab-context-menu:show`,
  /** Tab 右键菜单命令 */
  TabContextMenuCommand: `${PREFIX}tab-context-menu:command`,

  /** 获取应用信息 */
  GetAppInfo: `${PREFIX}about:get-app-info`,
  /** 菜单触发显示关于对话框 */
  MenuShowAbout: `${PREFIX}about:menu-show`,
} as const

export type IpcChannel = (typeof IpcChannels)[keyof typeof IpcChannels]
