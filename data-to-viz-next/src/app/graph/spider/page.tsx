'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { SpiderIcon } from '@/components/viz/icons';
import { SpiderG2 } from '@/components/viz/charts/SpiderG2';

export default function SpiderStory() {
  return (
    <StoryLayout
      title="Radar / Spider Chart"
      subtitle="Compare multi-dimensional profiles on the same radial coordinate."
      icon={SpiderIcon}
    >
      <StorySection title="What is a Radar Chart?">
        <p>
          A radar chart maps each metric to one axis radiating from the center.
          Multiple series can be overlaid to compare strengths and weaknesses across dimensions.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <SpiderG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Compare multiple metrics for 2-4 entities.</li>
          <li>Show profile shape differences clearly.</li>
          <li>Present balanced vs. skewed performance patterns.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (polar coordinate + line/area):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'view',
  coordinate: { type: 'polar' },
  children: [
    { type: 'area', encode: { x: 'dimension', y: 'score', color: 'series' } },
    { type: 'line', encode: { x: 'dimension', y: 'score', color: 'series' } },
  ],
});

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
