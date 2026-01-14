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
            ? "bg-white/80 backdrop-blur-lg border-b border-stone-200/50"
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
              className="flex items-center gap-2 text-stone-900"
            >
              <Activity className="w-6 h-6" />
              <span className="font-medium text-lg tracking-tight">Signal</span>
            </a>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors"
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
          "fixed inset-0 z-40 bg-white md:hidden transition-all duration-500",
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
              className="text-2xl font-medium text-stone-900 hover:text-stone-600 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
