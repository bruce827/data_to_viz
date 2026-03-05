# 数值型图表在银行业信贷风控与经营管理中的可执行应用场景库  
（严格基于用户提供的 Numeric JSON 叶子节点，逐节点给出可直接用于 AntV G2 的示例数据与配置要点）

## 执行摘要

本报告以用户提供的 **Numeric JSON（/mnt/data/tree-numeric.json）叶子节点清单**为唯一图表类型来源，不新增 JSON 未包含的图表类型；共覆盖 **二十二个**叶子节点（每个叶子节点代表一种数值型图表）。每个叶子节点独立成章，提供：业务场景、节点ID（JSON 路径与 leaf id）、可直接用于工程渲染的明细样例数据（不超过五十行，JSON/CSV 片段）、以及面向“首席银行业务与信贷风控架构师/资深金融咨询合伙人”的洞察与可操作建议。

在监管与经营环境方面，近年可以概括为“**盈利与息差承压 + 重点领域风险出清（地产/平台/小微尾部） + 资本与流动性底线约束强化 + 数字金融与绿色金融进入实施方案化**”。例如：  
商业银行资本监管框架方面，我国《商业银行资本管理办法》明确自二〇二四年一月一日起施行，强调资本应抵御个体与系统性风险；且监管披露口径切换导致资本指标与历史数据不可直接可比，要求管理驾驶舱具备“口径版本管理”。citeturn1search2  
货币政策方面，人民银行二〇二四年第四季度报告提到全年两次降准、两次下调政策利率并引导 LPR 下行，客观上加大银行资产重定价与负债成本管理压力，推动更精细的 ALM/FTP 与风控协同。citeturn14search0turn14search1  
房地产风险处置方面，住建部与金融监管总局推动建立城市房地产融资协调机制，对“白名单”项目授信开绿道，同时强调贷款资金封闭管理、严防挪用，对银行贷前准入与贷后穿透提出更强约束。citeturn0search3  
数字金融方面，《银行业保险业数字金融高质量发展实施方案》提出以数字技术与数据要素赋能服务提质增效，这意味着“客群漂移、模型漂移、反欺诈对抗、渠道质量”需要用可解释的数值可视化持续监控。citeturn15search0  
绿色金融方面，金融监管总局与人民银行联合印发相关实施方案，强调提升绿色金融服务能力并防范环境、社会和治理风险；国际上 ISSB 发布 IFRS S1/S2，推动可持续披露趋于可比与可验证，银行需要把 ESG/气候风险指标工程化纳入授信与风控。citeturn1search3turn15search3  

在上述背景下，本报告的核心价值在于把“**每一种数值型图表**”绑定到“**具体的银行决策动作**”（准入/额度/定价/贷后/催收/拨备/资本/流动性/合规），并提供 **简短可用的数据片段与 AntV G2 配置要点**，便于在风险驾驶舱、授信审批看板、贷后监测平台、合规审计工作台中快速落地。

## 叶子节点清单与节点路径映射

下表为从用户提供的 Numeric JSON 中解析得到的全部叶子节点（共二十二个）。节点ID统一使用：**JSON 路径（root→…→leaf） + leaf id**；并保留 storyPath 作为工程路由/组件映射参考。

| 图表类型（JSON中文名） | leaf id | 节点路径（JSON path） | storyPath |
|---|---|---|---|
| 直方图 | chart-hist | root/q-1num/chart-hist | /graph/histogram |
| 密度图 | chart-density | root/q-1num/chart-density | /graph/density |
| 箱线图 | chart-boxplot | root/q-2num/q-2num-notordered/q-notordered-few/chart-boxplot | /graph/boxplot |
| 小提琴图 | chart-violin | root/q-2num/q-2num-notordered/q-notordered-many/chart-violin | /graph/violin |
| 直方图（少量样本） | chart-hist-few | root/q-2num/q-2num-notordered/q-notordered-few/chart-hist-few | /graph/histogram |
| 差异图 | chart-area | root/q-2num/q-2num-ordered/chart-area | /graph/area |
| 折线图 | chart-line | root/q-2num/q-2num-ordered/chart-line | /graph/line |
| 散点折线图 | chart-connected-scatter | root/q-2num/q-2num-ordered/chart-connected-scatter | /graph/connected_scatter |
| 散点图 | chart-scatter | root/q-2num/q-2num-notordered/q-notordered-few/chart-scatter | /graph/scatter |
| 阈值热力图 | chart-heatmap-many | root/q-2num/q-2num-notordered/q-notordered-many/chart-heatmap-many | /graph/heatmap |
| 堆叠面积图（大数据） | chart-stacked-area-many | root/q-2num/q-2num-notordered/q-notordered-many/chart-stacked-area-many | /graph/stackedarea |
| 密度热力图 | chart-density-heatmap | root/q-2num/q-2num-notordered/q-notordered-many/chart-density-heatmap | /graph/density2d |
| 堆叠面积图 | chart-stacked-area | root/q-sevnum/q-sevnum-ordered/chart-stacked-area | /graph/stackedarea |
| 河流图 | chart-stream | root/q-sevnum/q-sevnum-ordered/chart-stream | /graph/streamgraph |
| 多线折线图 | chart-line-sev | root/q-sevnum/q-sevnum-ordered/chart-line-sev | /graph/line |
| 山脊图 | chart-correlogram | root/q-sevnum/q-sevnum-notordered/chart-correlogram | /graph/correlogram |
| 气泡图 | chart-bubble | root/q-3num/chart-bubble | /graph/bubble |
| 三维散点图 | chart-scatter3d | root/q-3num/chart-scatter3d | /graph/scatter3d |
| 热力图 | chart-heatmap | chart-heatmap | /graph/heatmap |
| 降维散点图 | chart-pca | root/q-sevnum/q-sevnum-notordered/chart-pca | /graph/pca |
| 树状图 | chart-dendrogram | root/q-sevnum/q-sevnum-notordered/chart-dendrogram | /graph/dendrogram |
| 平行坐标图 | chart-parallel | root/q-sevnum/q-sevnum-notordered/chart-parallel | /graph/parallel |

## 方法与工程落地说明

### 示例数据如何直接用于 AntV G2

本报告每章均给出“**示例数据片段（JSON 或 CSV）**”，遵循以下工程化约定：  
时间字段优先使用 ISO 日期字符串（如 2025-12-31）或季度字符串（如 2025Q4），在 G2 中建议显式转换为 `Date` 对象以获得时间尺度（time scale）上的连续渲染与更合理的刻度。折线图天然适合展示连续时间序列趋势；多线折线图在数据中额外提供 `series`（或 `segment`）字段，并映射到颜色/系列通道。citeturn22search1  
缺失值建议用 `null` / `undefined` 表示，并在业务层定义“缺失是否可接受”：例如监管披露季度口径缺失时应与“口径版本管理”联动；客户级行为数据缺失则应触发数据质量告警（而不是在图表端默默插值）。  
数值单位要求在字段名或 tooltip 中显式表达（如 `npl_ratio_pct`、`balance_bn_cny`），并保持跨图一致；对于百分比，建议存储为“数值百分比”（例如 1.50 表示 1.50%），避免在图层再做隐式乘除导致审计风险。

### 常用 G2 配置语法与转换建议

本报告在“可视化要点”部分，倾向用 G2 的“数据—编码—转换—交互”结构表达可落地配置：  
Tooltip（提示信息）是图表交互核心组件，适合在高密度图（热力、散点）中承载口径说明、数值单位、阈值提示等信息；建议开启 shared tooltip（多系列共享）与自定义 formatter 来增强可读性。citeturn16search0  
直方图建议用 `binX` 对连续数值分箱，把连续变量转为可计算的区间统计，避免手工分箱造成的口径漂移；分箱阈值（阈值数、区间宽度）应与业务节奏一致（如逾期按三十天分箱）。citeturn16search2  
密度图/小提琴图建议用 `kde`（核密度估计）转换生成平滑分布曲线，用于识别多峰、长尾与分布漂移；对渠道/行业/模型版本进行 `groupBy` 有助于定位漂移来源。citeturn23search0turn23search3  
堆叠面积图（含河流图/归一化堆叠）建议使用 `stackY` 转换获得 y0/y1 区间，实现“部分—整体”关系表达；堆叠顺序、归一化与平滑设置应与管理意图一致（强调规模 vs 强调占比）。citeturn21search0turn21search1  
热力图（heatmap mark）典型字段为 x、y、value，并将 value 映射到 color 通道；色阶建议绑定阈值（如“红黄绿”风险区），同时为极端值提供裁剪或对数尺度选项，避免色阶被极端值“挤压”。citeturn16search1  
平行坐标适合多维指标对齐与异常组合识别，可结合 brush/highlight 交互做“按轴刷选”，用于授信委员会或审计抽样场景的快速发现。citeturn17search2  

## 示例章节模板

