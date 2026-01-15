"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Section, Container } from "@/components/layout/Section";
import { Heading, Text } from "@/components/layout/Typography";
import { Signal } from "@/lib/signals/types";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  ArrowUpRight,
  Zap,
  AlertTriangle,
} from "lucide-react";

interface TrendingSignalsSectionProps {
  signals: Signal[];
  className?: string;
}

export function TrendingSignalsSection({ signals, className }: TrendingSignalsSectionProps) {
  // Calculate "heat" score based on change magnitude
  const rankedSignals = useMemo(() => {
    return signals
      .map(signal => ({
        ...signal,
        heatScore: Math.abs(signal.changePercent) * (signal.trend === "up" ? 1.2 : 1),
        isVolatile: Math.abs(signal.changePercent) > 3,
      }))
      .sort((a, b) => b.heatScore - a.heatScore)
      .slice(0, 5);
  }, [signals]);

  const getTrendColor = (trend: Signal["trend"], isVolatile: boolean) => {
    if (isVolatile) return "text-red-600";
    if (trend === "up") return "text-emerald-600";
    if (trend === "down") return "text-amber-600";
    return "text-[#64748b]";
  };

  const TrendIcon = ({ trend }: { trend: Signal["trend"] }) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <Section className={cn("py-16 md:py-24 bg-gradient-to-b from-[#0f172a] to-[#1e293b]", className)}>
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-6 h-6 text-[#e63946]" />
              <Heading as="h2" size="section" className="text-white">
                Trending Now
              </Heading>
            </div>
            <Text size="base" className="text-white/60">
              Signals with the most significant recent changes
            </Text>
          </div>
          
          <Link
            href="/#live-signals"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-medium text-white hover:bg-white/20 transition-all"
          >
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Trending List */}
        <div className="space-y-4">
          {rankedSignals.map((signal, index) => (
            <Link
              key={signal.id}
              href={`/signals/${signal.id}`}
              className="group flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#e63946]/30 transition-all font-mono"
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 text-white font-bold text-base md:text-lg shrink-0">
                {index + 1}
              </div>

              {/* Signal Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                  <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[#e63946] transition-colors truncate">
                    {signal.title}
                  </h3>
                  {signal.isVolatile && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold uppercase w-fit">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Volatile
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-white/50 truncate">
                  {signal.subtitle}
                </p>
              </div>

              {/* Data Display - Stacked on mobile */}
              <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-8 shrink-0">
                <div className="text-right">
                  <div className="text-lg md:text-2xl font-bold text-white tabular-nums">
                    {signal.currentValue}
                    <span className="text-[10px] md:text-sm text-white/50 ml-1">{signal.unit}</span>
                  </div>
                </div>

                <div className={cn(
                  "flex items-center gap-1.5 md:min-w-[100px] justify-end",
                  getTrendColor(signal.trend, signal.isVolatile)
                )}>
                  <TrendIcon trend={signal.trend} />
                  <span className="text-base md:text-lg font-bold tabular-nums">
                    {signal.changePercent > 0 ? "+" : ""}
                    {signal.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Arrow - Hidden on very small mobile */}
              <ArrowUpRight className="hidden sm:block w-5 h-5 text-white/30 group-hover:text-[#e63946] transition-colors shrink-0" />
            </Link>
          ))}
        </div>

        {/* Heat Legend */}
        <div className="flex items-center justify-center gap-8 mt-10 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-white/50">Gaining</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-white/50">Declining</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-white/50">High Volatility</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
