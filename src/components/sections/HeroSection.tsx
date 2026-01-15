"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
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
import { TrendingUp, TrendingDown, Minus, ArrowDown, Search, ShieldCheck, Zap, Server, Activity } from "lucide-react";
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
    const watermarkRef1 = useRef<HTMLDivElement>(null);
    const watermarkRef2 = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    // Picker for top 3 signals
    const featuredSignals = [
        signals.find(s => s.id === "temp-anomaly") || signals[0],
        signals.find(s => s.id === "inflation-cpi") || signals[1],
        signals.find(s => s.id === "ai-adoption") || signals[7],
    ].filter(Boolean);

    // Live Monitor State
    const [metrics, setMetrics] = useState({
        signals: 124502,
        integrity: 100.0,
        speed: 12,
        nodes: 8
    });

    const [logs, setLogs] = useState<string[]>([
        "INGESTING_FRED_CORE_CPI",
        "POLLING_NOAA_THERMAL_SCAN",
        "VERIFYING_NASA_EARTH_OBS"
    ]);

    useEffect(() => {
        const dataSources = [
            "INGESTING_FRED_CPI", "POLLING_NOAA_THERMAL", "NASA_OBS_SYNC", 
            "CRYPTO_LIQUIDITY_SCAN", "MARKET_SENTIMENT_CORE", "AI_ADOPTION_POLL",
            "REUTERS_GLOBAL_HEADLINE", "WORLD_BANK_INDICATOR", "UN_CLIMATE_VERIFY"
        ];

        const interval = setInterval(() => {
            setMetrics(prev => ({
                signals: prev.signals + Math.floor(Math.random() * 5),
                integrity: +(99.9 + Math.random() * 0.1).toFixed(2),
                speed: 10 + Math.floor(Math.random() * 5),
                nodes: prev.nodes
            }));

            setLogs(prev => {
                const next = [...prev, dataSources[Math.floor(Math.random() * dataSources.length)]];
                return next.slice(-1); // Only keep the single latest log for compact view
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

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

            // Mouse parallax effect
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth - 0.5) * 2;
                const yPos = (clientY / window.innerHeight - 0.5) * 2;

                if (watermarkRef1.current) {
                    gsap.to(watermarkRef1.current, {
                        x: xPos * 40,
                        y: yPos * 30,
                        duration: 1.5,
                        ease: "power2.out",
                    });
                }
                if (watermarkRef2.current) {
                    gsap.to(watermarkRef2.current, {
                        x: xPos * -40,
                        y: yPos * -30,
                        duration: 1.5,
                        ease: "power2.out",
                    });
                }
                if (glowRef.current) {
                    gsap.to(glowRef.current, {
                        left: clientX,
                        top: clientY,
                        duration: 2,
                        ease: "power3.out",
                    });
                }
            };

            // Scroll Parallax for Background Elements
            gsap.to(".hero-bg-parallax", {
                y: (i, target) => {
                    const speed = target.getAttribute("data-speed") || 0.1;
                    return window.innerHeight * speed;
                },
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

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

            window.addEventListener("mousemove", handleMouseMove);
            return () => window.removeEventListener("mousemove", handleMouseMove);
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
        {/* Main Background Image - Blended with Scroll Parallax */}
        <div 
          className="hero-bg-parallax absolute inset-0 opacity-20 hover:opacity-30 transition-opacity duration-700 pointer-events-none"
          data-speed="0.2"
          style={{
            backgroundImage: `url('/hero-bg.png')`,
            backgroundSize: '110% 110%',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Large Typographic Watermark with Mouse & Scroll Parallax */}
        <div 
          ref={watermarkRef1}
          className="hero-animate-text hero-bg-parallax absolute top-[18%] left-1/2 -translate-x-1/2 text-[12vw] font-black text-[#0f172a]/[0.012] select-none tracking-tighter uppercase whitespace-nowrap pointer-events-none transition-transform duration-[2s] group-hover:scale-[1.02]"
          data-speed="0.1"
        >
          Quantitative
        </div>
        <div 
          ref={watermarkRef2}
          className="hero-animate-text hero-bg-parallax absolute bottom-[10%] left-1/2 -translate-x-1/2 text-[12vw] font-black text-[#0f172a]/[0.012] select-none tracking-tighter uppercase whitespace-nowrap pointer-events-none transition-transform duration-[2s] group-hover:scale-[0.98]"
          data-speed="-0.1"
        >
          Intelligence
        </div>

        {/* Floating Technical Markers - Drifting Data Points */}
        <div className="absolute top-[25%] left-[15%] text-[9px] font-mono text-[#64748b]/20 tracking-widest animate-pulse-soft hidden 2xl:block">
          SYS_PING: 0.04ms
        </div>
        <div className="absolute top-[75%] right-[20%] text-[9px] font-mono text-[#64748b]/20 tracking-widest animate-pulse-soft hidden 2xl:block" style={{ animationDelay: '1s' }}>
          GEOSPATIAL_SYNC: [OK]
        </div>
        <div className="absolute bottom-[20%] left-[30%] text-[9px] font-mono text-[#e63946]/10 tracking-widest animate-pulse-soft hidden 2xl:block" style={{ animationDelay: '1.5s' }}>
          PLATFORM_V4_SECURED
        </div>

        {/* Secondary Editorial Watermarks */}
        <div className="absolute top-[40%] right-[10%] text-[8vw] font-black text-[#64748b]/[0.008] select-none tracking-tighter uppercase whitespace-nowrap pointer-events-none -rotate-12">
          System Node
        </div>
        <div className="absolute top-[60%] left-[5%] text-[6vw] font-black text-[#64748b]/[0.008] select-none tracking-tighter uppercase whitespace-nowrap pointer-events-none rotate-6">
          Global Feed
        </div>

        {/* Measurement Grid Overlays - Double Layered for Depth */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
            backgroundSize: '120px 120px'
          }}
        />
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #e63946 1px, transparent 1px), linear-gradient(to bottom, #e63946 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '20px 20px'
          }}
        />

        {/* System Meta Watermarks - Monospaced */}
        <div className="absolute bottom-24 left-12 text-[10px] font-mono text-[#64748b]/30 tracking-[0.3em] uppercase hidden 2xl:block -rotate-90 origin-left">
          [ 52.3676° N, 4.9041° E ]
        </div>
        <div className="absolute top-24 right-12 text-[10px] font-mono text-[#64748b]/30 tracking-[0.3em] uppercase hidden 2xl:block rotate-90 origin-right">
          SIGNAL_STATUS_STABLE_V4.2
        </div>

        {/* Overlay Gradient to soften it */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f9fafb]/90 via-transparent to-[#f9fafb]/95" />



        {/* Subtle red glow from the image concept */}
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-[#e63946]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        
        {/* Dynamic Atmospheric Glow (Mouse Following) */}
        <div 
          ref={glowRef}
          className="absolute w-[900px] h-[900px] bg-[#e63946]/[0.06] rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 lg:opacity-100 mix-blend-multiply"
          style={{ left: '50%', top: '50%' }}
        />

        {/* Center Vertical Axis Line */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#64748b]/20 to-transparent pointer-events-none" />

        {/* Kinetic Scan Line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-full h-[15vh] bg-gradient-to-b from-transparent via-[#e63946]/10 to-transparent animate-marquee-vertical" />
        </div>
      </div>

      <Container className="relative z-10 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
          {/* Left Side: Content - Taking up ~60% space */}
          <div className="flex flex-col items-start text-left space-y-6 md:space-y-8 relative z-10 order-2 lg:order-1">

            {/* Main Title */}
            <h1 className="hero-animate-text text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.9] text-[#0f172a]">
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
                className="text-[#475569] leading-relaxed font-medium opacity-80 text-lg md:text-xl"
              >
                Real-time trend intelligence across economy, climate, and technology.
                We identify technical patterns in public data before they become headlines.
              </Text>
            </div>

            {/* Compact Live Monitor (Two Lines) */}
            <div className="hero-animate-text relative w-full max-w-lg pt-2 md:pt-4">
              <div className="bg-white/40 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-4 md:p-5 shadow-xl overflow-hidden relative group">
                {/* Metrics Line */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3 pb-3 border-b border-[#cbd5e1]/30">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <span className="text-[7px] md:text-[8px] font-bold text-[#64748b] uppercase tracking-tighter">Live_Signals</span>
                      <span className="text-xs md:text-sm font-mono font-bold text-[#0f172a] tabular-nums">
                        {metrics.signals.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] md:text-[8px] font-bold text-[#64748b] uppercase tracking-tighter">Integrity</span>
                      <span className="text-xs md:text-sm font-mono font-bold text-emerald-600 tabular-nums">
                        {metrics.integrity}%
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] md:text-[8px] font-bold text-[#64748b] uppercase tracking-tighter">Latency</span>
                      <span className="text-xs md:text-sm font-mono font-bold text-[#0f172a] tabular-nums">
                        {metrics.speed}ms
                      </span>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 text-[8px] md:text-[9px] font-bold animate-pulse uppercase tracking-widest leading-none ml-auto">
                    Active
                  </div>
                </div>

                {/* Log Line */}
                <div className="flex items-center gap-3">
                  <span className="text-[7px] md:text-[8px] font-bold text-[#64748b] uppercase shrink-0">Feed_Stream</span>
                  <div className="flex-1 bg-[#0f172a] rounded-lg px-3 py-1.5 font-mono text-[9px] md:text-[10px] text-emerald-500/80 flex items-center overflow-hidden h-7 md:h-8">
                    {logs.map((log, i) => (
                      <div key={i} className="flex items-center gap-2 animate-in slide-in-from-bottom-1 duration-300 w-full">
                        <span className="opacity-40">{">"}</span>
                        <span className="truncate">{log}</span>
                        <span className="ml-auto opacity-40 text-[7px] md:text-[8px]">SYNC_OK</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Signal Cards - Repositioned into their own place */}
          <div className="relative flex flex-col gap-6 lg:items-end justify-center order-1 lg:order-2">
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
                <Link 
                  key={signal.id}
                  href={`/signals/${signal.id}`}
                  className={cn(
                    "hero-animate-card group relative bg-white/60 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-[#cbd5e1]/40 shadow-xl backdrop-blur-md flex items-center gap-4 md:gap-6 overflow-hidden max-w-[340px] md:max-w-md w-full transition-all duration-700 hover:bg-white/80 hover:shadow-2xl hover:border-[#e63946]/40 hover:-translate-y-2",
                    idx === 1 && "lg:translate-x-8",
                    idx === 2 && "lg:translate-x-4",
                    idx !== 0 && "hidden md:flex" // Hide secondary cards on mobile for cleaner look
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e63946]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex flex-col items-start flex-1 min-w-0">
                    <Label className="text-[#64748b] text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
                      {signal.category}
                    </Label>
                    <span className="text-[#0f172a] font-medium text-base md:text-lg mt-1 truncate w-full">
                      {signal.title}
                    </span>
                    <span className="text-[#64748b]/60 text-[10px] md:text-xs mt-0.5 truncate w-full">
                      {signal.subtitle}
                    </span>
                  </div>

                  <div className="relative h-10 md:h-12 w-px bg-[#cbd5e1]/30 mx-1 md:mx-2" />

                  <div className="relative flex flex-col items-end shrink-0 font-mono">
                    <div className={cn("flex items-center gap-1.5", trendColor)}>
                      <TrendIcon className="w-3.5 h-3.5 md:w-4 h-4" />
                      <span className="text-xs md:text-sm font-bold tracking-tight">
                        {signal.changePercent > 0 ? "+" : ""}{signal.changePercent}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-[#0f172a] text-xl md:text-2xl font-bold tracking-tight">
                        {signal.currentValue}
                      </span>
                      <span className="text-[#64748b] text-xs md:text-sm font-medium">
                        {signal.unit}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* Mobile-only View More Indicator */}
            <div className="flex md:hidden items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#64748b]/60">
              <Activity className="w-3 h-3" />
              Monitoring Live Feed Below
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