**场景名称**：〔建议采用“业务对象 + 决策动作 + 风险主题”的命名方式〕  
**节点ID**：〔JSON path〕；leaf id=〔leaf id〕  
**场景描述**：业务背景（客群/产品/流程节点）→ 风险痛点 → 决策动作（准入/额度/定价/贷后/资本/流动性/合规）→ 为什么该图表最合适  
**明细数据（表格）**：给出不超过五十行的关键样例数据，并标注来源（官方/年报/监管披露/虚构）  
**示例数据片段（JSON/CSV）**：可直接喂给 AntV G2  
**基于数据的观点表达（两到四条）**：用“结论 + 证据（数据点） + 风险含义”的方式  
**可操作建议（一到两条）**：可落地到制度/参数/系统联动/阈值的动作  
**可视化要点（含 AntV G2 配置要点）**：字段映射、转换（binX/kde/stackY 等）、tooltip、legend、scale、交互（legend-filter/brush 等）  
**是否虚构与数据来源**：明确“是否虚构”；如部分字段虚构应逐字段说明  

```mermaid
flowchart LR
A[数据源<br/>核心账务/信贷/抵押/交易/外部数据] --> B[统一口径层<br/>客户主键/产品口径/时间粒度]
B --> C[指标与模型<br/>PD/LGD/EAD/ECL/RAROC/ALM]
C --> D[图表组件库<br/>本报告二十二类数值图表]
D --> E[决策动作<br/>准入/额度/定价/贷后/催收/资本/流动性/合规]
E --> F[留痕与治理<br/>阈值告警/模型漂移/审计追溯]
```

## 场景库

### 直方图

**场景名称**：零售贷款逾期天数（DPD）分布监控与早期预警  
**节点ID**：root/q-1num/chart-hist；leaf id=chart-hist  
**场景描述**：在息差承压与零售数字化加速背景下，零售贷款往往出现“轻逾期堆积→滚动逾期→实质违约”的迁徙路径。直方图适合看分布与长尾，解决“平均值掩盖尾部风险”的典型问题；用于贷后分层策略、IFRS 预期损失阶段（Stage）触发规则校准与催收资源配置。货币政策引导利率下行会压缩银行息差，倒逼以更精细的风险分层提升单位资本回报。citeturn14search0turn14search1  

**明细数据（示例；虚构数据）**

| account_id | dpd_days | balance_cny | channel |
|---|---:|---:|---|
| A001 | 0 | 12500 | app |
| A002 | 5 | 8600 | app |
| A003 | 12 | 23000 | branch |
| A004 | 35 | 54000 | app |
| A005 | 62 | 78000 | partner |
| A006 | 95 | 42000 | app |
| A007 | 180 | 168000 | branch |
| A008 | 220 | 210000 | branch |

**示例数据片段（JSON，不超过五十行；虚构数据）**
```json
[
  {"account_id":"A001","dpd_days":0,"balance_cny":12500,"channel":"app"},
  {"account_id":"A002","dpd_days":5,"balance_cny":8600,"channel":"app"},
  {"account_id":"A003","dpd_days":12,"balance_cny":23000,"channel":"branch"},
  {"account_id":"A004","dpd_days":35,"balance_cny":54000,"channel":"app"},
  {"account_id":"A005","dpd_days":62,"balance_cny":78000,"channel":"partner"},
  {"account_id":"A006","dpd_days":95,"balance_cny":42000,"channel":"app"},
  {"account_id":"A007","dpd_days":180,"balance_cny":168000,"channel":"branch"},
  {"account_id":"A008","dpd_days":220,"balance_cny":210000,"channel":"branch"},
  {"account_id":"A009","dpd_days":18,"balance_cny":15000,"channel":"app"},
  {"account_id":"A010","dpd_days":28,"balance_cny":9800,"channel":"app"},
  {"account_id":"A011","dpd_days":41,"balance_cny":36000,"channel":"partner"},
  {"account_id":"A012","dpd_days":7,"balance_cny":6400,"channel":"branch"}
]
```

**基于数据的观点表达**  
- 分布呈现明显长尾（DPD 一百八十天、二百二十天仍存在且余额较高），说明尾部暴露对损失贡献不成比例，应把“长尾余额占比”作为高管级指标。  
- 轻逾期（DPD 三十天以内）样本量更多，若不在“滚动前窗口”介入，催收成本与 LGD 往往呈非线性上升。  
- partner 渠道在三十五至六十二天区间出现，提示渠道准入与反欺诈策略需与贷后分层联动，符合数字金融“以数据要素驱动治理”的方向。citeturn15search0  

**可操作建议**  
- 将 DPD 三十天与九十天设为硬触发点：三十天触发自动降额/冻结新增借款，九十天触发强催与资产保全路径。  
- 在贷后看板增加“长尾余额占比 + 回收路径分布”联动页，确保处置策略可审计、可复盘。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=dpd_days`（连续），`y=count`（由 binX 转换得到）。  
- 关键转换：使用 `binX` 对 dpd_days 分箱（例如每三十天一箱）。citeturn16search2  
- tooltip：展示区间范围、账户数、区间余额合计（可在预聚合后展示）。citeturn16search0  
- 交互：建议加 brushX 框选区间后联动明细表（drill-down）。

**是否虚构与数据来源**：虚构数据（用于展示直方图分布与长尾特征）。

### 密度图

**场景名称**：反洗钱现金交易金额“贴阈值”结构化行为密度识别  
**节点ID**：root/q-1num/chart-density；leaf id=chart-density  
**场景描述**：对现金缴存/支取金额做密度图，识别在监管阈值附近出现异常峰值的“拆分/贴阈值”结构化交易。人民银行《金融机构大额交易和可疑交易报告管理办法》规定：当日单笔或累计现金收支人民币五万元以上（含）属于应报告的大额交易之一；因此密度图可作为“阈值对抗”行为筛查的前置可视化组件。citeturn13search0  

**明细数据（示例；部分口径来源官方、数值为虚构样例）**

| txn_id | amount_cny | channel | customer_type |
|---|---:|---|---|
| T001 | 49500 | counter | individual |
| T002 | 49800 | counter | individual |
| T003 | 50200 | counter | individual |
| T004 | 51000 | counter | individual |
| T005 | 12000 | atm | individual |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"txn_id":"T001","amount_cny":49500,"channel":"counter","customer_type":"individual"},
  {"txn_id":"T002","amount_cny":49800,"channel":"counter","customer_type":"individual"},
  {"txn_id":"T003","amount_cny":50200,"channel":"counter","customer_type":"individual"},
  {"txn_id":"T004","amount_cny":51000,"channel":"counter","customer_type":"individual"},
  {"txn_id":"T005","amount_cny":12000,"channel":"atm","customer_type":"individual"},
  {"txn_id":"T006","amount_cny":18000,"channel":"atm","customer_type":"individual"},
  {"txn_id":"T007","amount_cny":47000,"channel":"counter","customer_type":"individual"},
  {"txn_id":"T008","amount_cny":53000,"channel":"counter","customer_type":"individual"}
]
```

**基于数据的观点表达**  
- 在四万九千至五万一千附近出现密度聚集（示例数据多笔贴近阈值），形态上更像策略性拆分而非自然现金需求。  
- 若该峰值集中在少数网点/少数客户群（如个人频繁往返柜台），应优先进入人工核查与增强尽调（EDD）。  
- 相比仅用规则“是否超过五万元”，密度图能揭示“阈值附近堆积”这一对抗性特征，契合办法要求金融机构制定并评估交易监测标准。citeturn13search0  

**可操作建议**  
- 对“阈值附近高频”客户设置二级规则：频次、时间间隔、跨账户关联（同设备/同地址/同收款人）联合触发。  
- 建立“峰值解释”留痕字段（客户画像、交易目的、资金来源证明），便于合规审计复核。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=amount_cny`，`y=density`（由 kde 转换产生）  
- 转换：G2 建议用 `kde` 生成密度曲线；可按 `channel` 或 `customer_type` 做 `groupBy` 形成多条密度曲线。citeturn23search0turn23search3  
- 阈值线：在 x=50000 处加 referenceLine（注释），并在 tooltip 中提示监管阈值条款要点。citeturn13search0turn16search0  

**是否虚构与数据来源**：交易金额数据为虚构；阈值口径依据人民银行规章。citeturn13search0  

### 箱线图

**场景名称**：小微企业贷款风险溢价（利差）在行业维度的异常点诊断  
**节点ID**：root/q-2num/q-2num-notordered/q-notordered-few/chart-boxplot；leaf id=chart-boxplot  
**场景描述**：普惠小微贷款余额持续增长（例如监管披露二〇二五年四季度末普惠型小微贷款余额三十七万亿元，同比增速两位数），在“量增”下最易出现“以价换量、风险溢价不足”。箱线图用来比较不同行业的贷款利差（贷款利率减 FTP/资金成本），识别定价过低的行业与异常高利差（可能对应逆向选择或过度风险补偿）。citeturn2search1turn1search0  

**明细数据（示例；虚构数据，单位：bp）**

| industry | spread_bp |
|---|---:|
| 餐饮 | 240 |
| 餐饮 | 310 |
| 餐饮 | 180 |
| 建工分包 | 290 |
| 建工分包 | 360 |
| 制造中游 | 190 |
| 制造中游 | 140 |
| 批发零售 | 210 |
| 批发零售 | 160 |

**示例数据片段（CSV；虚构数据）**
```csv
industry,spread_bp
餐饮,240
餐饮,310
餐饮,180
餐饮,260
建工分包,290
建工分包,360
建工分包,230
制造中游,190
制造中游,140
制造中游,220
批发零售,210
批发零售,160
批发零售,260
```

**基于数据的观点表达**  
- 制造中游利差分布偏低且离散度小，若真实 PD/LGD 并未同步改善，可能存在系统性“风险补偿不足”。  
- 建工分包出现上侧异常点（高利差），需要与逾期/违约数据交叉验证：若高利差伴随高违约，可能是典型逆向选择。  
- 箱线图的行业对标能把“价格战”从业务感受变为可审计事实，适合纳入授信审批与定价例外管理。

**可操作建议**  
- 将“定价落在行业第一四分位以下”设为强制例外：必须补充现金流锁定、担保增信或额度压降原因。  
- 按季度做“利差—迁徙率回溯”，对行业底线溢价进行参数化更新，形成定价治理闭环。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=industry`，`y=spread_bp`。  
- mark：boxplot；数据输入可用“原始样本”，由图表端计算四分位与异常点。  
- tooltip：显示中位数、IQR、异常点数量；点击异常点联动客户名单。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示箱线图行业对标与异常点识别）。

