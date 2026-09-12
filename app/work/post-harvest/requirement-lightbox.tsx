"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Section 05's requirement-list preview: a small, deliberately secondary plate (see
 * `.ph-req-preview` in post-harvest.css) that opens the same list full-size in a lightbox.
 * `preview` and `full` are both server-rendered `InlineSvg` output (see page.tsx) -- this
 * component never touches the SVG itself, only whether the full version is shown.
 *
 * PORTAL, NOT A SEPARATE MOUNT SITE. `handbook-reader.tsx`'s overlay is mounted once at
 * the page root and opened through a module-level bus, because ITS trigger exists in
 * several different places across section 07. This lightbox has exactly one trigger (the
 * preview itself, plus one text link beside it, both inside this same component), so
 * there is no multi-entrance problem to solve -- `createPortal(..., document.body)` is
 * enough to guarantee the overlay's `position: fixed` box is never constrained by an
 * ancestor that turns out to set `transform`/`filter`/`contain` (any of which would give
 * a fixed descendant the wrong containing block). The portal only ever renders while
 * `open` is true, i.e. only after a client-side click, so `document` is always available
 * by then -- no SSR guard needed, same reasoning `handbook-reader.tsx` relies on for its
 * own browser-only calls.
 *
 * Same close/keyboard/scroll-lock shape as `handbook-reader.tsx`'s overlay, minus the
 * paging it doesn't need: Escape closes, a click on the backdrop (not the image) closes,
 * body scroll is locked while open, and focus returns to whichever trigger opened it.
 */
export default function RequirementLightbox({
  preview,
  full,
  dialogLabel,
  triggerLabel,
  caption,
  viewLabel,
}: {
  /** Small, bounded-size rendering of the diagram (the plate people see by default). */
  preview: React.ReactNode;
  /** Larger rendering of the same diagram, shown only inside the open lightbox. */
  full: React.ReactNode;
  /** aria-label for the dialog itself, e.g. "Requirement list, full view". */
  dialogLabel: string;
  /** aria-label suffix on the preview button, e.g. "Requirement list preview". */
  triggerLabel: string;
  caption: React.ReactNode;
  /** The "View full list ↗" text link beneath the caption. */
  viewLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const openIt = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // The effect restores focus after removing background inertness.
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    closeRef.current?.focus({ preventScroll: true });
    // Portal is a body child. Background content must be non-interactive while open.
    const background = Array.from(document.body.children)
      .filter((el): el is HTMLElement => el instanceof HTMLElement && el !== dialog)
      .map((el) => ({ el, inert: el.inert }));
    background.forEach(({ el }) => { el.inert = true; });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((el) => el.getClientRects().length > 0 && !el.closest('[inert]'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (!first) {
          e.preventDefault();
          dialog.focus({ preventScroll: true });
        } else if (!dialog.contains(active) || active === dialog ||
          (e.shiftKey ? active === first : active === last)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus({ preventScroll: true });
        }
      }
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      background.forEach(({ el, inert }) => { el.inert = inert; });
      // Restore only after background inertness is removed.
      returnFocus.current?.focus({ preventScroll: true });
      returnFocus.current = null;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        className="ph-req-preview-btn"
        onClick={openIt}
        aria-label={`${triggerLabel}. Opens full size.`}
      >
        {preview}
      </button>
      <p className="ph-cap ph-req-cap">{caption}</p>
      <button type="button" className="ph-req-viewlink" onClick={openIt}>
        {viewLabel}
      </button>

      {open &&
        createPortal(
          <div
            className="ph-reqlb-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={dialogLabel}
            ref={dialogRef}
            tabIndex={-1}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            {/* `.ph-reqlb-bar` sits in normal flow above the stage, NOT `position: fixed`
                at a viewport corner -- the page's own persistent `.ph-back` ("Close
                project") pill already lives at that exact corner (top:20/right:20) on
                every route, and a second fixed control in the same spot collided with it
                (2026-09-08, caught in browser testing). Attaching Close to the dialog's
                own layout instead avoids that entirely, independent of z-index. */}
            <div className="ph-reqlb-bar" style={{ width: "min(92vw, 1120px)" }}>
              <button ref={closeRef} type="button" className="ph-reqlb-close" onClick={close}>
                Close<span aria-hidden="true"> ×</span>
              </button>
            </div>
            <div className="ph-reqlb-stage">{full}</div>
          </div>,
          document.body
        )}
    </>
  );
}
