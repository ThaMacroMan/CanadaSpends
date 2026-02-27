"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { GLOBE_RADIUS, GLOBE_SEGMENTS, COLORS } from "./constants";

/**
 * Atmosphere glow — a slightly larger, semi-transparent sphere with a custom
 * shader that fades from the globe color at the center to the atmosphere color
 * at the edges (fresnel-like effect).
 */
function Atmosphere() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uColor: { value: COLORS.atmosphere },
      uGlowStrength: { value: 0.6 },
    }),
    [],
  );

  return (
    <mesh>
      <sphereGeometry
        args={[GLOBE_RADIUS * 1.015, GLOBE_SEGMENTS, GLOBE_SEGMENTS]}
      />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uGlowStrength;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec3 viewDir = normalize(-vPosition);
            float fresnel = 1.0 - dot(viewDir, vNormal);
            fresnel = pow(fresnel, 3.0);
            gl_FragColor = vec4(uColor, fresnel * uGlowStrength);
          }
        `}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Subtle latitude/longitude grid lines rendered as a wireframe overlay.
 */
function GridLines() {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const r = GLOBE_RADIUS * 1.001;

    // Latitude lines every 30°
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180);
      for (let lng = 0; lng <= 360; lng += 2) {
        const theta = lng * (Math.PI / 180);
        points.push(
          new THREE.Vector3(
            -(r * Math.sin(phi) * Math.cos(theta)),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta),
          ),
        );
      }
      // break segment — NaN signals line break to BufferGeometry line strips
    }

    // Longitude lines every 30°
    for (let lng = 0; lng < 360; lng += 30) {
      const theta = lng * (Math.PI / 180);
      for (let lat = -90; lat <= 90; lat += 2) {
        const phi = (90 - lat) * (Math.PI / 180);
        points.push(
          new THREE.Vector3(
            -(r * Math.sin(phi) * Math.cos(theta)),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta),
          ),
        );
      }
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={COLORS.gridLine} transparent opacity={0.15} />
    </lineSegments>
  );
}

/**
 * The main Earth globe — a dark sphere with atmosphere glow and grid overlay.
 */
export function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);

  // Subtle pulse — very slight scale oscillation
  useFrame(({ clock }) => {
    if (globeRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.001;
      globeRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      {/* Main globe sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[GLOBE_RADIUS, GLOBE_SEGMENTS, GLOBE_SEGMENTS]} />
        <meshStandardMaterial
          color={COLORS.globeBase}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Grid overlay */}
      <GridLines />

      {/* Atmospheric glow */}
      <Atmosphere />
    </group>
  );
}
