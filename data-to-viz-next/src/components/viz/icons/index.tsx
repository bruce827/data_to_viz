import React from 'react';

// Common SVG props helper
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// --- Category Icons ---
export const NumericIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <path d="M4 8h16M4 16h16M8 4v16M16 4v16" />
  </svg>
);

// --- One Numeric Icons ---
export const HistogramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <rect x="3" y="12" width="4" height="8" />
    <rect x="9" y="8" width="4" height="12" />
    <rect x="15" y="14" width="4" height="6" />
    <path d="M21 20H3" />
  </svg>
);

export const GroupedHistogramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    {/* Category 1 - Solid bars */}
    <rect x="3" y="14" width="3" height="6" fill="currentColor" />
    <rect x="9" y="10" width="3" height="10" fill="currentColor" />
    <rect x="15" y="12" width="3" height="8" fill="currentColor" />
    
    {/* Category 2 - Semi-transparent bars */}
    <rect x="6" y="11" width="3" height="9" fill="currentColor" fillOpacity="0.4" />
    <rect x="12" y="7" width="3" height="13" fill="currentColor" fillOpacity="0.4" />
    <rect x="18" y="13" width="3" height="7" fill="currentColor" fillOpacity="0.4" />
    
    <path d="M21 20H3" />
  </svg>
);

export const DensityIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <path d="M2 19c2-2 4-10 10-10s8 8 10 10" />
    <path d="M2 20h20" />
  </svg>
);

export const BoxplotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <rect x="7" y="6" width="10" height="12" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="9" y1="2" x2="15" y2="2" />
    <line x1="9" y1="22" x2="15" y2="22" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
);

export const ViolinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <path d="M12 2c-3 4-4 6-4 10s1 6 4 10c3-4 4-6 4-10s-1-6-4-10z" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

// --- Two Numeric Icons ---
export const ScatterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <circle cx="5" cy="18" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="6" r="1.5" />
    <circle cx="10" cy="6" r="1.5" />
    <circle cx="16" cy="16" r="1.5" />
    <path d="M2 22h20M2 2v20" />
  </svg>
);

export const ConnectedScatterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    {/* Axes */}
    <path d="M3 3v18h18" strokeWidth="1.5" />
    
    {/* Line 1 with Points */}
    <path d="M5 16l4-8l5 4l5-9" strokeWidth="1.5" />
    <circle cx="5" cy="16" r="1" fill="currentColor" />
    <circle cx="9" cy="8" r="1" fill="currentColor" />
    <circle cx="14" cy="12" r="1" fill="currentColor" />
    <circle cx="19" cy="3" r="1" fill="currentColor" />

    {/* Line 2 with Points */}
    <path d="M5 10l5 6l6-4l3 4" strokeWidth="1.5" strokeOpacity="0.4" />
    <circle cx="5" cy="10" r="1" fill="currentColor" fillOpacity="0.4" />
    <circle cx="10" cy="16" r="1" fill="currentColor" fillOpacity="0.4" />
    <circle cx="16" cy="12" r="1" fill="currentColor" fillOpacity="0.4" />
    <circle cx="19" cy="16" r="1" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

export const LineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <path d="M3 18l6-10l7 6L21 4" />
    <path d="M2 22h20" />
  </svg>
);

export const AreaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    {/* Upper filled area (e.g. blue) */}
    <path d="M4 16 L12 8 L20 16" fill="none" strokeWidth="2" />
    <path d="M4 12 L12 20 L20 12" fill="none" strokeWidth="2" strokeOpacity="0.5" />
    {/* Intersection fill simulation */}
    <path d="M4 16 L8 12 L12 16 L4 16" fill="currentColor" fillOpacity="0.2" stroke="none" />
    <path d="M12 16 L16 20 L20 16 L12 16" fill="currentColor" fillOpacity="0.2" stroke="none" />
    <path d="M8 12 L12 8 L16 12 L8 12" fill="currentColor" fillOpacity="0.4" stroke="none" />
  </svg>
);

export const Density2DIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.1" />
    <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.3" />
    <path d="M2 22h20M2 2v20" />
  </svg>
);

export const HexbinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <path d="M8 3h8l4 7l-4 7h-8l-4-7z" />
    <path d="M2 22h20" />
  </svg>
);

