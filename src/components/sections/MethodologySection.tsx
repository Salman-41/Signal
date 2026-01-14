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
      icon: Database,
      title: "Free, Public APIs Only",
      description:
        "All data comes from publicly accessible APIs with no authentication walls or paywalls.",
    },
    {
      icon: RefreshCw,
      title: "Client-Side Processing",
      description:
        "No backend servers. All data aggregation and transformation happens in your browser.",
    },
    {
      icon: AlertTriangle,
      title: "Transparent Limitations",
      description:
        "We clearly state what each signal does and does not claim to represent.",
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
        <div className="mb-16">
          <Label variant="muted" className="text-[#64748b] mb-4">
            Methodology
          </Label>
            <Heading as="h2" size="section" className="text-[#0f172a]">
              How we detect signals
            </Heading>
            <Text size="lg" className="text-[#475569] mt-4 max-w-2xl mx-auto">
              Our platform processes raw public data to identify significant
              shifts before they become part of the dominant narrative.
            </Text>
        </div>

        {/* Principles - Staggered Intelligence Process */}
        <div className="space-y-24 mb-32">
          {principles.map((principle, index) => (
            <div 
              key={index}
              className={cn(
                "methodology-item flex flex-col md:flex-row items-center gap-12 lg:gap-20",
                index % 2 === 1 && "md:flex-row-reverse"
              )}
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0f172a] text-white text-xs font-mono font-bold">
                    0{index + 1}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#cbd5e1]/50 to-transparent" />
                </div>
                <h3 className="text-3xl md:text-4xl font-medium text-[#0f172a] tracking-tight">
                  {principle.title}
                </h3>
                <Text size="lg" className="text-[#475569] leading-relaxed max-w-xl">
                  {principle.description}
                </Text>
                
                {/* Technical Meta Card */}
                <div className="inline-flex flex-col p-4 rounded-xl bg-white border border-[#cbd5e1]/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e63946]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">System Module</span>
                  </div>
                  <div className="text-xs font-mono text-[#0f172a]/70">
                    {index === 0 && "INGESTION_ENGINE_V4.2"}
                    {index === 1 && "CLIENT_SIDE_RUNTIME_CORE"}
                    {index === 2 && "INTERPRETIVE_GUARDRAILS_SECURE"}
                  </div>
                </div>
              </div>

              <div className="flex-1 relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#cbd5e1]/20 to-transparent rounded-[2rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden bg-[#0f172a] flex items-center justify-center border border-white/10 shadow-2xl">
                  {/* Visual Representation */}
                  {index === 0 && (
                    <div className="relative w-full h-full p-8 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <Database className="w-12 h-12 text-[#e63946]" />
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Incoming Stream</div>
                          <div className="text-xl font-mono text-white">428.4 GB/s</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#e63946] animate-pulse" style={{ width: `${30 + i * 20}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="relative w-full h-full p-8 flex flex-col items-center justify-center">
                      <RefreshCw className="w-20 h-20 text-[#e63946] animate-spin-slow" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0f172a_70%)] opacity-50" />
                      <div className="mt-6 text-center">
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Compute Location</div>
                        <div className="text-xl font-mono text-white">Browser Edge</div>
                      </div>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="relative w-full h-full p-8 flex flex-col justify-center gap-6">
                      <div className="flex items-center gap-4">
                        <Search className="w-8 h-8 text-[#e63946]" />
                        <div className="h-px flex-1 bg-white/20" />
                        <Check className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                          <div className="text-[8px] text-white/40 uppercase">Outlier Detection</div>
                          <div className="text-sm font-mono text-white">PASS</div>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                          <div className="text-[8px] text-white/40 uppercase">Bias Verification</div>
                          <div className="text-sm font-mono text-white">PASS</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-32 p-12 lg:p-16 rounded-[2.5rem] bg-[#0f172a] overflow-hidden">
          {/* Background Technical Element */}
          <div className="absolute top-0 right-0 p-8 text-[120px] font-black text-white/[0.03] select-none leading-none tracking-tighter">
            DATA
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
            <div>
              <Label variant="accent" className="bg-[#e63946]/10 text-[#e63946] mb-6">Network Atlas</Label>
              <h3 className="text-4xl md:text-5xl font-medium text-white tracking-tight">Data Sources</h3>
              <Text size="lg" className="text-white/60 mt-4 max-w-xl">
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

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="mt-12 p-8 rounded-2xl bg-white border border-[#cbd5e1]/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-amber-900 text-sm uppercase tracking-widest">
                  Legal Protocol
                </h4>
                <div className="h-px w-8 bg-amber-200" />
              </div>
              <p className="text-sm font-body leading-relaxed text-[#475569] max-w-4xl">
                This platform provides informational signals based on publicly available data. It is not financial, investment, or professional advice. Signals may be delayed, incomplete, or subject to API limitations. Always verify important data from primary sources and consult qualified professionals for decisions.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <div className="text-[8px] font-mono text-[#64748b] uppercase tracking-tighter">DISCLAIMER_HASH</div>
              <div className="text-[10px] font-mono text-[#0f172a] font-bold">SHA-256: 8f4e2...</div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
