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
            ? "bg-[#f1faee]/80 backdrop-blur-lg border-b border-[#a8dadc]/50"
            : "bg-transparent",
          isHidden && "-translate-y-full",
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(0, { duration: 1 });
              }}
              className="flex items-center gap-2 text-[#1d3557] group"
            >
              <Activity className="w-6 h-6 text-[#e63946] group-hover:rotate-12 transition-transform" />
              <span className="font-medium text-lg tracking-tight">Signal</span>
            </a>

            {/* Center: System Status - Smartly fitting text */}
            <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#457b9d]/60">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e63946] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e63946]"></span>
                </span>
                <span>System Live</span>
              </div>
              <div className="w-px h-3 bg-[#a8dadc]/50" />
              <div className="overflow-hidden whitespace-nowrap max-w-[200px]">
                <div className="animate-marquee-slow inline-block">
                  Global Ingestion Active • 54 Sources Online • Latency 12ms • 
                </div>
              </div>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm font-medium text-[#457b9d] hover:text-[#1d3557] transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e63946] transition-all group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#457b9d] hover:text-[#1d3557] transition-colors"
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
          "fixed inset-0 z-40 bg-[#f1faee] md:hidden transition-all duration-500",
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
              className="text-2xl font-medium text-[#1d3557] hover:text-[#457b9d] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