// --- Several Numeric Icons ---
export const StackedAreaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    {/* Base Axis */}
    <path d="M2 22h20" strokeWidth="1.5" />
    
    {/* Bottom Layer */}
    <path d="M3 18l5-4l7 3l6-5V22H3z" fill="currentColor" fillOpacity="0.4" stroke="none" />
    <path d="M3 18l5-4l7 3l6-5" strokeWidth="1.5" />
    
    {/* Top Layer */}
    <path d="M3 12l5-4l7 3l6-5l0 6l-6-3l-7 4l-5 4z" fill="currentColor" fillOpacity="0.2" stroke="none" />
    <path d="M3 12l5-4l7 3l6-5" strokeWidth="1.5" strokeOpacity="0.6" />
  </svg>
);

export const StreamIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <path d="M2 12c4-4 8 4 12 0s8-4 8 0v2c-4 4-8-4-12 0s-8 4-12 0z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const CorrelogramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="8" cy="8" r="2" fill="currentColor" />
    <circle cx="16" cy="16" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

export const BubbleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <circle cx="7" cy="17" r="3" fill="currentColor" fillOpacity="0.2" />
    <circle cx="15" cy="12" r="5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="18" cy="5" r="2" fill="currentColor" fillOpacity="0.2" />
    <path d="M2 22h20M2 2v20" />
  </svg>
);

export const Scatter3DIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    {/* 3D Coordinate System (Perspective) */}
    <path d="M4 18l8-4M12 14v-10M12 14h10" strokeWidth="1.5" />
    <circle cx="12" cy="14" r="1" fill="currentColor" />
    
    {/* Points in 3D Space */}
    <circle cx="8" cy="10" r="1.5" fill="currentColor" />
    <circle cx="15" cy="8" r="1.5" fill="currentColor" fillOpacity="0.6" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" fillOpacity="0.4" />
    <circle cx="10" cy="6" r="1.5" fill="currentColor" fillOpacity="0.8" />
  </svg>
);

export const HeatmapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    {/* Axes */}
    <path d="M3 3v18h18" strokeWidth="1.5" />
    
    {/* Heatmap Grid */}
    <rect x="5" y="5" width="4" height="4" fill="currentColor" fillOpacity="0.8" stroke="none" />
    <rect x="10" y="5" width="4" height="4" fill="currentColor" fillOpacity="0.3" stroke="none" />
    <rect x="15" y="5" width="4" height="4" fill="currentColor" fillOpacity="0.6" stroke="none" />
    
    <rect x="5" y="10" width="4" height="4" fill="currentColor" fillOpacity="0.2" stroke="none" />
    <rect x="10" y="10" width="4" height="4" fill="currentColor" fillOpacity="0.9" stroke="none" />
    <rect x="15" y="10" width="4" height="4" fill="currentColor" fillOpacity="0.4" stroke="none" />
    
    <rect x="5" y="15" width="4" height="4" fill="currentColor" fillOpacity="0.5" stroke="none" />
    <rect x="10" y="15" width="4" height="4" fill="currentColor" fillOpacity="0.1" stroke="none" />
    <rect x="15" y="15" width="4" height="4" fill="currentColor" fillOpacity="0.7" stroke="none" />
  </svg>
);

export const PCAIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" strokeOpacity="0.3" />
    <line x1="5" y1="19" x2="19" y2="5" strokeWidth="3" />
    <line x1="9" y1="9" x2="15" y2="15" strokeOpacity="0.5" />
  </svg>
);

export const DendrogramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <path d="M4 12h4v-6h4m-4 6v6h4m4-12h4m-4 12h4" />
    <circle cx="20" cy="6" r="1" fill="currentColor" />
    <circle cx="20" cy="18" r="1" fill="currentColor" />
  </svg>
);

