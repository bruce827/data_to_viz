'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { Scatter3DIcon } from '@/components/viz/icons';
import { Scatter3DG2 } from '@/components/viz/charts/Scatter3DG2';
import { Scatter3DRiskScenarioG2 } from '@/components/viz/charts/Scatter3DScenarioG2';

export default function Scatter3DStory() {
  const outlineItems = [
    { id: 'what-is-scatter3d', label: '什么是3D散点图' },
    { id: 'when-to-use-scatter3d', label: '何时使用' },
    { id: 'scatter3d-common-mistakes', label: '常见误区' },
    { id: 'scatter3d-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="3D 散点图"
      subtitle="在三维空间同时表达风险、损失与规模，辅助大额敞口穿透分析。"
      icon={Scatter3DIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是3D散点图？" id="what-is-scatter3d">
        <p>
          3D 散点图（3D Scatter Plot）把三个连续变量映射到 x、y、z 三个维度，
          每个点代表一个观测对象在三维空间中的位置。
        </p>
        <p>
          相比二维散点图，3D 视角更适合表达“风险-损失-规模”这类三变量权衡关系，
          但也需要配合旋转和筛选避免遮挡与误读。
        </p>
        <p>英文名：3D Scatter Plot</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2 3D）">
        <Scatter3DG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-scatter3d">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要在一次分析中同时纳入三个连续风险指标。</li>
          <li>需要识别“某单项不高但组合后高风险”的客户或行业。</li>
          <li>适用于授信审批会、贷后重检、组合压降等三维权衡场景。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="scatter3d-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看单一轴值</h3>
            <p className="text-sm text-red-700">
              仅看 PD 或 LGD 会漏掉规模效应，需联动三轴识别“低频高损”敞口。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略视角遮挡</h3>
            <p className="text-sm text-red-700">
              固定视角可能造成点位重叠，解读时应旋转观察并配合 tooltip 明细确认。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="scatter3d-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">大额客户 PD-LGD-EAD 三维风险穿透</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-3num/chart-scatter3d（leaf id=chart-scatter3d）</p>
          <p>
            在对公授信与贷后重检场景中，把 PD、LGD、EAD 同时放入三维空间，
            可识别“PD 不高但 LGD 很高”或“规模大但指标偏优”的差异化管理对象。
          </p>
        </div>

        <ChartWrapper title="数据3D散点图：客户级 PD-LGD-EAD 风险画像">
          <Scatter3DRiskScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 report 提供的客户级样例数据（虚构演示数据），未做额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>C01/C03 的 PD 不是最高，但 LGD 明显偏高，属于“表面稳健、实则高损”类型。</li>
          <li>C04 EAD 最大但 PD/LGD 较低，可作为组合稳定器，同时仍需控制集中度。</li>
          <li>3D 视角可避免单指标决策偏差，更适合授信委员会进行组合层面权衡。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
