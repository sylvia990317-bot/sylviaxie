"use client";

import { useEffect, useRef } from "react";

/**
 * Measures its own rendered height and publishes it as `--ph-04-head-h` on the document
 * root, so the sticky scroll stage in post-harvest.css (`.ph-04-step`, `.ph-04-visual`)
 * can size itself to sit exactly below the sticky section-04 header at any viewport width
 * or height, instead of a hand-tuned `clamp()` guess that drifts out of sync with the
 * header's own type scale the moment either changes.
 *
 * Same fail-open shape as reveal.tsx/scroll-steps.tsx: the header is laid out and legible
 * with no JS (this only measures an already-visible element, never hides content), and
 * `:root`'s own fallback default for `--ph-04-head-h` (post-harvest.css) covers the brief
 * instant before this effect's first measurement commits.
 */
export default function HeadHeightVar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => {
      document.documentElement.style.setProperty("--ph-04-head-h", `${el.offsetHeight}px`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
