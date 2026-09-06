"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * One-time fade-up when a block first scrolls into view. FAIL-OPEN BY CONSTRUCTION.
 *
 * MOTION_INTENSITY 3 (was 0). This component was a deliberate no-op while the layout system
 * was rebuilt; the comment it carried then specified the ladder the motion pass had to use,
 * and this is that ladder. Every rung exists to answer one question: "what if this goes
 * wrong?" Content must never be left invisible.
 *
 *   1. SERVER-VISIBLE DEFAULT. The rendered markup carries `ph-reveal` and nothing else.
 *      `.ph-reveal { opacity: 1 }` is unconditional, so the first paint of a hard reload is
 *      the finished page. Nothing is hidden until JavaScript has run and decided to hide it.
 *
 *   2. REDUCED MOTION IS A CSS DECISION, NOT A JS ONE. `armed` may still be set here, but
 *      the rules that actually hide an armed block live inside
 *      `@media (prefers-reduced-motion: no-preference)`. A visitor who prefers reduced
 *      motion is never served an `opacity: 0` rule at all, so there is nothing to fail.
 *
 *   3. IN-VIEWPORT BLOCKS ARE NEVER ARMED. Anything already on screen at mount stays
 *      untouched. This is the fix for the flash that HALOGRIP's `SectionReveal` still has:
 *      it arms every block unconditionally in an effect, so above-the-fold content blinks
 *      to `opacity: 0` and fades back in. It also means an anchor landing (`/#status`) or a
 *      restored scroll position shows its target immediately.
 *
 *   4. GENEROUS rootMargin. The observer fires 10% of a viewport before the block arrives,
 *      so a fast scroll does not outrun the reveal.
 *
 *   5. A TIMER UN-ARMS ANYTHING LEFT. If the observer never fires -- disconnected, throttled
 *      in a background tab, broken by a browser quirk -- everything still armed is revealed
 *      after 1200ms. The worst failure is a late fade, never a blank page.
 *
 *   6. NO JAVASCRIPT, NO PROBLEM. Without JS this effect never runs, nothing is armed, and
 *      rung 1 leaves the page fully visible.
 *
 * `tag` lets this wrap something other than a `<div>` so a heading can be revealed in place
 * without adding a wrapper to the layout. `once` is implied: the observer disconnects on the
 * first intersection and the block is never re-hidden.
 */
export default function Reveal({
  id,
  tag = "div",
  className = "",
  children,
}: {
  id?: string;
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Rung 3: if any part of the block is already on screen (or above it), leave it alone.
    // Arming it would hide something the visitor is currently looking at.
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight) return;

    setArmed(true);

    // Rung 5. Held outside the observer so it still fires if the observer never does.
    const failSafe = window.setTimeout(() => setVisible(true), 1200);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      // Rung 4.
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );
    observer.observe(el);

    return () => {
      window.clearTimeout(failSafe);
      observer.disconnect();
    };
  }, []);

  const classes = [className, "ph-reveal", armed && "ph-reveal-armed", visible && "is-visible"]
    .filter(Boolean)
    .join(" ");

  // The union of every intrinsic tag intersects to `never` once a ref is in the props, so
  // this is cast the same way `halogrip/section-reveal.tsx` casts its own.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = tag as any;

  return (
    <Tag ref={ref} id={id} className={classes}>
      {children}
    </Tag>
  );
}
