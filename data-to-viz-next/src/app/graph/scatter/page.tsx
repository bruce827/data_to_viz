'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { ScatterIcon } from '@/components/viz/icons';
import { ScatterG2 } from '@/components/viz/charts/ScatterG2';
import { ScatterDscrScenarioG2 } from '@/components/viz/charts/ScatterScenarioG2';

export default function ScatterStory() {
  const outlineItems = [
    { id: 'what-is-scatter', label: '什么是散点图' },
    { id: 'when-to-use-scatter', label: '何时使用' },
    { id: 'scatter-common-mistakes', label: '常见误区' },
    { id: 'scatter-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="散点图"
      subtitle="用于观察两个数值变量之间的关系、分布与风险拐点。"
      icon={ScatterIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是散点图？" id="what-is-scatter">
        <p>
          散点图（Scatter Plot）用平面坐标中的点来表示每个样本在两个数值维度上的位置。
          横轴和纵轴分别对应两个指标，每个点代表一个观测对象。
        </p>
        <p>
          与单指标图相比，散点图更适合观察变量间的相关性、聚类分层和异常离群点。
          当你需要判断“某指标变化是否伴随另一指标恶化”时，散点图是高效选择。
        </p>
        <p>英文名：Scatter Plot</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <ScatterG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-scatter">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要分析两个连续变量之间的相关关系（正相关、负相关或非线性）。</li>
          <li>需要按行业、客群、渠道对样本做分层对比。</li>
          <li>需要识别离群点并进行名单化排查。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="scatter-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把相关当因果</h3>
            <p className="text-sm text-red-700">
              点位相关不等于因果关系，仍需结合业务机制与时间顺序做解释。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略阈值拐点</h3>
            <p className="text-sm text-red-700">
              若只看整体拟合线而不看阈值附近变化，容易漏掉风险“陡升区间”。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="scatter-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">对公小微 DSCR 与违约概率（PD）关联诊断</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2num/q-2num-notordered/q-notordered-few/chart-scatter（leaf id=chart-scatter）
          </p>
          <p>
            将小微企业 DSCR（债务偿付覆盖率）与 12 个月 PD 绘制为散点图，可快速识别现金流拐点。
            在 DSCR 接近或低于 1.1 的区间，PD 通常出现非线性抬升，可用于授信准入和贷后预警。
          </p>
        </div>

        <ChartWrapper title="数据散点图：DSCR 与 12M PD（按行业分层）">
          <ScatterDscrScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：为贴合“按行业分层观察”的散点表达，图中在保留 report 原始示例样本的基础上，
          按报告结论补充了行业层样本点用于展示分布结构与拐点形态。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>DSCR 从 1.18 降至 1.05、0.92 时，PD 从 3.0% 快速抬升至 6.8%、12.5%，拐点特征明显。</li>
          <li>DSCR 低于 1.0 的样本（如 0.98、0.85）集中在高风险区，适合作为重点预警与名单化管理对象。</li>
          <li>建议将 DSCR 阈值线（如 1.2）纳入授信与贷后规则，形成“准入+预警”联动机制。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
