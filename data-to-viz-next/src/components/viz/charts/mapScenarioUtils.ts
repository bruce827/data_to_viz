import type { Scene as L7Scene } from '@antv/l7';

export const CHINA_PROVINCE_GEOJSON_URL = '/data/maps/china-provinces-full.geojson';

type FeatureLike = {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: unknown;
};

type FeatureCollectionLike = {
  type: 'FeatureCollection';
  features: FeatureLike[];
  [key: string]: unknown;
};

export function applyAmapSecurityConfig() {
  const amapSecurityJsCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE;
  if (!amapSecurityJsCode || typeof window === 'undefined') return;

  (window as Window & { _AMapSecurityConfig?: { securityJsCode: string } })._AMapSecurityConfig = {
    securityJsCode: amapSecurityJsCode,
  };
}

function normalizeAdcode(value: unknown) {
  return String(value ?? '').replace(/\.0$/, '');
}

export async function loadChinaProvinceFeatureCollection<T extends Record<string, unknown>>(
  records: T[],
  codeField: keyof T,
) {
  const response = await fetch(CHINA_PROVINCE_GEOJSON_URL);
  if (!response.ok) {
    throw new Error(`Failed to load province geojson: ${response.status}`);
  }
  const geojson = (await response.json()) as FeatureCollectionLike;
  const recordMap = new Map(records.map((record) => [normalizeAdcode(record[codeField]), record]));
  const features: FeatureLike[] = [];

  (geojson.features ?? []).forEach((feature) => {
    const adcode = normalizeAdcode(feature.properties?.adcode);
    const record = recordMap.get(adcode);
    if (!record) return;

    features.push({
      ...feature,
      properties: {
        ...feature.properties,
        ...record,
        adcode,
      },
    });
  });

  return {
    ...geojson,
    features,
  } satisfies FeatureCollectionLike;
}

export function destroyScene(sceneRef: { current: L7Scene | null }) {
  if (!sceneRef.current) return;
  sceneRef.current.destroy();
  sceneRef.current = null;
}
