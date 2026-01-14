"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Section, Container } from "@/components/layout/Section";
import { Heading, Text, Label } from "@/components/layout/Typography";
import { ComparisonData } from "@/lib/signals/types";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ComparisonSectionProps {
  comparisons: ComparisonData[];
  className?: string;
}

export function ComparisonSection({
  comparisons,
  className,
}: ComparisonSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const charts = sectionRef.current?.querySelectorAll(".comparison-item");
      if (charts) {
        gsap.fromTo(
          charts,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      ref={sectionRef}
      id="comparisons"
      className={cn("py-24 md:py-32", className)}
      background="muted"
    >
      <Container>
        {/* Header */}
        <div className="mb-16">
          <Label variant="accent" className="mb-4">
            Comparisons
          </Label>
          <Heading as="h2" size="section" className="text-[#0f172a]">
            Signal Correlations
          </Heading>
          <Text size="lg" className="text-[#475569] mt-4 max-w-2xl">
            Trends rarely exist in a vacuum. We track how different signals
            move in relation to each other.
          </Text>
        </div>

        {/* Comparison charts */}
        <div className="space-y-12">
          {comparisons.map((comparison) => (
            <div
              key={comparison.id}
              className="comparison-item bg-white/50 rounded-xl border border-[#cbd5e1]/50 p-6 md:p-8 backdrop-blur-sm"
            >
              <h3 className="text-xl font-medium text-[#0f172a] mb-6">
                {comparison.title}
              </h3>
              <ComparisonChart data={comparison} showAnnotations />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
