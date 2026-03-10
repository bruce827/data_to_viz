'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';

type DateString = string;

type TimeLineDatum = {
  date: DateString;
  successRate: number;
  event?: string;
  note: string;
};

type TimeColumnDatum = {
  week: string;
  reviewCount: number;
  stage: string;
  note: string;
};

type TimeStackedAreaDatum = {
  date: DateString;
  channel: string;
  volume: number;
};

type TimeTimelineDatum = {
  time: DateString;
  lane: string;
  severity: '提示' | '预警' | '严重';
  score: number;
  event: string;
  owner: string;
};

type TimePulseDatum = {
  time: DateString;
  score: number;
  level: '高' | '中' | '低';
  event: string;
  owner: string;
  baseline: number;
};

type TimeGanttDatum = {
  task: string;
  phase: '检测' | '切换' | '风控' | '人工' | '恢复';
  owner: string;
  startMinute: number;
  endMinute: number;
  action: string;
};

type TimeCalendarDatum = {
  week: string;
  weekday: string;
  calls: number;
  note: string;
};

type TimeSeasonalDatum = {
  weekday: string;
  week: string;
  anomalyRate: number;
};

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const TIMELINE_SEVERITY_COLORS: Record<TimeTimelineDatum['severity'], string> = {
  提示: '#3b82f6',
  预警: '#f59e0b',
  严重: '#ef4444',
};

function formatHourMinute(value: string | number | Date): string {
  const date = new Date(value);
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
}

