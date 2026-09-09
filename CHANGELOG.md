# HALOGRIP Portfolio — Change Log

Detailed session-by-session history for this project (what changed, why, how it was
verified), moved out of `CLAUDE.md` to keep the auto-loaded project instructions lean.
This file is **not** auto-loaded into context — read it only when you need the historical
rationale behind an existing decision. New entries go here, not in `CLAUDE.md`.

*(Condensed 2026-09-09: this file had grown to ~3700 lines, mostly live-debugging
narration. Rewritten to keep the decisions/rationale and cut the process transcripts —
see git history for the full verbose version if ever needed.)*

## Post Harvest

### Section 05: requirement-list preview nudged left, twice (this session)
Sylvia: a "move left" ask from earlier hadn't visibly worked. Root cause wasn't a bug —
`.ph-context-right { margin-left: -20px }` was genuinely applying, just too small a shift
to register on a ~390px block in a 1568px canvas. Raised to `-60px` (confirmed visibly
shifted, no crowding), then to `-160px` on a follow-up ask ("再继续偏移100px"). At -160px
the two grid TRACKS overlap by ~110px, but the left column's real content (prose + two
figure illustrations) never fills its own track that far right, so there's still no visible
collision — confirmed with a live screenshot, not track math alone. Noted in the rule's own
comment that the margin has mostly run out; a similar further push would likely start
crossing real content. Not verified at the narrow end of this rule's `min-width: 1000px`
gate, where the column gap shrinks toward its 32px floor.

### Section 04: rebuilt as one fixed storytelling stage with CSS-overlaid scenes (this session, five passes)
The most-iterated section this session. Original architecture: one `.ph-04-zone` per scene
(text+visual), each `min-height: 85svh`, each independently `position: sticky`, with a
persistent sticky `.ph-04-head` above. Sylvia went through several real, distinct bugs in
this system before asking for a structural rebuild instead of more patches:

1. **Header could overlap section 05's own heading.** `.ph-04-head` releases once
   viewport-top passes `(containing block bottom − header height)`, independent of viewport
   height; section 05's heading becomes visible once viewport-top passes `(section 05 top −
   viewport height)` — on any viewport taller than the header, the second threshold hits
   first, so both headings showed at once ("怎么下面的内容穿模了"). Fixed with a buffer:
   `.ph-04-zone:last-child { margin-bottom: calc(100svh - var(--ph-04-head-h)) }`.
2. **Header and scenes shared one sticky coordinate system**, which was the deeper bug:
   each scene's `top` was `calc(header-height + (100svh - header-height)/2)` **plus** a
   centring `transform: translateY(-50%)`. `transform` is a paint-time shift applied AFTER
   the browser clamps a sticky box to its containing block — it is NOT itself clamped — so
   a scene could slide up past its own zone's top, behind the still-pinned header
   ("下面的文字和图片怎么直接出现了，还穿过了了focus的标题"). First fix made the header
   plain block flow (not sticky at all) so the two could never share space. Sylvia then
   asked for the header back as a persistent band ("这个要一直在"); it went sticky again,
   but the scene's `top` kept the actual lesson — a plain `top` offset with **no**
   accompanying transform, since nothing there can escape the sticky clamp.
3. **Crossfade added** ("我想要 fade in 和fade out 的animation，现在的不喜欢" — didn't like
   the hard cut between scenes) via `animation-timeline: view()`, gated behind
   `@supports`/`prefers-reduced-motion` with a flat-opacity fallback.
4. **Final structural rebuild**, per an explicit brief ("scenes need to be overlaid in one
   sticky stage, not vertically stacked... do not solve this with more vertical margins or
   step heights", with an ASCII tree of the intended structure). `.ph-04-zone` is gone.
   `.ph-04-scroll` is now a plain 300vh scroll-distance well (no visible content of its
   own — three scenes' worth of scroll, ~1 viewport-height each). `.ph-04-sticky-stage`
   inside it is the thing that's actually sticky (`top`/`height` keyed off the live-measured
   `--ph-04-head-h`, `place-items: center`). Every `.ph-04-scene` shares the stage's one
   grid cell (`grid-area: 1 / 1` — the standard "layer children in one cell" technique), so
   there is only ever one visual position for a scene to occupy. Which scene is opaque is
   driven by one named `view-timeline` (`--ph04-progress` on `.ph-04-scroll`) with each
   scene claiming a different `animation-range`. Real bug caught while tuning this: a bare
   `view-timeline`'s 0%-100% (`cover`) includes the entry/exit padding before/after the
   stage is actually stuck (roughly a viewport-height each side) — a first attempt hand-
   tuned `animation-range` percentages against the untrimmed range and scene 3's window
   landed partly AFTER the stage's real release point (opacity computed `1`, but
   `getBoundingClientRect()` had gone negative — rendering off-screen, behind the header).
   Fixed at the source: `view-timeline-inset: calc(100svh - var(--ph-04-head-h)) 100svh`
   on `.ph-04-scroll` trims the timeline's own 0%/100% to exactly the stage's real stuck
   window (both values derived from the stage's own `top`/`height` formulas, so they
   self-correct for any viewport/header height), after which `animation-range` could go
   back to plain thirds.
5. Fail-open fallback, same policy as everywhere else on this page: below 1280px, without
   `prefers-reduced-motion: no-preference`, or without `animation-timeline` support
   (`@supports`), NONE of the stage/overlay/timeline machinery applies — scenes fall back
   to plain stacked block flow. Had to be the full fallback, not just "no animation": three
   scenes sharing one grid cell with no way to tell them apart would be unreadable.

Two decorative details (`needs-map`'s "knowledge gap" bubble, the Drying node's radius
grow-in) lost their `.is-visible`-on-`Reveal` trigger when the per-scene `Reveal` wrapper
was removed — both now just render in their finished state unconditionally, not worth
re-plumbing a one-time reveal for.

**Dev-environment gotcha worth remembering**: mid-debugging, a correct CSS change appeared
not to be applying at all (computed style showed old values) — root cause was Turbopack
dev-server HMR serving two stale CSS chunks side by side; a full `location.reload()` (not
just re-navigating) cleared it. Also: `window.scrollTo()` respects this page's global
`scroll-behavior: smooth`, so a script reading scroll position or screenshotting
immediately after calling it can catch a mid-animation frame — `{behavior: 'instant'}` is
what jumps synchronously.

**Header background**, same session: went through `#f1f2f5` → `#f7f8fa` (Sylvia: "背景颜色
没改，我想变成浅色的背景") → `var(--paper)` (Sylvia: "背景颜色还是没改，我想要大背景的颜色" /
"现在是淡蓝色" — the ask was never "lighter," it was "no tint at all, same as the page").
Still `background`-solid (not transparent) — opacity is what the sticky mechanism needs to
occlude scrolling content correctly, a visible colour difference was never load-bearing.

