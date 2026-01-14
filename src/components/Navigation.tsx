"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLenis, useScrollDirection } from "@/lib/motion/lenis";
import { Activity, Menu, X } from "lucide-react";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection();
  const { scrollTo } = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Signals", href: "#live-signals" },
    { label: "Deep Dive", href: "#deep-dive" },
    { label: "Comparisons", href: "#comparisons" },
    { label: "Methodology", href: "#methodology" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    scrollTo(href, { duration: 1.2 });
  };

  const isHidden = scrollDirection === "down" && isScrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-[#f9fafb]/80 backdrop-blur-lg shadow-sm"
            : "bg-transparent",
          isHidden && "-translate-y-full",
          className
        )}
      >
        <div className="w-full px-6 md:px-8 lg:px-12">
          <nav className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(0, { duration: 1 });
                }}
                className="flex items-center gap-3 text-[#0f172a] group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#0f172a] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 text-[#e63946]" />
                </div>
                <span className="font-semibold text-lg tracking-tight">Signal</span>
              </a>

              {/* System Live - Minimal with Metrics */}
              <div className="hidden sm:flex items-center gap-4 text-[#0f172a]/50">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#0f172a]">Live</span>
                </div>
                <div className="w-px h-3 bg-[#cbd5e1]" />
                <div className="flex items-center gap-4 text-[9px] font-mono whitespace-nowrap">
                  <span>54_SOURCES</span>
                  <span>LATENCY: 12ms</span>
                </div>
              </div>
            </div>



            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e63946] transition-all group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#64748b] hover:text-[#0f172a] transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#f9fafb] md:hidden transition-all duration-500",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="text-2xl font-medium text-[#0f172a] hover:text-[#64748b] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