### 小提琴图

**场景名称**：线上获客客群漂移下的 PD 分布双峰识别  
**节点ID**：root/q-2num/q-2num-notordered/q-notordered-many/chart-violin；leaf id=chart-violin  
**场景描述**：数字金融实施方案强调以数字化赋能服务提质增效；但线上获客在投放策略变化时，容易引入“高风险流量”导致 PD 分布出现双峰与长尾。小提琴图结合箱线与密度，专门用于比较不同渠道的分布形态，适合做渠道质量治理与模型漂移监控。citeturn15search0turn16search3turn23search0  

**明细数据（示例；虚构数据，PD 为未来十二个月违约概率）**

| channel | pd_12m |
|---|---:|
| app | 0.018 |
| app | 0.022 |
| app | 0.091 |
| branch | 0.015 |
| branch | 0.020 |
| partner | 0.035 |
| partner | 0.125 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"channel":"app","pd_12m":0.018},
  {"channel":"app","pd_12m":0.022},
  {"channel":"app","pd_12m":0.031},
  {"channel":"app","pd_12m":0.089},
  {"channel":"app","pd_12m":0.091},
  {"channel":"branch","pd_12m":0.015},
  {"channel":"branch","pd_12m":0.020},
  {"channel":"branch","pd_12m":0.028},
  {"channel":"partner","pd_12m":0.035},
  {"channel":"partner","pd_12m":0.064},
  {"channel":"partner","pd_12m":0.125}
]
```

**基于数据的观点表达**  
- app 渠道出现“低 PD 群体 + 高 PD 尾部”并存的形态（示例中 0.02 附近与 0.09 附近同时出现），这是典型的客群漂移信号。  
- partner 渠道尾部更高（0.125），说明导流渠道存在更强的对抗性风险，需要将投放与反欺诈策略联动治理。  
- 若在利率下行、息差承压环境中继续扩量而不压住 PD 尾部，会形成“利润薄 + 损失厚”的非线性风险放大。citeturn14search0turn14search1  

**可操作建议**  
- 对渠道设置“尾部约束指标”（如 P90/P95 上限或高 PD 占比阈值），触发即自动降额/暂停投放。  
- 将小提琴图纳入模型治理月报，与 PSI/KS、真实违约率分层回溯并列为“渠道准入硬门槛”。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=channel`，`y=pd_12m`。  
- KDE：用 `kde` 生成密度形状，小提琴图本质依赖核密度估计。citeturn23search0turn16search3  
- 交互：legend-filter（按渠道筛选）、tooltip 展示中位数与分位数；支持点击渠道钻取到“投放批次/地区”。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示小提琴图的双峰/长尾与渠道对比优势）。

### 直方图（少量样本）

**场景名称**：大额对公违约案件 LGD 小样本长尾与极端值复盘  
**节点ID**：root/q-2num/q-2num-notordered/q-notordered-few/chart-hist-few；leaf id=chart-hist-few  
**场景描述**：大额对公违约事件“笔数少但损失大”，LGD 分布常被少数极端案例拖拽。少量样本直方图用于风险模型参数治理（LGD 分层、专家调整）与处置路径复盘（抵质押可执行性、司法周期、跨境追偿）。资本新规强调资本抵御风险能力，高 LGD 的尾部资产会显著抬升经济资本与 RWA 压力。citeturn1search2  

**明细数据（示例；虚构数据）**

| case_id | industry | lgd |
|---|---|---:|
| D01 | 房地产上下游 | 0.79 |
| D02 | 商贸 | 0.85 |
| D03 | 制造 | 0.45 |
| D04 | 科技服务 | 0.72 |
| D05 | 建工 | 0.58 |

**示例数据片段（CSV；虚构数据）**
```csv
case_id,industry,lgd
D01,房地产上下游,0.79
D02,商贸,0.85
D03,制造,0.45
D04,科技服务,0.72
D05,建工,0.58
D06,物流,0.38
D07,农业,0.41
D08,公用事业,0.30
D09,房地产上下游,0.62
D10,出口贸易,0.68
```

**基于数据的观点表达**  
- lgd 出现明显右尾（0.79、0.85），说明“少数案件决定组合尾部损失”，均值不稳，必须以分位数与情景复盘替代简单平均。  
- 房地产上下游 LGD 离散（0.62 与 0.79），提示“项目现金流封闭与抵押物可处置性”比行业标签更关键，应按项目层维度再分层。房地产融资协调机制强调资金封闭管理与对问题企业审慎授信，为 LGD 分层提供监管方向。citeturn0search3  
- 在资本约束下，若高 LGD 暴露集中于少数集团或担保圈，将形成系统性尾部隐患。citeturn1search2  

**可操作建议**  
- 建议把 LGD 分层从“行业”升级为“抵押物可处置性×司法进度×现金流封闭程度”三维分层，并形成处置复盘模板留痕。  
- 对极端 LGD 案例纳入模型风险管理（MRM）红名单：参数更新需经模型委员会审批。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=lgd`，`y=count`（binX 分箱）。citeturn16search2  
- 分箱：建议以 0.1 为宽度分箱；对 0.7 以上区间着色强调尾部。  
- tooltip：展示该箱案例列表（case_id）与行业构成，支持 drill-down。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示小样本分布与极端值）。

### 差异图

**场景名称**：资产负债管理中的存贷款错配差异面积（缺口）监控  
**节点ID**：root/q-2num/q-2num-ordered/chart-area；leaf id=chart-area  
**场景描述**：在政策利率与 LPR 下行环境中，银行往往通过“扩资产”对冲收益下滑；若负债端（核心存款）增长不足，会形成结构性资金缺口并抬升同业/债券融资依赖，进一步挤压息差。差异图用于直观看到两条趋势曲线间的“面积差”（缺口累积）。citeturn14search0turn14search1  

**明细数据（示例；虚构数据，单位：万亿元）**

| date | metric | value |
|---|---|---:|
| 2025-07-31 | loans | 24.1 |
| 2025-07-31 | deposits | 23.6 |
| 2025-08-31 | loans | 24.6 |
| 2025-08-31 | deposits | 23.8 |
| 2025-09-30 | loans | 25.0 |
| 2025-09-30 | deposits | 24.0 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"date":"2025-07-31","metric":"loans","value":24.1},
  {"date":"2025-07-31","metric":"deposits","value":23.6},
  {"date":"2025-08-31","metric":"loans","value":24.6},
  {"date":"2025-08-31","metric":"deposits","value":23.8},
  {"date":"2025-09-30","metric":"loans","value":25.0},
  {"date":"2025-09-30","metric":"deposits","value":24.0},
  {"date":"2025-10-31","metric":"loans","value":25.4},
  {"date":"2025-10-31","metric":"deposits","value":24.1}
]
```

**基于数据的观点表达**  
- loan 与 deposit 曲线差异扩大，意味着资金来源更依赖批发融资，资金成本弹性上升，NIM 管理难度加大。  
- 若差异扩大同时 LCR/NSFR 边际走弱，将形成“信用风险处置能力下降”的二次风险（资金紧约束下处置更慢、LGD 更高）。监管披露显示行业层面 LCR 在二〇二五年四季度为一百五十七点九九，整体平稳但单体波动不可忽视。citeturn2search1  
- 货币政策推动利率下行并不必然改善息差，关键在负债成本传导与负债结构治理。citeturn14search0turn14search1  

