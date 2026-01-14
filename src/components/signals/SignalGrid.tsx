"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Signal, SignalCategory, CATEGORY_META } from "@/lib/signals/types";
import { SignalCard } from "./SignalCard";
import { Label } from "@/components/layout/Typography";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SignalGridProps {
  signals: Signal[];
  className?: string;
  showFilters?: boolean;
  columns?: 2 | 3 | 4;
  variant?: "default" | "compact";
}

const categories: SignalCategory[] = ["economic", "climate", "tech", "social"];

export function SignalGrid({
  signals,
  className,
  showFilters = true,
  columns = 3,
  variant = "default",
}: SignalGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<SignalCategory | "all">(
    "all"
  );
  const [filteredSignals, setFilteredSignals] = useState(signals);

  // Filter signals
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredSignals(signals);
    } else {
      setFilteredSignals(signals.filter((s) => s.category === activeFilter));
    }
  }, [activeFilter, signals]);

  // Animate filter change
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".signal-card");

    gsap.fromTo(
      cards,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.05,
      }
    );
  }, [filteredSignals]);

  const colClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={className}>
      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeFilter === "all"
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            All Signals
          </button>
          {categories.map((category) => {
            const meta = CATEGORY_META[category];
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activeFilter === category
                    ? cn(meta.bgColor, meta.color, "ring-1", meta.borderColor)
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <div
        ref={containerRef}
        className={cn("grid grid-cols-1 gap-4 md:gap-6", colClasses[columns])}
      >
        {filteredSignals.map((signal, index) => (
          <SignalCard
            key={signal.id}
            signal={signal}
            variant={variant}
            animationDelay={index * 0.05}
            className="signal-card"
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredSignals.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-stone-400">No signals in this category.</p>
        </div>
      )}
    </div>
  );
}
