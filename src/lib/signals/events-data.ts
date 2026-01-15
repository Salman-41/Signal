// Historical events database for signal context
// Major economic, climate, and social events that impact signals

export interface HistoricalEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  category: "economic" | "climate" | "technology" | "social" | "geopolitical";
  impact: "positive" | "negative" | "neutral";
  signalIds: string[]; // Which signals this event affects
  magnitude: 1 | 2 | 3; // 1=minor, 2=moderate, 3=major
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // Economic Events
  {
    id: "covid-pandemic",
    date: new Date("2020-03-11"),
    title: "COVID-19 Pandemic Declared",
    description: "WHO declares COVID-19 a global pandemic, triggering unprecedented economic shutdowns worldwide.",
    category: "economic",
    impact: "negative",
    signalIds: ["gdp-growth", "unemployment", "consumer-sentiment", "remote-work"],
    magnitude: 3,
  },
  {
    id: "fed-rate-hike-2022",
    date: new Date("2022-03-16"),
    title: "Federal Reserve Begins Rate Hikes",
    description: "Fed raises interest rates for the first time since 2018, beginning aggressive tightening cycle.",
    category: "economic",
    impact: "neutral",
    signalIds: ["gdp-growth", "inflation-cpi", "consumer-sentiment"],
    magnitude: 3,
  },
  {
    id: "svb-collapse",
    date: new Date("2023-03-10"),
    title: "Silicon Valley Bank Collapse",
    description: "SVB collapses in largest bank failure since 2008, triggering regional banking crisis.",
    category: "economic",
    impact: "negative",
    signalIds: ["gdp-growth", "consumer-sentiment"],
    magnitude: 2,
  },
  {
    id: "inflation-peak-2022",
    date: new Date("2022-06-01"),
    title: "US Inflation Peaks at 9.1%",
    description: "Consumer Price Index reaches 40-year high of 9.1% year-over-year.",
    category: "economic",
    impact: "negative",
    signalIds: ["inflation-cpi", "consumer-sentiment"],
    magnitude: 3,
  },
  {
    id: "great-resignation",
    date: new Date("2021-07-01"),
    title: "The Great Resignation",
    description: "Record number of workers quit jobs, reshaping labor market dynamics.",
    category: "social",
    impact: "neutral",
    signalIds: ["unemployment", "remote-work", "consumer-sentiment"],
    magnitude: 2,
  },

  // Climate Events
  {
    id: "paris-agreement",
    date: new Date("2015-12-12"),
    title: "Paris Climate Agreement",
    description: "195 nations adopt landmark climate accord to limit global warming to 1.5°C.",
    category: "climate",
    impact: "positive",
    signalIds: ["temp-anomaly", "co2-ppm", "climate-interest"],
    magnitude: 3,
  },
  {
    id: "hottest-year-2023",
    date: new Date("2023-07-04"),
    title: "Hottest Day on Record",
    description: "Global average temperature reaches highest level in recorded history.",
    category: "climate",
    impact: "negative",
    signalIds: ["temp-anomaly", "arctic-ice"],
    magnitude: 3,
  },
  {
    id: "arctic-ice-minimum-2012",
    date: new Date("2012-09-16"),
    title: "Record Arctic Ice Minimum",
    description: "Arctic sea ice extent reaches lowest level since satellite monitoring began.",
    category: "climate",
    impact: "negative",
    signalIds: ["arctic-ice", "temp-anomaly"],
    magnitude: 3,
  },
  {
    id: "co2-passes-420",
    date: new Date("2023-05-12"),
    title: "CO₂ Exceeds 424 ppm",
    description: "Atmospheric CO₂ concentration reaches new record high at Mauna Loa Observatory.",
    category: "climate",
    impact: "negative",
    signalIds: ["co2-ppm", "temp-anomaly"],
    magnitude: 2,
  },

  // Technology Events
  {
    id: "chatgpt-launch",
    date: new Date("2022-11-30"),
    title: "ChatGPT Launch",
    description: "OpenAI releases ChatGPT, sparking AI adoption boom and reshaping tech landscape.",
    category: "technology",
    impact: "positive",
    signalIds: ["ai-adoption", "cloud-native"],
    magnitude: 3,
  },
  {
    id: "rust-1-0",
    date: new Date("2015-05-15"),
    title: "Rust 1.0 Released",
    description: "Mozilla releases Rust 1.0, marking language's stability and enterprise readiness.",
    category: "technology",
    impact: "positive",
    signalIds: ["rust-growth"],
    magnitude: 2,
  },
  {
    id: "kubernetes-1-0",
    date: new Date("2015-07-21"),
    title: "Kubernetes 1.0 Released",
    description: "Google releases Kubernetes 1.0, revolutionizing container orchestration.",
    category: "technology",
    impact: "positive",
    signalIds: ["cloud-native"],
    magnitude: 3,
  },
  {
    id: "gpt4-launch",
    date: new Date("2023-03-14"),
    title: "GPT-4 Released",
    description: "OpenAI launches GPT-4 with multimodal capabilities, advancing AI frontier.",
    category: "technology",
    impact: "positive",
    signalIds: ["ai-adoption"],
    magnitude: 3,
  },

  // Social & Geopolitical Events
  {
    id: "ukraine-war",
    date: new Date("2022-02-24"),
    title: "Russia Invades Ukraine",
    description: "Russian invasion triggers global energy crisis and supply chain disruptions.",
    category: "geopolitical",
    impact: "negative",
    signalIds: ["gdp-growth", "inflation-cpi", "consumer-sentiment"],
    magnitude: 3,
  },
  {
    id: "mental-health-awareness-month",
    date: new Date("2020-05-01"),
    title: "Mental Health Awareness Surge",
    description: "Pandemic drives unprecedented focus on mental health and wellbeing.",
    category: "social",
    impact: "positive",
    signalIds: ["mental-health"],
    magnitude: 2,
  },
  {
    id: "remote-work-shift",
    date: new Date("2020-04-01"),
    title: "Mass Remote Work Adoption",
    description: "Companies worldwide shift to remote work, permanently changing work culture.",
    category: "social",
    impact: "positive",
    signalIds: ["remote-work", "cloud-native"],
    magnitude: 3,
  },
];

// Get events relevant to a specific signal
export function getEventsForSignal(signalId: string): HistoricalEvent[] {
  return HISTORICAL_EVENTS
    .filter(event => event.signalIds.includes(signalId))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Get events within a date range
export function getEventsInRange(start: Date, end: Date): HistoricalEvent[] {
  return HISTORICAL_EVENTS.filter(
    event => event.date >= start && event.date <= end
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Get impact color
export function getImpactColor(impact: HistoricalEvent["impact"]): string {
  switch (impact) {
    case "positive": return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "negative": return "text-red-600 bg-red-50 border-red-200";
    case "neutral": return "text-amber-600 bg-amber-50 border-amber-200";
  }
}

// Get category icon name
export function getCategoryIcon(category: HistoricalEvent["category"]): string {
  switch (category) {
    case "economic": return "TrendingUp";
    case "climate": return "Thermometer";
    case "technology": return "Cpu";
    case "social": return "Users";
    case "geopolitical": return "Globe";
  }
}
