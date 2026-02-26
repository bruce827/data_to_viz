'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { LollipopIcon } from '@/components/viz/icons';
import { LollipopG2 } from '@/components/viz/charts/LollipopG2';

export default function LollipopStory() {
  return (
    <StoryLayout
      title="Lollipop Chart"
      subtitle="A cleaner alternative to barplot for category comparison."
      icon={LollipopIcon}
    >
      <StorySection title="What is a Lollipop Chart?">
        <p>
          A lollipop chart uses a thin line and a point to represent each category value.
          It keeps the same comparison power as a barplot, while reducing visual weight and clutter.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <LollipopG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>You want to compare categories with a lighter visual style.</li>
          <li>You need to display ranking without heavy filled bars.</li>
          <li>You want to emphasize endpoints (exact values).</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (interval stem + point head):</p>
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
  data: { value: data },
  coordinate: { transform: [{ type: 'transpose' }] },
  children: [
    { type: 'interval', encode: { x: 'category', y: 'value' } },
    { type: 'point', encode: { x: 'category', y: 'value' } },
  ],
});

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
