"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Section";
import {
  Heading,
  Text,
  DataValue,
  Label,
} from "@/components/layout/Typography";
import { Signal } from "@/lib/signals/types";
import { formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  featuredSignal: Signal;
  className?: string;
}

export function HeroSection({ featuredSignal, className }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Heading animation - split by lines
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          0.2
        );
      }

      // Subtext animation
      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.6
        );
      }

      // Stats animation
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.9
        );
      }

      // Scroll indicator
      if (scrollIndicatorRef.current) {
        tl.fromTo(
          scrollIndicatorRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          1.2
        );

        // Continuous bounce animation
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: 2,
        });
      }

      // Parallax effect on scroll
      gsap.to(headingRef.current, {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const TrendIcon =
    featuredSignal.trend === "up"
      ? TrendingUp
      : featuredSignal.trend === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    featuredSignal.trend === "up"
      ? "text-emerald-500"
      : featuredSignal.trend === "down"
      ? "text-rose-500"
      : "text-stone-400";

  return (
    <section
      ref={heroRef}
      className={cn(
        "relative min-h-screen flex flex-col justify-center overflow-hidden",
        "bg-gradient-to-b from-stone-50 to-white",
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #78716c 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <Container className="relative z-10 py-24 md:py-32">
        {/* Eyebrow */}
        <div className="mb-8">
          <Label variant="accent" className="text-stone-500">
            Trend Intelligence Platform
          </Label>
        </div>

        {/* Main heading */}
        <h1
          ref={headingRef}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight leading-[0.95] text-stone-900 max-w-5xl"
        >
          Understand what is
          <br />
          <span className="text-stone-400">changing,</span> where,
          <br />
          and <span className="text-stone-400">how fast.</span>
        </h1>

        {/* Subtext */}
        <div ref={subtextRef} className="mt-8 md:mt-12 max-w-2xl">
          <Text size="xl" className="text-stone-600">
            Real-time signal detection across economic, climate, technology, and
            public interest indicators. No noise. No hype. Just clarity on
            what&apos;s shifting.
          </Text>
        </div>

        {/* Featured stat */}
        <div
          ref={statsRef}
          className="mt-12 md:mt-16 p-6 md:p-8 rounded-2xl bg-white border border-stone-200 max-w-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label variant="muted">Featured Signal</Label>
              <h3 className="text-xl font-medium text-stone-900 mt-1">
                {featuredSignal.title}
              </h3>
              <p className="text-sm text-stone-400 mt-0.5">
                {featuredSignal.subtitle}
              </p>
            </div>
            <div className={cn("flex items-center gap-1", trendColor)}>
              <TrendIcon className="w-5 h-5" />
              <span className="text-sm font-medium tabular-nums">
                {formatPercent(featuredSignal.changePercent)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-end gap-2">
            <DataValue size="xl" trend={featuredSignal.trend}>
              {featuredSignal.currentValue}
            </DataValue>
            <span className="text-2xl text-stone-400 mb-1">
              {featuredSignal.unit}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100">
            <Text size="sm" muted>
              {featuredSignal.interpretation.whatItMeans}
            </Text>
          </div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400"
      >
        <span className="text-xs uppercase tracking-widest">Explore</span>
        <ArrowDown className="w-5 h-5" />
      </div>
    </section>
  );
}
