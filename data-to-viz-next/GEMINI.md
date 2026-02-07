# Data to Viz (Next.js 重构版) - 项目指南

本项目是经典的 [Data to Viz](https://www.data-to-viz.com/) 网站的现代化重构版本，旨在利用最新的 Web 技术提供更出色的交互体验和移动端兼容性。

## 🚀 项目概览

*   **技术栈**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Shadcn UI。
*   **可视化引擎**: 
    *   **AntV G6 (v5)**: 用于渲染交互式的可视化决策树。
    *   **AntV G2**: 用于详情页的动态数据图表渲染。
*   **设计理念**: "Clean Dashboard" 风格，采用 Slate (蓝灰) 和 Blue (蓝) 配色，强调响应式体验。

## 📂 核心目录结构

*   `src/app/`: Next.js 路由。
    *   `page.tsx`: 首页，包含 Tab 切换和决策树容器。
    *   `graph/`: 图表详情页（Story 页面）。
*   `src/components/viz/`: 业务相关的可视化组件。
    *   `tree/DecisionGraph.tsx`: 使用 G6 实现的桌面端决策树，通过 `react-node` 扩展渲染自定义节点。
    *   `tree/MobileDecisionTree.tsx`: 移动端适配组件，将树结构转为手风琴列表。
    *   `charts/`: 基于 G2 的各种图表组件（如 `HistogramG2`, `ScatterG2`）。
    *   `icons/`: 自定义 SVG 图标库。
*   `src/data/`: 决策树的静态 JSON 数据，分为数值、类别、地图等 6 大类。
*   `src/lib/`: 工具函数，如 `tree-utils.ts` 用于处理树形结构转换。
*   `src/components/ui/`: 基于 Shadcn UI 的基础组件（Button, Tabs, Dialog 等）。

## 🛠️ 开发指南

### 运行与构建
*   **开发环境**: `npm run dev` (注意：脚本配置中使用了 `--webpack` 标志)。
*   **构建项目**: `npm run build`。
*   **生产启动**: `npm run start`。
*   **代码规范**: `npm run lint`。

### 决策树开发说明
*   **G6 配置**: 决策树位于 `src/components/viz/tree/DecisionGraph.tsx`。它使用 `antv-dagre` 布局，并注册了名为 `react-node` 的自定义节点类型。
*   **节点类型**: 
    *   `decision-category`: 根节点。
    *   `decision-question`: 路径中的问题节点。
    *   `decision-chart`: 叶子节点（图表），点击会弹出 `Dialog` 显示详情。

### 图表开发说明
*   **G2 集成**: 每个图表组件（如 `HistogramG2`）应封装在 `useEffect` 中初始化并挂载到 `ref` 指向的 `div`。在组件卸载时务必调用 `chart.destroy()`。

## 📝 协作约定
1.  **样式**: 优先使用 Tailwind CSS 4 的类名。
2.  **组件**: 新增 UI 组件应遵循 Shadcn UI 模式，放置于 `src/components/ui`。
3.  **图标**: 如果需要新增图表图标，请在 `src/components/viz/icons` 中以 React 组件形式添加。
4.  **响应式**: 在开发新页面或组件时，务必考虑移动端表现。对于复杂图谱，考虑使用列表或卡片形式进行降级展示。
