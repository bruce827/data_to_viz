import React from 'react';
import {
  BarplotIcon,
  FacetRectIcon,
  HeatmapIcon,
  LineIcon,
  LollipopIcon,
  ScatterIcon,
  StackedAreaIcon,
  TimeIcon,
} from '@/components/viz/icons';
import { TimeCyclicCalendarG2 } from '@/components/viz/charts/TimeCyclicCalendarG2';
import { TimeCyclicSeasonalG2 } from '@/components/viz/charts/TimeCyclicSeasonalG2';
import { TimeDiscreteColumnG2 } from '@/components/viz/charts/TimeDiscreteColumnG2';
import { TimeDiscreteLineG2 } from '@/components/viz/charts/TimeDiscreteLineG2';
import { TimeDiscreteStackedAreaG2 } from '@/components/viz/charts/TimeDiscreteStackedAreaG2';
import { TimeDurationGanttG2 } from '@/components/viz/charts/TimeDurationGanttG2';
import { TimePointPulseG2 } from '@/components/viz/charts/TimePointPulseG2';
import { TimePointTimelineG2 } from '@/components/viz/charts/TimePointTimelineG2';
import {
  TimeCalendarServiceScenarioG2,
  TimeColumnFraudReviewScenarioG2,
  TimeGanttResponseScenarioG2,
  TimeLinePaymentSuccessScenarioG2,
  TimePulseAlertScenarioG2,
  TimeSeasonalLoginScenarioG2,
  TimeStackedAreaChannelScenarioG2,
  TimeTimelineOpsScenarioG2,
} from '@/components/viz/charts/TimeStoryScenarioCharts';

export type TimeStoryConfig = {
  route: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  interactionLibrary: 'AntV G2';
  interactionComponent: React.ComponentType;
  scenarioComponent: React.ComponentType;
  nodePath: string;
  leafId: string;
  scenarioName: string;
  businessLine: string;
  timeWindow: string;
  scenarioDescription: string;
  dataNote?: string;
  whatIs: string[];
  whenToUse: string[];
  mistakes: Array<{ title: string; description: string }>;
  insights: string[];
};

const DEFAULT_TIME_DATA_NOTE =
  '仓库中暂无独立的时间序列 deep research report；本页按监控/复盘口径构造示例数据，重点对齐当前图形的时间语义、异常节点和管理动作。';

