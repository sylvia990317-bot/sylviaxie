"use client";

import { useState } from "react";
import Image from "next/image";

export type ConceptOption = { name: string; slug: string; selected: boolean; ratio: number };

/**
 * Section 06's concept carousel. Client component (page.tsx is a Server Component) because
 * the arrows are real, not decorative: clicking either one rotates which concept sits
 * centre-stage, with the other two swapping to the flanking slots.
 *
 * All three <li>s stay mounted in fixed DOM order the whole time -- only each one's
 * `data-position` changes -- so cycling never remounts an <Image>.
 *
 * SIMPLIFIED (2026-09-09, third pass, per Sylvia directly: "太多没有用的内容了... 参考
 * halogrip的[ 05 / CONCEPT EXPLORATION ]的结构，就是简单说一下每个concept的名字"). Mirrors the
 * structural pattern of HALOGRIP's own `app/work/halogrip/concept-carousel.tsx`: one copy
 * block below the whole deck, not a label under every card -- it just names whichever
 * concept is centred, plus a `NN / total` counter. `options` must list the selected
 * concept last (content.ts's own doc comment says so): reaching it is what triggers the
 * "reveal" below, same as HALOGRIP's deck fading its own background cards away only on its
 * final index. On arrival, the two flanking concepts fade out completely
 * (`.ph-06-carousel-final`, CSS) and the copy swaps to the selected-direction eyebrow and
 * note -- a state the carousel reaches, not a fixture permanently under it.
 */
export default function ConceptCarousel({
  options,
  selectedEyebrow,
  selectedNote,
}: {
  options: ConceptOption[];
  selectedEyebrow: string;
  selectedNote: string;
}) {
  const initial = Math.max(
    options.findIndex((o) => o.selected),
    0
  );
  const [center, setCenter] = useState(initial);
  const n = options.length;

  const prev = () => setCenter((c) => (c - 1 + n) % n);
  const next = () => setCenter((c) => (c + 1) % n);

  const active = options[center];

  return (
    <div className={`ph-06-carousel${active.selected ? " ph-06-carousel-final" : ""}`}>
      <div className="ph-06-carousel-row">
        <button type="button" className="ph-06-arrow" onClick={prev} aria-label="Show the previous concept">
          <span aria-hidden="true">‹</span>
        </button>

        <ul className="ph-06-carousel-track">
          {options.map((o, i) => {
            const offset = (i - center + n) % n;
            const position = offset === 0 ? "center" : offset === 1 ? "right" : "left";
            const isCenter = position === "center";
            return (
              <li key={o.slug} className="ph-06-carousel-item" data-position={position}>
                <div className="ph-06-carousel-frame">
                  <Image
                    src={`/post-harvest/concept/concept-${o.slug}-${isCenter ? 760 : 440}.webp`}
                    alt={`Hand-drawn concept sketch: ${o.name}`}
                    width={isCenter ? 760 : 440}
                    height={Math.round((isCenter ? 760 : 440) / o.ratio)}
                    sizes={isCenter ? "(max-width: 899px) 78vw, 40vw" : "(max-width: 899px) 40vw, 18vw"}
                    priority={isCenter}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <button type="button" className="ph-06-arrow" onClick={next} aria-label="Show the next concept">
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="ph-06-carousel-copy">
        {active.selected ? <p className="ph-lbl ph-06-carousel-eyebrow">{selectedEyebrow}</p> : null}
        <h3>{active.name}</h3>
        {active.selected ? <p className="ph-06-carousel-note">{selectedNote}</p> : null}
        <p className="ph-06-carousel-counter">
          {String(center + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
