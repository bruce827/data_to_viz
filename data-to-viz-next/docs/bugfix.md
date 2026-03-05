# Bugfix 记录

## 2026-02-28 点地图缩放错位（L7）

### 现象
- 使用鼠标缩放地图时，点位看起来悬浮在底图上方，不随底图同步缩放。

### 影响范围
- 地图决策树中的“点地图”弹窗图表（`chart-map-point`）。

### 根因
- L7 场景在开发态可能发生重复挂载/残留图层，导致同一容器内出现叠层。
- 容器挂载方式与清理逻辑不够严格，出现旧实例残留后与新实例视图不同步。

### 修复方案
- 点地图从 G2 切换为 L7 实现（真实高德底图）。
- 场景挂载改为绑定当前 `ref` 容器，不使用固定字符串 `id` 复用旧节点。
- 初始化前清空容器：`containerRef.current.innerHTML = ''`。
- 组件卸载时强制 `scene.destroy()` 并置空引用。
- 增加 `disposed` 防护，避免异步初始化晚到导致重复挂载。
- 支持从环境变量读取高德 Key：`NEXT_PUBLIC_AMAP_KEY`。

### 验证要点
- 缩放/拖拽时，底图与点位、文字标注保持同步。
- 反复打开/关闭弹窗后，不出现点位叠影或错位。
- 跨设备访问开发服务时，底图正常显示。

## 2026-03-01 DAG 节点延迟消失（G6 ReactNode）

### 现象
- DAG 图打开后节点先显示，约 1-2 秒后节点整体消失。

### 影响范围
- 网络关系决策树中的 “DAG图”（`chart-net-dag`）。

### 根因
- React 开发态下 effect 可能触发二次挂载，旧 G6 实例与新实例共用同一容器。
- 旧实例的异步生命周期结束后触发清理，误影响新实例渲染内容。

### 修复方案
- DAG 组件初始化前清空容器：`containerRef.current.innerHTML = ''`。
- 为每个实例创建独立挂载子节点，不直接复用外层容器。
- 组件清理时立即 `graph.destroy()` 并移除对应挂载子节点，避免实例间互相影响。
- 补充销毁时机控制：仅在 `render` 完成后执行销毁；若组件先卸载则标记 `disposed`，由 `render().then/catch` 回调统一销毁，避免“先销毁后渲染”竞态。
- `safeDestroy` 改为幂等（`destroyed` 标记），防止二次 `destroy` 触发 `[G6] graph instance has been destroyed` 日志。

### 验证要点
- 打开 DAG 弹窗后节点持续可见，不再延迟消失。
- 连续打开/关闭 DAG 弹窗，不出现闪烁、空白或节点丢失。

## 2026-03-01 小多图弹窗触发 G6 已销毁报错（DecisionGraph）

### 现象
- 打开“多分类+多数值 -> 小多图”时，控制台出现：
  `[G6 v5.0.51] The graph instance has been destroyed`。

### 影响范围
- 决策树主画布组件 `src/components/viz/tree/DecisionGraph.tsx`（非小多图本体）。

### 根因
- React 开发态的重复挂载/卸载周期中，旧 G6 实例仍有未完成异步渲染。
- 旧实例销毁与新实例初始化共用容器，导致销毁后的异步流程继续触发。

### 修复方案
- 每次初始化前清空外层容器，并创建独立 `mountEl` 作为 G6 实例容器。
- 引入 `disposed` 防护，销毁后阻断点击处理与错误上报。
- 清理阶段显式 `off('node:click')`，再执行 `graph.destroy()`，并移除 `mountEl`。
- 对 `graph.render()` 增加 catch，仅在未销毁状态下输出异常。

### 验证要点
- 打开/关闭小多图弹窗不再出现该 G6 报错。
- 切换决策树数据源或重复进入页面，不出现实例冲突与异常日志。

## 2026-03-01 小多图四个面板不显示（SmallMultiplesG2）

### 现象
- 打开“多分类+多数值 -> 小多图”后，四个面板区域存在但折线与点不显示。

### 影响范围
- `src/components/viz/charts/SmallMultiplesG2.tsx`

### 根因
- 弹窗开启阶段容器可能仍处于过渡状态，`clientWidth/clientHeight` 可能为 0，导致 G2 初始化后无有效绘图区。
- 组件重渲染时存在实例残留风险，影响后续面板渲染。

