# 项目重构技术方案：决策树 (Decision Tree)

## 1. 项目概况
*   **项目名称**：决策树 (decision-tree-viz)
*   **目标**：将原有的 HTML+SVG 静态网站重构为现代化的 Web 应用。
*   **核心需求**：
    *   **UI/UX**：现代化的视觉设计与用户体验，支持响应式。**视觉风格参考：** `@decision_tree_demo.html`。
    *   **可维护性**：数据驱动视图，易于调整节点和逻辑。
    *   **功能**：保留决策树引导功能、Story 详情页、模态窗交互。

## 2. 技术栈选型 (Tech Stack)

### 2.1 核心框架
*   **Next.js (App Router) + TypeScript**
    *   **理由**：支持静态站点生成 (SSG)，保证极致的加载速度和 SEO。TypeScript 提供类型安全，方便维护复杂的数据结构。

### 2.2 样式与 UI 组件 (Modern & Lightweight)
*   **Tailwind CSS**
    *   **理由**：高效的原子化 CSS，项目布局和样式微调的核心。
*   **Shadcn UI** (基于 Radix UI)
    *   **理由**：
        *   **设计感**：极简、现代的视觉风格（Vercel 风格），摆脱“后台管理系统”的刻板印象。
        *   **轻量化**：按需引入组件源码，完全可控，无冗余打包体积。
        *   **核心组件映射**：
            *   `Modal` -> **`Dialog`** (优雅的弹窗交互)
            *   `Drawer` -> **`Sheet`** (侧边详情面板)
            *   `Segmented` -> **`Tabs`** (决策树分类切换)
            *   `Menu` -> **`Navigation Menu`** (顶部超级菜单)
            *   `Search` -> **`Command`** (Spotlight 风格的全局搜索)

### 2.3 可视化核心 (决策树)
*   **AntV G6**
    *   **理由**：
        *   专业的图可视化引擎，提供强大的树图布局算法（如紧凑树、脑图布局）。
        *   支持自定义节点（Custom Nodes），可以轻松嵌入 React 组件或 SVG。
        *   *注*：虽然 UI 换成了 Shadcn，但 G6 作为独立图引擎，依然是处理复杂树结构的最佳选择。

### 2.4 图表绘制 (节点图标 & 详情页)
*   **节点微图表**：**React SVG Components**
    *   **理由**：手绘/转换后的纯 SVG 组件。保持原项目的艺术手绘风格，且矢量高清，性能最优。
*   **详情页/Story图表**：**AntV G2**
    *   **理由**：在 Story 详情页展示真实数据的分析图表时，G2 提供了强大的图形语法，能够绘制专业且美观的数据可视化图表。

### 2.5 内容管理 (Story Pages)
*   **React Components (TSX)**
    *   **理由**：相比于 MDX，直接使用 React 组件开发 Story 页面能提供**最高的灵活性**。
    *   **实现方式**：
        *   **`StoryLayout`**：封装通用的文章结构（标题区、侧边导航、页脚、SEO 元数据）。
        *   **独立页面组件**：每篇 Story (如 `ViolinPlotStory.tsx`) 作为一个独立的 Page 组件，继承 `StoryLayout`。
        *   **内容积木**：封装通用的内容块组件，如 `<CodeBlock />`, `<ChartWrapper />`, `<TipBox />`，在页面中自由组合。

### 2.6 状态管理
*   **React Context**
    *   **理由**：管理全局状态（如当前选中的决策树类型、全局搜索框的显隐），轻量且原生。

## 3. 架构设计

### 3.1 目录结构
```text
/src
  /app           # Next.js 路由 (App Router)
  /components
    /ui          # Shadcn UI 组件 (Button, Dialog, Sheet...)
    /viz         # 可视化组件 (DecisionTree, Charts...)
    /layout      # 布局组件 (Navbar, Footer)
  /lib           # 工具函数 (utils.ts)
  /data          # 决策树静态数据 (nodes.json, edges.json)
  /content       # MDX 文章 (stories/*.mdx)
  /hooks         # 自定义 Hooks
```

