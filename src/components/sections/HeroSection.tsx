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
  signals: Signal[];
  className?: string;
}

export function HeroSection({ signals, className }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Pick top 3 signals for different categories
  const featuredSignals = [
    signals.find(s => s.id === "temp-anomaly") || signals[0],
    signals.find(s => s.id === "inflation-cpi") || signals[1],
    signals.find(s => s.id === "ai-adoption") || signals[7],
  ].filter(Boolean);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Staggered enter animation
      tl.fromTo(
        ".hero-animate-text",
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, stagger: 0.15, delay: 0.5 }
      );

      tl.fromTo(
        ".hero-animate-card",
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, stagger: 0.2, delay: 0.8 },
        "-=0.8"
      );

      // Scroll indicator float
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className={cn(
        "relative h-screen flex items-center overflow-hidden bg-[#f1faee]",
        className
      )}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #457b9d 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        
        {/* Large background text to fill middle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-[#1d3557]/[0.02] select-none tracking-tighter uppercase whitespace-nowrap">
          Intelligence
        </div>

        {/* Vertical stream indicators */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#a8dadc]/20 to-transparent hidden lg:block" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#f1faee] border border-[#a8dadc]/40 text-[8px] font-bold text-[#457b9d]/40 uppercase tracking-widest -rotate-90 hidden lg:block">
          Data Stream: Active
        </div>

        <div className="absolute top-0 left-0 w-80 h-80 bg-[#e63946]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#457b9d]/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
          {/* Left Side: Content - Taking up ~60% space */}
          <div className="flex flex-col items-start text-left space-y-6 lg:space-y-12 relative z-10">
            {/* Eyebrow */}
            <div className="hero-animate-text">
              <div className="flex items-center gap-3">
                <span className="inline-block px-3 py-1 bg-[#e63946]/10 text-[#e63946] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase rounded-full border border-[#e63946]/20">
                  v 1.2
                </span>
                <span className="text-[10px] font-bold text-[#457b9d]/60 uppercase tracking-widest hidden sm:block">
                  Global Trend Engine
                </span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="hero-animate-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.9] text-[#1d3557]">
              Decode the <span className="italic text-[#e63946]">Signals</span>
              <br />
              of a <span className="relative inline-block">
                Changing
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,0 100,5" stroke="#457b9d" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
              </span>
              <br className="lg:hidden" /> World.
            </h1>

            {/* Subtext */}
            <div className="hero-animate-text max-w-sm lg:max-w-md">
              <Text
                size="xl"
                className="text-[#457b9d] leading-relaxed font-medium opacity-80"
              >
                Real-time trend intelligence across economy, climate, and technology.
                We identify technical patterns in public data before they become headlines.
              </Text>
            </div>
          </div>

          {/* Right Side: Signal Cards - Repositioned into their own place */}
          <div className="relative flex flex-col gap-6 lg:items-end justify-center">
            {/* Connection markers removed as requested */}
            {featuredSignals.map((signal, idx) => {
              const TrendIcon =
                signal.trend === "up"
                  ? TrendingUp
                  : signal.trend === "down"
                  ? TrendingDown
                  : Minus;

              const trendColor =
                signal.trend === "up"
                  ? "text-[#e63946]"
                  : signal.trend === "down"
                  ? "text-[#457b9d]"
                  : "text-[#a8dadc]";

              return (
                <div 
                  key={signal.id}
                  className={cn(
                    "hero-animate-card group relative bg-white/60 p-5 rounded-3xl border border-[#a8dadc]/40 shadow-xl backdrop-blur-md flex items-center gap-6 overflow-hidden max-w-[340px] md:max-w-md w-full transition-all duration-700 hover:bg-white/80 hover:shadow-2xl hover:border-[#e63946]/40 hover:-translate-y-2",
                    idx === 1 && "lg:translate-x-8",
                    idx === 2 && "lg:translate-x-4"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e63946]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex flex-col items-start flex-1 min-w-0">
                    <Label className="text-[#457b9d] text-[10px] uppercase tracking-widest font-bold">
                      {signal.category}
                    </Label>
                    <span className="text-[#1d3557] font-medium text-lg mt-1 truncate w-full">
                      {signal.title}
                    </span>
                    <span className="text-[#457b9d]/60 text-xs mt-0.5 truncate w-full">
                      {signal.subtitle}
                    </span>
                  </div>

                  <div className="relative h-12 w-px bg-[#a8dadc]/30 mx-2" />

                  <div className="relative flex flex-col items-end shrink-0 font-mono">
                    <div className={cn("flex items-center gap-1.5", trendColor)}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm font-bold tracking-tight">
                        {signal.changePercent > 0 ? "+" : ""}{signal.changePercent}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-[#1d3557] text-2xl font-bold tracking-tight">
                        {signal.currentValue}
                      </span>
                      <span className="text-[#457b9d] text-sm font-medium">
                        {signal.unit}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
