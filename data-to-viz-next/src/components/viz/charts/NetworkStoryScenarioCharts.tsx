/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Text } from '@antv/g';
import { Chart as G2Chart } from '@antv/g2';
import { BaseTransform, ExtensionCategory, Graph, register, treeToGraphData } from '@antv/g6';

function useG6Graph(buildGraph: (container: HTMLDivElement) => Graph, deps: React.DependencyList = []) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    let disposed = false;
    let rendered = false;
    let destroyed = false;

    const mountNode = document.createElement('div');
    mountNode.style.width = '100%';
    mountNode.style.height = '100%';
    container.appendChild(mountNode);

    const graph = buildGraph(mountNode);

    const safeDestroy = () => {
      if (destroyed) return;
      destroyed = true;
      try {
        graph.destroy();
      } catch {
        // ignore
      }
      if (mountNode.parentNode === container) {
        container.removeChild(mountNode);
      }
    };

    const renderPromise = graph
      .render()
      .then(() => {
        rendered = true;
        if (disposed) safeDestroy();
      })
      .catch((error: unknown) => {
        if (!disposed) {
          console.error(error);
        }
        if (disposed) safeDestroy();
      });

    return () => {
      disposed = true;
      if (rendered) {
        safeDestroy();
      } else {
        void renderPromise.finally(() => {
          safeDestroy();
        });
      }
    };
  }, deps);

  return containerRef;
}

function useG2Chart(buildChart: (container: HTMLDivElement) => G2Chart, deps: React.DependencyList = []) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const chart = buildChart(containerRef.current);
    chart.render();
    return () => chart.destroy();
  }, deps);

  return containerRef;
}

function formatAmountWan(value?: number) {
  if (!value) return '—';
  return `${(value / 10000).toFixed(value >= 1000000 ? 0 : 1)}万`;
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded-full border border-white" style={{ backgroundColor: color }} />
      <span className="text-slate-500">{label}</span>
    </div>
  );
}

type GraphNodeDatum = {
  id: string;
  data?: Record<string, any>;
  style?: Record<string, unknown>;
};

type GraphEdgeDatum = {
  source: string;
  target: string;
  data?: Record<string, any>;
};

function buildInitialScatter<T extends { id: string; style?: Record<string, unknown> }>(
  nodes: T[],
): Array<T & { style: Record<string, unknown> }> {
  const total = Math.max(nodes.length, 1);
  const radius = 118;

  return nodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / total;
    const x = 185 + Math.cos(angle) * radius;
    const y = 150 + Math.sin(angle) * radius;

    return {
      ...node,
      style: {
        ...(node.style || {}),
        x,
        y,
      },
    };
  });
}

const amlForceData = {
  nodes: [
    { id: 'C001', data: { label: '客户C001', nodeType: 'customer', riskScore: 82, size: 34 } },
    { id: 'A001', data: { label: '账户A001', nodeType: 'account', riskScore: 78, size: 31 } },
    { id: 'D099', data: { label: '设备D099', nodeType: 'device', riskScore: 90, size: 38 } },
    { id: 'M771', data: { label: '商户M771', nodeType: 'merchant', riskScore: 70, size: 28 } },
    { id: 'W200', data: { label: '钱包W200', nodeType: 'wallet', riskScore: 65, size: 26 } },
    { id: 'A888', data: { label: '中转A888', nodeType: 'account', riskScore: 88, size: 36 } },
  ],
  edges: [
    { source: 'C001', target: 'A001', data: { relType: 'owns' } },
    { source: 'A001', target: 'D099', data: { relType: 'loginFrom' } },
    { source: 'A001', target: 'M771', data: { relType: 'merchantPay', amount: 12800 } },
    { source: 'A001', target: 'A888', data: { relType: 'transfer', amount: 12000 } },
    { source: 'A888', target: 'W200', data: { relType: 'topUp', amount: 11950 } },
  ],
};

const directedScenarioData = {
  nodes: [
    { id: 'V001', data: { label: '受害人V001', riskRole: 'victim' } },
    { id: 'M001', data: { label: '中转M001', riskRole: 'mule' } },
    { id: 'M002', data: { label: '中转M002', riskRole: 'mule' } },
    { id: 'CASH', data: { label: '出金落点', riskRole: 'cashout' } },
  ],
  edges: [
    { source: 'V001', target: 'M001', data: { relType: 'transfer', amount: 50000, elapsedSec: 0 } },
    { source: 'M001', target: 'M002', data: { relType: 'transfer', amount: 49800, elapsedSec: 43 } },
    { source: 'M002', target: 'CASH', data: { relType: 'cashout', amount: 49600, elapsedSec: 67 } },
  ],
};

const weightedScenarioData = {
  nodes: [
    { id: 'E_CORE', data: { label: '核心企业A', nodeType: 'core' } },
    { id: 'E_SUP1', data: { label: '供应商1', nodeType: 'supplier' } },
    { id: 'E_SUP2', data: { label: '供应商2', nodeType: 'supplier' } },
  ],
  edges: [
    {
      source: 'E_CORE',
      target: 'E_SUP1',
      data: { relType: 'tradePay', edgeWeightAmt30d: 2750000, edgeWeightCnt30d: 2 },
    },
    {
      source: 'E_CORE',
      target: 'E_SUP2',
      data: { relType: 'tradePay', edgeWeightAmt30d: 320000, edgeWeightCnt30d: 1 },
    },
    {
      source: 'E_SUP2',
      target: 'E_SUP1',
      data: { relType: 'tradePay', edgeWeightAmt30d: 120000, edgeWeightCnt30d: 1 },
    },
  ],
};

