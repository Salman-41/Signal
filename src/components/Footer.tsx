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
    <footer className={cn("bg-[#1d3557] text-[#f1faee] py-16", className)}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-[#e63946]" />
              <span className="font-medium text-lg tracking-tight">Signal</span>
            </div>
            <p className="text-[#f1faee]/70 max-w-md">
              A trend intelligence platform helping you understand what is
              changing, where, and how fast. Built with free, public APIs and
              client-side processing.
            </p>
          </div>

          {/* Signals */}
          <div>
            <h4 className="font-medium text-[#a8dadc] mb-4 uppercase tracking-wider text-xs">Signals</h4>
            <ul className="space-y-2">
              {[
                "Economic",
                "Climate",
                "Technology",
                "Public Interest",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-[#94a3b8] hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-medium text-[#a8dadc] mb-4 uppercase tracking-wider text-xs">About</h4>
            <ul className="space-y-2">
              {[
                { label: "Methodology", href: "#methodology" },
                { label: "Data Sources", href: "#methodology" },
                { label: "Privacy Policy", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#cbd5e1]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © {currentYear} Signal. Open data for everyone.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f1faee]/50 hover:text-[#f1faee] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f1faee]/50 hover:text-[#f1faee] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
