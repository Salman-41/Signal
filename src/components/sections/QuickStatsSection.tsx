"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Section, Container } from "@/components/layout/Section";
import { Heading, Text } from "@/components/layout/Typography";
import { Signal } from "@/lib/signals/types";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Thermometer,
  Cpu,
  Users,
  BarChart3,
} from "lucide-react";

interface QuickStatsSectionProps {
  signals: Signal[];
  className?: string;
}

export function QuickStatsSection({ signals, className }: QuickStatsSectionProps) {
  // Calculate summary statistics
  const stats = React.useMemo(() => {
    const up = signals.filter(s => s.trend === "up").length;
    const down = signals.filter(s => s.trend === "down").length;
    const stable = signals.length - up - down;
    
    const avgChange = signals.reduce((sum, s) => sum + Math.abs(s.changePercent), 0) / signals.length;
    
    const byCategory = {
      economic: signals.filter(s => s.category === "economic"),
      climate: signals.filter(s => s.category === "climate"),
      tech: signals.filter(s => s.category === "tech"),
      social: signals.filter(s => s.category === "social"),
    };

    const categoryHealth = Object.entries(byCategory).map(([cat, sigs]) => {
      const catUp = sigs.filter(s => s.trend === "up").length;
      const catDown = sigs.filter(s => s.trend === "down").length;
      return {
        category: cat,
        total: sigs.length,
        up: catUp,
        down: catDown,
        sentiment: catUp > catDown ? "positive" : catDown > catUp ? "negative" : "neutral",
      };
    });

    return {
      total: signals.length,
      up,
      down,
      stable,
      avgChange: avgChange.toFixed(1),
      categoryHealth,
    };
  }, [signals]);

  const categoryIcons = {
    economic: Globe,
    climate: Thermometer,
    tech: Cpu,
    social: Users,
  };

  const categoryLabels = {
    economic: "Economic",
    climate: "Climate",
    tech: "Technology",
    social: "Social",
  };

  return (
    <Section className={cn("py-16 md:py-24 bg-[#f8fafc]", className)}>
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-[#e63946]" />
            <Heading as="h2" size="section" className="text-[#0f172a]">
              Market Pulse
            </Heading>
          </div>
          <Text size="base" muted className="max-w-2xl mx-auto">
            Real-time overview of signal movements and market sentiment
          </Text>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {/* Total Signals */}
          <div className="p-5 md:p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 md:w-5 h-5 text-[#64748b]" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#64748b]">
                Active Signals
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#0f172a]">{stats.total}</div>
          </div>

          {/* Rising */}
          <div className="p-5 md:p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 md:w-5 h-5 text-emerald-600" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-emerald-600">
                Rising
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-emerald-700">{stats.up}</div>
          </div>

          {/* Declining */}
          <div className="p-5 md:p-6 rounded-2xl bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 md:w-5 h-5 text-red-600" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-red-600">
                Declining
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-red-700">{stats.down}</div>
          </div>

          {/* Avg Change */}
          <div className="p-5 md:p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 md:w-5 h-5 text-[#64748b]" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#64748b]">
                Avg Change
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#0f172a]">±{stats.avgChange}%</div>
          </div>
        </div>

        {/* Category Health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.categoryHealth.map((cat) => {
            const Icon = categoryIcons[cat.category as keyof typeof categoryIcons];
            const label = categoryLabels[cat.category as keyof typeof categoryLabels];
            
            return (
              <div
                key={cat.category}
                className={cn(
                  "p-5 rounded-xl border transition-all hover:shadow-md",
                  cat.sentiment === "positive" ? "bg-emerald-50/50 border-emerald-200" :
                  cat.sentiment === "negative" ? "bg-red-50/50 border-red-200" :
                  "bg-white border-[#e2e8f0]"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn(
                      "w-5 h-5",
                      cat.sentiment === "positive" ? "text-emerald-600" :
                      cat.sentiment === "negative" ? "text-red-600" :
                      "text-[#64748b]"
                    )} />
                    <span className="text-sm font-bold text-[#0f172a]">{label}</span>
                  </div>
                  <span className={cn(
                    "text-lg font-bold",
                    cat.sentiment === "positive" ? "text-emerald-600" :
                    cat.sentiment === "negative" ? "text-red-600" :
                    "text-[#64748b]"
                  )}>
                    {cat.sentiment === "positive" ? "↑" : cat.sentiment === "negative" ? "↓" : "→"}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-emerald-600">▲ {cat.up}</span>
                  <span className="text-red-600">▼ {cat.down}</span>
                  <span className="text-[#94a3b8] ml-auto">{cat.total} signals</span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
