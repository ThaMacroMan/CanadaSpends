import * as THREE from "three";

/**
 * Convert latitude/longitude (degrees) to a THREE.Vector3 on a sphere.
 * Uses the geographic convention: lat ∈ [-90, 90], lon ∈ [-180, 180].
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * Create a smooth arc curve between two points on the globe surface.
 * The arc rises above the surface by `altitude` (fraction of radius).
 */
export function createArcPoints(
  start: { lat: number; lon: number },
  end: { lat: number; lon: number },
  radius: number,
  altitude: number = 0.25,
  segments: number = 64,
): THREE.Vector3[] {
  const startVec = latLonToVector3(start.lat, start.lon, radius);
  const endVec = latLonToVector3(end.lat, end.lon, radius);

  // Calculate the angular distance between the two points
  const angle = startVec.angleTo(endVec);

  // Scale altitude by angular distance so short arcs don't bulge too much
  const dynamicAltitude = altitude * (angle / Math.PI);

  // Create a midpoint that is elevated above the globe surface
  const mid = new THREE.Vector3()
    .addVectors(startVec, endVec)
    .multiplyScalar(0.5);
  mid.normalize().multiplyScalar(radius * (1 + dynamicAltitude + 0.15));

  // Use a quadratic bezier curve
  const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);

  return curve.getPoints(segments);
}

/**
 * Calculate line width based on dollar amount.
 * Uses a logarithmic scale to keep all flows visible while preserving
 * relative ordering. Returns a value suitable for THREE.js line width.
 *
 * @param amount - Dollar amount (user's personal share)
 * @param maxAmount - Maximum amount across all flows (for normalization)
 * @param minWidth - Minimum line width
 * @param maxWidth - Maximum line width
 */
export function getArcWidth(
  amount: number,
  maxAmount: number,
  minWidth: number = 0.3,
  maxWidth: number = 3.0,
): number {
  if (amount <= 0 || maxAmount <= 0) return minWidth;

  // Log scale: map log(amount) from [log(min), log(max)] to [minWidth, maxWidth]
  const logAmount = Math.log(Math.max(amount, 1));
  const logMax = Math.log(Math.max(maxAmount, 1));
  const logMin = Math.log(1);

  const t = logMax > logMin ? (logAmount - logMin) / (logMax - logMin) : 0;
  return minWidth + t * (maxWidth - minWidth);
}

/**
 * Generate a color for a flow based on its type and amount.
 */
export function getFlowColor(
  type: "federal" | "provincial" | "international",
): string {
  switch (type) {
    case "federal":
      return "#e68383"; // auburn.300 — taxpayer → Ottawa
    case "provincial":
      return "#d85b5b"; // auburn.500 — Ottawa → provinces
    case "international":
      return "#3daed3"; // cerulean.400 — Ottawa → world
  }
}
