"use client";

import { useEffect, useRef } from "react";

/**
 * Measures its own rendered height and publishes it as `--ph-04-head-h` on the document
 * root, so the sticky scroll stage in post-harvest.css can size scene offsets to sit
 * exactly below the sticky section-04 header at any viewport width or height, instead of
 * a hand-tuned `clamp()` guess that drifts out of sync with the header's own type scale
 * the moment either changes.
 *
 * REVIVED (2026-09-09, same session it was deleted in): the header was made plain block
 * flow (not sticky) earlier this session to fix a layering bug where it and a scene could
 * render in the same space. Sylvia then asked for the header back as a persistent,
 * always-visible band while scrolling through the section ("Finding the focus... 这个要
 * 一直在"). With the header sticky again, `.ph-04-scene`'s `top` needs to know the
 * header's real height once more to stay clear of it -- see post-harvest.css's own
 * comment on why that offset is a plain `top` value with no `transform` this time, unlike
 * the version that caused the original bug.
 *
 * Same fail-open shape as reveal.tsx: the header is laid out and legible
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
