import * as THREE from "three";

// ── Globe geometry ─────────────────────────────────────────────────────────────

export const GLOBE_RADIUS = 1;
export const GLOBE_SEGMENTS = 64;

/** How high arcs peak above the globe surface, as a fraction of globe radius.
 *  Shorter arcs (domestic) get less altitude; longer arcs (international) get more. */
export const ARC_MIN_ALTITUDE = 0.08;
export const ARC_MAX_ALTITUDE = 0.55;

/** Number of interpolation points per arc curve */
export const ARC_SEGMENTS = 64;

// ── Colors ─────────────────────────────────────────────────────────────────────

export const COLORS = {
  /** User → Ottawa (total federal tax) */
  taxToOttawa: new THREE.Color("#c0392b"),
  /** Ottawa → provinces (domestic transfers) */
  domesticTransfer: new THREE.Color("#e07040"),
  /** Ottawa → international (aid / GAC) */
  internationalAid: new THREE.Color("#f0a030"),

  /** Globe surface — dark navy */
  globeBase: new THREE.Color("#111827"),
  /** Land mass fill */
  land: new THREE.Color("#1e293b"),
  /** Subtle grid / wireframe */
  gridLine: new THREE.Color("#334155"),
  /** Atmosphere glow */
  atmosphere: new THREE.Color("#3b82f6"),
  /** Dot on globe where arcs land */
  dotDefault: new THREE.Color("#94a3b8"),

  /** Ottawa dot */
  ottawaDot: new THREE.Color("#ef4444"),
} as const;

// ── Animation ──────────────────────────────────────────────────────────────────

/** Duration (seconds) for an arc to fully draw in */
export const ARC_DRAW_DURATION = 2.0;
/** Duration (seconds) of the flowing-particle cycle along an arc */
export const PARTICLE_CYCLE_DURATION = 3.0;
/** Auto-rotate speed (radians/sec). Positive = left-to-right */
export const AUTO_ROTATE_SPEED = 0.15;

// ── Sizing ─────────────────────────────────────────────────────────────────────

/** Min/max tube radius for arc thickness, in world units */
export const ARC_MIN_RADIUS = 0.003;
export const ARC_MAX_RADIUS = 0.018;

/** Dot radius on globe surface */
export const DOT_RADIUS = 0.012;

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Convert latitude/longitude (degrees) to a 3D position on a sphere of the
 * given radius, using Three.js coordinate conventions (Y-up).
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = GLOBE_RADIUS,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Build a quadratic bezier arc between two surface points on the globe.
 * The arc peaks above the surface proportional to the great-circle distance.
 */
export function buildArcCurve(
  start: THREE.Vector3,
  end: THREE.Vector3,
  altitudeFraction?: number,
): THREE.QuadraticBezierCurve3 {
  // Great-circle angle between the two points (in radians)
  const angle = start.angleTo(end);

  // Altitude scales with distance, clamped between min and max
  const t = Math.min(angle / Math.PI, 1);
  const altitude =
    altitudeFraction ??
    ARC_MIN_ALTITUDE + t * (ARC_MAX_ALTITUDE - ARC_MIN_ALTITUDE);

  // Midpoint on the sphere surface
  const mid = new THREE.Vector3()
    .addVectors(start, end)
    .normalize()
    .multiplyScalar(GLOBE_RADIUS);

  // Push midpoint outward to create the arc peak
  const control = mid.clone().multiplyScalar(1 + altitude);

  return new THREE.QuadraticBezierCurve3(start, control, end);
}
