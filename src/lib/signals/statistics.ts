// Statistics utility functions for signal analysis
import { DataPoint } from "./types";

export interface SignalStats {
  min: { value: number; date: Date };
  max: { value: number; date: Date };
  mean: number;
  median: number;
  stdDev: number;
  variance: number;
  percentileRank: number; // Where current value sits (0-100)
  movingAverages: {
    ma7: number | null;
    ma30: number | null;
    ma90: number | null;
  };
  yoyChange: number | null; // Year-over-year change %
  trend: "accelerating" | "decelerating" | "stable";
  volatilityIndex: "low" | "moderate" | "high" | "extreme";
}

// Calculate comprehensive statistics from data points
export function calculateStats(data: DataPoint[], currentValue: number): SignalStats {
  if (data.length === 0) {
    return getDefaultStats();
  }

  const values = data.map(d => d.value);
  const n = values.length;

  // Min/Max with dates
  let minIdx = 0, maxIdx = 0;
  for (let i = 1; i < n; i++) {
    if (values[i] < values[minIdx]) minIdx = i;
    if (values[i] > values[maxIdx]) maxIdx = i;
  }

  // Mean
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // Median
  const sorted = [...values].sort((a, b) => a - b);
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
    : sorted[Math.floor(n/2)];

  // Standard deviation
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(variance);

  // Percentile rank of current value
  const belowCurrent = sorted.filter(v => v < currentValue).length;
  const percentileRank = (belowCurrent / n) * 100;

  // Moving averages
  const ma7 = n >= 7 ? average(values.slice(-7)) : null;
  const ma30 = n >= 30 ? average(values.slice(-30)) : null;
  const ma90 = n >= 90 ? average(values.slice(-90)) : null;

  // Year-over-year change (if we have 12+ months of data)
  let yoyChange: number | null = null;
  if (n >= 12) {
    const currentPeriod = values[n - 1];
    const yearAgoPeriod = values[n - 12];
    if (yearAgoPeriod !== 0) {
      yoyChange = ((currentPeriod - yearAgoPeriod) / Math.abs(yearAgoPeriod)) * 100;
    }
  }

  // Trend analysis (comparing recent vs older data)
  const trend = analyzeTrend(values);

  // Volatility classification
  const volatilityIndex = classifyVolatility(stdDev, mean);

  return {
    min: { value: values[minIdx], date: data[minIdx].date },
    max: { value: values[maxIdx], date: data[maxIdx].date },
    mean,
    median,
    stdDev,
    variance,
    percentileRank,
    movingAverages: { ma7, ma30, ma90 },
    yoyChange,
    trend,
    volatilityIndex,
  };
}

function average(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function analyzeTrend(values: number[]): "accelerating" | "decelerating" | "stable" {
  if (values.length < 6) return "stable";
  
  const recent = values.slice(-3);
  const older = values.slice(-6, -3);
  
  const recentAvg = average(recent);
  const olderAvg = average(older);
  
  const pctChange = ((recentAvg - olderAvg) / Math.abs(olderAvg)) * 100;
  
  if (pctChange > 5) return "accelerating";
  if (pctChange < -5) return "decelerating";
  return "stable";
}

function classifyVolatility(stdDev: number, mean: number): "low" | "moderate" | "high" | "extreme" {
  if (mean === 0) return "moderate";
  
  const cv = (stdDev / Math.abs(mean)) * 100; // Coefficient of variation
  
  if (cv < 10) return "low";
  if (cv < 25) return "moderate";
  if (cv < 50) return "high";
  return "extreme";
}

function getDefaultStats(): SignalStats {
  const now = new Date();
  return {
    min: { value: 0, date: now },
    max: { value: 0, date: now },
    mean: 0,
    median: 0,
    stdDev: 0,
    variance: 0,
    percentileRank: 50,
    movingAverages: { ma7: null, ma30: null, ma90: null },
    yoyChange: null,
    trend: "stable",
    volatilityIndex: "moderate",
  };
}

// Format helpers
export function formatStatValue(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatPercentile(percentile: number): string {
  const p = Math.round(percentile);
  const suffix = p === 1 ? "st" : p === 2 ? "nd" : p === 3 ? "rd" : "th";
  return `${p}${suffix}`;
}

export function getVolatilityColor(level: SignalStats["volatilityIndex"]): string {
  switch (level) {
    case "low": return "text-emerald-600";
    case "moderate": return "text-amber-600";
    case "high": return "text-orange-600";
    case "extreme": return "text-red-600";
  }
}

export function getTrendIcon(trend: SignalStats["trend"]): string {
  switch (trend) {
    case "accelerating": return "↗";
    case "decelerating": return "↘";
    case "stable": return "→";
  }
}
