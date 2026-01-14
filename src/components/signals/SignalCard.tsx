"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils";
import { Signal, CATEGORY_META } from "@/lib/signals/types";
import { DataValue, Label, Text } from "@/components/layout/Typography";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import gsap from "gsap";

interface SignalCardProps {
  signal: Signal;
  className?: string;
  variant?: "default" | "compact" | "featured";
  animationDelay?: number;
  showSparkline?: boolean;
  onClick?: () => void;
}

export function SignalCard({
  signal,
  className,
  variant = "default",
  animationDelay = 0,
  showSparkline = true,
  onClick,
}: SignalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sparklineRef = useRef<SVGSVGElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const categoryMeta = CATEGORY_META[signal.category];

  // Animate card entrance
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        delay: animationDelay,
      }
    );
  }, [animationDelay]);

  // Animate sparkline on hover
  useEffect(() => {
    if (!sparklineRef.current || !showSparkline) return;

    const path = sparklineRef.current.querySelector("path");
    if (!path) return;

    if (isHovered) {
      gsap.to(path, {
        strokeWidth: 2,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(path, {
        strokeWidth: 1.5,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isHovered, showSparkline]);

  // Generate sparkline path
  const generateSparklinePath = () => {
    const data = signal.sparklineHistory;
    if (!data.length) return "";

    const width = 120;
    const height = 40;
    const padding = 4;

    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y =
        height - padding - ((d.value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  const TrendIcon =
    signal.trend === "up"
      ? TrendingUp
      : signal.trend === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    signal.trend === "up"
      ? "text-emerald-500"
      : signal.trend === "down"
      ? "text-rose-500"
      : "text-stone-400";

  const sparklineColor =
    signal.trend === "up"
      ? "#10b981"
      : signal.trend === "down"
      ? "#f43f5e"
      : "#a1a1aa";

  if (variant === "compact") {
    return (
      <div
        ref={cardRef}
        className={cn(
          "group relative p-4 rounded-xl border border-stone-200 bg-white",
          "hover:border-stone-300 hover:shadow-sm transition-all duration-300",
          "cursor-pointer",
          className
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Label variant="muted" className={categoryMeta.color}>
              {categoryMeta.label}
            </Label>
            <h3 className="font-medium text-stone-900 truncate mt-1">
              {signal.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <DataValue size="sm" trend={signal.trend}>
              {signal.currentValue}
              {signal.unit !== "index" && signal.unit}
            </DataValue>
            <div className={cn("flex items-center gap-1", trendColor)}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium tabular-nums">
                {formatPercent(signal.changePercent)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        ref={cardRef}
        className={cn(
          "group relative p-8 md:p-10 rounded-2xl border-2 border-stone-200 bg-white",
          "hover:border-stone-300 hover:shadow-lg transition-all duration-500",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Category badge */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              categoryMeta.bgColor,
              categoryMeta.color
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                signal.trend === "up"
                  ? "bg-emerald-500"
                  : signal.trend === "down"
                  ? "bg-rose-500"
                  : "bg-stone-400"
              )}
            />
            {categoryMeta.label}
          </div>
          <a
            href={signal.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Title and subtitle */}
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-medium text-stone-900 tracking-tight">
            {signal.title}
          </h3>
          {signal.subtitle && (
            <p className="text-stone-500 mt-1">{signal.subtitle}</p>
          )}
        </div>

        {/* Value and change */}
        <div className="flex items-end justify-between gap-6 mb-6">
          <div>
            <DataValue size="2xl" trend={signal.trend}>
              {signal.currentValue}
              <span className="text-2xl ml-1 text-stone-400">
                {signal.unit}
              </span>
            </DataValue>
            <div className={cn("flex items-center gap-2 mt-2", trendColor)}>
              <TrendIcon className="w-5 h-5" />
              <span className="text-lg font-medium tabular-nums">
                {formatPercent(signal.changePercent)}
              </span>
              <span className="text-stone-400 text-sm">vs previous</span>
            </div>
          </div>

          {/* Sparkline */}
          {showSparkline && (
            <svg
              ref={sparklineRef}
              viewBox="0 0 120 40"
              className="w-32 h-12 opacity-60 group-hover:opacity-100 transition-opacity"
            >
              <path
                d={generateSparklinePath()}
                fill="none"
                stroke={sparklineColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Interpretation */}
        <div className="pt-6 border-t border-stone-100">
          <Text size="sm" className="text-stone-600">
            {signal.interpretation.whatItMeans}
          </Text>
        </div>

        {/* Anomaly badge */}
        {signal.anomalies && signal.anomalies.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              {signal.anomalies[0].description}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative p-6 rounded-xl border border-stone-200 bg-white",
        "hover:border-stone-300 hover:shadow-md transition-all duration-300",
        "cursor-pointer",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <Label variant="muted" className={categoryMeta.color}>
            {categoryMeta.label}
          </Label>
          <h3 className="font-medium text-stone-900 mt-1">{signal.title}</h3>
          {signal.subtitle && (
            <p className="text-sm text-stone-400 mt-0.5">{signal.subtitle}</p>
          )}
        </div>

        {/* Sparkline */}
        {showSparkline && (
          <svg
            ref={sparklineRef}
            viewBox="0 0 120 40"
            className="w-24 h-10 opacity-50 group-hover:opacity-80 transition-opacity"
          >
            <path
              d={generateSparklinePath()}
              fill="none"
              stroke={sparklineColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <DataValue size="lg" trend={signal.trend}>
          {signal.currentValue}
          <span className="text-lg ml-1 text-stone-400">{signal.unit}</span>
        </DataValue>

        <div className={cn("flex items-center gap-1.5", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm font-medium tabular-nums">
            {formatPercent(signal.changePercent)}
          </span>
        </div>
      </div>

      {/* Anomaly indicator */}
      {signal.anomalies && signal.anomalies.length > 0 && (
        <div className="absolute top-4 right-4">
          <span className="flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
        </div>
      )}
    </div>
  );
}