**可操作建议**  
- 建立“缺口红黄线”：缺口/总负债、缺口/HQLA 双阈值触发资产投放节制与负债补短板行动。  
- 用 FTP 把缺口成本内生到业务条线，避免资产端“冲规模”外部化资金成本。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=date`（转 Date），`y=value`，`color=metric`。  
- 展示方式：两条线 + 差异填充（area between）；tooltip 共享展示 loans/deposits/差值。citeturn16search0  
- scale：y 轴建议 `nice=true`，避免大数刻度不友好；必要时用单位换算（万亿元）。

**是否虚构与数据来源**：虚构数据（用于展示差异图在 ALM 缺口监控中的优势）。

### 折线图

**场景名称**：商业银行不良贷款率（NPL）季度趋势与“表面稳定”偏差纠正  
**节点ID**：root/q-2num/q-2num-ordered/chart-line；leaf id=chart-line  
**场景描述**：NPL 是董事会/风险委最常用的结果指标之一，但其“平稳”可能掩盖结构问题（关注类贷款堆积、迁徙率上升、拨备补提能力下降）。折线图用于将监管披露季度数据串联，并结合口径变更注释，形成可审计的趋势证据链。监管披露显示：二〇二三年四季度 NPL 约一点五九；二〇二四年四季度约一点五零；二〇二五年三季度约一点五二；二〇二五年四季度约一点五零。citeturn8view0turn11view0turn1search0turn2search1  

**明细数据（官方披露汇总，单位：%）**

| quarter | npl_ratio_pct | source |
|---|---:|---|
| 2023Q4 | 1.59 | 监管披露转载（来源注明金融监管总局） |
| 2024Q4 | 1.50 | 行业协会转载（来源注明金融监管总局） |
| 2025Q3 | 1.52 | 金融监管总局 |
| 2025Q4 | 1.50 | 金融监管总局 |

**示例数据片段（JSON；来源如上）**
```json
[
  {"quarter":"2023Q4","npl_ratio_pct":1.59,"source":"NFRA(转载)"},
  {"quarter":"2024Q4","npl_ratio_pct":1.50,"source":"NFRA(转载)"},
  {"quarter":"2025Q3","npl_ratio_pct":1.52,"source":"NFRA"},
  {"quarter":"2025Q4","npl_ratio_pct":1.50,"source":"NFRA"}
]
```

**基于数据的观点表达**  
- NPL 在一点五附近窄幅波动并不等于风险下降：需并联关注类贷款、迁徙率与拨备补提能力，否则容易产生“结果指标稳定=风险可控”的错觉。citeturn2search1turn1search0  
- 二〇二五年三季度 NPL 上行而四季度回落，提示风险处置与核销/转让可能存在季节性或阶段性动作，高管层需要看到“处置质量”而非仅看比率。citeturn1search0turn2search1  
- 在利率下行与净利润承压环境下，若利润弹性下降导致拨备补提空间收窄，同样的 NPL 水平可能隐含更高的系统脆弱性。citeturn14search0turn14search1  

**可操作建议**  
- 将折线图扩展为“三线套”：NPL、关注类余额/占比、三十天滚动逾期率，形成前瞻信号。  
- 对涉房、小微、线上零售等重点组合单独拉通折线与阈值，避免全行加总掩盖结构风险。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=quarter`（可转为季度末日期），`y=npl_ratio_pct`。  
- tooltip：展示来源字段与口径注释；必要时增加参考线（风险偏好目标线）。citeturn16search0  
- axis：季度标签建议格式化（例如 2025Q4）。  

**是否虚构与数据来源**：数据来自监管披露及其权威转载。citeturn8view0turn11view0turn1search0turn2search1  

### 散点折线图

**场景名称**：风险—流动性联动轨迹（NPL 与 LCR 的季度迁移路径）  
**节点ID**：root/q-2num/q-2num-ordered/chart-connected-scatter；leaf id=chart-connected-scatter  
**场景描述**：系统性压力往往表现为“资产质量恶化→融资条件趋紧→流动性缓冲下降→处置能力下降→LGD 上升”的链式反应。将 NPL（y）与 LCR（x）画为散点并按季度连线，可直观识别风险从“安全象限”向“压力象限”的迁移。监管披露显示二〇二五年三季度 LCR 约一百四十九点七三、NPL 一点五二；二〇二五年四季度 LCR 回升至一百五十七点九九、NPL 回落至一点五零。citeturn1search0turn2search1  

**明细数据（官方披露汇总，单位：%）**

| quarter | lcr_pct | npl_ratio_pct | source |
|---|---:|---:|---|
| 2023Q4 | 151.60 | 1.59 | 监管披露转载（来源注明金融监管总局） |
| 2024Q4 | 154.73 | 1.50 | 行业协会转载（来源注明金融监管总局） |
| 2025Q3 | 149.73 | 1.52 | 金融监管总局 |
| 2025Q4 | 157.99 | 1.50 | 金融监管总局 |

**示例数据片段（JSON；来源如上）**
```json
[
  {"quarter":"2023Q4","lcr_pct":151.60,"npl_ratio_pct":1.59},
  {"quarter":"2024Q4","lcr_pct":154.73,"npl_ratio_pct":1.50},
  {"quarter":"2025Q3","lcr_pct":149.73,"npl_ratio_pct":1.52},
  {"quarter":"2025Q4","lcr_pct":157.99,"npl_ratio_pct":1.50}
]
```

**基于数据的观点表达**  
- 二〇二五年三季度出现“LCR 下降 + NPL 上升”的组合，属于典型的联动压力窗口，应触发更高频的资产组合与负债结构复盘。citeturn1search0  
- 二〇二五年四季度 LCR 回升并不自动意味着风险下降，需结合关注类、拨备与资本指标综合判断；监管披露在同一口径下同步披露拨备覆盖率与资本充足率，有利于做联动看板。citeturn2search1  
- 该图的价值在于“路径”而非“点”：同样的 NPL 水平在不同 LCR 环境下意味着不同的处置弹性与市场信心。

**可操作建议**  
- 为本行建立同样的 NPL–LCR 轨迹，并叠加点大小=同业负债占比或批发融资占比，提高对资金面的敏感度。  
- 将轨迹拐点纳入应急融资预案（CFP）触发条件，形成“看到风险就能行动”的机制化闭环。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=lcr_pct`，`y=npl_ratio_pct`；`label=quarter`；用 line 连接并按季度排序。  
- tooltip：显示季度、NPL、LCR，同时提示“资本新规口径切换点”。citeturn1search2turn16search0  

**是否虚构与数据来源**：数据来自监管披露及权威转载。citeturn8view0turn11view0turn1search0turn2search1  

### 散点图

**场景名称**：小微企业现金流覆盖率（DSCR）与 PD 的非线性拐点识别  
**节点ID**：root/q-2num/q-2num-notordered/q-notordered-few/chart-scatter；leaf id=chart-scatter  
**场景描述**：普惠小微贷款扩张带来更高的异质性与更强的周期敏感性，需要用现金流指标替代“抵押物崇拜”。散点图用于识别 DSCR 与 PD 的非线性关系（如 DSCR 低于一点一后 PD 陡升），为准入阈值、额度与贷后预警提供定量证据。监管披露显示普惠小微贷款余额持续增长（例如二〇二五年四季度末三十七万亿元），更需要前瞻性指标体系。citeturn2search1turn1search0  

**明细数据（示例；虚构）**

| firm_id | dscr | pd_12m | sector |
|---|---:|---:|---|
| SME01 | 1.52 | 0.012 | 制造 |
| SME02 | 1.18 | 0.030 | 餐饮 |
| SME03 | 1.05 | 0.068 | 建工 |
| SME04 | 0.92 | 0.125 | 商贸 |
| SME05 | 0.85 | 0.159 | 建工 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"firm_id":"SME01","dscr":1.52,"pd_12m":0.012,"sector":"制造"},
  {"firm_id":"SME02","dscr":1.18,"pd_12m":0.030,"sector":"餐饮"},
  {"firm_id":"SME03","dscr":1.05,"pd_12m":0.068,"sector":"建工"},
  {"firm_id":"SME04","dscr":0.92,"pd_12m":0.125,"sector":"商贸"},
  {"firm_id":"SME05","dscr":0.85,"pd_12m":0.159,"sector":"建工"},
  {"firm_id":"SME06","dscr":1.32,"pd_12m":0.018,"sector":"批发零售"}
]
```

**基于数据的观点表达**  
- DSCR 从一点一八降至一点零五再到零点九二，PD 呈加速上升，存在明确现金流拐点，应将 DSCR 作为准入硬指标而非软参考。  
- 高波动行业（餐饮、商贸）在 DSCR 接近一时风险陡升，需引入更高安全边际或加入经营波动率修正项。  
- 若扩量阶段仍主要依赖抵押物而忽视 DSCR，组合风险相关性会增大，尾部损失更难对冲。

