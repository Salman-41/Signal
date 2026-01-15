// News API integration for signal-related headlines
// Uses mock data when API key not configured

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: Date;
  imageUrl?: string;
  sentiment?: "positive" | "negative" | "neutral";
}

// Mapping signals to news search queries
const SIGNAL_NEWS_QUERIES: Record<string, string[]> = {
  "gdp-growth": ["GDP growth", "economic growth", "recession fears"],
  "inflation-cpi": ["inflation", "consumer prices", "CPI report", "cost of living"],
  "unemployment": ["unemployment", "job market", "labor market", "hiring"],
  "consumer-sentiment": ["consumer confidence", "consumer sentiment", "consumer spending"],
  "temp-anomaly": ["global warming", "climate change", "temperature record"],
  "arctic-ice": ["arctic ice", "sea ice", "polar ice melt"],
  "co2-ppm": ["carbon emissions", "CO2 levels", "greenhouse gas"],
  "ai-adoption": ["AI adoption", "artificial intelligence business", "ChatGPT enterprise"],
  "rust-growth": ["Rust programming", "Rust language", "memory safety"],
  "cloud-native": ["cloud computing", "Kubernetes", "cloud native"],
  "remote-work": ["remote work", "hybrid work", "work from home"],
  "mental-health": ["mental health", "workplace wellness", "employee wellbeing"],
  "climate-interest": ["climate action", "sustainability", "green energy"],
};

// Mock news articles for demonstration (when API not configured)
const MOCK_NEWS: Record<string, NewsArticle[]> = {
  "gdp-growth": [
    {
      id: "gdp-1",
      title: "US Economy Shows Resilience Despite Rate Hikes",
      description: "Latest GDP figures beat expectations as consumer spending remains strong.",
      source: "Reuters",
      url: "https://reuters.com",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      sentiment: "positive",
    },
    {
      id: "gdp-2",
      title: "Fed Officials Debate Pace of Future Rate Cuts",
      description: "Economic projections suggest soft landing remains achievable.",
      source: "Bloomberg",
      url: "https://bloomberg.com",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      sentiment: "neutral",
    },
  ],
  "inflation-cpi": [
    {
      id: "cpi-1",
      title: "Inflation Continues Gradual Decline in Latest Report",
      description: "Consumer prices rose 3.2% annually, below economist forecasts.",
      source: "WSJ",
      url: "https://wsj.com",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      sentiment: "positive",
    },
    {
      id: "cpi-2",
      title: "Housing Costs Remain Sticky Component of Inflation",
      description: "Shelter prices continue to outpace broader inflation measures.",
      source: "CNBC",
      url: "https://cnbc.com",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      sentiment: "negative",
    },
  ],
  "unemployment": [
    {
      id: "unemp-1",
      title: "Job Market Adds 200K Positions, Beating Estimates",
      description: "Unemployment rate holds steady as hiring remains robust.",
      source: "AP News",
      url: "https://apnews.com",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      sentiment: "positive",
    },
  ],
  "ai-adoption": [
    {
      id: "ai-1",
      title: "Enterprise AI Adoption Surges 40% Year-Over-Year",
      description: "Companies accelerate generative AI deployments across operations.",
      source: "TechCrunch",
      url: "https://techcrunch.com",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
      sentiment: "positive",
    },
    {
      id: "ai-2",
      title: "OpenAI Launches GPT-5 With Enhanced Reasoning",
      description: "New model demonstrates significant improvements in complex tasks.",
      source: "The Verge",
      url: "https://theverge.com",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      sentiment: "positive",
    },
  ],
  "temp-anomaly": [
    {
      id: "temp-1",
      title: "2024 on Track to Be Hottest Year on Record",
      description: "Global temperatures continue to exceed pre-industrial averages.",
      source: "NASA",
      url: "https://nasa.gov",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      sentiment: "negative",
    },
  ],
};

// Default mock articles for signals without specific news
const DEFAULT_MOCK_NEWS: NewsArticle[] = [
  {
    id: "default-1",
    title: "Markets React to Latest Economic Indicators",
    description: "Investors digest new data as outlook shifts.",
    source: "Financial Times",
    url: "https://ft.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    sentiment: "neutral",
  },
];

// Fetch news for a signal (uses mock data in demo)
export async function fetchNewsForSignal(signalId: string): Promise<NewsArticle[]> {
  // In production, this would call a real news API
  // For now, return mock data
  
  const mockArticles = MOCK_NEWS[signalId] || DEFAULT_MOCK_NEWS;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockArticles;
}

// Get sentiment color
export function getSentimentColor(sentiment: NewsArticle["sentiment"]): string {
  switch (sentiment) {
    case "positive": return "text-emerald-600 bg-emerald-50";
    case "negative": return "text-red-600 bg-red-50";
    default: return "text-[#64748b] bg-[#f1f5f9]";
  }
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
