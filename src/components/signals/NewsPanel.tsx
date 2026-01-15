"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

interface NewsPanelProps {
  signalId: string;
  className?: string;
  maxArticles?: number;
}

export function NewsPanel({ signalId, className, maxArticles = 3 }: NewsPanelProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const news = await fetchNewsForSignal(signalId);
        if (mounted) {
          setArticles(news.slice(0, maxArticles));
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load news");
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      mounted = false;
    };
  }, [signalId, maxArticles]);

  const SentimentIcon = ({ sentiment }: { sentiment?: NewsArticle["sentiment"] }) => {
    if (sentiment === "positive") return <TrendingUp className="w-3 h-3" />;
    if (sentiment === "negative") return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Newspaper className="w-5 h-5 text-[#64748b]" />
        <span className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
          Related News
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-[#64748b]" />
        </div>
      ) : error ? (
        <div className="text-sm text-[#94a3b8] text-center py-4">{error}</div>
      ) : articles.length === 0 ? (
        <div className="text-sm text-[#94a3b8] text-center py-4">No news available</div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#e63946]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                      {article.source}
                    </span>
                    <span className="text-[10px] text-[#94a3b8]">
                      {formatRelativeTime(article.publishedAt)}
                    </span>
                    {article.sentiment && (
                      <span className={cn(
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold",
                        getSentimentColor(article.sentiment)
                      )}>
                        <SentimentIcon sentiment={article.sentiment} />
                        {article.sentiment}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#0f172a] leading-tight mb-1 group-hover:text-[#e63946] transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
                    {article.description}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#e63946] transition-colors shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
