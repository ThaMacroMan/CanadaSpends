"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  buildArcCurve,
  latLngToVector3,
  ARC_SEGMENTS,
  ARC_DRAW_DURATION,
  ARC_MIN_RADIUS,
  ARC_MAX_RADIUS,
  GLOBE_RADIUS,
  DOT_RADIUS,
} from "./constants";

interface ArcLineProps {
  /** Start point latitude */
  startLat: number;
  /** Start point longitude */
  startLng: number;
  /** End point latitude */
  endLat: number;
  /** End point longitude */
  endLng: number;
  /** Color of the arc */
  color: THREE.Color;
  /** Thickness factor 0..1, linearly mapped to min/max radius */
  thickness: number;
  /** Delay in seconds before the arc starts animating in */
  delay?: number;
  /** Label for the destination (used for tooltip) */
  label: string;
  /** Dollar amount formatted for tooltip */
  amount: string;
  /** Callback when hovered */
  onHover?: (label: string, amount: string) => void;
  /** Callback when unhovered */
  onUnhover?: () => void;
}

/**
 * A single animated arc between two lat/lng points on the globe.
 *
 * The arc is rendered as a TubeGeometry whose drawRange is animated to create
 * a "drawing" effect. A glowing particle travels along the tube to indicate
 * the direction of money flow.
 */
export function ArcLine({
  startLat,
  startLng,
  endLat,
  endLng,
  color,
  thickness,
  delay = 0,
  label,
  amount,
  onHover,
  onUnhover,
}: ArcLineProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);
  const startedRef = useRef(false);
  const elapsedRef = useRef(0);

  const { curve, tubeGeo, totalIndices, endDot } = useMemo(() => {
    const start = latLngToVector3(startLat, startLng);
    const end = latLngToVector3(endLat, endLng);
    const c = buildArcCurve(start, end);

    const radius =
      ARC_MIN_RADIUS + thickness * (ARC_MAX_RADIUS - ARC_MIN_RADIUS);
    const tube = new THREE.TubeGeometry(c, ARC_SEGMENTS, radius, 6, false);

    return {
      curve: c,
      tubeGeo: tube,
      totalIndices: tube.index ? tube.index.count : 0,
      endDot: end,
    };
  }, [startLat, startLng, endLat, endLng, thickness]);

  // Animate draw-in and particle
  useFrame((_, delta) => {
    elapsedRef.current += delta;

    if (elapsedRef.current < delay) return;
    if (!startedRef.current) {
      startedRef.current = true;
      progressRef.current = 0;
    }

    // Draw progress
    progressRef.current = Math.min(
      progressRef.current + delta / ARC_DRAW_DURATION,
      1,
    );
    const drawCount = Math.floor(progressRef.current * totalIndices);

    if (meshRef.current && meshRef.current.geometry.index) {
      meshRef.current.geometry.setDrawRange(0, drawCount);
    }

    // Particle position along the curve
    if (particleRef.current && progressRef.current > 0) {
      // Cycle the particle along the drawn portion
      const cycleT = (elapsedRef.current - delay) * 0.4;
      const t = Math.min(cycleT % 1, progressRef.current);
      const pos = curve.getPoint(t);
      particleRef.current.position.copy(pos);
      particleRef.current.visible = progressRef.current > 0.05;

      // Pulse scale
      const pulse = 1 + Math.sin(elapsedRef.current * 6) * 0.3;
      const particleSize = DOT_RADIUS * 1.5 * pulse;
      particleRef.current.scale.setScalar(particleSize / DOT_RADIUS);
    }
  });

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (onHover) {
      onHover(label, amount);
    }
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    if (onUnhover) onUnhover();
    document.body.style.cursor = "auto";
  };

  return (
    <group>
      {/* Arc tube */}
      <mesh
        ref={meshRef}
        geometry={tubeGeo}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial color={color} transparent opacity={0.85} />
      </mesh>

      {/* Flowing particle */}
      <mesh ref={particleRef} visible={false}>
        <sphereGeometry args={[DOT_RADIUS, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={1} />
      </mesh>

      {/* End-point dot */}
      <mesh position={endDot.clone().multiplyScalar(1 + 0.002 / GLOBE_RADIUS)}>
        <sphereGeometry args={[DOT_RADIUS * 0.8, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
