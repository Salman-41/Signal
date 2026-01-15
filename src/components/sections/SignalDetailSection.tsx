"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils";
import { Section, Container } from "@/components/layout/Section";
import { Heading, Text, Label } from "@/components/layout/Typography";
import { Signal, CATEGORY_META, DataPoint } from "@/lib/signals/types";
import { getDataSourceInfo, fetchSignalDataForCountry } from "@/lib/signals/api-clients";
import { 
  getCountriesForSignal, 
  getDefaultCountry, 
  COUNTRY_ENABLED_SIGNALS,
  Country 
} from "@/lib/signals/countries";
import {
  SparklineChart,
  DeviationChart,
  RateOfChangeChart,
} from "@/components/charts";
import { StatsPanel } from "@/components/signals/StatsPanel";
import { EventsTimeline } from "@/components/signals/EventsTimeline";
import { ExportPanel } from "@/components/signals/ExportPanel";
import { NewsPanel } from "@/components/signals/NewsPanel";
import { ForecastPanel } from "@/components/signals/ForecastPanel";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  ExternalLink,
  Database,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe,
  ChevronDown,
  Loader2,
  Search,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SignalDetailSectionProps {
  signal: Signal;
  relatedSignals?: Signal[];
  className?: string;
}

export function SignalDetailSection({
  signal,
  relatedSignals = [],
  className,
}: SignalDetailSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  
  // Country selection state
  const [activeView, setActiveView] = useState<"indexed" | "rate" | "deviation">("indexed");
  const [isDataLive, setIsDataLive] = useState(true);
  const availableCountries = getCountriesForSignal(signal.id);
  const isCountryEnabled = COUNTRY_ENABLED_SIGNALS.includes(signal.id);
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryData, setCountryData] = useState<DataPoint[] | null>(null);
  const [isLoadingCountryData, setIsLoadingCountryData] = useState(false);
  const [countryDataError, setCountryDataError] = useState<string | null>(null);

  const categoryMeta = CATEGORY_META[signal.category];
  const sourceInfo = getDataSourceInfo(signal.id);

  const filteredCountries = availableCountries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animate entrance
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".detail-animate",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }
      );

      // Mouse parallax for glow
      const handleMouseMove = (e: MouseEvent) => {
        if (!glowRef.current) return;
        const { clientX, clientY } = e;
        gsap.to(glowRef.current, {
          left: clientX,
          top: clientY,
          duration: 1.5,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Fetch country-specific data when country changes
  useEffect(() => {
    if (!isCountryEnabled) return;
    
    const fetchData = async () => {
      setIsLoadingCountryData(true);
      setCountryDataError(null);
      
      try {
        const data = await fetchSignalDataForCountry(signal.id, selectedCountry.code);
        if (data) {
          setCountryData(data);
          setIsDataLive(true);
        } else {
          // Fallback to mock data
          setCountryData(null);
          setIsDataLive(false);
          setCountryDataError("Using cached data");
        }
      } catch (error) {
        console.error("Failed to fetch country data:", error);
        setCountryData(null);
        setIsDataLive(false);
        setCountryDataError("Failed to load data");
      } finally {
        setIsLoadingCountryData(false);
      }
    };
    
    fetchData();
  }, [signal.id, selectedCountry.code, isCountryEnabled]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    
    if (isCountryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCountryDropdownOpen]);

  // Handle country selection
  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
  }, []);

  // Use country-specific data if available, otherwise use signal's sparkline
  const chartData = countryData || signal.sparklineHistory;
  
  // Calculate dynamic metrics from chartData
  const latestPoint = chartData[chartData.length - 1];
  const previousPoint = chartData[chartData.length - 2] || latestPoint;
  
  const currentVal = latestPoint?.value ?? signal.currentValue;
  const prevVal = previousPoint?.value ?? signal.previousValue;
  const currentChange = currentVal - prevVal;
  const currentChangePercent = prevVal !== 0 ? (currentChange / prevVal) * 100 : 0;
  
  const currentTrend = currentChange > 0 ? "up" : currentChange < 0 ? "down" : "stable";

  // Calculate baseline for deviation view
  const values = chartData.map((d) => d.value);
  const baseline = values.reduce((a, b) => a + b, 0) / values.length;

  const TrendIcon =
    currentTrend === "up"
      ? TrendingUp
      : currentTrend === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    currentTrend === "up"
      ? "text-[#e63946]"
      : currentTrend === "down"
      ? "text-[#64748b]"
      : "text-[#cbd5e1]";

  const chartColor =
    currentTrend === "up"
      ? "#e63946"
      : currentTrend === "down"
      ? "#475569"
      : "#0f172a";

  return (
    <Section
      ref={sectionRef}
      className={cn("relative min-h-screen py-8 md:py-12", className)}
      background="default"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Measurement grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        
        {/* Kinetic scan line */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-full h-[10vh] bg-gradient-to-b from-transparent via-[#e63946]/10 to-transparent animate-marquee-vertical" />
        </div>

        {/* Dynamic glow */}
        <div
          ref={glowRef}
          className="absolute w-[600px] h-[600px] bg-[#e63946]/[0.04] rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: "50%", top: "30%" }}
        />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/30 to-transparent" />
      </div>

      <Container className="relative z-10">
        {/* Back navigation */}
        <div className="detail-animate mb-8">
          <Link
            href="/#live-signals"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Signals
          </Link>
        </div>

        {/* Hero Header */}
        <div ref={heroRef} className="detail-animate mb-12 relative z-30">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              {/* Category badge */}
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4",
                  categoryMeta.bgColor,
                  categoryMeta.color
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    currentTrend === "up"
                      ? "bg-[#e63946]"
                      : currentTrend === "down"
                      ? "bg-[#457b9d]"
                      : "bg-[#a8dadc]"
                  )}
                />
                {categoryMeta.label}
              </div>

              {/* Title & Country Selector */}
              <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
                <div>
                  <Heading as="h1" size="hero" className="text-[#0f172a] tracking-tight">
                    {signal.title}
                  </Heading>
                  {signal.subtitle && (
                    <Text size="lg" muted className="mt-2 text-[#64748b]">
                      {signal.subtitle}
                    </Text>
                  )}
                </div>

                {/* Top Country Selector */}
                {isCountryEnabled && availableCountries.length > 0 && (
                  <div ref={countryDropdownRef} className="relative mb-2 z-50">
                    <button
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-[#cbd5e1]/40 bg-white/80 backdrop-blur-md hover:border-[#e63946]/40 hover:shadow-xl transition-all min-w-[240px] justify-between group"
                    >
                      <span className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-[#64748b] group-hover:text-[#e63946] transition-colors" />
                        <span className="text-2xl">{selectedCountry.flag}</span>
                        <span className="text-base font-bold text-[#0f172a]">{selectedCountry.name}</span>
                      </span>
                      <ChevronDown className={cn(
                        "w-5 h-5 text-[#64748b] transition-transform duration-300",
                        isCountryDropdownOpen && "rotate-180"
                      )} />
                    </button>
                    
                    {/* Dropdown menu with Search */}
                    {isCountryDropdownOpen && (
                      <div className="absolute top-full mt-3 left-0 w-[320px] bg-white rounded-2xl border-2 border-[#cbd5e1]/40 shadow-2xl z-[9999] overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-[#cbd5e1]/30 bg-slate-50/50">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#cbd5e1]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e63946]/20 focus:border-[#e63946]/40 transition-all"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        
                        <div className="max-h-[300px] overflow-y-auto p-2 country-scrollbar">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <button
                                key={country.code}
                                onClick={() => handleCountrySelect(country)}
                                className={cn(
                                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all",
                                  selectedCountry.code === country.code
                                    ? "bg-[#e63946] text-white"
                                    : "hover:bg-[#f1f5f9] text-[#0f172a]"
                                )}
                              >
                                <span className="text-2xl">{country.flag}</span>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold leading-none">{country.name}</span>
                                  <span className={cn(
                                    "text-[10px] uppercase tracking-widest mt-1 opacity-60",
                                    selectedCountry.code === country.code ? "text-white" : "text-[#64748b]"
                                  )}>{country.code}</span>
                                </div>
                                {selectedCountry.code === country.code && (
                                  <CheckCircle className="w-5 h-5 ml-auto text-white" />
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="p-8 text-center">
                              <Search className="w-8 h-8 text-[#cbd5e1] mx-auto mb-2" />
                              <p className="text-sm text-[#94a3b8]">No countries found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* External source link */}
            <a
              href={signal.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#cbd5e1]/50 text-sm font-medium text-[#64748b] hover:text-[#0f172a] hover:border-[#e63946]/30 hover:bg-white/50 transition-all"
            >
              View Source
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Value card */}
          <div className="detail-animate">
            <div className="bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 md:p-8 shadow-lg">
              {/* Current value */}
              <div className="mb-6">
                <Label variant="muted" className="text-[10px] uppercase tracking-widest mb-2">
                  Current Value
                </Label>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-bold text-[#0f172a] tabular-nums tracking-tight">
                    {typeof currentVal === 'number' ? currentVal.toFixed(1) : currentVal}
                  </span>
                  <span className="text-2xl text-[#64748b] font-medium">
                    {signal.unit}
                  </span>
                </div>
              </div>

              {/* Change indicator */}
              <div className="flex items-center gap-4 pb-6 border-b border-[#cbd5e1]/30">
                <div className={cn("flex items-center gap-2", trendColor)}>
                  <TrendIcon className="w-5 h-5" />
                  <span className="text-lg font-bold tabular-nums">
                    {currentChangePercent > 0 ? "+" : ""}
                    {formatPercent(currentChangePercent)}
                  </span>
                </div>
                <span className="text-sm text-[#94a3b8]">vs previous period</span>
              </div>

              {/* Previous value */}
              <div className="pt-6 grid grid-cols-2 gap-4">
                <div>
                  <Label variant="muted" className="text-[9px] uppercase tracking-widest mb-1">
                    Previous
                  </Label>
                  <span className="text-lg font-medium text-[#475569] tabular-nums">
                    {typeof prevVal === 'number' ? prevVal.toFixed(1) : prevVal} {signal.unit}
                  </span>
                </div>
                <div>
                  <Label variant="muted" className="text-[9px] uppercase tracking-widest mb-1">
                    Change
                  </Label>
                  <span className={cn("text-lg font-medium tabular-nums", trendColor)}>
                    {currentChange > 0 ? "+" : ""}
                    {typeof currentChange === 'number' ? currentChange.toFixed(1) : currentChange} {signal.unit}
                  </span>
                </div>
              </div>

              {/* Anomaly badge */}
              {signal.anomalies && signal.anomalies.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#cbd5e1]/30">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-[#e63946]/5 border border-[#e63946]/20">
                    <AlertCircle className="w-5 h-5 text-[#e63946] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-[#e63946] block">
                        Anomaly Detected
                      </span>
                      <span className="text-xs text-[#e63946]/70">
                        {signal.anomalies[0].description}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data source card */}
            <div className="detail-animate mt-6 bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-[#64748b]" />
                <span className="text-sm font-medium text-[#0f172a]">Data Source</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748b] uppercase tracking-wider">Source</span>
                  <span className="text-sm font-medium text-[#0f172a]">{sourceInfo.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748b] uppercase tracking-wider">Frequency</span>
                  <span className="text-sm font-medium text-[#0f172a]">{sourceInfo.frequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748b] uppercase tracking-wider">Status</span>
                  <div className="flex items-center gap-1.5">
                    {isDataLive ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600">Live</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-[#64748b]" />
                        <span className="text-sm font-medium text-[#64748b]">Cached</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Events Timeline */}
            <div className="detail-animate mt-6 bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
              <EventsTimeline signalId={signal.id} maxEvents={4} />
            </div>
          </div>

          {/* Right column - Charts and interpretation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart area */}
            <div className="detail-animate bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 md:p-8 shadow-lg">
              {/* View switcher */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setActiveView("indexed")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeView === "indexed"
                      ? "bg-[#0f172a] text-white"
                      : "bg-[#cbd5e1]/30 text-[#64748b] hover:bg-[#cbd5e1]/50"
                  )}
                >
                  Indexed Trend
                </button>
                <button
                  onClick={() => setActiveView("rate")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeView === "rate"
                      ? "bg-[#0f172a] text-white"
                      : "bg-[#cbd5e1]/30 text-[#64748b] hover:bg-[#cbd5e1]/50"
                  )}
                >
                  Rate of Change
                </button>
                <button
                  onClick={() => setActiveView("deviation")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeView === "deviation"
                      ? "bg-[#0f172a] text-white"
                      : "bg-[#cbd5e1]/30 text-[#64748b] hover:bg-[#cbd5e1]/50"
                  )}
                >
                  Deviation
                </button>
              </div>

              {/* Chart header */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#0f172a]">
                  {activeView === "indexed"
                    ? "Historical Trend"
                    : activeView === "rate"
                    ? "Rate of Change Over Time"
                    : "Deviation from Historical Mean"}
                  {isCountryEnabled && ` — ${selectedCountry.name}`}
                </h3>
                <p className="text-sm text-[#64748b] mt-1">
                  {activeView === "indexed"
                    ? "Value trajectory over the observation period"
                    : activeView === "rate"
                    ? "Percent change between consecutive observations"
                    : "How far each point deviates from the average"}
                </p>
              </div>

              {/* Chart */}
              <div className="h-56 md:h-72 bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] relative">
                {isLoadingCountryData && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="flex items-center gap-3 text-[#64748b]">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-sm font-medium">Loading {selectedCountry.name} data...</span>
                    </div>
                  </div>
                )}
                {activeView === "indexed" && (
                  <SparklineChart
                    data={chartData}
                    width={700}
                    height={240}
                    strokeWidth={2.5}
                    color={chartColor}
                    showArea
                    className="w-full h-full"
                  />
                )}
                {activeView === "rate" && (
                  <RateOfChangeChart
                    data={chartData}
                    width={700}
                    height={240}
                    color={chartColor}
                    className="w-full h-full"
                  />
                )}
                {activeView === "deviation" && (
                  <DeviationChart
                    data={chartData}
                    baseline={baseline}
                    width={700}
                    height={240}
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* Interpretation cards */}
            <div className="detail-animate grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-3">
                  What This Suggests
                </h4>
                <Text size="sm" className="text-[#475569] leading-relaxed">
                  {signal.interpretation.whatItMeans}
                </Text>
              </div>
              <div className="bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-3">
                  What It Does Not Claim
                </h4>
                <Text size="sm" className="text-[#475569] leading-relaxed">
                  {signal.interpretation.whatItDoesNotClaim}
                </Text>
              </div>
            </div>

            {/* Context card */}
            {signal.interpretation.context && (
              <div className="detail-animate bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">
                  Historical Context
                </h4>
                <Text size="base" className="text-white/90 leading-relaxed">
                  {signal.interpretation.context}
                </Text>
              </div>
            )}

            {/* Statistical Analysis */}
            <div className="detail-animate bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 md:p-8 shadow-lg">
              <StatsPanel 
                data={chartData} 
                currentValue={currentVal} 
                unit={signal.unit} 
              />
            </div>

            {/* Export & Share */}
            <div className="detail-animate bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
              <ExportPanel 
                signalId={signal.id}
                signalTitle={signal.title}
                data={chartData}
              />
            </div>

            {/* Related News */}
            <div className="detail-animate bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
              <NewsPanel signalId={signal.id} maxArticles={3} />
            </div>

            {/* Trend Forecast */}
            <div className="detail-animate bg-white/60 backdrop-blur-xl border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-lg">
              <ForecastPanel 
                data={chartData}
                currentValue={currentVal}
                unit={signal.unit}
              />
            </div>

            {/* Related signals */}
            {relatedSignals.length > 0 && (
              <div className="detail-animate">
                <h4 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-4">
                  Related Signals
                </h4>
                <div className="flex flex-wrap gap-3">
                  {relatedSignals.map((related) => (
                    <Link
                      key={related.id}
                      href={`/signals/${related.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#cbd5e1]/50 text-sm font-medium text-[#475569] hover:text-[#0f172a] hover:border-[#e63946]/30 hover:bg-white/80 transition-all"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      {related.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