const treeScenarioData = {
  id: 'G001',
  data: {
    label: '集团G001\n总额度 120亿',
    level: 'group',
  },
  children: [
    {
      id: 'S101',
      data: {
        label: '子公司S101\n地产开发额度 35亿',
        level: 'subsidiary',
      },
      children: [
        {
          id: 'P900',
          data: {
            label: '项目P900\n城中村改造 EAD 18亿',
            level: 'project',
          },
          children: [
            {
              id: 'FAC900',
              data: {
                label: '开发贷\n余额 17亿',
                level: 'facility',
              },
            },
            {
              id: 'COL900',
              data: {
                label: '土地/在建工程\nLTV 65.4%',
                level: 'collateral',
              },
            },
          ],
        },
        {
          id: 'P901',
          data: {
            label: '项目P901\n保租房一期 EAD 9.6亿',
            level: 'project',
          },
          children: [
            {
              id: 'FAC901',
              data: {
                label: '并购贷\n余额 6.2亿',
                level: 'facility',
              },
            },
            {
              id: 'COL901',
              data: {
                label: '在建工程抵押\nLTV 58.0%',
                level: 'collateral',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'S102',
      data: {
        label: '子公司S102\n城市更新额度 28亿',
        level: 'subsidiary',
      },
      children: [
        {
          id: 'P920',
          data: {
            label: '项目P920\n旧改一期 EAD 14亿',
            level: 'project',
          },
          children: [
            {
              id: 'FAC920',
              data: {
                label: '项目贷款\n余额 10.5亿',
                level: 'facility',
              },
            },
            {
              id: 'COL920',
              data: {
                label: '土地使用权\nLTV 61.2%',
                level: 'collateral',
              },
            },
          ],
        },
        {
          id: 'P921',
          data: {
            label: '项目P921\n配套商业 EAD 6.8亿',
            level: 'project',
          },
          children: [
            {
              id: 'FAC921',
              data: {
                label: '流动资金贷\n余额 3.8亿',
                level: 'facility',
              },
            },
            {
              id: 'COL921',
              data: {
                label: '保证担保\n覆盖率 1.35x',
                level: 'collateral',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'S103',
      data: {
        label: '子公司S103\n物业服务额度 12亿',
        level: 'subsidiary',
      },
      children: [
        {
          id: 'P930',
          data: {
            label: '项目P930\n园区运营 EAD 5.2亿',
            level: 'project',
          },
          children: [
            {
              id: 'FAC930',
              data: {
                label: '经营性物业贷\n余额 3.6亿',
                level: 'facility',
              },
            },
            {
              id: 'COL930',
              data: {
                label: '应收账款质押\n质押率 72%',
                level: 'collateral',
              },
            },
          ],
        },
      ],
    },
  ],
};

const dagScenarioData = {
  nodes: [
    { id: 'SRC_KYC', data: { label: 'KYC/实名核验', kind: 'dataSource' } },
    { id: 'SRC_BUREAU', data: { label: '征信/外部数据', kind: 'dataSource' } },
    { id: 'FEAT_FS', data: { label: '特征服务', kind: 'service' } },
    { id: 'MODEL_PD', data: { label: 'PD模型v3.4', kind: 'model' } },
    { id: 'RULE_DTI', data: { label: 'DTI规则', kind: 'policy' } },
    { id: 'DECISION', data: { label: '授信决策', kind: 'decision' } },
  ],
  edges: [
    { source: 'SRC_KYC', target: 'FEAT_FS', data: { relType: 'feeds' } },
    { source: 'SRC_BUREAU', target: 'FEAT_FS', data: { relType: 'feeds' } },
    { source: 'FEAT_FS', target: 'MODEL_PD', data: { relType: 'featuresToModel' } },
    { source: 'MODEL_PD', target: 'DECISION', data: { relType: 'scoreToDecision' } },
    { source: 'RULE_DTI', target: 'DECISION', data: { relType: 'ruleGate' } },
  ],
};

const radialOwnershipTree = {
  id: 'CO_A',
  data: {
    label: '企业A(申请授信)\nKYC高风险',
    nodeType: 'root',
    kycRiskLevel: '高',
  },
  children: [
    {
      id: 'CO_B',
      data: {
        label: '股东B(境内控股平台)\n持股 40%',
        nodeType: 'corp',
        ownershipPct: 40,
      },
      children: [
        {
          id: 'P_M',
          data: {
            label: '自然人M\n实际控制 60%',
            nodeType: 'person',
            ownershipPct: 60,
            controlType: 'equity',
            adverseMediaHit: 0,
            sanctionsHit: 0,
          },
        },
        {
          id: 'P_N',
          data: {
            label: '自然人N\n任命控制',
            nodeType: 'person',
            controlType: 'appointment',
            adverseMediaHit: 0,
            sanctionsHit: 0,
          },
        },
      ],
    },
    {
      id: 'CO_C',
      data: {
        label: '股东C(开曼SPV)\n持股 35%',
        nodeType: 'offshore',
        ownershipPct: 35,
        jurisdiction: 'CAYMAN',
      },
      children: [
        {
          id: 'CO_C1',
          data: {
            label: 'BVI HoldCo\n穿透持股 100%',
            nodeType: 'offshore',
            ownershipPct: 100,
            jurisdiction: 'BVI',
          },
          children: [
            {
              id: 'P_UBO1',
              data: {
                label: '自然人X(UBO)\n负面舆情命中',
                nodeType: 'person',
                ownershipPct: 70,
                controlType: 'equity',
                adverseMediaHit: 1,
                sanctionsHit: 0,
              },
            },
            {
              id: 'P_UBO2',
              data: {
                label: '自然人Y\n一致行动人 30%',
                nodeType: 'person',
                ownershipPct: 30,
                controlType: 'concertedAction',
                adverseMediaHit: 0,
                sanctionsHit: 0,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'TR_D',
      data: {
        label: '家族信托D\n受益份额 15%',
        nodeType: 'trust',
        ownershipPct: 15,
      },
      children: [
        {
          id: 'TRUSTEE_HK',
          data: {
            label: '受托人(香港)\n协议控制',
            nodeType: 'trustee',
            controlType: 'agreement',
          },
          children: [
            {
              id: 'P_Z',
              data: {
                label: '受益人Z\n强化尽调',
                nodeType: 'person',
                controlType: 'beneficiary',
                adverseMediaHit: 1,
                sanctionsHit: 0,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'ESOP_E',
      data: {
        label: '员工持股平台E\n持股 10%',
        nodeType: 'platform',
        ownershipPct: 10,
      },
      children: [
        {
          id: 'GP_CTRL',
          data: {
            label: 'GP/执行事务合伙人',
            nodeType: 'platform',
            controlType: 'appointment',
          },
          children: [
            {
              id: 'P_Q',
              data: {
                label: '自然人Q\n实控人候选',
                nodeType: 'person',
                controlType: 'appointment',
                adverseMediaHit: 0,
                sanctionsHit: 0,
              },
            },
          ],
        },
      ],
    },
  ],
};

const fishboneData = {
  id: '结果：NPL率上行',
  children: [
    {
      id: '宏观与政策',
      children: [{ id: '平台债务展期/重组压力' }],
    },
    {
      id: '行业结构',
      children: [{ id: '房地产链条回款延迟' }],
    },
    {
      id: '流程与执行',
      children: [{ id: '贷后跟踪滞后' }],
    },
    {
      id: '模型与策略',
      children: [{ id: '互联网贷客群迁移致PD抬升' }],
    },
  ],
};

const communityScenarioData = {
  nodes: [
    { id: 'A10', data: { label: '账户A10', communityId: 'K1', riskScore: 85, size: 32 } },
    { id: 'A11', data: { label: '账户A11', communityId: 'K1', riskScore: 80, size: 29 } },
    { id: 'A12', data: { label: '账户A12', communityId: 'K1', riskScore: 78, size: 28 } },
    { id: 'A90', data: { label: '出金口A90', communityId: 'K2', riskScore: 88, size: 35 } },
  ],
  edges: [
    { source: 'A10', target: 'A11', data: { amount: 9800, relType: 'transfer' } },
    { source: 'A11', target: 'A12', data: { amount: 9700, relType: 'transfer' } },
    { source: 'A12', target: 'A10', data: { amount: 9600, relType: 'transfer' } },
    { source: 'A11', target: 'A90', data: { amount: 30000, relType: 'transferOut' } },
  ],
};

const bipartiteScenarioData = {
  nodes: [
    { id: 'B001', data: { label: '借款人B001', nodeType: 'borrower' }, style: { x: 70, y: 100 } },
    { id: 'B002', data: { label: '借款人B002', nodeType: 'borrower' }, style: { x: 70, y: 230 } },
    { id: 'H900', data: { label: '房产H900', nodeType: 'collateral' }, style: { x: 330, y: 165 } },
  ],
  edges: [
    { source: 'B001', target: 'H900', data: { loanBalance: 2600000, LTV: 68.42 } },
    { source: 'B002', target: 'H900', data: { loanBalance: 1800000, LTV: 47.37 } },
  ],
};

const egoScenarioData = {
  nodes: [
    { id: 'EGO_RE', data: { label: '核心RE01', role: 'center' }, style: { x: 220, y: 160 } },
    { id: 'SUB_A', data: { label: '子公司A', role: 'neighbor' }, style: { x: 120, y: 80 } },
    { id: 'GUA_G', data: { label: '担保人G', role: 'neighbor' }, style: { x: 120, y: 245 } },
    { id: 'BANK_X', data: { label: '同业X', role: 'outer' }, style: { x: 320, y: 80 } },
    { id: 'PROJ_1', data: { label: '项目1', role: 'outer' }, style: { x: 330, y: 245 } },
  ],
  edges: [
    { source: 'EGO_RE', target: 'SUB_A', data: { value: 100, relType: 'controls' } },
    { source: 'GUA_G', target: 'EGO_RE', data: { value: 120, relType: 'guarantees' } },
    { source: 'BANK_X', target: 'EGO_RE', data: { value: 80, relType: 'jointCredit' } },
    { source: 'SUB_A', target: 'PROJ_1', data: { value: 60, relType: 'operates' } },
  ],
};

const matrixRows = [
  { fromRegion: '华东', toRegion: '华南', amount: 8500000 },
  { fromRegion: '华东', toRegion: '华南', amount: 4200000 },
  { fromRegion: '华北', toRegion: '华东', amount: 12000000 },
];

const edgeBundlingScenarioData = {
  nodes: [
    { id: 'BR01', data: { label: '分行BR01', group: 'branch', size: 24 }, style: { x: 60, y: 150 } },
    { id: 'CORE', data: { label: '核心企业', group: 'core', size: 26 }, style: { x: 180, y: 150 } },
    { id: 'S1', data: { label: '一级供应商S1', group: 'supplier', size: 22 }, style: { x: 290, y: 110 } },
    { id: 'S2', data: { label: '二级供应商S2', group: 'supplier', size: 20 }, style: { x: 370, y: 200 } },
  ],
  edges: [
    { source: 'CORE', target: 'S1', data: { value: 200, relType: 'tradePay' } },
    { source: 'BR01', target: 'S1', data: { value: 160, relType: 'finance' } },
    { source: 'S1', target: 'S2', data: { value: 90, relType: 'subcontractPay' } },
  ],
};

const arcNodes = [
  { id: 'U01', order: 1, riskBand: '观察', size: 6 },
  { id: 'U02', order: 2, riskBand: '关注', size: 7 },
  { id: 'U03', order: 3, riskBand: '高危', size: 8 },
  { id: 'U04', order: 4, riskBand: '高危', size: 9 },
];

const arcLinks = [
  { source: 'U01', target: 'U02', value: 9800, relType: 'transfer' },
  { source: 'U02', target: 'U03', value: 9700, relType: 'transfer' },
  { source: 'U01', target: 'U03', value: 12000, relType: 'transfer' },
  { source: 'U03', target: 'U04', value: 21500, relType: 'cashout' },
];

const chordLinks = [
  { begin: '普惠金融', end: '制造业小微', value: 32000000 },
  { begin: '科技金融', end: '高新技术', value: 45000000 },
  { begin: '绿色金融', end: '新能源', value: 38000000 },
  { begin: '数字金融', end: '线上消费贷', value: 27000000 },
];

const forceNodeColors: Record<string, string> = {
  customer: '#2563eb',
  account: '#0ea5e9',
  device: '#ef4444',
  merchant: '#14b8a6',
  wallet: '#8b5cf6',
};

const forceEdgeColors: Record<string, string> = {
  owns: '#94a3b8',
  loginFrom: '#2563eb',
  merchantPay: '#f59e0b',
  transfer: '#ef4444',
  topUp: '#8b5cf6',
};

const directedRoleColors: Record<string, string> = {
  victim: '#2563eb',
  mule: '#f59e0b',
  cashout: '#ef4444',
};

const weightedNodeColors: Record<string, string> = {
  core: '#2563eb',
  supplier: '#0ea5a4',
};

const hierarchyColors: Record<string, string> = {
  group: '#0f172a',
  subsidiary: '#2563eb',
  project: '#0ea5a4',
  collateral: '#f59e0b',
  facility: '#8b5cf6',
};

const dagNodeColors: Record<string, string> = {
  dataSource: '#3b82f6',
  service: '#0ea5a4',
  model: '#8b5cf6',
  policy: '#f59e0b',
  decision: '#ef4444',
};

const communityColors: Record<string, string> = {
  K1: '#2563eb',
  K2: '#ef4444',
};

const arcRiskColors: Record<string, string> = {
  观察: '#fde68a',
  关注: '#f59e0b',
  高危: '#ef4444',
};

let fishboneTextShape: Text | null = null;
let fishboneRegistered = false;

function measureFishboneText(text: string, fontSize: number, fontWeight?: number) {
  if (!fishboneTextShape) {
    fishboneTextShape = new Text({ style: { text, fontSize, fontWeight } });
  }
  fishboneTextShape.attr({ text, fontSize, fontWeight });
  return fishboneTextShape.getBBox().width;
}

class AssignFishboneColor extends BaseTransform {
  static defaultOptions = {
    colors: ['#2563eb', '#0ea5a4', '#f59e0b', '#8b5cf6'],
  };

  constructor(context: any, options: any) {
    super(context, { ...AssignFishboneColor.defaultOptions, ...options });
  }

  beforeDraw(input: any) {
    const nodes = this.context.model.getNodeData();
    let colorIndex = 0;
    const visit = (nodeId: string, color?: string) => {
      const node = nodes.find((item: any) => item.id === nodeId);
      if (!node) return;
      const resolvedColor = color || this.options.colors[colorIndex++ % this.options.colors.length];
      node.style = { ...(node.style ?? {}), color: resolvedColor };
      node.children?.forEach((childId: string) => visit(childId, resolvedColor));
    };
    nodes.filter((item: any) => item.depth === 1).forEach((item: any) => visit(item.id));
    return input;
  }
}

function ensureFishboneRegistered() {
  if (fishboneRegistered) return;
  register(ExtensionCategory.TRANSFORM, 'network-story-fishbone-color', AssignFishboneColor);
  fishboneRegistered = true;
}

export function NetworkForceAmlScenarioG6() {
  const seededData = useMemo(
    () => ({
      ...amlForceData,
      nodes: buildInitialScatter(amlForceData.nodes),
    }),
    [],
  );

  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        data: seededData,
        padding: 16,
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: (d: { data?: { amount?: number } }) => {
            const amount = d.data?.amount ?? 10000;
            return amount >= 12000 ? 110 : 138;
          },
          nodeStrength: -105,
        },
        node: {
          type: 'circle',
          style: {
            size: (d: GraphNodeDatum) => d.data?.size ?? 28,
            fill: (d: GraphNodeDatum) => forceNodeColors[d.data?.nodeType ?? 'account'] ?? '#2563eb',
            stroke: '#ffffff',
            lineWidth: 1.5,
            labelText: (d: GraphNodeDatum) => d.data?.label ?? '',
            labelPlacement: 'bottom',
            labelFill: '#334155',
            labelFontSize: 11,
            labelFontWeight: 700,
            labelOffsetY: 8,
          },
        },
        edge: {
          type: 'line',
          style: {
            stroke: (d: { data?: { relType?: string } }) => forceEdgeColors[d.data?.relType ?? 'owns'] ?? '#94a3b8',
            strokeOpacity: 0.65,
            lineWidth: (d: { data?: { amount?: number } }) =>
              d.data?.amount ? Math.max(2, d.data.amount / 5000) : 1.5,
            endArrow: true,
            labelText: (d: { data?: { amount?: number; relType?: string } }) =>
              d.data?.amount ? `${d.data.relType} ${formatAmountWan(d.data.amount)}` : d.data?.relType ?? '',
            labelFill: '#334155',
            labelFontSize: 10,
            labelFontWeight: 600,
          },
        },
        behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
        autoFit: { type: 'view' },
        animation: false,
      }),
    [seededData],
  );

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="h-[340px] w-full rounded-md border border-slate-200 bg-white" />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <LegendItem color="#2563eb" label="客户/账户" />
        <LegendItem color="#ef4444" label="设备" />
        <LegendItem color="#14b8a6" label="商户" />
        <LegendItem color="#8b5cf6" label="钱包" />
      </div>
    </div>
  );
}

export function NetworkDirectedFraudScenarioG6() {
  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        data: directedScenarioData,
        padding: 20,
        layout: {
          type: 'antv-dagre',
          rankdir: 'LR',
          ranksep: 90,
          nodesep: 48,
        },
        node: {
          type: 'rect',
          style: {
            size: [126, 48],
            radius: 10,
            fill: (d: GraphNodeDatum) => directedRoleColors[d.data?.riskRole ?? 'victim'] ?? '#2563eb',
            fillOpacity: 0.9,
            stroke: '#ffffff',
            lineWidth: 1.5,
            labelText: (d: GraphNodeDatum) => d.data?.label ?? '',
            labelPlacement: 'center',
            labelFill: '#ffffff',
            labelFontSize: 12,
            labelFontWeight: 700,
          },
        },
        edge: {
          type: 'polyline',
          style: {
            stroke: '#64748b',
            lineWidth: (d: { data?: { amount?: number } }) =>
              Math.max(2, (d.data?.amount ?? 10000) / 20000 + 1.5),
            endArrow: true,
            radius: 10,
            labelText: (d: { data?: { amount?: number; elapsedSec?: number } }) =>
              `${formatAmountWan(d.data?.amount)} / ${d.data?.elapsedSec ?? 0}s`,
            labelFill: '#334155',
            labelFontSize: 10,
            labelFontWeight: 600,
            labelBackground: true,
            labelBackgroundFill: '#ffffff',
            labelPadding: [2, 4],
          },
        },
        behaviors: ['drag-canvas', 'zoom-canvas'],
        autoFit: { type: 'view' },
        animation: false,
      }),
    [],
  );

  return <div ref={containerRef} className="h-[320px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkWeightedTradeScenarioG6() {
  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        data: weightedScenarioData,
        padding: 20,
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: 150,
          nodeStrength: -95,
        },
        node: {
          type: 'circle',
          style: {
            size: 30,
            fill: (d: GraphNodeDatum) => weightedNodeColors[d.data?.nodeType ?? 'supplier'] ?? '#0ea5a4',
            stroke: '#ffffff',
            lineWidth: 1.5,
            labelText: (d: GraphNodeDatum) => d.data?.label ?? '',
            labelPlacement: 'bottom',
            labelFill: '#334155',
            labelFontSize: 11,
            labelFontWeight: 700,
            labelOffsetY: 8,
          },
        },
        edge: {
          type: 'line',
          style: {
            stroke: '#2563eb',
            strokeOpacity: 0.7,
            lineWidth: (d: { data?: { edgeWeightAmt30d?: number } }) =>
              Math.max(2, (d.data?.edgeWeightAmt30d ?? 100000) / 700000),
            labelText: (d: { data?: { edgeWeightAmt30d?: number; edgeWeightCnt30d?: number } }) =>
              `${formatAmountWan(d.data?.edgeWeightAmt30d)} / ${d.data?.edgeWeightCnt30d ?? 0}笔`,
            labelFill: '#1e293b',
            labelFontSize: 10,
            labelFontWeight: 700,
            labelBackground: true,
            labelBackgroundFill: '#ffffff',
            labelPadding: [2, 4],
          },
        },
        behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
        autoFit: { type: 'view' },
        animation: false,
      }),
    [],
  );

  return <div ref={containerRef} className="h-[320px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkTreeCreditScenarioG6() {
  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        data: treeToGraphData(treeScenarioData as any),
        autoFit: 'view',
        padding: [24, 32, 24, 32],
        layout: {
          type: 'compact-box',
          direction: 'LR',
          getVGap: (node: any) => (node.depth === 0 ? 36 : 28),
          getHGap: (node: any) => {
            if (node.depth === 0) return 96;
            if (node.depth === 1) return 72;
            return 56;
          },
        },
        node: {
          type: 'rect',
          style: {
            size: (d: GraphNodeDatum) => {
              if (d.data?.level === 'group') return [180, 70];
              if (d.data?.level === 'subsidiary') return [168, 62];
              if (d.data?.level === 'project') return [162, 58];
              return [152, 54];
            },
            radius: 12,
            fill: (d: GraphNodeDatum) => hierarchyColors[d.data?.level ?? 'group'] ?? '#2563eb',
            stroke: '#ffffff',
            lineWidth: 1.5,
            labelText: (d: GraphNodeDatum) => d.data?.label ?? '',
            labelPlacement: 'center',
            labelFill: '#ffffff',
            labelFontSize: (d: GraphNodeDatum) => (d.data?.level === 'group' ? 13 : 11),
            labelFontWeight: 700,
            labelLineHeight: 16,
            shadowColor: 'rgba(15, 23, 42, 0.08)',
            shadowBlur: 12,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
          },
        },
        edge: {
          type: 'cubic-horizontal',
          style: {
            stroke: '#94a3b8',
            lineWidth: 2.2,
            strokeOpacity: 0.9,
          },
        },
        behaviors: ['drag-canvas', 'zoom-canvas'],
        animation: false,
      }),
    [],
  );

  return <div ref={containerRef} className="h-[420px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkDagDecisionScenarioG6() {
  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        data: dagScenarioData,
        padding: 20,
        layout: {
          type: 'antv-dagre',
          rankdir: 'TB',
          ranksep: 60,
          nodesep: 40,
        },
        node: {
          type: 'rect',
          style: {
            size: [132, 52],
            radius: 12,
            fill: (d: GraphNodeDatum) => dagNodeColors[d.data?.kind ?? 'service'] ?? '#0ea5a4',
            fillOpacity: 0.9,
            stroke: '#ffffff',
            lineWidth: 1.5,
            labelText: (d: GraphNodeDatum) => d.data?.label ?? '',
            labelPlacement: 'center',
            labelFill: '#ffffff',
            labelFontSize: 11,
            labelFontWeight: 700,
          },
        },
        edge: {
          type: 'polyline',
          style: {
            stroke: '#64748b',
            radius: 12,
            lineWidth: 2.2,
            endArrow: true,
            labelText: (d: GraphEdgeDatum) => d.data?.relType ?? '',
            labelFill: '#334155',
            labelFontSize: 10,
            labelFontWeight: 600,
            labelBackground: true,
            labelBackgroundFill: '#ffffff',
            labelPadding: [1, 4],
          },
        },
        behaviors: ['drag-canvas', 'zoom-canvas'],
        autoFit: { type: 'view' },
        animation: false,
      }),
    [],
  );

  return <div ref={containerRef} className="h-[340px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkRadialUboScenarioG6() {
  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        autoFit: 'view',
        padding: 44,
        data: treeToGraphData(radialOwnershipTree as any),
        node: {
          style: {
            size: (d: GraphNodeDatum) => {
              if (d.data?.nodeType === 'root') return 32;
              if (d.data?.nodeType === 'person') return 22;
              if (d.data?.nodeType === 'offshore') return 24;
              return 26;
            },
            fill: (d: GraphNodeDatum) => {
              if (d.data?.nodeType === 'root') return '#0f172a';
              if (d.data?.nodeType === 'offshore') return '#0ea5a4';
              if (d.data?.nodeType === 'trust' || d.data?.nodeType === 'trustee') return '#f59e0b';
              if (d.data?.nodeType === 'platform') return '#8b5cf6';
              if (d.data?.nodeType === 'person') return '#ef4444';
              return '#2563eb';
            },
            stroke: (d: GraphNodeDatum) => {
              if (d.data?.sanctionsHit) return '#7f1d1d';
              if (d.data?.adverseMediaHit) return '#9a3412';
              return '#ffffff';
            },
            lineWidth: (d: GraphNodeDatum) => (d.data?.adverseMediaHit || d.data?.sanctionsHit ? 2.4 : 1.4),
            labelText: (d: GraphNodeDatum) => d.data?.label ?? d.id,
            labelFill: '#334155',
            labelFontSize: 10,
            labelMaxLines: 2,
            labelBackground: true,
            labelBackgroundFill: '#ffffff',
            labelPadding: [2, 4],
          },
        },
        edge: {
          type: 'cubic-radial',
          style: {
            stroke: '#94a3b8',
            lineWidth: 2,
          },
        },
        layout: {
          type: 'compact-box',
          radial: true,
          direction: 'RL',
          getVGap: (node: any) => (node.depth === 0 ? 42 : 32),
          getHGap: (node: any) => (node.depth <= 1 ? 78 : 60),
          preLayout: false,
        },
        transforms: ['place-radial-labels'],
        behaviors: ['drag-canvas', 'zoom-canvas'],
        animation: false,
      }),
    [],
  );

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="h-[420px] w-full rounded-md border border-slate-200 bg-white" />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <LegendItem color="#2563eb" label="境内企业/控股平台" />
        <LegendItem color="#0ea5a4" label="境外SPV" />
        <LegendItem color="#f59e0b" label="信托/协议控制" />
        <LegendItem color="#8b5cf6" label="员工持股平台" />
        <LegendItem color="#ef4444" label="自然人/UBO" />
      </div>
    </div>
  );
}

