"use client";

import React, { useEffect, useRef } from "react";

/** Content is visible by default. Only animate when an offscreen block approaches
 * the viewport; a missed observer or unavailable animation API never hides it. */
export default function Reveal({
  id, tag = "div", className = "", children,
}: {
  id?: string;
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || preference.matches || !("IntersectionObserver" in window) || !el.animate) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (preference.matches) return;
      animation = el.animate(
        [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }],
        { duration: 620, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }, { rootMargin: "0px 0px 120px 0px", threshold: 0 });
    const onPreference = () => {
      if (preference.matches) {
        observer.disconnect();
        animation?.cancel();
      }
    };
    preference.addEventListener("change", onPreference);
    observer.observe(el);
    return () => {
      observer.disconnect();
      animation?.cancel();
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  // Intrinsic tag unions cannot represent the shared HTMLElement ref directly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = tag as any;
  return <Tag ref={ref} id={id} className={className}>{children}</Tag>;
}
