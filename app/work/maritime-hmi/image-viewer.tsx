"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Native dialog supplies top-layer rendering and background inertness. The source
 * link remains usable before hydration and when JavaScript is disabled. */
export default function ImageViewer({
  src, alt, title, children,
}: { src: string; alt: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const pan = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const previousCanvas = useRef({ width: 0, height: 0 });
  const labelId = useId();
  const helpId = useId();
  const fit = natural.width && size.width
    ? Math.min((size.width - 32) / natural.width, (size.height - 32) / natural.height, 1)
    : 0;
  const imageWidth = Math.max(1, natural.width * fit * zoom);
  const imageHeight = Math.max(1, natural.height * fit * zoom);
  const canvasWidth = Math.max(size.width, imageWidth);
  const canvasHeight = Math.max(size.height, imageHeight);

  useEffect(() => {
    if (!open) return;
    const el = dialog.current;
    const view = viewport.current;
    if (!el || !view) return;
    el.showModal();
    closeButton.current?.focus({ preventScroll: true });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const measure = () => setSize({ width: view.clientWidth, height: view.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(view);
    return () => {
      observer.disconnect();
      el.close();
      document.body.style.overflow = overflow;
      pan.current = null;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useLayoutEffect(() => {
    const el = viewport.current;
    const old = previousCanvas.current;
    if (el && old.width && old.height) {
      el.scrollLeft = ((el.scrollLeft + el.clientWidth / 2) / old.width) * canvasWidth - el.clientWidth / 2;
      el.scrollTop = ((el.scrollTop + el.clientHeight / 2) / old.height) * canvasHeight - el.clientHeight / 2;
    }
    previousCanvas.current = { width: canvasWidth, height: canvasHeight };
  }, [canvasWidth, canvasHeight]);

  return (
    <div className="mh-image-viewer">
      <a ref={trigger} href={src} target="_blank" rel="noopener noreferrer"
        className="mh-image-open" aria-label={`Enlarge ${title}`}
        aria-haspopup="dialog"
        onClick={(event) => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          if (typeof HTMLDialogElement === "undefined" || !HTMLDialogElement.prototype.showModal) return;
          event.preventDefault();
          setZoom(1);
          setFailed(false);
          setNatural({ width: 0, height: 0 });
          previousCanvas.current = { width: 0, height: 0 };
          setOpen(true);
        }}>
        <span className="mh-image-preview">{children}</span>
        <span className="mh-image-open-label">View detail <span aria-hidden="true">↗</span></span>
      </a>
      {open && (
        <dialog ref={dialog} className="mh-viewer-dialog" aria-labelledby={labelId}
          aria-describedby={helpId}
          onCancel={(event) => { event.preventDefault(); setOpen(false); }}>
          <div className="mh-viewer-toolbar">
            <h2 id={labelId}>{title}</h2>
            <div className="mh-viewer-controls">
              <button type="button" disabled={zoom <= 1 || !natural.width} aria-label="Zoom out"
                onClick={() => setZoom((value) => Math.max(1, value - 0.5))}>−</button>
              <output aria-live="polite" aria-label="Zoom level">{zoom.toFixed(1)}×</output>
              <button type="button" disabled={zoom >= 12 || !natural.width} aria-label="Zoom in"
                onClick={() => setZoom((value) => Math.min(12, value + 0.5))}>+</button>
              <button type="button" onClick={() => setZoom(1)}>Fit</button>
              <button ref={closeButton} type="button" onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>
          <p id={helpId} className="mh-viewer-help">Use + / − to zoom. Drag or scroll to explore; on a touchscreen, swipe to pan.</p>
          <div ref={viewport} className="mh-viewer-viewport" tabIndex={0}
            role="region" aria-label="Enlarged image, scroll to explore"
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse" || event.button !== 0 || zoom <= 1) return;
              const el = event.currentTarget;
              pan.current = { x: event.clientX, y: event.clientY, left: el.scrollLeft, top: el.scrollTop };
              el.setPointerCapture(event.pointerId);
              event.preventDefault();
            }}
            onPointerMove={(event) => {
              if (!pan.current) return;
              event.currentTarget.scrollLeft = pan.current.left + pan.current.x - event.clientX;
              event.currentTarget.scrollTop = pan.current.top + pan.current.y - event.clientY;
            }}
            onPointerUp={() => { pan.current = null; }}
            onPointerCancel={() => { pan.current = null; }}
            onLostPointerCapture={() => { pan.current = null; }}>
            {failed ? (
              <p className="mh-viewer-message" role="alert">The image could not load. <a href={src} target="_blank" rel="noopener noreferrer">Open the original image</a>.</p>
            ) : (
              <>
                {!natural.width && <p className="mh-viewer-message" role="status">Loading image…</p>}
                <div className="mh-viewer-canvas" style={{ width: canvasWidth, height: canvasHeight }}>
                  {/* Keep original pixels available when inspecting dense interface text. */}
                  <img src={src} alt={alt} draggable={false}
                    style={{ width: imageWidth, height: imageHeight, visibility: natural.width ? "visible" : "hidden" }}
                    onLoad={(event) => setNatural({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
                    onError={() => setFailed(true)} />
                </div>
              </>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
