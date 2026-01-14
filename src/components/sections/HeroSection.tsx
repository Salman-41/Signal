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
        "relative h-screen flex items-center overflow-hidden bg-[#f9fafb] bg-grain",
        className
      )}
    >
      {/* Background patterns and Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main Background Image - Blended */}
        <div 
          className="absolute inset-0 opacity-20 hover:opacity-30 transition-opacity duration-700"
          style={{
            backgroundImage: `url('/hero-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Large Typographic Watermark */}
        <div className="hero-animate-text absolute top-[18%] left-1/2 -translate-x-1/2 text-[12vw] font-black text-[#0f172a]/[0.012] select-none tracking-tighter uppercase whitespace-nowrap pointer-events-none transition-transform duration-[2s] group-hover:scale-[1.02]">
          Quantitative
        </div>
        <div className="hero-animate-text absolute bottom-[10%] left-1/2 -translate-x-1/2 text-[12vw] font-black text-[#0f172a]/[0.012] select-none tracking-tighter uppercase whitespace-nowrap pointer-events-none transition-transform duration-[2s] group-hover:scale-[0.98]">
          Intelligence
        </div>

        {/* Secondary Editorial Watermarks */}
        <div className="absolute top-[40%] right-[10%] text-[8vw] font-black text-[#64748b]/[0.008] select-none tracking-tighter uppercase whitespace-nowrap pointer-events-none -rotate-12">
          System Node
        </div>
        <div className="absolute top-[60%] left-[5%] text-[6vw] font-black text-[#64748b]/[0.008] select-none tracking-tighter uppercase whitespace-nowrap pointer-events-none rotate-6">
          Global Feed
        </div>

        {/* Measurement Grid Overlays */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Geometric Corner Brackets */}
        <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-[#64748b]/10 hidden xl:block" />
        <div className="absolute top-12 right-12 w-12 h-12 border-t border-r border-[#64748b]/10 hidden xl:block" />
        <div className="absolute bottom-12 left-12 w-12 h-12 border-b border-l border-[#64748b]/10 hidden xl:block" />
        <div className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-[#64748b]/10 hidden xl:block" />

        {/* System Meta Watermarks - Monospaced */}
        <div className="absolute bottom-24 left-12 text-[10px] font-mono text-[#64748b]/20 tracking-[0.3em] uppercase hidden 2xl:block -rotate-90 origin-left">
          [ 52.3676° N, 4.9041° E ]
        </div>
        <div className="absolute top-24 right-12 text-[10px] font-mono text-[#64748b]/20 tracking-[0.3em] uppercase hidden 2xl:block rotate-90 origin-right">
          SIGNAL_STATUS_STABLE_V4.2
        </div>

        {/* Overlay Gradient to soften it */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f9fafb]/80 via-transparent to-[#f9fafb]/90" />



        {/* Subtle red glow from the image concept */}
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-[#e63946]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
          {/* Left Side: Content - Taking up ~60% space */}
          <div className="flex flex-col items-start text-left space-y-6 lg:space-y-12 relative z-10">

            {/* Main Title */}
            <h1 className="hero-animate-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.9] text-[#0f172a]">
              Decode the <span className="italic text-[#e63946]">Signals</span>
              <br />
              of a <span className="relative inline-block">
                Changing
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,0 100,5" stroke="#64748b" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
              </span>
              <br className="lg:hidden" /> World.
            </h1>

            {/* Subtext */}
            <div className="hero-animate-text max-w-2xl lg:max-w-3xl">
              <Text
                size="xl"
                className="text-[#475569] leading-relaxed font-medium opacity-80"
              >
                Real-time trend intelligence across economy, climate, and technology.
                We identify technical patterns in public data before they become headlines.
              </Text>
            </div>

            {/* CTA */}
            <div className="hero-animate-text relative flex flex-wrap items-center gap-6 pt-4">
              {/* Subtle Tech Watermark for CTA */}
              <div className="absolute -top-4 left-0 text-[8px] font-mono text-[#64748b]/30 tracking-[0.4em] uppercase">
                Platform_Protocol_V4
              </div>

              <button className="group relative px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#e63946] to-[#0f172a] opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  Launch Platform
                  <ArrowDown className="w-4 h-4 -rotate-[135deg] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </button>
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
                  ? "text-[#475569]"
                  : "text-[#94a3b8]";

              return (
                <div 
                  key={signal.id}
                  className={cn(
                    "hero-animate-card group relative bg-white/60 p-5 rounded-3xl border border-[#cbd5e1]/40 shadow-xl backdrop-blur-md flex items-center gap-6 overflow-hidden max-w-[340px] md:max-w-md w-full transition-all duration-700 hover:bg-white/80 hover:shadow-2xl hover:border-[#e63946]/40 hover:-translate-y-2",
                    idx === 1 && "lg:translate-x-8",
                    idx === 2 && "lg:translate-x-4"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e63946]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex flex-col items-start flex-1 min-w-0">
                    <Label className="text-[#64748b] text-[10px] uppercase tracking-widest font-bold">
                      {signal.category}
                    </Label>
                    <span className="text-[#0f172a] font-medium text-lg mt-1 truncate w-full">
                      {signal.title}
                    </span>
                    <span className="text-[#64748b]/60 text-xs mt-0.5 truncate w-full">
                      {signal.subtitle}
                    </span>
                  </div>

                  <div className="relative h-12 w-px bg-[#cbd5e1]/30 mx-2" />

                  <div className="relative flex flex-col items-end shrink-0 font-mono">
                    <div className={cn("flex items-center gap-1.5", trendColor)}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm font-bold tracking-tight">
                        {signal.changePercent > 0 ? "+" : ""}{signal.changePercent}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-[#0f172a] text-2xl font-bold tracking-tight">
                        {signal.currentValue}
                      </span>
                      <span className="text-[#64748b] text-sm font-medium">
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
