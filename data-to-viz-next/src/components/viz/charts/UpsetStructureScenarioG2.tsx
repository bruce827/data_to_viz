'use client';

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import UpSetJS, { extractCombinations, ISetLike } from '@upsetjs/react';

type CreditRiskRaw = {
  date: string;
  acct: string;
  device_anomaly: boolean;
  geo_anomaly: boolean;
  mcc_risky: boolean;
  income_unverified: boolean;
  minpay_3m: boolean;
  dpd7_plus: boolean;
  loss_cny: number;
};

type UpsetElement = {
  name: string;
  sets: string[];
};

const UpSetChart = UpSetJS as unknown as React.ComponentType<Record<string, unknown>>;
const UPSET_THEME = {
  color: '#2563eb',
  textColor: '#334155',
  selectionColor: '#1d4ed8',
  hasSelectionColor: '#60a5fa',
  alternatingBackgroundColor: '#f8fafc',
  hoverHintColor: '#dbeafe',
  notMemberColor: '#cbd5e1',
  opacity: 0.92,
};

// 数据源：docs/catenum-deep-research-report.md（UPST / chart-structure-set-upset）
const scenarioRows: CreditRiskRaw[] = [
  {
    date: '2025-12-15',
    acct: 'CC001',
    device_anomaly: true,
    geo_anomaly: true,
    mcc_risky: false,
    income_unverified: true,
    minpay_3m: true,
    dpd7_plus: true,
    loss_cny: 3200,
  },
  {
    date: '2025-12-15',
    acct: 'CC002',
    device_anomaly: false,
    geo_anomaly: true,
    mcc_risky: true,
    income_unverified: false,
    minpay_3m: true,
    dpd7_plus: false,
    loss_cny: 0,
  },
  {
    date: '2025-12-15',
    acct: 'CC003',
    device_anomaly: true,
    geo_anomaly: false,
    mcc_risky: true,
    income_unverified: true,
    minpay_3m: false,
    dpd7_plus: true,
    loss_cny: 1800,
  },
  {
    date: '2025-12-15',
    acct: 'CC004',
    device_anomaly: false,
    geo_anomaly: false,
    mcc_risky: true,
    income_unverified: false,
    minpay_3m: false,
    dpd7_plus: true,
    loss_cny: 600,
  },
  {
    date: '2025-12-15',
    acct: 'CC005',
    device_anomaly: true,
    geo_anomaly: true,
    mcc_risky: true,
    income_unverified: true,
    minpay_3m: true,
    dpd7_plus: false,
    loss_cny: 0,
  },
  {
    date: '2025-12-15',
    acct: 'CC006',
    device_anomaly: false,
    geo_anomaly: true,
    mcc_risky: false,
    income_unverified: true,
    minpay_3m: false,
    dpd7_plus: true,
    loss_cny: 900,
  },
];

function toSets(row: CreditRiskRaw) {
  const sets: string[] = [];
  if (row.device_anomaly) sets.push('设备异常');
  if (row.geo_anomaly) sets.push('异地交易');
  if (row.mcc_risky) sets.push('MCC异常');
  if (row.income_unverified) sets.push('收入未核验');
  if (row.minpay_3m) sets.push('连续最低还款');
  if (row.dpd7_plus) sets.push('DPD7+');
  return sets;
}

export function UpsetStructureCreditRiskScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [containerWidth, setContainerWidth] = useState(560);
  const [selection, setSelection] = useState<ISetLike<UpsetElement> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const elements = useMemo<UpsetElement[]>(
    () =>
      scenarioRows.map((row) => ({
        name: row.acct,
        sets: toSets(row),
      })),
    [],
  );

  const { sets, combinations } = useMemo(() => extractCombinations(elements), [elements]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '420px' }}>
      {mounted ? (
        <UpSetChart
          sets={sets}
          combinations={combinations}
          width={Math.max(320, containerWidth - 4)}
          height={406}
          exportButtons={false}
          theme="light"
          color={UPSET_THEME.color}
          textColor={UPSET_THEME.textColor}
          selectionColor={UPSET_THEME.selectionColor}
          hasSelectionColor={UPSET_THEME.hasSelectionColor}
          alternatingBackgroundColor={UPSET_THEME.alternatingBackgroundColor}
          hoverHintColor={UPSET_THEME.hoverHintColor}
          notMemberColor={UPSET_THEME.notMemberColor}
          opacity={UPSET_THEME.opacity}
          selection={selection}
          onHover={setSelection}
        />
      ) : null}
    </div>
  );
}