**可操作建议**  
- 设定 DSCR 准入硬门槛（例如 DSCR≥一點二），低于阈值必须追加现金归集/回款锁定/担保增信。  
- 在贷后用流水与税票滚动更新 DSCR（滚动三/六/十二个月），对下穿阈值客户自动降额并触发预警。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=dscr`，`y=pd_12m`，`color=sector`。  
- 交互：brush 选择低 DSCR 区域联动客户清单；tooltip 展示企业画像字段。citeturn16search0  
- scale：x 轴建议限定到 0.6–2.0，突出拐点区间。

**是否虚构与数据来源**：虚构数据（用于展示散点图的关联性与拐点识别优势）。

### 阈值热力图

**场景名称**：信用卡利用率与逾期的风险密度矩阵（阈值分层策略引擎）  
**节点ID**：root/q-2num/q-2num-notordered/q-notordered-many/chart-heatmap-many；leaf id=chart-heatmap-many  
**场景描述**：零售业务在数字化扩量时，风险往往先堆积在“高利用率 + 轻逾期”区间。阈值热力图将利用率分箱（x）与逾期分箱（y）组成矩阵，用颜色表达账户数或余额密度，用于额度策略、止付策略、催收优先级分配。数字金融高质量发展导向意味着对这类高频行为数据要更“可视化、可解释、可治理”。citeturn15search0turn16search1  

**明细数据（示例；虚构，单位：账户数）**

| util_bucket | dpd_bucket | accounts |
|---|---|---:|
| 0-30 | 0 | 120000 |
| 0-30 | 1-30 | 6500 |
| 80-100 | 1-30 | 15500 |
| 80-100 | 31-60 | 6100 |
| over-100 | >90 | 2600 |

**示例数据片段（CSV；虚构数据）**
```csv
util_bucket,dpd_bucket,accounts
0-30,0,120000
0-30,1-30,6500
30-60,0,160000
30-60,1-30,12800
60-80,1-30,13600
60-80,31-60,4200
80-100,1-30,15500
80-100,31-60,6100
over-100,61-90,2200
over-100,>90,2600
```

**基于数据的观点表达**  
- 风险密度集中在“八十到一百利用率 + 一到三十天逾期”，这是从可控阶段转向滚动逾期的关键窗口，应优先干预。  
- “超限 + 六十天以上”虽账户数较少，但通常单户余额更高、资金链更紧，损失率弹性更大，应在策略引擎中单列红区。  
- 热力矩阵可作为“策略可解释证据”：策略阈值来自风险密度结构，而不是拍脑袋。

**可操作建议**  
- 建立二维策略矩阵：利用率≥八十且 DPD≥一触发降额/冻结；超限且 DPD≥三十触发强制止付与强化催收。  
- 把红区格子样本作为模型训练池，更新行为评分与催收优先级。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=util_bucket`，`y=dpd_bucket`，`color=accounts`。citeturn16search1  
- scale：color 可用分位数或对数色阶；对极端格子设置上限裁剪，避免色阶失真。  
- tooltip：显示账户数、占比、对应策略动作；支持点击格子 drill-down。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示阈值热力图在策略矩阵表达中的优势）。

### 堆叠面积图（大数据）

**场景名称**：监管导向下重点领域信贷投向结构的季度堆叠趋势  
**节点ID**：root/q-2num/q-2num-notordered/q-notordered-many/chart-stacked-area-many；leaf id=chart-stacked-area-many  
**场景描述**：高管层需要同时看到“规模增长”和“结构变化”：例如普惠小微贷款余额在监管披露中持续增长（如二〇二五年四季度末三十七万亿元），同时数字金融、科技金融、绿色金融等方向要求更细结构披露。堆叠面积图用于展示多类别余额随时间变化，并强调总量与结构贡献。citeturn2search1turn1search0turn15search1turn21search1  

**明细数据（混合：普惠小微为官方披露，其余为虚构补齐；单位：万亿元）**

| quarter | category | balance_trn_cny | source |
|---|---|---:|---|
| 2024Q4 | 普惠小微 | 33.3 | NFRA 转载 |
| 2025Q3 | 普惠小微 | 36.5 | NFRA |
| 2025Q4 | 普惠小微 | 37.0 | NFRA |
| 2024Q4 | 绿色项目 | 18.0 | 虚构 |
| 2025Q3 | 绿色项目 | 20.2 | 虚构 |
| 2025Q4 | 绿色项目 | 21.5 | 虚构 |

**示例数据片段（JSON；含来源标注）**
```json
[
  {"quarter":"2024Q4","category":"普惠小微","balance_trn_cny":33.3,"source":"NFRA(转载)"},
  {"quarter":"2025Q3","category":"普惠小微","balance_trn_cny":36.5,"source":"NFRA"},
  {"quarter":"2025Q4","category":"普惠小微","balance_trn_cny":37.0,"source":"NFRA"},
  {"quarter":"2024Q4","category":"绿色项目","balance_trn_cny":18.0,"source":"虚构"},
  {"quarter":"2025Q3","category":"绿色项目","balance_trn_cny":20.2,"source":"虚构"},
  {"quarter":"2025Q4","category":"绿色项目","balance_trn_cny":21.5,"source":"虚构"},
  {"quarter":"2024Q4","category":"科技创新","balance_trn_cny":12.0,"source":"虚构"},
  {"quarter":"2025Q3","category":"科技创新","balance_trn_cny":13.8,"source":"虚构"},
  {"quarter":"2025Q4","category":"科技创新","balance_trn_cny":14.6,"source":"虚构"}
]
```

**基于数据的观点表达**  
- 普惠小微余额增长为官方披露事实，但“结构性扩张”往往伴随风险异质性上升，必须把迁徙率与定价溢价绑在同一驾驶舱。citeturn2search1turn1search0  
- 若绿色/科技信贷增长更多来自“贴标签”而非可核验指标（排放强度、转型计划），会形成重大声誉与合规风险；监管实施方案要求防范 ESG 风险并提升自身 ESG 表现。citeturn1search3turn15search3  
- 堆叠面积图能让管理层看到“增长来自哪里”，避免只看总量造成资源错配。

**可操作建议**  
- 对每一类别绑定“风险阈值”（如预期损失率上限、集中度上限、RAROC 下限），实现“结构增长不放松风险纪律”。  
- 建立绿色/科技贷款的数据治理清单：关键字段、口径、采集频率、审计证据链，满足实施方案对可验证的要求。citeturn1search3  

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=quarter`，`y=balance_trn_cny`，`color=category`。  
- 转换：`stackY` 实现堆叠；如强调占比可加 `normalizeY`。citeturn21search0turn21search1  
- tooltip：显示该季度各类别余额与占比；legend 支持筛选。citeturn16search0  

**是否虚构与数据来源**：普惠小微余额来自监管披露；其余类别为虚构补齐，已在字段 `source` 标注。citeturn2search1turn1search0  

### 密度热力图

**场景名称**：按揭贷款 LTV 与房价变动的二维风险密度聚集识别  
**节点ID**：root/q-2num/q-2num-notordered/q-notordered-many/chart-density-heatmap；leaf id=chart-density-heatmap  
**场景描述**：房地产领域强调项目分层、名单化与资金封闭管理；在零售端，抵押缓冲由 LTV 与房价变动共同决定。二维密度热力图用于识别“高 LTV + 房价下跌”区域的风险聚集，为贷后分层、提前沟通、重组工具投放提供依据。城市融资协调机制强调对项目授信审慎与资金封闭，反映监管对房地产金融风险的系统性治理方向。citeturn0search3turn16search1  

**明细数据（示例；虚构点数据）**

| mortgage_id | ltv_pct | price_chg_pct | city_tier |
|---|---:|---:|---|
| M001 | 88 | -18 | 二线 |
| M002 | 72 | -10 | 三线 |
| M003 | 90 | -22 | 二线 |
| M004 | 55 | -3 | 一线 |
| M005 | 83 | -15 | 三线 |

**示例数据片段（JSON；虚构，不超过五十行）**
```json
[
  {"mortgage_id":"M001","ltv_pct":88,"price_chg_pct":-18,"city_tier":"二线"},
  {"mortgage_id":"M002","ltv_pct":72,"price_chg_pct":-10,"city_tier":"三线"},
  {"mortgage_id":"M003","ltv_pct":90,"price_chg_pct":-22,"city_tier":"二线"},
  {"mortgage_id":"M004","ltv_pct":55,"price_chg_pct":-3,"city_tier":"一线"},
  {"mortgage_id":"M005","ltv_pct":83,"price_chg_pct":-15,"city_tier":"三线"},
  {"mortgage_id":"M006","ltv_pct":68,"price_chg_pct":-8,"city_tier":"二线"},
  {"mortgage_id":"M007","ltv_pct":92,"price_chg_pct":-12,"city_tier":"三线"}
]
```

**基于数据的观点表达**  
- 高 LTV（八十八至九十二）且房价下跌（-十五到-二十二）的点形成潜在热点区，抵押缓冲变薄，一旦收入冲击将更易触发违约。  
- 同样房价下跌下，LTV 较低点（五十五）风险显著不同，说明“抵押缓冲”对风险的非线性影响必须可视化。  
- 将该热力热点与地区就业、产业链冲击指标关联，可形成“房地产相关零售风险”早预警子系统。

**可操作建议**  
- 对热点区客户推送“提前沟通 + 柔性重组工具”，目标是在形成三十天以上逾期前介入。  
- 在估值系统中引入区域价格因子动态更新 LTV，并把更新记录作为审计追溯材料。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=ltv_pct`，`y=price_chg_pct`，`color=density`（通过二维聚合或密度估计得到）。citeturn16search1  
- tooltip：显示热点区间内账户数、余额、逾期率；支持按 city_tier 分面或筛选。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示二维密度热力图的热点识别优势）。

### 气泡图

**场景名称**：行业组合“风险—收益—规模”三维权衡（PD、RAROC、EAD）  
**节点ID**：root/q-3num/chart-bubble；leaf id=chart-bubble  
**场景描述**：在资本约束与盈利承压环境下，行业组合管理需要同时看三件事：风险（PD/LGD）、收益（RAROC/利差）、规模（EAD/RWA）。气泡图以 x=PD、y=RAROC、size=EAD 直观识别“高风险低收益的大暴露”行业，特别适用于房地产链条压降与结构转型。资本监管新规强调资本抵御风险能力，强化了“规模×风险”的管理必要性。citeturn1search2turn0search3  

**明细数据（示例；虚构）**

