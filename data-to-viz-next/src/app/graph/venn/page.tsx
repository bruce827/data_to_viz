'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { VennIcon } from '@/components/viz/icons';
import { VennG2 } from '@/components/viz/charts/VennG2';

export default function VennStory() {
  return (
    <StoryLayout
      title="Venn Diagram"
      subtitle="Use overlapping sets to show intersection and unique parts."
      icon={VennIcon}
    >
      <StorySection title="What is a Venn Diagram?">
        <p>
          A Venn diagram describes set relationships with overlapping circles.
          It is useful for explaining intersection, union, and unique subsets between categories.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <VennG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Explain overlap between two or three sets.</li>
          <li>Communicate shared vs. unique groups clearly.</li>
          <li>Present logical set relationships in a compact view.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (official venn transform):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart
  .path()
  .data({
    type: 'inline',
    value: data,
    transform: [{ type: 'venn', sets: 'sets', size: 'size', as: ['key', 'path'] }],
  })
  .encode('d', 'path')
  .encode('color', 'key');

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
