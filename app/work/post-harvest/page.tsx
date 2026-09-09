import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono, Bodoni_Moda } from "next/font/google";
import "./post-harvest.css";
import Reveal from "./reveal";
import InlineSvg from "./inline-svg";
import HeadHeightVar from "./head-height";
import {
  project, meta, context, field, participants, focus, challenge,
  concepts, finalConcept, mechanism, status, reflection, chapterLabel, phases,
} from "./content";
import HandbookReader, { HandbookOpen, HandbookPhotoOpen } from "./handbook-reader";
import RequirementLightbox from "./requirement-lightbox";
import ConceptCarousel from "./concept-carousel";

/* Route-scoped fonts, same pattern HALOGRIP uses: none of these reach `/` or any other
   route. Geist carries readable text; Bodoni Moda carries display, section numerals and
   quotes, giving the editorial contrast against the technical linework.
   The diagrams are inlined SVG (see inline-svg.tsx) so their labels bind to these same
   variables rather than falling back to a system sans. */
const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--ph-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--ph-mono" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], display: "swap", variable: "--ph-serif" });

const title = "Post Harvest / Sylvia Xie";
const description =
  "Rethinking maize drying with farmers in Seme. A field research and concept development case study by Sylvia Xie.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sylviaxie.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: "/post-harvest/photo/_DYR8130.jpg", width: 3936, height: 2648, alt: "Maize held in a farmer's hands in Seme, Kenya" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/post-harvest/photo/_DYR8130.jpg"] },
};

/** Real measured and calculated values only. `src` records the source page. */
const annotations = [
  { v: "10", k: "Shelves", src: "Measured, p.36" },
  { v: "81 x 70 x 2.5 cm", k: "Shelf size", src: "Measured, p.36" },
  { v: "approx. 100 kg", k: "Estimated design capacity", src: "Calculated, p.36" },
];

/** Section 07's own right-column spec block (fifth pass, real handbook assets): matches
 * `finalconcept reference.png`'s exact wording ("10 SHELVES" / "DRYING CAPACITY", etc.),
 * not `annotations` above -- that array's labels ("Shelf size", "Estimated design
 * capacity") are a later, evidence-review rewrite for a different layout pass. Kept as its
 * own array rather than editing `annotations` in place, since `annotations` may still be
 * the one other code expects if this section's copy reverts to the evidence-reviewed
 * wording later. */
const referenceSpecs = [
  { v: "10 shelves", k: "Drying capacity" },
  { v: "81 x 70 x 2.5 cm", k: "Main chamber (L x W x H)" },
  { v: "approx. 100 kg", k: "Total weight" },
];

function SectionHead({ n, heading, lead }: { n: string; heading: string; lead?: string }) {
  return (
    <div className="ph-head">
      <p className="ph-figure-num">{n}</p>
      <h2 className="ph-h2">{heading}</h2>
      {lead ? <p className="ph-lead">{lead}</p> : null}
    </div>
  );
}

/** Narrative phase rail. See `phases` in content.ts for why this is a separate registry
 * from the section numbers, and the "NARRATIVE PHASE RAIL" block in post-harvest.css for
 * the sticky mechanism. One instance now spans all of the Deliver phase (07-09) as a
 * single persistent sticky element -- it used to take a `dark` variant and repeat once
 * more, inverted, against Final Concept's own `--blue` background, but that meant the
 * rail released and re-pinned mid-chapter and read as two chapters instead of one; see
 * the CSS note on `.ph-fc` for where that inverted colouring went instead.
 *
 * A full-bleed `corner` variant (no reserved column) was tried for section 07 during a
 * reference-fidelity pass and reverted the same day (Sylvia: keeping the persistent
 * sidebar, consistent with every other section, mattered more than the closer width match
 * to the generated reference). Section 07 reads inside the normal sticky column again,
 * same as 02-03/05-06/08-09. */
function PhaseRail({ n, name, descriptor }: { n: string; name: string; descriptor: string }) {
  return (
    <aside className="ph-phase-rail" aria-label={`Phase ${n}, ${name}`}>
      <Reveal className="ph-phase-rail-inner">
        <p className="ph-phase-no">{n}</p>
        <p className="ph-phase-name">{name}</p>
        <p className="ph-phase-descriptor">{descriptor}</p>
      </Reveal>
    </aside>
  );
}

