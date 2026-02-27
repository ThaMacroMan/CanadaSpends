"use client";

import { useState, useCallback, useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Globe } from "./Globe";
import { FlowArcs } from "./FlowArcs";
import { AUTO_ROTATE_SPEED } from "./constants";

interface TaxGlobeProps {
  /** User's total federal tax in dollars */
  federalTax: number;
  /** Province slug (e.g. "ontario") */
  province: string;
}

interface TooltipState {
  label: string;
  amount: string;
  x: number;
  y: number;
  visible: boolean;
}

function GlobeScene({
  federalTax,
  province,
  onHover,
  onUnhover,
}: TaxGlobeProps & {
  onHover: (label: string, amount: string) => void;
  onUnhover: () => void;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#6366f1" />

      {/* Globe */}
      <Globe />

      {/* Flow arcs */}
      <FlowArcs
        federalTax={federalTax}
        province={province}
        onHover={onHover}
        onUnhover={onUnhover}
      />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={4}
        autoRotate
        autoRotateSpeed={AUTO_ROTATE_SPEED}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

/**
 * Main TaxGlobe component with Canvas, tooltips, and loading state.
 *
 * Drop this into any page — it manages its own Three.js Canvas context.
 */
export function TaxGlobe({ federalTax, province }: TaxGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    label: "",
    amount: "",
    x: 0,
    y: 0,
    visible: false,
  });

  const handleHover = useCallback((label: string, amount: string) => {
    // Place tooltip near mouse via pointer events on the container
    // (projecting 3D→2D requires camera access from within the Canvas).
    setTooltip({ label, amount, x: 0, y: 0, visible: true });
  }, []);

  const handleUnhover = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  // Track mouse position for tooltip placement
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (tooltip.visible && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltip((prev) => ({
          ...prev,
          x: e.clientX - rect.left + 16,
          y: e.clientY - rect.top - 10,
        }));
      }
    },
    [tooltip.visible],
  );

  // Initial camera position: looking at Canada from slightly above and to the east
  const initialCameraPosition = new THREE.Vector3(0.8, 1.2, 2.2);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px]"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{
          position: initialCameraPosition,
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <GlobeScene
            federalTax={federalTax}
            province={province}
            onHover={handleHover}
            onUnhover={handleUnhover}
          />
        </Suspense>
      </Canvas>

      {/* Tooltip overlay */}
      {tooltip.visible && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg bg-gray-900/95 px-3 py-2 text-sm text-white shadow-xl backdrop-blur-sm border border-white/10"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateY(-100%)",
          }}
        >
          <div className="font-semibold">{tooltip.label}</div>
          <div className="text-amber-300 font-mono">{tooltip.amount}</div>
        </div>
      )}
    </div>
  );
}
