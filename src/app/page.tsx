import {
  HeroSection,
  LiveSignalsSection,
  DeepDiveSection,
  ComparisonSection,
  MethodologySection,
} from "@/components/sections";
import {
  mockSignals,
  featuredSignal,
  mockComparisons,
  getSignalById,
} from "@/lib/signals";

export default function HomePage() {
  // Get a specific signal for deep dive (using global temperature anomaly)
  const deepDiveSignal = getSignalById("temp-anomaly") || featuredSignal;

  return (
    <>
      {/* Hero - What this site detects, why signals matter */}
      <HeroSection signals={mockSignals} />

      {/* Live Signals - Real-time indicator cards by category */}
      <LiveSignalsSection signals={mockSignals} />

      {/* Deep Dive - Focused single-signal analysis */}
      <DeepDiveSection signal={deepDiveSignal} />

      {/* Comparisons - Signal relationships and divergence */}
      <ComparisonSection comparisons={mockComparisons} />

      {/* Methodology - Data sources and transparency */}
      <MethodologySection />
    </>
  );
}
