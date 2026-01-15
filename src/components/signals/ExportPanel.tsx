"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { DataPoint } from "@/lib/signals/types";
import {
  Download,
  Share2,
  Copy,
  Check,
  FileJson,
  FileSpreadsheet,
  Link2,
  X,
} from "lucide-react";

interface ExportPanelProps {
  signalId: string;
  signalTitle: string;
  data: DataPoint[];
  className?: string;
}

export function ExportPanel({ signalId, signalTitle, data, className }: ExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const formatDataForCSV = (): string => {
    const header = "Date,Value\n";
    const rows = data.map(d => {
      const dateStr = new Date(d.date).toISOString().split("T")[0];
      return `${dateStr},${d.value}`;
    }).join("\n");
    return header + rows;
  };

  const formatDataForJSON = (): string => {
    return JSON.stringify({
      signal: signalId,
      title: signalTitle,
      exportedAt: new Date().toISOString(),
      dataPoints: data.map(d => ({
        date: new Date(d.date).toISOString().split("T")[0],
        value: d.value,
      })),
    }, null, 2);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csv = formatDataForCSV();
    downloadFile(csv, `${signalId}-data.csv`, "text/csv");
  };

  const handleDownloadJSON = () => {
    const json = formatDataForJSON();
    downloadFile(json, `${signalId}-data.json`, "application/json");
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/signals/${signalId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: signalTitle,
          text: `Check out this signal: ${signalTitle}`,
          url: `${window.location.origin}/signals/${signalId}`,
        });
      } catch {
        setShareModalOpen(true);
      }
    } else {
      setShareModalOpen(true);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Download className="w-5 h-5 text-[#64748b]" />
        <span className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
          Export & Share
        </span>
      </div>

      {/* Export buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownloadCSV}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#cbd5e1]/50 bg-white hover:border-[#e63946]/30 hover:bg-[#fef2f2] transition-all group"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#64748b] group-hover:text-[#e63946]" />
          <span className="text-sm font-medium text-[#0f172a]">CSV</span>
        </button>
        <button
          onClick={handleDownloadJSON}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#cbd5e1]/50 bg-white hover:border-[#e63946]/30 hover:bg-[#fef2f2] transition-all group"
        >
          <FileJson className="w-4 h-4 text-[#64748b] group-hover:text-[#e63946]" />
          <span className="text-sm font-medium text-[#0f172a]">JSON</span>
        </button>
      </div>

      {/* Share buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#cbd5e1]/50 bg-white hover:border-[#e63946]/30 hover:bg-[#fef2f2] transition-all group"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 text-[#64748b] group-hover:text-[#e63946]" />
              <span className="text-sm font-medium text-[#0f172a]">Copy Link</span>
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#cbd5e1]/50 bg-white hover:border-[#e63946]/30 hover:bg-[#fef2f2] transition-all group"
        >
          <Share2 className="w-4 h-4 text-[#64748b] group-hover:text-[#e63946]" />
          <span className="text-sm font-medium text-[#0f172a]">Share</span>
        </button>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0f172a]">Share Signal</h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[#f1f5f9] transition-colors"
              >
                <X className="w-5 h-5 text-[#64748b]" />
              </button>
            </div>

            <div className="space-y-4">
              {/* URL display */}
              <div className="flex items-center gap-2 p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/signals/${signalId}`}
                  className="flex-1 bg-transparent text-sm text-[#0f172a] outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg hover:bg-white transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#64748b]" />
                  )}
                </button>
              </div>

              {/* Social share buttons */}
              <div className="flex items-center justify-center gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${signalTitle}`)}&url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/signals/${signalId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/signals/${signalId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
