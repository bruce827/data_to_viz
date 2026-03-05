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

## Story 模板 Rules（页面与布局规范）
- 统一复用 `src/components/viz/story/StoryComponents.tsx` 中的模板组件（`StoryLayout`、`StorySection`、`ChartWrapper`、`CodeBlock`），避免每页自建结构。
- Hero 区域保持“紧凑标题区”风格：弱化装饰，避免大面积视觉抢占；`icon + title` 同行展示，不得恢复为大 Banner 式头图，除非用户明确要求。
- 大纲导航使用 `StoryLayout.outlineItems` 配置；仅在桌面端展示（`lg` 及以上），移动端不展示导航。
- 使用大纲导航时，每个章节必须给 `StorySection` 设置稳定 `id`，并与 `outlineItems` 一一对应，保证锚点可跳转。
- 页面正文采用 mobile-first：优先保证 375px 宽度下可读性（内边距、字号、行高、模块间距），避免横向溢出。
- 若涉及业务场景文案，必须优先对齐 `docs/deep-research-report.md` 的对应节点。
- 节点映射遵循“一页一节点 ID”原则：story 页面展示的核心应用场景应与当前决策树叶子节点 ID 对应，不混入其他叶子节点场景。
- 每次完成一个 story 页面后，必须在回复中明确告知其决策树路径（中文层级路径 + 节点 ID 路径）以及页面路由路径（如 `/graph/xxx`）。
- report 数据使用前必须先校验是否可直接满足图表渲染的数据格式；若不满足，需基于 report 给出的关键结论与指标口径，补充或构造合理的数据结构后再实现可视化。
- report 数据通常为高度凝练的业务数据；若绘图时发现不满足 G2 交互示例所需的数据结构或粒度，必须先与用户讨论补数方案与口径，再实现图表，不得自行假设扩展。
- 场景中的示例数据应落地为当前图表类型的可视化（例如直方图场景必须提供直方图表达），不得只保留纯文字描述。
- 每个 story 的“应用场景图”实现需先对照该页上方“交互示例”的图形语义与交互方式；优先使用 G2 官方 API 配置（如 `encode`、`scale`、`legend`、`axis`、`interaction`）完成交互，不得优先采用自定义 DOM 控件重写同类交互。
- 完成页面改动后至少执行：`npx eslint <changed-files>` 与 `npx tsc --noEmit`。

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
