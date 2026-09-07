"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Tracks which of its `.ph-04-step` children currently spans one fixed reading line and
 * reflects that as a `data-active-step` attribute on its own root, so CSS attribute
 * selectors (not JS class-juggling on the children) drive which right-column visual is
 * showing and which step reads as current.
 *
 * REBUILT 2026-09-07 (Sylvia: "uncontrolled step transitions... use GSAP ScrollTrigger or
 * an equivalent deterministic calculation, not competing IntersectionObserver thresholds").
 * The previous version used one `IntersectionObserver` with five thresholds and picked
 * whichever step had the highest intersection RATIO (intersecting area / the step's own
 * total area). That is not a fixed reading line: a short step (02 was a single sentence)
 * reaches ratio 1 the instant it's fully inside the observer's band, so it fired and
 * cleared again almost immediately, while a tall step (01, three paragraphs) stayed
 * "winning" over a much longer scroll distance purely because it had more area to
 * intersect with -- the three steps were never actually getting comparable scroll
 * intervals, independent of `.ph-04-step`'s own `min-height` (see post-harvest.css).
 *
 * Each step now gets its own `ScrollTrigger`, `start: "top 48%"` / `end: "bottom 48%"`:
 * the trigger is active exactly while that step's own [top, bottom] span contains the
 * fixed line at 48% of the viewport, in EITHER scroll direction (`onToggle`). Because the
 * three steps are stacked with no gaps, at most one is ever active, and which one is a
 * direct, deterministic read of scroll position -- not a competing-thresholds race.
 *
 * Fail-open, same shape as `reveal.tsx`:
 *   1. SERVER-VISIBLE DEFAULT. `armed` starts false, so the root carries only the caller's
 *      `className` -- no `ph-04-armed`. Every CSS rule that turns the right column into a
 *      sticky, cross-fading stage lives under `.ph-04-armed` in post-harvest.css, so a
 *      server render or a no-JS visitor gets the plain stacked flow: nothing to opt out of
 *      because nothing was ever opted in. Without JS this effect never runs at all.
 *   2. No `.ph-04-step` children found -> never armed, same fallback as (1).
 *   3. READ-ONLY, NOT PINNED. No `pin`, no `scrub`, no `scrollIntoView`, no wheel
 *      handling, no `preventDefault`, no scroll-snap. Every trigger here only *reads*
 *      scroll position via `onToggle`; the right visual's own `position: sticky` (plain
 *      CSS, not GSAP-pinned) is what keeps it in place, and it un-sticks the moment the
 *      user scrolls past the three steps' combined height -- the thing Sylvia's brief
 *      explicitly ruled out twice now ("Do not use scroll-jacking or a long pinned
 *      timeline").
 *   4. `prefers-reduced-motion` is a CSS decision, not a JS one, same as `reveal.tsx`: this
 *      component still updates `data-active-step` under reduced motion (the step and its
 *      visual still need to be readably in sync with scroll position), and it is
 *      post-harvest.css's `@media (prefers-reduced-motion: reduce)` rules that drop the
 *      crossfade's `transition` so the swap is instant instead of animated.
 */
export default function ScrollSteps({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false);

  // Rung 2 check, split into its own effect on purpose: `setArmed(true)` here only queues
  // the `ph-04-armed` class -- the class does not exist in the DOM until React commits the
  // re-render this causes. The second effect below depends on `armed` specifically so it
  // only runs AFTER that commit, once `.ph-04-step`'s `min-height: 60svh` (gated on
  // `.ph-04-armed`, see post-harvest.css) has actually been applied. Measuring before that
  // point was the bug in the first pass at this: `ScrollTrigger.create` read each step's
  // still-short, pre-armed height, so `end: "bottom 48%"` landed hundreds of pixels short
  // of where the step's real (tall) bottom edge ended up a moment later, and every step
  // after the first became unreachable.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const hasSteps = root.querySelector(":scope > .ph-04-step") !== null;
    if (hasSteps) setArmed(true); // rung 2 fails open (stays false) otherwise
  }, []);

  useEffect(() => {
    if (!armed) return;
    const root = rootRef.current;
    if (!root) return;

    const steps = Array.from(root.querySelectorAll<HTMLElement>(":scope > .ph-04-step"));
    if (steps.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      steps.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 48%",
          end: "bottom 48%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });

      // Safety net, not the primary fix: re-measure once webfonts finish swapping in.
      // Geist/Bodoni Moda (next/font/google, `display: swap`) can still reflow the page
      // after this effect's own first paint, which would otherwise leave the triggers'
      // cached start/end pinned to pre-swap positions for the rest of the page's life.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }, root);

    return () => context.revert();
  }, [armed]);

  // A small accessibility nicety, not the primary mechanism: mark the current step so
  // assistive tech can tell which one the reading line is on. Purely additive -- CSS drives
  // the actual visual state off `data-active-step` regardless of this attribute.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const steps = root.querySelectorAll<HTMLElement>(":scope > .ph-04-step");
    steps.forEach((el, i) => {
      if (i === active) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
    });
  }, [active]);

  const classes = [className, armed && "ph-04-armed"].filter(Boolean).join(" ");

  return (
    <div ref={rootRef} className={classes} data-active-step={active}>
      {children}
    </div>
  );
}
