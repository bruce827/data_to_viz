'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { FlowMapIcon } from '@/components/viz/icons';
import { FlowMapL7 } from '@/components/viz/charts/FlowMapL7';
import {
  FlowMapAmlScenarioL7,
  flowMapAmlScenarioData,
} from '@/components/viz/charts/FlowMapAmlScenarioL7';

export default function FlowMapStory() {
  const outlineItems = [
    { id: 'what-is-flow-map', label: '什么是流向地图' },
    { id: 'when-to-use-flow-map', label: '何时使用' },
    { id: 'flow-map-common-mistakes', label: '常见误区' },
    { id: 'flow-map-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="流向地图"
      subtitle="用方向、起终点和线宽表达跨区域流动，适合呈现资金、物流和客流的网络化路径。"
      icon={FlowMapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是流向地图？" id="what-is-flow-map">
        <p>
          流向地图（Flow Map）用有方向的线把起点和终点连接起来，线宽、颜色或动画可以进一步表达金额、频次与风险等级。
        </p>
        <p>
          它最适合回答“从哪里流向哪里、强度多大、是否呈现扩散网络”，而不是展示单个对象的连续轨迹。
        </p>
        <p>英文名：Flow Map</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <FlowMapL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-flow-map">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要观察跨城市、跨省的资金或业务扩散路径。</li>
          <li>需要判断单个源头是否向多个落点同时分发，形成网络化风险。</li>
          <li>需要在金额、方向和风险等级三者之间建立同屏阅读关系。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="flow-map-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">把单笔流向直接当成洗钱定性</h3>
            <p className="text-sm text-red-700">
              流向图展示的是线索网络，不是最终结论。仍需结合 KYC、设备、名单和交易目的做联合判断。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">只看线条，不看源头集中度</h3>
            <p className="text-sm text-red-700">
              多笔资金从同一源头向外发散，往往比单条粗线更值得警惕；节点和边要一起读。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="flow-map-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">AML 跨省可疑资金流向图</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-line/chart-map-flow（leaf id=chart-map-flow）</p>
          <p>
            以可疑转账为明细，将起点城市、落点城市、命中规则和金额叠加在同一张图里，用于快速识别跑分与洗钱链路。
          </p>
        </div>

        <ChartWrapper title="应用场景图：跨省可疑资金流向图">
          <FlowMapAmlScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表（单位：元）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">转账ID</th>
                  <th className="px-3 py-2 text-left font-semibold">时间</th>
                  <th className="px-3 py-2 text-left font-semibold">起点</th>
                  <th className="px-3 py-2 text-left font-semibold">终点</th>
                  <th className="px-3 py-2 text-right font-semibold">金额</th>
                  <th className="px-3 py-2 text-right font-semibold">命中规则</th>
                  <th className="px-3 py-2 text-right font-semibold">风险</th>
                </tr>
              </thead>
              <tbody>
                {flowMapAmlScenarioData.map((row) => (
                  <tr key={row.transfer_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.transfer_id}</td>
                    <td className="px-3 py-2">{row.txn_time.slice(0, 16).replace('T', ' ')}</td>
                    <td className="px-3 py-2">{row.from_city}</td>
                    <td className="px-3 py-2">{row.to_city}</td>
                    <td className="px-3 py-2 text-right">{row.amount_cny.toLocaleString('zh-CN')}</td>
                    <td className="px-3 py-2 text-right">{row.rule_hits}</td>
                    <td className="px-3 py-2 text-right">{row.risk_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中 `scn_chart-map-flow_aml_suspicious_transfer_od_v1`
          的字段口径为基础，扩展到 8 条跨省转账边，形成“上海主源头 + 杭州/苏州次源头”的扩散网络。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>上海在短时间内向广州、深圳、长沙和昆明发散多笔高风险资金，是最强的源头节点。</li>
          <li>杭州与苏州虽然金额略低，但出现设备共享和多卡复用规则命中，说明网络并非单一账户行为。</li>
          <li>高风险边与中风险边交织，适合把流向图作为线索发现层，再下钻到账户—设备—商户证据链。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
