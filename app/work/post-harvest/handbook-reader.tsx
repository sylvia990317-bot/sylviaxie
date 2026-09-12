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
 * ONE ENTRANCE, DELIBERATELY SECONDARY (Sylvia, 2026-09-06, revised twice on 2026-09-07).
 * The handbook spreads in 07 used to carry a pill each, so the page had four ways in and
 * none of them looked like the main one. The spreads are plain, non-clickable images now —
 * they are the primary reading path, understandable without opening anything. The control
 * that opens the 53-page reader went through two shapes after that: first a full-width
 * "paper on blue" band (too dominant once the reader was reclassified as optional), then a
 * small bordered box beneath the previews (correctly sized, but floating alone in its own
 * empty stretch of canvas — a third composition the section did not need). It is now a
 * plain text link inside the previews' own header row, beside the "Inside the handbook"
 * label — see `.ph-07-inside-head` in page.tsx — which is where "optional access" reads as
 * part of the previews rather than a separate destination.
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
 * The page's one way into the handbook: a single-line text button, no box, sized to its own
 * label. One line only — no page count on a second line — because the surrounding copy
 * already carries the "what this is" job; this control's only job is "there is more."
 *
 * SUPERSEDED in section 07 by `HandbookCoverOpen` below (2026-09-07, layout-reference pass):
 * that section now makes the cover itself the entrance, with this same label as its caption
 * rather than a standalone link. Kept exported in case another section wants a plain text
 * entrance without a cover to attach it to.
 */
export function HandbookOpen({ label }: { label: string }) {
  return (
    <button type="button" className="ph-hb-textlink" onClick={() => openHandbook(HANDBOOK_PLATE_PAGE.cover)}>
      {label}
    </button>
  );
}

/**
 * The cover AND its caption are one click target (2026-09-07, layout-reference pass): "the
 * entire cover must be clickable" and "clicking either the cover or CTA" open the same
 * destination, so one <button> wraps both rather than two separate controls racing each
 * other. A `<button>` cannot contain another interactive element, which is also why this
 * replaced `HandbookOpen` here instead of nesting it inside a clickable figure.
 *
 * THERE IS NO PDF. The brief that produced this component asked for "the existing full
 * handbook PDF" — no such file exists anywhere in the repository; the handbook has only
 * ever existed as this in-page flip reader over 53 page images (see the file header above:
 * "MOTION IS OFF... no page-turn animation" was an explicit, deliberate choice, not an
 * oversight). This opens that real reader instead of linking to a asset that does not
 * exist. TODO(sylvia): if a PDF export of the handbook gets made, this is the one place to
 * point at it.
 *
 * SUPERSEDED in section 07 by `HandbookPhotoOpen` below (2026-09-07, image-composite pass):
 * that section's cover is now a separate photo asset (own baked-in shadow, not this flat
 * cropped spread) positioned over a pre-composed background image, with the CTA/contents
 * text rendered as their own overlays beside it rather than packed into the same button.
 * Kept exported and untouched -- same reasoning as `HandbookOpen` above -- in case another
 * section wants this exact cover-plus-caption-in-one-button shape.
 */
export function HandbookCoverOpen({
  coverSrc, coverAlt, coverWidth, coverHeight, ctaLabel, contentsLine,
}: {
  coverSrc: string; coverAlt: string; coverWidth: number; coverHeight: number;
  ctaLabel: string; contentsLine: string;
}) {
  return (
    <button
      type="button"
      className="ph-07-hb-open"
      onClick={() => openHandbook(HANDBOOK_PLATE_PAGE.cover)}
      aria-label={`${ctaLabel}. Opens the construction handbook, page by page, in place on this page.`}
    >
      <span className="ph-07-cover-stack">
        <Image src={coverSrc} alt={coverAlt} width={coverWidth} height={coverHeight} sizes="(max-width: 899px) 60vw, 320px" />
      </span>
      <span className="ph-07-hb-cta">{ctaLabel}</span>
      <span className="ph-07-hb-contents-line">{contentsLine}</span>
    </button>
  );
}

/**
 * The isolated-photo handbook entrance (2026-09-07, image-composite pass). Section 07's
 * visual now sits on top of a pre-composed background photo (see `.ph-fc-visual` in
 * page.tsx) with the handbook itself as a separate absolutely-positioned foreground photo
 * asset (its own baked-in cover art, paper edges and drop shadow -- not the flat cropped
 * `handbook-cover-1600.webp` spread `HandbookCoverOpen` above still uses). SAME click
 * target as every other entrance on this page: `openHandbook(HANDBOOK_PLATE_PAGE.cover)`,
 * unchanged. Deliberately just the photo -- no CTA/contents spans baked into the button,
 * since those now render as their own separately positioned text overlays beside it. The
 * hover lift/scale/shadow/tilt live entirely in CSS (`.ph-fc-handbook-open`), gated behind
 * `@media (hover: hover)` so touch devices never get a stuck hover state.
 */
export function HandbookPhotoOpen({
  photoSrc, photoAlt, photoWidth, photoHeight, ctaLabel, className,
}: {
  photoSrc: string; photoAlt: string; photoWidth: number; photoHeight: number;
  ctaLabel: string; className?: string;
}) {
  return (
    <button
      type="button"
      className={`ph-fc-handbook-open${className ? ` ${className}` : ""}`}
      onClick={() => openHandbook(HANDBOOK_PLATE_PAGE.cover)}
      aria-label={`${ctaLabel}. Opens the construction handbook, page by page, in place on this page.`}
    >
      <Image
        src={photoSrc} alt={photoAlt} width={photoWidth} height={photoHeight}
        sizes="(max-width: 899px) 46vw, 26vw"
      />
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
