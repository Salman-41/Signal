"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Section";
import { Activity, Github, Twitter } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-[#0f172a] text-white py-20 relative overflow-hidden", className)}>
      {/* Background Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#e63946]/5 rounded-full blur-[200px] -translate-y-1/3 translate-x-1/3" />
      
      <Container>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-8 h-8 text-[#e63946]" />
              <span className="font-medium text-lg tracking-tight">Signal</span>
            </div>
            <p className="text-white/50 max-w-md leading-relaxed text-sm md:text-base">
              A trend intelligence platform helping you understand what is
              changing, where, and how fast. Built with free, public APIs and
              client-side processing.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all font-mono"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all font-mono"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Signals */}
          <div className="col-span-1">
            <h4 className="font-bold text-[10px] text-white/30 mb-6 uppercase tracking-[0.2em] font-mono">Signals</h4>
            <ul className="space-y-3">
              {[
                "Economic",
                "Climate",
                "Technology",
                "Public Interest",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="col-span-1">
            <h4 className="font-bold text-[10px] text-white/30 mb-6 uppercase tracking-[0.2em] font-mono">About</h4>
            <ul className="space-y-3">
              {[
                { label: "Methodology", href: "#methodology" },
                { label: "Data Sources", href: "#methodology" },
                { label: "Privacy Policy", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-4">
          <p className="text-[10px] md:text-xs text-white/30 font-mono text-center sm:text-left">
            © {currentYear} Signal. Open data for everyone.
          </p>
          <div className="flex items-center gap-4 text-[10px] font-mono text-white/20">
            <span className="tracking-tighter uppercase">SYSTEM_V4.2</span>
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span className="tracking-tighter uppercase">OPERATIONAL</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