### 3.2 数据结构设计 (Graph Data) - G6 v5 Compatible
为了适配 AntV G6 v5 的数据协议，并将业务逻辑与样式解耦，我们采用以下严谨的类型定义：

#### 3.2.1 业务数据接口
```typescript
// 节点内部承载的纯业务数据
interface DecisionNodePayload {
  label: string;         // 显示名称 (支持中文)
  labelEn?: string;      // 英文名称 (用于搜索/备用)
  icon?: string;         // 对应的 React SVG 图标组件名 (e.g., "HistogramIcon")
  description?: string;  // Tooltip 简短描述
  
  // 交互属性
  storyPath?: string;    // 点击跳转的路由 (e.g., "/story/histogram")
  modalContentId?: string; // 点击弹出的模态窗内容 ID (MDX 引用 ID)
}

// 连线内部承载的业务数据
interface DecisionEdgePayload {
  label?: string;          // 连线上的文字 (e.g., "Yes", "No", "One variable")
}
```

#### 3.2.2 G6 图数据接口
```typescript
// 适配 G6 v5 的标准节点格式
interface G6Node {
  id: string;              // 唯一标识 (e.g., "node-num-1")
  type: 'decision-category' | 'decision-question' | 'decision-chart'; 
                           // 对应我们在 G6 中注册的自定义 React 节点类型
  data: DecisionNodePayload; // 业务数据全部包裹在 data 属性中
  style?: {                // 初始样式覆盖 (可选)
    x?: number;
    y?: number;
    [key: string]: any;
  };
}

// 适配 G6 v5 的标准连线格式
interface G6Edge {
  id: string;              // e.g., "edge-1-2"
  source: string;          // 起始节点 ID
  target: string;          // 目标节点 ID
  data?: DecisionEdgePayload;
  style?: Record<string, any>;
}

// 最终的图数据对象
interface GraphData {
  nodes: G6Node[];
  edges: G6Edge[];
}
```

#### 3.2.3 数据文件示例 (`data/tree-numeric.json`)
```json
{
  "nodes": [
    { 
      "id": "root", 
      "type": "decision-category", 
      "data": { "label": "数值型", "icon": "NumericIcon" } 
    },
    { 
      "id": "q1", 
      "type": "decision-question", 
      "data": { "label": "几个变量?" } 
    },
    { 
      "id": "chart-hist", 
      "type": "decision-chart", 
      "data": { 
        "label": "直方图", 
        "icon": "HistIcon", 
        "storyPath": "/story/histogram",
        "description": "显示数值变量分布的最常用图表"
      } 
    }
  ],
  "edges": [
    { "id": "e1", "source": "root", "target": "q1" },
    { "id": "e2", "source": "q1", "target": "chart-hist", "data": { "label": "一个变量" } }
  ]
}
```

### 3.3 交互流程
1.  **加载**：页面加载时，Next.js 读取 JSON 数据。
2.  **渲染**：AntV G6 根据 JSON 数据计算布局，渲染画布。
3.  **自定义节点**：G6 渲染自定义节点，节点内部包含 React SVG Icon。
4.  **交互**：用户点击节点 -> G6 捕获事件 -> 触发 React Modal -> 显示关联的 MDX 内容或详情。

## 4. 开发计划
1.  **环境初始化**：搭建 Next.js + Tailwind + Shadcn UI 环境。
2.  **设计与规范 (UI/UX)**：
    *   **策略**：激活并使用自定义 Skill **`UI/UX pro`**。
    *   **参考**：以 `@decision_tree_demo.html` 的视觉效果为蓝本进行现代化重构与视觉升级。
    *   **目标**：该 Skill 将指导配色方案、排版规范、组件交互细节及响应式布局策略，确保产出符合国际顶级设计标准。
3.  **数据迁移**：将原 HTML 中的决策树逻辑提取为 `tree-data.json`。
4.  **组件开发**：
    *   封装 G6 TreeGraph 组件。
    *   绘制一套基础的 SVG 图表图标（直方图、散点图等）。
5.  **页面整合**：实现主页布局，嵌入 G6 画布。
6.  **详情页重构**：搭建 React 页面组件环境，迁移 1-2 篇 Story 文章进行测试。
