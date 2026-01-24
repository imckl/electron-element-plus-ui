# CLAUDE.md

## 源码结构

```
src/
├── index.ts                 # 类型导出入口
├── types/
│   └── layout.ts            # 类型定义（Tab, Props）
└── renderer/
    ├── index.ts             # 渲染进程导出入口
    └── components/
        └── ElectronLayout.vue  # 布局组件
```

## 开发环境

可以在 WSL2 环境下开发（不涉及 Electron 二进制）：

```bash
npm install
npm run build
```

## 构建配置

使用 Vite library mode 构建，支持 Vue SFC：

```typescript
// vite.config.ts 要点
- 多入口：index, renderer/index
- 输出格式：ES + CJS
- external: vue, element-plus, @element-plus/icons-vue
- 使用 vite-plugin-dts 生成类型声明
```

### package.json exports

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  },
  "./renderer": {
    "types": "./dist/renderer/index.d.ts",
    "import": "./dist/renderer/index.js",
    "require": "./dist/renderer/index.cjs"
  }
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
- `types` - 类型定义

### 示例

```
feat(layout): 添加 header-right slot
fix(layout): 修复侧边栏折叠动画
chore: release v0.0.2
```
