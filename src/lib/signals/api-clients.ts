// API Clients for Real-time Data Sources
// Uses mock data as fallback when API keys are not configured

import { DataPoint, FREDResponse } from "./types";

// Environment variables for API keys
const FRED_API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY || "";

// FRED API Client (Federal Reserve Economic Data)
export async function fetchFREDData(
  seriesId: string,
  limit: number = 30
): Promise<DataPoint[]> {
  if (!FRED_API_KEY) {
    console.warn(`FRED API key not configured. Using mock data for ${seriesId}`);
    return [];
  }

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) throw new Error(`FRED API error: ${response.status}`);
    
    const data: FREDResponse = await response.json();
    
    return data.observations
      .filter((obs) => obs.value !== ".")
      .map((obs) => ({
        date: new Date(obs.date),
        value: parseFloat(obs.value),
      }))
      .reverse();
  } catch (error) {
    console.error(`Failed to fetch FRED data for ${seriesId}:`, error);
    return [];
  }
}

// NASA GISS Temperature Anomaly
export async function fetchNASAGISSData(): Promise<DataPoint[]> {
  try {
    const url = "https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv";
    const response = await fetch(url, { next: { revalidate: 86400 } });
    
    if (!response.ok) throw new Error(`NASA GISS API error: ${response.status}`);
    
    const text = await response.text();
    const lines = text.split("\n").slice(2); // Skip header rows
    
    const data: DataPoint[] = [];
    for (const line of lines.slice(-30)) {
      const parts = line.split(",");
      if (parts.length >= 14 && parts[0]) {
        const year = parseInt(parts[0]);
        // Use annual mean (column 13)
        const value = parseFloat(parts[13]);
        if (!isNaN(year) && !isNaN(value)) {
          data.push({
            date: new Date(year, 0, 1),
            value,
          });
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch NASA GISS data:", error);
    return [];
  }
}

// NOAA CO2 Data
export async function fetchNOAACO2Data(): Promise<DataPoint[]> {
  try {
    const url = "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_trend_gl.csv";
    const response = await fetch(url, { next: { revalidate: 86400 } });
    
    if (!response.ok) throw new Error(`NOAA API error: ${response.status}`);
    
    const text = await response.text();
    const lines = text.split("\n").filter(line => !line.startsWith("#") && line.trim());
    
    const data: DataPoint[] = [];
    for (const line of lines.slice(-30)) {
      const parts = line.split(",");
      if (parts.length >= 4) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const value = parseFloat(parts[3]); // trend value
        if (!isNaN(year) && !isNaN(month) && !isNaN(value)) {
          data.push({
            date: new Date(year, month - 1, 1),
            value,
          });
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch NOAA CO2 data:", error);
    return [];
  }
}

// Signal ID to API mapping
export const SIGNAL_API_MAP: Record<string, () => Promise<DataPoint[]>> = {
  "gdp-growth": () => fetchFREDData("GDP"),
  "inflation-cpi": () => fetchFREDData("CPIAUCSL"),
  "unemployment": () => fetchFREDData("UNRATE"),
  "consumer-sentiment": () => fetchFREDData("UMCSENT"),
  "temp-anomaly": fetchNASAGISSData,
  "co2-level": fetchNOAACO2Data,
};

// Fetch real-time data for a signal (with mock fallback)
export async function fetchSignalData(signalId: string): Promise<DataPoint[] | null> {
  const fetchFunction = SIGNAL_API_MAP[signalId];
  
  if (!fetchFunction) {
    return null; // No real-time API available for this signal
  }
  
  const data = await fetchFunction();
  return data.length > 0 ? data : null;
}

// Get human-readable data source info
export function getDataSourceInfo(signalId: string): {
  name: string;
  frequency: string;
  hasRealTimeAPI: boolean;
} {
  const sourceMap: Record<string, { name: string; frequency: string; hasRealTimeAPI: boolean }> = {
    "gdp-growth": { name: "FRED (Federal Reserve)", frequency: "Quarterly", hasRealTimeAPI: true },
    "inflation-cpi": { name: "FRED (Federal Reserve)", frequency: "Monthly", hasRealTimeAPI: true },
    "unemployment": { name: "FRED (Federal Reserve)", frequency: "Monthly", hasRealTimeAPI: true },
    "consumer-sentiment": { name: "University of Michigan", frequency: "Monthly", hasRealTimeAPI: true },
    "temp-anomaly": { name: "NASA GISS", frequency: "Monthly", hasRealTimeAPI: true },
    "arctic-ice": { name: "NSIDC", frequency: "Daily", hasRealTimeAPI: false },
    "co2-level": { name: "NOAA", frequency: "Weekly", hasRealTimeAPI: true },
    "ai-adoption": { name: "Stack Overflow Trends", frequency: "Annual", hasRealTimeAPI: false },
    "rust-growth": { name: "GitHub", frequency: "Annual", hasRealTimeAPI: false },
    "cloud-native": { name: "CNCF Survey", frequency: "Annual", hasRealTimeAPI: false },
    "remote-work": { name: "Google Trends", frequency: "Weekly", hasRealTimeAPI: false },
    "mental-health": { name: "Google Trends", frequency: "Weekly", hasRealTimeAPI: false },
    "climate-action": { name: "Google Trends", frequency: "Weekly", hasRealTimeAPI: false },
  };
  
  return sourceMap[signalId] || { name: "Unknown", frequency: "Unknown", hasRealTimeAPI: false };
}

// Fetch signal data for a specific country
export async function fetchSignalDataForCountry(
  signalId: string,
  countryCode: string
): Promise<DataPoint[] | null> {
  // Import dynamically to avoid circular dependency
  const { getFREDSeriesForCountry } = await import("./countries");
  
  const seriesId = getFREDSeriesForCountry(signalId, countryCode);
  
  if (!seriesId) {
    console.warn(`No series ID found for signal ${signalId} and country ${countryCode}`);
    return null;
  }
  
  // Try to fetch real data
  const data = await fetchFREDData(seriesId);
  
  if (data.length > 0) {
    return data;
  }
  
  // Generate mock data for demo purposes when API is not configured
  // Each country gets unique data based on country code hash
  return generateMockCountryData(signalId, countryCode);
}

// Generate unique mock data per country for demonstration
function generateMockCountryData(signalId: string, countryCode: string): DataPoint[] {
  const points: DataPoint[] = [];
  const now = new Date();
  
  // Create a simple hash from country code to vary the data
  const countryHash = countryCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Base values per signal type (approximate real-world ranges)
  const baseValues: Record<string, { base: number; variance: number; trend: number }> = {
    "gdp-growth": { base: 2.5, variance: 3, trend: 0.1 },
    "inflation-cpi": { base: 3.0, variance: 5, trend: 0.2 },
    "unemployment": { base: 5.0, variance: 4, trend: -0.05 },
    "consumer-sentiment": { base: 70, variance: 20, trend: 0.5 },
  };
  
  const config = baseValues[signalId] || { base: 100, variance: 10, trend: 0 };
  
  // Modify base by country hash to make each country unique
  const countryModifier = ((countryHash % 100) - 50) / 100; // -0.5 to +0.5
  const adjustedBase = config.base * (1 + countryModifier * 0.5);
  
  // Generate 30 data points (monthly data for 2.5 years)
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    // Add some randomness + trend
    const randomFactor = (Math.sin(i * 0.5 + countryHash) + 1) / 2; // 0 to 1
    const trendFactor = (30 - i) * config.trend * (countryHash % 2 === 0 ? 1 : -0.5);
    const value = adjustedBase + (randomFactor - 0.5) * config.variance + trendFactor;
    
    points.push({
      date,
      value: Math.round(value * 100) / 100,
    });
  }
  
  return points;
}