export function NetworkFishboneNplScenarioG6() {
  ensureFishboneRegistered();

  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        autoFit: 'view',
        padding: 28,
        data: treeToGraphData(fishboneData as any),
        node: {
          type: 'rect',
          style: (d: any) => {
            const depth = d.depth ?? 0;
            if (depth === 0) {
              return {
                size: [measureFishboneText(d.id, 22, 700) + 72, 72],
                radius: 12,
                fill: '#0f172a',
                labelText: d.id,
                labelPlacement: 'center',
                labelFill: '#ffffff',
                labelFontSize: 22,
                labelFontWeight: 700,
              };
            }
            if (depth === 1) {
              return {
                size: [measureFishboneText(d.id, 16, 600) + 40, 40],
                radius: 10,
                fill: d.style?.color,
                fillOpacity: 0.18,
                stroke: d.style?.color,
                lineWidth: 2,
                labelText: d.id,
                labelPlacement: 'center',
                labelFill: '#1e293b',
                labelFontSize: 16,
                labelFontWeight: 700,
              };
            }
            return {
              size: [2, 24],
              fill: 'transparent',
              labelText: d.id,
              labelPlacement: 'left',
              labelFill: '#334155',
              labelFontSize: 13,
              labelFontWeight: 600,
            };
          },
        },
        edge: {
          type: 'polyline',
          style: {
            stroke: '#334155',
            lineWidth: 2.2,
          },
        },
        layout: {
          type: 'fishbone',
          direction: 'RL',
          hGap: 36,
          vGap: 56,
          getRibSep: (node: any) => (node.depth === 0 ? 0 : -48),
        },
        transforms: ['network-story-fishbone-color'],
        behaviors: ['drag-canvas', 'zoom-canvas'],
        animation: false,
      }),
    [],
  );

  return <div ref={containerRef} className="h-[400px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkCommunityFraudScenarioG6() {
  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        data: communityScenarioData,
        padding: 16,
        layout: {
          type: 'force',
          preventOverlap: true,
          nodeStrength: -85,
          linkDistance: 120,
        },
        node: {
          type: 'circle',
          style: {
            size: (d: GraphNodeDatum) => d.data?.size ?? 28,
            fill: (d: GraphNodeDatum) => communityColors[d.data?.communityId ?? 'K1'] ?? '#2563eb',
            stroke: '#ffffff',
            lineWidth: 1.5,
            labelText: (d: GraphNodeDatum) => d.data?.label ?? '',
            labelPlacement: 'bottom',
            labelFill: '#334155',
            labelFontSize: 11,
            labelFontWeight: 700,
            labelOffsetY: 8,
          },
        },
        edge: {
          type: 'line',
          style: {
            stroke: '#64748b',
            strokeOpacity: 0.45,
            lineWidth: (d: { data?: { amount?: number } }) => Math.max(1.6, (d.data?.amount ?? 9000) / 10000),
            endArrow: true,
          },
        },
        behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
        autoFit: { type: 'view' },
        animation: false,
      }),
    [],
  );

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="h-[320px] w-full rounded-md border border-slate-200 bg-white" />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <LegendItem color="#2563eb" label="社区K1（疑似跑分圈）" />
        <LegendItem color="#ef4444" label="社区K2（疑似出金口）" />
      </div>
    </div>
  );
}

