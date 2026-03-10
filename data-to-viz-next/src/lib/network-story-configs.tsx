import React from 'react';
import {
  ArcIcon,
  BipartiteNetworkIcon,
  ChordIcon,
  CommunityDisjointIcon,
  DagFlowIcon,
  DendrogramIcon,
  DirectedNetworkIcon,
  EdgeBundlingIcon,
  EgoCenterIcon,
  FishboneIcon,
  HeatmapIcon,
  NetworkIcon,
  RadialCompactTreeIcon,
} from '@/components/viz/icons';
import { AdjacencyMatrixG2 } from '@/components/viz/charts/AdjacencyMatrixG2';
import { ArcDiagramG2 } from '@/components/viz/charts/ArcDiagramG2';
import { BipartiteNetworkG6 } from '@/components/viz/charts/BipartiteNetworkG6';
import { ChordG2 } from '@/components/viz/charts/ChordG2';
import { CommunityNetworkG6 } from '@/components/viz/charts/CommunityNetworkG6';
import { DagFlowG6 } from '@/components/viz/charts/DagFlowG6';
import { DirectedNetworkG6 } from '@/components/viz/charts/DirectedNetworkG6';
import { EdgeBundlingNetworkG6 } from '@/components/viz/charts/EdgeBundlingNetworkG6';
import { EgoNetworkG6 } from '@/components/viz/charts/EgoNetworkG6';
import { FishboneG6 } from '@/components/viz/charts/FishboneG6';
import { ForceDirectedNetworkG6 } from '@/components/viz/charts/ForceDirectedNetworkG6';
import { IndentedTreeG6 } from '@/components/viz/charts/IndentedTreeG6';
import {
  NetworkAdjMatrixScenarioG2,
  NetworkArcFraudScenarioG2,
  NetworkBipartiteMortgageScenarioG6,
  NetworkChordCapitalScenarioG2,
  NetworkCommunityFraudScenarioG6,
  NetworkDagDecisionScenarioG6,
  NetworkDirectedFraudScenarioG6,
  NetworkEdgeBundlingSupplychainScenarioG6,
  NetworkEgoContagionScenarioG6,
  NetworkFishboneNplScenarioG6,
  NetworkForceAmlScenarioG6,
  NetworkRadialUboScenarioG6,
  NetworkTreeCreditScenarioG6,
  NetworkWeightedTradeScenarioG6,
} from '@/components/viz/charts/NetworkStoryScenarioCharts';
import { RadialCompactTreeG6 } from '@/components/viz/charts/RadialCompactTreeG6';
import { WeightedNetworkG6 } from '@/components/viz/charts/WeightedNetworkG6';

export type NetworkStoryConfig = {
  route: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  interactionLibrary: 'AntV G6' | 'AntV G2';
  interactionComponent: React.ComponentType;
  scenarioComponent: React.ComponentType;
  nodePath: string;
  reportNodeId: string;
  scenarioName: string;
  businessLine: string;
  scenarioDescription: string;
  dataNote?: string;
  whatIs: string[];
  whenToUse: string[];
  mistakes: Array<{ title: string; description: string }>;
  insights: string[];
};

