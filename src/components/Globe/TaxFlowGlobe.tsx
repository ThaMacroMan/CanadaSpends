"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  OTTAWA,
  type ProvinceFlow,
  type InternationalFlow,
} from "@/lib/globeFlowData";
import {
  latLonToVector3,
  createArcPoints,
  getArcWidth,
  getFlowColor,
} from "./utils";
import { loadCountryLines } from "./countryOutlines";

// ─── Constants ───────────────────────────────────────────────────────────────

const GLOBE_RADIUS = 2;
const ATMOSPHERE_RADIUS = 2.08;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GlobeFlowData {
  federalTax: number;
  provincialFlows: Array<{ province: ProvinceFlow; amount: number }>;
  internationalFlows: Array<{
    recipient: InternationalFlow;
    amount: number;
  }>;
  userProvince?: string;
  userProvinceLat?: number;
  userProvinceLon?: number;
}

interface TooltipData {
  label: string;
  amount: number;
  type: string;
  position: THREE.Vector3;
}

// ─── Country Borders ─────────────────────────────────────────────────────────

function CountryBorders() {
  const [lines, setLines] = useState<THREE.Vector3[][]>([]);

  useEffect(() => {
    loadCountryLines(GLOBE_RADIUS).then(setLines);
  }, []);

  return (
    <>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#4a4540"
          lineWidth={0.4}
          transparent
          opacity={0.5}
        />
      ))}
    </>
  );
}

// ─── Globe Mesh ──────────────────────────────────────────────────────────────

