declare module 'topojson-client' {
  export function feature(
    topology: { objects: Record<string, unknown> },
    object: unknown,
  ): { features: unknown[] };
}
