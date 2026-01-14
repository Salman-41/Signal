"use client";

import { useEffect, useRef, useCallback, MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Types
interface ScrollTriggerConfig {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

interface AnimationConfig {
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number | object;
  scrollTrigger?: ScrollTriggerConfig;
}

// Custom hook for GSAP animations
export function useGsap<T extends Element = HTMLDivElement>(): {
  ref: MutableRefObject<T | null>;
  gsapContext: MutableRefObject<gsap.Context | null>;
} {
  const ref = useRef<T>(null);
  const gsapContext = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsapContext.current = gsap.context(() => {}, ref.current);

    return () => {
      gsapContext.current?.revert();
    };
  }, []);

  return { ref, gsapContext };
}

// Hook for scroll-triggered animations
export function useScrollAnimation(
  selector: string,
  config: AnimationConfig = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(selector);

      gsap.from(elements, {
        y: 60,
        opacity: 0,
        duration: config.duration || 0.8,
        ease: config.ease || "power3.out",
        stagger: config.stagger || 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          ...config.scrollTrigger,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selector, config]);

  return containerRef;
}

// Hook for staggered reveal animations
export function useStaggerReveal(
  itemSelector: string,
  options: {
    delay?: number;
    stagger?: number;
    y?: number;
    duration?: number;
  } = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(itemSelector);

      gsap.fromTo(
        items,
        {
          y: options.y || 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: options.duration || 0.6,
          ease: "power2.out",
          stagger: options.stagger || 0.08,
          delay: options.delay || 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [itemSelector, options]);

  return containerRef;
}

// Hook for parallax effects
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -20 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

// Animation presets
export const animations = {
  fadeInUp: (
    element: Element | string,
    config: AnimationConfig = {}
  ): gsap.core.Tween => {
    return gsap.from(element, {
      y: 40,
      opacity: 0,
      duration: config.duration || 0.8,
      ease: config.ease || "power3.out",
      delay: config.delay || 0,
      ...config,
    });
  },

  fadeIn: (
    element: Element | string,
    config: AnimationConfig = {}
  ): gsap.core.Tween => {
    return gsap.from(element, {
      opacity: 0,
      duration: config.duration || 0.6,
      ease: config.ease || "power2.out",
      delay: config.delay || 0,
      ...config,
    });
  },

  scaleIn: (
    element: Element | string,
    config: AnimationConfig = {}
  ): gsap.core.Tween => {
    return gsap.from(element, {
      scale: 0.95,
      opacity: 0,
      duration: config.duration || 0.6,
      ease: config.ease || "power2.out",
      delay: config.delay || 0,
      ...config,
    });
  },

  slideInLeft: (
    element: Element | string,
    config: AnimationConfig = {}
  ): gsap.core.Tween => {
    return gsap.from(element, {
      x: -60,
      opacity: 0,
      duration: config.duration || 0.8,
      ease: config.ease || "power3.out",
      delay: config.delay || 0,
      ...config,
    });
  },

  slideInRight: (
    element: Element | string,
    config: AnimationConfig = {}
  ): gsap.core.Tween => {
    return gsap.from(element, {
      x: 60,
      opacity: 0,
      duration: config.duration || 0.8,
      ease: config.ease || "power3.out",
      delay: config.delay || 0,
      ...config,
    });
  },

  countUp: (
    element: Element | string,
    endValue: number,
    config: AnimationConfig = {}
  ): gsap.core.Tween => {
    const obj = { value: 0 };
    return gsap.to(obj, {
      value: endValue,
      duration: config.duration || 1.5,
      ease: config.ease || "power2.out",
      delay: config.delay || 0,
      onUpdate: () => {
        const el =
          typeof element === "string"
            ? document.querySelector(element)
            : element;
        if (el) {
          el.textContent = Math.round(obj.value).toString();
        }
      },
      ...config,
    });
  },

  drawLine: (
    element: Element | string,
    config: AnimationConfig = {}
  ): gsap.core.Tween => {
    return gsap.from(element, {
      strokeDashoffset: 1000,
      duration: config.duration || 1.5,
      ease: config.ease || "power2.inOut",
      delay: config.delay || 0,
      ...config,
    });
  },
};

// Utility to create timeline
export function createTimeline(config?: gsap.TimelineVars): gsap.core.Timeline {
  return gsap.timeline(config);
}

// Utility to kill all animations in a container
export function killAnimations(container: Element | string): void {
  gsap.killTweensOf(container);
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === container) {
      trigger.kill();
    }
  });
}

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
