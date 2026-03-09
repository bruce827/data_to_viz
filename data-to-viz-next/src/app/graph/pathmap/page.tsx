'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { PathMapIcon } from '@/components/viz/icons';
import { PathMapL7 } from '@/components/viz/charts/PathMapL7';
import {
  PathMapVisitScenarioL7,
  pathMapVisitScenarioData,
} from '@/components/viz/charts/PathMapVisitScenarioL7';

export default function PathMapStory() {
  const outlineItems = [
    { id: 'what-is-path-map', label: '什么是路径线图' },
    { id: 'when-to-use-path-map', label: '何时使用' },
    { id: 'path-map-common-mistakes', label: '常见误区' },
    { id: 'path-map-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="路径线图"
      subtitle="按时间顺序连接轨迹点，适合呈现单次任务或单个对象的移动路径与证据留痕。"
      icon={PathMapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是路径线图？" id="what-is-path-map">
        <p>
          路径线图（Path Map）会按照时间顺序把采样点连接成一条或多条轨迹线，用来表达“怎么走、何时到、在哪停留”。
        </p>
        <p>
          它和流向图不同：路径图更强调单任务过程与真实性核验，而不是多地之间的流量网络关系。
        </p>
        <p>英文名：Path Map</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <PathMapL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-path-map">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要核查外勤走访、押品巡检、物流回访是否真的到场。</li>
          <li>需要把 GPS 打卡与照片、访谈等证据链联动起来。</li>
          <li>需要复盘单次任务的执行路径和停留点，而不是聚合看区域热度。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="path-map-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">把原始轨迹全量暴露给非必要角色</h3>
            <p className="text-sm text-red-700">
              轨迹属于敏感数据，高管层更关心任务完成度和证据闭环，不需要浏览全部个人轨迹细节。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">只看线路，不看打卡证据</h3>
            <p className="text-sm text-red-700">
              没有证据附件和打卡点的轨迹，很难支撑尽职免责；路线只能说明“经过”，不能说明“已核验”。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="path-map-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">贷后外勤走访轨迹与证据链</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-line/chart-map-path（leaf id=chart-map-path）</p>
          <p>
            以外勤采样点为明细，连线展示一次贷后走访任务的完整路径，并用打卡点标记已留证的关键核验环节。
          </p>
        </div>

        <ChartWrapper title="应用场景图：外勤走访路径地图">
          <PathMapVisitScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">时间</th>
                  <th className="px-3 py-2 text-left font-semibold">站点</th>
                  <th className="px-3 py-2 text-right font-semibold">速度(km/h)</th>
                  <th className="px-3 py-2 text-right font-semibold">是否打卡</th>
                  <th className="px-3 py-2 text-right font-semibold">证据</th>
                </tr>
              </thead>
              <tbody>
                {pathMapVisitScenarioData.map((row) => (
                  <tr key={`${row.visit_id}_${row.ts}`} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.ts.slice(0, 16).replace('T', ' ')}</td>
                    <td className="px-3 py-2">{row.site_name}</td>
                    <td className="px-3 py-2 text-right">{row.speed_kmh.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{row.checkin_flag ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-right">{row.evidence_uri_mask || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中 `scn_chart-map-path_postloan_field_visit_trace_v1`
          的字段口径为基础，扩展到 8 个轨迹采样点和 3 个打卡点，以满足一条完整走访路径的可视化表达。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>轨迹从支行出发后形成连续移动路径，中段存在两次明显停留，说明任务并非“路过式打卡”。</li>
          <li>借款人门店、仓储点和商圈回访点均已留证，适合直接纳入贷后尽职免责材料。</li>
          <li>返程前仍补采了复核点，说明走访不只验证单个门店，而是覆盖周边经营环境。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
