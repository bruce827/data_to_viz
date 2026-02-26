'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { SankeyIcon } from '@/components/viz/icons';
import { SankeyG2 } from '@/components/viz/charts/SankeyG2';

export default function SankeyStory() {
  return (
    <StoryLayout
      title="Sankey Diagram"
      subtitle="Use flow bands to show movement and conversion between stages."
      icon={SankeyIcon}
    >
      <StorySection title="What is a Sankey Diagram?">
        <p>
          A sankey diagram visualizes how quantity moves from sources to targets.
          Link thickness represents flow magnitude, which is useful for path and conversion analysis.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <SankeyG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Explain stage-by-stage conversion funnels.</li>
          <li>Show where flow splits, merges, or drops.</li>
          <li>Compare dominant paths in process or traffic data.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (official sankey mark):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'sankey',
  data: { value: { links: data } },
  layout: { nodeAlign: 'justify' },
});

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
