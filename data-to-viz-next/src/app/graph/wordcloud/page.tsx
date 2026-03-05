'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { WordcloudIcon } from '@/components/viz/icons';
import { WordcloudG2 } from '@/components/viz/charts/WordcloudG2';
import { WordcloudComplaintScenarioG2 } from '@/components/viz/charts/WordcloudScenarioG2';

export default function WordcloudStory() {
  const outlineItems = [
    { id: 'what-is-wordcloud', label: '什么是词云图' },
    { id: 'when-to-use-wordcloud', label: '何时使用' },
    { id: 'wordcloud-common-mistakes', label: '常见误区' },
    { id: 'wordcloud-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="词云图"
      subtitle="以字号表达主题热度，适合在大量文本中快速识别投诉焦点与治理优先级。"
      icon={WordcloudIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是词云图？" id="what-is-wordcloud">
        <p>
          词云图（Wordcloud）通过“词语大小”来编码词频或权重，帮助读者在短时间内抓住文本数据中的主导主题。
          在业务分析中，它常用于客服工单、舆情文本、用户反馈等非结构化数据的第一层筛查。
        </p>
        <p>
          对于银行消保场景，词云图可先回答“哪些问题最热”，再通过 tooltip 联动投诉量、处置时长和损失规模，
          支撑治理资源优先级排序。
        </p>
        <p>组成元素：</p>
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>词语（Words）：文本中的关键词汇，是词云图的核心元素。</li>
          <li>字体大小（Font Size）：通常与词频或重要性成正比。</li>
          <li>颜色编码（Color Encoding）：可用于区分不同类别或强调重要程度。</li>
          <li>布局算法（Layout Algorithm）：确定词语在空间中的位置分布。</li>
          <li>形状容器（Shape Container）：词云的整体轮廓，可以是矩形、圆形或自定义形状。</li>
        </ul>
        <p>英文名：Wordcloud</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <WordcloudG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-wordcloud">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要从工单、评价、热线文本中快速识别高频问题主题。</li>
          <li>需要在汇报中先给出“热点全景”，再进入结构化根因分析。</li>
          <li>需要把文本信号与风险分层结合，识别需优先治理的投诉类型。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="wordcloud-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看词频不看影响程度</h3>
            <p className="text-sm text-red-700">
              高频词不一定风险最高，需结合严重度和估算损失，避免治理资源被“高频低风险”议题占用。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">词典未清洗导致语义分裂</h3>
            <p className="text-sm text-red-700">
              同义词、口语别称和噪音词若不归并，会造成热点被分散，影响治理判断与趋势追踪。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="wordcloud-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">消保与舆情“热点词”雷达</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-1cat/chart-wordcloud（leaf id=chart-wordcloud）
          </p>
          <p>
            将客服工单、热线文本、App 评价主题抽取后，按“投诉量×严重度”生成加权热度，
            在词云中突出最值得优先治理的问题。通过 tooltip 同时展示平均结案天数与估算损失，
            支撑消保治理的优先级编排。
          </p>
        </div>

        <ChartWrapper title="数据词云图：投诉主题热度与风险分层">
          <WordcloudComplaintScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景使用 `docs/cate-deep-research-report.md` 中 `chart-wordcloud` 样例数据；
          字段可直接满足词云渲染，仅新增“投诉量×严重度”作为字号映射权重，不涉及口径变更。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>“限额/验证码”“转账失败”“存量房贷利率调整”处于高风险高热度区，应优先治理。</li>
          <li>“反诈拦截误伤”投诉量并非最高，但严重度与损失高，需单独设定策略优化通道。</li>
          <li>“APP 闪退”“人脸识别失败”等低风险词可通过自动化修复降低重复工单。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
