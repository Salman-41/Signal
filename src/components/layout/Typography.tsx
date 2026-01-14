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
      "text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.95] text-[#1d3557]",
    hero: "text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1] text-[#1d3557]",
    section:
      "text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] text-[#1d3557]",
    subsection: "text-2xl md:text-3xl font-medium tracking-tight leading-[1.2] text-[#1d3557]",
    card: "text-xl md:text-2xl font-medium tracking-tight leading-[1.2] text-[#1d3557]",
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
        sizeClasses[size],
        muted && "text-[#457b9d]",
        !muted && "text-[#1d3557]",
        mono && "font-mono",
        "leading-relaxed", // Added back leading-relaxed as it was removed in the proposed change
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
    default: "text-[#1d3557] bg-[#a8dadc]/10",
    muted: "text-[#457b9d] bg-[#a8dadc]/5",
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