export const NETWORK_STORY_CONFIGS: Record<string, NetworkStoryConfig> = {
  network_force: {
    route: '/graph/network_force',
    title: '力导向图',
    subtitle: '把账户、设备、商户和钱包拉成关系网络，适合做穿透式反洗钱与反电诈联防。',
    icon: NetworkIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: ForceDirectedNetworkG6,
    scenarioComponent: NetworkForceAmlScenarioG6,
    nodePath: 'root/q-net-basic/chart-net-force',
    reportNodeId: 'chart-net-force',
    scenarioName: '跨渠道账户-设备-商户关系穿透',
    businessLine: '合规/反洗钱（AML） + 零售风险（Fraud）',
    scenarioDescription:
      '围绕客户、账户、设备、商户与数币钱包构建事件级关系图，用于识别跑分、分层转移与可疑资金落点。',
    whatIs: [
      '力导向图通过“节点-连线”的形式表达一般网络关系，不要求严格层级，也不要求固定顺序。',
      '它适合在复杂关系网络里先找“谁和谁连接、谁是枢纽、哪些边最强”，是关系穿透分析的第一张底图。',
    ],
    whenToUse: [
      '需要把账户、设备、商户、钱包等多类主体放到一张图里审查。',
      '需要快速识别高连接度节点、可疑中转账户与核心出金口。',
      '需要给反洗钱、反欺诈和协查团队提供可解释的关系证据链。',
    ],
    mistakes: [
      { title: '把所有关系都画上去', description: '没有时间窗和关系分层时，图会迅速变成噪音。' },
      { title: '只看节点大小不看链路', description: '高风险往往来自路径结构，而不是单个节点分值。' },
    ],
    insights: [
      '建议以交易/登录/设备指纹事件作为边的最小颗粒度，形成 T+0 实时 + T+1 批量的双速风控。',
      '同一设备在短时间内绑定多账户并伴随小额入账大额转出，是典型跑分团伙信号。',
      '图谱字段应做最小化与用途限定，自动化处置必须保留原因码与审批留痕。',
    ],
  },
  network_directed: {
    route: '/graph/network_directed',
    title: '有向关系图',
    subtitle: '强调“从哪里来、到哪里去”的方向信息，适合涉诈资金链追踪与断链处置。',
    icon: DirectedNetworkIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: DirectedNetworkG6,
    scenarioComponent: NetworkDirectedFraudScenarioG6,
    nodePath: 'root/q-net-basic/chart-net-directed',
    reportNodeId: 'chart-net-directed',
    scenarioName: '涉诈资金链路追踪与断链处置编排',
    businessLine: '零售风险 + 合规（反电诈/反洗钱）',
    scenarioDescription:
      '把受害人账户、中转账户和出金落点按时间顺序串成有向链路，支撑止付、冻结与追踪编排。',
    whatIs: [
      '有向关系图在普通关系图基础上增加方向信息，适合表达流转、传播、调用与转账链路。',
      '当业务问题核心在于“路径方向”和“前后顺序”时，有向关系图比普通网络图更直接。',
    ],
    whenToUse: [
      '需要追踪资金从受害人账户到中转账户、再到出金口的完整链条。',
      '需要比较多跳链路的时间间隔、留存比例和分流结构。',
      '需要把图结果直接转成止付、冻结、人工复核等动作清单。',
    ],
    mistakes: [
      { title: '忽略边的时间属性', description: '没有时间间隔和跳数，链路就很难转成处置优先级。' },
      { title: '把方向画反', description: '链路回溯与链路追踪的方向不同，错误方向会直接误导处置。' },
    ],
    insights: [
      '实时链路构建能力决定断链效率，边上应直接携带金额、时间间隔与处置状态。',
      '连续多跳在极短时间内完成且留存比例接近零，是中转账户的重要特征。',
      '建议把有向链路结果对接黑灰名单、限额、止付与人工工单，形成图到动作闭环。',
    ],
  },
  network_weighted: {
    route: '/graph/network_weighted',
    title: '带权关系图',
    subtitle: '把交易金额、频次或敞口映射到边权上，适合看对公客户关联交易强度与集中度。',
    icon: NetworkIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: WeightedNetworkG6,
    scenarioComponent: NetworkWeightedTradeScenarioG6,
    nodePath: 'root/q-net-basic/chart-net-weighted',
    reportNodeId: 'chart-net-weighted',
    scenarioName: '对公客户关联交易强度与集中度风险图谱',
    businessLine: '对公业务 + 授信风险管理',
    scenarioDescription:
      '把核心企业与上下游供应商的近 30 日交易强度映射到边宽与标签上，用于识别强关联、集中度与隐匿关联。',
    whatIs: [
      '带权关系图在边或节点上增加数值权重，用粗细、颜色或标签表示关系强弱。',
      '当“是否有关联”还不够，需要进一步比较“关联有多强”时，应优先使用带权图。',
    ],
    whenToUse: [
      '需要把交易金额、频次、授信敞口等定量信息叠加到关系网络里。',
      '需要识别高权重主边、异常集中交易对和风险传染主通道。',
      '需要支撑对公授信审查中的关联交易真实性核验与集中度管理。',
    ],
    mistakes: [
      { title: '边宽没有统一口径', description: '金额、频次、EAD 混在一起会导致权重语义失真。' },
      { title: '只看交易热度不看风险', description: '交易强并不等于风险低，仍需叠加 PD/LGD 与现金流。' },
    ],
    insights: [
      '建议把经营关联与风险关联叠加成双权重网络，而不是只看交易热度。',
      '对融资平台与地产链客户，可以引入风险折损权重避免“交易很热闹但风险已劣化”的错觉。',
      '当加权度数上升而 DSCR 下降时，应尽快触发授信重评估与定价调整。',
    ],
  },
  network_tree: {
    route: '/graph/network_tree',
    title: '树图',
    subtitle: '适合呈现严格父子层级，常用于集团授信穿透、项目分层和担保品追踪。',
    icon: DendrogramIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: IndentedTreeG6,
    scenarioComponent: NetworkTreeCreditScenarioG6,
    nodePath: 'root/q-net-hierarchy/chart-net-tree',
    reportNodeId: 'chart-net-tree',
    scenarioName: '集团授信穿透与额度分配树',
    businessLine: '对公授信 + 集团客户风险管理',
    scenarioDescription:
      '从集团向多家子公司、多项目与融资品种/担保品展开，识别额度分拆、项目依赖和担保穿透不足。',
    dataNote:
      '本场景以 `docs/network-deep-research-report.md` 中 `chart-net-tree` 的层级口径为基础，经确认补充为“集团—多家子公司—多项目—融资品种/担保品”的多分支树结构，用于准确体现树图的一对多语义。',
    whatIs: [
      '树图用于表达严格的一对多层级结构，每个节点只有唯一上级。',
      '当问题本质是父子层级、权限归属、额度分配或资产穿透时，树图最清晰。',
    ],
    whenToUse: [
      '需要把集团、子公司、项目公司和担保品穿透成一条清晰层级。',
      '需要核查额度是否被拆分绕限、担保是否穿透到底层项目。',
      '需要把项目层作为压力测试和授信管理的最小单元。',
    ],
    mistakes: [
      { title: '把多对多关系硬塞进树图', description: '一旦存在多父节点或交叉依赖，应改 DAG 或网络图。' },
      { title: '只画结构不画约束', description: '没有额度、LTV 和担保质量，树图就无法支撑风控判断。' },
    ],
    insights: [
      '集团授信的关键是穿透与一致口径，树图应与风险分类和资本计量口径保持一致。',
      '建议把项目层设为关键管理单元，形成“项目—资金用途—回款”闭环证据链。',
      '对抵押类项目贷款，估值时效与 LTV 动态折算应作为硬约束指标。',
    ],
  },
  network_dag: {
    route: '/graph/network_dag',
    title: 'DAG图',
    subtitle: '表达“依赖但不循环”的决策链路，适合授信审批、风控策略和数据谱系审计。',
    icon: DagFlowIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: DagFlowG6,
    scenarioComponent: NetworkDagDecisionScenarioG6,
    nodePath: 'root/q-net-hierarchy/chart-net-dag',
    reportNodeId: 'chart-net-dag',
    scenarioName: '授信审批与风控策略依赖 DAG',
    businessLine: '风险管理 + 合规 + 科技架构',
    scenarioDescription:
      '把数据源、特征服务、模型、策略和决策连接成无环依赖链，用于回放一次授信决策如何产生。',
    whatIs: [
      'DAG 图用于表达有向且无环的依赖关系，强调先后顺序与不可回路。',
      '它非常适合做数据血缘、决策血缘、审批依赖与任务编排可视化。',
    ],
    whenToUse: [
      '需要解释一次授信或反欺诈决策用了哪些数据、模型和规则。',
      '需要把风控平台做成可回放、可审计、可解释的决策工程。',
      '需要定位模型版本、规则阈值与人工豁免在链路中的作用位置。',
    ],
    mistakes: [
      { title: '把反馈迭代画进单次执行链', description: '训练反馈属于下一周期，不应让单次决策链出现环。' },
      { title: '只把 DAG 当技术流程图', description: '没有授权依据、版本号和豁免记录，就无法应对审计与合规。' },
    ],
    insights: [
      'DAG 是合规与经营的共同语言，建议把授权依据、模型版本和灰度策略直接挂在边上。',
      '数据使用“有依据、可解释、可复核”是自动化决策治理的基础要求。',
      'overrideRate 不宜过高也不宜过低，应设置可接受区间并按周复盘。',
    ],
  },
  network_radial_tree: {
    route: '/graph/network_radial_tree',
    title: '径向紧凑树',
    subtitle: '把深层控制链或血缘结构向外展开，适合 UBO 穿透、股权链和名单筛查。',
    icon: RadialCompactTreeIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: RadialCompactTreeG6,
    scenarioComponent: NetworkRadialUboScenarioG6,
    nodePath: 'root/q-net-hierarchy/chart-net-radial-compact-tree',
    reportNodeId: 'chart-net-radial-compact-tree',
    scenarioName: 'UBO/实控人穿透与名单筛查',
    businessLine: '合规（KYC/制裁/反洗钱） + 对公业务',
    scenarioDescription:
      '围绕授信申请企业向外展开股东、SPV 与 UBO 控制链，用于识别复杂控制结构与强化尽调对象。',
    dataNote:
      '本场景以 `docs/network-deep-research-report.md` 中 `chart-net-radial-compact-tree` 的 UBO/控制链口径为基础，按用户要求补充为多分支、多层 SPV/信托/平台控制结构，以更准确体现径向紧凑树“节点多、层级深、向外穿透”的语义。',
    whatIs: [
      '径向紧凑树把层级结构从中心向外辐射展开，适合层级深、节点多的控制链与血缘关系。',
      '相比横向树图，它更节省空间，也更适合展示“穿透深度”。',
    ],
    whenToUse: [
      '需要从企业快速穿透到股东、SPV、最终受益人和控制方式。',
      '需要在 KYC、制裁筛查和尽调中识别多层复杂控制结构。',
      '需要把“关系深度”和“命中风险信号”放到同一张图上审查。',
    ],
    mistakes: [
      { title: '节点太多却不裁剪视图', description: '授信、AML、制裁不同场景看到的链路深度不应相同。' },
      { title: '只看持股比例不看控制方式', description: '协议控制、任命控制等也可能决定 UBO 判断。' },
    ],
    insights: [
      '建议实现按用途裁剪视图：授信审查看必要链路，AML/制裁看更完整链路。',
      '当 UBO 链路过深且伴随负面舆情命中时，应升级为强化尽调。',
      '复杂控制链的可见性必须与访问权限和操作留痕一起设计。',
    ],
  },
  network_fishbone: {
    route: '/graph/network_fishbone',
    title: '鱼骨图',
    subtitle: '从结果向原因多层拆解，适合 NPL 上行、迁徙率恶化等风险问题治理。',
    icon: FishboneIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: FishboneG6,
    scenarioComponent: NetworkFishboneNplScenarioG6,
    nodePath: 'root/q-net-hierarchy/chart-net-fishbone',
    reportNodeId: 'chart-net-fishbone',
    scenarioName: 'NPL 上行根因拆解与治理路线图',
    businessLine: '风险管理 + 经营管理',
    scenarioDescription:
      '把 NPL 率上行拆解到宏观、行业、流程和模型多个原因层，帮助高管把解释转成治理动作清单。',
    whatIs: [
      '鱼骨图以一个结果为主干，向外拆解一级原因与二级原因，适合做因果分解与责任归因。',
      '当问题是“为什么会这样”而不是“谁和谁相连”时，鱼骨图比普通网络图更高效。',
    ],
    whenToUse: [
      '需要把 NPL、关注类、拨备覆盖等组合指标的变化拆解成治理路径。',
      '需要在例会上把宏观、行业、模型和执行问题放到同一视图里讨论。',
      '需要把风险指标和责任节点直接绑定，形成治理路线图。',
    ],
    mistakes: [
      { title: '停留在解释层', description: '鱼骨图最终要落到限额、定价、催收、重组等动作，不是停在讨论。' },
      { title: '原因层级过细', description: '层级太深会让管理层失去主线，应先保留最能驱动动作的骨干原因。' },
    ],
    insights: [
      '建议用三层阈值体系管理鱼骨：组合层、行业/区域层、客户/资产层。',
      '监管重点领域风险化解应在鱼骨图中有明确骨干原因和处置责任。',
      '处置周期应纳入 KPI，避免风险长期挂账导致治理迟滞。',
    ],
  },
  network_community: {
    route: '/graph/network_community',
    title: '社区网络图',
    subtitle: '突出团伙和圈层，而不是单点账户，适合洗钱、跑分和黑灰产成片识别。',
    icon: CommunityDisjointIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: CommunityNetworkG6,
    scenarioComponent: NetworkCommunityFraudScenarioG6,
    nodePath: 'root/q-net-community/chart-net-community',
    reportNodeId: 'chart-net-community',
    scenarioName: '洗钱/跑分团伙社区发现与分层打击',
    businessLine: '合规（AML） + 反欺诈（Fraud）',
    scenarioDescription:
      '把账户按团伙社区聚成圈层，识别社区内循环、高危出金口以及适合批量处置的边界。',
    whatIs: [
      '社区网络图强调“群组”而非单个节点，核心问题是哪些节点天然组成一个圈层。',
      '它适合回答“这是孤立个体，还是成片团伙”的问题。',
    ],
    whenToUse: [
      '需要识别跑分圈、赌博圈、空转圈等团伙式结构。',
      '需要把处置从单账户升级为社区级的限额、核验和工单模板。',
      '需要比较社区内循环和社区外出金的结构差异。',
    ],
    mistakes: [
      { title: '社区划分后不复核质量', description: '聚类结果不是天然正确，需结合时间窗和业务口径复核 modularity。' },
      { title: '只看颜色不看流向', description: '同色社区只是分群结果，真正的风险还要看社区内外的资金结构。' },
    ],
    insights: [
      '社区级风控能明显降低误伤，相比单点封堵更适合黑灰产治理。',
      '当社区内循环占比高且对外出金口集中时，应优先口子账户断链。',
      '建议沉淀“社区画像→处置模板→复盘”的标准流程，而不是逐账户打地鼠。',
    ],
  },
  network_bipartite: {
    route: '/graph/network_bipartite',
    title: '二部图',
    subtitle: '天然适合两类主体之间的关系，例如借款人—抵押物、借款人—担保人。',
    icon: BipartiteNetworkIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: BipartiteNetworkG6,
    scenarioComponent: NetworkBipartiteMortgageScenarioG6,
    nodePath: 'root/q-net-community/chart-net-bipartite',
    reportNodeId: 'chart-net-bipartite',
    scenarioName: '借款人—抵押物/担保人二部图',
    businessLine: '零售抵押贷风控 + 对公担保风控',
    scenarioDescription:
      '把借款人与抵押物明确分成两侧，快速识别一物多押、合并 LTV 过高和担保覆盖不足问题。',
    whatIs: [
      '二部图只连接两类不同类型的节点，不允许同类节点之间直接连边。',
      '它非常适合借款人-抵押物、客户-产品、用户-设备等二元关系问题。',
    ],
    whenToUse: [
      '需要快速识别同一抵押物被多笔贷款占用的结构性风险。',
      '需要把合并 LTV 与抵押权完整性核验放到同一张图里审查。',
      '需要比较不同借款人对同一担保资源的占用程度。',
    ],
    mistakes: [
      { title: '把同类关系也画进去', description: '借款人之间或抵押物之间的关系不应塞进同一张二部图。' },
      { title: '只看单笔 LTV', description: '一物多押场景必须看合并 LTV，而不是单笔贷款视角。' },
    ],
    insights: [
      '二部图最大的价值是让“一物多押”这种结构风险一眼可见。',
      '风险分类与缓释判断必须建立在抵押权完整性核验基础上。',
      '合并 LTV 超阈值时，应限制新增授信并要求补充担保或下调额度。',
    ],
  },
  network_ego: {
    route: '/graph/network_ego',
    title: 'Ego网络',
    subtitle: '围绕单个核心主体展开一圈或两圈关系，适合重点名单主体的传染半径审查。',
    icon: EgoCenterIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: EgoNetworkG6,
    scenarioComponent: NetworkEgoContagionScenarioG6,
    nodePath: 'root/q-net-community/chart-net-ego',
    reportNodeId: 'chart-net-ego',
    scenarioName: '围绕重点房企/城投平台的风险传染 Ego 网络',
    businessLine: '对公风险 + 资产管理',
    scenarioDescription:
      '以房企/平台主体为中心，展开担保、同业敞口和项目回款关系，用于判断风险传染半径与压降优先级。',
    whatIs: [
      'Ego 网络以一个核心节点为中心，展示它的一圈或两圈关键关系。',
      '它适合高管或名单例会快速把握某个重点主体的“风险半径”。',
    ],
    whenToUse: [
      '需要围绕重点房企、城投、核心企业快速查看敞口、担保与项目关系。',
      '需要评估风险传染路径、担保链深度和敞口集中度。',
      '需要把名单管理、重组谈判和处置进度放到一张图上联动。',
    ],
    mistakes: [
      { title: '圈层展开过深', description: 'Ego 图适合一圈或两圈，层级太多会回到全网图的噪音问题。' },
      { title: '只看合并敞口', description: '担保可用性折扣、借新还旧比例等结构指标同样关键。' },
    ],
    insights: [
      'Ego 网络适合做重点名单例会固定页，每周更新敞口、担保链和回款进度。',
      '政策性支持项目与市场化风险资产应在图上明确分层，避免资源错配。',
      '对 refinanceRatio 过高的链条，应尽早启动压降或重组预案。',
    ],
  },
  network_matrix: {
    route: '/graph/network_matrix',
    title: '散点矩阵',
    subtitle: '把稠密连线改成矩阵单元格，适合对手方大额往来巡检和集中度识别。',
    icon: HeatmapIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: AdjacencyMatrixG2,
    scenarioComponent: NetworkAdjMatrixScenarioG2,
    nodePath: 'root/q-net-dense/chart-net-adj-matrix',
    reportNodeId: 'chart-net-adj-matrix',
    scenarioName: '对手方往来矩阵热力',
    businessLine: '合规巡检 + 资金业务/对公运营',
    scenarioDescription:
      '把来源地区与去向地区映射为矩阵单元格，降低稠密交易关系的视觉缠绕，便于发现热点流向。',
    whatIs: [
      '矩阵视图用行列交叉的单元格表达关系强度，是稠密网络降噪的有效方式。',
      '当节点很多且线条过密时，矩阵比节点连线图更易发现整体模式。',
    ],
    whenToUse: [
      '需要巡检跨地区、跨行业、跨机构的大额往来热点。',
      '需要比较高频小额与低频大额的格子分布差异。',
      '需要把热点单元格再 drill-down 回交易明细和 KYC 信息。',
    ],
    mistakes: [
      { title: '矩阵口径不一致', description: '行列维度和时间窗不一致，会让热点比较失去意义。' },
      { title: '忽略零值单元格', description: '矩阵的价值也在于发现“本该有、却突然没有”的结构空洞。' },
    ],
    insights: [
      '矩阵非常适合监管口径仪表盘化输出，先看热点，再下钻明细。',
      '建议把单元格与异常原因码绑定，减少季节性波动带来的误报。',
      '对连续多期异常热点单元格，应触发专项穿透检查而不是一次性告警。',
    ],
  },
  network_edge_bundling: {
    route: '/graph/network_edge_bundling',
    title: '边捆绑图',
    subtitle: '把稠密路径归并成束，适合供应链金融里找主干路径与异常绕行。',
    icon: EdgeBundlingIcon,
    interactionLibrary: 'AntV G6',
    interactionComponent: EdgeBundlingNetworkG6,
    scenarioComponent: NetworkEdgeBundlingSupplychainScenarioG6,
    nodePath: 'root/q-net-dense/chart-net-edge-bundling',
    reportNodeId: 'chart-net-edge-bundling',
    scenarioName: '供应链金融稠密网络的路径归并',
    businessLine: '普惠金融/供应链金融 + 风险管理',
    scenarioDescription:
      '围绕核心企业、供应商与分行融资关系做路径归并，识别绕开核心的支付路径和高风险分叉。',
    whatIs: [
      '边捆绑图通过把相近路径归并成束，降低稠密网络的视觉噪音。',
      '它适合回答“主干路径在哪里、哪些边是异常绕行”的问题。',
    ],
    whenToUse: [
      '需要在供应链金融网络中区分主干融资路径和偏离路径。',
      '需要识别绕开核心企业的支付、融资和回款结构。',
      '需要在稠密网络中优先定位需要 drill-down 的束与分叉点。',
    ],
    mistakes: [
      { title: '把捆绑结果当明细真相', description: '边束是高层模式，不等于可以替代明细边核验。' },
      { title: '节点位置随意摆放', description: '没有稳定层级和方向，边捆绑很容易丢失业务可解释性。' },
    ],
    insights: [
      '边捆绑的价值在于同时解决找主干和找绕行两个问题。',
      '融资/发票比例异常且伴随 pathDeviation 的路径，应优先触发验真和回流检查。',
      '随着供应链金融规模扩大，风险侧应把主干束沉淀成白名单模式，偏离束纳入重点核验。',
    ],
  },
  network_arc: {
    route: '/graph/network_arc',
    title: '弧长连接图',
    subtitle: '按固定顺序排列节点，再用弧线连接关系，适合比较链路结构和重复剧本。',
    icon: ArcIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: ArcDiagramG2,
    scenarioComponent: NetworkArcFraudScenarioG2,
    nodePath: 'root/q-net-dense/chart-net-arc',
    reportNodeId: 'chart-net-arc',
    scenarioName: '按账户序列排序的资金链结构对比',
    businessLine: '反欺诈运营 + 合规协查',
    scenarioDescription:
      '把账户按风险顺序排成一条线，再用弧线连接转账关系，用于识别团伙复用的结构剧本。',
    whatIs: [
      '弧长连接图把节点按一维顺序排布，再用弧线表达连接关系，结构差异非常直观。',
      '当你已经有了明确排序键，并希望比较不同链路的“形状”时，弧图很有效。',
    ],
    whenToUse: [
      '需要按开户日、风险分、层级顺序比较资金链结构。',
      '需要快速识别多个团伙是否复用了相似的转账剧本。',
      '需要把跨度、留存比例和时间间隔做成结构特征。',
    ],
    mistakes: [
      { title: '排序键不稳定', description: '如果 orderKey 频繁变化，结构对比会失去业务含义。' },
      { title: '弧跨度没有解释', description: '跨度大并不天然危险，必须结合时间与金额一起解释。' },
    ],
    insights: [
      '建议沉淀 patternId，把弧跨度、时间间隔和留存比例做成剧本三元组。',
      '弧图特别适合做反诈运营的剧本库对齐与快速复用。',
      '高危剧本命中后，应自动触发更强校验与限额，而不是只停留在展示层。',
    ],
  },
  network_chord: {
    route: '/graph/network_chord',
    title: '和弦图',
    subtitle: '把群组间多对多流向聚合成结构图，适合资金投向、信用迁徙与组合结构洞察。',
    icon: ChordIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: ChordG2,
    scenarioComponent: NetworkChordCapitalScenarioG2,
    nodePath: 'root/q-net-dense/chart-net-chord',
    reportNodeId: 'chart-net-chord',
    scenarioName: '资金流向与信用迁徙的群组对群组洞察',
    businessLine: '资负管理（ALM） + 风险管理 + 战略经营',
    scenarioDescription:
      '把五篇大文章之间的资金流向做成群组对群组结构图，用于高管快速理解投放结构变化与集中度。',
    whatIs: [
      '和弦图用于表达群组与群组之间的多对多关系流，强调整体结构而不是单个节点细节。',
      '它适合回答“资金主要从哪里流向哪里、哪些群组之间联系最强”的问题。',
    ],
    whenToUse: [
      '需要把行业、区域、产品或五篇大文章之间的流向结构讲清楚。',
      '需要在高管报告中快速呈现组合结构迁徙和集中度变化。',
      '需要把结构变化与净流入、VaR、RAROC 等风险指标联动看。',
    ],
    mistakes: [
      { title: '输入口径不统一', description: '和弦图非常依赖一致口径，否则结构对比会直接失真。' },
      { title: '只看流量不看风险', description: '规模扩张如果不叠加资本占用与风险参数，很容易误导经营判断。' },
    ],
    insights: [
      '和弦图是典型的高管语言，但前提是输入必须来自一致统计口径。',
      '当某群组流量快速上升时，应同步检查 PD/LGD、资本占用与 RAROC。',
      'TopK 集中度和 VaR 上升应配合限额、对冲或调价动作一起管理。',
    ],
  },
};

export const NETWORK_STORY_KEYS = Object.keys(NETWORK_STORY_CONFIGS);
