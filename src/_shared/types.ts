/**
 * 共享类型定义
 * 跨功能模块使用的基础类型
 */

// ============ Tab 定义 ============

/** Tab 页基础定义 */
export interface Tab {
  /** 唯一标识 */
  id: string
  /** 类型（用于条件渲染） */
  type: string
  /** 显示标题 */
  title: string
  /** 是否可关闭，默认 true */
  closable?: boolean
}

/** Tab 运行时对象（扩展 Tab，用于 useTabManager） */
export interface TabInstance extends Tab {
  /** 是否可关闭（覆盖为必填） */
  closable: boolean
  /** 额外数据（传给组件的 props） */
  data?: Record<string, unknown>
}
