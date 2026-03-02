# 报错修复 Checklist（已完成）

## A. 基础页面与文案
- [x] `src/app/graph/histogram/page.tsx` 处理未转义引号（`react/no-unescaped-entities`）。
- [x] `src/app/page.tsx` 清理未使用的 `TabsContent` 导入。

## B. 决策树核心（P0）
- [x] `src/components/viz/tree/DecisionGraph.tsx` 清理 `any`、未使用变量、事件类型不安全访问。
- [x] `src/components/viz/tree/MobileDecisionTree.tsx` 清理 `any`。
- [x] `src/lib/tree-utils.ts` 去除无效 `@/types/graph` 引用并补全本地类型定义。

## C. 图表组件 lint（优先 no-explicit-any）
- [x] `src/components/viz/charts/BoxplotG2.tsx`
- [x] `src/components/viz/charts/ConnectedScatterG2.tsx`
- [x] `src/components/viz/charts/DensityG2.tsx`
- [x] `src/components/viz/charts/HeatmapSevG2.tsx`
- [x] `src/components/viz/charts/HistogramG2.tsx`
- [x] `src/components/viz/charts/ParallelG2.tsx`
- [x] `src/components/viz/charts/RidgelineG2.tsx`
- [x] `src/components/viz/charts/Scatter3DG2.tsx`
- [x] `src/components/viz/charts/StreamgraphG2.tsx`

## D. TypeScript 编译错误（tsc）
- [x] `BackgroundMapG2.tsx`（`topojson-client` 声明与 `register` 类型）
- [x] G2 规范项不兼容（`interaction/interactions`、`label/labels`、`sort` 等）
- [x] G6 类型收敛（`IndentedTreeG6.tsx`、`FishboneG6.tsx` 等）
- [x] 其余隐式 `any` 与不兼容 transform 参数

## E. 验收
- [x] `npm run lint` 无 error
- [x] `npx tsc --noEmit` 无 error
- [x] `npm run build` 通过（已关闭 `ignoreBuildErrors`）

## 验收结果记录
- `npm run lint`：通过。
- `npx tsc --noEmit`：通过。
- `npm run build`：通过。
- 说明：本地沙箱环境下 `next build` 曾因进程端口绑定权限失败；在放开限制后构建通过，属于环境限制，不是代码错误。