function GlobeMesh() {
  return (
    <group>
      {/* Main dark globe sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial color="#1a1815" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Subtle atmosphere glow */}
      <mesh>
        <sphereGeometry args={[ATMOSPHERE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#2c414d"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ─── Location Dot ────────────────────────────────────────────────────────────

function LocationDot({
  lat,
  lon,
  color,
  size = 0.02,
  emissive = true,
}: {
  lat: number;
  lon: number;
  color: string;
  size?: number;
  emissive?: boolean;
}) {
  const position = useMemo(
    () => latLonToVector3(lat, lon, GLOBE_RADIUS + 0.005),
    [lat, lon],
  );

  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ? color : undefined}
        emissiveIntensity={emissive ? 0.8 : 0}
      />
    </mesh>
  );
}

// ─── Pulsing Ottawa Dot ──────────────────────────────────────────────────────

function PulsingDot({
  lat,
  lon,
  color,
}: {
  lat: number;
  lon: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useMemo(
    () => latLonToVector3(lat, lon, GLOBE_RADIUS + 0.005),
    [lat, lon],
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 0.025 + Math.sin(clock.elapsedTime * 2) * 0.008;
      meshRef.current.scale.setScalar(s / 0.025);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.025, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
      />
    </mesh>
  );
}

// ─── Animated Arc ────────────────────────────────────────────────────────────

function AnimatedArc({
  start,
  end,
  color,
  width,
  speed = 1,
  onHover,
  onUnhover,
}: {
  start: { lat: number; lon: number };
  end: { lat: number; lon: number };
  color: string;
  width: number;
  speed?: number;
  onHover?: () => void;
  onUnhover?: () => void;
}) {
  const points = useMemo(
    () => createArcPoints(start, end, GLOBE_RADIUS, 0.5, 64),
    [start, end],
  );

  // Animated dash for pulse effect
  const lineRef = useRef<THREE.Line2>(null);

  // We'll animate a particle along the arc
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (particleRef.current && points.length > 0) {
      const t = (clock.elapsedTime * speed * 0.3) % 1.0;
      const idx = Math.floor(t * (points.length - 1));
      const nextIdx = Math.min(idx + 1, points.length - 1);
      const frac = t * (points.length - 1) - idx;

      const pos = new THREE.Vector3().lerpVectors(
        points[idx],
        points[nextIdx],
        frac,
      );
      particleRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      <Line
        ref={lineRef as unknown as React.Ref<THREE.Line2>}
        points={points}
        color={color}
        lineWidth={width}
        transparent
        opacity={0.6}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover?.();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onUnhover?.();
        }}
      />
      {/* Animated particle flowing along the arc */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.012 + width * 0.003, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// ─── HTML Tooltip ────────────────────────────────────────────────────────────

function GlobeTooltip({ data }: { data: TooltipData | null }) {
  if (!data) return null;

  const formattedAmount = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(data.amount);

  return (
    <Html
      position={data.position}
      center
      style={{
        pointerEvents: "none",
        transform: "translate(0, -40px)",
      }}
    >
      <div
        className="rounded-lg px-3 py-2 text-xs shadow-lg border whitespace-nowrap"
        style={{
          backgroundColor: "rgba(26, 24, 21, 0.95)",
          borderColor: "rgba(74, 69, 64, 0.5)",
          color: "#f6ebe3",
        }}
      >
        <div className="font-semibold">{data.label}</div>
        <div className="mt-0.5" style={{ color: "#A8A19B" }}>
          {formattedAmount} · {data.type}
        </div>
      </div>
    </Html>
  );
}

// ─── Auto-rotate camera ─────────────────────────────────────────────────────

function AutoRotate({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();

  useFrame(() => {
    if (enabled) {
      // Slowly rotate the camera around the Y axis
      const angle = 0.0008;
      const x =
        camera.position.x * Math.cos(angle) -
        camera.position.z * Math.sin(angle);
      const z =
        camera.position.x * Math.sin(angle) +
        camera.position.z * Math.cos(angle);
      camera.position.x = x;
      camera.position.z = z;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// ─── Main Scene ──────────────────────────────────────────────────────────────

function GlobeScene({ data }: { data: GlobeFlowData }) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute max amount for width scaling
  const maxAmount = useMemo(() => {
    const provincialMax = Math.max(
      ...data.provincialFlows.map((f) => f.amount),
      0,
    );
    const intlMax = Math.max(
      ...data.internationalFlows.map((f) => f.amount),
      0,
    );
    return Math.max(data.federalTax, provincialMax, intlMax);
  }, [data]);

  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  }, []);

  const ottawaPosition = useMemo(
    () => latLonToVector3(OTTAWA.lat, OTTAWA.lon, GLOBE_RADIUS + 0.01),
    [],
  );

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.6} />
      <pointLight position={[-5, -3, -5]} intensity={0.2} />

      <GlobeMesh />
      <CountryBorders />

      {/* Ottawa — centre dot */}
      <PulsingDot lat={OTTAWA.lat} lon={OTTAWA.lon} color="#d85b5b" />

      {/* User province → Ottawa arc */}
      {data.userProvinceLat && data.userProvinceLon && (
        <>
          <LocationDot
            lat={data.userProvinceLat}
            lon={data.userProvinceLon}
            color="#e68383"
            size={0.018}
          />
          <AnimatedArc
            start={{
              lat: data.userProvinceLat,
              lon: data.userProvinceLon,
            }}
            end={{ lat: OTTAWA.lat, lon: OTTAWA.lon }}
            color={getFlowColor("federal")}
            width={getArcWidth(data.federalTax, maxAmount, 0.5, 4.0)}
            speed={1.2}
            onHover={() =>
              setTooltip({
                label: "Your Federal Tax → Ottawa",
                amount: data.federalTax,
                type: "Federal Tax",
                position: ottawaPosition,
              })
            }
            onUnhover={() => setTooltip(null)}
          />
        </>
      )}

      {/* Ottawa → Province arcs */}
      {data.provincialFlows.map(
        ({ province, amount }) =>
          amount > 0 && (
            <group key={province.slug}>
              <LocationDot
                lat={province.lat}
                lon={province.lon}
                color="#d85b5b"
                size={0.012}
              />
              <AnimatedArc
                start={{ lat: OTTAWA.lat, lon: OTTAWA.lon }}
                end={{ lat: province.lat, lon: province.lon }}
                color={getFlowColor("provincial")}
                width={getArcWidth(amount, maxAmount, 0.3, 3.0)}
                speed={0.8 + Math.random() * 0.4}
                onHover={() =>
                  setTooltip({
                    label: `Ottawa → ${province.name}`,
                    amount,
                    type: "Provincial Transfer",
                    position: latLonToVector3(
                      province.lat,
                      province.lon,
                      GLOBE_RADIUS + 0.15,
                    ),
                  })
                }
                onUnhover={() => setTooltip(null)}
              />
            </group>
          ),
      )}

      {/* Ottawa → International arcs */}
      {data.internationalFlows.map(
        ({ recipient, amount }) =>
          amount > 0 && (
            <group key={recipient.country}>
              <LocationDot
                lat={recipient.lat}
                lon={recipient.lon}
                color="#3daed3"
                size={0.01}
              />
              <AnimatedArc
                start={{ lat: OTTAWA.lat, lon: OTTAWA.lon }}
                end={{ lat: recipient.lat, lon: recipient.lon }}
                color={getFlowColor("international")}
                width={getArcWidth(amount, maxAmount, 0.2, 2.0)}
                speed={0.5 + Math.random() * 0.5}
                onHover={() =>
                  setTooltip({
                    label: `Ottawa → ${recipient.country}`,
                    amount,
                    type: recipient.category,
                    position: latLonToVector3(
                      recipient.lat,
                      recipient.lon,
                      GLOBE_RADIUS + 0.2,
                    ),
                  })
                }
                onUnhover={() => setTooltip(null)}
              />
            </group>
          ),
      )}

      <GlobeTooltip data={tooltip} />

      <AutoRotate enabled={!isInteracting} />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        enableDamping
        dampingFactor={0.05}
        onStart={handleInteractionStart}
        onEnd={handleInteractionEnd}
      />
    </>
  );
}

// ─── Exported Component ──────────────────────────────────────────────────────

export function TaxFlowGlobe({ data }: { data: GlobeFlowData }) {
  return (
    <div className="relative w-full" style={{ height: "min(75vh, 700px)" }}>
      <Canvas
        camera={{
          position: [0, 1.5, 5],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        style={{ background: "#0f0e0d" }}
        gl={{ antialias: true, alpha: false }}
      >
        <GlobeScene data={data} />
      </Canvas>
    </div>
  );
}
