# CLAUDE.md

## 源码结构

```
src/
├── index.ts                      # 主入口（类型导出，供 env.d.ts）
├── shared/                       # 共享代码
│   ├── channels.ts               # IPC 通道常量
│   └── types.ts                  # 类型定义
├── main/                         # 主进程
│   ├── index.ts
│   └── tabContextMenu.ts
├── preload/                      # 预加载脚本
│   ├── index.ts
│   └── api.ts
└── renderer/                     # 渲染进程
    ├── index.ts
    └── components/
        ├── ElectronLayout.vue
        └── ElectronAboutDialog.vue
```

## 开发环境

可以在 WSL2/Linux 环境下开发（构建时不需要 Electron 二进制）：

```bash
# 跳过下载 Electron binary
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install
npm run build
```

## Preload 入口设计原则

preload 入口必须保持精简，避免以下情况：

### ❌ 禁止引入渲染进程代码

```typescript
// src/preload/index.ts
export { exposeLayoutApi } from './api'
export { ElectronLayout } from '../renderer'  // ❌ 会导致打包体积暴涨
```

### ❌ 禁止暴露危险的 Node.js API

```typescript
// ❌ 渲染进程可以读取任意文件、执行任意命令
contextBridge.exposeInMainWorld('api', {
  readFile: (path) => fs.readFileSync(path),
  exec: (cmd) => child_process.exec(cmd),
})
```

### ❌ 避免引入大型依赖

```typescript
// ❌ 只用了一个函数，但打包了整个 lodash
import _ from 'lodash'
```

### ✅ 正确做法

preload 入口只应包含：
- `contextBridge.exposeInMainWorld()` 调用
- `ipcRenderer.invoke()` / `ipcRenderer.on()` 调用
- 纯常量和类型定义

## 构建配置

使用 Vite library mode 构建，支持 Vue SFC：

```typescript
// vite.config.ts 要点
- 多入口：index, main/index, preload/index, renderer/index
- 输出格式：ES + CJS
- external: vue, electron, element-plus, @element-plus/icons-vue
- 使用 vite-plugin-dts 生成类型声明
```

### package.json exports

```json
{
  ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
  "./main": { "types": "./dist/main/index.d.ts", "import": "./dist/main/index.js", "require": "./dist/main/index.cjs" },
  "./preload": { "types": "./dist/preload/index.d.ts", "import": "./dist/preload/index.js", "require": "./dist/preload/index.cjs" },
  "./renderer": { "types": "./dist/renderer/index.d.ts", "import": "./dist/renderer/index.js", "require": "./dist/renderer/index.cjs" }
}
```

## 发布

使用 `/new-version` 命令发布新版本，详见 `.claude/commands/new-version.md`。

## 提交规范

采用 Conventional Commits 规范：

```
<type>(<scope>): <subject>
```

**注意**：提交信息中不要添加 Co-Authored-By 或其他 AI 署名信息。

### Type

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `refactor` | 重构 |
| `chore` | 构建/依赖/发版 |

### Scope（可选）

- `layout` - 布局组件
- `about` - 关于对话框
- `main` - 主进程
- `preload` - 预加载脚本
- `types` - 类型定义

### 示例

```
feat(layout): 添加 tab-rename 事件
feat(about): 新增关于对话框组件
fix(main): 修复右键菜单不显示问题
chore: release v0.1.0
```
