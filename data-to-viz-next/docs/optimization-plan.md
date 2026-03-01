# 决策树项目优化方案（2026-03）

## 1. 当前现状（基线）
- 决策树功能层面：数值与分类、地图、网络关系、时间序列已基本落图完成。
- 构建层面：`npm run build` 可通过，但当前配置 `next.config.ts` 启用了 `typescript.ignoreBuildErrors: true`。
- 质量层面：`npm run lint` 仍有大量错误，`npx tsc --noEmit` 仍有多处类型错误。

## 2. 优化目标
- 保证所有决策树叶子节点都可稳定打开，图表不空白、无明显控制台报错。
- 将代码质量提升到可持续迭代状态：`lint`、`tsc` 可收敛并逐步清零。
- 最终恢复严格构建：关闭 `ignoreBuildErrors` 后仍可完成生产构建。

## 3. 分阶段执行
### 阶段 A（P0，先做）
- 清理决策树核心文件类型问题：`DecisionGraph.tsx`、`MobileDecisionTree.tsx`、`tree-utils.ts`。
- 补齐缺失类型声明（如 `topojson-client`）与路径类型定义缺口（如 `@/types/graph`）。
- 建立“叶子节点冒烟检查清单”：逐个点击节点，验证弹窗图渲染与交互。

### 阶段 B（P1）
- 统一修正 G2/G6 规范写法差异：`interaction/interactions`、`label/labels`、不兼容 transform 配置。
- 修正图表组件中的 `any` 与隐式 `any`，优先处理时间序列与已完成决策树关联组件。
- 地图组件继续遵循 `docs/bugfix.md` 中的 L7 生命周期与销毁约束。

### 阶段 C（P2）
- 全量收敛后关闭 `typescript.ignoreBuildErrors`。
- 将 `npm run lint` + `npx tsc --noEmit` 加入 PR 必检流程。
- 为关键图表补最小回归测试（至少快照或渲染可用性测试）。

## 4. 验收标准
- `npm run lint`：0 error。
- `npx tsc --noEmit`：0 error。
- `npm run build`：在严格类型校验下通过。
- 四棵决策树所有叶子节点图均可正常展示，核心交互可用。

## 5. 风险与回滚策略
- 风险：一次性大改会引入连锁回归。
- 策略：按“树模块”分批提交，每批只改一类问题；每批保留可回滚提交点。