function formatMonthDay(value: string | number | Date): string {
  const date = new Date(value);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${String(day).padStart(2, '0')}`;
}

function minuteToLabel(totalMinute: number): string {
  const baseHour = 7;
  const baseMinute = 30;
  const minutes = baseMinute + totalMinute;
  const hour = baseHour + Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

const timeLineScenarioData: TimeLineDatum[] = [
  { date: '2026-02-18', successRate: 99.74, note: '稳态运行' },
  { date: '2026-02-19', successRate: 99.71, note: '稳态运行' },
  { date: '2026-02-20', successRate: 99.69, note: '稳态运行' },
  { date: '2026-02-21', successRate: 99.64, note: '周末轻微回落' },
  { date: '2026-02-22', successRate: 99.61, note: '周末轻微回落' },
  { date: '2026-02-23', successRate: 99.58, note: '月末代发预热' },
  { date: '2026-02-24', successRate: 99.36, event: '路由排队抬升', note: '主通道延迟开始上升' },
  { date: '2026-02-25', successRate: 98.42, event: '发薪峰值冲击', note: '批量代发集中进入' },
  { date: '2026-02-26', successRate: 96.88, event: '主通道局部降级', note: '备通道开始承接' },
  { date: '2026-02-27', successRate: 97.95, event: '备通道扩容', note: '人工兜底开始下降' },
  { date: '2026-02-28', successRate: 98.86, note: '整体恢复' },
  { date: '2026-03-01', successRate: 99.24, note: '稳定回升' },
  { date: '2026-03-02', successRate: 99.51, note: '恢复常态' },
  { date: '2026-03-03', successRate: 99.67, note: '恢复常态' },
];

const timeColumnScenarioData: TimeColumnDatum[] = [
  { week: 'W1', reviewCount: 418, stage: '稳态', note: '核查量常态' },
  { week: 'W2', reviewCount: 436, stage: '稳态', note: '核查量常态' },
  { week: 'W3', reviewCount: 458, stage: '稳态', note: '渠道告警略增' },
  { week: 'W4', reviewCount: 593, stage: '冲击', note: '可疑团伙集中冒头' },
  { week: 'W5', reviewCount: 652, stage: '冲击', note: '人工核查压力达到峰值' },
  { week: 'W6', reviewCount: 541, stage: '回落', note: '策略收紧后回落' },
  { week: 'W7', reviewCount: 489, stage: '回落', note: '高风险样本减少' },
  { week: 'W8', reviewCount: 452, stage: '回落', note: '回到常态区间' },
];

const timeStackedAreaScenarioData: TimeStackedAreaDatum[] = [
  { date: '2026-02-23', channel: '主通道', volume: 122 },
  { date: '2026-02-23', channel: '备通道', volume: 18 },
  { date: '2026-02-23', channel: '人工兜底', volume: 4 },
  { date: '2026-02-24', channel: '主通道', volume: 126 },
  { date: '2026-02-24', channel: '备通道', volume: 20 },
  { date: '2026-02-24', channel: '人工兜底', volume: 4 },
  { date: '2026-02-25', channel: '主通道', volume: 114 },
  { date: '2026-02-25', channel: '备通道', volume: 34 },
  { date: '2026-02-25', channel: '人工兜底', volume: 8 },
  { date: '2026-02-26', channel: '主通道', volume: 76 },
  { date: '2026-02-26', channel: '备通道', volume: 58 },
  { date: '2026-02-26', channel: '人工兜底', volume: 18 },
  { date: '2026-02-27', channel: '主通道', volume: 88 },
  { date: '2026-02-27', channel: '备通道', volume: 52 },
  { date: '2026-02-27', channel: '人工兜底', volume: 12 },
  { date: '2026-02-28', channel: '主通道', volume: 108 },
  { date: '2026-02-28', channel: '备通道', volume: 33 },
  { date: '2026-02-28', channel: '人工兜底', volume: 7 },
  { date: '2026-03-01', channel: '主通道', volume: 118 },
  { date: '2026-03-01', channel: '备通道', volume: 24 },
  { date: '2026-03-01', channel: '人工兜底', volume: 5 },
];

const timeTimelineScenarioData: TimeTimelineDatum[] = [
  { time: '2026-02-26T07:42:00', lane: '支付路由', severity: '提示', score: 36, event: '主通道排队抬升', owner: '支付中台' },
  { time: '2026-02-26T07:48:00', lane: '短信网关', severity: '提示', score: 28, event: '回执延迟升高', owner: '消息平台' },
  { time: '2026-02-26T07:56:00', lane: '风控引擎', severity: '预警', score: 54, event: '阈值收紧', owner: '风控平台' },
  { time: '2026-02-26T08:03:00', lane: '核心清算', severity: '严重', score: 86, event: '人工接管启动', owner: '清算中心' },
  { time: '2026-02-26T08:09:00', lane: '支付路由', severity: '严重', score: 91, event: '备通道扩容', owner: '支付中台' },
  { time: '2026-02-26T08:17:00', lane: '客服热线', severity: '预警', score: 62, event: '投诉量破阈值', owner: '客服运营' },
  { time: '2026-02-26T08:26:00', lane: '核心清算', severity: '预警', score: 58, event: '人工复核退坡', owner: '清算中心' },
  { time: '2026-02-26T08:34:00', lane: '短信网关', severity: '预警', score: 48, event: '积压开始追平', owner: '消息平台' },
  { time: '2026-02-26T08:46:00', lane: '支付路由', severity: '提示', score: 34, event: '主备路由趋稳', owner: '支付中台' },
  { time: '2026-02-26T08:58:00', lane: '客服热线', severity: '提示', score: 26, event: '热线回落', owner: '客服运营' },
];

const timePulseScenarioData: TimePulseDatum[] = [
  { time: '2026-02-26T07:40:00', score: 24, level: '低', event: '主通道延迟上升', owner: '支付中台', baseline: 0 },
  { time: '2026-02-26T07:48:00', score: 38, level: '中', event: '风控阈值收紧', owner: '风控平台', baseline: 0 },
  { time: '2026-02-26T07:56:00', score: 57, level: '中', event: '投诉量突破预警', owner: '客服运营', baseline: 0 },
  { time: '2026-02-26T08:03:00', score: 82, level: '高', event: '清算人工接管', owner: '清算中心', baseline: 0 },
  { time: '2026-02-26T08:09:00', score: 94, level: '高', event: '主备切换完成', owner: '支付中台', baseline: 0 },
  { time: '2026-02-26T08:16:00', score: 68, level: '中', event: '短信积压峰值', owner: '消息平台', baseline: 0 },
  { time: '2026-02-26T08:24:00', score: 46, level: '中', event: '人工复核退坡', owner: '清算中心', baseline: 0 },
  { time: '2026-02-26T08:36:00', score: 31, level: '低', event: '通道恢复观察', owner: '支付中台', baseline: 0 },
];

const timeGanttScenarioData: TimeGanttDatum[] = [
  { task: '识别主通道排队', phase: '检测', owner: '支付中台', startMinute: 0, endMinute: 12, action: '延迟与超时监控确认' },
  { task: '切换备通道配额', phase: '切换', owner: '支付中台', startMinute: 12, endMinute: 34, action: '提高备通道承接比例' },
  { task: '收紧风险阈值', phase: '风控', owner: '风控平台', startMinute: 16, endMinute: 46, action: '减少高风险交易放行' },
  { task: '启动人工复核', phase: '人工', owner: '清算中心', startMinute: 28, endMinute: 57, action: '关键批次转人工审批' },
  { task: '清理短信积压', phase: '恢复', owner: '消息平台', startMinute: 40, endMinute: 72, action: '切换高优先级模板' },
  { task: '回切主通道', phase: '恢复', owner: '支付中台', startMinute: 58, endMinute: 88, action: '恢复主备均衡策略' },
];

function buildCalendarScenarioData(): TimeCalendarDatum[] {
  const data: TimeCalendarDatum[] = [];
  for (let week = 1; week <= 12; week += 1) {
    for (let day = 0; day < WEEKDAYS.length; day += 1) {
      const weekday = WEEKDAYS[day];
      const base = 320 + week * 8;
      const weekdayBias = [1.34, 1.08, 1.0, 1.06, 1.22, 0.74, 0.61][day];
      const salaryBoost = week === 4 || week === 8 ? (day <= 1 ? 150 : 0) : 0;
      const repaymentBoost = week === 6 || week === 10 ? (day >= 3 && day <= 4 ? 120 : 0) : 0;
      const calls = Math.round(base * weekdayBias + salaryBoost + repaymentBoost);
      const notes = [];
      if (salaryBoost > 0) notes.push('发薪窗口');
      if (repaymentBoost > 0) notes.push('还款窗口');
      if (notes.length === 0) notes.push('常态负载');
      data.push({
        week: `W${week}`,
        weekday,
        calls,
        note: notes.join(' / '),
      });
    }
  }
  return data;
}

function buildSeasonalScenarioData(): TimeSeasonalDatum[] {
  const data: TimeSeasonalDatum[] = [];
  const dayBase = [0.82, 0.76, 0.72, 0.79, 1.12, 0.48, 0.41];
  for (let week = 1; week <= 8; week += 1) {
    for (let day = 0; day < WEEKDAYS.length; day += 1) {
      const weekday = WEEKDAYS[day];
      let anomalyRate = dayBase[day] + week * 0.02;
      if (week === 5 && weekday === '周五') anomalyRate += 0.58;
      if (week === 6 && weekday === '周一') anomalyRate += 0.34;
      if (week === 7 && weekday === '周五') anomalyRate += 0.72;
      data.push({
        weekday,
        week: `W${week}`,
        anomalyRate: Number(anomalyRate.toFixed(2)),
      });
    }
  }
  return data;
}

export function TimeLinePaymentSuccessScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 54,
      paddingRight: 18,
      paddingTop: 20,
      paddingBottom: 40,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: timeLineScenarioData.map((d) => ({ ...d, date: new Date(d.date) })),
      },
      scale: {
        y: {
          domain: [96.5, 100],
        },
      },
      children: [
        {
          type: 'line',
          encode: {
            x: 'date',
            y: 'successRate',
            shape: 'smooth',
          },
          style: {
            stroke: '#2563eb',
            lineWidth: 2.6,
          },
          tooltip: {
            title: (d: TimeLineDatum & { date: Date }) => formatMonthDay(d.date),
            items: [
              { field: 'successRate', name: '支付成功率(%)' },
              { field: 'note', name: '状态说明' },
            ],
          },
        },
        {
          type: 'point',
          encode: {
            x: 'date',
            y: 'successRate',
          },
          style: {
            fill: '#2563eb',
            stroke: '#ffffff',
            lineWidth: 1.5,
            r: 4,
          },
          labels: [
            {
              text: (d: TimeLineDatum) => d.event ?? '',
              dy: -12,
              fill: '#0f172a',
              fontSize: 10,
              fontWeight: 600,
            },
          ],
          tooltip: false,
        },
      ],
      axis: {
        x: {
          title: false,
          labelFormatter: formatMonthDay,
        },
        y: {
          title: '支付成功率(%)',
        },
      },
      interaction: {
        tooltip: { shared: true },
      },
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}

export function TimeColumnFraudReviewScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 58,
      paddingRight: 18,
      paddingTop: 24,
      paddingBottom: 40,
    });

    chart.options({
      type: 'interval',
      data: {
        type: 'inline',
        value: timeColumnScenarioData,
      },
      encode: {
        x: 'week',
        y: 'reviewCount',
      },
      style: {
        fill: '#0ea5a4',
        fillOpacity: 0.9,
        radiusTopLeft: 4,
        radiusTopRight: 4,
      },
      labels: [
        {
          text: (d: TimeColumnDatum) => `${d.reviewCount}`,
          dy: -6,
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
        },
      ],
      axis: {
        x: { title: '监控周次' },
        y: { title: '人工核查工单量' },
      },
      tooltip: {
        title: (d: TimeColumnDatum) => d.week,
        items: [
          { field: 'reviewCount', name: '人工核查工单量' },
          { field: 'stage', name: '阶段' },
          { field: 'note', name: '阶段说明' },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}

export function TimeStackedAreaChannelScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 62,
      paddingRight: 20,
      paddingTop: 24,
      paddingBottom: 40,
    });

    chart.options({
      type: 'area',
      data: {
        type: 'inline',
        value: timeStackedAreaScenarioData,
      },
      transform: [{ type: 'stackY' }],
      encode: {
        x: 'date',
        y: 'volume',
        color: 'channel',
        shape: 'smooth',
      },
      scale: {
        color: {
          domain: ['主通道', '备通道', '人工兜底'],
          range: ['#2563eb', '#0ea5a4', '#f59e0b'],
        },
      },
      style: {
        fillOpacity: 0.76,
      },
      axis: {
        x: {
          title: false,
          labelFormatter: formatMonthDay,
        },
        y: {
          title: '代发流量(万笔)',
        },
      },
      legend: {
        color: {
          title: '承接通道',
          position: 'top',
        },
      },
      tooltip: {
        title: (d: TimeStackedAreaDatum) => formatMonthDay(d.date),
        items: [
          { field: 'channel', name: '承接通道' },
          { field: 'volume', name: '代发流量(万笔)' },
        ],
      },
      interaction: {
        tooltip: { shared: true },
      },
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}

export function TimeTimelineOpsScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 86,
      paddingRight: 18,
      paddingTop: 22,
      paddingBottom: 42,
    });

    chart.options({
      type: 'point',
      data: {
        type: 'inline',
        value: timeTimelineScenarioData.map((d) => ({ ...d, time: new Date(d.time) })),
      },
      encode: {
        x: 'time',
        y: 'lane',
        color: 'severity',
      },
      scale: {
        color: {
          domain: ['提示', '预警', '严重'],
          range: ['#3b82f6', '#f59e0b', '#ef4444'],
        },
      },
      style: {
        fill: (d: TimeTimelineDatum) => TIMELINE_SEVERITY_COLORS[d.severity],
        stroke: '#ffffff',
        lineWidth: 1.4,
        r: (d: TimeTimelineDatum) => 4 + ((d.score - 20) / 80) * 6,
        fillOpacity: 0.9,
      },
      labels: [
        {
          text: (d: TimeTimelineDatum) => (d.severity === '严重' ? d.event : ''),
          dy: -12,
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
        },
      ],
      axis: {
        x: {
          title: '事件时间',
          labelFormatter: formatHourMinute,
        },
        y: {
          title: false,
        },
      },
      legend: {
        color: {
          title: '事件级别',
        },
      },
      tooltip: {
        title: (d: TimeTimelineDatum & { time: Date }) => formatHourMinute(d.time),
        items: [
          { field: 'lane', name: '链路' },
          { field: 'event', name: '事件' },
          { field: 'severity', name: '级别' },
          { field: 'owner', name: '责任团队' },
          { field: 'score', name: '影响分' },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}

export function TimePulseAlertScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 58,
      paddingRight: 18,
      paddingTop: 22,
      paddingBottom: 42,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: timePulseScenarioData.map((d) => ({ ...d, time: new Date(d.time) })),
      },
      scale: {
        y: {
          domain: [0, 100],
        },
        color: {
          domain: ['高', '中', '低'],
          range: ['#ef4444', '#f59e0b', '#3b82f6'],
        },
      },
      children: [
        {
          type: 'lineY',
          data: {
            type: 'inline',
            value: [{ baseline: 0 }],
          },
          encode: { y: 'baseline' },
          style: {
            stroke: '#64748b',
            lineWidth: 1.4,
          },
          legend: false,
          tooltip: false,
        },
        {
          type: 'link',
          encode: {
            x: 'time',
            y: ['baseline', 'score'],
            color: 'level',
          },
          style: {
            lineWidth: 2.2,
            strokeOpacity: 0.92,
          },
          legend: false,
          tooltip: false,
        },
        {
          type: 'point',
          encode: {
            x: 'time',
            y: 'score',
            color: 'level',
          },
          style: {
            r: 4.8,
            stroke: '#ffffff',
            lineWidth: 1.2,
          },
          labels: [
            {
              text: (d: TimePulseDatum) => (d.score >= 70 ? d.event : ''),
              dy: -10,
              fill: '#0f172a',
              fontSize: 10,
              fontWeight: 600,
            },
          ],
          tooltip: {
            title: (d: TimePulseDatum & { time: Date }) => formatHourMinute(d.time),
            items: [
              { field: 'event', name: '事件' },
              { field: 'level', name: '等级' },
              { field: 'score', name: '强度分' },
              { field: 'owner', name: '责任团队' },
            ],
          },
        },
      ],
      axis: {
        x: {
          title: '事件时间',
          labelFormatter: formatHourMinute,
        },
        y: {
          title: '事件强度分',
        },
      },
      legend: {
        color: {
          title: '告警等级',
        },
      },
      interaction: {
        tooltip: { shared: true },
      },
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}

export function TimeGanttResponseScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 118,
      paddingRight: 18,
      paddingTop: 20,
      paddingBottom: 40,
    });

    chart.options({
      type: 'interval',
      data: {
        type: 'inline',
        value: timeGanttScenarioData,
      },
      encode: {
        x: 'task',
        y: 'startMinute',
        y1: 'endMinute',
        color: 'phase',
      },
      coordinate: {
        transform: [{ type: 'transpose' }],
      },
      scale: {
        color: {
          domain: ['检测', '切换', '风控', '人工', '恢复'],
          range: ['#3b82f6', '#0ea5a4', '#f59e0b', '#ef4444', '#6366f1'],
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
          text: (d: TimeGanttDatum) => d.phase,
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
        },
      ],
      axis: {
        x: {
          title: false,
        },
        y: {
          title: '发薪窗口时间',
          labelFormatter: (v: string | number) => minuteToLabel(Number(v)),
        },
      },
      legend: {
        color: {
          title: '任务阶段',
        },
      },
      tooltip: {
        title: (d: TimeGanttDatum) => d.task,
        items: [
          { field: 'phase', name: '阶段' },
          { field: 'owner', name: '责任团队' },
          { field: 'action', name: '执行动作' },
          { field: 'startMinute', name: '开始时间', valueFormatter: (v: number) => minuteToLabel(v) },
          { field: 'endMinute', name: '结束时间', valueFormatter: (v: number) => minuteToLabel(v) },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}

export function TimeCalendarServiceScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const data = useMemo(() => buildCalendarScenarioData(), []);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 64,
      paddingRight: 18,
      paddingTop: 24,
      paddingBottom: 40,
    });

    chart.options({
      type: 'cell',
      data: {
        type: 'inline',
        value: data,
      },
      encode: {
        x: 'week',
        y: 'weekday',
        color: 'calls',
      },
      scale: {
        color: {
          domain: [220, 700],
          range: ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8'],
        },
      },
      style: {
        stroke: '#ffffff',
        lineWidth: 1.2,
      },
      labels: [
        {
          text: (d: TimeCalendarDatum) => (d.calls >= 560 ? `${d.calls}` : ''),
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
        },
      ],
      axis: {
        x: { title: '监控周次' },
        y: { title: '星期' },
      },
      legend: {
        color: {
          title: '来电量',
        },
      },
      tooltip: {
        title: (d: TimeCalendarDatum) => `${d.week} / ${d.weekday}`,
        items: [
          { field: 'calls', name: '客服来电量' },
          { field: 'note', name: '窗口说明' },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}

export function TimeSeasonalLoginScenarioG2() {
  const data = useMemo(() => buildSeasonalScenarioData(), []);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>(
    WEEKDAYS.reduce<Record<string, HTMLDivElement | null>>((acc, day) => {
      acc[day] = null;
      return acc;
    }, {}),
  );

  useEffect(() => {
    const charts: Chart[] = [];

    WEEKDAYS.forEach((day) => {
      const container = panelRefs.current[day];
      if (!container) return;

      const dayData = data.filter((d) => d.weekday === day);

      const chart = new Chart({
        container,
        autoFit: true,
        height: 126,
        paddingLeft: 34,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 26,
      });

      chart.options({
        type: 'view',
        data: {
          type: 'inline',
          value: dayData,
        },
        children: [
          {
            type: 'line',
            encode: {
              x: 'week',
              y: 'anomalyRate',
            },
            style: {
              stroke: '#2563eb',
              lineWidth: 2,
            },
          },
          {
            type: 'point',
            encode: {
              x: 'week',
              y: 'anomalyRate',
            },
            style: {
              fill: '#2563eb',
              r: 2.8,
              stroke: '#ffffff',
              lineWidth: 1,
            },
            labels: [
              {
                text: (d: TimeSeasonalDatum) => (d.anomalyRate >= 1.7 ? `${d.anomalyRate}%` : ''),
                dy: -8,
                fill: '#0f172a',
                fontSize: 9,
                fontWeight: 600,
              },
            ],
            tooltip: false,
          },
        ],
        axis: {
          x: {
            title: false,
            tick: false,
            labelFontSize: 10,
          },
          y: {
            title: false,
            gridLineDash: [2, 2],
            labelFormatter: (v: string | number) => `${v}%`,
            labelFontSize: 10,
          },
        },
        tooltip: {
          title: (d: TimeSeasonalDatum) => `${d.weekday} / ${d.week}`,
          items: [{ field: 'anomalyRate', name: '登录异常率(%)' }],
        },
      });

      chart.render();
      charts.push(chart);
    });

    return () => {
      charts.forEach((chart) => chart.destroy());
    };
  }, [data]);

  return (
    <div className="w-full h-[344px]">
      <div className="mb-2 px-1 text-xs font-medium text-slate-600">同一星期位置在不同周次的登录异常率偏离（季节子序列）</div>
      <div className="grid h-[314px] grid-cols-4 gap-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="rounded-md border border-slate-200 bg-white p-1">
            <div className="px-1 pb-0.5 text-[11px] font-semibold text-slate-600">{day}</div>
            <div
              ref={(node) => {
                panelRefs.current[day] = node;
              }}
              className="h-[106px] w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
