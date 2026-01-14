"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Section, Container, Grid } from "@/components/layout/Section";
import { Heading, Text, Label } from "@/components/layout/Typography";
import { SignalCard } from "@/components/signals/SignalCard";
import { Signal, SignalCategory, CATEGORY_META } from "@/lib/signals/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LiveSignalsSectionProps {
  signals: Signal[];
  className?: string;
}

export function LiveSignalsSection({
  signals,
  className,
}: LiveSignalsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger card animations
      const cards = cardsRef.current?.querySelectorAll(".signal-card-item");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [signals]);

  // Group signals by category
  const groupedSignals = signals.reduce((acc, signal) => {
    if (!acc[signal.category]) {
      acc[signal.category] = [];
    }
    acc[signal.category].push(signal);
    return acc;
  }, {} as Record<SignalCategory, Signal[]>);

  const categories: SignalCategory[] = [
    "economic",
    "climate",
    "tech",
    "social",
  ];

  return (
    <Section
      ref={sectionRef}
      id="live-signals"
      className={cn("py-24 md:py-32", className)}
      background="muted"
    >
      <Container>
        {/* Section header */}
        <div className="mb-16">
          <Label variant="accent" className="mb-4">
            Live Signals
          </Label>
          <Heading as="h2" size="section" className="text-stone-900">
            What&apos;s shifting right now
          </Heading>
          <Text size="lg" muted className="mt-4 max-w-2xl">
            Real-time and near-real-time indicators across major domains. Each
            signal is updated from free, public data sources.
          </Text>
        </div>

        {/* Category groups */}
        <div ref={cardsRef} className="space-y-16">
          {categories.map((category) => {
            const categorySignals = groupedSignals[category] || [];
            if (categorySignals.length === 0) return null;

            const meta = CATEGORY_META[category];

            return (
              <div key={category}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      category === "economic"
                        ? "bg-amber-500"
                        : category === "climate"
                        ? "bg-emerald-500"
                        : category === "tech"
                        ? "bg-violet-500"
                        : "bg-rose-500"
                    )}
                  />
                  <h3 className="text-lg font-medium text-stone-900">
                    {meta.label}
                  </h3>
                  <span className="text-sm text-stone-400">
                    {meta.description}
                  </span>
                </div>

                {/* Signal cards */}
                <Grid cols={3} gap="md">
                  {categorySignals.map((signal, index) => (
                    <SignalCard
                      key={signal.id}
                      signal={signal}
                      variant="default"
                      animationDelay={0}
                      className="signal-card-item"
                    />
                  ))}
                </Grid>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
