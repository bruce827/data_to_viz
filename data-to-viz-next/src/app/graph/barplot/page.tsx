'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { BarplotIcon } from '@/components/viz/icons';
import { BarplotG2 } from '@/components/viz/charts/BarplotG2';

export default function BarplotStory() {
  return (
    <StoryLayout
      title="Barplot"
      subtitle="Use bars to compare values across categories."
      icon={BarplotIcon}
    >
      <StorySection title="What is a Barplot?">
        <p>
          A barplot is one of the most effective charts for comparing magnitudes across discrete categories.
          Each bar length is proportional to its corresponding value, so differences are easy to read quickly.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <BarplotG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Compare values between categories.</li>
          <li>Highlight rank order (largest to smallest).</li>
          <li>Display a small-to-medium number of categorical items clearly.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (interval + transpose):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'interval',
  data: { value: data },
  encode: { x: 'category', y: 'value' },
  coordinate: { transform: [{ type: 'transpose' }] },
});

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