| sector | pd_pct | raroc_pct | ead_bn_cny |
|---|---:|---:|---:|
| 房地产上下游 | 3.8 | 6.2 | 2400 |
| 建工基建 | 3.2 | 7.0 | 1900 |
| 制造中游 | 2.1 | 8.5 | 2200 |
| 绿色能源 | 1.9 | 8.9 | 1050 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"sector":"房地产上下游","pd_pct":3.8,"raroc_pct":6.2,"ead_bn_cny":2400},
  {"sector":"建工基建","pd_pct":3.2,"raroc_pct":7.0,"ead_bn_cny":1900},
  {"sector":"制造中游","pd_pct":2.1,"raroc_pct":8.5,"ead_bn_cny":2200},
  {"sector":"绿色能源","pd_pct":1.9,"raroc_pct":8.9,"ead_bn_cny":1050},
  {"sector":"科技服务","pd_pct":2.6,"raroc_pct":9.8,"ead_bn_cny":800}
]
```

**基于数据的观点表达**  
- 房地产上下游呈现“大规模 + 高风险 + 中低 RAROC”的结构，属于资本占用与尾部风险同时偏高组合，应优先做结构压降与项目化精选。citeturn0search3  
- 制造中游规模大但 PD 较低、RAROC 较高，可作为组合稳定器；但必须通过分层限额与集中度管理避免产业链共振。  
- 绿色/科技若 RAROC 优于资本成本且规模可控，适合在“五篇大文章”框架下做结构转型，但需要可验证的绿色属性与风险缓释。citeturn15search1turn1search3  

**可操作建议**  
- 设定“禁区象限”：PD 高于阈值且 RAROC 低于资本成本的行业，新增授信必须专项审批并给出退出计划。  
- 将气泡图纳入年度资产组合规划（ACP）与资本预算联动，形成“资源投放—资本约束—风险偏好”一致性。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=pd_pct`，`y=raroc_pct`，`size=ead_bn_cny`，`color=sector`。  
- scale：size 建议对数尺度，避免大行业气泡遮挡；tooltip 展示 PD/LGD/EAD/RWA 衍生指标。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示气泡图的三维权衡优势）。

### 三维散点图

**场景名称**：大额客户三维风险画像（PD、LGD、EAD）与资本占用穿透  
**节点ID**：root/q-3num/chart-scatter3d；leaf id=chart-scatter3d  
**场景描述**：大额对公客户往往出现“PD 不高但 LGD 极高”或“规模巨大导致资本占用高”的情况。三维散点图用于把 PD、LGD、EAD 放在同一视域，辅助授信委员会进行“规模×风险×处置难度”的统一判断。资本新规强调资本抵御风险并要求系统重要性银行满足附加要求，促使对三维风险暴露的可视化穿透成为必备能力。citeturn1search2turn13search3  

**明细数据（示例；虚构）**

| client | pd_pct | lgd_pct | ead_bn_cny | group |
|---|---:|---:|---:|---|
| C01 | 1.8 | 65 | 120 | 制造 |
| C02 | 3.5 | 45 | 80 | 建工 |
| C03 | 2.6 | 72 | 60 | 房地产链 |
| C04 | 1.2 | 30 | 150 | 公用事业 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"client":"C01","pd_pct":1.8,"lgd_pct":65,"ead_bn_cny":120,"group":"制造"},
  {"client":"C02","pd_pct":3.5,"lgd_pct":45,"ead_bn_cny":80,"group":"建工"},
  {"client":"C03","pd_pct":2.6,"lgd_pct":72,"ead_bn_cny":60,"group":"房地产链"},
  {"client":"C04","pd_pct":1.2,"lgd_pct":30,"ead_bn_cny":150,"group":"公用事业"},
  {"client":"C05","pd_pct":4.1,"lgd_pct":60,"ead_bn_cny":40,"group":"商贸"}
]
```

**基于数据的观点表达**  
- C01/C03 的 PD 并非最高，但 LGD 高，属于“一旦违约损失巨大”的隐蔽风险，应优先强化抵押物可处置性与现金流封闭。  
- C04 规模最大但 PD/LGD 低，适合做组合稳定器，但仍需集中度与期限错配约束。  
- 将三维散点与 Basel III 偏好（提高资本敏感度、覆盖更多大行）对齐，有助于跨境经营银行在多法域资本规则下保持一致视图。citeturn13search3turn15search2  

**可操作建议**  
- 对“高 LGD + 高 EAD”客户设定强制缓释动作（追加抵押、现金归集、担保结构重构），并纳入贷后重点名单。  
- 把三维点云与集团关联/担保圈穿透，提高对风险传染的可解释性。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=pd_pct`，`y=lgd_pct`，`z=ead_bn_cny`，`color=group`。  
- 工程建议：若前端 3D 能力受限，可用二维散点（PD-LGD）+ 气泡大小（EAD）替代，并保留三维数据结构。  

**是否虚构与数据来源**：虚构数据（用于展示三维散点图的穿透式对比优势）。

### 多线折线图

**场景名称**：资本—拨备—流动性三底盘联动（用于风险偏好与资本规划）  
**节点ID**：root/q-sevnum/q-sevnum-ordered/chart-line-sev；leaf id=chart-line-sev  
**场景描述**：资本充足率、拨备覆盖率与 LCR 是监管“三底盘”。多线折线图用于展示三者随季度变化的协同关系，尤其在资本新规口径切换后，需要在图上明确标注“口径变更”以避免可比性误读。监管披露显示：二〇二五年四季度资本充足率约十五点四六、拨备覆盖率约二百零五点二一、LCR 约一百五十七点九九；并提示自二〇二四年起资本指标按新办法计算，与历史数据不直接可比。citeturn2search1turn1search2  

**明细数据（官方披露汇总，单位：%）**

| quarter | car_pct | pcr_pct | lcr_pct | source |
|---|---:|---:|---:|---|
| 2023Q4 | 15.06 | 205.14 | 151.60 | 监管披露转载 |
| 2024Q4 | 15.74 | 211.19 | 154.73 | 转载（来源注明金融监管总局） |
| 2025Q3 | 15.36 | 207.15 | 149.73 | 金融监管总局 |
| 2025Q4 | 15.46 | 205.21 | 157.99 | 金融监管总局 |

**示例数据片段（JSON；来源如上）**
```json
[
  {"quarter":"2023Q4","metric":"car_pct","value":15.06},
  {"quarter":"2023Q4","metric":"pcr_pct","value":205.14},
  {"quarter":"2023Q4","metric":"lcr_pct","value":151.60},
  {"quarter":"2024Q4","metric":"car_pct","value":15.74},
  {"quarter":"2024Q4","metric":"pcr_pct","value":211.19},
  {"quarter":"2024Q4","metric":"lcr_pct","value":154.73},
  {"quarter":"2025Q3","metric":"car_pct","value":15.36},
  {"quarter":"2025Q3","metric":"pcr_pct","value":207.15},
  {"quarter":"2025Q3","metric":"lcr_pct","value":149.73},
  {"quarter":"2025Q4","metric":"car_pct","value":15.46},
  {"quarter":"2025Q4","metric":"pcr_pct","value":205.21},
  {"quarter":"2025Q4","metric":"lcr_pct","value":157.99}
]
```

**基于数据的观点表达**  
- 二〇二五年三季度三底盘阶段性走弱（资本、拨备、LCR 下行）是典型压力窗口，应触发更高频的组合复盘与资本占用审视。citeturn1search0  
- 二〇二五年四季度 LCR 回升但拨备覆盖率回落，提示“流动性修复”不等于“风险抵补能力增强”，盈利承压阶段更需关注拨备补提可持续性。citeturn2search1turn14search0  
- 资本指标口径切换是重大治理点：应在图表上与元数据层统一标注口径版本，避免高管误判趋势。citeturn2search1turn1search2  

**可操作建议**  
- 建立“联动阈值”：任意两条底盘触线即进入 RWA 压降与高风险投放收缩策略。  
- 将资本/拨备/流动性联动到定价：RAROC 低于资本成本的业务不得以规模冲刺。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=quarter`，`y=value`，`color=metric`（三条线）。  
- tooltip：shared；显示三指标并附“资本新规自二〇二四起口径变化”注释。citeturn16search0turn1search2  

**是否虚构与数据来源**：来自监管披露及权威转载。citeturn8view0turn11view0turn1search0turn2search1  

### 堆叠面积图

**场景名称**：预期信用损失分阶段暴露结构（Stage 一/二/三）与拨备压力前瞻  
**节点ID**：root/q-sevnum/q-sevnum-ordered/chart-stacked-area；leaf id=chart-stacked-area  
**场景描述**：结果指标（NPL）往往滞后，阶段迁徙（尤其 Stage 二扩张）更能前瞻反映拨备压力。堆叠面积图展示 Stage 暴露（EAD）结构随时间变化，并与息差承压背景下的利润弹性联动，帮助解释“为什么需要提前干预”。citeturn14search0turn21search1  

**明细数据（示例；虚构，单位：亿元）**

| quarter | stage | ead_bn_cny |
|---|---|---:|
| 2025Q1 | Stage1 | 17600 |
| 2025Q1 | Stage2 | 2700 |
| 2025Q1 | Stage3 | 450 |
| 2025Q2 | Stage1 | 17350 |
| 2025Q2 | Stage2 | 2980 |
| 2025Q2 | Stage3 | 470 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"quarter":"2025Q1","stage":"Stage1","ead_bn_cny":17600},
  {"quarter":"2025Q1","stage":"Stage2","ead_bn_cny":2700},
  {"quarter":"2025Q1","stage":"Stage3","ead_bn_cny":450},
  {"quarter":"2025Q2","stage":"Stage1","ead_bn_cny":17350},
  {"quarter":"2025Q2","stage":"Stage2","ead_bn_cny":2980},
  {"quarter":"2025Q2","stage":"Stage3","ead_bn_cny":470},
  {"quarter":"2025Q3","stage":"Stage1","ead_bn_cny":17100},
  {"quarter":"2025Q3","stage":"Stage2","ead_bn_cny":3250},
  {"quarter":"2025Q3","stage":"Stage3","ead_bn_cny":490}
]
```

