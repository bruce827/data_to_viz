# Data to Viz (Next.js 重构版)

本项目是对经典的 [Data to Viz](https://www.data-to-viz.com/) 网站的现代化重构。我们使用最新的 Web 技术栈（Next.js 14, AntV, Tailwind CSS）重新构建了整个应用，旨在提供更出色的交互体验、更美观的 UI 设计以及完全的移动端兼容性。

## ✨ 核心特性

*   **现代化技术栈**: 基于 **Next.js 14 (App Router)** 构建，享受静态生成 (SSG) 带来的极速加载体验。
*   **交互式决策树**: 使用 **AntV G6** 引擎实现了 6 大类数据可视化的决策引导树，支持流畅的缩放、拖拽和节点交互。
*   **精美 UI/UX**:
    *   采用 **Shadcn UI** + **Tailwind CSS** 打造的 "Clean Dashboard" 风格。
    *   全套重新绘制的 **SVG 矢量图标**，保持艺术手绘风格的同时确保高清显示。
    *   精心设计的微交互（悬停特效、毛玻璃背景）。
*   **响应式设计**: 独创的移动端适配策略——在桌面端显示图谱，在移动端自动切换为 **手风琴 (Accordion)** 列表，完美适应各种屏幕尺寸。
*   **沉浸式详情页**:
    *   内嵌 **AntV G2** 实时渲染的交互式图表（而非静态图片）。
    *   提供代码示例和详细的使用指南。

## 🛠️ 技术栈

*   **框架**: [Next.js 14](https://nextjs.org/) (React, TypeScript)
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **组件库**: [Shadcn UI](https://ui.shadcn.com/) (基于 Radix UI)
*   **可视化引擎**:
    *   **AntV G6** (v5): 用于绘制复杂的决策树图谱。
    *   **AntV G2**: 用于详情页的数据图表渲染。
*   **图标**: 自定义 SVG 组件库。

## 🚀 快速开始

### 前置要求
*   Node.js 18+
*   npm 或 yarn

### 安装依赖

```bash
cd data-to-viz-next
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可查看效果。

### 交互逻辑白盒检查

```bash
node scripts/whitebox-navigation-check.mjs
```

该脚本会校验搜索、story 跳转、返回决策树、定位节点这几条核心 URL 状态流，确保不会出现“回错面板”或“丢失节点上下文”的死路。

## 📂 项目结构

```text
src/
├── app/                  # Next.js App Router 路由
│   ├── page.tsx          # 首页 (包含 Tab 切换和决策树)
│   └── graph/            # 图表详情页 (Story Pages)
│       ├── histogram/
│       └── scatter/
├── components/
│   ├── ui/               # Shadcn UI 基础组件 (Button, Dialog, Tabs...)
│   └── viz/              # 可视化业务组件
│       ├── charts/       # G2 图表组件 (HistogramG2, ScatterG2)
│       ├── icons/        # SVG 图标库
│       ├── story/        # Story 页面布局模板
│       └── tree/         # 决策树组件 (DecisionGraph, MobileDecisionTree)
├── data/                 # 决策树静态数据 (JSON)
│   ├── tree-numeric.json
│   ├── tree-categoric.json
│   └── ...
└── lib/                  # 工具函数
```

## 🔎 全局搜索与导航逻辑

项目当前的搜索与导航有两套不同语义，必须区分：

### 1. 返回决策树

`返回决策树` 优先回到用户进入 story 之前所在的首页面板，而不是 story 自身所属的图表分类。

例如：
* 用户当前停留在 `数值 (num)` 面板。
* 通过全局搜索打开了一个 `地图 (geo)` story。
* 此时 story 页会保留 `originTab=num`。
* 点击 `返回决策树` 时，应回到 `/?tab=num`，而不是 `/?tab=geo`。

如果用户是从某个具体节点进入 story，还会继续保留 `originFocus=<nodeId>`，返回后首页会自动高亮该节点。

### 2. 定位

`定位` 是另一条动作链，它不关心用户原本在哪个面板，而是直接跳到当前 story 真正所属的决策树，并高亮其对应叶子节点。

例如：
* 搜索结果中的 `定位` 点击后，会跳到 `/?tab=geo&focus=chart-map-point`。
* 首页会自动切换到 `地图` 面板，并高亮目标节点。

### 3. URL 状态约定

当前使用以下 query 参数保留交互上下文：

* `tab`: 首页当前决策树面板
* `focus`: 首页当前高亮节点
* `originTab`: 进入 story 前所在的首页面板
* `originFocus`: 进入 story 前所在的首页高亮节点

这套约定的目标是保证：
* 搜索进入 story 后，返回不会回错面板
* 从树节点进入 story 后，返回不会丢失高亮节点
* `定位` 不会错误继承旧的 `originTab`

### 4. 代码入口

相关逻辑主要集中在：

* [src/components/search/GlobalSearchDialog.tsx](src/components/search/GlobalSearchDialog.tsx)
* [src/components/viz/story/StoryComponents.tsx](src/components/viz/story/StoryComponents.tsx)
* [src/components/viz/tree/DecisionGraph.tsx](src/components/viz/tree/DecisionGraph.tsx)
* [src/components/viz/tree/MobileDecisionTree.tsx](src/components/viz/tree/MobileDecisionTree.tsx)
* [src/lib/story-navigation.ts](src/lib/story-navigation.ts)
* [src/lib/navigation-flow.mjs](src/lib/navigation-flow.mjs)
* [scripts/whitebox-navigation-check.mjs](scripts/whitebox-navigation-check.mjs)

## 🎨 设计理念

本项目遵循 **"UI/UX Pro"** 设计规范：
*   **配色**: Slate (蓝灰色) 为主调，Blue (蓝色) 为强调色，营造专业且冷静的数据分析氛围。
*   **排版**: 使用大留白、清晰的层级和无衬线字体。
*   **交互**: 强调“即时反馈”，点击节点立即弹出模态框，无缝跳转详情页。

## 📄 许可证

本项目遵循 MIT 许可证。
