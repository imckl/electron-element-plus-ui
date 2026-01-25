/**
 * About 模块 IPC 通道
 */

const PREFIX = '@imckl/eui:'

export const AboutChannels = {
  /** 获取应用信息 */
  GetAppInfo: `${PREFIX}about:get-app-info`,
  /** 菜单触发显示关于对话框 */
  MenuShowAbout: `${PREFIX}about:menu-show`,
} as const

export type AboutChannel = (typeof AboutChannels)[keyof typeof AboutChannels]