**基于数据的观点表达**  
- Stage 二扩张快于 Stage 三（由二千七百到三千二百五十），意味着风险在“显著上升但未违约”区间堆积，未来几个季度拨备压力可能上行。  
- 若 Stage 二扩张集中在涉房或小微，应与房地产融资协调机制与普惠风险缓释工具联动，从源头降低迁徙。citeturn0search3turn2search1  
- 在利率下行、利润承压时期，Stage 二扩张会更快侵蚀利润与资本缓冲，需提前做组合调整。citeturn14search0  

**可操作建议**  
- 将 SICR 触发规则参数化管理（DPD、PD 倍数、名单行业），并建立“过度触发/触发滞后”双向回测。  
- 对 Stage 二客户实施“提前重组/缓释”策略，目标是把迁徙挡在 Stage 三前。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=quarter`，`y=ead_bn_cny`，`color=stage`。  
- 转换：`stackY`；若强调占比可 `normalizeY`。citeturn21search0turn21search1  
- 交互：legend-filter 按阶段筛选；tooltip 展示阶段占比与增量。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示堆叠面积图的“结构先于结果”优势）。

### 河流图

**场景名称**：负债端资金来源结构迁移与息差敏感性（活期流失的可视化证据）  
**节点ID**：root/q-sevnum/q-sevnum-ordered/chart-stream；leaf id=chart-stream  
**场景描述**：在利率下行周期，负债成本传导往往滞后，活期存款占比下降、定期占比上升会显著抬升平均付息率，形成息差压力。河流图通过对称或流动形态展示结构迁移，适合向董事会解释“为什么息差压力来自负债结构而不仅是资产端”。citeturn14search0turn21search1  

**明细数据（示例；虚构，占比%）**

| quarter | source | share_pct |
|---|---|---:|
| 2024Q4 | 活期存款 | 35 |
| 2024Q4 | 定期存款 | 49 |
| 2024Q4 | 同业负债 | 10 |
| 2025Q3 | 活期存款 | 29 |
| 2025Q3 | 定期存款 | 55 |
| 2025Q3 | 同业负债 | 12 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"quarter":"2024Q4","source":"活期存款","share_pct":35},
  {"quarter":"2024Q4","source":"定期存款","share_pct":49},
  {"quarter":"2024Q4","source":"同业负债","share_pct":10},
  {"quarter":"2024Q4","source":"债券融资","share_pct":6},
  {"quarter":"2025Q1","source":"活期存款","share_pct":33},
  {"quarter":"2025Q1","source":"定期存款","share_pct":51},
  {"quarter":"2025Q1","source":"同业负债","share_pct":11},
  {"quarter":"2025Q1","source":"债券融资","share_pct":5},
  {"quarter":"2025Q3","source":"活期存款","share_pct":29},
  {"quarter":"2025Q3","source":"定期存款","share_pct":55},
  {"quarter":"2025Q3","source":"同业负债","share_pct":12},
  {"quarter":"2025Q3","source":"债券融资","share_pct":4}
]
```

**基于数据的观点表达**  
- 活期占比下滑、定期占比上升是“息差压力的慢变量”，对利润侵蚀往往长期持续且难以快速逆转。  
- 同业负债占比上升会提高流动性敏感度，需要与 LCR 目标联动；监管披露显示行业 LCR 在二〇二五年四季度上行，但单体银行仍可能波动。citeturn2search1  
- 河流图适合解释“结构迁移速度”，比静态饼图更能服务管理决策。

**可操作建议**  
- 将“活期占比/核心存款占比”纳入分支机构经营考核，并用交易场景（结算、薪资代发）提升沉淀。  
- 用 FTP 将负债结构成本真实传导到资产业务，约束“资产冲规模、负债被动买高成本资金”。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=quarter`，`y=share_pct`，`color=source`。  
- 转换：`stackY` + 对称/偏移（streamgraph 常用对称效果）；堆叠顺序建议固定，避免误读。citeturn21search0turn21search1  
- tooltip：显示占比与对付息率的敏感度提醒。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示河流图在负债结构迁移中的表达优势）。

### 山脊图

**场景名称**：月度逾期分布漂移（整体右移）与风险慢变量预警  
**节点ID**：root/q-sevnum/q-sevnum-notordered/chart-correlogram；leaf id=chart-correlogram  
**场景描述**：当风险在组合中“慢慢累积”时，平均逾期可能不变，但分布会整体右移。山脊图（多组密度叠加）可紧凑展示不同月份的逾期分布，适合线上零售扩量阶段的漂移监控，与数字金融“以数据驱动治理”的要求一致。citeturn15search0turn23search0  

**明细数据（示例；虚构：按月×分箱的占比）**

| month | dpd_bucket | pct |
|---|---|---:|
| 2025-10 | 0 | 86.9 |
| 2025-10 | 1-30 | 9.2 |
| 2025-10 | 31-60 | 2.6 |
| 2025-12 | 0 | 85.4 |
| 2025-12 | 1-30 | 10.1 |
| 2025-12 | 31-60 | 3.0 |

**示例数据片段（CSV；虚构数据）**
```csv
month,dpd_bucket,pct
2025-10,0,86.9
2025-10,1-30,9.2
2025-10,31-60,2.6
2025-10,>60,1.3
2025-11,0,86.0
2025-11,1-30,9.8
2025-11,31-60,2.8
2025-11,>60,1.4
2025-12,0,85.4
2025-12,1-30,10.1
2025-12,31-60,3.0
2025-12,>60,1.5
```

**基于数据的观点表达**  
- 零逾期占比下降、轻逾期上升反映分布右移，是“风险堆积”的早期迹象，比 NPL 更前瞻。  
- 若右移来自特定放款批次/渠道，应优先定位源头（投放策略/反欺诈/准入阈值）。  
- 在利润承压时期，分布右移若不及时处理，会在后续季度集中暴露并放大拨备压力。citeturn14search0  

**可操作建议**  
- 将“轻逾期占比连续两月上升”设为 EWS 触发条件，自动启动策略复核与渠道质量审查。  
- 对右移最显著月份做 cohort 分析（按放款批次/渠道/地区），形成可追责的治理闭环。

**可视化要点（含 AntV G2 配置）**  
- 数据输入可为“原始 dpd 样本 + month”，用 `kde` 按 month 分组生成密度曲线；也可直接用分箱占比做多条面积叠加。citeturn23search0  
- tooltip：显示每月关键分位点（P50/P90）与右移幅度；交互支持按月筛选。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示山脊图对分布漂移的识别优势）。

### 热力图

**场景名称**：压力测试情景矩阵下的预期损失率（EL/ECL）对比  
**节点ID**：root/q-sevnum/q-sevnum-notordered/chart-heatmap；leaf id=chart-heatmap  
**场景描述**：压力测试需要把“情景—组合—损失”在一个屏幕上讲清楚。热力图用颜色表达各组合在不同情景下的损失率或 ECL 增量，适合向管理层解释“哪些组合在严重情景下成为红区”，并直接映射到资本规划。人民银行报告强调防范化解重点领域风险，也为压力测试框架提供方向。citeturn14search0turn14search1turn16search1  

**明细数据（示例；虚构，单位：bp）**

| portfolio | scenario | loss_bp |
|---|---|---:|
| 按揭 | 基准 | 18 |
| 按揭 | 不利 | 35 |
| 房地产开发贷 | 严重 | 260 |
| 普惠小微 | 严重 | 140 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"portfolio":"按揭","scenario":"基准","loss_bp":18},
  {"portfolio":"按揭","scenario":"不利","loss_bp":35},
  {"portfolio":"按揭","scenario":"严重","loss_bp":60},
  {"portfolio":"普惠小微","scenario":"基准","loss_bp":45},
  {"portfolio":"普惠小微","scenario":"不利","loss_bp":85},
  {"portfolio":"普惠小微","scenario":"严重","loss_bp":140},
  {"portfolio":"房地产开发贷","scenario":"基准","loss_bp":70},
  {"portfolio":"房地产开发贷","scenario":"不利","loss_bp":150},
  {"portfolio":"房地产开发贷","scenario":"严重","loss_bp":260}
]
```

**基于数据的观点表达**  
- 房地产开发贷在严重情景下损失率显著抬升，支持“项目化、名单化、资金封闭”的审慎逻辑。citeturn0search3  
- 普惠小微对不利/严重情景敏感度高，说明扩量必须同步升级贷后监测与风险缓释配置。citeturn2search1turn1search0  
- 热力图能把“压力测试结果”从报告变成驾驶舱组件，直接服务资本与限额决策。

