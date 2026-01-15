"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils";
import { Section, Container } from "@/components/layout/Section";
import { Heading, Text, Label } from "@/components/layout/Typography";
import { Signal, CATEGORY_META } from "@/lib/signals/types";
import { getDataSourceInfo } from "@/lib/signals/api-clients";
import {
  SparklineChart,
  DeviationChart,
  RateOfChangeChart,
} from "@/components/charts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  ExternalLink,
  Clock,
  Database,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SignalDetailSectionProps {
  signal: Signal;
  relatedSignals?: Signal[];
  className?: string;
}

export function SignalDetailSection({
  signal,
  relatedSignals = [],
  className,
}: SignalDetailSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  const [activeView, setActiveView] = useState<"indexed" | "rate" | "deviation">("indexed");
  const [isDataLive, setIsDataLive] = useState(true);

  const categoryMeta = CATEGORY_META[signal.category];
  const sourceInfo = getDataSourceInfo(signal.id);

  // Animate entrance
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".detail-animate",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }
      );

      // Mouse parallax for glow
      const handleMouseMove = (e: MouseEvent) => {
        if (!glowRef.current) return;
        const { clientX, clientY } = e;
        gsap.to(glowRef.current, {
          left: clientX,
          top: clientY,
          duration: 1.5,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Calculate baseline for deviation view
  const values = signal.sparklineHistory.map((d) => d.value);
  const baseline = values.reduce((a, b) => a + b, 0) / values.length;

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
      ? "text-[#64748b]"
      : "text-[#cbd5e1]";

  const chartColor =
    signal.trend === "up"
      ? "#e63946"
      : signal.trend === "down"
      ? "#475569"
      : "#0f172a";

  return (
    <Section
      ref={sectionRef}
      className={cn("relative min-h-screen py-8 md:py-12 overflow-hidden", className)}
      background="default"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Measurement grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        
        {/* Kinetic scan line */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-full h-[10vh] bg-gradient-to-b from-transparent via-[#e63946]/10 to-transparent animate-marquee-vertical" />
        </div>

        {/* Dynamic glow */}
        <div
          ref={glowRef}
          className="absolute w-[600px] h-[600px] bg-[#e63946]/[0.04] rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: "50%", top: "30%" }}
        />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/30 to-transparent" />
      </div>

      <Container className="relative z-10">
        {/* Back navigation */}
        <div className="detail-animate mb-8">
          <Link
            href="/#live-signals"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Signals
          </Link>
        </div>

        {/* Hero Header */}
        <div ref={heroRef} className="detail-animate mb-12">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              {/* Category badge */}
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4",
                  categoryMeta.bgColor,
                  categoryMeta.color
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    signal.trend === "up"
                      ? "bg-[#e63946]"
                      : signal.trend === "down"
                      ? "bg-[#457b9d]"
                      : "bg-[#a8dadc]"
                  )}
                />
                {categoryMeta.label}
              </div>

              {/* Title */}
              <Heading as="h1" size="hero" className="text-[#0f172a] tracking-tight">
                {signal.title}
              </Heading>
              {signal.subtitle && (
                <Text size="lg" muted className="mt-2">
                  {signal.subtitle}
                </Text>
              )}
            </div>

            {/* External source link */}
            <a
              href={signal.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#cbd5e1]/50 text-sm font-medium text-[#64748b] hover:text-[#0f172a] hover:border-[#e63946]/30 hover:bg-white/50 transition-all"
            >
              View Source
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Value card */}
          <div className="detail-animate">
            <div className="bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 md:p-8 shadow-lg">
              {/* Current value */}
              <div className="mb-6">
                <Label variant="muted" className="text-[10px] uppercase tracking-widest mb-2">
                  Current Value
                </Label>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-bold text-[#0f172a] tabular-nums tracking-tight">
                    {signal.currentValue}
                  </span>
                  <span className="text-2xl text-[#64748b] font-medium">
                    {signal.unit}
                  </span>
                </div>
              </div>

              {/* Change indicator */}
              <div className="flex items-center gap-4 pb-6 border-b border-[#cbd5e1]/30">
                <div className={cn("flex items-center gap-2", trendColor)}>
                  <TrendIcon className="w-5 h-5" />
                  <span className="text-lg font-bold tabular-nums">
                    {signal.changePercent > 0 ? "+" : ""}
                    {formatPercent(signal.changePercent)}
                  </span>
                </div>
                <span className="text-sm text-[#94a3b8]">vs previous period</span>
              </div>

              {/* Previous value */}
              <div className="pt-6 grid grid-cols-2 gap-4">
                <div>
                  <Label variant="muted" className="text-[9px] uppercase tracking-widest mb-1">
                    Previous
                  </Label>
                  <span className="text-lg font-medium text-[#475569] tabular-nums">
                    {signal.previousValue} {signal.unit}
                  </span>
                </div>
                <div>
                  <Label variant="muted" className="text-[9px] uppercase tracking-widest mb-1">
                    Change
                  </Label>
                  <span className={cn("text-lg font-medium tabular-nums", trendColor)}>
                    {signal.change > 0 ? "+" : ""}
                    {signal.change} {signal.unit}
                  </span>
                </div>
              </div>

              {/* Anomaly badge */}
              {signal.anomalies && signal.anomalies.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#cbd5e1]/30">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-[#e63946]/5 border border-[#e63946]/20">
                    <AlertCircle className="w-5 h-5 text-[#e63946] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-[#e63946] block">
                        Anomaly Detected
                      </span>
                      <span className="text-xs text-[#e63946]/70">
                        {signal.anomalies[0].description}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data source card */}
            <div className="detail-animate mt-6 bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-[#64748b]" />
                <span className="text-sm font-medium text-[#0f172a]">Data Source</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748b] uppercase tracking-wider">Source</span>
                  <span className="text-sm font-medium text-[#0f172a]">{sourceInfo.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748b] uppercase tracking-wider">Frequency</span>
                  <span className="text-sm font-medium text-[#0f172a]">{sourceInfo.frequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748b] uppercase tracking-wider">Status</span>
                  <div className="flex items-center gap-1.5">
                    {isDataLive ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600">Live</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-[#64748b]" />
                        <span className="text-sm font-medium text-[#64748b]">Cached</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Charts and interpretation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart area */}
            <div className="detail-animate bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 md:p-8 shadow-lg">
              {/* View switcher */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setActiveView("indexed")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeView === "indexed"
                      ? "bg-[#0f172a] text-white"
                      : "bg-[#cbd5e1]/30 text-[#64748b] hover:bg-[#cbd5e1]/50"
                  )}
                >
                  Indexed Trend
                </button>
                <button
                  onClick={() => setActiveView("rate")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeView === "rate"
                      ? "bg-[#0f172a] text-white"
                      : "bg-[#cbd5e1]/30 text-[#64748b] hover:bg-[#cbd5e1]/50"
                  )}
                >
                  Rate of Change
                </button>
                <button
                  onClick={() => setActiveView("deviation")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeView === "deviation"
                      ? "bg-[#0f172a] text-white"
                      : "bg-[#cbd5e1]/30 text-[#64748b] hover:bg-[#cbd5e1]/50"
                  )}
                >
                  Deviation
                </button>
              </div>

              {/* Chart header */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#0f172a]">
                  {activeView === "indexed"
                    ? "Historical Trend"
                    : activeView === "rate"
                    ? "Rate of Change Over Time"
                    : "Deviation from Historical Mean"}
                </h3>
                <p className="text-sm text-[#64748b] mt-1">
                  {activeView === "indexed"
                    ? "Value trajectory over the observation period"
                    : activeView === "rate"
                    ? "Percent change between consecutive observations"
                    : "How far each point deviates from the average"}
                </p>
              </div>

              {/* Chart */}
              <div className="h-56 md:h-72 bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                {activeView === "indexed" && (
                  <SparklineChart
                    data={signal.sparklineHistory}
                    width={700}
                    height={240}
                    strokeWidth={2.5}
                    color={chartColor}
                    showArea
                    className="w-full h-full"
                  />
                )}
                {activeView === "rate" && (
                  <RateOfChangeChart
                    data={signal.sparklineHistory}
                    width={700}
                    height={240}
                    color={chartColor}
                    className="w-full h-full"
                  />
                )}
                {activeView === "deviation" && (
                  <DeviationChart
                    data={signal.sparklineHistory}
                    baseline={baseline}
                    width={700}
                    height={240}
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* Interpretation cards */}
            <div className="detail-animate grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-3">
                  What This Suggests
                </h4>
                <Text size="sm" className="text-[#475569] leading-relaxed">
                  {signal.interpretation.whatItMeans}
                </Text>
              </div>
              <div className="bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-3">
                  What It Does Not Claim
                </h4>
                <Text size="sm" className="text-[#475569] leading-relaxed">
                  {signal.interpretation.whatItDoesNotClaim}
                </Text>
              </div>
            </div>

            {/* Context card */}
            {signal.interpretation.context && (
              <div className="detail-animate bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">
                  Historical Context
                </h4>
                <Text size="base" className="text-white/90 leading-relaxed">
                  {signal.interpretation.context}
                </Text>
              </div>
            )}

            {/* Related signals */}
            {relatedSignals.length > 0 && (
              <div className="detail-animate">
                <h4 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-4">
                  Related Signals
                </h4>
                <div className="flex flex-wrap gap-3">
                  {relatedSignals.map((related) => (
                    <Link
                      key={related.id}
                      href={`/signals/${related.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#cbd5e1]/50 text-sm font-medium text-[#475569] hover:text-[#0f172a] hover:border-[#e63946]/30 hover:bg-white/80 transition-all"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      {related.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