### 修复方案
- 小多图初始化改为“容器可见后再挂载”：使用 `requestAnimationFrame` 轮询尺寸，确认 4 个面板容器均有有效宽高后再创建图表。
- 每个面板渲染前先清空容器，避免重复挂载残留。
- 绘制方式改为稳定的链式 API：`line()` + `point()`，替代单次 `chart.options()` 组合写法。
- 卸载时统一取消 `rAF` 并销毁全部 chart 实例。

### 验证要点
- 打开小多图时四个面板均可见折线与点标记。
- 连续开关弹窗后仍稳定显示，不出现空白面板。

## 2026-03-04 密度热力图场景语义偏差与悬停抖动（DensityHeatmapScenarioG2）

### 现象
- `density2d` story 的“应用场景图”表现为离散阈值网格，更接近阈值热力图，而非密度热力图。
- 鼠标悬停时出现 tooltip 焦点切换不稳定，交互有“抖动/抢焦点”感。

### 影响范围
- `src/components/viz/charts/DensityHeatmapScenarioG2.tsx`
- `src/app/graph/density2d/page.tsx`

### 根因
- 场景图初版使用 `cell` 网格直接渲染聚合矩阵，图形语义偏向“阈值格子”而非“连续密度面”。
- 热力层与点层同时参与悬停反馈，并叠加 `elementHighlight`，导致 hover 体验不稳定。

### 修复方案
- 将 report 的二维聚合矩阵按原始占比重采样为连续点云数据。
- 使用核密度平滑（`kernel-smooth.density`）重建 `heatmap` 面层，匹配密度热力图语义。
- 点层仅保留为弱化参照，不再响应 tooltip；移除全局 `elementHighlight`。
- 同步调整 story 文案，明确“聚合矩阵 -> 点云重采样 -> 核密度平滑”的数据处理链路。

### 验证要点
- 视觉形态应为连续密度分布，而非离散格子热区。
- 悬停时 tooltip 来源稳定，不出现频繁跳变。
- 页面“应用场景”观点与数据口径一致（区分占比最高与绝对规模最大）。

## 2026-03-04 气泡图场景可读性问题（BubbleScenarioG2）

### 现象
- 气泡填充透明度偏高，颜色分层不够直观。
- 气泡边线颜色与 legend 色彩体系不一致。
- 顶部 legend 与图内元素存在遮挡感。

### 影响范围
- `src/components/viz/charts/BubbleScenarioG2.tsx`

### 根因
- 点标记 `fillOpacity` 偏低，且边线使用统一深色，弱化了分组颜色语义。
- 顶部留白不足，legend 与绘图区上缘距离过近。

### 修复方案
- 提升气泡填充不透明度（`fillOpacity` 调高至接近不透明）。
- 边线颜色改为与 `riskTag` 的颜色映射一致，保持与 legend 一一对应。
- 增加顶部内边距并下移 legend（`offsetY`），缓解遮挡。

### 验证要点
- 气泡颜色与策略分层在视觉上清晰可辨。
- 边线与 legend 颜色一致，不出现“颜色语义冲突”。
- legend 不再遮挡图形与标签。

## 2026-03-04 河流图场景运行时报错（StreamgraphFundingScenarioG2）

### 现象
- 打开 `chart-stream` story 场景图时报错：
  `TypeError: value.slice is not a function`。

### 影响范围
- `src/components/viz/charts/StreamgraphScenarioG2.tsx`

### 根因
- 自定义 tooltip 标题格式化对 `date` 使用了字符串 `slice`，但运行时数据在当前渲染链路中并不总是字符串。
- 图表配置与 G2 官方 streamgraph 示例存在偏差，导致格式化链路更脆弱。

### 修复方案
- 按官方示例链路重构场景图：`area -> stackY -> symmetryY -> encode(x/y/color)`。
- 去除不稳定的自定义 tooltip `slice` 格式化逻辑，保留基础编码与颜色映射。
- 统一数据字段为 `date / unemployed / industry`，避免额外转换分支。

### 验证要点
- `chart-stream` 页面正常渲染，不再抛出 `value.slice` 相关异常。
- 图形呈现对称堆叠河流形态，颜色分组稳定可辨。
