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
    <footer className={cn("bg-stone-950 text-white py-16", className)}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6" />
              <span className="font-medium text-lg tracking-tight">Signal</span>
            </div>
            <p className="text-stone-400 max-w-md">
              A trend intelligence platform helping you understand what is
              changing, where, and how fast. Built with free, public APIs and
              client-side processing.
            </p>
          </div>

          {/* Signals */}
          <div>
            <h4 className="font-medium text-white mb-4">Signals</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#live-signals"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Economic
                </a>
              </li>
              <li>
                <a
                  href="#live-signals"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Climate
                </a>
              </li>
              <li>
                <a
                  href="#live-signals"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="#live-signals"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Public Interest
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-medium text-white mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#methodology"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Methodology
                </a>
              </li>
              <li>
                <a
                  href="#methodology"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Data Sources
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-500">
            © {currentYear} Signal. Open data for everyone.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-white transition-colors"
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
