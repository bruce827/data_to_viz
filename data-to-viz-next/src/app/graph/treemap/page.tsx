'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { TreemapIcon } from '@/components/viz/icons';
import { TreemapG2 } from '@/components/viz/charts/TreemapG2';

export default function TreemapStory() {
  return (
    <StoryLayout
      title="Treemap"
      subtitle="Use nested rectangles to show hierarchical part-to-whole relationships."
      icon={TreemapIcon}
    >
      <StorySection title="What is a Treemap?">
        <p>
          A treemap displays hierarchical data using nested rectangles.
          Rectangle area represents magnitude, making it efficient for comparing many categories within levels.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <TreemapG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Show hierarchy and composition at the same time.</li>
          <li>Compare many categories where bar charts become crowded.</li>
          <li>Highlight dominant groups and subgroups quickly.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (treemap mark):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'treemap',
  data: { value: data },
  encode: { value: 'value' },
  layout: { tile: 'treemapSquarify' },
});

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
