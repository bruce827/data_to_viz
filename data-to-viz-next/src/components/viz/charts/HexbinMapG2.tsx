'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';
import hexbinChinaData from './demoData/hexbin-china.json';

type HexbinMapSourceDatum = {
  longitude: number;
  latitude: number;
};

type HexbinBinDatum = {
  longitude: number[];
  latitude: number[];
  count: number;
};

type HexbinCenterDatum = {
  longitude_center: number;
  latitude_center: number;
  count: number;
};

type GeoJsonPolygon = {
  type: 'Polygon';
  coordinates: number[][][];
};

type GeoJsonMultiPolygon = {
  type: 'MultiPolygon';
  coordinates: number[][][][];
};

type GeoJsonFeature = {
  geometry: GeoJsonPolygon | GeoJsonMultiPolygon;
};

type GeoJsonFeatureCollection = {
  features: GeoJsonFeature[];
};

type OutlinePolygonDatum = {
  longitude: number[];
  latitude: number[];
};

const CHINA_PROVINCE_GEOJSON_URL = '/data/maps/china-provinces-full.geojson';
function extractProvinceOutlinePolygons(geojson: GeoJsonFeatureCollection) {
  const polygons: OutlinePolygonDatum[] = [];

  geojson.features.forEach((feature) => {
    const { geometry } = feature;

    if (geometry.type === 'Polygon') {
      const outerRing = geometry.coordinates[0];
      if (!outerRing?.length) return;

      polygons.push({
        longitude: outerRing.map(([longitude]) => longitude),
        latitude: outerRing.map(([, latitude]) => latitude),
      });
      return;
    }

    geometry.coordinates.forEach((polygon) => {
      const outerRing = polygon[0];
      if (!outerRing?.length) return;

      polygons.push({
        longitude: outerRing.map(([longitude]) => longitude),
        latitude: outerRing.map(([, latitude]) => latitude),
      });
    });
  });

  return polygons;
}

export function HexbinMapG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let disposed = false;
    let chart: Chart | null = null;

    fetch(CHINA_PROVINCE_GEOJSON_URL)
      .then((response) => response.json())
      .then((geojson: GeoJsonFeatureCollection) => {
        if (disposed || !containerRef.current) return;

        const outlinePolygons = extractProvinceOutlinePolygons(geojson);

        chart = new Chart({
          container: containerRef.current,
          autoFit: true,
          height: 320,
          padding: 24,
        });

        chart.options({
          type: 'view',
          axis: false,
          legend: false,
          children: [
            {
              type: 'polygon',
              data: {
                type: 'inline',
                value: outlinePolygons,
              },
              encode: {
                x: 'longitude',
                y: 'latitude',
              },
              style: {
                fill: '#eff6ff',
                fillOpacity: 0.45,
                stroke: '#93c5fd',
                lineWidth: 0.9,
              },
              tooltip: false,
            },
            {
              type: 'point',
              data: {
                type: 'inline',
                value: hexbinChinaData,
                transform: [
                  {
                    type: 'custom',
                    callback: (data: HexbinMapSourceDatum[]) => {
                      const dv = new DataSet.View().source(data).transform({
                        type: 'bin.hexagon',
                        fields: ['longitude', 'latitude'],
                        binWidth: [2, 3],
                        as: ['longitude', 'latitude', 'count'],
                      });
                      return (dv.rows as HexbinBinDatum[]).map((row) => ({
                        longitude_center:
                          row.longitude.reduce((sum, value) => sum + value, 0) / row.longitude.length,
                        latitude_center:
                          row.latitude.reduce((sum, value) => sum + value, 0) / row.latitude.length,
                        count: row.count,
                      })) satisfies HexbinCenterDatum[];
                    },
                  },
                ],
              },
              encode: {
                x: 'longitude_center',
                y: 'latitude_center',
                color: 'count',
                size: 'count',
                shape: 'hexagon',
              },
              scale: {
                color: {
                  range: '#BAE7FF-#1890FF-#0050B3',
                },
                size: {
                  range: [10, 26],
                },
              },
              style: {
                lineWidth: 1.5,
                stroke: '#fff',
                fillOpacity: 0.95,
              },
              tooltip: {
                items: [{ field: 'count', name: '聚合点数' }],
              },
              state: {
                active: {
                  stroke: '#f97316',
                  lineWidth: 2,
                },
                inactive: { opacity: 0.8 },
              },
            },
          ],
          interaction: [{ type: 'elementHighlight' }],
        });

        chart.render();
      })
      .catch(() => {
        // 保持页面稳定。
      });

    return () => {
      disposed = true;
      if (chart) chart.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
