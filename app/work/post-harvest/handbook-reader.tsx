"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  HANDBOOK_CHAPTERS,
  HANDBOOK_OVERVIEW,
  HANDBOOK_PAGES,
  HANDBOOK_PLATE_PAGE,
  HANDBOOK_TOTAL,
} from "./handbook-pages";

/**
 * Section 07's handbook reader: the construction handbook, flippable in place.
 *
 * WHY A MODULE-LEVEL BUS. The overlay is mounted once at the page root (it cannot live
 * inside section 07 — see page.tsx), while the thing that opens it sits inside 07. One
 * `<HandbookReader />` mounts the overlay; `<HandbookOpen />` is a small client island
 * elsewhere in the tree that calls `openHandbook(n)`. That is cheaper than threading
 * context through the server component and keeps the two free to move independently.
 *
 * ONE ENTRANCE, DELIBERATELY SECONDARY (Sylvia, 2026-09-06, revised 2026-09-07). The
 * handbook spreads in 07 used to carry a pill each, so the page had four ways in and none
 * of them looked like the main one. The spreads are plain, non-clickable images now — they
 * are the primary reading path, understandable without opening anything — and this one
 * outline button is the only control. The 53-page reader is an optional deep dive that
 * interrupts the case-study flow, so the button reads as available, not as the section's
 * focal point: readable label, modest size, no fill.
 *
 * MOTION IS OFF (see reveal.tsx — Sylvia's instruction, 2026-09-03). There is no page-turn
 * animation, no fade between sheets and no transform on open. Turning a page swaps the
 * image on the same frame. The only transitions in the stylesheet are hover/focus states on
 * the controls, which are affordances rather than motion.
 *
 * TWO TIERS. The reader opens on the seven overview sheets. The 46 assembly sheets load
 * behind "View all 53 pages" — see handbook-pages.ts for why.
 */

type Opener = (page: number) => void;

const openers = new Set<Opener>();

/** Open the reader on a 1-based handbook page. No-op if the overlay is not mounted. */
function openHandbook(page: number) {
  for (const fn of openers) fn(page);
}

/**
 * The page's one way into the handbook: a small outline button, sized to its own content
 * rather than the canvas width, so it cannot out-weigh the two previews above it. It is a
 * `<button>` in its entirety rather than a link with a hit area, so there is no dead space
 * inside it that looks clickable but is not. The arrow lives in the copy itself (`sub`, from
 * content.ts), not as a separate element, since the two-line label is quoted verbatim.
 */
export function HandbookOpen({ title, sub }: { title: string; sub: string }) {
  return (
    <button type="button" className="ph-hb-secondary" onClick={() => openHandbook(HANDBOOK_PLATE_PAGE.cover)}>
      <span className="ph-hb-secondary-title">{title}</span>
      <span className="ph-hb-secondary-sub">{sub}</span>
    </button>
  );
}

const chapterOfIndex = (i: number) => HANDBOOK_PAGES[i].chapter;

