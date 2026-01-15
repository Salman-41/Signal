"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Section, Container } from "@/components/layout/Section";
import { Heading, Text } from "@/components/layout/Typography";
import {
  NewsArticle,
  fetchNewsForSignal,
  getSentimentColor,
  formatRelativeTime,
} from "@/lib/signals/news-api";
import {
  Newspaper,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

interface GlobalNewsSectionProps {
  className?: string;
}

// Signal IDs to aggregate news from
const NEWS_SIGNAL_IDS = [
  "gdp-growth",
  "inflation-cpi",
  "unemployment",
  "ai-adoption",
  "temp-anomaly",
];

export function GlobalNewsSection({ className }: GlobalNewsSectionProps) {
  const [articles, setArticles] = useState<(NewsArticle & { signalId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadAllNews = async () => {
    setLoading(true);
    try {
      const allArticles: (NewsArticle & { signalId: string })[] = [];
      
      for (const signalId of NEWS_SIGNAL_IDS) {
        const news = await fetchNewsForSignal(signalId);
        news.forEach(article => {
          allArticles.push({ ...article, signalId });
        });
      }

      // Sort by date and deduplicate
      const uniqueArticles = allArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .filter((article, index, self) => 
          index === self.findIndex(a => a.title === article.title)
        )
        .slice(0, 6);

      setArticles(uniqueArticles);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllNews();
  }, []);

  const SentimentIcon = ({ sentiment }: { sentiment?: NewsArticle["sentiment"] }) => {
    if (sentiment === "positive") return <TrendingUp className="w-3 h-3" />;
    if (sentiment === "negative") return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  return (
    <Section className={cn("py-16 md:py-24", className)} background="default">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-[#e63946]" />
              <Heading as="h2" size="section" className="text-[#0f172a] text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                Latest Signal News
              </Heading>
            </div>
            <Text size="base" muted className="text-sm">
              Real-time headlines affecting global indicators
            </Text>
          </div>
          
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-[10px] sm:text-xs text-[#94a3b8] font-mono hidden sm:block">
                REFRESHED: {formatRelativeTime(lastUpdated)}
              </span>
            )}
            <button
              onClick={loadAllNews}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg border border-[#cbd5e1]/50 text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-[#0f172a] hover:border-[#e63946]/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", loading && "animate-spin")} />
              Sync
            </button>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="group block p-6 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#e63946]/30 hover:shadow-xl transition-all cursor-default"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#e63946]">
                    {article.source}
                  </span>
                  <span className="text-[10px] text-[#94a3b8]">
                    {formatRelativeTime(article.publishedAt)}
                  </span>
                  {article.sentiment && (
                    <span className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ml-auto",
                      getSentimentColor(article.sentiment)
                    )}>
                      <SentimentIcon sentiment={article.sentiment} />
                    </span>
                  )}
                </div>
                
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group-hover:text-[#e63946] transition-colors mb-2"
                >
                  <h3 className="text-base font-bold text-[#0f172a] leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                </a>
                
                <p className="text-sm text-[#64748b] leading-relaxed line-clamp-2 mb-4">
                  {article.description}
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/signals/${article.signalId}`}
                    className="text-xs font-medium text-[#64748b] hover:text-[#e63946] transition-colors"
                  >
                    View Signal →
                  </Link>
                  <a 
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#cbd5e1] group-hover:text-[#e63946] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
