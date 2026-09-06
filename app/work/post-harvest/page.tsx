import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono, Bodoni_Moda } from "next/font/google";
import "./post-harvest.css";
import Reveal from "./reveal";
import InlineSvg from "./inline-svg";
import {
  project, meta, context, field, participants, focus, challenge,
  concepts, finalConcept, mechanism, status, reflection, chapterLabel,
} from "./content";
import HandbookReader, { HandbookCoverOpen } from "./handbook-reader";

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
    images: [{ url: "/post-harvest/photo/maize-weevils-1600.webp", width: 1600, height: 1067, alt: "Maize held in a farmer's hands in Seme, Kenya" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/post-harvest/photo/maize-weevils-1600.webp"] },
};

/** Real measured and calculated values only. `src` records the source page. */
const annotations = [
  { v: "10", k: "Shelves", src: "Measured, p.36" },
  { v: "81 x 70 x 2.5 cm", k: "Shelf size", src: "Measured, p.36" },
  { v: "approx. 100 kg", k: "Estimated design capacity", src: "Calculated, p.36" },
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
                src="/post-harvest/photo/maize-weevils-1600.webp"
                alt="A farmer's hands holding a dried maize cob, Seme, Kenya"
                fill priority sizes="(max-width: 767px) 100vw, 1480px"
              />
            </div>
            <figcaption className="ph-hero-caption">
              <span>Stored maize in Seme</span>
              <span>Sylvia Xie</span>
            </figcaption>
          </figure>

          {/* Closes the chapter and hands off to 02, which opens with its own label. */}
          <div className="ph-hero-rule" />
        </div>
      </header>

      {/* ============ 02 Context ============  V2 PROTOTYPE
          One composition first: heading, dateline, lead and both statistics read against
          the locator in a single viewport. The map is capped at 340px because it orients
          the reader; it is not the subject of the section. Then one compact evidence
          mosaic on a single image height, so three photographs read as one strip of
          evidence rather than three separate posters. */}
      <section className="ph-section ph-v2" id="context">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-ctx">
              <div>
                <div className="ph-v2-head">
                  <p className="ph-chapter-label">{chapterLabel("context")}</p>
                  <h2>{context.heading}</h2>
                  <div className="lede">
                    <p className="ph-lbl">{context.dateline}</p>
                    <p>{context.lead}</p>
                  </div>
                </div>

                {/* One lead statistic, one supporting. See the note on `context.stats`. */}
                <div className="ph-v2-stats">
                  {context.stats.map((s) => (
                    <div
                      className={`ph-v2-stat${s.lead ? " ph-v2-stat-lead" : ""}`}
                      key={s.value}
                    >
                      <b>{s.value}</b>
                      <span>{s.label}. {s.cite}.</span>
                    </div>
                  ))}
                </div>
              </div>

              <InlineSvg name="seme-locator" className="ph-v2-map" caption={context.captions.locator} />
            </div>
          </Reveal>

          <Reveal>
            {/* The lead photo leads, not the road (Sylvia, 2026-09-07, audit). Of these
                three, this one and the planting photo are evidence of the harvest itself;
                the road is atmosphere. The largest cell used to hold the road, so the
                mosaic's biggest picture was its least relevant one. Both are kept, at
                supporting size -- cutting them is Sylvia's call, not a layout decision.

                SWAPPED (Sylvia, 2026-09-07, second pass). This slot originally held a photo
                of crop drying on a roof ridge, captioned to show the existing drying method
                directly. That file turned out to be a low-resolution camera-preview export
                (see the recovery note in git history for `field-roof-drying-1600.webp`), so
                Sylvia replaced it with this sharp photo instead -- a bowl of harvested grain
                held up during an interview, phone and pen visible. It is evidence of the
                harvest, not of the drying method specifically; the caption was rewritten to
                match (`context.captions.grain`, was `roof`). */}
            <div className="ph-v2-mosaic">
              <figure className="ph-mosaic-lead">
                <Image
                  src="/post-harvest/photo/field-grain-bowl-1600.webp"
                  alt="A farmer holding out a metal bowl of harvested grain during an interview, with a phone and pen visible in another person's hands beside it"
                  width={1600} height={1069} sizes="(max-width: 899px) 92vw, 46vw"
                />
                <figcaption className="ph-cap">{context.captions.grain}</figcaption>
              </figure>
              <figure>
                <Image
                  src="/post-harvest/photo/road-to-seme-2000.webp"
                  alt="A red earth road curving through dense green vegetation near Seme, with a person pushing a bicycle loaded with jerrycans"
                  width={2000} height={1333} sizes="(max-width: 899px) 92vw, 26vw"
                />
                <figcaption className="ph-cap">{context.captions.road}</figcaption>
              </figure>
              <figure>
                <Image
                  src="/post-harvest/photo/field-planting-1600.webp"
                  alt="A farmer bending to plant by hand in freshly tilled soil, with young maize seedlings in rows"
                  width={1600} height={1067} sizes="(max-width: 899px) 92vw, 26vw"
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
                <InlineSvg name="field-timeline" caption={field.captions.timeline} />
                <div className="ph-fieldnote">
                  <p>{field.documentation}</p>
                  {/* TODO(sylvia): open question B, confirm this attribution before publishing. */}
                  <p><strong>{field.contribution}</strong></p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 04 Finding the focus ============
          DOMINANT: the needs map, because the finding lives in it. The lifecycle is the
          supporting diagram and is held well below it. */}
      <section className="ph-section ph-v2" id="focus">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="ph-chapter-label">{chapterLabel("focus")}</p>
              <h2>{focus.heading}</h2>
              <p className="lede">{focus.lead}</p>
            </div>
          </Reveal>

          {/* Three beats on one axis, not four bands (2026-09-07, Sylvia: "信息不是很集中").
              Beat one is the whole PICS-bag argument: what the bags are, and the two
              paragraphs on why the farmers had stopped trusting them -- those used to sit
              below the needs map, so the claim and its evidence were separated by the
              largest figure in the section. Beat two is the needs map alone, at full canvas
              width so nothing competes with the finding. Beat three is the maize year, the
              redirect the section is arguing for. Every beat spans the same column.

              The photo is a close-up of printed text (the "PICS / Purdue Improved Crop
              Storage / 100kg" markings), so it is treated as a document rather than a
              scene: a white plate with `object-fit: contain` at a legible size, not a
              cropped `object-fit: cover` photo band. Cover-cropped at a shrunk height it
              went unreadable (2026-09-07, third pass); contain at 46vh keeps the label in
              frame. */}
          <Reveal>
            <div className="ph-bags">
              <div className="ph-bags-copy">
                <p className="ph-lbl">{focus.bags.label}</p>
                <p>{focus.bags.text}</p>
                {focus.body.map((t) => (
                  <p key={t.slice(0, 20)}>{t}</p>
                ))}
              </div>
              <figure>
                <div className="ph-bags-plate">
                  <Image
                    src="/post-harvest/photo/pics-bag-1400.webp"
                    alt="Close up of a PICS bag in Seme, printed with Purdue Improved Crop Storage and a 100 kg capacity mark"
                    width={1400} height={936} sizes="(max-width: 899px) 92vw, 46vw"
                  />
                </div>
                <figcaption className="ph-cap">{focus.bags.caption}</figcaption>
              </figure>
            </div>
          </Reveal>

          <Reveal>
            <InlineSvg name="needs-map" className="ph-fig-primary ph-04-finding" caption={focus.captions.needs} />
          </Reveal>

          <Reveal>
            <InlineSvg name="maize-lifecycle" className="ph-fig-support ph-04-cycle" caption={focus.captions.cycle} />
          </Reveal>
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

              <div className="ph-threat-foot">
                <ul className="ph-strip ph-strip-3">
                  {challenge.threats.map((t) => (
                    <li key={t.slug}>
                      <div className="ph-strip-frame">
                        <Image
                          src={`/post-harvest/vignette/vignette-${t.slug}-600.webp`}
                          alt={`Line drawing: ${t.note.toLowerCase()}, on a heap of maize spread on a tarp`}
                          width={t.w} height={t.h} sizes="(max-width: 767px) 30vw, 200px"
                        />
                      </div>
                      <h4>{t.name}</h4>
                      <p>{t.note}</p>
                    </li>
                  ))}
                </ul>

                <div className="ph-weevil-inset">
                  <div className="ph-rail-box">
                    <Image
                      src={`/post-harvest/vignette/vignette-${challenge.weevil.slug}-600.webp`}
                      alt="Line drawing of maize weevils on individual kernels, drawn close up"
                      width={challenge.weevil.w} height={challenge.weevil.h} sizes="132px"
                    />
                  </div>
                  <h4>{challenge.weevil.name}</h4>
                  <p>{challenge.weevil.note}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* --- beat two ------------------------------------------------------ */}
          <Reveal>
            <div className="ph-beat">
              <div className="ph-beat-head">
                <h3>{challenge.beats.needs}</h3>
              </div>

              <div className="ph-v2-needs">
                <div className="ph-carry-unit">
                  <p className="ph-body">{challenge.arithmetic}</p>
                  <figure>
                    <div className="ph-carry-figs">
                      <Image src="/post-harvest/figure/figure-carrying-750.webp" alt="Traced illustration of a person carrying baskets of produce, one balanced on the head" width={750} height={1487} sizes="120px" />
                      <Image src="/post-harvest/figure/figure-wheelbarrow-348.webp" alt="Traced illustration of a person pushing a loaded wheelbarrow" width={348} height={510} sizes="120px" />
                    </div>
                    <figcaption className="ph-cap" style={{ marginTop: 12 }}>{challenge.captions.figures}</figcaption>
                  </figure>
                </div>

                <InlineSvg
                  name="req-checklist-blank-wide"
                  className="ph-v2-checklist"
                  caption={challenge.captions.checklist}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 06 Developing with farmers ============
          DOMINANT: the farmer reading the sketch. The three concepts are one small
          comparison strip, and the tower is marked inside that strip.

          The enlarged repeat of the tower sketch is REMOVED. It showed the same drawing
          twice, the second time at four times the size, which gave the section two
          competing focal points and said nothing the marked frame does not.

          The photograph is PORTRAIT and stays portrait. It was previously shown as a
          purpose-made 3:2 crop (`sketch-review-wide`) so it could run the full canvas as
          a landscape band — that was a layout convenience, not a reading of the picture.
          The frame is vertical: the sheet, both hands and the standing farmer only fit
          top-to-bottom, and the wide crop amputated the top of the sheet and the person
          holding it. The section is now a two-column lead instead: the tall photograph on
          the left, and the rounds / evaluation / comparison stacked beside it, so the
          picture keeps its own proportion without leaving a column of dead space. */}
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
            <div className="ph-06-lead">
              <figure className="ph-dominant ph-dominant-tall">
                <Image
                  src="/post-harvest/photo/sketch-review-1600.webp"
                  alt="Two hands holding a hand-drawn sketch of the drying tower, one pointing at the shelves and its dimensions"
                  width={1600} height={2400} sizes="(max-width: 1099px) 92vw, 34vw"
                />
                <figcaption className="ph-cap">{concepts.captions.review}</figcaption>
              </figure>

              <div className="ph-06-col">
                <ol className="ph-rounds-v2">
                  {concepts.rounds.map((r) => (
                    <li key={r.n}><b>{r.n}</b><span>{r.text}</span></li>
                  ))}
                </ol>

                <div className="ph-eval-bar-v2">
                  <p className="ph-lbl">{concepts.evaluationLabel}</p>
                  <InlineSvg name="sketch-legend" className="ph-legend" />
                </div>
                {/* The three are read, then the choice resolves: the picked card's blue
                    frame and note arrive last, so the selection reads as a decision rather
                    than a conclusion handed over up front. */}
                <Reveal tag="ul" className="ph-strip ph-strip-3">
                  {concepts.options.map((o, i) => (
                    <li key={o.slug} data-picked={o.selected || undefined} style={{ "--i": i } as React.CSSProperties}>
                      <div className="ph-strip-frame">
                        <Image
                          src={`/post-harvest/concept/concept-${o.slug}-760.webp`}
                          alt={`Hand-drawn concept sketch: ${o.name}`}
                          width={760} height={620} sizes="(max-width: 1099px) 88vw, 22vw"
                        />
                      </div>
                      <h4>{o.name}</h4>
                      {o.selected ? <p className="ph-picked-note">{concepts.selectedNote}</p> : null}
                    </li>
                  ))}
                </Reveal>

                {/* The outcome sits at the foot of the column it concludes, and pins to
                    the photograph's bottom edge so the tall picture does not leave the
                    right-hand column trailing off into empty page. */}
                <p className="ph-conclusion">{concepts.conclusion}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 07 The Drying Tower ============
          REVERSED (Sylvia, 2026-09-07, visual-hierarchy audit): the handbook cover was
          the section's dominant visual, on the reasoning that the handbook is the actual
          delivered artifact and the tower itself was never built. In practice this meant
          the climax section of the case study never showed the reader what the design
          IS: a document cover, three stats and two page spreads, with no image of the
          tower's own mechanism anywhere before section 08. The mechanism pair (the same
          two diagrams section 08 uses to explain airflow) is now the dominant visual
          here, captioned so it cannot be mistaken for a photograph of a built object --
          `finalConcept.captions.tower` already carried "It was never constructed" and had
          been unused. The handbook cover drops to a supporting plate beside the
          deliverable text, where it still reads clearly as the completed artifact.

          DOMINANT: the tower mechanism pair. The handbook cover and the two handbook
          pages are supporting plates.

          FIXED: the cover used to be `width:100%` + `object-fit:contain` + `background:
          #fff` on a full-canvas box. The scan is 1.41:1 and the box was 3.3:1, so the
          white background bled the full width of the page and the drawing floated in the
          middle of a huge empty white band — that band was the "long image". The figure
          now sizes to the cover's own proportion inside its column, so there is no white
          outside the page itself.

          PREVIEWING IS NOT READING, AND READING IS OPTIONAL (Sylvia, 2026-09-06, revised
          twice on 2026-09-07). The section says three things in order, and each has exactly
          one job:
            1. the cover, small, beside the intro ...... the handbook as final deliverable
            2. two large interior spreads .............. representative pages, understood
                                                          without opening anything
            3. a text link inside the previews' own ..... optional access to all 53 pages
               header row, beside "Inside the handbook"
          Every spread used to carry its own pill, which gave the page four entrances and no
          main one. The spreads are plain, non-clickable images now — they ARE the primary
          reading path, not bait for the reader.

          THE ENTRANCE WENT THROUGH TWO SHAPES BEFORE THIS ONE. First a full-width "paper on
          blue" band — right when the problem was "four entrances, none primary," wrong once
          the reader was reclassified as an optional deep dive, because at canvas width with
          a 21-32px serif title it became the section's dominant element. Then a small
          bordered box under the previews — correctly sized, but it floated alone in a large
          empty stretch of canvas, reading as an unplanned third composition between the
          previews and the closing quote. It is now `.ph-07-inside-head`: one row, a label
          ("Inside the handbook") on the left and the plain text link on the right, with a
          rule beneath it that also serves as the top edge of the previews group. Nothing
          about it needs its own vertical space; it is part of the previews' own frame.

          The two previews are the interior, deliberately: one construction step and one cut
          list. The cover is not one of them, because it shows nothing about the contents.

          FIXED: the two handbook pages were capped at `max-height: 22vh` in a third-width
          column, i.e. about 424 x 178px. These are dimensioned instruction spreads; at
          that size none of their text is readable. They are a two-up row across the canvas
          now, capped at 58vh so a short window cannot let them run past the fold.

          INTRO REFINED, PREVIEWS UNTOUCHED (Sylvia, 2026-09-07, third pass — the previews
          group below stayed exactly as it was). Four changes above `.ph-07-inside`:
          the heading now names the handbook directly (content.ts); the eyebrow moved out of
          `.lede` to sit above the `num`/heading row instead of below it — a plain sibling
          `<p>`, not a change to the shared `.ph-v2-head` grid every other section still uses
          unmodified; the cover grew about 30% (300px -> 390px) and the aside column
          narrowed to make room for it, since the spec list's full-width divider lines were
          visually heavier than the cover they sat beside; and the vertical rhythm above the
          previews was compressed so they surface sooner on the scroll. */}
      <section className="ph-v2 ph-v2-blue" id="final-concept">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-07-head">
              <p className="ph-lbl ph-07-eyebrow">{finalConcept.label}</p>
              <div className="ph-v2-head">
                <p className="ph-chapter-label">{chapterLabel("final-concept")}</p>
                <h2>{finalConcept.heading}</h2>
                <div className="lede">
                  <p>{finalConcept.lead}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* --- beat A / the tower -------------------------------------------
              Deliberately UNLABELLED. A "The Drying Tower" divider here sat two lines under
              a heading that already opens "The Drying Tower, and a handbook to build it",
              so it repeated the heading's own first half and cost about 100px to do it.
              Only the turn to the second subject is marked, which is what the divider is
              for; the first subject is introduced by the section heading itself. */}
          <Reveal>
            {/* The tower image and the copy that explains it are one reading unit
                (Sylvia, 2026-09-07, second pass): the body paragraph ("a black box
                collector heats air...") and the three measured annotations describe THIS
                picture, so they sit beside it rather than one screen further down next to
                the handbook cover, where they used to read as unrelated to the image
                above them.

                A single, unannotated isometric of the whole tower, not the mechanism
                pair: section 08 owns mechanism-sun/mechanism-airflow (the sun-ray and
                airflow annotations) exclusively, to explain how it works; this section
                only needs to show what it is, so it uses the plain tower-door render. */}
            <div className="ph-07-lead">
              <figure className="ph-07-ident ph-07-tower">
                <Image src="/post-harvest/diagram/tower-door-1200.webp"
                  alt="Isometric line drawing of the complete Drying Tower: the shelved cabinet with its door open, the chimney above and the solar collector attached at its base"
                  width={1200} height={846} sizes="(max-width: 999px) 92vw, 55vw" />
                <figcaption className="ph-cap">{finalConcept.captions.tower}</figcaption>
              </figure>

              <div className="ph-07-aside">
                {finalConcept.body.map((t) => (
                  <p className="ph-body" key={t.slice(0, 20)}>{t}</p>
                ))}
                <ul className="ph-annots" style={{ marginTop: 10 }}>
                  {annotations.map((a) => (
                    <li className="ph-annot" key={a.k}>
                      <span className="v">{a.v}</span>
                      <span className="k">{a.k}</span>
                      <span className="src">{a.src}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* --- beat B / the handbook ----------------------------------------
              REBUILT A SECOND TIME to a new layout reference (2026-09-07). The first pass
              (cover beside an explanation column, "01 /" and "02 /" numbering, a text-link
              entrance in the pages header) is fully replaced. The handbook is now presented
              as one complete, clickable deliverable, centred, before the two selected pages:
              title -> centred intro -> centred cover (the entrance itself) -> its own CTA
              caption -> the contents line -> "Selected pages" -> the two spreads.

              Deliberately NOT here, per this pass's brief: no numbering, no cards, no
              rounded corners, no gradients, no icons, no strong shadows, no connecting
              arrows. The only device is two faint offset page edges behind the cover (pure
              opacity, no shadow), so it reads as a bound document rather than one sheet.

              THERE IS NO PDF. The brief asked for a click to "open the existing full
              handbook PDF in a new tab" — no PDF exists anywhere in this project; see the
              long note on `HandbookCoverOpen` in handbook-reader.tsx. The cover and its CTA
              open the real, existing in-page reader instead of a link to a file that does
              not exist. */}
          <Reveal>
            <div className="ph-07-hb">
              <div className="ph-07-hb-head">
                <h3>{finalConcept.beats.handbook}</h3>
              </div>

              {/* Why a document rather than a machine. Without this the handbook reads as a
                  fallback for the tower that was never built, instead of as the answer to
                  section 04's finding. Centred, max ~600px, per the layout reference. */}
              <p className="ph-07-rationale">{finalConcept.deliverable.rationale}</p>

              <HandbookCoverOpen
                coverSrc="/post-harvest/handbook/handbook-cover-1600.webp"
                coverAlt="Cover of the construction handbook, titled Drying Tower, first version, listing a construction manual, materials needed, tools needed and how to use"
                coverWidth={1600}
                coverHeight={1132}
                ctaLabel={finalConcept.sequence.ctaLabel}
                contentsLine={finalConcept.deliverable.contents.join(" · ").toUpperCase()}
              />

              <div className="ph-07-hb-pages-head">
                <p className="ph-lbl">{finalConcept.sequence.pagesLabel}</p>
                <p className="ph-07-hb-sub">{finalConcept.sequence.pagesSub}</p>
              </div>

              <div className="ph-07-previews">
                <figure className="ph-support-plate-wrap">
                  <div className="ph-support-plate">
                    <Image
                      src="/post-harvest/handbook/handbook-step-1600.webp"
                      alt="A handbook page headed Step 1, showing how to weld four square tubes into a rectangular frame, with dimensioned sub-steps and the materials needed listed beneath"
                      width={1600} height={1111} sizes="(max-width: 899px) 92vw, 46vw"
                    />
                  </div>
                  <figcaption className="ph-cap">{finalConcept.captions.step}</figcaption>
                </figure>

                <figure className="ph-support-plate-wrap">
                  <div className="ph-support-plate">
                    <Image
                      src="/post-harvest/handbook/handbook-cutlist-1600.webp"
                      alt="A handbook page headed Cutlist of materials, showing measured steel sections including square tube, angle iron, flat iron, metal sheet and pipe"
                      width={1600} height={1132} sizes="(max-width: 899px) 92vw, 46vw"
                    />
                  </div>
                  <figcaption className="ph-cap">{finalConcept.captions.cutlist}</figcaption>
                </figure>
              </div>
            </div>
          </Reveal>

          <Reveal>
            {/* The section closes on the handbook's own words, and nothing else
                (Sylvia, 2026-09-07, fourth pass). `finalConcept.status` used to render
                beside this quote; it said what section 09 already says, almost verbatim
                ("...through an actual build" vs 09's "...through a real build"), which made
                three consecutive statements of "not built, not tested" in one section and
                ended the project's climax on its third hedge. 09 is now the single full
                account; the one limitation stated here is the tower caption's "It was never
                constructed", attached to the image so the render cannot be misread as a
                photograph of a built object. Removing the second column also fixed a 156px
                height mismatch: the quote ran six lines against a two-line status block. */}
            <div className="ph-07-close">
              <figure className="ph-handbook-quote">
                <blockquote>{finalConcept.handbookQuote.text}</blockquote>
                <figcaption>{finalConcept.handbookQuote.attribution}</figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 08 How it was intended to work ============
          DOMINANT: the two-state drawing, read as one unit. The difference between the
          frames is the argument, so they are a pair rather than two plates. The ghosted
          handling frames are small evidence beneath. */}
      <section className="ph-section ph-v2" id="mechanism">
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
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="ph-chapter-label">{chapterLabel("status")}</p>
              <h2>{status.heading}</h2>
            </div>
          </Reveal>
        </div>

        <div className="ph-v2-ink">
          <div className="ph-canvas">
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
                      so it is the evidence this band is built on. */}
                  <Image
                    src="/post-harvest/photo/collector-built-1400.webp"
                    alt="The metal solar collector the team built, a long corrugated panel resting on a log outdoors in Seme"
                    width={1400} height={936} sizes="(max-width: 899px) 88vw, 30vw"
                  />
                  <figcaption className="ph-cap">{status.collectorPhoto.built}</figcaption>
                </figure>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="ph-canvas">
          <Reveal>
            <div className="ph-scored-v2">
              <p className="ph-open-claim">{status.claimOpen}</p>
              <InlineSvg
                name="req-checklist-scored-wide"
                className="ph-fig-primary"
                caption={`${status.checklist.caption} Booklet p.${status.checklist.page}.`}
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
            deliberate field rather than a boxed inset. */}
        <div className="ph-10-photo">
          <div className="ph-10-photo-media">
            <Image
              src="/post-harvest/photo/homestead-dusk-1600.webp"
              alt="Cattle grazing at dusk beside a homestead in Seme, Kenya"
              fill sizes="100vw"
            />
          </div>
          <div className="ph-10-photo-scrim" />

          <div className="ph-canvas ph-10-photo-content">
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

        <div className="ph-canvas">
          <Reveal>
            <div className="ph-foot">
              <span className="ph-cap">{project.title}, Reality Studio, Chalmers, 2024</span>
              <Link href="/" className="ph-cap" style={{ textDecoration: "underline" }}>Back to all work</Link>
            </div>
          </Reveal>
        </div>
      </section>

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
