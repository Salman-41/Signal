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
          <Heading as="h2" size="section" className="text-stone-900">
            Signals in context
          </Heading>
          <Text size="lg" muted className="mt-4 max-w-2xl">
            Relationships between different indicators. Where do trends align,
            and where do they diverge?
          </Text>
        </div>

        {/* Comparison charts */}
        <div className="space-y-12">
          {comparisons.map((comparison) => (
            <div
              key={comparison.id}
              className="comparison-item bg-white rounded-xl border border-stone-200 p-6 md:p-8"
            >
              <h3 className="text-xl font-medium text-stone-900 mb-6">
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
