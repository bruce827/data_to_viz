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
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
    
    export const ChoroplethIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M3 6h6v6h-6z" fillOpacity="0.2" />
        <path d="M9 6h6v6h-6z" fillOpacity="0.8" />
        <path d="M15 6h6v6h-6z" fillOpacity="0.4" />
        <path d="M3 12h6v6h-6z" fillOpacity="0.6" />
        <path d="M9 12h6v6h-6z" fillOpacity="0.3" />
        <path d="M15 12h6v6h-6z" fillOpacity="0.9" />
      </svg>
    );
    
    export const CartogramIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <circle cx="6" cy="6" r="4" fillOpacity="0.2" />
        <circle cx="16" cy="8" r="6" fillOpacity="0.4" />
        <circle cx="8" cy="16" r="5" fillOpacity="0.3" />
      </svg>
    );
    
    export const BubbleMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M3 6l6-2l6 2l6-2v14l-6 2l-6-2l-6 2V6z" opacity="0.2" />
        <circle cx="8" cy="12" r="2" fill="currentColor" />
        <circle cx="16" cy="10" r="4" fill="currentColor" />
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
    
    export const HexbinMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...svgProps} {...props}>
        <path d="M3 6l6-2l6 2l6-2v14l-6 2l-6-2l-6 2V6z" opacity="0.2" />
        <path d="M10 8l-2 3l2 3h4l2-3l-2-3z" fill="currentColor" />
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
    