export default function HandbookReader() {
  const [open, setOpen] = useState(false);
  /** Whether all 53 sheets are in play, or only the 7-page overview. */
  const [expanded, setExpanded] = useState(false);
  /** 0-based index into HANDBOOK_PAGES. */
  const [i, setI] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  /** What had focus before the reader opened, so it can be handed back on close. */
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const last = (expanded ? HANDBOOK_TOTAL : HANDBOOK_OVERVIEW) - 1;

  const close = useCallback(() => {
    setOpen(false);
    // `preventScroll` matters here: the trigger sits mid-page, under the two previews, and
    // a plain `.focus()` on an element the browser considers not-fully-visible scrolls it
    // into view — which would move the visitor's scroll position on close even though
    // nothing about the underlying page ever moved while the reader was open (the overlay
    // is `position: fixed` and `overflow: hidden` on body only blocks scrolling, it does
    // not change the stored offset). This is what "preserve scroll position" means here.
    returnFocus.current?.focus({ preventScroll: true });
    returnFocus.current = null;
  }, []);

  const go = useCallback(
    (next: number) => setI((cur) => Math.min(Math.max(next, 0), (expanded ? HANDBOOK_TOTAL : HANDBOOK_OVERVIEW) - 1)),
    [expanded]
  );

  /** Reveal the assembly sheets, optionally landing on a specific one. */
  const expand = useCallback((to?: number) => {
    setExpanded(true);
    if (to !== undefined) setI(Math.min(Math.max(to, 0), HANDBOOK_TOTAL - 1));
  }, []);

  /**
   * Next at the end of the overview is the one place the tier boundary is felt, so it does
   * the obvious thing: it opens the rest and turns to the first assembly sheet, rather than
   * dead-ending on a disabled button next to a link that does the same thing.
   */
  const next = useCallback(() => {
    if (!expanded && i === HANDBOOK_OVERVIEW - 1) expand(HANDBOOK_OVERVIEW);
    else go(i + 1);
  }, [expand, expanded, go, i]);

  const prev = useCallback(() => go(i - 1), [go, i]);

  // Subscribe to the open bus. Opening on a sheet past the overview implies the full set.
  useEffect(() => {
    const fn: Opener = (page) => {
      const idx = Math.min(Math.max(page - 1, 0), HANDBOOK_TOTAL - 1);
      returnFocus.current = document.activeElement as HTMLElement | null;
      if (idx >= HANDBOOK_OVERVIEW) setExpanded(true);
      setI(idx);
      setOpen(true);
    };
    openers.add(fn);
    return () => {
      openers.delete(fn);
    };
  }, []);

  // Keyboard, and the scroll lock. Both only exist while the overlay is up.
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" || e.key === "PageDown") next();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(expanded ? HANDBOOK_TOTAL - 1 : HANDBOOK_OVERVIEW - 1);
      else return;
      e.preventDefault();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [close, expanded, go, next, open, prev]);

  if (!open) return null;

  const page = HANDBOOK_PAGES[i];
  const chapter = chapterOfIndex(i);
  const total = expanded ? HANDBOOK_TOTAL : HANDBOOK_OVERVIEW;
  // Only the current sheet and its two neighbours are in the DOM. The neighbours are
  // hidden but still fetched, so turning a page is instant without pulling 6 MB up front.
  const neighbours = [i - 1, i + 1].filter((n) => n >= 0 && n < total);

  return (
    <div
      className="ph-hb-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Construction handbook, page ${page.n} of ${HANDBOOK_TOTAL}`}
      ref={dialogRef}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="ph-hb-bar">
        <p className="ph-hb-title">
          <b>Construction handbook</b>
          <span>{chapter.title}</span>
        </p>
        <button type="button" className="ph-hb-close" onClick={close}>
          Close<span aria-hidden="true"> ×</span>
        </button>
      </div>

      <div
        className="ph-hb-stage"
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < 44) return;
          if (dx < 0) next();
          else prev();
        }}
      >
        <button
          type="button"
          className="ph-hb-arrow prev"
          onClick={prev}
          disabled={i === 0}
          aria-label="Previous page"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <figure className="ph-hb-sheet">
          <Image
            key={page.n}
            src={page.src}
            alt={page.alt}
            width={page.width}
            height={page.height}
            sizes="(max-width: 900px) 94vw, min(1180px, 82vw)"
            priority
          />
        </figure>

        <button
          type="button"
          className="ph-hb-arrow next"
          onClick={next}
          disabled={expanded && i === last}
          aria-label={!expanded && i === HANDBOOK_OVERVIEW - 1 ? "Show the assembly sheets" : "Next page"}
        >
          <span aria-hidden="true">›</span>
        </button>

        <div className="ph-hb-preload" aria-hidden="true">
          {neighbours.map((n) => (
            <Image
              key={HANDBOOK_PAGES[n].n}
              src={HANDBOOK_PAGES[n].src}
              alt=""
              width={HANDBOOK_PAGES[n].width}
              height={HANDBOOK_PAGES[n].height}
              sizes="1px"
            />
          ))}
        </div>
      </div>

      <div className="ph-hb-foot">
        <p className="ph-hb-count" aria-live="polite">
          <b>{String(page.n).padStart(2, "0")}</b>
          <span>/ {String(total).padStart(2, "0")}</span>
        </p>

        {expanded ? (
          <nav className="ph-hb-jump" aria-label="Handbook chapters">
            {HANDBOOK_CHAPTERS.map((c) => (
              <button
                type="button"
                key={c.id}
                className={c.id === chapter.id ? "is-current" : undefined}
                aria-current={c.id === chapter.id ? "true" : undefined}
                onClick={() => go(c.from - 1)}
              >
                {c.title}
              </button>
            ))}
          </nav>
        ) : (
          <p className="ph-hb-tier">
            <span>The overview. The remaining {HANDBOOK_TOTAL - HANDBOOK_OVERVIEW} sheets are the assembly steps.</span>
            <button type="button" onClick={() => expand(HANDBOOK_OVERVIEW)}>
              View all {HANDBOOK_TOTAL} pages
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
