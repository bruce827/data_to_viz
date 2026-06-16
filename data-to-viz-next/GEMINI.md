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

---

## ⚠️ 避坑指南：数据大屏暗色主题自适应与第三方库 (G2/G6) 拦截防崩手册

在为本项目开发“科技大屏暗色主题”时，遇到了第三方可视化库（AntV G2 / G6）因静态打包优化、对象冻结以及复杂 DOM 节点浅克隆导致的多个严重运行时崩溃 Bug。为避免后续开发重蹈步履，特整理以下核心防线规程：

### 1. 规避对图表配置项（Options）进行任何深度克隆（`safeDeepClone`）
*   **现象**：为防止 options 中的子视图配置被冻结导致无法写入 `theme: 'dark'`，曾尝试使用深度克隆。但这导致点击任意节点图表都会直接死循环或栈溢出崩溃。
*   **原因**：图表的配置项中通常会包含 React 的 **`container: HTMLDivElement` (真实的 DOM 节点)**。DOM 节点是一个极其庞大的浏览器 C++ 桥接对象，包含多重循环引用和海量只读属性。对其进行任何递归式深度克隆都会瞬间引爆主线程。
*   **规避规则**：**严禁对任何包含 DOM 节点、React 组件或窗口引用的 Options 对象进行深度递归克隆**。

### 2. 规避对图表原始配置（Opts）进行浅解构拷贝（`{ ...opts }`）
*   **现象**：为了防止冻结，对 options 进行最外层浅拷贝后，点击包含特定复合逻辑的图表（如堆叠面积图）依然引发 client-side exception 报错。
*   **原因**：在有些静态页面或特定编译优化下，传入的 `opts` 可能是**带有人为声明的 Class 实例对象**，或者具有特殊原型方法。如果进行结构浅拷贝（`{ ...opts }`），它会退化为普通纯 JSON 对象，**原有的原型链（prototype）和方法会瞬间丢失**。当 G2 内部引擎调用克隆后对象上的原型方法时，便抛出 `TypeError` 崩溃。
*   **规避规则**：**对于由第三方库实例化的复杂配置项，不要试图使用 `{ ...obj }` 进行拦截克隆传递，这会斩断它的原型链。**

### 3. 终极优雅实践：`render` 时可变属性前置修改 + `key={theme}` 热重构
为了兼顾“不碰 100 多个独立图表代码”和“绝对不破坏原始配置的原型与只读性”，采用以下终极策略：
*   **最安全拦截点**：在 `ThemeContext.tsx` 中拦截 **`G2Chart.prototype.render`**（以及 `G6Graph.prototype.render`）。因为此时图表内部已经实例化完毕，`this.options` 是 G2/G6 实例内部的**可变（mutable）内部配置树**，它绝不是 frozen 状态，也绝不涉及外部原型丢失问题。我们可以安全地在 `render` 执行前的最后一秒，做防御性地注入：`if (!this.options.theme) this.options.theme = theme`。
*   **切换不重绘问题**：因为大多数图表组件内部的挂载 `useEffect` 写死为空依赖项 `[]`，切换主题时 Canvas 不会自动重绘。解决方案是在所有图表的包装容器（`ChartWrapper` 以及 Dialog 外层）上**绑定 `key={theme}`**。当主题切换时，`theme` 状态变化，React 会强制销毁并重新挂载该容器下的图表，迫使 `useEffect` 重新走一遍实例化并触发最新的 `render` 拦截，实现完美的 Canvas 暗色白字字色适配。

