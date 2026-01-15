"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { DataPoint } from "@/lib/signals/types";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface ForecastPanelProps {
  data: DataPoint[];
  currentValue: number;
  unit: string;
  className?: string;
}

interface Forecast {
  shortTerm: { value: number; confidence: number; direction: "up" | "down" | "stable" };
  mediumTerm: { value: number; confidence: number; direction: "up" | "down" | "stable" };
  longTerm: { value: number; confidence: number; direction: "up" | "down" | "stable" };
  volatilityAlert: boolean;
  trendStrength: "weak" | "moderate" | "strong";
}

// Simple linear regression for trend forecasting
function linearRegression(data: DataPoint[]): { slope: number; intercept: number; r2: number } {
  const n = data.length;
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((sum, d) => sum + d.value, 0) / n;

  let ssXY = 0;
  let ssXX = 0;
  let ssYY = 0;

  data.forEach((d, i) => {
    const xDiff = i - xMean;
    const yDiff = d.value - yMean;
    ssXY += xDiff * yDiff;
    ssXX += xDiff * xDiff;
    ssYY += yDiff * yDiff;
  });

  const slope = ssXX !== 0 ? ssXY / ssXX : 0;
  const intercept = yMean - slope * xMean;
  const r2 = ssYY !== 0 ? (ssXY * ssXY) / (ssXX * ssYY) : 0;

  return { slope, intercept, r2 };
}

function calculateForecast(data: DataPoint[], currentValue: number): Forecast {
  if (data.length < 5) {
    return {
      shortTerm: { value: currentValue, confidence: 0.3, direction: "stable" },
      mediumTerm: { value: currentValue, confidence: 0.2, direction: "stable" },
      longTerm: { value: currentValue, confidence: 0.1, direction: "stable" },
      volatilityAlert: false,
      trendStrength: "weak",
    };
  }

  const { slope, r2 } = linearRegression(data);
  const n = data.length;

  // Calculate volatility
  const values = data.map(d => d.value);
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
  const volatility = Math.sqrt(variance) / Math.abs(mean);

  // Project future values
  const shortTermValue = currentValue + slope * 3; // 3 periods ahead
  const mediumTermValue = currentValue + slope * 12; // 12 periods ahead
  const longTermValue = currentValue + slope * 24; // 24 periods ahead

  // Calculate confidence based on R² and volatility
  const baseConfidence = Math.min(r2 + 0.1, 0.95);
  const volatilityPenalty = Math.min(volatility * 0.5, 0.4);

  const shortTermConfidence = Math.max(baseConfidence - volatilityPenalty, 0.2);
  const mediumTermConfidence = Math.max(shortTermConfidence - 0.15, 0.15);
  const longTermConfidence = Math.max(mediumTermConfidence - 0.2, 0.1);

  const getDirection = (current: number, projected: number): "up" | "down" | "stable" => {
    const pctChange = ((projected - current) / Math.abs(current)) * 100;
    if (pctChange > 2) return "up";
    if (pctChange < -2) return "down";
    return "stable";
  };

  // Determine trend strength
  const trendStrength: "weak" | "moderate" | "strong" = 
    r2 > 0.7 ? "strong" : r2 > 0.4 ? "moderate" : "weak";

  return {
    shortTerm: {
      value: shortTermValue,
      confidence: shortTermConfidence,
      direction: getDirection(currentValue, shortTermValue),
    },
    mediumTerm: {
      value: mediumTermValue,
      confidence: mediumTermConfidence,
      direction: getDirection(currentValue, mediumTermValue),
    },
    longTerm: {
      value: longTermValue,
      confidence: longTermConfidence,
      direction: getDirection(currentValue, longTermValue),
    },
    volatilityAlert: volatility > 0.3,
    trendStrength,
  };
}

export function ForecastPanel({ data, currentValue, unit, className }: ForecastPanelProps) {
  const forecast = useMemo(() => calculateForecast(data, currentValue), [data, currentValue]);

  const DirectionIcon = ({ direction }: { direction: "up" | "down" | "stable" }) => {
    if (direction === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (direction === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-[#64748b]" />;
  };

  const formatValue = (value: number) => {
    return value.toFixed(1);
  };

  const formatConfidence = (confidence: number) => {
    return Math.round(confidence * 100);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "bg-emerald-500";
    if (confidence >= 0.4) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#64748b]" />
          <span className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
            Trend Forecast
          </span>
        </div>
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded",
          forecast.trendStrength === "strong" ? "bg-emerald-100 text-emerald-700" :
          forecast.trendStrength === "moderate" ? "bg-amber-100 text-amber-700" :
          "bg-[#f1f5f9] text-[#64748b]"
        )}>
          {forecast.trendStrength} trend
        </span>
      </div>

      {/* Volatility Alert */}
      {forecast.volatilityAlert && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs text-amber-700">
            High volatility detected — forecasts may have wider margins of error
          </span>
        </div>
      )}

      {/* Forecast Cards */}
      <div className="space-y-3">
        {/* Short Term */}
        <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#64748b]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                Short Term (3 periods)
              </span>
            </div>
            <DirectionIcon direction={forecast.shortTerm.direction} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-[#0f172a] tabular-nums">
                {formatValue(forecast.shortTerm.value)}
              </span>
              <span className="text-sm text-[#64748b] ml-1">{unit}</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#94a3b8] mb-1">Confidence</div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", getConfidenceColor(forecast.shortTerm.confidence))}
                    style={{ width: `${formatConfidence(forecast.shortTerm.confidence)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#0f172a]">
                  {formatConfidence(forecast.shortTerm.confidence)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Medium Term */}
        <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#64748b]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                Medium Term (12 periods)
              </span>
            </div>
            <DirectionIcon direction={forecast.mediumTerm.direction} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-[#0f172a] tabular-nums">
                {formatValue(forecast.mediumTerm.value)}
              </span>
              <span className="text-sm text-[#64748b] ml-1">{unit}</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#94a3b8] mb-1">Confidence</div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", getConfidenceColor(forecast.mediumTerm.confidence))}
                    style={{ width: `${formatConfidence(forecast.mediumTerm.confidence)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#0f172a]">
                  {formatConfidence(forecast.mediumTerm.confidence)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Long Term */}
        <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#64748b]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                Long Term (24 periods)
              </span>
            </div>
            <DirectionIcon direction={forecast.longTerm.direction} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-[#0f172a] tabular-nums">
                {formatValue(forecast.longTerm.value)}
              </span>
              <span className="text-sm text-[#64748b] ml-1">{unit}</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#94a3b8] mb-1">Confidence</div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", getConfidenceColor(forecast.longTerm.confidence))}
                    style={{ width: `${formatConfidence(forecast.longTerm.confidence)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#0f172a]">
                  {formatConfidence(forecast.longTerm.confidence)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-[#94a3b8] leading-relaxed">
        Forecasts are based on linear regression of historical data and should not be considered financial or professional advice.
      </p>
    </div>
  );
}