Also this pass: the background band's `background`/padding moved from inside
`@media (min-width: 1280px)` to the unconditional base rule — below that width the header
had literally no background at all (not just subtle), which is what "变成和背景一样的颜色"
was describing on a narrower window.

### Section 06 ("Developing with farmers") rebuilt against a reference mockup, then simplified twice (this session)
`public/post-harvest/photo/"concept development reference.png"`, a mockup Sylvia supplied
directly. Replaced the old two-column layout (tall portrait photo, rounds list, an
annotation-code legend SVG, a three-equal-card strip with a "picked" blue frame) with four
beats: a small wide fieldwork photo beside a first-evaluation/potential-bias/method-
adjustment sequence; a large centred carousel (Drying Tower dominant, Table/Box smaller on
either side); a compact response line; a resolved "SELECTED DIRECTION" statement.

**Four follow-up rounds, same session:**
1. Arrows didn't do anything and the 3D tilt wasn't visible ("为什么现在那两个箭头无法被
   点击，然后图片也没有perspective"). Both real: arrows were decorative `<span>`s — pulled
   the carousel into a client component (`concept-carousel.tsx`) with real click-driven
   state. The tilt was technically applied (`matrix3d` confirmed) but the concept webps are
   themselves near-white, so a rotated image had no contrast against the page background to
   read the tilt against — gave `.ph-06-carousel-frame` a white card surface + `box-shadow`
   (which follows the transformed layer, unlike the img's `filter: drop-shadow`).
2. Click produced a jarring snap, tilt still invisible, and a stray edge cut through the
   shadow. Root cause of the snap: items moved between slots via flexbox `order`, which
   isn't itself animatable — it swaps instantly, so `order`'s new arrangement always
   preceded the transition, reading as a jump. Rebuilt with `position: absolute` items
   where `data-position` only ever changes `transform`/`opacity` (both animatable). The
   "still can't see it" + stray-edge complaints traced to the same oversized card: a forced
   `width` made cards much wider than the sketch's own aspect, so most of what was rotating
   was blank space, and `overflow: hidden` on the wide card clipped straight through its own
   shadow. Removed the forced width (absolutely-positioned items shrink to content by
   default) and the clip; angle brought down from a since-rejected 50deg/900px to
   34deg/1400px.
3. Centre image too small to read ("图片太小了，看不清") — a real regression from fix #2:
   shrinking the card to fit content also shrank the ceiling the DOMINANT image could grow
   to. Gave the centre position its own, much larger `max-width`/`max-height` cap.
4. "现在这些草图下面太多没有用的内容了... 参考halogrip的[ 05 / CONCEPT EXPLORATION ]的结构"
   — a structural ask, not sizing. HALOGRIP already has exactly this pattern
   (`app/work/halogrip/concept-carousel.tsx`): cycling to the last card fades the others
   out and swaps in a "SELECTED DIRECTION" callout, with one quiet name label under the
   deck otherwise. Removed the process line and the always-visible selected-direction block
   entirely; `content.ts`'s `concepts.options` reordered so the selected concept is last in
   the array (required for "reaching the end" to mean anything); the carousel component
   itself now derives the "final" state from `options[center].selected`.

### Section 04's spatial composition rebuilt, then section 05's "define problem" area redesigned against a mockup (this session)
Section 04 ("Finding the focus"): a first pass (removing step-index numbers, alignment
tweak) was rejected as too minimal ("still feels like several small elements floating in a
very large blank viewport"). Root cause found on the second pass: one shared
`--ph-04-stage-h` variable sized BOTH the text column and the sticky visual, so a couple of
lines of text sat `align-content: center`'d inside a box nearly a full viewport tall — that
centring-in-an-oversized-box is what read as floating. Fixed by decoupling into
purpose-built `--ph-04-lead-gap`/`--ph-04-step-h`/`--ph-04-visual-h` variables, `align-
content: start` on the text step, and a `.ph-04-stage` wrapper capping the composition
narrower than the canvas at wide viewports. Two unrelated pre-existing bugs fixed in the
same pass: the "Finding the focus" eyebrow duplicated the heading (content.ts's `label`
field was identical to `title` for this one section only); the two large 04 diagrams never
displayed in full because a sitewide `.ph-svg-body svg { min-width: 760px }` floor wasn't
actually overridden for them despite a comment claiming it was.

Section 05 ("Defining the challenge") "define problem" area, against
`public/post-harvest/photo/define problem reference.png`: the three-threats-plus-narrower-
Weevils row unified into one `.ph-strip-4`; a new `.ph-priorities` strip added; the lower
composition rebuilt as a 65/35 split with the requirement-list checklist demoted to a small
preview that opens full-size in a new `requirement-lightbox.tsx` (portal-rendered,
Escape/click-outside/focus-return, same conventions as `handbook-reader.tsx`); removed a
paragraph implying the final concept solved carrying/transport, which was never validated.
One bug caught before shipping: the lightbox's close button first sat at the exact fixed
`top:20px;right:20px` spot the site's persistent "Close project" pill already occupies —
moved into the dialog's own normal-flow layout instead.

### Section 02 rebuilt against a mockup, then a narrative phase rail added (this session)
Five asks in sequence. (1) Section 02 rebuilt against a supplied prototype/mockup as "one
continuous narrative" instead of a card grid — chapter head → location band → evidence rail
→ documentary photo pair. (2) Two refinements (road photo height, a connector line from map
to photo). (3) "为什么这么糊啊" (why is it so blurry) — not a bad export, a `sizes` hint
that undershot the actual rendered column width by 5-10%, so Next served a smaller srcset
candidate than the box needed. (4) Header realigned to the location band's own grid columns
after a first pass (its own separate column split) was rejected as inconsistent. (5) The
largest piece: a narrative phase rail, five semantic phases (Discover/Reframe/Develop/
Deliver/Reflect) grouping the ten existing numbered sections, structurally referenced from
a supplied prototype HTML file but restyled in Post Harvest's own visual system. Section
04's animation was the explicit, highest-priority constraint ("do not modify the existing
animation or scrolling behaviour") — `.ph-phase` is a bare `display: grid` with no
`overflow`/`transform`/`filter`, so section 04's sticky elements keep resolving containing
blocks exactly as before. A real bug caught during verification: the rail's `grid-row: 1/-1`
only resolves against an *explicit* row definition, which `.ph-phase` never declares, so
`-1` silently collapsed to the first implicit row — the rail was releasing one section
early on every multi-section phase. Fixed with `grid-row: 1 / span 99`. Then Sylvia flagged
"好多数字好奇怪" (a lot of the numbers look strange) — the new phase number and the existing
per-section chapter label were near-identical in typography, reading as one skipping
sequence; resolved (through Plan Mode, three options offered, Sylvia picked her own answer
instead) by dropping the number from the section chapter label and keeping it only on the
phase rail.

CLAUDE.md updated in the same stretch: added Post Harvest to "what this project is", a hard
rule for its three different container widths (`.ph-canvas`/`.ph-shell`/`.ph-04-canvas`,
after several sessions' worth of back-and-forth working out why they're different — see
below), the full Post Harvest file structure, and its own open `TODO(sylvia)` items.

### Container widths: several sessions converging on three deliberately different values
Long-running thread across many sessions, worth reading as one story since it kept
resurfacing as "wide screens still have too much whitespace":

- `.ph-canvas` (`--canvas`, the shared default) started at 1480px, widened to **1600px**
  after Sylvia reported "还是两边大量留白" post-04-fix — the earlier fixes had only ever
  touched section 04, and every *other* section was still on the original, unwidened shared
  class. `--canvas` is a `min(Xpx, ...)` formula and, like any such formula, stops growing
  past its cap — expected behaviour, not a bug, but easy to mistake for one on very wide
  monitors.
- `.ph-04-canvas` (section 04 only): its own fluid container, `min(1680px, calc(100% -
  clamp(48px,8vw,160px)))`, built specifically because section 04's sticky two-column
  scrollytelling stage has its own legibility floor (see below) and was capped at the
  shared `--canvas`'s (then 1480px) ceiling on every desktop width — confirmed live, no
  wider than a 1400px viewport.
- `.ph-shell`/`--shell` (1700px, sections 09-10 only): Sylvia asked to measure section 09
  directly against HALOGRIP's own `#concepts` at the same viewport rather than guess — the
  numbers disproved her own "shell is too narrow" theory (09's checklist was already
  proportionally *ahead* of HALOGRIP's own card), but did surface a real, 1.7x heading
  font-size gap between the two pages, which was reported but deliberately NOT touched
  (CLAUDE.md's own hard rule: each case study keeps its bespoke type voice). `.ph-shell`
  itself already existed as dormant, unused CSS (`--shell: 1960px`) sharing HALOGRIP's own
  `.shell` mechanism almost exactly — revived at HALOGRIP's own number (1700px) rather than
  its old dormant one, and wired onto 09's three wrappers, then 10's (to close a new 50px
  seam widening only 09 had introduced between two adjacent sections).
- Section 10 separately had a real bug, not a canvas problem: `.ph-insight`'s `max-width:
  44ch` was capping the WHOLE reflection block (numeral, heading, rule and all), not just
  its prose — leaving each of four blocks at less than half its actual grid cell width.
  Moved the cap onto just the two pieces of running prose that needed it.
- `.ph-04-canvas`/`.ph-09-canvas`/`--canvas` were each independently re-verified as
  unaffected by every other one's changes throughout this thread — they use literal pixel
  values in their own formulas, not a shared token, by design.

### Section 04 scrollytelling: several rebuilds, ending on plain CSS + GSAP-free triggers (multiple sessions, superseded by the "fixed stage" entry above)
Long thread, now fully superseded by the CSS-overlay rebuild above, kept here for the
lessons: an early GSAP `ScrollTrigger` version picked the "active" step by intersection
RATIO (intersecting area / step's own area) rather than a fixed reading line — a
one-sentence step could "win" the instant it was fully inside the trigger band and lose
again almost immediately, while a three-paragraph step kept winning purely because it had
more area. Fixed at the time with one trigger per step at a fixed `"top 48%"`/`"bottom 48%"`
line. Real bug hit building that: creating every `ScrollTrigger` in the same effect that
armed the layout measured pre-arm (pre-`min-height`) geometry, since React hadn't yet
committed the re-render — split into two effects so triggers are created strictly after the
class (and the layout it drives) has committed. `ScrollTrigger.refresh()` on an
already-created trigger does NOT re-measure its `start`/`end` — confirmed directly; only
creating a fresh trigger at the later moment works. This is the same category of bug this
project's `pin-coordinator.ts` (HALOGRIP) exists to solve — see below.

Diagram sizing, several rounds: `max-height` on an SVG with a `viewBox` does not shrink a
replaced element proportionally — it letterboxes, so a capped box can make a diagram
render *smaller* while still occupying the same footprint (one diagram was found scaled to
0.639 with labels at 6.1px, `max-height` fully to blame — likely the source of several
"好多奇怪的留白" reports). SVGs are now excluded from that cap; width alone bounds them. A
12px minimum-label-size floor across every diagram was reasoned as `12px ÷ smallest
declared label × viewBox width` per drawing, not eyeballed, after finding it silently
unenforced between 768px and desktop width.

### Section 02 locator map: rebuilt from real geodata, then two colour/accuracy fixes (multiple sessions)
Went through: (1) a water/land figure-ground fix (the lake was filled a near-white that
read as land, not water — fixed with colour only, tracing untouched). (2) A full redraw
generated from real open geodata (`scripts/build-seme-locator.mjs`, Natural Earth +
geoBoundaries, gitignored cache) instead of a hand-traced shape, as a two-level
country-then-detail composition. (3) Rebuilt again into two clearly separated panels with a
"ZOOM IN" arrow between them (Sylvia: the previous projection-cone connector "looks like an
accidental construction line"), **and a real factual correction**: the field site is in
**Kisumu County, not Siaya** — verified two ways (grid-sampling the Seme polygon against
every county boundary: 99.7% inside Kisumu; and Seme's known population/area matching the
site's existing "~450/km²" stat exactly) — the booklet's own "Siaya" heading was wrong.
`content.ts`'s `dateline`/`captions.locator` corrected; flagged to Sylvia in case the
booklet's wording was deliberate for some reason not visible in the geodata.

### Section 07 (handbook): several rounds narrowing from "dominant band" to a secondary link (this session)
The handbook's entrance to its 53-page in-page reader went through multiple shapes as its
role in the page's hierarchy was clarified: a full-width "paper on blue" CTA band → a small
bordered secondary button (still too detached, floating alone) → finally folded into the
previews' own header row as a plain text link, no box, sized to its own label. Along the
way: `finalConcept.heading` renamed "The Drying Tower" → "The Drying Tower Handbook";
`--on-blue-dim` (every caption/body colour on the section's navy field) raised from 0.62 to
0.82 alpha for contrast; a `.ph-07-close` box-model inconsistency was fixing two symptoms at
once (a 64-80px gap ask and a top-alignment ask both traced to one child carrying leftover
margin/border meant for a different context). Separately: the handbook was corrected from 7
pages to the real 53 (the original estimate came from leftover probe renders of only a
slice of it — rescanned the source PDF page range directly). The reader overlay is mounted
at `.ph-root` level, not inside its own section — `position: fixed` escapes layout but not
CSS cascade, and mounting it inside the section it opens from picked up that section's own
local image-sizing rules.

### Site infrastructure renamed from "halogrip-portfolio" to "sylviaxie" (this session)
Sylvia: "halogrip只是我这个项目的名字" — HALOGRIP is one case study, not the whole site.
GitHub repo renamed (auto-redirects), Vercel project renamed (did NOT move the live
`.vercel.app` alias on its own — had to explicitly `vercel domains add` the new domain as a
first-class project resource to get it past the project's SSO-protection exemption, then
remove the old alias per Sylvia's explicit choice not to keep it redirecting).
`metadataBase` in both layout files, `package.json` name/description, and CLAUDE.md's own
Deployment section all updated to match. Verified live: new domain 200s, old one 404s.

## HALOGRIP

### Concept exploration (05): rebuilt many times before landing on a plain click-driven deck (many sessions)
The most-rebuilt single component on the HALOGRIP page. Worth reading as one arc: started
as a static 4-card grid → a scroll-scrubbed pinned filmstrip (ported from the source pptx's
own Morph-transition slide coordinates) → a self-contained wheel/drag/click "hero" carousel
(rebuilt against a supplied reference `HeroCarousel` component, ported to GSAP since this
route doesn't use framer-motion) → **finally a plain click/keyboard-only deck** after
Sylvia's explicit root complaint: page scroll should only ever move between sections, and
every scroll/wheel-intercepting version up to that point trapped it inside the component.
The current `concept-carousel.tsx` reads no scroll/wheel/drag input at all — `useState` on
a discrete index, GSAP only used to tween each card's `xPercent`/`yPercent`/`rotation`/
`scale`/`opacity` into one of four fixed background slots recomputed relative to whichever
card is active. Real, reusable lessons from the earlier rounds:
- GSAP must own an element's transform from its very first frame — setting an *initial*
  position via a raw CSS `transform` string (even matching values) confuses GSAP's own
  decomposition the first time it tweens that element (confirmed: a "centred" slot with
  `xPercent:0` rendered ~290px off). Fix: `gsap.set()` once on mount to establish GSAP's own
  baseline before any `gsap.to()` call ever touches the element.
- The site's global `ScrollTrigger.normalizeScroll()` caches a max-scroll bound; any
  component that mounts `null` then a real, taller section on a later render (common for
  `canEnhance()`-gated components) can desync that bound and leave the page stuck
  unscrollable past the stale max. Fix used throughout: one `ScrollTrigger.refresh()` call
  in the component's own mount effect. (`pin-coordinator.ts`, below, is the *separate* fix
  for a different symptom — an already-created trigger's own `start`/`end` not responding
  to `refresh()` at all.)
- Asset choice matters more than card size: three separate rounds of enlarging a card tried
  to fix "sketches too small to read" before finding the actual cause — the asset set in use
  (extracted from one range of pptx slides) was raw white-on-black scans with a lot of dead
  canvas around a small drawing; switching to a different, cleaner slide range (this
  project's own original slides-11-15 export) fixed legibility immediately with zero CSS
  changes.
- A file-hash/histogram diff proves two files differ; it does not prove their *content*
  differs. Sylvia caught a case where two "different" image sets were actually re-exports
  of the same four source sketches — worth actually opening and looking at images before
  asserting "these are different."

Two smaller, still-live follow-ups on this component: concept numbers were made explicit
(`CONCEPT 01`/`03`/`04A`/`04B`/`02`, distinct from the deck's own 1-5 position counter,
after Sylvia flagged the ppt's non-sequential numbering as confusing with no explanation);
and — much later — a legibility pass (cards were rendering at 224x157px against an
undocumented "fit everything in one viewport" `min-height:200px` floor) traded a strict
one-screen-fit guarantee for a legible 571x399px card, which also exposed and fixed a
GSAP-percentage regression where the four background "fanned" cards bled up into the
heading area once the active card (and therefore their own untransformed box) got bigger.

### 02.3/02.4: rebuilt, then a real GSAP pin-timing bug fixed with a dependency coordinator (this session)
02.3 ("Current Response") replaced a flat DOM timeline (cards, an SVG process path, a
progress bar) with one full-viewport scene photo that already bakes in the process visually
— motion reduced to a single opacity/scale reveal-once plus a small parallax, deliberately
calm since 02.4 carries the section's real transformation animation. **The actual bug** a
report of "02.3 shows up twice with a blank gap" traced to: `process-scene.tsx` and
`overview-backdrop.tsx` created their `ScrollTrigger`s synchronously on first mount, before
`scroll-intro.tsx`'s own real pin (deferred to a second, hydration-safe render, measured
taking up to ~1s under real load) existed — baking in `start`/`end` measured against a
still-short document. `ScrollTrigger.refresh()` does NOT fix an already-created trigger's
`start`/`end` (confirmed directly from the console — they survive `refresh()` unchanged no
matter when it's called). Fix: new `app/work/halogrip/pin-coordinator.ts`
(`markPinReady(source)` / `onPinsReady(deps, callback)`), a small dependency graph so each
section defers creating its own trigger until everything above it has already landed. This
replaced an earlier, non-working attempt (`scroll-refresh.tsx`, deleted) that tried calling
`refresh()` after the fact instead. Rule for later: any component gated by an `enhanced`
flip must call `markPinReady` on **every** code path, including "decided not to enhance," or
a sibling waiting on it will stall until the coordinator's 4s safety timeout.

### Type system swapped to Koulen + Roboto Mono, font sizes re-pinned to mason-wong.com's actual numbers (this session, two passes)
Inspected mason-wong.com live via `getComputedStyle` (Sylvia's request) and confirmed its
pairing: Koulen (headings) + Roboto Mono (body/UI), both free Google Fonts. First pass
consolidated HALOGRIP's own already-fluid `clamp()` sizes into named tokens without
changing their values. Sylvia then asked to go further and actually match mason's pixel
ceilings — resulting `:root` tokens keep each existing clamp's `min`/`vw` slope but replace
the `max` with mason's measured number (`--fs-hero` 270→167, `--fs-title` 90→80, etc.), and
— after Sylvia explicitly rejected leaving the smallest tiers alone — every size floor was
raised to 12px minimum ("我想所有字都12px以上的，和mason一样"), a real, visible, intentional
change across every eyebrow/footer/caption on the page.

Real scoping bug hit while wiring the fonts in: `next/font/google`'s CSS variables only
exist on `#top` and its descendants, but the file's `--display`/`--mono` tokens and `body`'s
own `font-family` live on `:root`/`body` — ANCESTORS of `#top` — so `:root` referencing the
font variable was invalid at that scope and silently fell through to the system fallback
(confirmed: computed `font-family` was the browser default, not Koulen, even though the
variables were correctly defined one level down). Fixed by redeclaring both the tokens and
`font-family` on `#top` itself.

### Background system unified into `--paper`/`--paper-light`/`--dark`, then collapsed further to one flat tone (this session, two passes)
Several near-duplicate off-white hexes (drifted apart across many earlier sessions) were
consolidated into two named light tokens plus the existing dark one; `.principles`
converted from a dark section to the same continuous light background as the three
sections around it (the actual fix for a "run of four sections" Sylvia wanted read as one
continuous background). Sylvia then asked to collapse further — drop the second light tone
entirely, one flat `#f9f9fa` everywhere light. **One deliberate, flagged exception**:
section 09's `.journey` keeps its old hardcoded `#f3f2ee` — its five story-grid PNGs have
that exact colour baked into their own canvas backgrounds (confirmed by pixel-sampling the
files directly), and moving the CSS without re-exporting the assets would introduce exactly
the seam this whole pass was meant to remove. Left with an explanatory comment so a future
session doesn't "fix" it back onto the shared token. (A later, explicit ask DID recolour
those five PNGs in place via a `sharp` script — shifting only near-background pixels
proportionally to how close they already were to the old colour, verified after the fact
that every real-artwork pixel diffed at exactly 0 against a backup.)

### PRODUCT OVERVIEW rebuilt from a spec grid into pixel-sampled annotation callouts (this session, two passes)
Replaced a flat 2x2 spec-card grid with four industrial-design-style leader-line callouts.
Anchor points were pixel-sampled from the product photo's real alpha channel via `sharp`,
not guessed, so every dot lands on real opaque product surface and every label lands in
genuinely empty space. A real layout bug (the visual was `position:absolute` inside a
hand-picked `min-height`, contributing zero to flow height, leaving ~300px of dead
whitespace below it) was found and fixed by rebuilding the section as a real CSS grid
instead. Follow-up pass, after Sylvia found the result crowded: recomputed anchor points
further inward from the image's outer edge (her direct correction: "现在的字怎么向内扣，
向外更好啊" — the first "inward" attempt had it backwards), dropped the annotation type
scale to a clearly secondary 16px, and shifted the whole visual left for clearance from the
fixed CLOSE PROJECT pill.

### 06 / Sketch Process: several content/visual passes, ending on a 3-stage story with a soft-charcoal card (this session)
Went from a "Prototype Testing" section (physical-prototype photo + evaluation findings) —
deleted outright per an explicit ask, replacing a different story than sketch-stage
iteration — through: a wide single sketch sheet; a "3 stages" structure once Sylvia
clarified an existing asset folder actually belonged here, not to section 05 (confirmed
scope explicitly before touching anything — she did not want section 05 touched); a
lightened-then-reverted card background (white background + black line art was tried,
reverted after Sylvia reported it didn't read well — the assets' ink alpha is well below
100% through most strokes, so black-on-white reads as faint grey where the same alpha
white-on-dark reads clearly; landed on a soft charcoal, dark enough for the line art,
softer than the page's near-black token); red per-card index numbers removed; and, after
Sylvia caught that two of the three "stages" were actually re-exports of the same four
source sketches (verified by opening the pixels directly, not by file hash), the duplicate
stage was removed and the remaining two restructured into an explicit "4 dark exploration
sketches converge on 1 light result" layout with a connecting arrow.

### Sketch/concept lightboxes and card-hover interactions rebuilt to spec (this session)
The sketch-process card hover (red border on click) turned out to be a `:focus-visible`
ring, not `:hover` — these cards are a `<figure role="button">`, and Chromium shows a
focus ring on plain mouse clicks for non-native interactive elements. Rebuilt the whole
interaction (lift + image scale + no full-card border) so a click never reads as a
persistent "selected" state. The concept sketch lightbox was rebuilt from an image-only
preview into a two-column media+info editorial panel per an explicit brief ("not a browser
image preview"), with a light frosted backdrop instead of a dark scrim.

### CLOSE PROJECT pill made background-adaptive (this session, three iterations)
First attempt used `mix-blend-mode: difference` with no fill — rejected by Sylvia
("这个按钮怎么会透背景啊") since a diff-blended fill shows the actual inverted pixels behind
it, reading as translucent over a photo rather than solid. Rebuilt as two fully opaque
states toggled by an `IntersectionObserver` watching every dark section. A remaining gap
Sylvia caught directly ("经过图片的时候也要保持实心"): the toggle is section-level, so a
nominally light section with a locally dark photo patch under the button still looked
low-contrast. Fixed generally (not per-image) with a border whose colour is always the
opposite tone from the pill's own fill, so the chip's edge is legible from its own internal
contrast regardless of what's behind it.

### Scroll-intro (pinned 3D opening) ported 1:1 from a PowerPoint reference, then pacing/lighting/arrow fixed (this session, two passes)
Rebuilt to match an existing PowerPoint animation Sylvia had designed (real embedded 3D
model + Morph transitions across 9 slides) rather than a text-brief guess — ground truth
(exact rotation per slide, on-screen frame, text, colours, a custom arrow shape) extracted
directly from the pptx's own OOXML. Key confirmed facts, worth not re-deriving: accent
colour `#2D5391`; font is Poppins, scoped to this one route only (a deliberate exception to
the page's usual Nimbus Sans Narrow); camera is `OrthographicCamera`, required so the
model's on-screen size matches the deck's own frame percentages (a perspective camera
measurably over-sizes the side-view pose); the Forward/Brake/Reverse "rock" is a flat,
in-picture-plane sweep on its own `tilt` channel, not part of the 3D pose — folding it into
pitch/yaw/roll foreshortens the view instead of rocking it.

Follow-up pass: **pacing** was rebalanced to the pptx's own real per-slide timing (1500ms
Morph + 2000ms hold — a first pass had this ratio wrong, leaving near-zero dwell time).
**Lighting** — "buttons look black instead of silver" traced to several materials being
`metalness:1,roughness:0.1` with no environment map to reflect (a pure metal has no diffuse
term); fixed by adding three's built-in `RoomEnvironment` plus the deck's own real light rig
read out of the pptx's `<am3d:model3d>` element, not invented. **The directional arrow**
had two independent bugs, not one: the arc's own path was computed by treating the pptx's
`adj1`/`adj2` as literal ellipse angles when the `arc` preset applies its own conversion
first; and separately, SVG `marker-end` doesn't shorten its line the way DrawingML shortens
a line by the arrowhead's own length, so the stroke ran full-length under the triangle,
producing a "notched, squashed, buried" head — fixed by cutting the stroke back and
computing an explicit triangle from the arc's chord rather than relying on `marker`'s
auto-orient.

### Multi-project restructure, then homepage assets/animation (two sessions)
Moved the single-page HALOGRIP site into `app/work/halogrip/`, trimmed `app/globals.css` to
a shared Tailwind + `@theme` base, and built a new homepage cloned from Sylvia's Framer
reference site. Follow-up: wired real images into every placeholder slot, added a
letter-by-letter hero reveal, a scroll-linked project-card zoom (`ScrollZoomImage.tsx`,
formula later corrected from a symmetric centre-distance curve to an entry-progress-from-
bottom-edge one after measuring the reference site's own scroll behaviour directly), and a
hover tag-ticker on project cards (had a real reset bug — `animation-play-state` toggling
does not reset a CSS animation's own progress, so every hover resumed from wherever it last
stopped; fixed by only attaching the animation class on hover at all).

Git history note: mid-session the tree was reverted to an earlier dated checkpoint
(`26082601`, via `git checkout <commit> -- .` + a new commit, never `reset --hard`) after a
few checkpoints had regressed ("破了，得重新做"). THE CHALLENGE section briefly existed as a
5-scene split in a later checkpoint that was NOT kept — if a future session doesn't find
`challenge-chapter.tsx` etc., that's why, not a documentation gap.

---

*(Earlier entries — the original section-02 CHALLENGE placeholder scaffolding, the initial
broken-image fixes after a `public/media/` reorg, and 04's very first diagram-legibility
pass — are fully superseded by later entries above and were cut rather than condensed;
see git blame on this file before 2026-09-09 if the literal old text is ever needed.)*
