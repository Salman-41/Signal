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
          <Label variant="muted" className="text-stone-500 mb-4">
            Methodology
          </Label>
            <Heading as="h2" size="section" className="text-[#1d3557]">
              How we detect signals
            </Heading>
            <Text size="lg" className="text-[#457b9d] mt-4 max-w-2xl mx-auto">
              Our platform processes raw public data to identify significant
              shifts before they become part of the dominant narrative.
            </Text>
        </div>

        {/* Principles */}
        <Grid cols={3} className="mb-16">
          <div className="p-6 rounded-2xl bg-[#a8dadc]/10 border border-[#a8dadc]/30">
            <div className="w-12 h-12 rounded-xl bg-[#1d3557] flex items-center justify-center text-[#f1faee] mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-[#1d3557] mb-3">
              Broad Ingestion
            </h3>
            <Text size="sm" className="text-[#457b9d]">
              We pull data from over 50 public APIs, including federal
              economic agencies, satellite climate sensors, and technology
              repositories.
            </Text>
          </div>

          <div className="p-6 rounded-2xl bg-[#a8dadc]/10 border border-[#a8dadc]/30">
            <div className="w-12 h-12 rounded-xl bg-[#e63946] flex items-center justify-center text-[#f1faee] mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-[#1d3557] mb-3">
              Anomaly Detection
            </h3>
            <Text size="sm" className="text-[#457b9d]">
              Our proprietary algorithms monitor for statistical
              anomalies—values that deviate more than 2.5 standard
              deviations from the 30-day mean.
            </Text>
          </div>

          <div className="p-6 rounded-2xl bg-[#a8dadc]/10 border border-[#a8dadc]/30">
            <div className="w-12 h-12 rounded-xl bg-[#457b9d] flex items-center justify-center text-[#f1faee] mb-6">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-[#1d3557] mb-3">
              Signal Verification
            </h3>
            <Text size="sm" className="text-[#457b9d]">
              Not every outlier is a signal. We correlate data across
              different indicators to verify the strength and permanence
              of a trend.
            </Text>
          </div>
        </Grid>

        {/* Data sources */}
        <div>
          <h3 className="text-xl font-medium text-white mb-6">Data Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="methodology-item group flex items-start gap-4 p-4 rounded-lg bg-stone-900/30 border border-stone-800 hover:border-stone-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {source.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-400 transition-colors" />
                  </div>
                  <p className="text-sm text-stone-500 mt-1">
                    {source.description}
                  </p>
                  <span className="inline-block text-xs text-stone-600 mt-2 px-2 py-0.5 bg-stone-800 rounded">
                    {source.category}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 p-6 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-200 mb-2">
                Important Disclaimer
              </h4>
              <Text size="sm" className="text-amber-200/70">
                This platform provides informational signals based on publicly
                available data. It is not financial, investment, or professional
                advice. Signals may be delayed, incomplete, or subject to API
                limitations. Always verify important data from primary sources
                and consult qualified professionals for decisions.
              </Text>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