export const TIME_STORY_CONFIGS: Record<string, TimeStoryConfig> = {
  time_line: {
    route: '/graph/time_line',
    title: '折线图',
    subtitle: '用离散时间点追踪单一关键指标走势，适合讲拐点、波动和恢复过程。',
    icon: LineIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: TimeDiscreteLineG2,
    scenarioComponent: TimeLinePaymentSuccessScenarioG2,
    nodePath: 'root/q-time-discrete/chart-time-discrete-line',
    leafId: 'chart-time-discrete-line',
    scenarioName: '发薪周支付成功率 14 日复盘',
    businessLine: '支付运营 + 零售银行',
    timeWindow: '2026-02-18 至 2026-03-03',
    scenarioDescription:
      '围绕发薪周前后 14 天的支付成功率，复盘主通道排队、备通道切换和服务恢复的全过程。',
    dataNote: DEFAULT_TIME_DATA_NOTE,
    whatIs: [
      '折线图把一组离散时间点上的数值连成趋势线，适合看单一指标如何随时间变化。',
      '当管理问题是“什么时候开始变坏、什么时候恢复、恢复到什么程度”时，折线图最直接。',
    ],
    whenToUse: [
      '需要追踪成功率、转化率、余额或库存等单一核心指标。',
      '需要识别拐点、平台期、异常下探和恢复斜率。',
      '需要把事件前后趋势放到同一时间轴上复盘。',
    ],
    mistakes: [
      { title: '把多种语义混到一条线上', description: '成功率、延迟、投诉量口径不同，应该拆开或分图展示。' },
      { title: '只看最低点不看恢复斜率', description: '恢复速度往往比最低点更能反映处置能力。' },
    ],
    insights: [
      '2 月 26 日成功率由 98.42% 跌到 96.88%，说明问题已经从局部抬升演变为主链路受损。',
      '2 月 27 日成功率迅速回到 97.95%，表明备通道扩容是本轮恢复的关键动作。',
      '3 月 2 日后指标回到 99.5% 以上，适合作为这轮发薪窗口的恢复验收线。',
    ],
  },
  time_column: {
    route: '/graph/time_column',
    title: '柱状图',
    subtitle: '在固定时间粒度下比较阶段量级差异，适合讲峰值、回落和阶段对比。',
    icon: BarplotIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: TimeDiscreteColumnG2,
    scenarioComponent: TimeColumnFraudReviewScenarioG2,
    nodePath: 'root/q-time-discrete/chart-time-discrete-column',
    leafId: 'chart-time-discrete-column',
    scenarioName: '周度涉诈预警核查量对比',
    businessLine: '反欺诈运营',
    timeWindow: '连续 8 个监控周',
    scenarioDescription:
      '用周度人工核查工单量复盘涉诈样本的集中冒头、策略收紧和回落过程，回答“压力在哪一周集中爆发”。',
    dataNote: DEFAULT_TIME_DATA_NOTE,
    whatIs: [
      '柱状图在每个固定时间点画一个独立柱体，强调不同阶段之间的量级差异。',
      '它不擅长讲连续波动，但非常适合讲阶段峰值和前后对比。',
    ],
    whenToUse: [
      '需要比较周、月、季等固定周期的量级差异。',
      '需要说明活动期、冲击期、恢复期之间的明显台阶。',
      '需要给管理层快速展示“哪一段最重、回落了多少”。',
    ],
    mistakes: [
      { title: '时间粒度切得过细', description: '太细会让柱状图退化成锯齿折线，失去阶段比较价值。' },
      { title: '只看绝对量不看阶段背景', description: '峰值高低需要和策略变化、假期或活动窗口一起解释。' },
    ],
    insights: [
      'W4-W5 是本轮涉诈样本核查压力峰值，说明冲击不是单周尖峰，而是持续两周的集中暴露。',
      'W6 之后工单量从 652 回落到 541，再降到 452，说明策略收紧开始生效。',
      '如果后续周次再次回到 600 以上，应把当前策略视为临时缓解而非根治。',
    ],
  },
  time_stacked_area: {
    route: '/graph/time_stacked_area',
    title: '堆叠面积图',
    subtitle: '把总量和结构放到同一时间轴上，适合讲份额迁移和通道切换。',
    icon: StackedAreaIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: TimeDiscreteStackedAreaG2,
    scenarioComponent: TimeStackedAreaChannelScenarioG2,
    nodePath: 'root/q-time-discrete/chart-time-discrete-stacked-area',
    leafId: 'chart-time-discrete-stacked-area',
    scenarioName: '发薪周主备支付通道流量结构迁移',
    businessLine: '支付中台 + 运维治理',
    timeWindow: '2026-02-23 至 2026-03-01',
    scenarioDescription:
      '围绕发薪高峰期间的主通道、备通道和人工兜底流量，复盘一次结构迁移如何把高峰风险拆开承接。',
    dataNote: DEFAULT_TIME_DATA_NOTE,
    whatIs: [
      '堆叠面积图在时间轴上同时展示总量和组成部分的变化。',
      '当你既要回答“总量有没有变”，又要回答“结构怎么迁移”，它比多条折线更合适。',
    ],
    whenToUse: [
      '需要展示主备通道、渠道来源、业务结构等份额迁移。',
      '需要解释总量变化是否来自某一组成部分的异常抬升。',
      '需要复盘一次切换动作是否真正分散了压力。',
    ],
    mistakes: [
      { title: '把过多系列塞进一张图', description: '系列过多时面积层会彼此遮挡，结构含义会迅速变弱。' },
      { title: '只看面积不看总量', description: '份额上升不等于绝对量上升，必须同时看总体规模。' },
    ],
    insights: [
      '2 月 26 日主通道流量快速下滑，备通道与人工兜底同步抬升，说明切换动作被真实执行而非停留在策略层。',
      '2 月 27 日人工兜底开始回落，意味着主备通道承接恢复到可控区间。',
      '3 月 1 日结构重新回到主通道主导，表明这次切换是临时处置而非永久迁移。',
    ],
  },
  time_timeline: {
    route: '/graph/time_timeline',
    title: '时间线散点',
    subtitle: '把关键事件打在同一时间轴上，适合讲事件链、责任归属和关键时点。',
    icon: ScatterIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: TimePointTimelineG2,
    scenarioComponent: TimeTimelineOpsScenarioG2,
    nodePath: 'root/q-time-event-point/chart-time-point-timeline',
    leafId: 'chart-time-point-timeline',
    scenarioName: '发薪窗口关键事件时间线',
    businessLine: '支付运维 + 风控值班',
    timeWindow: '2026-02-26 07:42 - 08:58',
    scenarioDescription:
      '把支付、清算、风控、短信和客服的关键节点打到同一条时间轴上，回答“问题是怎样一步步扩散并被收敛的”。',
    dataNote: DEFAULT_TIME_DATA_NOTE,
    whatIs: [
      '时间线散点把离散事件直接落在时间轴上，强调发生时刻、所属链路和事件级别。',
      '当问题核心不是连续值，而是“哪些关键事件在什么时候发生”，应优先使用时间线散点。',
    ],
    whenToUse: [
      '需要复盘一段窗口内多条链路的关键事件先后顺序。',
      '需要把值班动作、系统异常和业务影响放在同一视图里对照。',
      '需要定位哪一个事件是扩散起点，哪一个事件是恢复转折点。',
    ],
    mistakes: [
      { title: '只画事件不分层级', description: '没有系统泳道或事件级别时，时间线会退化成普通点图。' },
      { title: '把持续状态也塞进散点图', description: '持续时长应交给状态区间图或甘特图，不应硬塞进散点。' },
    ],
    insights: [
      '07:56 风控阈值收紧是第一条主动控制动作，说明系统已进入应急模式。',
      '08:03 清算人工接管与 08:09 备通道扩容构成这轮事件的两个关键转折点。',
      '客服热线告警晚于主链路异常，说明客户影响是滞后暴露的，不适合拿来做首个触发指标。',
    ],
  },
  time_pulse: {
    route: '/graph/time_pulse',
    title: '事件脉冲图',
    subtitle: '在时间轴上突出事件强度和爆发波峰，适合讲告警峰值与异常爆发。',
    icon: LollipopIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: TimePointPulseG2,
    scenarioComponent: TimePulseAlertScenarioG2,
    nodePath: 'root/q-time-event-point/chart-time-point-pulse',
    leafId: 'chart-time-point-pulse',
    scenarioName: '代发窗口告警脉冲爆发图',
    businessLine: 'SRE + 支付值班平台主管',
    timeWindow: '2026-02-26 07:40 - 08:36',
    scenarioDescription:
      '把值班窗口内告警打成脉冲，突出哪一刻最危险、哪一类告警真正拉高了应急等级。',
    dataNote: DEFAULT_TIME_DATA_NOTE,
    whatIs: [
      '事件脉冲图通过“底线 + 竖向脉冲”的方式强调某个时间点的事件强度。',
      '它尤其适合回答“峰值出现在哪”“峰值之后有没有快速回落”。',
    ],
    whenToUse: [
      '需要复盘告警爆发时间点和峰值强度。',
      '需要比较不同事件在同一窗口内的等级差异。',
      '需要把高危时刻提炼给值班经理或管理层快速判断。',
    ],
    mistakes: [
      { title: '脉冲过多没有阈值', description: '没有等级分层时，脉冲图会被普通事件淹没。' },
      { title: '把连续变化误画成脉冲', description: '持续变化要用折线或区间图，脉冲只适合离散爆发。' },
    ],
    insights: [
      '08:03 和 08:09 是本轮窗口内两个最高脉冲，分别对应清算人工接管和主备切换完成。',
      '08:16 短信积压仍处于中等级，说明主链路恢复后外围链路还有滞后清理成本。',
      '08:24 以后脉冲明显回落，这一段可以作为恢复阶段的开始。', 
    ],
  },
  time_gantt: {
    route: '/graph/time_gantt',
    title: '甘特图',
    subtitle: '用任务区间展示处置流程，适合讲谁在什么时间做了什么、持续了多久。',
    icon: TimeIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: TimeDurationGanttG2,
    scenarioComponent: TimeGanttResponseScenarioG2,
    nodePath: 'root/q-time-event-duration/chart-time-duration-gantt',
    leafId: 'chart-time-duration-gantt',
    scenarioName: '支付事故处置任务甘特图',
    businessLine: '运维响应 + 支付平台主管',
    timeWindow: '2026-02-26 07:30 - 08:58',
    scenarioDescription:
      '把检测、切换、风控、人工接管和恢复任务放到一张甘特图里，复盘任务并行、衔接和收口时间。',
    dataNote: DEFAULT_TIME_DATA_NOTE,
    whatIs: [
      '甘特图把任务放在时间轴上，强调开始、结束、持续时长和任务阶段。',
      '当你关心的是“谁先开始、谁持续最长、哪些任务并行重叠”时，甘特图比状态区间图更合适。',
    ],
    whenToUse: [
      '需要复盘事故处置、项目推进或审批编排中的任务过程。',
      '需要比较不同责任团队的响应与恢复时长。',
      '需要识别手工任务是否拉长了总体恢复窗口。',
    ],
    mistakes: [
      { title: '只画任务不画责任团队', description: '没有责任归属就很难用来做复盘和考核。' },
      { title: '把结果状态当成任务', description: '“恢复”“异常”是状态，不是任务，任务应对应具体动作。' },
    ],
    insights: [
      '“启动人工复核”持续近 30 分钟，是这次窗口里最重的人工作业段。',
      '“切换备通道配额”和“收紧风险阈值”并行推进，说明本轮处置是多团队同步编排而不是单线程响应。',
      '“回切主通道”直到 08:58 才结束，表明恢复阶段仍有较长收口时间，不应只盯住故障解除时刻。',
    ],
  },
  time_calendar: {
    route: '/graph/time_calendar',
    title: '日历热力图',
    subtitle: '把周期强度铺在日历网格里，适合讲月初、月底和节假日等周期性高峰。',
    icon: HeatmapIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: TimeCyclicCalendarG2,
    scenarioComponent: TimeCalendarServiceScenarioG2,
    nodePath: 'root/q-time-cyclic/chart-time-cyclic-calendar',
    leafId: 'chart-time-cyclic-calendar',
    scenarioName: '客服来电日历热力图：发薪日与还款日压力窗口',
    businessLine: '客服运营 + 零售银行',
    timeWindow: '连续 12 个监控周',
    scenarioDescription:
      '按周次与星期复盘客服来电量，识别发薪窗口和还款窗口的周期性峰值，给排班和资源调度提供依据。',
    dataNote: DEFAULT_TIME_DATA_NOTE,
    whatIs: [
      '日历热力图把时间展开成网格，适合直观看周期性的高低强度分布。',
      '它擅长回答“高峰是不是总出现在相似的日历位置”。',
    ],
    whenToUse: [
      '需要复盘月初、月底、节假日、账单日等周期性窗口。',
      '需要做客服排班、营销节奏或容量准备。',
      '需要用一张图识别哪些日期位置总是高压区。',
    ],
    mistakes: [
      { title: '只看单个高点不看模式', description: '日历热力图最重要的是周期模式，而不是某一个最高格子。' },
      { title: '混用不同业务口径', description: '来电量、工单量、投诉量应分开，否则颜色意义会失真。' },
    ],
    insights: [
      'W4 与 W8 的周一/周二明显偏高，说明发薪日后客户咨询会稳定集中到工作周前两天。',
      'W6 与 W10 的周四/周五再次抬高，符合还款窗口前后的咨询压力模式。',
      '这种周期性高峰非常适合提前排班，而不是等到当天再被动增援。',
    ],
  },
  time_seasonal: {
    route: '/graph/time_seasonal',
    title: '季节序列图',
    subtitle: '把同一周期位置拆成小面板，适合讲“同一个星期位置为何在某几周偏离常态”。',
    icon: FacetRectIcon,
    interactionLibrary: 'AntV G2',
    interactionComponent: TimeCyclicSeasonalG2,
    scenarioComponent: TimeSeasonalLoginScenarioG2,
    nodePath: 'root/q-time-cyclic/chart-time-cyclic-seasonal',
    leafId: 'chart-time-cyclic-seasonal',
    scenarioName: '多周同星期位置的登录异常率子序列',
    businessLine: '数字银行运维 + 安全风控',
    timeWindow: '连续 8 个监控周',
    scenarioDescription:
      '把一周七天拆成子序列，比较不同周次在相同星期位置的登录异常率，定位“异常总发生在周五还是偶发于某一周”。',
    dataNote: DEFAULT_TIME_DATA_NOTE,
    whatIs: [
      '季节序列图会把相同周期位置拆成多个小面板，方便观察同一位置在不同周期里的偏离。',
      '当你关心的是“周五为什么总高于其他天”，它比普通折线图更容易看出规律。',
    ],
    whenToUse: [
      '需要比较不同周次同一星期位置的差异。',
      '需要识别周期内某个位置的稳定异常或偶发异常。',
      '需要拆解“整体抬升”与“某一天特别高”这两种不同问题。',
    ],
    mistakes: [
      { title: '把周期位置混在一条线上', description: '混在一起后很难区分是整体趋势变化还是特定星期位置偏离。' },
      { title: '忽略面板间统一刻度', description: '小面板必须共享量纲，否则比较会失真。' },
    ],
    insights: [
      '周五在 W5 与 W7 出现明显抬升，说明周末前的登录异常具有结构性而非随机性。',
      '周一在 W6 也有一次次高峰，意味着节后首个工作日存在另一种独立压力模式。',
      '这类规律适合沉淀成提前扩容和风险阈值动态调节，而不是只在事后复盘。',
    ],
  },
};

export const TIME_STORY_KEYS = Object.keys(TIME_STORY_CONFIGS);
