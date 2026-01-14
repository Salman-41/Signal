import { Signal, SignalCategory, DataPoint, ComparisonData } from "./types";

// Generate realistic sparkline data
function generateSparkline(
  baseValue: number,
  volatility: number,
  trend: number,
  points: number = 30
): DataPoint[] {
  const data: DataPoint[] = [];
  let value = baseValue;
  const now = new Date();

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Add trend and random noise
    value = value * (1 + trend / 100) + (Math.random() - 0.5) * volatility;
    data.push({ date, value: Math.max(0, value) });
  }

  return data;
}

// Calculate trend from sparkline
function calculateTrend(data: DataPoint[]): "up" | "down" | "flat" {
  if (data.length < 2) return "flat";
  const recent = data.slice(-7);
  const avgRecent = recent.reduce((a, b) => a + b.value, 0) / recent.length;
  const older = data.slice(0, 7);
  const avgOlder = older.reduce((a, b) => a + b.value, 0) / older.length;
  const change = ((avgRecent - avgOlder) / avgOlder) * 100;
  if (change > 2) return "up";
  if (change < -2) return "down";
  return "flat";
}

// Economic signals
const gdpGrowth: Signal = {
  id: "gdp-growth",
  title: "GDP Growth Rate",
  subtitle: "United States, Quarterly",
  category: "economic",
  currentValue: 2.8,
  previousValue: 2.4,
  change: 0.4,
  changePercent: 16.67,
  trend: "up",
  sparklineHistory: generateSparkline(2.2, 0.3, 0.5, 30),
  source: {
    name: "FRED",
    url: "https://fred.stlouisfed.org/series/GDP",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 3600000),
  },
  unit: "%",
  interpretation: {
    whatItMeans:
      "Economic output is expanding at a moderate pace, suggesting continued growth momentum.",
    whatItDoesNotClaim:
      "Does not predict future quarters or account for sector-specific variations.",
    context: "Above the 2% historical average but below peak expansion rates.",
  },
};

const inflationRate: Signal = {
  id: "inflation-cpi",
  title: "Inflation Rate",
  subtitle: "Consumer Price Index, YoY",
  category: "economic",
  currentValue: 3.2,
  previousValue: 3.4,
  change: -0.2,
  changePercent: -5.88,
  trend: "down",
  sparklineHistory: generateSparkline(4.5, 0.4, -1.2, 30),
  source: {
    name: "FRED",
    url: "https://fred.stlouisfed.org/series/CPIAUCSL",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 3600000),
  },
  unit: "%",
  interpretation: {
    whatItMeans:
      "Price pressures are easing gradually, moving toward target levels.",
    whatItDoesNotClaim:
      "Does not guarantee future rate decisions or sector-specific price movements.",
    context: "Still elevated relative to the 2% target but trending favorably.",
  },
};

const unemploymentRate: Signal = {
  id: "unemployment",
  title: "Unemployment Rate",
  subtitle: "Seasonally Adjusted",
  category: "economic",
  currentValue: 3.9,
  previousValue: 3.7,
  change: 0.2,
  changePercent: 5.41,
  trend: "up",
  sparklineHistory: generateSparkline(3.5, 0.2, 0.3, 30),
  source: {
    name: "FRED",
    url: "https://fred.stlouisfed.org/series/UNRATE",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 3600000),
  },
  unit: "%",
  interpretation: {
    whatItMeans:
      "Labor market remains tight but showing signs of gradual cooling.",
    whatItDoesNotClaim:
      "Does not reflect underemployment or labor force participation changes.",
    context: "Still historically low, near natural unemployment estimates.",
  },
};

const consumerSentiment: Signal = {
  id: "consumer-sentiment",
  title: "Consumer Sentiment",
  subtitle: "University of Michigan Index",
  category: "economic",
  currentValue: 67.4,
  previousValue: 63.8,
  change: 3.6,
  changePercent: 5.64,
  trend: "up",
  sparklineHistory: generateSparkline(62, 4, 0.8, 30),
  source: {
    name: "University of Michigan",
    url: "http://www.sca.isr.umich.edu/",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 86400000),
  },
  unit: "index",
  interpretation: {
    whatItMeans:
      "Consumer confidence is recovering, suggesting potential spending increases.",
    whatItDoesNotClaim:
      "Does not directly predict retail sales or economic output.",
    context: "Below pre-pandemic highs but improving from recent lows.",
  },
};

