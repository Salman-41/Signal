"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Section, Container } from "@/components/layout/Section";
import { Heading, Text, Label } from "@/components/layout/Typography";
import { Signal } from "@/lib/signals/types";
import { SignalCard } from "@/components/signals/SignalCard";
import {
  SparklineChart,
  DeviationChart,
  RateOfChangeChart,
} from "@/components/charts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface DeepDiveSectionProps {
  signal: Signal;
  className?: string;
}

export function DeepDiveSection({ signal, className }: DeepDiveSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeView, setActiveView] = useState<
    "indexed" | "rate" | "deviation"
  >("indexed");

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate section content
      gsap.fromTo(
        ".deep-dive-content",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Calculate baseline for deviation view
  const values = signal.sparklineHistory.map((d) => d.value);
  const baseline = values.reduce((a, b) => a + b, 0) / values.length;

  return (
    <Section
      ref={sectionRef}
      id="deep-dive"
      className={cn("py-24 md:py-32", className)}
      background="default"
    >
      <Container>
        <div className="deep-dive-content">
          {/* Header */}
          <div className="mb-12">
            <Label variant="accent" className="mb-4">
              Deep Dive
            </Label>
            <Heading as="h2" size="section" className="text-stone-900">
              {signal.title}
            </Heading>
            <Text size="lg" muted className="mt-4 max-w-2xl">
              A closer look at one signal. Explore different views to understand
              the underlying pattern.
            </Text>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Signal card */}
            <div className="lg:col-span-1">
              <SignalCard signal={signal} variant="featured" />
            </div>

            {/* Chart area */}
            <div className="lg:col-span-2">
              {/* View switcher */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setActiveView("indexed")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeView === "indexed"
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  Indexed Trend
                </button>
                <button
                  onClick={() => setActiveView("rate")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeView === "rate"
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  Rate of Change
                </button>
                <button
                  onClick={() => setActiveView("deviation")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeView === "deviation"
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  Deviation from Mean
                </button>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-xl border border-stone-200 p-6 md:p-8">
                <div className="mb-4">
                  <h4 className="font-medium text-stone-900">
                    {activeView === "indexed"
                      ? "Historical Trend"
                      : activeView === "rate"
                      ? "Rate of Change Over Time"
                      : "Deviation from Historical Mean"}
                  </h4>
                  <p className="text-sm text-stone-500 mt-1">
                    {activeView === "indexed"
                      ? "Value trajectory over the observation period"
                      : activeView === "rate"
                      ? "Percent change between consecutive observations"
                      : "How far each point deviates from the average"}
                  </p>
                </div>

                <div className="h-48 md:h-64">
                  {activeView === "indexed" && (
                    <SparklineChart
                      data={signal.sparklineHistory}
                      width={600}
                      height={200}
                      strokeWidth={2}
                      color={
                        signal.trend === "up"
                          ? "#10b981"
                          : signal.trend === "down"
                          ? "#f43f5e"
                          : "#6366f1"
                      }
                      showArea
                      className="w-full h-full"
                    />
                  )}
                  {activeView === "rate" && (
                    <RateOfChangeChart
                      data={signal.sparklineHistory}
                      width={600}
                      height={200}
                      color="#6366f1"
                      className="w-full h-full"
                    />
                  )}
                  {activeView === "deviation" && (
                    <DeviationChart
                      data={signal.sparklineHistory}
                      baseline={baseline}
                      width={600}
                      height={200}
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>

              {/* Interpretation */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-lg p-5">
                  <h5 className="text-sm font-medium text-stone-900 mb-2">
                    What this suggests
                  </h5>
                  <Text size="sm" muted>
                    {signal.interpretation.whatItMeans}
                  </Text>
                </div>
                <div className="bg-stone-50 rounded-lg p-5">
                  <h5 className="text-sm font-medium text-stone-900 mb-2">
                    What it does not claim
                  </h5>
                  <Text size="sm" muted>
                    {signal.interpretation.whatItDoesNotClaim}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
