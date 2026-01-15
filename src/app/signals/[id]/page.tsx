import { notFound } from "next/navigation";
import { getSignalById, mockSignals } from "@/lib/signals";
import { SignalDetailSection } from "@/components/sections/SignalDetailSection";

interface SignalPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all signals
export async function generateStaticParams() {
  return mockSignals.map((signal) => ({
    id: signal.id,
  }));
}

// Generate metadata for each signal page
export async function generateMetadata({ params }: SignalPageProps) {
  const { id } = await params;
  const signal = getSignalById(id);
  
  if (!signal) {
    return {
      title: "Signal Not Found",
    };
  }

  return {
    title: `${signal.title} | Signal`,
    description: signal.interpretation.whatItMeans,
  };
}

export default async function SignalPage({ params }: SignalPageProps) {
  const { id } = await params;
  const signal = getSignalById(id);

  if (!signal) {
    notFound();
  }

  // Get related signals (same category, excluding current)
  const relatedSignals = mockSignals
    .filter((s) => s.category === signal.category && s.id !== signal.id)
    .slice(0, 3);

  return (
    <SignalDetailSection signal={signal} relatedSignals={relatedSignals} />
  );
}
