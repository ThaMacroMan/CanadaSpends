import * as THREE from "three";
import { latLonToVector3 } from "./utils";

interface GeoJSONFeature {
  type: string;
  properties: { name: string };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][] | number[][][][];
  };
}

interface GeoJSONFeatureCollection {
  type: string;
  features: GeoJSONFeature[];
}

/**
 * Convert a GeoJSON FeatureCollection into arrays of THREE.Vector3 points
 * suitable for rendering as line segments on a sphere.
 *
 * Each returned array represents one continuous line (polygon ring).
 */
export function geoJsonToLines(
  geojson: GeoJSONFeatureCollection,
  radius: number,
): THREE.Vector3[][] {
  const lines: THREE.Vector3[][] = [];

  for (const feature of geojson.features) {
    const { geometry } = feature;

    if (geometry.type === "Polygon") {
      const rings = geometry.coordinates as number[][][];
      for (const ring of rings) {
        const points = ring.map(([lon, lat]) =>
          latLonToVector3(lat, lon, radius),
        );
        if (points.length > 1) lines.push(points);
      }
    } else if (geometry.type === "MultiPolygon") {
      const polygons = geometry.coordinates as number[][][][];
      for (const polygon of polygons) {
        for (const ring of polygon) {
          const points = ring.map(([lon, lat]) =>
            latLonToVector3(lat, lon, radius),
          );
          if (points.length > 1) lines.push(points);
        }
      }
    }
  }

  return lines;
}

/**
 * Fetch the simplified Natural Earth 110m GeoJSON from public assets
 * and convert to line arrays.
 */
export async function loadCountryLines(
  radius: number,
): Promise<THREE.Vector3[][]> {
  const response = await fetch("/ne_110m_countries.geojson");
  const geojson: GeoJSONFeatureCollection = await response.json();
  return geoJsonToLines(geojson, radius);
}
