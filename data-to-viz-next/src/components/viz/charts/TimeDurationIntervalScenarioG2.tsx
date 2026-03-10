'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

export type TimeDurationIntervalScenarioDatum = {
  system: string;
  state: string;
  startMinute: number;
  endMinute: number;
  startLabel: string;
  endLabel: string;
  owner: string;
  impact: string;
  action: string;
};

export const timeDurationIntervalScenarioData: TimeDurationIntervalScenarioDatum[] = [
  {
    system: '实时风控引擎',
    state: '正常',
    startMinute: 0,
    endMinute: 24,
    startLabel: '07:30',
    endLabel: '07:54',
    owner: '风控平台',
    impact: '规则命中率稳定',
    action: '无',
  },
  {
    system: '实时风控引擎',
    state: '阈值收紧',
    startMinute: 24,
    endMinute: 55,
    startLabel: '07:54',
    endLabel: '08:25',
    owner: '风控平台',
    impact: '高风险交易拦截率上升',
    action: '临时下调放行阈值',
  },
  {
    system: '实时风控引擎',
    state: '恢复',
    startMinute: 55,
    endMinute: 120,
    startLabel: '08:25',
    endLabel: '09:30',
    owner: '风控平台',
    impact: '策略回到常态',
    action: '保留加强监控',
  },
  {
    system: '支付路由服务',
    state: '正常',
    startMinute: 0,
    endMinute: 18,
    startLabel: '07:30',
    endLabel: '07:48',
    owner: '支付中台',
    impact: '通道切换正常',
    action: '无',
  },
  {
    system: '支付路由服务',
    state: '降级',
    startMinute: 18,
    endMinute: 44,
    startLabel: '07:48',
    endLabel: '08:14',
    owner: '支付中台',
    impact: '部分代发请求绕行备通道',
    action: '关闭低优先级路由策略',
  },
  {
    system: '支付路由服务',
    state: '恢复',
    startMinute: 44,
    endMinute: 120,
    startLabel: '08:14',
    endLabel: '09:30',
    owner: '支付中台',
    impact: '主备路由恢复均衡',
    action: '回切主通道',
  },
  {
    system: '核心清算通道',
    state: '正常',
    startMinute: 0,
    endMinute: 31,
    startLabel: '07:30',
    endLabel: '08:01',
    owner: '清算中心',
    impact: '批量清算正常',
    action: '无',
  },
  {
    system: '核心清算通道',
    state: '人工接管',
    startMinute: 31,
    endMinute: 58,
    startLabel: '08:01',
    endLabel: '08:28',
    owner: '清算中心',
    impact: '大额代发改人工复核放行',
    action: '启动值班经理审批',
  },
  {
    system: '核心清算通道',
    state: '恢复',
    startMinute: 58,
    endMinute: 120,
    startLabel: '08:28',
    endLabel: '09:30',
    owner: '清算中心',
    impact: '批量清算恢复自动执行',
    action: '关闭人工接管',
  },
  {
    system: '短信通知网关',
    state: '正常',
    startMinute: 0,
    endMinute: 40,
    startLabel: '07:30',
    endLabel: '08:10',
    owner: '消息平台',
    impact: '通知回执正常',
    action: '无',
  },
  {
    system: '短信通知网关',
    state: '预警',
    startMinute: 40,
    endMinute: 72,
    startLabel: '08:10',
    endLabel: '08:42',
    owner: '消息平台',
    impact: '回执延迟超过 90 秒',
    action: '切换高优先级模板',
  },
  {
    system: '短信通知网关',
    state: '恢复',
    startMinute: 72,
    endMinute: 120,
    startLabel: '08:42',
    endLabel: '09:30',
    owner: '消息平台',
    impact: '通知追平积压',
    action: '恢复常规发送',
  },
];

function minuteToLabel(totalMinute: number): string {
  const baseHour = 7;
  const baseMinute = 30;
  const minutes = baseMinute + totalMinute;
  const hour = baseHour + Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function TimeDurationIntervalScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
      paddingLeft: 120,
      paddingRight: 18,
      paddingTop: 24,
      paddingBottom: 40,
    });

    chart.options({
      type: 'interval',
      data: {
        type: 'inline',
        value: timeDurationIntervalScenarioData,
      },
      encode: {
        x: 'system',
        y: 'startMinute',
        y1: 'endMinute',
        color: 'state',
      },
      coordinate: {
        transform: [{ type: 'transpose' }],
      },
      scale: {
        color: {
          domain: ['正常', '预警', '降级', '人工接管', '恢复'],
          range: ['#22c55e', '#f59e0b', '#f97316', '#ef4444', '#3b82f6'],
        },
      },
      style: {
        radiusTopLeft: 4,
        radiusTopRight: 4,
        radiusBottomLeft: 4,
        radiusBottomRight: 4,
      },
      labels: [
        {
          text: (d: TimeDurationIntervalScenarioDatum) =>
            d.endMinute - d.startMinute >= 20 ? d.state : '',
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
        },
      ],
      axis: {
        x: {
          title: false,
          labelFontSize: 11,
        },
        y: {
          title: '发薪窗口时间',
          labelFormatter: (v: string | number) => minuteToLabel(Number(v)),
        },
      },
      legend: {
        color: {
          title: '链路状态',
        },
      },
      tooltip: {
        title: (d: TimeDurationIntervalScenarioDatum) => d.system,
        items: [
          { field: 'state', name: '状态' },
          { field: 'startLabel', name: '开始时间' },
          { field: 'endLabel', name: '结束时间' },
          { field: 'owner', name: '责任团队' },
          { field: 'impact', name: '业务影响' },
          { field: 'action', name: '处置动作' },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
