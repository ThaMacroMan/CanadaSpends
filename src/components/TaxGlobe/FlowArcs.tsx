"use client";

import { useMemo } from "react";
import {
  OTTAWA,
  DOMESTIC_FLOWS,
  INTERNATIONAL_FLOWS,
  PROVINCE_CAPITALS,
  TOTAL_INTERNATIONAL_AFFAIRS_PERCENTAGE,
  TOTAL_BILATERAL_AID_MILLIONS,
} from "@/lib/globeFlowData";
import { ArcLine } from "./ArcLine";
import { COLORS, DOT_RADIUS, latLngToVector3 } from "./constants";

interface FlowArcsProps {
  /** User's total federal tax in dollars */
  federalTax: number;
  /** Province slug (e.g. "ontario") — used for the user→Ottawa arc origin */
  province: string;
  /** Callback for arc hover tooltip */
  onHover?: (label: string, amount: string) => void;
  /** Callback for arc unhover */
  onUnhover?: () => void;
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return `$${Math.round(amount).toLocaleString()}`;
}

/**
 * Renders all money-flow arcs on the globe:
 * 1. User location → Ottawa (thick, red)
 * 2. Ottawa → each province/territory (medium, orange)
 * 3. Ottawa → international countries (thin, amber)
 */
export function FlowArcs({
  federalTax,
  province,
  onHover,
  onUnhover,
}: FlowArcsProps) {
  // Determine the user's city for the first arc
  const userLocation = useMemo(() => {
    return PROVINCE_CAPITALS[province] || PROVINCE_CAPITALS["ontario"];
  }, [province]);

  // Compute how much of the user's tax goes to international affairs
  const internationalTotal =
    (federalTax * TOTAL_INTERNATIONAL_AFFAIRS_PERCENTAGE) / 100;

  // Compute max domestic percentage for thickness normalization
  const maxDomesticPct = useMemo(
    () => Math.max(...DOMESTIC_FLOWS.map((f) => f.percentage)),
    [],
  );

  // Compute max international amount for thickness normalization
  const maxIntlAmount = useMemo(
    () => Math.max(...INTERNATIONAL_FLOWS.map((f) => f.amountMillions)),
    [],
  );

  return (
    <group>
      {/* Ottawa dot — bright red marker */}
      <mesh position={latLngToVector3(OTTAWA.lat, OTTAWA.lng, 1.003)}>
        <sphereGeometry args={[DOT_RADIUS * 1.8, 12, 12]} />
        <meshBasicMaterial color={COLORS.ottawaDot} />
      </mesh>

      {/* User location dot */}
      <mesh
        position={latLngToVector3(userLocation.lat, userLocation.lng, 1.003)}
      >
        <sphereGeometry args={[DOT_RADIUS * 1.4, 10, 10]} />
        <meshBasicMaterial color={COLORS.taxToOttawa} />
      </mesh>

      {/* ── Arc 1: User → Ottawa ─────────────────────────────────────── */}
      <ArcLine
        startLat={userLocation.lat}
        startLng={userLocation.lng}
        endLat={OTTAWA.lat}
        endLng={OTTAWA.lng}
        color={COLORS.taxToOttawa}
        thickness={1.0}
        delay={0}
        label={`Your Federal Tax → Ottawa`}
        amount={formatCurrency(federalTax)}
        onHover={onHover}
        onUnhover={onUnhover}
      />

      {/* ── Arc 2: Ottawa → Provinces ────────────────────────────────── */}
      {DOMESTIC_FLOWS.map((flow, i) => {
        const dollars = (federalTax * flow.percentage) / 100;
        const t = flow.percentage / maxDomesticPct; // 0..1
        return (
          <ArcLine
            key={`domestic-${flow.target.name}`}
            startLat={OTTAWA.lat}
            startLng={OTTAWA.lng}
            endLat={flow.target.lat}
            endLng={flow.target.lng}
            color={COLORS.domesticTransfer}
            thickness={0.2 + t * 0.5}
            delay={1.0 + i * 0.08}
            label={flow.label}
            amount={formatCurrency(dollars)}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        );
      })}

      {/* ── Arc 3: Ottawa → International ────────────────────────────── */}
      {INTERNATIONAL_FLOWS.map((flow, i) => {
        // Scale the user's international portion by this country's share
        const countryShare = flow.amountMillions / TOTAL_BILATERAL_AID_MILLIONS;
        const dollars = internationalTotal * countryShare;
        const t = flow.amountMillions / maxIntlAmount; // 0..1
        return (
          <ArcLine
            key={`intl-${flow.target.name}`}
            startLat={OTTAWA.lat}
            startLng={OTTAWA.lng}
            endLat={flow.target.lat}
            endLng={flow.target.lng}
            color={COLORS.internationalAid}
            thickness={0.05 + t * 0.35}
            delay={2.2 + i * 0.1}
            label={`International Aid → ${flow.target.name}`}
            amount={formatCurrency(dollars)}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        );
      })}
    </group>
  );
}
