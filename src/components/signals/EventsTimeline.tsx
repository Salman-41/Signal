"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  HistoricalEvent,
  getEventsForSignal,
  getImpactColor,
} from "@/lib/signals/events-data";
import {
  TrendingUp,
  Thermometer,
  Cpu,
  Users,
  Globe,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface EventsTimelineProps {
  signalId: string;
  className?: string;
  maxEvents?: number;
}

const categoryIcons = {
  economic: TrendingUp,
  climate: Thermometer,
  technology: Cpu,
  social: Users,
  geopolitical: Globe,
};

export function EventsTimeline({ signalId, className, maxEvents = 5 }: EventsTimelineProps) {
  const events = getEventsForSignal(signalId).slice(0, maxEvents);

  if (events.length === 0) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-[#64748b]" />
        <span className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
          Historical Context
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#cbd5e1] via-[#e2e8f0] to-transparent" />

        {/* Events */}
        <div className="space-y-4">
          {events.map((event, index) => {
            const IconComponent = categoryIcons[event.category];
            const impactColors = getImpactColor(event.impact);

            return (
              <div key={event.id} className="relative pl-8">
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white",
                    event.magnitude === 3 ? "border-[#e63946]" :
                    event.magnitude === 2 ? "border-[#f59e0b]" : "border-[#64748b]"
                  )}
                >
                  <IconComponent className="w-3 h-3 text-[#64748b]" />
                </div>

                {/* Event card */}
                <div
                  className={cn(
                    "p-4 rounded-xl border transition-all hover:shadow-md",
                    impactColors
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                          {formatDate(event.date)}
                        </span>
                        {event.magnitude === 3 && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700">
                            <AlertCircle className="w-2.5 h-2.5" />
                            Major
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold leading-tight mb-1">
                        {event.title}
                      </h4>
                      <p className="text-xs opacity-80 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show more hint */}
      {getEventsForSignal(signalId).length > maxEvents && (
        <p className="text-xs text-[#94a3b8] text-center pl-8">
          + {getEventsForSignal(signalId).length - maxEvents} more events
        </p>
      )}
    </div>
  );
}
