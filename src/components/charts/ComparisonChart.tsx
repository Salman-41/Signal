"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ComparisonData, DataPoint } from "@/lib/signals/types";
import { Label } from "@/components/layout/Typography";
import gsap from "gsap";

interface ComparisonChartProps {
  data: ComparisonData;
  className?: string;
  width?: number;
  height?: number;
  showAnnotations?: boolean;
}

export function ComparisonChart({
  data,
  className,
  width = 600,
  height = 200,
  showAnnotations = true,
}: ComparisonChartProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  const { pathA, pathB, divergenceMarkers, xLabels } = useMemo(() => {
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const allValues = [
      ...data.seriesA.data.map((d) => d.value),
      ...data.seriesB.data.map((d) => d.value),
    ];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;

    const generatePath = (points: DataPoint[]) => {
      if (!points.length) return "";

      const pathPoints = points.map((d, i) => {
        const x = padding.left + (i / (points.length - 1)) * chartWidth;
        const y = padding.top + ((max - d.value) / range) * chartHeight;
        return `${x},${y}`;
      });

      return `M ${pathPoints.join(" L ")}`;
    };

    const pathA = generatePath(data.seriesA.data);
    const pathB = generatePath(data.seriesB.data);

    // Generate x-axis labels
    const labelCount = 5;
    const xLabels = Array.from({ length: labelCount }, (_, i) => {
      const index = Math.floor(
        (i / (labelCount - 1)) * (data.seriesA.data.length - 1)
      );
      const point = data.seriesA.data[index];
      const x =
        padding.left + (index / (data.seriesA.data.length - 1)) * chartWidth;
      return {
        x,
        label: point.date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });

    // Divergence markers
    const divergenceMarkers =
      data.divergencePoints
        ?.map((dp) => {
          const index = data.seriesA.data.findIndex(
            (d) => d.date.getTime() === dp.date.getTime()
          );
          if (index === -1) return null;

          const x =
            padding.left +
            (index / (data.seriesA.data.length - 1)) * chartWidth;
          return { x, y: padding.top, description: dp.description };
        })
        .filter(Boolean) || [];

    return { pathA, pathB, divergenceMarkers, xLabels };
  }, [data, width, height]);

  useEffect(() => {
    if (!containerRef.current) return;

    const paths = containerRef.current.querySelectorAll(".comparison-line");

    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }
      );
    });

    // Animate annotations
    const annotations =
      containerRef.current.querySelectorAll(".annotation-marker");
    gsap.fromTo(
      annotations,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, delay: 1.2, ease: "back.out(1.7)" }
    );
  }, [data]);

  return (
    <div className={cn("relative", className)}>
      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-0.5"
            style={{ backgroundColor: data.seriesA.color }}
          />
          <span className="text-sm text-stone-600">{data.seriesA.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-0.5"
            style={{ backgroundColor: data.seriesB.color }}
          />
          <span className="text-sm text-stone-600">{data.seriesB.label}</span>
        </div>
      </div>

      <svg
        ref={containerRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={40}
            y1={20 + (height - 60) * ratio}
            x2={width - 20}
            y2={20 + (height - 60) * ratio}
            stroke="#f5f5f4"
            strokeWidth={1}
          />
        ))}

        {/* X-axis labels */}
        {xLabels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={height - 10}
            textAnchor="middle"
            className="text-xs fill-stone-400"
          >
            {label.label}
          </text>
        ))}

        {/* Series A */}
        <path
          className="comparison-line"
          d={pathA}
          fill="none"
          stroke={data.seriesA.color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Series B */}
        <path
          className="comparison-line"
          d={pathB}
          fill="none"
          stroke={data.seriesB.color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 3"
        />

        {/* Divergence markers */}
        {showAnnotations &&
          divergenceMarkers.map(
            (marker, i) =>
              marker && (
                <g key={i} className="annotation-marker">
                  <line
                    x1={marker.x}
                    y1={marker.y}
                    x2={marker.x}
                    y2={height - 40}
                    stroke="#fbbf24"
                    strokeWidth={1}
                    strokeDasharray="4 2"
                  />
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r={6}
                    fill="#fbbf24"
                    stroke="white"
                    strokeWidth={2}
                  />
                </g>
              )
          )}
      </svg>

      {/* Annotation callouts */}
      {showAnnotations && divergenceMarkers.length > 0 && (
        <div className="mt-4 space-y-2">
          {divergenceMarkers.map(
            (marker, i) =>
              marker && (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-stone-600"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{marker.description}</span>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
