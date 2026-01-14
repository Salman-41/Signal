"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { DataPoint } from "@/lib/signals/types";
import gsap from "gsap";

interface SparklineChartProps {
  data: DataPoint[];
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  color?: string;
  showArea?: boolean;
  animate?: boolean;
}

export function SparklineChart({
  data,
  className,
  width = 200,
  height = 60,
  strokeWidth = 2,
  color = "#10b981",
  showArea = false,
  animate = true,
}: SparklineChartProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);

  const { linePath, areaPath } = useMemo(() => {
    if (!data.length) return { linePath: "", areaPath: "" };

    const padding = 4;
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y =
        height - padding - ((d.value - min) / range) * (height - 2 * padding);
      return { x, y };
    });

    const linePath = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`;
    const areaPath = `${linePath} L ${points[points.length - 1].x},${
      height - padding
    } L ${points[0].x},${height - padding} Z`;

    return { linePath, areaPath };
  }, [data, width, height]);

  useEffect(() => {
    if (!animate || !pathRef.current) return;

    const pathLength = pathRef.current.getTotalLength();

    gsap.fromTo(
      pathRef.current,
      {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      },
      {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.out",
      }
    );

    if (showArea && areaRef.current) {
      gsap.fromTo(
        areaRef.current,
        { opacity: 0 },
        { opacity: 0.15, duration: 0.8, delay: 0.4, ease: "power2.out" }
      );
    }
  }, [animate, linePath, showArea]);

  if (!data.length) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      style={{ width, height }}
    >
      {showArea && <path ref={areaRef} d={areaPath} fill={color} opacity={0} />}
      <path
        ref={pathRef}
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface DeviationChartProps {
  data: DataPoint[];
  baseline: number;
  className?: string;
  width?: number;
  height?: number;
  positiveColor?: string;
  negativeColor?: string;
}

export function DeviationChart({
  data,
  baseline,
  className,
  width = 400,
  height = 120,
  positiveColor = "#10b981",
  negativeColor = "#f43f5e",
}: DeviationChartProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  const { bars, baselineY } = useMemo(() => {
    if (!data.length) return { bars: [], baselineY: height / 2 };

    const padding = { top: 10, bottom: 10, left: 10, right: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const values = data.map((d) => d.value);
    const min = Math.min(...values, baseline);
    const max = Math.max(...values, baseline);
    const range = max - min || 1;

    const baselineY = padding.top + ((max - baseline) / range) * chartHeight;

    const barWidth = Math.max(2, (chartWidth / data.length) * 0.6);
    const gap = (chartWidth / data.length) * 0.4;

    const bars = data.map((d, i) => {
      const x = padding.left + i * (barWidth + gap);
      const valueY = padding.top + ((max - d.value) / range) * chartHeight;
      const isPositive = d.value >= baseline;

      return {
        x,
        y: isPositive ? valueY : baselineY,
        width: barWidth,
        height: Math.abs(valueY - baselineY),
        isPositive,
      };
    });

    return { bars, baselineY };
  }, [data, baseline, width, height]);

  useEffect(() => {
    if (!containerRef.current) return;

    const barElements = containerRef.current.querySelectorAll(".deviation-bar");

    gsap.fromTo(
      barElements,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.02,
      }
    );
  }, [data]);

  if (!data.length) return null;

  return (
    <svg
      ref={containerRef}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
    >
      {/* Baseline */}
      <line
        x1={10}
        y1={baselineY}
        x2={width - 10}
        y2={baselineY}
        stroke="#d4d4d4"
        strokeWidth={1}
        strokeDasharray="4 2"
      />

      {/* Bars */}
      {bars.map((bar, i) => (
        <rect
          key={i}
          className="deviation-bar"
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          fill={bar.isPositive ? positiveColor : negativeColor}
          rx={1}
          style={{
            transformOrigin: `${bar.x + bar.width / 2}px ${baselineY}px`,
          }}
        />
      ))}
    </svg>
  );
}

interface RateOfChangeChartProps {
  data: DataPoint[];
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export function RateOfChangeChart({
  data,
  className,
  width = 400,
  height = 100,
  color = "#6366f1",
}: RateOfChangeChartProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  const rateData = useMemo(() => {
    if (data.length < 2) return [];

    return data.slice(1).map((d, i) => {
      const prevValue = data[i].value;
      const rate = ((d.value - prevValue) / prevValue) * 100;
      return { date: d.date, value: rate };
    });
  }, [data]);

  const { linePath, areaPath, zeroY } = useMemo(() => {
    if (!rateData.length)
      return { linePath: "", areaPath: "", zeroY: height / 2 };

    const padding = 10;
    const values = rateData.map((d) => d.value);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 0);
    const range = max - min || 1;

    const zeroY = padding + ((max - 0) / range) * (height - 2 * padding);

    const points = rateData.map((d, i) => {
      const x = padding + (i / (rateData.length - 1)) * (width - 2 * padding);
      const y = padding + ((max - d.value) / range) * (height - 2 * padding);
      return { x, y };
    });

    const linePath = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`;
    const areaPath = `${linePath} L ${points[points.length - 1].x},${zeroY} L ${
      points[0].x
    },${zeroY} Z`;

    return { linePath, areaPath, zeroY };
  }, [rateData, width, height]);

  useEffect(() => {
    if (!containerRef.current) return;

    const path = containerRef.current.querySelector(".rate-line");
    if (path) {
      const pathLength = (path as SVGPathElement).getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: pathLength, strokeDashoffset: pathLength },
        { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" }
      );
    }

    const area = containerRef.current.querySelector(".rate-area");
    if (area) {
      gsap.fromTo(
        area,
        { opacity: 0 },
        { opacity: 0.1, duration: 0.8, delay: 0.4, ease: "power2.out" }
      );
    }
  }, [rateData]);

  if (rateData.length < 2) return null;

  return (
    <svg
      ref={containerRef}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
    >
      {/* Zero line */}
      <line
        x1={10}
        y1={zeroY}
        x2={width - 10}
        y2={zeroY}
        stroke="#e5e5e5"
        strokeWidth={1}
      />

      {/* Area */}
      <path className="rate-area" d={areaPath} fill={color} opacity={0} />

      {/* Line */}
      <path
        className="rate-line"
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