// Climate signals
const globalTempAnomaly: Signal = {
  id: "temp-anomaly",
  title: "Global Temperature Anomaly",
  subtitle: "Deviation from 1951-1980 Average",
  category: "climate",
  currentValue: 1.42,
  previousValue: 1.35,
  change: 0.07,
  changePercent: 5.19,
  trend: "up",
  sparklineHistory: generateSparkline(1.2, 0.08, 0.3, 30),
  source: {
    name: "NASA GISS",
    url: "https://data.giss.nasa.gov/gistemp/",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 21600000),
  },
  unit: "°C",
  interpretation: {
    whatItMeans:
      "Global temperatures continue to exceed historical baselines significantly.",
    whatItDoesNotClaim:
      "Does not attribute specific weather events to climate change.",
    context: "Approaching 1.5°C threshold outlined in Paris Agreement.",
  },
  anomalies: [
    {
      timestamp: new Date(Date.now() - 86400000 * 5),
      severity: "high",
      description: "Record monthly anomaly for this time of year",
    },
  ],
};

const arcticSeaIce: Signal = {
  id: "arctic-ice",
  title: "Arctic Sea Ice Extent",
  subtitle: "Million Square Kilometers",
  category: "climate",
  currentValue: 4.28,
  previousValue: 4.67,
  change: -0.39,
  changePercent: -8.35,
  trend: "down",
  sparklineHistory: generateSparkline(5.2, 0.3, -1.5, 30),
  source: {
    name: "NSIDC",
    url: "https://nsidc.org/arcticseaicenews/",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 86400000),
  },
  unit: "M km²",
  interpretation: {
    whatItMeans:
      "Sea ice coverage continues below historical averages for this season.",
    whatItDoesNotClaim: "Does not predict ice-free Arctic timelines.",
    context: "Following long-term declining trend observed since 1979.",
  },
};

const co2Concentration: Signal = {
  id: "co2-level",
  title: "Atmospheric CO₂",
  subtitle: "Mauna Loa Observatory",
  category: "climate",
  currentValue: 424.8,
  previousValue: 422.1,
  change: 2.7,
  changePercent: 0.64,
  trend: "up",
  sparklineHistory: generateSparkline(418, 1.5, 0.15, 30),
  source: {
    name: "NOAA",
    url: "https://gml.noaa.gov/ccgg/trends/",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 86400000),
  },
  unit: "ppm",
  interpretation: {
    whatItMeans:
      "CO₂ levels continue to rise, maintaining the long-term upward trajectory.",
    whatItDoesNotClaim:
      "Does not directly correlate to specific temperature outcomes.",
    context: "Highest levels in at least 800,000 years based on ice core data.",
  },
};

// Tech signals
const aiAdoption: Signal = {
  id: "ai-adoption",
  title: "AI/ML Adoption Index",
  subtitle: "Enterprise Implementation Rate",
  category: "tech",
  currentValue: 67,
  previousValue: 54,
  change: 13,
  changePercent: 24.07,
  trend: "up",
  sparklineHistory: generateSparkline(42, 5, 2.5, 30),
  source: {
    name: "Stack Overflow Trends",
    url: "https://insights.stackoverflow.com/trends",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 86400000),
  },
  unit: "%",
  interpretation: {
    whatItMeans:
      "AI tool adoption is accelerating across enterprise development workflows.",
    whatItDoesNotClaim:
      "Does not measure productivity gains or job displacement.",
    context: "Fastest technology adoption curve in recent developer surveys.",
  },
};

const rustGrowth: Signal = {
  id: "rust-growth",
  title: "Rust Language Growth",
  subtitle: "Year-over-Year Developer Interest",
  category: "tech",
  currentValue: 34.2,
  previousValue: 28.1,
  change: 6.1,
  changePercent: 21.71,
  trend: "up",
  sparklineHistory: generateSparkline(22, 3, 1.8, 30),
  source: {
    name: "GitHub",
    url: "https://github.com/trending",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 86400000),
  },
  unit: "% YoY",
  interpretation: {
    whatItMeans:
      "Systems programming interest continues shifting toward memory-safe languages.",
    whatItDoesNotClaim: "Does not indicate C/C++ replacement timelines.",
    context: "Consistently ranked 'most loved' language in developer surveys.",
  },
};

const cloudNativeAdoption: Signal = {
  id: "cloud-native",
  title: "Cloud-Native Adoption",
  subtitle: "Kubernetes Workload Share",
  category: "tech",
  currentValue: 78,
  previousValue: 71,
  change: 7,
  changePercent: 9.86,
  trend: "up",
  sparklineHistory: generateSparkline(58, 4, 1.2, 30),
  source: {
    name: "CNCF Survey",
    url: "https://www.cncf.io/reports/",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 604800000),
  },
  unit: "%",
  interpretation: {
    whatItMeans:
      "Container orchestration is becoming the default for production workloads.",
    whatItDoesNotClaim: "Does not reflect complexity or operational costs.",
    context: "Enterprise adoption accelerated post-pandemic.",
  },
};

