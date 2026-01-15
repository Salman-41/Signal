"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Section, Container, Grid } from "@/components/layout/Section";
import { Heading, Text, Label } from "@/components/layout/Typography";
import { ExternalLink, Database, RefreshCw, AlertTriangle, Zap, Search, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MethodologySectionProps {
  className?: string;
}

export function MethodologySection({ className }: MethodologySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".methodology-item");
      if (items) {
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const dataSources = [
    {
      name: "FRED",
      description: "Federal Reserve Economic Data",
      url: "https://fred.stlouisfed.org",
      category: "Economic",
    },
    {
      name: "NASA GISS",
      description: "Goddard Institute for Space Studies",
      url: "https://data.giss.nasa.gov",
      category: "Climate",
    },
    {
      name: "NOAA",
      description: "National Oceanic and Atmospheric Administration",
      url: "https://www.noaa.gov",
      category: "Climate",
    },
    {
      name: "Stack Overflow",
      description: "Developer Trends & Surveys",
      url: "https://insights.stackoverflow.com",
      category: "Technology",
    },
    {
      name: "GitHub",
      description: "Open Source Activity",
      url: "https://github.com",
      category: "Technology",
    },
    {
      name: "Google Trends",
      description: "Search Interest Data",
      url: "https://trends.google.com",
      category: "Public Interest",
    },
  ];

  const principles = [
    {
      title: "Broad Ingestion",
      description:
        "We pull data from over 50 public APIs, including federal economic agencies, satellite climate sensors, and technology repositories.",
    },
    {
      title: "Anomaly Detection",
      description:
        "Our proprietary algorithms monitor for statistical anomalies—values that deviate more than 2.5 standard deviations from the 30-day mean.",
    },
    {
      title: "Signal Verification",
      description:
        "Not every outlier is a signal. We correlate data across different indicators to verify the strength and permanence of a trend.",
    },
  ];

  return (
    <Section
      ref={sectionRef}
      id="methodology"
      className={cn("py-24 md:py-32", className)}
      background="dark"
    >
      <Container>
        {/* Header */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <Label variant="muted" className="text-[#64748b] mb-3 sm:mb-4">
            Methodology
          </Label>
            <Heading as="h2" size="section" className="text-[#0f172a] text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              How we detect signals
            </Heading>
            <Text size="lg" className="text-[#475569] mt-3 sm:mt-4 max-w-xl md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              Our platform processes raw public data to identify significant
              shifts before they become part of the dominant narrative.
            </Text>
        </div>

        {/* Principles - Staggered Intelligence Process */}
        <div className="space-y-12 sm:space-y-16 md:space-y-24 mb-16 sm:mb-24 md:mb-32">
          {principles.map((principle, index) => (
            <div 
              key={index}
              className={cn(
                "methodology-item flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12 lg:gap-20",
                index % 2 === 1 && "md:flex-row-reverse"
              )}
            >
              <div className="flex-1 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0f172a] text-white text-[10px] sm:text-xs font-mono font-bold">
                    0{index + 1}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#cbd5e1]/50 to-transparent" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#0f172a] tracking-tight">
                  {principle.title}
                </h3>
                <Text size="lg" className="text-[#475569] leading-relaxed max-w-xl text-sm sm:text-base md:text-lg">
                  {principle.description}
                </Text>
                
                {/* Technical Meta Card */}
                <div className="inline-flex flex-col p-4 rounded-xl bg-white border border-[#cbd5e1]/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e63946]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                      {index === 0 && "Engine Specs"}
                      {index === 1 && "Algorithmic Logic"}
                      {index === 2 && "Verification Protocol"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-[10px] font-mono text-[#0f172a]/70">
                    {index === 0 && (
                      <>
                        <div>COVERAGE: 54_SOURCES</div>
                        <div>SYNC: 2M_FREQUENCY</div>
                        <div>INTEGRITY: 100%_VALID</div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div>METHOD: Z-SCORE_(2.5σ)</div>
                        <div>WINDOW: 30D_ROLLING</div>
                        <div>SPIKE_DETECT: ENABLED</div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div>LOGIC: INDICATOR_CORR</div>
                        <div>CONFIDENCE: MIN_&gt;94%</div>
                        <div>VERIFY: CROSS_SOURCE</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#cbd5e1]/20 to-transparent rounded-[2rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden bg-[#0f172a] flex items-center justify-center border border-white/10 shadow-2xl">
                  {index === 0 && (
                    <div className="relative w-full h-full p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Stream Status</div>
                          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                             INGESTION_ACTIVE
                          </div>
                        </div>
                        <Database className="w-8 h-8 text-[#e63946]" />
                      </div>
                      
                      <div className="flex-1 overflow-hidden relative">
                        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#0f172a] to-transparent z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#0f172a] to-transparent z-10" />
                        <div className="space-y-3 animate-marquee-vertical py-4">
                          {[...dataSources, ...dataSources].map((source, i) => (
                            <div key={i} className="flex items-center justify-between text-[10px] font-mono p-2 rounded bg-white/5 border border-white/10">
                              <span className="text-white/60">{source.name}</span>
                              <span className="text-emerald-400/80">FETCH_OK</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono">
                        <span className="text-white/30">TICKER_V4</span>
                        <span className="text-[#e63946]">REAL_TIME_SYNC</span>
                      </div>
                    </div>
                  )}

                  {index === 1 && (
                    <div className="relative w-full h-full p-8 flex flex-col justify-center">
                      <div className="absolute top-4 left-4 text-[10px] font-mono text-white/30">MONITOR_σ_2.5</div>
                      {/* Animated Threshold Chart */}
                      <svg viewBox="0 0 200 100" className="w-full h-32 overflow-visible">
                        {/* Baseline */}
                        <line x1="0" y1="70" x2="200" y2="70" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />
                        {/* Threshold line */}
                        <line x1="0" y1="30" x2="200" y2="30" stroke="#e63946" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" />
                        <text x="5" y="25" fill="#e63946" fontSize="6" className="font-mono">THRESHOLD_σ_2.5</text>
                        
                        {/* Data Line */}
                        <path 
                          d="M 0,72 L 20,68 L 40,75 L 60,65 L 80,72 L 100,20 L 120,68 L 140,72 L 160,65 L 180,75 L 200,70"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.5"
                          className="animate-path-draw"
                        />
                        
                        {/* Outlier Alert */}
                        <g className="animate-pulse">
                          <circle cx="100" cy="20" r="3" fill="#e63946" />
                          <circle cx="100" cy="20" r="6" fill="none" stroke="#e63946" strokeWidth="0.5" opacity="0.5" />
                        </g>
                        <text x="105" y="15" fill="#e63946" fontSize="6" fontWeight="bold" className="font-mono">ANOMALY_DETECTED</text>
                      </svg>
                      
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <div className="text-[8px] text-white/40 uppercase">Deviance</div>
                          <div className="text-sm font-mono text-white">+4.2σ</div>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/10 text-[#e63946]">
                          <div className="text-[8px] text-[#e63946]/60 uppercase">Action</div>
                          <div className="text-sm font-mono">FLAG_SET</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {index === 2 && (
                    <div className="relative w-full h-full p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-white/40 animate-spin-slow" />
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-emerald-400" />
                        <div className="w-12 h-12 rounded-full bg-emerald-400/20 border border-emerald-400 flex items-center justify-center">
                          <Check className="w-6 h-6 text-emerald-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between group/line">
                          <span className="text-[10px] font-mono text-white/40">Indicator_A</span>
                          <div className="flex-1 mx-4 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white/40 group-hover:bg-emerald-400 transition-colors animate-loading-bar" style={{ animationDelay: '0s' }} />
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">CORRELATED</span>
                        </div>
                        <div className="flex items-center justify-between group/line">
                          <span className="text-[10px] font-mono text-white/40">Indicator_B</span>
                          <div className="flex-1 mx-4 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white/40 group-hover:bg-emerald-400 transition-colors animate-loading-bar" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">CORRELATED</span>
                        </div>
                      </div>

                      <div className="mt-8 p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/20 text-center">
                        <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1">Verification Status</div>
                        <div className="text-xs font-bold text-white tracking-widest">SIGNAL_STRENGTH_VERIFIED_98%</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-16 sm:mt-24 md:mt-32 p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl md:rounded-[2.5rem] bg-[#0f172a] overflow-hidden">
          {/* Background Technical Element */}
          <div className="absolute top-0 right-0 p-4 sm:p-8 text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] font-black text-white/[0.03] select-none leading-none tracking-tighter">
            DATA
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
            <div>
              <Label variant="accent" className="bg-[#e63946]/10 text-[#e63946] mb-4 sm:mb-6">Network Atlas</Label>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight">Data Sources</h3>
              <Text size="lg" className="text-white/60 mt-3 sm:mt-4 max-w-xl text-sm sm:text-base">
                We maintain active pipelines to these primary data providers and 40+ secondary indices.
              </Text>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Status</div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ALL_SYSTEMS_GO
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {dataSources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="methodology-item group flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-[#e63946]/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-[#e63946] px-2 py-0.5 rounded border border-[#e63946]/30">
                    S_{source.name.slice(0, 3).toUpperCase()}_0{index}
                  </span>
                  <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h4 className="font-medium text-white text-lg">
                  {source.name}
                </h4>
                <p className="text-sm text-white/40 mt-1 line-clamp-1">
                  {source.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest bg-white/[0.03] px-2 py-1 rounded">
                    {source.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/50">ONLINE</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl bg-white border border-[#cbd5e1]/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-amber-900 text-xs sm:text-sm uppercase tracking-widest">
                  Legal Protocol
                </h4>
                <div className="h-px w-4 sm:w-8 bg-amber-200" />
              </div>
              <p className="text-xs sm:text-sm font-body leading-relaxed text-[#475569] max-w-4xl">
                This platform provides informational signals based on publicly available data. It is not financial, investment, or professional advice. Signals may be delayed, incomplete, or subject to API limitations. Always verify important data from primary sources and consult qualified professionals for decisions.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
