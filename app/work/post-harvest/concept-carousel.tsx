"use client";

import { useState } from "react";
import Image from "next/image";

export type ConceptOption = { name: string; slug: string; selected: boolean };

/**
 * Section 06's concept carousel. Client component (page.tsx is a Server Component) because
 * the arrows are real, not decorative: clicking either one rotates which concept sits
 * centre-stage, with the other two swapping to the flanking slots.
 *
 * All three <li>s stay mounted in fixed DOM order the whole time -- only each one's
 * `data-position` (and the CSS `order` it drives) changes -- so cycling never remounts an
 * <Image>, and the position swap can transition instead of jump.
 *
 * The two flanking sketches carry a real `rotateY` on `.ph-06-carousel-frame`, angled away
 * from the centred one (`transform-origin` on the inner edge of each), which is what gives
 * the row actual depth rather than a flat scale/opacity fade.
 */
export default function ConceptCarousel({ options }: { options: ConceptOption[] }) {
  const initial = Math.max(
    options.findIndex((o) => o.selected),
    0
  );
  const [center, setCenter] = useState(initial);
  const n = options.length;

  const prev = () => setCenter((c) => (c - 1 + n) % n);
  const next = () => setCenter((c) => (c + 1) % n);

  return (
    <div className="ph-06-carousel">
      <button type="button" className="ph-06-arrow" onClick={prev} aria-label="Show the previous concept">
        <span aria-hidden="true">‹</span>
      </button>

      <ul className="ph-06-carousel-track">
        {options.map((o, i) => {
          const offset = (i - center + n) % n;
          const position = offset === 0 ? "center" : offset === 1 ? "right" : "left";
          const isCenter = position === "center";
          return (
            <li key={o.slug} data-position={position}>
              <div className="ph-06-carousel-frame">
                <Image
                  src={`/post-harvest/concept/concept-${o.slug}-${isCenter ? 760 : 440}.webp`}
                  alt={`Hand-drawn concept sketch: ${o.name}`}
                  width={isCenter ? 760 : 440}
                  height={isCenter ? 620 : 360}
                  sizes={isCenter ? "(max-width: 899px) 78vw, 40vw" : "(max-width: 899px) 40vw, 18vw"}
                />
              </div>
              {/* The centred tower carries no label of its own: the response line and the
                  selected-direction statement right below both name it already, so a third
                  label here would only repeat them. */}
              {isCenter ? null : <p className="ph-06-carousel-name">{o.name}</p>}
            </li>
          );
        })}
      </ul>

      <button type="button" className="ph-06-arrow" onClick={next} aria-label="Show the next concept">
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}