// Social signals
const remoteWorkInterest: Signal = {
  id: "remote-work",
  title: "Remote Work Interest",
  subtitle: "Google Trends Index",
  category: "social",
  currentValue: 72,
  previousValue: 68,
  change: 4,
  changePercent: 5.88,
  trend: "flat",
  sparklineHistory: generateSparkline(75, 8, -0.2, 30),
  source: {
    name: "Google Trends",
    url: "https://trends.google.com/trends/",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 3600000),
  },
  unit: "index",
  interpretation: {
    whatItMeans:
      "Interest in remote work arrangements has stabilized at elevated levels.",
    whatItDoesNotClaim: "Does not measure actual remote work adoption rates.",
    context: "Normalized from pandemic peaks but above pre-2020 baseline.",
  },
};

const mentalHealthAwareness: Signal = {
  id: "mental-health",
  title: "Mental Health Awareness",
  subtitle: "Search Interest Index",
  category: "social",
  currentValue: 84,
  previousValue: 79,
  change: 5,
  changePercent: 6.33,
  trend: "up",
  sparklineHistory: generateSparkline(68, 6, 1.1, 30),
  source: {
    name: "Google Trends",
    url: "https://trends.google.com/trends/",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 3600000),
  },
  unit: "index",
  interpretation: {
    whatItMeans:
      "Public interest in mental health topics continues to grow steadily.",
    whatItDoesNotClaim:
      "Does not indicate access to care or treatment outcomes.",
    context: "Part of broader destigmatization trend in public discourse.",
  },
};

const climateActionInterest: Signal = {
  id: "climate-action",
  title: "Climate Action Interest",
  subtitle: "Search & Social Mentions",
  category: "social",
  currentValue: 61,
  previousValue: 58,
  change: 3,
  changePercent: 5.17,
  trend: "up",
  sparklineHistory: generateSparkline(52, 7, 0.6, 30),
  source: {
    name: "Google Trends",
    url: "https://trends.google.com/trends/",
    lastFetched: new Date(),
    nextRefresh: new Date(Date.now() + 3600000),
  },
  unit: "index",
  interpretation: {
    whatItMeans:
      "Public engagement with climate topics shows sustained interest.",
    whatItDoesNotClaim:
      "Does not measure behavioral changes or policy support.",
    context: "Correlates with extreme weather events and COP conferences.",
  },
};

// Export all signals
export const mockSignals: Signal[] = [
  gdpGrowth,
  inflationRate,
  unemploymentRate,
  consumerSentiment,
  globalTempAnomaly,
  arcticSeaIce,
  co2Concentration,
  aiAdoption,
  rustGrowth,
  cloudNativeAdoption,
  remoteWorkInterest,
  mentalHealthAwareness,
  climateActionInterest,
];

export const signalsByCategory: Record<SignalCategory, Signal[]> = {
  economic: [gdpGrowth, inflationRate, unemploymentRate, consumerSentiment],
  climate: [globalTempAnomaly, arcticSeaIce, co2Concentration],
  tech: [aiAdoption, rustGrowth, cloudNativeAdoption],
  social: [remoteWorkInterest, mentalHealthAwareness, climateActionInterest],
};

// Comparison data
export const mockComparisons: ComparisonData[] = [
  {
    id: "inflation-vs-sentiment",
    title: "Inflation vs Consumer Sentiment",
    seriesA: {
      label: "Inflation Rate (%)",
      data: inflationRate.sparklineHistory,
      color: "#d97706",
    },
    seriesB: {
      label: "Consumer Sentiment (indexed)",
      data: consumerSentiment.sparklineHistory.map((d) => ({
        ...d,
        value: d.value / 20, // Scale to similar range
      })),
      color: "#0284c7",
    },
    divergencePoints: [
      {
        date: new Date(Date.now() - 86400000 * 15),
        description: "Sentiment began recovering despite elevated inflation",
      },
    ],
  },
  {
    id: "temp-vs-co2",
    title: "Temperature Anomaly vs CO₂ Levels",
    seriesA: {
      label: "Temperature Anomaly (°C)",
      data: globalTempAnomaly.sparklineHistory,
      color: "#dc2626",
    },
    seriesB: {
      label: "CO₂ (ppm, scaled)",
      data: co2Concentration.sparklineHistory.map((d) => ({
        ...d,
        value: (d.value - 400) / 20, // Scale to similar range
      })),
      color: "#64748b",
    },
  },
];

// Featured signal for hero
export const featuredSignal = globalTempAnomaly;

// Get signal by ID
export function getSignalById(id: string): Signal | undefined {
  return mockSignals.find((s) => s.id === id);
}

// Get signals by category
export function getSignalsByCategory(category: SignalCategory): Signal[] {
  return signalsByCategory[category] || [];
}
