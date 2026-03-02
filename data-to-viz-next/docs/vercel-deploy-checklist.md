# Data to Viz Vercel 部署与访问方案清单

更新时间：2026-03-02

## 0. 目标与结论
- [ ] 目标确认：将当前站点部署到 Vercel，供 skill 工作流稳定返回固定 URL 访问。
- [ ] 访问策略确认：主链路使用线上 URL；本地临时起服务仅作为开发调试，不作为正式访问链路。
- [ ] 架构确认：本项目页面当前可静态预渲染，优先按静态站点思路部署与验收。

## 1. 发布前准备（本地）
- [ ] 同步代码到主分支（建议 `main`）并确保依赖可安装。
- [ ] 执行 `npm run lint`，记录并处理阻塞错误。
- [ ] 执行 `npx tsc --noEmit`，记录并处理阻塞错误。
- [ ] 执行 `npm run build`，确认构建成功。
- [ ] 确认关键环境变量名称：
  - [ ] `NEXT_PUBLIC_AMAP_KEY`
  - [ ] `NEXT_PUBLIC_AMAP_SECURITY_JS_CODE`（如你的高德控制台策略需要）

## 2. Vercel 项目创建与绑定
- [ ] 在 Vercel 导入本仓库（GitHub/GitLab/Bitbucket 任一）。
- [ ] Framework Preset 选择 `Next.js`（自动识别即可）。
- [ ] Root Directory 设为项目根目录：`data-to-viz-next`。
- [ ] Build Command 使用默认（`npm run build`）。
- [ ] Install Command 使用默认（`npm install`）。
- [ ] Output Directory 保持默认（Next.js 自动处理）。

## 3. Vercel 环境变量配置
- [ ] 在 Vercel Project Settings -> Environment Variables 添加：
  - [ ] `NEXT_PUBLIC_AMAP_KEY`（Production/Preview/Development 按需勾选）
  - [ ] `NEXT_PUBLIC_AMAP_SECURITY_JS_CODE`（如使用）
- [ ] 重新触发一次 Deploy，确保新变量生效。
- [ ] 验证地图相关弹窗在生产环境可正常加载底图与图层。

## 4. 首次上线验收（生产域名）
- [ ] 打开首页，确认 Tab 切换正常。
- [ ] 桌面端验证：决策树可缩放、拖拽、节点点击弹窗正常。
- [ ] 移动端验证：Accordion 交互正常，无遮挡与错位。
- [ ] 验证详情页路由可直接访问（至少抽查以下）：
  - [ ] `/graph/histogram`
  - [ ] `/graph/scatter`
  - [ ] `/graph/network`
  - [ ] `/graph/sankey`
  - [ ] `/graph/wordcloud`
- [ ] 验证地图页/地图弹窗：无空白、无明显报错、反复打开稳定。

## 5. skill 工作流接入（正式链路）
- [ ] 在 skill 配置中维护站点基址变量（例如 `DATA_TO_VIZ_BASE_URL`）。
- [ ] 工作流触发后统一返回线上 URL（例如 `${BASE_URL}/` 或 `${BASE_URL}/graph/scatter`）。
- [ ] 如 workflow 可传参，建立图表类型到路径的映射表：
  - [ ] `histogram -> /graph/histogram`
  - [ ] `scatter -> /graph/scatter`
  - [ ] `network -> /graph/network`
  - [ ] `sankey -> /graph/sankey`
- [ ] 对无法映射的类型统一回退到首页 `/`。

## 6. 版本发布流程（后续迭代）
- [ ] 代码合并到主分支后由 Vercel 自动部署。
- [ ] 每次发布至少执行一次线上冒烟（首页 + 一个图表页 + 一个地图相关节点）。
- [ ] 发生线上回归时，从 Vercel 回滚到上一个稳定 Deployment。
- [ ] 在 `docs/bugfix.md` 追加已知问题与修复记录，保持团队可追踪。

## 7. 可选兜底（建议后续做）
- [ ] 增加“静态兜底访问”方案：准备独立静态托管镜像（如对象存储/CDN）。
- [ ] 将关键远程示例数据逐步迁移到本仓库 `public/data`，降低第三方资源波动影响。
- [ ] 为 skill 增加健康检查逻辑：主域名不可达时提示备用 URL。

## 8. 完成标准（Done Definition）
- [ ] skill 触发后，用户始终能拿到可访问 URL。
- [ ] 生产环境首次打开时间与交互稳定，无明显白屏或加载失败。
- [ ] 地图类可视化在已配置高德 Key 的情况下稳定可用。
- [ ] 每次版本更新可在 10 分钟内完成发布与回归验证。