export function NetworkBipartiteMortgageScenarioG6() {
  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        data: bipartiteScenarioData,
        padding: [16, 24, 16, 24],
        node: {
          type: 'rect',
          style: {
            size: [118, 44],
            radius: 10,
            fill: (d: GraphNodeDatum) => (d.data?.nodeType === 'borrower' ? '#2563eb' : '#0ea5a4'),
            fillOpacity: 0.9,
            stroke: '#ffffff',
            lineWidth: 1.5,
            x: (d: GraphNodeDatum) => (d.style?.x as number) ?? 0,
            y: (d: GraphNodeDatum) => (d.style?.y as number) ?? 0,
            labelText: (d: GraphNodeDatum) => d.data?.label ?? '',
            labelPlacement: 'center',
            labelFill: '#ffffff',
            labelFontSize: 11,
            labelFontWeight: 700,
          },
        },
        edge: {
          type: 'line',
          style: {
            stroke: '#64748b',
            lineWidth: 2.4,
            endArrow: true,
            labelText: (d: { data?: { loanBalance?: number; LTV?: number } }) =>
              `${formatAmountWan(d.data?.loanBalance)} / LTV ${d.data?.LTV?.toFixed(1)}%`,
            labelFill: '#334155',
            labelFontSize: 10,
            labelFontWeight: 600,
            labelBackground: true,
            labelBackgroundFill: '#ffffff',
            labelPadding: [1, 4],
          },
        },
        behaviors: ['drag-canvas', 'zoom-canvas'],
        autoFit: { type: 'view' },
        animation: false,
      }),
    [],
  );

  return <div ref={containerRef} className="h-[300px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkEgoContagionScenarioG6() {
  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        data: egoScenarioData,
        padding: [16, 24, 16, 24],
        node: {
          type: 'circle',
          style: {
            size: (d: GraphNodeDatum) => {
              if (d.data?.role === 'center') return 42;
              if (d.data?.role === 'neighbor') return 30;
              return 24;
            },
            x: (d: GraphNodeDatum) => (d.style?.x as number) ?? 0,
            y: (d: GraphNodeDatum) => (d.style?.y as number) ?? 0,
            fill: (d: GraphNodeDatum) => {
              if (d.data?.role === 'center') return '#1d4ed8';
              if (d.data?.role === 'neighbor') return '#0ea5a4';
              return '#94a3b8';
            },
            fillOpacity: (d: GraphNodeDatum) => (d.data?.role === 'outer' ? 0.78 : 0.92),
            stroke: '#ffffff',
            lineWidth: 1.5,
            labelText: (d: GraphNodeDatum) => d.data?.label ?? '',
            labelPlacement: 'bottom',
            labelFill: '#334155',
            labelFontSize: 11,
            labelFontWeight: (d: GraphNodeDatum) => (d.data?.role === 'center' ? 700 : 600),
            labelOffsetY: 7,
          },
        },
        edge: {
          type: 'line',
          style: {
            stroke: '#64748b',
            strokeOpacity: 0.52,
            lineWidth: (d: { data?: { value?: number } }) => Math.max(1.8, (d.data?.value ?? 60) / 40),
            endArrow: true,
          },
        },
        behaviors: ['drag-canvas', 'zoom-canvas'],
        autoFit: { type: 'view' },
        animation: false,
      }),
    [],
  );

  return <div ref={containerRef} className="h-[320px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkAdjMatrixScenarioG2() {
  const matrixCells = useMemo(() => {
    const regions = Array.from(
      new Set(matrixRows.flatMap((row) => [row.fromRegion, row.toRegion])),
    );
    const map = new Map<string, number>();
    matrixRows.forEach((row) => {
      const key = `${row.fromRegion}|${row.toRegion}`;
      map.set(key, (map.get(key) ?? 0) + row.amount);
    });

    return regions.flatMap((row) =>
      regions.map((col) => ({
        row,
        col,
        cellAmt: map.get(`${row}|${col}`) ?? 0,
      })),
    );
  }, []);

  const containerRef = useG2Chart(
    (container) => {
      const chart = new G2Chart({
        container,
        autoFit: true,
        height: 340,
        paddingLeft: 88,
        paddingBottom: 56,
        paddingTop: 16,
        paddingRight: 16,
      });

      chart.options({
        type: 'heatmap',
        data: { value: matrixCells },
        encode: {
          x: 'col',
          y: 'row',
          color: 'cellAmt',
        },
        scale: {
          color: {
            domain: [0, 12700000],
            palette: 'oranges',
          },
        },
        style: {
          stroke: '#ffffff',
          lineWidth: 1,
        },
        labels: [
          {
            text: (d: { cellAmt: number }) => (d.cellAmt > 0 ? formatAmountWan(d.cellAmt) : ''),
            fill: '#0f172a',
            fontSize: 10,
            fontWeight: 700,
          },
        ],
        axis: {
          x: { title: false, labelFontSize: 11 },
          y: { title: false, labelFontSize: 11 },
        },
        legend: {
          color: { title: '单元格总金额' },
        },
        tooltip: {
          title: (d: { row: string; col: string }) => `${d.row} → ${d.col}`,
          items: [{ field: 'cellAmt', name: '金额' }],
        },
      });

      return chart;
    },
    [matrixCells],
  );

  return <div ref={containerRef} className="h-[340px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkEdgeBundlingSupplychainScenarioG6() {
  const containerRef = useG6Graph(
    (container) =>
      new Graph({
        container,
        data: edgeBundlingScenarioData,
        padding: [16, 28, 16, 28],
        node: {
          type: 'circle',
          style: {
            size: (d: GraphNodeDatum) => d.data?.size ?? 22,
            x: (d: GraphNodeDatum) => (d.style?.x as number) ?? 0,
            y: (d: GraphNodeDatum) => (d.style?.y as number) ?? 0,
            fill: (d: GraphNodeDatum) => {
              if (d.data?.group === 'branch') return '#1d4ed8';
              if (d.data?.group === 'core') return '#0f172a';
              return '#0ea5a4';
            },
            stroke: '#ffffff',
            lineWidth: 1.4,
            labelText: (d: GraphNodeDatum) => d.data?.label ?? '',
            labelPlacement: 'right',
            labelFill: '#334155',
            labelFontSize: 11,
            labelFontWeight: 700,
            labelOffsetX: 6,
          },
        },
        edge: {
          type: 'polyline',
          style: {
            stroke: '#64748b',
            strokeOpacity: 0.42,
            lineWidth: (d: { data?: { value?: number } }) => Math.max(1.6, (d.data?.value ?? 90) / 90),
          },
        },
        plugins: [
          {
            type: 'edge-bundling',
            key: 'edge-bundling',
            K: 0.1,
            lambda: 0.1,
            divisions: 1,
            divRate: 2,
            cycles: 4,
            iterations: 70,
            iterRate: 2 / 3,
            bundleThreshold: 0.45,
          },
        ],
        behaviors: ['drag-canvas', 'zoom-canvas'],
        autoFit: { type: 'view' },
        animation: false,
      }),
    [],
  );

  return <div ref={containerRef} className="h-[320px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkArcFraudScenarioG2() {
  const containerRef = useG2Chart(
    (container) => {
      const nodes = [...arcNodes].sort((a, b) => a.order - b.order).map((item) => ({ ...item, y: 0.14 }));
      const links = arcLinks.map((item) => ({ ...item, y: 0.14, y1: 0.14 }));

      const chart = new G2Chart({
        container,
        autoFit: true,
        height: 320,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 24,
        paddingBottom: 44,
      });

      chart.options({
        type: 'view',
        scale: {
          x: { domain: nodes.map((item) => item.id) },
          y: { domain: [0, 1] },
        },
        children: [
          {
            type: 'lineY',
            data: { value: [{ base: 0.14 }] },
            encode: { y: 'base' },
            style: { stroke: '#94a3b8', lineWidth: 1.2, strokeOpacity: 0.6 },
            axis: false,
            legend: false,
            tooltip: false,
          },
          {
            type: 'link',
            data: { value: links },
            encode: {
              x: 'source',
              y: 'y',
              x1: 'target',
              y1: 'y1',
              color: 'relType',
              shape: 'arc',
            },
            scale: {
              color: {
                domain: ['transfer', 'cashout'],
                range: ['#3b82f6', '#ef4444'],
              },
            },
            style: {
              shape: 'arc',
              strokeOpacity: 0.45,
              lineWidth: (d: { value: number }) => 0.8 + d.value / 8000,
            },
            tooltip: {
              title: (d: { source: string; target: string }) => `${d.source} → ${d.target}`,
              items: [{ field: 'value', name: '金额' }],
            },
            legend: {
              color: {
                position: 'top',
                itemLabelFontSize: 11,
              },
            },
            interaction: [{ type: 'elementHighlight' }],
          },
          {
            type: 'point',
            data: { value: nodes },
            encode: {
              x: 'id',
              y: 'y',
              color: 'riskBand',
              size: 'size',
            },
            scale: {
              color: {
                domain: Object.keys(arcRiskColors),
                range: Object.values(arcRiskColors),
              },
              size: {
                range: [4, 10],
              },
            },
            style: {
              stroke: '#ffffff',
              lineWidth: 1.4,
            },
            labels: [
              {
                text: 'id',
                dy: 12,
                textAlign: 'center',
                textBaseline: 'top',
                fill: '#334155',
                fontSize: 10,
                fontWeight: 600,
              },
            ],
            axis: false,
            legend: false,
          },
        ],
        axis: {
          x: { title: false, label: false, tick: false, line: false },
          y: { title: false, label: false, tick: false, line: false, grid: false },
        },
      });

      return chart;
    },
    [],
  );

  return <div ref={containerRef} className="h-[320px] w-full rounded-md border border-slate-200 bg-white" />;
}

