"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { DataPoint } from "@/lib/signals/types";
import {
  calculateStats,
  formatStatValue,
  formatPercentile,
  getVolatilityColor,
  getTrendIcon,
  SignalStats,
} from "@/lib/signals/statistics";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Activity,
  Target,
  Calendar,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface StatsPanelProps {
  data: DataPoint[];
  currentValue: number;
  unit: string;
  className?: string;
}

export function StatsPanel({ data, currentValue, unit, className }: StatsPanelProps) {
  const stats = useMemo(() => calculateStats(data, currentValue), [data, currentValue]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-[#64748b]" />
        <span className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
          Statistical Analysis
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Min Value */}
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
              Historical Low
            </span>
          </div>
          <div className="text-xl font-bold text-[#0f172a] tabular-nums">
            {formatStatValue(stats.min.value)} <span className="text-sm font-normal text-[#64748b]">{unit}</span>
          </div>
          <div className="text-[10px] text-[#94a3b8] mt-1">
            {formatDate(stats.min.date)}
          </div>
        </div>

        {/* Max Value */}
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-4 h-4 text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
              Historical High
            </span>
          </div>
          <div className="text-xl font-bold text-[#0f172a] tabular-nums">
            {formatStatValue(stats.max.value)} <span className="text-sm font-normal text-[#64748b]">{unit}</span>
          </div>
          <div className="text-[10px] text-[#94a3b8] mt-1">
            {formatDate(stats.max.date)}
          </div>
        </div>

        {/* Volatility */}
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-[#64748b]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
              Volatility
            </span>
          </div>
          <div className={cn("text-lg font-bold capitalize", getVolatilityColor(stats.volatilityIndex))}>
            {stats.volatilityIndex}
          </div>
          <div className="text-[10px] text-[#94a3b8] mt-1">
            σ = {formatStatValue(stats.stdDev)}
          </div>
        </div>

        {/* Percentile */}
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#64748b]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
              Percentile
            </span>
          </div>
          <div className="text-xl font-bold text-[#0f172a]">
            {formatPercentile(stats.percentileRank)}
          </div>
          <div className="text-[10px] text-[#94a3b8] mt-1">
            vs. historical range
          </div>
        </div>
      </div>

      {/* Moving Averages */}
      <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="w-4 h-4 text-[#64748b]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Moving Averages
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between sm:block border-b sm:border-none border-[#e2e8f0] pb-2 sm:pb-0">
            <div className="text-[10px] text-[#94a3b8] mb-1">7-Period</div>
            <div className="text-sm font-bold text-[#0f172a] tabular-nums">
              {stats.movingAverages.ma7 !== null ? formatStatValue(stats.movingAverages.ma7) : "—"}
            </div>
          </div>
          <div className="flex items-center justify-between sm:block border-b sm:border-none border-[#e2e8f0] py-2 sm:py-0">
            <div className="text-[10px] text-[#94a3b8] mb-1">30-Period</div>
            <div className="text-sm font-bold text-[#0f172a] tabular-nums">
              {stats.movingAverages.ma30 !== null ? formatStatValue(stats.movingAverages.ma30) : "—"}
            </div>
          </div>
          <div className="flex items-center justify-between sm:block pt-2 sm:pt-0">
            <div className="text-[10px] text-[#94a3b8] mb-1">90-Period</div>
            <div className="text-sm font-bold text-[#0f172a] tabular-nums">
              {stats.movingAverages.ma90 !== null ? formatStatValue(stats.movingAverages.ma90) : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* YoY & Trend */}
      <div className="grid grid-cols-2 gap-4">
        {/* Year over Year */}
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[#64748b]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
              YoY Change
            </span>
          </div>
          {stats.yoyChange !== null ? (
            <div className={cn(
              "text-lg font-bold tabular-nums",
              stats.yoyChange > 0 ? "text-emerald-600" : stats.yoyChange < 0 ? "text-red-600" : "text-[#64748b]"
            )}>
              {stats.yoyChange > 0 ? "+" : ""}{formatStatValue(stats.yoyChange)}%
            </div>
          ) : (
            <div className="text-lg font-bold text-[#cbd5e1]">—</div>
          )}
        </div>

        {/* Trend Direction */}
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center gap-2 mb-2">
            {stats.trend === "accelerating" ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : stats.trend === "decelerating" ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <Minus className="w-4 h-4 text-[#64748b]" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
              Trend
            </span>
          </div>
          <div className={cn(
            "text-lg font-bold capitalize",
            stats.trend === "accelerating" ? "text-emerald-600" : 
            stats.trend === "decelerating" ? "text-red-600" : "text-[#64748b]"
          )}>
            {stats.trend} {getTrendIcon(stats.trend)}
          </div>
        </div>
      </div>

      {/* Mean & Median */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm border-t border-[#e2e8f0] pt-4">
        <div>
          <span className="text-[#94a3b8]">Mean:</span>{" "}
          <span className="font-medium text-[#0f172a] tabular-nums">{formatStatValue(stats.mean)} {unit}</span>
        </div>
        <div>
          <span className="text-[#94a3b8]">Median:</span>{" "}
          <span className="font-medium text-[#0f172a] tabular-nums">{formatStatValue(stats.median)} {unit}</span>
        </div>
      </div>
    </div>
  );
}