**可操作建议**  
- 把热力图红区映射到资本规划：设置 RWA/限额上限与资本缓冲。  
- 建立“情景触发器”（房价、土地成交、财政收入、行业景气等）以动态更新热力矩阵。

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=scenario`，`y=portfolio`，`color=loss_bp`。citeturn16search1  
- 色阶：建议使用分位数或阈值色阶（绿/黄/红），并在 tooltip 中给出阈值解释。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示压力测试矩阵表达优势）。

### 降维散点图

**场景名称**：ESG 与转型风险多指标压缩后的客户簇识别（用于授信差异化）  
**节点ID**：root/q-sevnum/q-sevnum-notordered/chart-pca；leaf id=chart-pca  
**场景描述**：绿色金融实施方案要求加大绿色低碳支持并防范 ESG 风险，同时提升相关能力；国际上 ISSB 发布 IFRS S1/S2 推动可持续披露趋于可比、可验证。降维散点图（PCA 结果）把多维 ESG/排放/财务指标压缩到二维坐标，直观呈现“高转型风险簇”与“低碳优质簇”，用于授信准入、期限、定价与转型金融设计。citeturn1search3turn15search3  

**明细数据（示例；虚构）**

| client | pc1 | pc2 | esg_score | carbon_intensity |
|---|---:|---:|---:|---:|
| E01（高碳） | 2.10 | 0.35 | 52 | 890 |
| E02（高碳） | 2.45 | -0.20 | 48 | 1120 |
| E03（低碳） | -1.60 | 0.40 | 78 | 120 |
| E04（低碳） | -0.90 | -0.10 | 81 | 95 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"client":"E01","pc1":2.10,"pc2":0.35,"esg_score":52,"carbon_intensity":890},
  {"client":"E02","pc1":2.45,"pc2":-0.20,"esg_score":48,"carbon_intensity":1120},
  {"client":"E03","pc1":-1.60,"pc2":0.40,"esg_score":78,"carbon_intensity":120},
  {"client":"E04","pc1":-0.90,"pc2":-0.10,"esg_score":81,"carbon_intensity":95},
  {"client":"E05","pc1":0.55,"pc2":1.10,"esg_score":63,"carbon_intensity":260}
]
```

**基于数据的观点表达**  
- PC1 显著为正的客户同时碳强度高、ESG 分低，形成高转型风险簇，应提高风险溢价并要求转型计划与资金用途约束。citeturn1search3  
- 低 PC1 的客户可作为绿色资产池扩展方向，但必须防范“漂绿”，确保数据可核验、披露可审计，符合 IFRS S1/S2 的可比与一致披露精神。citeturn15search3  
- 降维图是“决策辅助”不是“尽调替代”：高管看板要同时提供簇内客户的关键指标贡献与证据链链接。

**可操作建议**  
- 对高转型风险簇设置“转型计划必填 + 里程碑考核”，未达标触发利率上浮或限额压降。  
- 建立 ESG 数据治理：口径、来源、频率、留痕，满足实施方案对风险管理与披露能力的要求。citeturn1search3  

**可视化要点（含 AntV G2 配置）**  
- 字段映射：`x=pc1`，`y=pc2`，`color=esg_score` 或 `color=行业`，`size=carbon_intensity`。  
- tooltip：展示 ESG 关键字段（碳强度、处罚事件、转型计划状态）。citeturn16search0  

**是否虚构与数据来源**：虚构数据（用于展示降维散点在 ESG 分群中的工程表达）。

### 树状图

**场景名称**：互保圈/担保网络的层次聚类与风险传染隔离  
**节点ID**：root/q-sevnum/q-sevnum-notordered/chart-dendrogram；leaf id=chart-dendrogram  
**场景描述**：中小企业常见交叉担保、同一实控人、多头融资等隐性关联。树状图用于展示基于担保关系/资金往来相似度构造的距离矩阵聚类结果，识别互保圈层级结构，并将“簇”作为集中度与授信限额管理单元。普惠业务扩量下，缺乏关联穿透会把多个看似分散客户变成同一风险点。citeturn2search1turn1search0  

**明细数据（示例；虚构：节点与边）**

| node_id | name | ead_bn_cny |
|---|---|---:|
| N1 | 企业A | 3.2 |
| N2 | 企业B | 2.8 |
| N3 | 企业C | 1.6 |
| N4 | 企业D | 2.1 |

**示例数据片段（JSON；虚构，不超过五十行）**
```json
{
  "nodes":[
    {"id":"N1","name":"企业A","ead_bn_cny":3.2},
    {"id":"N2","name":"企业B","ead_bn_cny":2.8},
    {"id":"N3","name":"企业C","ead_bn_cny":1.6},
    {"id":"N4","name":"企业D","ead_bn_cny":2.1}
  ],
  "links":[
    {"source":"N1","target":"N2","distance":0.18},
    {"source":"N2","target":"N3","distance":0.21},
    {"source":"N3","target":"N4","distance":0.65}
  ]
}
```

**基于数据的观点表达**  
- N1–N2–N3 距离较小，形成互保簇；N4 与簇距离较大，说明风险传染主要在簇内扩散，应分别设簇限额。  
- 若簇内任一企业出险，担保履约会把风险传递给同簇企业，单户授信视角会系统性低估相关性。  
- 树状图适合把“关联穿透”可视化，提升授信委员会对担保圈风险的直觉与可解释性。

**可操作建议**  
- 在授信系统中落地“簇级限额”：新增授信需校验簇总敞口与簇内最弱环企业指标。  
- 对高关联簇推动担保结构拆解与替换，降低担保链自循环。

**可视化要点（含 AntV G2 配置）**  
- 数据结构：通常需要 `nodes` 与 `links`；距离阈值处画切割线定义互保圈。  
- 交互：点击簇展示成员列表、总 EAD、逾期/违约事件。  

**是否虚构与数据来源**：虚构数据（用于展示树状图在担保圈聚类中的表达优势）。

### 平行坐标图

**场景名称**：客户级风险—收益—ESG 多维一致性审查（授信质检与审计抽样）  
**节点ID**：root/q-sevnum/q-sevnum-notordered/chart-parallel；leaf id=chart-parallel  
**场景描述**：在资本约束、绿色金融与数字化风控并行阶段，单一评分并不足以支撑授信决策。平行坐标图一屏对齐 PD、LGD、EAD、RAROC、担保覆盖、ESG 等维度，快速识别“高风险低收益”“高风险低 ESG”异常组合，用于授信质检与审计抽样。平行坐标可结合 brush 高亮交互进行按轴筛选。citeturn17search2turn1search3  

**明细数据（示例；虚构）**

| client | pd_pct | lgd_pct | ead_bn | raroc_pct | collateral_cov_pct | esg_score |
|---|---:|---:|---:|---:|---:|---:|
| P01 | 1.6 | 35 | 90 | 10.2 | 80 | 82 |
| P02 | 3.9 | 60 | 70 | 6.1 | 40 | 55 |
| P03 | 2.8 | 70 | 60 | 7.0 | 55 | 49 |

**示例数据片段（JSON；虚构数据）**
```json
[
  {"client":"P01","pd_pct":1.6,"lgd_pct":35,"ead_bn":90,"raroc_pct":10.2,"collateral_cov_pct":80,"esg_score":82},
  {"client":"P02","pd_pct":3.9,"lgd_pct":60,"ead_bn":70,"raroc_pct":6.1,"collateral_cov_pct":40,"esg_score":55},
  {"client":"P03","pd_pct":2.8,"lgd_pct":70,"ead_bn":60,"raroc_pct":7.0,"collateral_cov_pct":55,"esg_score":49},
  {"client":"P04","pd_pct":1.2,"lgd_pct":30,"ead_bn":120,"raroc_pct":8.8,"collateral_cov_pct":90,"esg_score":76}
]
```

**基于数据的观点表达**  
- P02/P03 体现“高 PD + 高 LGD + 低 RAROC + 担保不足”，属于风险收益严重失配，应优先整改或退出。  
- P01 相对稳健且 ESG 分高，适合纳入优选名单；ESG 风险管理要求强化环境、社会和治理风险防范，为此类多维对齐提供政策依据。citeturn1search3  
- 平行坐标强调“组合一致性”，适合把授信委员会讨论从个案拉回到规则与阈值。

**可操作建议**  
- 落地多维一致性规则：若 PD 超阈且 RAROC 低于资本成本，则必须追加缓释或拒绝。  
- ESG 事件纳入贷后条款：处罚/事故触发重新评级与定价重谈。

**可视化要点（含 AntV G2 配置）**  
- 坐标：parallel coordinate；按指标维度配置多轴，颜色可映射行业或评级。citeturn17search2  
- 交互：brushAxisHighlight（按轴刷选）、state active/inactive 强化对比；tooltip 建议关闭 series 聚合以免混淆。citeturn17search2turn16search0  

**是否虚构与数据来源**：虚构数据（用于展示平行坐标在多维一致性审查中的优势）。

---

> 说明：以上已完整覆盖 Numeric JSON 的全部叶子节点类型与数量要求；每章均给出可用于 AntV G2 的示例数据片段与配置要点。  
> 若你希望把这些章节进一步“产品化”，可将每章输出拆成：`scenario.yaml（指标口径+阈值） + data.sample.json（示例数据） + g2.spec.ts（组件配置）` 三件套，并接入数据血缘与审计留痕体系。