export function NetworkChordCapitalScenarioG2() {
  const containerRef = useG2Chart(
    (container) => {
      const chart = new G2Chart({
        container,
        autoFit: true,
        height: 320,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 12,
        paddingBottom: 12,
      });

      chart.options({
        type: 'chord',
        data: { value: chordLinks },
        layout: { nodeWidthRatio: 0.05 },
        encode: {
          color: (d: { begin?: string; source?: string }) => d.begin || d.source,
          source: 'begin',
          target: 'end',
          value: 'value',
        },
        scale: {
          color: {
            range: ['#1d4ed8', '#2563eb', '#0ea5a4', '#16a34a', '#f59e0b', '#8b5cf6'],
          },
        },
        style: {
          labelFontSize: 12,
          labelFontWeight: 700,
          labelFill: '#334155',
          linkFillOpacity: 0.45,
        },
        tooltip: {
          title: (d: { begin?: string; end?: string }) => `${d.begin} → ${d.end}`,
          items: [{ field: 'value', name: '流量值' }],
        },
        interaction: [
          {
            type: 'elementHighlight',
            background: true,
          },
        ],
      });

      return chart;
    },
    [],
  );

  return <div ref={containerRef} className="h-[320px] w-full rounded-md border border-slate-200 bg-white" />;
}
