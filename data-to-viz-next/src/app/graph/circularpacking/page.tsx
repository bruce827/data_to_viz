'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { CircularPackingIcon } from '@/components/viz/icons';
import { CircularPackingG2 } from '@/components/viz/charts/CircularPackingG2';
import { CircularPackingSetG2 } from '@/components/viz/charts/CircularPackingSetG2';

export default function CircularPackingStory() {
  return (
    <StoryLayout
      title="Circular Packing"
      subtitle="Use nested circles to represent hierarchy or grouped set structures."
      icon={CircularPackingIcon}
    >
      <StorySection title="What is Circular Packing?">
        <p>
          Circular packing arranges circles by size in a compact layout.
          It is useful for showing hierarchy while preserving an organic, area-based visual form.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (Hierarchy)">
        <CircularPackingG2 />
      </ChartWrapper>

      <ChartWrapper title="Interactive Demo (Set-style Grouping)">
        <CircularPackingSetG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Show parent-child structure with emphasis on relative size.</li>
          <li>Display grouped categories in a compact circular layout.</li>
          <li>Present alternative hierarchy view to treemap.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (official pack mark):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'pack',
  data: { value: data },
  encode: { value: 'value' },
  layout: { padding: 3 },
});

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