export default function PostHarvestPage() {
  const byName = (n: string) => participants.find((p) => p.name === n)!;

  return (
    <main className={`ph-root ${geist.variable} ${geistMono.variable} ${bodoni.variable}`}>
      <Link href="/" className="ph-back">Close project</Link>

      {/* ============ 01 Hero ============
          REBUILT 2026-09-07 to share HALOGRIP's hero storytelling system.

          The previous hero was a 50/50 split -- copy column left, tall 4:5 photograph
          bleeding off the right edge -- locked to `min-height: 100dvh` with its content
          vertically centred. Comparing it against HALOGRIP's actual hero
          (`scroll-intro.tsx`, not the unused `.hero-heading` CSS) showed the two shared no
          structural decision: HALOGRIP runs vertically, leads with the PROJECT NAME as its
          h1, carries place and year as an eyebrow opposite it, sets metadata as a
          horizontal `[ LABEL ] / value` grid, and puts one wide photograph underneath with
          its caption inside the image.

          Those roles are adopted here; the composition is not copied. The type stays Bodoni
          at Post Harvest's own scale rather than a 167px condensed sans, the accent stays
          blue, and the dominant visual is documentary field photography.

          What moved:
            - h1 is now the project name. The sentence that used to be the h1 ("Rethinking
              maize drying with farmers in Seme") is the descriptor beneath it, which is the
              job it was always doing.
            - Place and year left the Context metadata sentence and became their own eyebrow
              and their own columns.
            - The photograph is one wide band at canvas width, caption set inside it.
            - `min-height: 100dvh` is gone. The hero is as tall as its content (~950px), so
              the photograph is cut by the fold on a laptop. That crop is the invitation to
              scroll, which is why there is no arrow: the hero already carries four text
              groups and a fifth element would overload it. */}
      <header className="ph-section ph-v2 ph-hero" id="hero">
        <div className="ph-canvas ph-hero-inner">
          <div className="ph-hero-eyebrows">
            <p className="ph-chapter-label">{project.heroEyebrow}</p>
            <p className="ph-chapter-label">{project.heroPlaceYear}</p>
          </div>

          <h1 className="ph-display">{project.title}</h1>

          <p className="ph-hero-descriptor">{project.headline}.</p>

          {/* `--i` drives the entrance stagger from the CSS cascade, so the five columns
              arrive in order without any JavaScript. */}
          <dl className="ph-meta">
            {meta.map(([k, v], i) => (
              <div key={k} style={{ "--i": i } as React.CSSProperties}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <figure className="ph-hero-figure">
            <div className="ph-frame">
              <Image
                src="/post-harvest/photo/_DYR8130.jpg"
                alt="A farmer's hands holding a dried maize cob, Seme, Kenya"
                fill priority sizes="(max-width: 767px) 100vw, 1480px"
              />
            </div>
          </figure>

          {/* Closes the chapter and hands off to 02, which opens with its own label. */}
          <div className="ph-hero-rule" />
        </div>
      </header>

      {/* ============ Phase 01 / Discover (02 Context, 03 Field Research) ============
          Chapter-orientation pass (2026-09-07): groups the next two sections under the
          phase rail. See content.ts's `phases` and the "NARRATIVE PHASE RAIL" CSS block
          for the mechanism. No hairline above this phase -- the hero's own closing
          `.ph-hero-rule` already plays that role. */}
      <div className="ph-phase ph-phase-discover">
        <PhaseRail {...phases[0]} />

      {/* ============ 02 Context ============
          REBUILT 2026-09-07 (mockup-referenced pass) as one continuous narrative rather
          than a card grid: place -> the road into it -> the scale of the problem -> the
          harvest itself. Four beats, each its own Reveal so the map settles in before the
          road photograph, which settles in before the evidence rail, which settles in
          before the closing documentary pair -- see the per-beat comments below and the
          matching CSS block in post-harvest.css. */}
      <section className="ph-section ph-v2" id="context">
        <div className="ph-canvas">
          {/* DOM order stays the original reading order (eyebrow, title, dateline,
              paragraph) -- what changes on desktop is pure CSS grid placement (see
              #context .ph-v2-head in post-harvest.css), which repositions the dateline
              next to the eyebrow without touching source/mobile order. */}
          <Reveal>
            <div className="ph-v2-head">
              <p className="ph-chapter-label">{chapterLabel("context")}</p>
              <h2>{context.heading}</h2>
              <p className="ph-lbl">{context.dateline}</p>
              <div className="lede">
                <p>{context.lead}</p>
              </div>
            </div>
          </Reveal>

          {/* Location band: the two-stage locator (western Kenya, zooming to the Seme field
              site -- both panels already live in the one seme-locator.svg) beside the road
              photograph at emotional-focal scale. No card around either -- the map's own
              background already matches the page (`fill="#fbfbfa"`), so dropping the shared
              diagram card here (post-harvest.css) lets it sit directly on the canvas. */}
          <div className="ph-v2-location">
            <Reveal>
              <InlineSvg name="seme-locator" className="ph-v2-map" caption={context.captions.locator} />
            </Reveal>
            <Reveal className="ph-v2-location-road">
              <figure className="ph-v2-road">
                <Image
                  src="/post-harvest/photo/road-to-seme-2000.webp"
                  alt="A red earth road curving through dense green vegetation near Seme, with a person pushing a bicycle loaded with jerrycans"
                  width={2000} height={1333} sizes="(max-width: 899px) 92vw, min(1104px, 70vw)"
                />
                <figcaption className="ph-cap">{context.captions.road}</figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Evidence rail: the two research numbers as one horizontal strip, ranked (the
              loss figure leads, the population figure supports), not two stacked dashboard
              tiles. See the note on `context.stats` in content.ts for why they're ranked. */}
          <Reveal>
            <div className="ph-v2-evidence">
              {context.stats.map((s) => (
                <div
                  className={`ph-evidence-stat${s.lead ? " ph-evidence-stat-lead" : ""}`}
                  key={s.value}
                >
                  <b>{s.value}</b>
                  <span>{s.label}. {s.cite}.</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Documentary pair, closing the location story: the grain photo leads (evidence
              of the harvest itself), the planting photo supports. Roughly 7/5.

              SWAPPED (Sylvia, 2026-09-07, second pass). The grain slot originally held a
              photo of crop drying on a roof ridge, captioned to show the existing drying
              method directly. That file turned out to be a low-resolution camera-preview
              export (see the recovery note in git history for
              `field-roof-drying-1600.webp`), so Sylvia replaced it with this sharp photo
              instead -- a bowl of harvested grain held up during an interview, phone and pen
              visible. It is evidence of the harvest, not of the drying method specifically;
              the caption was rewritten to match (`context.captions.grain`, was `roof`). */}
          <Reveal>
            <div className="ph-v2-documentary">
              <figure>
                <Image
                  src="/post-harvest/photo/field-grain-bowl-1600.webp"
                  alt="A farmer holding out a metal bowl of harvested grain during an interview, with a phone and pen visible in another person's hands beside it"
                  width={1600} height={1069} sizes="(max-width: 899px) 92vw, 56vw"
                />
                <figcaption className="ph-cap">{context.captions.grain}</figcaption>
              </figure>
              <figure>
                <Image
                  src="/post-harvest/photo/field-planting-1600.webp"
                  alt="A farmer bending to plant by hand in freshly tilled soil, with young maize seedlings in rows"
                  width={1600} height={1067} sizes="(max-width: 899px) 92vw, 38vw"
                />
                <figcaption className="ph-cap">{context.captions.planting}</figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 03 Learning in the field ============
          RESTRUCTURED (Sylvia, 2026-09-07, visual-hierarchy audit). This section had six
          blocks at roughly equal weight — walk-in photograph, seated interview, timeline,
          five portraits, quote, field note — and the largest of them was the walk-in
          photograph, which carries the least information in the set. It is a picture of
          people walking; it does not show a method or a finding.

          Now two beats with one dominant each:
            A / WHO ..... the five farmers, at full width. They ARE the research, and
                          Theresa's quote sits directly under them because it is one of
                          these five speaking, not a floating pull-quote in a side column.
            B / HOW ..... the two field photographs at supporting scale, then the timeline
                          and the field note. The walk-in photograph is kept, but as
                          evidence of the visit rather than as the section's poster.

          The walk-in photograph was a candidate for deletion in the audit. It is demoted
          rather than cut, because that is Sylvia's call to make, not a layout decision. */}
      <section className="ph-section ph-v2" id="field">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="ph-chapter-label">{chapterLabel("field")}</p>
              <h2>{field.heading}</h2>
              <p className="lede">{field.lead}</p>
            </div>
          </Reveal>

          {/* --- beat A / who ------------------------------------------------- */}
          <Reveal>
            <div className="ph-03-people">
              <div className="ph-beat-head">
                <h3>{field.beats.people}</h3>
              </div>

              <ul className="ph-strip ph-strip-5 ph-people-strip ph-people-lead">
                {["Christine", "Theresa", "Jakob", "Philister", "Magarite"].map((n) => {
                  const p = byName(n);
                  return (
                    <li key={p.slug}>
                      <div className="ph-strip-frame">
                        <Image
                          src={`/post-harvest/portrait/portrait-${p.slug}-400.webp`}
                          alt={`${p.name}, a farmer who took part in the study. Portrait traced and blurred, as in the original project.`}
                          width={400} height={500} sizes="(max-width: 767px) 44vw, 18vw"
                        />
                      </div>
                      <h4>{p.name}</h4>
                      <p>{p.note}</p>
                    </li>
                  );
                })}
              </ul>

              <figure className="ph-quote ph-03-quote">
                <blockquote>{field.quote.text}</blockquote>
                <figcaption>
                  <span className="who">{field.quote.attribution}</span>
                  <span className="ph-cap">Interview, Seme, 2024</span>
                </figcaption>
              </figure>
            </div>
          </Reveal>

          {/* --- beat B / how -------------------------------------------------- */}
          <Reveal>
            <div className="ph-beat">
              <div className="ph-beat-head">
                <h3>{field.beats.method}</h3>
              </div>

              <div className="ph-03-method-figs">
                <figure>
                  <Image
                    src="/post-harvest/photo/field-walking-2400.webp"
                    alt="Three team members and a guide walking across a grass clearing towards a homestead with a corrugated roof, seen from behind"
                    width={2400} height={1600} sizes="(max-width: 899px) 92vw, 42vw"
                  />
                  <figcaption className="ph-cap">{field.captions.walking}</figcaption>
                </figure>
                <figure>
                  <Image
                    src="/post-harvest/photo/field-team-1600.webp"
                    alt="Three team members seated on plastic chairs under a tree, talking with farmers during an interview"
                    width={1600} height={1067} sizes="(max-width: 899px) 92vw, 42vw"
                  />
                  <figcaption className="ph-cap">{field.captions.team}</figcaption>
                </figure>
              </div>

              <div className="ph-03-method-foot">
                <div className="ph-03-run">
                  {field.run.map((beat) => (
                    <div key={beat.label}>
                      <p className="ph-lbl">{beat.label}</p>
                      <p className="ph-body">{beat.text}</p>
                    </div>
                  ))}
                </div>
                <div className="ph-fieldnote">
                  <p className="ph-lbl">My role</p>
                  <p>{field.role}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </div>
      {/* ==== / Phase 01 Discover ==== */}

      {/* ============ Phase 02 / Reframe (04 Finding the Focus, 05 Challenge) ============
          Section 04's own DOM/CSS is completely untouched by this wrapper -- see the
          "SECTION 04 SAFETY" note in the CSS block this refers to. `.ph-phase` is a bare
          `display: grid` container (no overflow/transform/filter/contain), so section
          04's sticky header and sticky visual stage still resolve their containing
          blocks to their own existing parents exactly as before. */}
      <div className="ph-phase ph-phase-reframe">
        <PhaseRail {...phases[1]} />

      {/* ============ 04 Finding the focus ============
          Three editorial scenes, text+visual together, entirely CSS (no JS coordination
          left for POSITIONING -- see the CSS block this refers to in post-harvest.css for
          the full history of what predates this). `HeadHeightVar` is the one small JS
          boundary that remains: it only measures, it positions nothing itself.

          LAYERING, in two corrections this session (Sylvia, live): first the header and
          the scroll scenes shared ONE sticky mechanism -- the header pinned at `top: 0`
          for the whole section, and each scene's own sticky `top` was calculated
          (`calc(var(--ph-04-head-h) + ...)`, PLUS a `translateY(-50%)` for centring) to
          sit in the space below wherever the header currently was. That coupling was the
          actual bug, and specifically the `translateY(-50%)` was: `transform` is a
          paint-time shift applied AFTER the browser clamps a sticky box to its containing
          block, so it is not itself clamped -- a scene could still slide up past its own
          zone's top, exactly where the header sits, right as that zone's sticky window
          engaged ("穿模"). First fix: made the header plain block flow (not sticky at
          all), so it and a scene could never share screen space by construction. Sylvia
          then asked for the header back as a persistent, always-visible band while
          reading through the section ("Finding the focus... 这个要一直在") -- so it is
          sticky again below, `--ph-04-head-h` (`head-height.tsx`) is back, and
          `.ph-04-scene`'s `top` again sits below it, but WITHOUT the transform that
          caused the original bug: a plain `top: calc(var(--ph-04-head-h) + ...)` with no
          accompanying `translateY` cannot escape the sticky clamp, so it structurally
          cannot render above the header regardless of viewport height -- see
          post-harvest.css for the actual values. */}
      <section className="ph-section ph-v2" id="focus">
        {/* `.ph-04-canvas`, not the shared `.ph-canvas` every other section uses -- see its
            definition in post-harvest.css for why (large empty side margins at wide
            desktop widths, Sylvia). Section-04-scoped on purpose; do not swap other
            sections onto it. */}
        <div className="ph-04-canvas">
          {/* `.ph-04-stage` (2026-09-08, compact-composition pass) bounds the head+lede+
              scroll composition to a deliberate max-width and centers it inside the wider,
              fluid `.ph-04-canvas` above -- see post-harvest.css for the exact number and
              why. A plain block wrapper: no position/transform/filter/contain, so it
              changes neither `.ph-04-head`'s sticky containing block (still `.ph-04-canvas`,
              via this section) nor `head-height.tsx`'s measurement of `.ph-04-head` itself. */}
          <div className="ph-04-stage">
            {/* `.ph-04-head` is the sticky header wrapper -- scoped to this section only
                (see post-harvest.css). It shares `.ph-04-stage`'s horizontal container
                with the scroll stage below so its content stays aligned to the same left
                edge whether it is in normal flow (mobile / no-JS) or stuck (desktop). The
                lede lives INSIDE it (2026-09-09, Sylvia: it should read as the section's
                thesis/framing statement, sitting with the heading, not float as its own
                paragraph between the header and the scroll content) -- same shared `.lede`
                class every other section's head uses (`.ph-v2-head .lede` in
                post-harvest.css), not a bespoke style. It pins through all three scenes
                along with the eyebrow + h2, which is the point Sylvia asked for directly:
                one persistent framing statement, always visible while reading through the
                section, not something that scrolls away after the first scene. */}
            <HeadHeightVar className="ph-04-head">
              <Reveal>
                <div className="ph-v2-head">
                  <p className="ph-chapter-label">{chapterLabel("focus")}</p>
                  <h2>{focus.heading}</h2>
                  <p className="lede">{focus.lead}</p>
                </div>
              </Reveal>
            </HeadHeightVar>

            {/* One fixed storytelling stage, three overlaid scenes (2026-09-09, third
                structural pass on this section, Sylvia directly: the per-zone sticky
                system below still read as "normal vertical document flow" -- each scene
                had its OWN 85vh slice of the page, so the previous scene's tail and the
                next scene's head could both still be on screen near a zone boundary, and
                the composition never held one stable centred position. Replaced with a
                single stage that never moves: `.ph-04-scroll` is now a plain, tall
                (`300vh` desktop) scroll-DISTANCE well with no visible content of its own;
                `.ph-04-sticky-stage` inside it is the thing that's actually sticky, sized
                to the exact space below the header; and all three `.ph-04-scene`s are
                CSS-grid-stacked directly on top of each other inside it (`grid-area: 1/1`
                on every scene -- the standard "layer children in one grid cell" overlay
                technique), so there is only ever one visual position for a scene to
                render in. A single named `view-timeline` on `.ph-04-scroll` drives which
                scene is opaque via `animation-range` per scene -- see post-harvest.css for
                the full mechanism and its fail-open mobile/no-motion/unsupported-browser
                fallback (plain stacked block flow, no stage, no overlay, everything just
                visible in reading order -- the same safety net every other progressive
                enhancement on this page already uses). */}
            <div className="ph-04-scroll">
              <div className="ph-04-sticky-stage">
                {/* Scene 1 -- the existing solution. Label, the bag's own sentence, then the
                    finding. The photo is a close-up of printed text (the "PICS / Purdue
                    Improved Crop Storage / 100kg" markings), so it is treated as a document:
                    a plate with `object-fit: contain`, not a cropped photo band. */}
                <div className="ph-04-scene">
                  <div className="ph-04-scene-text">
                    <p className="ph-lbl">{focus.bags.label}</p>
                    <p>{focus.bags.text}</p>
                    <p>{focus.body}</p>
                  </div>
                  <figure className="ph-04-scene-visual ph-04-scene-visual--photo">
                    <div className="ph-bags-plate">
                      <Image
                        src="/post-harvest/photo/pics-bag-1400.webp"
                        alt="Close up of a PICS bag in Seme, printed with Purdue Improved Crop Storage and a 100 kg capacity mark"
                        width={1400} height={936} sizes="(max-width: 1279px) 92vw, 48vw"
                      />
                    </div>
                  </figure>
                </div>

                {/* Scene 2 -- the latent need. Label sourced from the needs-map diagram's
                    own title rather than new copy -- see `focus.captions.needsLabel` in
                    content.ts. `.ph-latent` (the SVG's own central-bubble class) still gets
                    its one-time emphasis fade from the sitewide `.is-visible .ph-latent`
                    rule -- see post-harvest.css. */}
                <div className="ph-04-scene">
                  <div className="ph-04-scene-text">
                    <p className="ph-lbl">{focus.captions.needsLabel}</p>
                    <p>{focus.captions.needs}</p>
                  </div>
                  <InlineSvg name="needs-map" className="ph-04-scene-visual ph-04-scene-visual--needs" />
                </div>

                {/* Scene 3 -- the shift. Keeps the lifecycle's own caption ahead of the
                    redirect sentence, so both pieces of existing copy survive. */}
                <div className="ph-04-scene">
                  <div className="ph-04-scene-text">
                    <p className="ph-lbl">{focus.redirect.label}</p>
                    <p>{focus.captions.cycle}</p>
                    <p>{focus.redirect.text}</p>
                  </div>
                  <InlineSvg name="maize-lifecycle" className="ph-04-scene-visual ph-04-scene-visual--cycle" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 05 Defining the challenge ============  V2 PROTOTYPE
          Two beats, each one visual argument sized to a viewport.

          Beat one has exactly one dominant visual, the photograph. The three whole-scene
          drawings sit beside it as a single analytical rail at one small size, and the
          weevil is a smaller inset beneath that rail. The change of scale is carried by
          the composition and by the weevil's own caption; the old "SCALE BREAK" heading
          is gone, because it read as an internal design note rather than page copy.

          Beat two keeps the carrying explanation and the two carrying figures as one unit
          in the left column, with the requirement list beside them in the same viewport.
          The list uses the two-column drawing so all 18 rows stay legible at this width
          instead of being squeezed to about 11px. */}
      <section className="ph-section ph-v2" id="challenge">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="ph-chapter-label">{chapterLabel("challenge")}</p>
              <h2>{challenge.heading}</h2>
              <p className="lede">{challenge.lead}</p>
            </div>
          </Reveal>

          {/* --- beat one ------------------------------------------------------ */}
          <Reveal>
            <div className="ph-beat">
              <div className="ph-beat-head">
                <h3>{challenge.beats.threats}</h3>
                <p className="ph-lbl">{challenge.threatsLabel}</p>
              </div>

              <figure className="ph-dominant" style={{ marginTop: 0 }}>
                <Image
                  src="/post-harvest/photo/chicken-tarp-2400.webp"
                  alt="A chicken standing on maize spread out to dry on a dark tarp on grass, beside a homestead in Seme"
                  width={2400} height={1106} sizes="(max-width: 899px) 92vw, 88vw"
                />
                <figcaption className="ph-cap">{challenge.captions.chickenPhoto}</figcaption>
              </figure>

              {/* One consistent four-column grid (define-problem-reference pass,
                  2026-09-08): Weevils used to sit in a separately-styled, narrower inset
                  behind a divider (still visible in git history as `.ph-weevil-inset` /
                  `.ph-rail-box`, now unused and removed below). All four items now share
                  the exact same `.ph-strip-frame` markup, so the frame -- width, height,
                  aspect ratio, border, padding -- is identical across all four; only the
                  drawing inside Weevils' frame reads smaller, same as the scale
                  difference its caption already states in words. */}
              <ul className="ph-strip ph-strip-4">
                {challenge.threats.map((t) => (
                  <li key={t.slug}>
                    <div className="ph-strip-frame">
                      <Image
                        src={`/post-harvest/vignette/vignette-${t.slug}-600.webp`}
                        alt={
                          t.slug === "weevils"
                            ? "Line drawing of maize weevils on individual kernels, drawn close up"
                            : `Line drawing: ${t.note.toLowerCase()}, on a heap of maize spread on a tarp`
                        }
                        width={t.w} height={t.h} sizes="(max-width: 767px) 44vw, 200px"
                      />
                    </div>
                    <h4>{t.name}</h4>
                    <p>{t.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* --- beat two ------------------------------------------------------ */}
          <Reveal>
            <div className="ph-beat">
              <div className="ph-beat-head">
                <h3>{challenge.beats.needs}</h3>
              </div>

              {/* Four design priorities, same order and same four-column width as the
                  problem row above -- that shared alignment IS the Chickens -> Keep
                  animals out connection, not an arrow or a restated label. */}
              <ul className="ph-priorities">
                {challenge.priorities.map((p) => (
                  <li key={p.heading}>
                    <p className="ph-lbl">{challenge.priorityLabel}</p>
                    <p className="ph-priority-heading">{p.heading}</p>
                  </li>
                ))}
              </ul>

              <div className="ph-context-split">
                <div className="ph-context-left">
                  <p className="ph-lbl">{challenge.context.label}</p>
                  <p className="ph-body">{challenge.context.text}</p>

                  <div className="ph-carry-figs">
                    <Image src="/post-harvest/figure/figure-carrying-750.webp" alt="Traced illustration of a person carrying baskets of produce, one balanced on the head" width={750} height={1487} sizes="220px" />
                    <Image src="/post-harvest/figure/figure-wheelbarrow-348.webp" alt="Traced illustration of a person pushing a loaded wheelbarrow" width={348} height={510} sizes="220px" />
                  </div>
                  <p className="ph-cap">{challenge.captions.figures}</p>
                </div>

                <div className="ph-context-right">
                  <p className="ph-lbl">{challenge.requirementFramework.label}</p>

                  <RequirementLightbox
                    dialogLabel="Requirement list, full view"
                    triggerLabel="Requirement list preview"
                    viewLabel={challenge.requirementFramework.viewLabel}
                    caption={challenge.captions.checklist}
                    preview={<InlineSvg name="req-checklist-blank-wide" className="ph-req-preview-svg" />}
                    full={<InlineSvg name="req-checklist-blank-wide" className="ph-req-full-svg" />}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </div>
      {/* ==== / Phase 02 Reframe ==== */}

      {/* ============ Phase 03 / Develop (06 Concept Development) ============ */}
      <div className="ph-phase ph-phase-develop">
        <PhaseRail {...phases[2]} />

      {/* ============ 06 Developing with farmers ============
          Rebuilt (2026-09-09) against a reference layout Sylvia supplied directly -- see
          the comment above `concepts` in content.ts. Three beats, top to bottom:

            1. ph-06-top       small wide fieldwork photo (a cropped re-frame of the same
                               portrait asset the old layout ran full-height -- see the
                               object-position note on `.ph-06-photo img` in the CSS) beside
                               the first-evaluation / potential-bias / method-adjustment
                               sequence, read as one connected argument, not three cards.
            2. ConceptCarousel the three concepts, one centred and dominant at a time. A
                               client component (concept-carousel.tsx), same structural
                               pattern as HALOGRIP's own `app/work/halogrip/
                               concept-carousel.tsx`: each concept just gets its name below
                               it, and cycling to the last one (the Drying Tower, `selected:
                               true`) fades the other two out entirely and swaps in the
                               selected-direction line -- not a permanent fixture under the
                               carousel, a state the carousel itself reaches.

          Superseded: the two-column lead (tall photo + rounds list + annotation-code
          legend + three-equal-card strip), then a compact response-line + always-visible
          selected-direction block under the carousel (Sylvia: "太多没有用的内容了"). Both
          still in git history. */}
      <section className="ph-section ph-v2" id="concepts">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="ph-chapter-label">{chapterLabel("concepts")}</p>
              <h2>{concepts.heading}</h2>
              <p className="lede">{concepts.lead}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-06-top">
              <figure className="ph-06-photo">
                <Image
                  src="/post-harvest/photo/sketch-review-1600.webp"
                  alt="Two hands holding a hand-drawn sketch of the drying tower, one pointing at the shelves and its dimensions"
                  width={1600} height={2400} sizes="(max-width: 899px) 92vw, 30vw"
                />
                <figcaption className="ph-cap">{concepts.captions.review}</figcaption>
              </figure>

              <ol className="ph-06-process">
                {concepts.process.map((step) => (
                  <li key={step.label} data-emphasis={step.emphasis || undefined}>
                    <p className="ph-lbl">{step.label}</p>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal>
            <ConceptCarousel options={concepts.options} selectedEyebrow={concepts.selected.eyebrow} selectedNote={concepts.selected.note} />
          </Reveal>
        </div>
      </section>
      </div>
      {/* ==== / Phase 03 Develop ==== */}

      {/* ============ Phase 04 / Deliver (07 Final Concept, 08 Mechanism, 09 Status) ============
          MERGED into one wrapper (2026-09-08, Sylvia: reconsidered the earlier two-wrapper
          brief below). Used to be two physical wrappers for one semantic phase -- "the rail
          can be repeated in its dark-on-light version" -- each rendering its own `PhaseRail`
          call, so "04 / Deliver" appeared to release and re-pin a second time right in the
          middle of its own chapter. Now it's a single `.ph-phase` spanning all of 07-09 with
          one `PhaseRail` call: the rail stays pinned continuously through the whole phase and
          never recolours (see the CSS note on `.ph-fc` for where its old inverted colouring
          went instead).

          A full-bleed variant (rail collapsed to a static corner label, section spanning
          both grid columns) was tried here during a reference-fidelity pass and reverted
          the same day: keeping the persistent sidebar, consistent with every other
          section, mattered more than the closer width match to the generated reference
          (Sylvia, at the time: "为什么不是常驻侧边栏" -- since revisited, see above).
          Section 07 reads inside the normal sticky column again, same mechanism as every
          other phase. */}
      <div className="ph-phase ph-phase-deliver">
        <PhaseRail {...phases[3]} />

      {/* ============ 07 The Drying Tower / Final Concept ============
          REBUILT 2026-09-07 (fifth pass, real handbook assets). Sylvia supplied a clean
          background (blue tower band / one large blank ivory band / blue closing band,
          NO text and -- unlike the fourth pass's background -- no "selected pages" spreads
          baked in either), an isolated 3D handbook-cover mockup, and the two selected-page
          spreads themselves as separate high-resolution flat scans (4210x2977 each). All
          five now live in public/post-harvest/photo/finalconcept/ under clean names
          (fc-bg-clean-1122, fc-handbook-cover-1800, fc-spread-step-4210,
          fc-spread-materials-4210); the originals Sylvia dropped in are untouched
          alongside them. Flat scans, not the also-supplied perspective "mockup" spread
          renders: the mockup's tilt compresses the dimension callouts near each spread's
          edges, and the brief's own priority is "crispness and readability over dramatic
          styling."

          COORDINATES, same method as the fourth pass -- canvas pixel sampling on the new
          background, not eyeballed: blue1/ivory boundary y=28.2%, blank band 28.2-89.6%
          (860px at the 1122px source -- more than double the old background's 404px, since
          this one has no baked pages eating into it), tower bbox unchanged (x 58.1-82.0%,
          y 3.1-25.8%), blue2 starts y=89.6%.

          COPY. This pass matches Sylvia's brief text, which mirrors `finalconcept
          reference.png`'s OWN captions -- not all of it is the same as `finalConcept` in
          content.ts, which went through a separate evidence-review pass (added source
          citations to the specs, hedged the closing claim, cross-referenced section 04 in
          the rationale). Reused from content.ts where the two agree (heading, handbook
          heading, contents line, CTA label via HANDBOOK_TOTAL); hardcoded to match the
          reference where they diverge (lead paragraph, the right-column spec block and its
          missing citations, "SELECTED PAGES"' own supporting sentence, and all of the
          closing band). Flagged for Sylvia in this pass's own summary, not silently
          swapped into content.ts.

          CLICK BEHAVIOR UNCHANGED. `HandbookPhotoOpen` (handbook-reader.tsx) still calls
          the exact same `openHandbook(HANDBOOK_PLATE_PAGE.cover)` every other entrance on
          this page uses. Only its visual (now the real mockup asset) and hover are new. */}
      <section className="ph-fc" id="final-concept">
        <div className="ph-fc-visual">
          <Image
            src="/post-harvest/photo/finalconcept/fc-bg-clean-1122.png"
            alt="The Drying Tower rendered against a night sky over Seme, above one large ivory page"
            width={1122} height={1402}
            sizes="(max-width: 1488px) 100vw, 1488px"
            className="ph-fc-bg"
          />

          <Reveal tag="p" className="ph-chapter-label ph-fc-ov ph-fc-ov-eyebrow">
            {chapterLabel("final-concept")}
          </Reveal>

          <Reveal className="ph-fc-ov ph-fc-ov-intro">
            <h2 className="ph-fc-ov-heading">{finalConcept.heading}</h2>
            {/* Matches the reference's own lead exactly; content.ts's `finalConcept.lead`
                is a later, more hedged rewrite ("The project's final deliverable was..."),
                kept there untouched -- see the section-open comment. */}
            <p className="ph-fc-ov-lead">
              A low-cost, locally buildable grain drying tower designed for smallholder farmers
              in western Kenya, paired with a step-by-step construction handbook to enable
              others to build it.
            </p>
          </Reveal>

          {/* Right-column spec block, matching the reference exactly: a label, one
              descriptive paragraph, then the three stats via `referenceSpecs` (defined
              above) -- its own wording and no source citations, unlike `annotations`,
              which this section used in an earlier pass. See the section-open comment. */}
          <Reveal className="ph-fc-ov ph-fc-ov-specs">
            <p className="ph-lbl ph-fc-ov-specs-label">The drying tower</p>
            <p className="ph-fc-ov-specs-desc">
              A passive, side-fired grain drying tower for maize (corn), using locally
              available materials and simple construction methods.
            </p>
            <ul className="ph-annots ph-fc-ov-specs-annots">
              {referenceSpecs.map((a) => (
                <li className="ph-annot" key={a.k}>
                  <span className="v">{a.v}</span>
                  <span className="k">{a.k}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="ph-fc-ov ph-fc-ov-hb-text">
            <p className="ph-lbl ph-fc-ov-hb-label">The handbook</p>
            <h3 className="ph-fc-ov-hb-heading">{finalConcept.beats.handbook}</h3>
            <p className="ph-fc-ov-hb-rationale">{finalConcept.deliverable.rationale}</p>
          </Reveal>

          <Reveal tag="div" className="ph-fc-ov ph-fc-ov-handbook">
            <HandbookPhotoOpen
              photoSrc="/post-harvest/photo/finalconcept/fc-handbook-cover-1800.png"
              photoAlt="The construction handbook: a printed cover titled Drying Tower, first version, Experimental (Prototype)"
              photoWidth={1800} photoHeight={1800}
              ctaLabel={finalConcept.sequence.ctaLabel}
            />
          </Reveal>

          <Reveal className="ph-fc-ov ph-fc-ov-hb-meta">
            <HandbookOpen label={finalConcept.sequence.ctaLabel} />
            <p className="ph-fc-ov-hb-contents">{finalConcept.deliverable.contents.join(" · ").toUpperCase()}</p>
          </Reveal>

          {/* "Selected pages": content.ts's own `pagesSub` ("Two examples from inside the
              handbook") is replaced here with the reference's own longer sentence -- see
              the section-open comment; `pagesLabel` ("Selected pages") is unchanged and
              still sourced from content.ts. */}
          <Reveal className="ph-fc-ov ph-fc-ov-pages-head">
            <p className="ph-lbl">{finalConcept.sequence.pagesLabel}</p>
            <p className="ph-fc-ov-pages-sub">
              A look inside the 53-page handbook, including detailed diagrams, dimensions
              and a complete list of materials.
            </p>
          </Reveal>

          <div className="ph-fc-ov ph-fc-ov-spreads">
            <Reveal tag="figure" className="ph-fc-spread-wrap">
              <Image
                src="/post-harvest/photo/finalconcept/fc-spread-step-4210.png"
                alt="Handbook pages 46-47: Step 1, making three rectangle frames, and Sub-step 1.1, welding the four square tubes of each frame together, with a materials list and dimensioned parts"
                width={4210} height={2977} sizes="(max-width: 899px) 92vw, 44vw"
                className="ph-fc-spread-img"
              />
            </Reveal>
            <Reveal tag="figure" className="ph-fc-spread-wrap">
              <Image
                src="/post-harvest/photo/finalconcept/fc-spread-materials-4210.png"
                alt="Handbook pages 12-13: Cutlist of materials for the Drying Tower, dimensioned square tube, angle iron, flat iron, metal sheet, metal pipe and fasteners"
                width={4210} height={2977} sizes="(max-width: 899px) 92vw, 44vw"
                className="ph-fc-spread-img"
              />
            </Reveal>
          </div>

          {/* Closing band: matches the reference's own final-note copy, not
              `finalConcept.handbookQuote`/`.captions.tower` (a later, more hedged pair of
              statements) -- see the section-open comment. */}
          <Reveal className="ph-fc-ov ph-fc-ov-final">
            <p className="ph-lbl ph-fc-ov-final-label">Final note</p>
            <h2 className="ph-fc-ov-final-heading">The tower was never constructed.</h2>
            <p className="ph-fc-ov-final-body">
              This remains a first prototype on paper and in concept, and still needs
              real-world testing, iteration and builder feedback in western Kenya.
            </p>
          </Reveal>
          <Reveal tag="p" className="ph-fc-ov ph-fc-ov-final-note">
            Same knowledge.<br />Bigger possibilities.
          </Reveal>
        </div>
      </section>
      {/* ==== 07 Final Concept ends; 08-09 continue below inside the same merged
          `.ph-phase-deliver` wrapper -- no second `PhaseRail` call, no new `.ph-phase`. ==== */}

      {/* ============ 08 How it was intended to work ============
          DOMINANT: the two-state drawing, read as one unit. The difference between the
          frames is the argument, so they are a pair rather than two plates. The ghosted
          handling frames are small evidence beneath. */}
      <section className="ph-section ph-v2 ph-v2-blue" id="mechanism">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="ph-chapter-label">{chapterLabel("mechanism")}</p>
              <h2>{mechanism.heading}</h2>
              <p className="lede">{mechanism.lead}</p>
            </div>
          </Reveal>

          <Reveal>
            {/* The two frame badges name which of the four numbered steps below each
                diagram actually appears in it (Sylvia, 2026-09-07): "1" alone under
                Capturing heat, "2-4" under Creating airflow, since that single drawing
                covers Rise, Dry AND Exit together. They used to read plain "1" / "2",
                which sat directly above a list that continued on to "3" and "4" and read
                as a parallel one-to-one numbering that was never actually true. */}
            <div className="ph-mech-pair">
              <figure>
                <Image src="/post-harvest/diagram/mechanism-sun-1200.webp"
                  alt="Diagram showing the angled black box collector capturing sun rays to heat the air inside it"
                  width={1200} height={846} sizes="(max-width: 799px) 92vw, 42vw" />
                <figcaption><span className="ph-frame-n">1</span>{mechanism.frameCaptions.sun}</figcaption>
              </figure>
              <figure>
                <Image src="/post-harvest/diagram/mechanism-airflow-1200.webp"
                  alt="Diagram showing warmed air rising from the collector through the tower shelves and out of the chimney"
                  width={1200} height={846} sizes="(max-width: 799px) 92vw, 42vw" />
                <figcaption><span className="ph-frame-n">2–4</span>{mechanism.frameCaptions.airflow}</figcaption>
              </figure>
            </div>
          </Reveal>

          {/* Staggered because the mechanism is a sequence: heated air collects, rises,
              dries, exits. A static diagram cannot carry that order. The stagger is pure
              CSS -- animation-delay: calc(var(--i) * 120ms) -- so no JS runs per step. */}
          <Reveal tag="ol" className="ph-steplabels">
            {mechanism.steps.map((s, i) => (
              <li key={s.name} style={{ "--i": i } as React.CSSProperties}>
                  <span className="n">{s.n}</span>
                  <b>{s.name}</b>
                  <span className="t">{s.text}</span>
                </li>
            ))}
          </Reveal>

          <Reveal>
            <div className="ph-08-foot">
              <div>
                <p className="ph-lbl">{mechanism.handlingNote}</p>
                <ul className="ph-strip ph-strip-2">
                  {mechanism.handling.map((h, i) => (
                    <li key={h.name}>
                      <div className="ph-strip-frame ph-ghost-frame">
                        <Image
                          src={`/post-harvest/diagram/${i === 0 ? "handling-loading" : "handling-release"}-700.webp`}
                          alt={i === 0
                            ? "Line drawing: the drying tower in pale ghost line with one pulled-out shelf inked solid"
                            : "Line drawing: the drying tower in pale ghost line with the release chute at its base inked solid"}
                          width={700} height={i === 0 ? 863 : 941} sizes="(max-width: 767px) 44vw, 200px"
                        />
                      </div>
                      <h4>{h.name}</h4>
                      <p>{h.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <figure className="ph-quote ph-mech-quote">
                <blockquote>{mechanism.quote.text}</blockquote>
                <figcaption><span className="who">{mechanism.quote.attribution}</span></figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 09 What we completed, and what remained open ============
          DOMINANT: the team's own marked requirement list. The completed band above it is
          typographic, not pictorial, and the handbook page inside it is small. An
          unmarked box records only that the item was not assessed. */}
      <section className="ph-section ph-v2 ph-section-sunk" id="status">
        {/* `.ph-shell` on all three wrappers below (heading, dark "completed" band, and
            the checklist/why/forward group) -- HALOGRIP's own wide-container pattern
            (`halogrip.css`'s `.shell`), mirrored at HALOGRIP's own numbers; see `--shell`'s
            definition in post-harvest.css for the full history (was `.ph-canvas`, then a
            bespoke `.ph-09-canvas` formula that plateaued too early on very wide screens,
            Sylvia). Section-09-scoped on purpose; do not carry it onto other sections. */}
        <div className="ph-shell">
          <Reveal>
            <div className="ph-v2-head">
              <p className="ph-chapter-label">{chapterLabel("status")}</p>
              <h2>{status.heading}</h2>
            </div>
          </Reveal>
        </div>

        <div className="ph-v2-ink">
          <div className="ph-shell">
            <Reveal>
              <div className="ph-done-v2">
                <div>
                  <p className="ph-done-label">{status.completed.label}</p>
                  <p className="ph-done-claim">{status.claimSolid}</p>
                  <ul className="ph-done-items">
                    {status.completed.items.map((it) => (
                      <li key={it.name}>
                        <h3>{it.name}</h3>
                        <p>{it.note}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <figure className="ph-done-figs">
                  {/* The collector is the one part of the design that physically exists,
                      so it is the evidence this band is built on. Two photos now
                      (2026-09-09): the built object itself, then a close-up proving it
                      actually worked -- see `status.collectorPhoto` in content.ts. */}
                  <figure>
                    <Image
                      src="/post-harvest/photo/collector-built-1400.webp"
                      alt="The metal solar collector the team built, a long corrugated panel resting on a log outdoors in Seme"
                      width={1400} height={936} sizes="(max-width: 899px) 88vw, 30vw"
                    />
                    <figcaption className="ph-cap">{status.collectorPhoto.built}</figcaption>
                  </figure>
                  <figure>
                    <Image
                      src="/post-harvest/photo/collector-detail-1200.webp"
                      alt="Close-up of the solar collector's black outlet pipe with a strip of tape taped across it, fluttering to show hot air moving through"
                      width={1200} height={802} sizes="(max-width: 899px) 88vw, 30vw"
                    />
                    <figcaption className="ph-cap">{status.collectorPhoto.detail}</figcaption>
                  </figure>
                </figure>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="ph-shell">
          <Reveal>
            <div className="ph-scored-v2">
              <p className="ph-open-claim">{status.claimOpen}</p>
              <InlineSvg
                name="req-checklist-scored-wide"
                className="ph-fig-primary"
                caption={status.checklist.caption}
              />
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-why">
              <div className="ph-why-say">
                <h3 className="ph-why-head">{status.whyOpen.heading}</h3>
                <p className="ph-body">{status.whyOpen.text}</p>
              </div>
              <div className="ph-why-limits">
                <p className="ph-body">{status.notValidated.text}</p>
                <p className="ph-body">{status.notValidated.season}</p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-forward">
              <p className="ph-lbl">{status.nextStep.label}</p>
              <p className="ph-forward-action">{status.nextStep.text}</p>
            </div>
          </Reveal>
        </div>
      </section>
      </div>
      {/* ==== / Phase 04 Deliver ==== */}

      {/* ============ Phase 05 / Reflect (10 Reflection) ============ */}
      <div className="ph-phase ph-phase-reflect">
        <PhaseRail {...phases[4]} />

      {/* ============ 10 Reflection ============
          REORDERED (Sylvia, 2026-09-07): the dusk photograph used to sit right under the
          heading, as the section's dominant visual, with the four learnings as text
          underneath it. But this section is prose-led by decision (there are no
          explanatory icons or diagrams for a set of judgements about a collaboration),
          so leading with a mood photograph before any of that prose put the section's
          real content second.

          FOURTH PASS, same date: not just the takeaway but the whole closing passage --
          the four insights, the takeaway and the caption -- now sits over the photograph
          as one field, in white.

          FIFTH PASS, same date: the heading and lead moved INTO the photo field too. They
          briefly stayed on the plain page on the reasoning that they introduce the section
          rather than belong to what the photograph closes -- reads fine as a rule, but
          Sylvia's call was that the whole section should be one continuous closing scene
          starting at the heading, not "plain intro, then a photo begins." The utility
          footer (credit line, back link) still comes after, on the plain page: that one
          stays a utility line, not part of the reflection itself. */}
      <section className="ph-section ph-v2" id="reflection">
        {/* The heading, the four insights, the takeaway and the closing photo as one field:
            all of it reads as the section's content, set in white over the dusk photograph.
            Bleeds to the viewport edge the same way `.ph-done` does in section 09 (this
            `<div>` is a direct child of the `<section>`, not wrapped in `.ph-canvas`, so it
            is not width-constrained the way the footer below it is), so it reads as a
            deliberate field rather than a boxed inset.

            `.ph-shell`, not `.ph-canvas`, as of 2026-09-07 -- matching section 09's own
            switch (see that section's comment / the `--shell` token in post-harvest.css).
            Before this, 09 and 10 sat on two different widths (1700px vs 1600px, x=422 vs
            x=472 at a 2560px viewport -- measured, a real 50px misalignment between
            adjacent sections), which is what Sylvia meant by "cross-project consistency
            has not yet been completed": HALOGRIP-mirroring only 09 left 10 the odd one out
            again. */}
        <div className="ph-10-photo">
          <div className="ph-10-photo-media">
            <Image
              src="/post-harvest/photo/homestead-dusk-1600.webp"
              alt="Cattle grazing at dusk beside a homestead in Seme, Kenya"
              fill sizes="100vw"
            />
          </div>
          <div className="ph-10-photo-scrim" />

          <div className="ph-shell ph-10-photo-content">
            <Reveal>
              <div className="ph-v2-head">
                <p className="ph-chapter-label">{chapterLabel("reflection")}</p>
                <h2>{reflection.heading}</h2>
                <p className="lede">{reflection.lead}</p>
              </div>
            </Reveal>

            <Reveal>
              <ol className="ph-insights">
                {reflection.insights.map((ins, i) => (
                  <li className="ph-insight" key={ins.what}>
                    <span className="ph-insight-n">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{ins.what}</h3>
                    <p className="ph-body">{ins.detail}</p>
                    <p className="next">{ins.next}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal>
              <p className="ph-takeaway">{reflection.takeaway}</p>
              <p className="ph-cap">{reflection.closingCaption}</p>
            </Reveal>
          </div>
        </div>

        {/* `.ph-shell`, matching `.ph-10-photo-content` above (both switched from
            `.ph-canvas` together, 2026-09-07) -- this utility line still needs to line up
            with the reflection content directly above it, same as it always did, just at
            the new width. */}
        <div className="ph-shell">
          <Reveal>
            <div className="ph-foot">
              <span className="ph-cap">{project.title}, Reality Studio, Chalmers, 2024</span>
              <Link href="/" className="ph-cap" style={{ textDecoration: "underline" }}>Back to all work</Link>
            </div>
          </Reveal>
        </div>
      </section>
      </div>
      {/* ==== / Phase 05 Reflect ==== */}

      {/* The handbook reader, mounted once for the whole page.

          IT MUST LIVE HERE, NOT INSIDE SECTION 07. It is `position: fixed`, so it escapes
          07's layout — but not 07's cascade. Mounted inside `#final-concept` it inherited
          the section's own image rules (`.ph-dominant img`'s `max-height: 54vh` among
          them) and the sheet was capped at 511px inside a 663px stage. As a direct child of
          `.ph-root` it still gets the route's font variables and colour tokens, and nothing
          section-scoped can reach it. Every plate in 07 opens it through the module bus in
          handbook-reader.tsx, so its position in the tree does not matter to them. */}
      <HandbookReader />
    </main>
  );
}
