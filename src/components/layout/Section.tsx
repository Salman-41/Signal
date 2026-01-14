"use client";

import React, { useRef, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullHeight?: boolean;
  animate?: boolean;
  background?: "default" | "muted" | "accent" | "dark";
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    children,
    className,
    id,
    fullHeight = false,
    animate = true,
    background = "default",
  },
  forwardedRef
) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = (forwardedRef as React.RefObject<HTMLElement>) || internalRef;

  useEffect(() => {
    if (!animate || !ref.current) return;

    const ctx = gsap.context(() => {
      // Animate section content
      const content = ref.current?.querySelector(".section-content");
      if (content) {
        gsap.fromTo(
          content,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, ref);

    return () => ctx.revert();
  }, [animate, ref]);

  const bgClasses = {
    default: "bg-[#f9fafb]",
    muted: "bg-[#cbd5e1]/20",
    accent: "bg-[#334155] text-white",
    dark: "bg-[#0f172a] text-white",
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={cn(
        "relative w-full",
        fullHeight && "min-h-screen",
        bgClasses[background],
        className
      )}
    >
      <div className="section-content">{children}</div>
    </section>
  );
});

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide" | "full";
}

export function Container({
  children,
  className,
  size = "full",
}: ContainerProps) {
  const sizeClasses = {
    default: "max-w-6xl",
    narrow: "max-w-4xl",
    wide: "max-w-7xl",
    full: "max-w-none",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-6 md:px-8 lg:px-12",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg" | "xl";
}

export function Grid({ children, className, cols = 3, gap = "lg" }: GridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  };

  return (
    <div className={cn("grid", colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

interface DividerProps {
  className?: string;
  variant?: "subtle" | "medium" | "strong";
}

export function Divider({ className, variant = "subtle" }: DividerProps) {
  const variantClasses = {
    subtle: "border-slate-200",
    medium: "border-slate-300",
    strong: "border-slate-400",
  };

  return <hr className={cn("border-t", variantClasses[variant], className)} />;
}

interface SpacerProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Spacer({ size = "lg" }: SpacerProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-16",
    lg: "h-24",
    xl: "h-32",
    "2xl": "h-48",
  };

  return <div className={sizeClasses[size]} />;
}
