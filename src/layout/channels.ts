/**
 * Layout 模块 IPC 通道
 */

const PREFIX = '@imckl/eui:'

export const LayoutChannels = {
  /** 显示 Tab 右键菜单 */
  TabContextMenuShow: `${PREFIX}tab-context-menu:show`,
  /** Tab 右键菜单命令 */
  TabContextMenuCommand: `${PREFIX}tab-context-menu:command`,
} as const

export type LayoutChannel = (typeof LayoutChannels)[keyof typeof LayoutChannels]
