'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { PieIcon } from '@/components/viz/icons';
import { PieG2 } from '@/components/viz/charts/PieG2';

export default function PieStory() {
  return (
    <StoryLayout
      title="Pie Chart"
      subtitle="Show part-to-whole composition for a small number of categories."
      icon={PieIcon}
    >
      <StorySection title="What is a Pie Chart?">
        <p>
          A pie chart represents the proportion of each category within a whole.
          It is most effective when category count is small and differences are visually clear.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <PieG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Show percentage composition of one total.</li>
          <li>Compare a few categories (typically less than 6).</li>
          <li>Communicate quick, high-level share distribution.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (interval + stackY + theta):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart
  .interval()
  .data(data)
  .transform({ type: 'stackY' })
  .coordinate({ type: 'theta' })
  .encode('y', 'value')
  .encode('color', 'type');

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
