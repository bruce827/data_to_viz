'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { HistogramIcon } from '@/components/viz/icons';
import { HistogramG2 } from '@/components/viz/charts/HistogramG2';

export default function HistogramStory() {
  return (
    <StoryLayout
      title="Histogram"
      subtitle="An accurate representation of the distribution of numerical data."
      icon={HistogramIcon}
    >
      <StorySection title="What is a Histogram?">
        <p>
          A histogram is an approximate representation of the distribution of numerical data. 
          It was first introduced by Karl Pearson. To construct a histogram, the first step is to &quot;bin&quot; (or &quot;bucket&quot;) 
          the range of values—that is, divide the entire range of values into a series of intervals—and then count 
          how many values fall into each interval.
        </p>
        <p>
          The bins are usually specified as consecutive, non-overlapping intervals of a variable. 
          The bins (intervals) must be adjacent, and are often (but not required to be) of equal size.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <HistogramG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <p>
          Histograms are great for showing the general distribution of a variable. 
          They help you answer questions like:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>What is the most common value? (Mode)</li>
          <li>Is the data symmetrical or skewed?</li>
          <li>Are there outliers?</li>
          <li>What is the range of the data?</li>
        </ul>
      </StorySection>

      <StorySection title="Common Mistakes">
        <div className="grid md:grid-cols-2 gap-6">
           <div className="bg-red-50 p-6 rounded-lg border border-red-100">
              <h3 className="font-bold text-red-800 mb-2">Bin size too large</h3>
              <p className="text-sm text-red-700">
                 If the bin size is too large, you lose detail and might miss important patterns or multiple modes in the data.
              </p>
           </div>
           <div className="bg-red-50 p-6 rounded-lg border border-red-100">
              <h3 className="font-bold text-red-800 mb-2">Bin size too small</h3>
              <p className="text-sm text-red-700">
                 If the bin size is too small, the histogram becomes too noisy, showing random fluctuations rather than the underlying trend.
              </p>
           </div>
        </div>
      </StorySection>

      <StorySection title="Implementation">
         <p>Here is how you can implement a basic histogram using AntV G2:</p>
         <CodeBlock 
           language="typescript" 
           code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart
  .rect()
  .data(data)
  .encode('x', 'value')
  .encode('y', 'count')
  .transform({ type: 'binX', y: 'count' });

chart.render();
           `} 
         />
      </StorySection>
    </StoryLayout>
  );
}
