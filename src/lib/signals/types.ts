export type SignalCategory = "economic" | "climate" | "tech" | "social";

export type TrendDirection = "up" | "down" | "flat";

export type AnomalySeverity = "low" | "medium" | "high";

export interface DataPoint {
  date: Date;
  value: number;
}

export interface SignalSource {
  name: string;
  url: string;
  lastFetched: Date;
  nextRefresh: Date;
}

export interface SignalAnomaly {
  timestamp: Date;
  severity: AnomalySeverity;
  description: string;
}

export interface SignalInterpretation {
  whatItMeans: string;
  whatItDoesNotClaim: string;
  context?: string;
}

export interface Signal {
  id: string;
  title: string;
  subtitle?: string;
  category: SignalCategory;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: TrendDirection;
  sparklineHistory: DataPoint[];
  source: SignalSource;
  unit: string;
  interpretation: SignalInterpretation;
  anomalies?: SignalAnomaly[];
}

export interface SignalGroup {
  category: SignalCategory;
  title: string;
  description: string;
  signals: Signal[];
}

export interface ComparisonData {
  id: string;
  title: string;
  seriesA: {
    label: string;
    data: DataPoint[];
    color: string;
  };
  seriesB: {
    label: string;
    data: DataPoint[];
    color: string;
  };
  divergencePoints?: {
    date: Date;
    description: string;
  }[];
}

// API Response types
export interface FREDObservation {
  date: string;
  value: string;
}

export interface FREDResponse {
  observations: FREDObservation[];
}

// Category metadata
export const CATEGORY_META: Record<
  SignalCategory,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  economic: {
    label: "Economic",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Growth, inflation, employment, sectoral shifts",
  },
  climate: {
    label: "Climate",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Temperature anomalies, extreme events, patterns",
  },
  tech: {
    label: "Technology",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    description: "Framework trends, adoption curves, shifts",
  },
  social: {
    label: "Public Interest",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    description: "Search spikes, trending topics, sentiment",
  },
};
