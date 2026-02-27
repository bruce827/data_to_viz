'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import UpSetJS, { extractCombinations, ISetLike } from '@upsetjs/react';
import upsetData from './demoData/UpsetSetRelationG2.json';

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
  opacity: 0.9,
};

export function UpsetSetRelationG2() {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const elements = useMemo<UpsetElement[]>(() => {
    return upsetData.intersections.flatMap((intersection) =>
      Array.from({ length: intersection.value }, (_, index) => ({
        name: `${intersection.id}-${index + 1}`,
        sets: intersection.sets,
      })),
    );
  }, []);

  const { sets, combinations } = useMemo(
    () => extractCombinations(elements),
    [elements],
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '380px' }}>
      <UpSetChart
        sets={sets}
        combinations={combinations}
        width={Math.max(320, containerWidth - 4)}
        height={368}
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
    </div>
  );
}
