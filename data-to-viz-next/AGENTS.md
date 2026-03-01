# Repository Guidelines

## 项目结构与模块组织
这是一个基于 Next.js App Router（`src/app`）的数据可视化项目。
- `src/app`：路由与页面入口（如 `src/app/page.tsx`、`src/app/graph/*/page.tsx`）。
- `src/components/ui`：通用 Shadcn/Radix UI 基础组件。
- `src/components/viz`：可视化业务组件（`tree`、`charts`、`story`、`icons`）。
- `src/data`：决策树静态 JSON 数据源。
- `src/lib`：工具函数与通用逻辑。
- `public`：静态资源。

## 构建、测试与开发命令
- `npm install`：安装依赖。
- `npm run dev`：启动本地开发服务（`http://localhost:3000`）。
- `npm run build`：构建生产版本。
- `npm run start`：启动生产服务。
- `npm run lint`：运行 ESLint（Next.js core-web-vitals + TypeScript 规则）。
- `npx tsc --noEmit`：可选的严格类型检查，建议在提 PR 前执行。

## 代码风格与命名规范
- 语言：TypeScript + React 函数组件。
- 缩进：2 空格；延续现有分号与单引号风格。
- 优先使用 `@/*` 别名导入（见 `tsconfig.json`），避免过深相对路径。
- 组件文件使用 PascalCase（如 `DecisionGraph.tsx`、`HistogramG2.tsx`）。
- 路由目录使用小写命名（如 `src/app/graph/scatter`）。
- 样式以 Tailwind 为主；可复用基础组件放在 `src/components/ui`。

## Agent 专项规则（图表开发）
- 贡献者/Agent 应具备 React 图表交互开发能力，主要使用 AntV G2。
- 在实现或修改任何图表前，必须先检查 `docs/bugfix.md`，确认是否已有相关已知问题与修复约束。
- 在实现或修改任何图表前，必须优先查阅官方文档：`https://g2.antv.antgroup.com/manual/quick-start`。
- 地图类可视化优先使用 AntV L7：`https://l7.antv.antgroup.com/zh`，每次实现前必须先认真阅读并对照相关 API 文档。
- 严格遵循当前项目已定型的视觉与交互风格；未经用户明确允许，不得随意修改已完善的功能与样式。
- 新增图表的绘制样式与交互细节，应以“数值”页面为基准。

## 测试指南
当前仓库尚未配置专门的自动化测试框架。
- 至少执行：`npm run lint` 与 `npx tsc --noEmit`。
- 涉及 UI 变更时，需手动验证：首页 Tab 切换、桌面/移动端决策树交互、受影响的图表详情页。
- 如新增测试，建议与源码同目录放置 `*.test.ts(x)`，或放在 `src/__tests__/`。

## 提交与 Pull Request 规范
现有提交历史偏向简短、聚焦单一改动（如 `fix links`、`boxplot revamp`、`翻译`）。
- 提交信息应简洁、使用祈使语气，并聚焦单一变更。
- PR 应包含：变更目的、关键文件、验证步骤、关联 issue（如有）。
- 视觉改动请附前后截图或简短录屏。