export const ParallelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...svgProps} {...props}>
    <line x1="4" y1="4" x2="4" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="20" y1="4" x2="20" y2="20" />
        <path d="M4 6l8 10l8-4" strokeOpacity="0.6" />
        <path d="M4 16l8-8l8 6" strokeOpacity="0.6" />
      </svg>
    );
    
    // --- Categoric Icons ---
    export const CategoricIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <rect x="4" y="4" width="6" height="6" />
        <rect x="14" y="4" width="6" height="6" />
        <rect x="4" y="14" width="6" height="6" />
        <rect x="14" y="14" width="6" height="6" />
      </svg>
    );
    
    export const BarplotIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <rect x="16" y="4" width="4" height="16" />
        <rect x="10" y="10" width="4" height="10" />
        <rect x="4" y="14" width="4" height="6" />
        <path d="M2 22h20" />
      </svg>
    );
    
    export const LollipopIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <line x1="18" y1="20" x2="18" y2="8" />
        <circle cx="18" cy="6" r="2" fill="currentColor" />
        <line x1="12" y1="20" x2="12" y2="12" />
        <circle cx="12" cy="10" r="2" fill="currentColor" />
        <line x1="6" y1="20" x2="6" y2="16" />
        <circle cx="6" cy="14" r="2" fill="currentColor" />
        <path d="M2 22h20" />
      </svg>
    );
    
    export const WordcloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        {/* Cloud outline */}
        <path d="M6.2 18h11.2c2.1 0 3.8-1.6 3.8-3.6c0-1.8-1.3-3.3-3-3.6A5.2 5.2 0 0 0 8.1 8.4A3.8 3.8 0 0 0 6.2 18z" />
        {/* Dense words with varied lengths and directions */}
        <line x1="8" y1="10.6" x2="12.8" y2="10.6" strokeWidth="1.6" />
        <line x1="13.2" y1="10.6" x2="16.8" y2="10.6" strokeWidth="1.3" strokeOpacity="0.75" />
        <line x1="8.4" y1="12.6" x2="17.2" y2="12.6" strokeWidth="1.6" strokeOpacity="0.85" />
        <line x1="8.7" y1="14.6" x2="13.4" y2="14.6" strokeWidth="1.6" strokeOpacity="0.7" />
        <line x1="13.9" y1="14.6" x2="16.6" y2="14.6" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="9.4" y1="16.2" x2="14.6" y2="16.2" strokeWidth="1.4" strokeOpacity="0.65" />
        <line x1="15.5" y1="11.2" x2="15.5" y2="16" strokeWidth="1.2" strokeOpacity="0.8" />
        <line x1="10.2" y1="11.4" x2="10.2" y2="13.8" strokeWidth="1.1" strokeOpacity="0.65" />
      </svg>
    );
    
    export const PieIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 12L12 3A9 9 0 0 1 21 12Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 12L3 12A9 9 0 0 1 12 3Z" fill="currentColor" fillOpacity="0.1" />
      </svg>
    );
    
    export const TreemapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <rect x="2" y="2" width="20" height="20" />
        <path d="M2 12h20M12 2v20M12 12h10M2 18h10" />
      </svg>
    );
    
    export const VennIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="9" cy="12" r="6" strokeOpacity="0.8" />
        <circle cx="15" cy="12" r="6" strokeOpacity="0.8" />
      </svg>
    );

    export const UpsetIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        {/* Top bars */}
        <rect x="3.5" y="4.5" width="2.8" height="3.8" rx="0.6" fill="currentColor" fillOpacity="0.35" stroke="none" />
        <rect x="8.1" y="3.1" width="2.8" height="5.2" rx="0.6" fill="currentColor" fillOpacity="0.55" stroke="none" />
        <rect x="12.7" y="1.8" width="2.8" height="6.5" rx="0.6" fill="currentColor" fillOpacity="0.8" stroke="none" />
        <rect x="17.3" y="5.1" width="2.8" height="3.2" rx="0.6" fill="currentColor" fillOpacity="0.35" stroke="none" />

        {/* Matrix background dots */}
        <circle cx="4.9" cy="12.2" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />
        <circle cx="4.9" cy="15.6" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />
        <circle cx="4.9" cy="19.0" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />

        <circle cx="9.5" cy="12.2" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />
        <circle cx="9.5" cy="15.6" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />
        <circle cx="9.5" cy="19.0" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />

        <circle cx="14.1" cy="12.2" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />
        <circle cx="14.1" cy="15.6" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />
        <circle cx="14.1" cy="19.0" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />

        <circle cx="18.7" cy="12.2" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />
        <circle cx="18.7" cy="15.6" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />
        <circle cx="18.7" cy="19.0" r="1.1" fill="currentColor" fillOpacity="0.15" stroke="none" />

        {/* Active combinations with connectors */}
        <line x1="9.5" y1="12.2" x2="9.5" y2="15.6" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.75" />
        <circle cx="9.5" cy="12.2" r="1.15" fill="currentColor" stroke="none" />
        <circle cx="9.5" cy="15.6" r="1.15" fill="currentColor" stroke="none" />

        <line x1="14.1" y1="12.2" x2="14.1" y2="19.0" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.75" />
        <circle cx="14.1" cy="12.2" r="1.15" fill="currentColor" stroke="none" />
        <circle cx="14.1" cy="15.6" r="1.15" fill="currentColor" stroke="none" />
        <circle cx="14.1" cy="19.0" r="1.15" fill="currentColor" stroke="none" />

        <circle cx="18.7" cy="19.0" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    );
    
    export const SpiderIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M12 2.5L21 8.5L17.5 21H6.5L3 8.5L12 2.5Z" strokeOpacity="0.35" />
        <path d="M12 6.5L17 10L15.5 16.5H8.5L7 10L12 6.5Z" fill="currentColor" fillOpacity="0.22" />
        <path d="M12 11.5L14.5 13.2L13.7 16H10.3L9.5 13.2L12 11.5Z" fill="currentColor" fillOpacity="0.4" stroke="none" />
        <path d="M12 11.5L12 2.5M12 11.5L21 8.5M12 11.5L17.5 21M12 11.5L6.5 21M12 11.5L3 8.5" strokeOpacity="0.2" />
      </svg>
    );
    
    export const CircularPackingIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
        <circle cx="10" cy="10" r="4" />
        <circle cx="16" cy="15" r="3" />
        <circle cx="15" cy="8" r="2" />
      </svg>
    );

    export const CircularPackingSetIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        {/* Three set groups */}
        <circle cx="8.6" cy="11" r="5.2" strokeOpacity="0.8" />
        <circle cx="15.4" cy="11" r="5.2" strokeOpacity="0.8" />
        <circle cx="12" cy="16.2" r="5.2" strokeOpacity="0.8" />
        {/* Packed points highlighting overlap region */}
        <circle cx="12" cy="11.5" r="1.6" fill="currentColor" fillOpacity="0.38" stroke="none" />
        <circle cx="9.8" cy="14.1" r="1.2" fill="currentColor" fillOpacity="0.24" stroke="none" />
        <circle cx="14.2" cy="14.1" r="1.2" fill="currentColor" fillOpacity="0.24" stroke="none" />
      </svg>
    );
    
    export const SunburstIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
        <circle cx="12" cy="12" r="9" strokeDasharray="4 4" />
      </svg>
    );
    
    // --- Num & Cat Icons ---
    export const NumCatIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <rect x="4" y="4" width="6" height="6" />
        <circle cx="17" cy="7" r="3" />
        <rect x="4" y="14" width="6" height="6" />
        <circle cx="17" cy="17" r="3" />
      </svg>
    );
    
    export const RidgelineIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        {/* Curve 1 (Back) */}
        <path d="M2 12c2-4 4-4 6 0s4 4 6 0s4-4 6 0" fill="currentColor" fillOpacity="0.2" stroke="none" />
        <path d="M2 12c2-4 4-4 6 0s4 4 6 0s4-4 6 0" strokeWidth="1.5" strokeOpacity="0.4" />
        
        {/* Curve 2 (Middle) */}
        <path d="M2 16c2-4 4-4 6 0s4 4 6 0s4-4 6 0" fill="currentColor" fillOpacity="0.4" stroke="none" />
        <path d="M2 16c2-4 4-4 6 0s4 4 6 0s4-4 6 0" strokeWidth="1.5" strokeOpacity="0.7" />
        
        {/* Curve 3 (Front) */}
        <path d="M2 20c2-4 4-4 6 0s4 4 6 0s4-4 6 0" fill="currentColor" fillOpacity="0.6" stroke="none" />
        <path d="M2 20c2-4 4-4 6 0s4 4 6 0s4-4 6 0" strokeWidth="1.5" />
      </svg>
    );    
    export const GroupedBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <rect x="3" y="10" width="3" height="10" />
        <rect x="7" y="6" width="3" height="14" fillOpacity="0.5" />
        <rect x="14" y="12" width="3" height="8" />
        <rect x="18" y="8" width="3" height="12" fillOpacity="0.5" />
        <path d="M2 22h20" />
      </svg>
    );
    
    export const StackedBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <rect x="6" y="14" width="4" height="6" />
        <rect x="6" y="8" width="4" height="5" fillOpacity="0.5" />
        <rect x="14" y="12" width="4" height="8" />
        <rect x="14" y="4" width="4" height="7" fillOpacity="0.5" />
        <path d="M2 22h20" />
      </svg>
    );

    export const FacetRectIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        {/* Top-left panel */}
        <rect x="2" y="3" width="8" height="7" rx="1" />
        <line x1="6" y1="3" x2="6" y2="10" strokeOpacity="0.45" />
        <line x1="2" y1="6.5" x2="10" y2="6.5" strokeOpacity="0.45" />
        <rect x="2.8" y="3.8" width="2.6" height="2.1" fill="currentColor" fillOpacity="0.35" stroke="none" />

        {/* Top-right panel */}
        <rect x="14" y="3" width="8" height="7" rx="1" />
        <line x1="18" y1="3" x2="18" y2="10" strokeOpacity="0.45" />
        <line x1="14" y1="6.5" x2="22" y2="6.5" strokeOpacity="0.45" />
        <rect x="18.6" y="3.8" width="2.6" height="2.1" fill="currentColor" fillOpacity="0.55" stroke="none" />

        {/* Bottom-left panel */}
        <rect x="2" y="14" width="8" height="7" rx="1" />
        <line x1="6" y1="14" x2="6" y2="21" strokeOpacity="0.45" />
        <line x1="2" y1="17.5" x2="10" y2="17.5" strokeOpacity="0.45" />
        <rect x="6.6" y="17.9" width="2.6" height="2.1" fill="currentColor" fillOpacity="0.55" stroke="none" />

        {/* Bottom-right panel */}
        <rect x="14" y="14" width="8" height="7" rx="1" />
        <line x1="18" y1="14" x2="18" y2="21" strokeOpacity="0.45" />
        <line x1="14" y1="17.5" x2="22" y2="17.5" strokeOpacity="0.45" />
        <rect x="14.8" y="17.9" width="2.6" height="2.1" fill="currentColor" fillOpacity="0.35" stroke="none" />
      </svg>
    );
    
    // --- Map Icons ---
    export const MapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M3 6l6-2l6 2l6-2v14l-6 2l-6-2l-6 2V6z" />
        <line x1="9" y1="4" x2="9" y2="20" />
        <line x1="15" y1="4" x2="15" y2="20" />
      </svg>
    );
    
    export const MapBgIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.24" />
        <path d="M5.8 9.6l2.6 2.2l-1.1 3.1l2.3 2.6" fill="none" strokeWidth="1.25" strokeOpacity="0.72" />
        <path d="M11.1 8.6l3 2.1l-0.8 3.6l2.8 2.9" fill="none" strokeWidth="1.25" strokeOpacity="0.72" />
        <path d="M16.5 8.2l2.1 2.3l-1 2.8l1.7 2.5" fill="none" strokeWidth="1.25" strokeOpacity="0.72" />
      </svg>
    );

    export const PointMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.22" />

        <path
          d="M12.1 6.1c-1.7 0-3.1 1.4-3.1 3.1c0 2.2 2.2 4.5 3.1 5.7c0.9-1.2 3.1-3.5 3.1-5.7c0-1.7-1.4-3.1-3.1-3.1z"
          fill="currentColor"
          fillOpacity="0.95"
          stroke="none"
        />
        <circle cx="12.1" cy="9.2" r="1.05" fill="#ffffff" stroke="none" />

        <path
          d="M7.2 11.8c-1.4 0-2.5 1.1-2.5 2.5c0 1.7 1.7 3.4 2.5 4.4c0.8-1 2.5-2.7 2.5-4.4c0-1.4-1.1-2.5-2.5-2.5z"
          fill="currentColor"
          fillOpacity="0.72"
          stroke="none"
        />
        <circle cx="7.2" cy="14.3" r="0.8" fill="#ffffff" stroke="none" />

        <path
          d="M17.3 10.4c-1.3 0-2.4 1.1-2.4 2.4c0 1.6 1.6 3.2 2.4 4.2c0.8-1 2.4-2.6 2.4-4.2c0-1.3-1.1-2.4-2.4-2.4z"
          fill="currentColor"
          fillOpacity="0.62"
          stroke="none"
        />
        <circle cx="17.3" cy="12.8" r="0.75" fill="#ffffff" stroke="none" />
      </svg>
    );
    
    export const ChoroplethIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.2" />
        <path d="M3.4 8.4l4.8-1.6l2.1 1.1l-2.3 4.4l-4.4 1.5z" fill="currentColor" fillOpacity="0.22" stroke="none" />
        <path d="M8.9 7.9l4.8 1.8l-0.9 4.6l-3.9 1.4l-2.1-2.2z" fill="currentColor" fillOpacity="0.78" stroke="none" />
        <path d="M14.2 8.1l4.6-1.5l1.7 1.1l-1.1 4.1l-4.3 1.7l-1.6-1.9z" fill="currentColor" fillOpacity="0.46" stroke="none" />
        <path d="M8.1 13.6l4.2-1.4l2.6 2.4l-1.3 4.3l-4.7-1.8z" fill="currentColor" fillOpacity="0.34" stroke="none" />
        <path d="M14.7 13.9l4.3-1.6l1.2 1.7l-1.5 4.4l-4.5 1.5l-1.2-1.8z" fill="currentColor" fillOpacity="0.92" stroke="none" />
      </svg>
    );

    export const MapHeatmapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        {/* Map outline */}
        <path d="M3 6l6-2l6 2l6-2v14l-6 2l-6-2l-6 2V6z" opacity="0.2" />
        <line x1="9" y1="4" x2="9" y2="20" strokeOpacity="0.25" />
        <line x1="15" y1="4" x2="15" y2="20" strokeOpacity="0.25" />

        {/* Heat spots */}
        <circle cx="8" cy="12.5" r="4.2" fill="currentColor" fillOpacity="0.24" stroke="none" />
        <circle cx="8" cy="12.5" r="2.5" fill="currentColor" fillOpacity="0.44" stroke="none" />
        <circle cx="8" cy="12.5" r="1.3" fill="currentColor" fillOpacity="0.82" stroke="none" />
        <circle cx="8" cy="12.5" r="1.1" fill="currentColor" stroke="none" />

        <circle cx="16.2" cy="9.8" r="3.4" fill="currentColor" fillOpacity="0.22" stroke="none" />
        <circle cx="16.2" cy="9.8" r="1.9" fill="currentColor" fillOpacity="0.38" stroke="none" />
        <circle cx="16.2" cy="9.8" r="0.95" fill="currentColor" fillOpacity="0.72" stroke="none" />
      </svg>
    );

    export const MapGridHeatmapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M3 6l6-2l6 2l6-2v14l-6 2l-6-2l-6 2V6z" opacity="0.2" />

        {/* grid cells with center hotspot */}
        <rect x="5.2" y="8.2" width="3.4" height="3.4" rx="0.3" fill="currentColor" fillOpacity="0.22" stroke="none" />
        <rect x="9.2" y="8.2" width="3.4" height="3.4" rx="0.3" fill="currentColor" fillOpacity="0.4" stroke="none" />
        <rect x="13.2" y="8.2" width="3.4" height="3.4" rx="0.3" fill="currentColor" fillOpacity="0.26" stroke="none" />

        <rect x="5.2" y="12.2" width="3.4" height="3.4" rx="0.3" fill="currentColor" fillOpacity="0.36" stroke="none" />
        <rect x="9.2" y="12.2" width="3.4" height="3.4" rx="0.3" fill="currentColor" fillOpacity="0.96" stroke="none" />
        <rect x="13.2" y="12.2" width="3.4" height="3.4" rx="0.3" fill="currentColor" fillOpacity="0.52" stroke="none" />

        <rect x="5.2" y="16.2" width="3.4" height="1.8" rx="0.3" fill="currentColor" fillOpacity="0.18" stroke="none" />
        <rect x="9.2" y="16.2" width="3.4" height="1.8" rx="0.3" fill="currentColor" fillOpacity="0.42" stroke="none" />
        <rect x="13.2" y="16.2" width="3.4" height="1.8" rx="0.3" fill="currentColor" fillOpacity="0.28" stroke="none" />
      </svg>
    );

    export const Map3DBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.22" />

        {/* center tall column */}
        <rect x="10.8" y="7.8" width="2.4" height="8.2" fill="currentColor" fillOpacity="0.92" stroke="none" />
        <ellipse cx="12" cy="7.8" rx="1.25" ry="0.62" fill="currentColor" />
        <ellipse cx="12" cy="16" rx="1.25" ry="0.62" fill="currentColor" fillOpacity="0.55" />

        {/* left short column */}
        <rect x="6.2" y="11.1" width="2" height="4.9" fill="currentColor" fillOpacity="0.66" stroke="none" />
        <ellipse cx="7.2" cy="11.1" rx="1.05" ry="0.52" fill="currentColor" fillOpacity="0.66" />
        <ellipse cx="7.2" cy="16" rx="1.05" ry="0.52" fill="currentColor" fillOpacity="0.38" />

        {/* right medium column */}
        <rect x="15.6" y="9.6" width="2" height="6.4" fill="currentColor" fillOpacity="0.78" stroke="none" />
        <ellipse cx="16.6" cy="9.6" rx="1.05" ry="0.52" fill="currentColor" fillOpacity="0.78" />
        <ellipse cx="16.6" cy="16" rx="1.05" ry="0.52" fill="currentColor" fillOpacity="0.45" />
      </svg>
    );

    export const Map3DFillIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.22" />

        {/* central extruded region */}
        <path d="M6.1 9.4l4.4-1.5l4.2 1.5l-4.4 1.6z" fill="currentColor" fillOpacity="0.95" stroke="none" />
        <path d="M10.5 9l4.2 1.5v4.9l-4.4 1.6v-5z" fill="currentColor" fillOpacity="0.72" stroke="none" />
        <path d="M6.1 9.4l4.4 1.6v5l-4.4-1.6z" fill="currentColor" fillOpacity="0.48" stroke="none" />

        {/* right extruded region */}
        <path d="M13.3 11.2l3.1-1.1l3 1.1l-3.1 1.1z" fill="currentColor" fillOpacity="0.88" stroke="none" />
        <path d="M16.4 11.2l3 1.1v3.6l-3.1 1.1v-3.7z" fill="currentColor" fillOpacity="0.66" stroke="none" />
        <path d="M13.3 11.2l3.1 1.1v3.7l-3.1-1.1z" fill="currentColor" fillOpacity="0.42" stroke="none" />

        {/* left-low extruded region */}
        <path d="M4.9 13.6l2.7-0.9l2.5 0.9l-2.7 1z" fill="currentColor" fillOpacity="0.82" stroke="none" />
        <path d="M7.6 13.6l2.5 0.9v2.9l-2.7 1v-3z" fill="currentColor" fillOpacity="0.62" stroke="none" />
        <path d="M4.9 13.6l2.7 1v3l-2.7-1z" fill="currentColor" fillOpacity="0.36" stroke="none" />
      </svg>
    );

    export const CompositeMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.2" />
        <circle cx="8.1" cy="13.6" r="3.4" fill="currentColor" fillOpacity="0.2" stroke="none" />
        <path d="M5.2 13.6c0.9-0.7 1.8-0.8 2.9-0.2c1.1 0.6 2 0.5 2.9-0.2" fill="none" strokeWidth="1.15" strokeOpacity="0.8" />
        <path d="M5.2 14.8c0.9-0.7 1.8-0.8 2.9-0.2c1.1 0.6 2 0.5 2.9-0.2" fill="none" strokeWidth="1.15" strokeOpacity="0.7" />

        <rect x="14.6" y="9.5" width="2.1" height="6.5" fill="currentColor" fillOpacity="0.8" stroke="none" />
        <ellipse cx="15.65" cy="9.5" rx="1.08" ry="0.5" fill="currentColor" fillOpacity="0.8" />
        <ellipse cx="15.65" cy="16" rx="1.08" ry="0.5" fill="currentColor" fillOpacity="0.45" />
      </svg>
    );
    
    export const CartogramIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.18" />
        <rect x="4" y="9.8" width="4.2" height="3.2" rx="0.55" fill="currentColor" fillOpacity="0.34" stroke="none" />
        <rect x="8.9" y="8.4" width="6.2" height="6.7" rx="0.7" fill="currentColor" fillOpacity="0.82" stroke="none" />
        <rect x="15.8" y="11.4" width="4.1" height="5.1" rx="0.55" fill="currentColor" fillOpacity="0.48" stroke="none" />
        <rect x="8.2" y="15.7" width="5.2" height="3.9" rx="0.62" fill="currentColor" fillOpacity="0.62" stroke="none" />
      </svg>
    );
    
    export const BubbleMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.22" />
        <circle cx="8.2" cy="13.2" r="2" fill="currentColor" />
        <circle cx="16.2" cy="11.4" r="4" fill="currentColor" />
      </svg>
    );
    
    export const ConnectionMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M3 6l6-2l6 2l6-2v14l-6 2l-6-2l-6 2V6z" opacity="0.2" />
        <path d="M6 16c4-4 8-8 12 0" />
        <circle cx="6" cy="16" r="1.5" fill="currentColor" />
        <circle cx="18" cy="16" r="1.5" fill="currentColor" />
      </svg>
    );

    export const PathMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.22" />
        <path d="M5.2 17l3.3-3.4l2.7 1.5l3.2-3.8l4.2 1.8" fill="none" strokeWidth="1.9" />
        <circle cx="5.2" cy="17" r="1" fill="currentColor" stroke="none" />
        <circle cx="11.2" cy="15.1" r="0.9" fill="currentColor" fillOpacity="0.85" stroke="none" />
        <circle cx="18.6" cy="13.1" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );

    export const FlowMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.22" />
        <path d="M5.5 16.5c3.2-5.8 8.8-7.2 13-3.3" fill="none" strokeWidth="2.2" />
        <path d="M16.5 11.8l2.2 1.4l-2.5 0.5z" fill="currentColor" stroke="none" />
        <path d="M6.2 18.1c3.2-2.6 6.9-2.2 10.4 0.2" fill="none" strokeWidth="1.4" strokeOpacity="0.55" />
      </svg>
    );

    export const ODMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.22" />
        <circle cx="6.3" cy="17" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="17.1" cy="9.8" r="1.2" fill="none" strokeWidth="1.7" />
        <circle cx="18.4" cy="16.1" r="1.2" fill="none" strokeWidth="1.7" />
        <path d="M7.6 16.2c2.4-3.9 5.7-5.9 8.6-6.4" fill="none" strokeWidth="1.6" />
        <path d="M7.9 17.3c2.8-0.7 5.8-0.5 9 1" fill="none" strokeWidth="1.5" strokeDasharray="1.8 1.8" />
      </svg>
    );

    export const ContourMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.22" />
        <path d="M5 16.8c1.4-1 2.8-1.5 4.5-1.2c1.8 0.3 3.2-0.1 4.8-1.1c1.7-1 3.1-1.3 4.7-1" fill="none" strokeWidth="1.3" />
        <path d="M5.3 13.9c1.4-1 2.7-1.4 4.4-1.1c1.8 0.3 3.3-0.1 4.9-1.1c1.6-1 3-1.2 4.5-0.9" fill="none" strokeWidth="1.3" strokeOpacity="0.75" />
        <path d="M5.7 11.2c1.3-0.9 2.5-1.2 4.1-0.9c1.7 0.3 3.2-0.1 4.7-1c1.4-0.8 2.8-1.1 4.1-0.8" fill="none" strokeWidth="1.3" strokeOpacity="0.55" />
      </svg>
    );

    export const GeoNetworkIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.2" />
        <line x1="7.2" y1="10.4" x2="12.3" y2="14.1" strokeWidth="1.5" />
        <line x1="12.3" y1="14.1" x2="17.6" y2="10.9" strokeWidth="1.5" />
        <line x1="7.2" y1="10.4" x2="9.1" y2="17.2" strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="9.1" y1="17.2" x2="17.6" y2="10.9" strokeWidth="1.5" strokeOpacity="0.7" />
        <circle cx="7.2" cy="10.4" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="12.3" cy="14.1" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="17.6" cy="10.9" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="9.1" cy="17.2" r="1.1" fill="currentColor" fillOpacity="0.85" stroke="none" />
      </svg>
    );
    
    export const HexbinMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M2 7l7-2.3l6 2.3l7-2.3v16l-7 2.3l-6-2.3l-7 2.3V7z" opacity="0.22" />
        <path d="M10 9.3l-2 3l2 3h4l2-3l-2-3z" fill="currentColor" fillOpacity="1" />
        <path d="M7.1 12.7l-1.4 2.1l1.4 2.1h2.8l1.4-2.1l-1.4-2.1z" fill="currentColor" fillOpacity="0.26" />
        <path d="M14.1 12.7l-1.4 2.1l1.4 2.1h2.8l1.4-2.1l-1.4-2.1z" fill="currentColor" fillOpacity="0.74" />
      </svg>
    );
    
    // --- Network Icons ---
    export const NetworkIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="10" cy="18" r="2" />
        <line x1="6" y1="6" x2="18" y2="8" />
        <line x1="6" y1="6" x2="10" y2="18" />
        <line x1="18" y1="8" x2="10" y2="18" />
      </svg>
    );
    
    export const ArcIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="4" cy="20" r="2" />
        <circle cx="12" cy="20" r="2" />
        <circle cx="20" cy="20" r="2" />
        <path d="M4 20c0-6 4-10 8-10s8 4 8 10" fill="none" />
        <path d="M4 20c0-3 2-5 4-5s4 2 4 5" fill="none" />
      </svg>
    );
    
    export const ChordIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
        <path d="M12 2c0 0 4 6 0 10" fill="none" />
        <path d="M22 12c0 0-6 4-10 0" fill="none" />
        <path d="M12 22c0 0-4-6 0-10" fill="none" />
      </svg>
    );
    
    export const SankeyIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <rect x="2" y="4" width="4" height="8" />
        <rect x="2" y="14" width="4" height="6" />
        <rect x="18" y="8" width="4" height="12" />
        <path d="M6 8c4 0 8 4 12 4" fill="none" strokeWidth="2" strokeOpacity="0.5" />
        <path d="M6 17c4 0 8-4 12-4" fill="none" strokeWidth="2" strokeOpacity="0.5" />
      </svg>
    );
    
    export const EdgeBundlingIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
        <path d="M12 2c0 8 0 8-4 8" fill="none" strokeOpacity="0.5" />
        <path d="M12 2c0 8 0 8 4 8" fill="none" strokeOpacity="0.5" />
        <circle cx="12" cy="2" r="1" />
        <circle cx="8" cy="10" r="1" />
        <circle cx="16" cy="10" r="1" />
      </svg>
    );
    
    // --- Time Icon ---
    export const TimeIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
    
