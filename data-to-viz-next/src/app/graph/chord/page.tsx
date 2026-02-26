'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { ChordIcon } from '@/components/viz/icons';
import { ChordG2 } from '@/components/viz/charts/ChordG2';

export default function ChordStory() {
  return (
    <StoryLayout
      title="Chord Diagram"
      subtitle="Use circular ribbons to show relationships and flow intensity between groups."
      icon={ChordIcon}
    >
      <StorySection title="What is a Chord Diagram?">
        <p>
          A chord diagram places groups around a circle and connects them with ribbons.
          Ribbon width represents relationship strength, making pairwise connections easy to compare.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <ChordG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Show bilateral relationships among multiple categories.</li>
          <li>Compare intensity of flows in a compact circular layout.</li>
          <li>Analyze collaboration, transition, or transfer networks.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (official chord mark):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'chord',
  data: { value: { links: data } },
  layout: { nodeWidthRatio: 0.05 },
});

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
