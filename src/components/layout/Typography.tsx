"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "display" | "hero" | "section" | "subsection" | "card";
}

export function Heading({
  children,
  className,
  as: Component = "h2",
  size = "section",
}: HeadingProps) {
  const sizeClasses = {
    display:
      "text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.95] text-[#0f172a]",
    hero: "text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1] text-[#0f172a]",
    section:
      "text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] text-[#0f172a]",
    subsection: "text-2xl md:text-3xl font-medium tracking-tight leading-[1.2] text-[#0f172a]",
    card: "text-xl md:text-2xl font-medium tracking-tight leading-[1.2] text-[#0f172a]",
  };

  return (
    <Component className={cn(sizeClasses[size], className)}>
      {children}
    </Component>
  );
}

interface TextProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "base" | "lg" | "xl";
  muted?: boolean;
  mono?: boolean;
}

export function Text({
  children,
  className,
  size = "base",
  muted = false,
  mono = false,
}: TextProps) {
  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <p
      className={cn(
        "font-body leading-relaxed",
        muted ? "text-[#64748b]" : "text-[#0f172a]",
        mono && "font-mono",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </p>
  );
}

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted";
}

export function Label({
  children,
  className,
  variant = "default",
}: LabelProps) {
  const variantClasses = {
    default: "text-[#0f172a] bg-[#cbd5e1]/20",
    muted: "text-[#64748b] bg-[#cbd5e1]/10",
    accent: "text-[#e63946] bg-[#e63946]/10",
  };

  return (
    <span
      className={cn(
        "text-xs font-medium uppercase tracking-widest",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface DataValueProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "base" | "lg" | "xl" | "2xl";
  trend?: "up" | "down" | "flat";
}

export function DataValue({
  children,
  className,
  size = "lg",
  trend,
}: DataValueProps) {
  const sizeClasses = {
    sm: "text-lg font-medium",
    base: "text-2xl font-medium",
    lg: "text-4xl font-medium tabular-nums tracking-tight",
    xl: "text-5xl font-medium tabular-nums tracking-tight",
    "2xl": "text-6xl md:text-7xl font-medium tabular-nums tracking-tight",
  };

  const trendClasses = {
    up: "text-emerald-600",
    down: "text-rose-600",
    flat: "text-stone-600",
  };

  return (
    <span
      className={cn(
        sizeClasses[size],
        trend && trendClasses[trend],
        "font-mono",
        className
      )}
    >
      {children}
    </span>
  );
}

interface AnnotationProps {
  children: React.ReactNode;
  className?: string;
}

export function Annotation({ children, className }: AnnotationProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium",
        "bg-amber-50 text-amber-700 rounded-full border border-amber-200",
        className
      )}
    >
      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
      {children}
    </span>
  );
}

interface MetricProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export function Metric({ label, value, unit, className }: MetricProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Label className="mb-1 text-[#64748b]">{label}</Label>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tighter text-[#0f172a]">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-[#64748b]">{unit}</span>
        )}
      </div>
    </div>
  );
}
