"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

interface LenisInstance {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: object) => void;
}

let lenisInstance: Lenis | null = null;

export function useLenis(): LenisInstance {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Return existing instance if available
    if (lenisInstance) {
      setLenis(lenisInstance);
      return;
    }

    // Create new Lenis instance
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisInstance = instance;
    setLenis(instance);

    // Animation frame loop
    function raf(time: number) {
      instance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      instance.destroy();
      lenisInstance = null;
    };
  }, []);

  const scrollTo = (target: string | number | HTMLElement, options?: object) => {
    if (lenis) {
      lenis.scrollTo(target, options);
    }
  };

  return { lenis, scrollTo };
}

// Hook to get scroll progress
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

// Hook to detect scroll direction
export function useScrollDirection(): "up" | "down" | null {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setDirection("up");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return direction;
}

// Hook to check if element is in viewport
export function useInView(
  threshold: number = 0.1
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// Hook to get section visibility
export function useSectionVisibility(sectionId: string): number {
  const [visibility, setVisibility] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const element = document.getElementById(sectionId);
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, Math.min(rect.bottom, windowHeight));
      const visibleBottom = Math.max(
        0,
        Math.min(windowHeight - rect.top, windowHeight)
      );
      const visibleHeight = Math.min(visibleTop, visibleBottom);
      const sectionVisibility = visibleHeight / windowHeight;

      setVisibility(Math.max(0, Math.min(1, sectionVisibility)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionId]);

  return visibility;
}
