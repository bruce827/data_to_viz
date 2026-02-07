'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { ScatterIcon } from '@/components/viz/icons';
import { ScatterG2 } from '@/components/viz/charts/ScatterG2';

export default function ScatterStory() {
  return (
    <StoryLayout
      title="Scatter Plot"
      subtitle="Display the relationship between two numerical variables."
      icon={ScatterIcon}
    >
      <StorySection title="What is a Scatter Plot?">
        <p>
          A scatter plot uses dots to represent values for two different numeric variables. 
          The position of each dot on the horizontal and vertical axis indicates values for an individual data point.
          Scatter plots are used to observe relationships between variables.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <ScatterG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <p>
          Scatter plots are ideal for visualizing correlations:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Positive correlation: as x increases, y increases.</li>
          <li>Negative correlation: as x increases, y decreases.</li>
          <li>Clustering: identifying distinct groups in the data.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
         <p>AntV G2 code example:</p>
         <CodeBlock 
           language="typescript" 
           code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart
  .point()
  .data(data)
  .encode('x', 'height')
  .encode('y', 'weight')
  .encode('color', 'gender');

chart.render();
           `} 
         />
      </StorySection>
    </StoryLayout>
  );
}
