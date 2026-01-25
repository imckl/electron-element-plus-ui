/**
 * About 模块类型定义
 */

import type { Component } from 'vue'

/** 应用信息 */
export interface AppInfo {
  /** 应用名称 */
  appName: string
  /** 版本号 */
  version: string
}

/** useAboutDialog 配置 */
export interface UseAboutDialogOptions {
  /** 应用名称 */
  appName: string
  /** 版权信息 */
  copyright?: string
  /** 图标组件 */
  icon?: Component
  /** 图标颜色 */
  iconColor?: string
}

/** 关于对话框 Props */
export interface ElectronAboutDialogProps {
  /** 应用名称 */
  appName: string
  /** 版本号 */
  version: string
  /** 图标组件 */
  icon?: Component
  /** 图标颜色，默认 '#409eff' */
  iconColor?: string
  /** 版权信息 */
  copyright?: string
  /** 对话框宽度，默认 '360px' */
  width?: string
}
