# HALOGRIP Portfolio — Change Log

## Maritime portfolio alignment and audit fixes (2026-09-11)

- Reworked Maritime's opening around its project name, project metadata and a wide image.
  Added four numbered chapters, direct section links and a prototype/validation closing.
  Retained CSTRIDER green, Archivo/IBM Plex Mono and the current source assets, including
  the updated sideways-warning image. Post Harvest now reads Case study 004; HALOGRIP's
  existing 001 and Maritime's 002 match the homepage ordering.
- Distinguished the original Järntorget–Lindholmen course scenario from the later
  Koön–Marstrand internship screens. The slide and its timing figures remain explicitly
  course-era material. Moved the fleet placeholder qualification ahead of its screenshot.
- Replaced overlapping workstation-label positioning with responsive grid placement,
  reset the mobile top-label translation, improved small-text contrast, and aligned
  captions with the 1600px reading canvas. Screen groups use A/B/C; local notes retain
  numeric markers, hidden over the image on narrow screens.
- Added original-resolution image viewers for the scenario and three interface screens:
  native modal dialog, zoom, mouse drag, touch scrolling, Escape/close, focus return,
  loading/error feedback and source-link fallback without JavaScript.
- Changed reveals to animate only near viewport entry, with visible content as the default
  and live reduced-motion support. Removed unused scenario/map/annotation implementations
  and aligned image quality with the existing allowed values.
- Verification: production build, TypeScript, and seven regression checks covering built
  page anchors, assets, image proportions/quality, source links, project identities and
  reveal lifecycle. Browser discovery returned no connected browser; responsive visual,
  native dialog and touch interaction checks still require a browser session.

## CSTRIDER Blender render preview (2026-09-11)

- Added `scripts/render-cstrider-canal.py` for a separate canal setting, retaining the
  approved workstation layout and black chairs. Existing angled rear glazing now shows a
  modeled waterway, stone quay and generic waterfront buildings. This is an illustrative
  environment, not a reconstruction of a real CSTRIDER site. Outputs are kept in the source
  review folder as `CSTRIDER-canal-review.blend`, `cstrider-canal-ceiling-screens-preview.png`,
  and notes. Increased display-only luminance and contrast to address grey UI under AgX;
  flattened the ceiling's lighting by keeping area lights below its plane, adding broad
  upward fill, and removing ceiling specular response.
- Removed the foreground plant from renders at Sylvia's request. Corrected startup handling:
  the supplied file opens in mesh edit mode, so scripts now switch to object mode before
  adding geometry, ensuring the ceiling is a separate object rather than part of the plant.
- Added `scripts/render-cstrider-preview.py` to render an isolated copy of the supplied
  `public/maritime-hmi/FinalModel.blend` into `design-source/cstrider-source/render-review`.
  Restored source UI textures; desk screens follow the approved Fleet-left / Docking-right
  layout. Reframed the camera, hid the front windows and mannequin, and replaced missing
  environment and decorative materials. Original model and website remain unchanged.
- Following preview feedback, replaced mottled chair leather with uniform matte charcoal
  upholstery, retaining separate plastic and chrome materials. Sylvia subsequently requested
  black chairs: lowered the upholstery base colour and specular response to keep soft highlights
  without the grey appearance. Added a matte ceiling and lowered the camera after Sylvia
  requested an interior photograph composition without exposed wall tops; moved the foreground
  plant left to avoid obscuring the workstation at the lower camera height. The latest output
  is `cstrider-interior-black-preview-v2.png` at 960 × 540, using Cycles CPU rendering.
- Preview limitations are recorded in `render-notes.json`: substituted decorative materials,
  a PPT placeholder for external traffic, and reused Ferry 1–3 UI on the second workstation.

## HALOGRIP debugging implementation (2026-09-10)

- Preserved the opening choreography and scroll length while adding demand rendering,
  silhouette caching, a real loading hero and failure fallback.
- Scoped pin coordination to page instances and fixed delayed-callback cancellation;
  smoothed design-gap progress and removed animated full-screen blur/layout movement.
- Fixed sketch-modal focus/scroll-lock lifecycle, carousel tween cleanup and rapid input,
  server-rendered fallbacks, reveal visibility and dynamically mounted dark-section tracking.
- Restored the concept carousel's original desktop measurement state after a temporary `70vw`
  fallback made its sketches oversized. The carousel's existing 0.6-second GSAP motion remains;
  the design-gap blur removal and revised interaction angles remain intentional.
- Clarified concept evaluation, authorization locations and prototype/validation boundaries.
- Six lifecycle tests and the production build pass. Browser sessions were unavailable;
  visual and FPS regression checks remain explicitly pending in `docs/halogrip-debug.md`.

Detailed session-by-session history for this project (what changed, why, how it was
verified), moved out of `CLAUDE.md` to keep the auto-loaded project instructions lean.
This file is **not** auto-loaded into context — read it only when you need the historical
rationale behind an existing decision. New entries go here, not in `CLAUDE.md`.

*(Condensed 2026-09-09: this file had grown to ~3700 lines, mostly live-debugging
narration. Rewritten to keep the decisions/rationale and cut the process transcripts —
see git history for the full verbose version if ever needed.)*

## Post Harvest: evidence and interaction corrections (2026-09-10)

- Split the PICS-use finding from the decision to improve drying before storage. Theresa's
  account now suggests a possible role for use practices, without claiming a universal cause.
  The handbook rationale explains construction, design transfer and later iteration.
- Added Sylvia's account of author/presentation bias and the specific toolkit, box and tower
  tradeoffs. Report p.25 confirms consistent second-round drawing and anonymous authorship.
  The box's original "Sun Dry Table" sketch title is identified in its caption; images preserved.
- Checked and rendered report p.36: 81 x 70 x 2.5 cm describes each shelf; about 100 kg is the
  calculated batch capacity across ten shelves. Replaced duplicated/mislabelled specs, removed
  "side-fired" and unsupported affordability claims, and marked capacity as awaiting field tests.
- Replaced the scored SVG on the outcome section with an accessible 18-row evidence table.
  The historical 13/18 marks survive only as contextual design-review information. Collector
  observations, design expectations, calculations and pending tower tests have explicit limits.
- Focus scrollytelling now pins the heading and scenes in one parent. The third scene remains
  visible through release; the extra viewport-sized bottom margin is gone. All overlay/pinning
  rules share the same width, height, reduced-motion and feature-support gates, so the fallback
  is readable stacked content. Kept concept arrows available on narrow screens to reach feedback.
- Requirement modal now wraps Tab/Shift+Tab, makes the background inert, restores its prior
  state, and returns focus after inertness is removed. Existing Escape/backdrop closing retained.
- Validation: TypeScript and production build passed. Browser runtime discovery returned no
  connected browsers, so visual scroll/keyboard/mobile regression checks remain unverified.

## Maritime HMI (CSTRIDER)

### New case-study page at /work/maritime-hmi (this session)
Third case-study route, and the shortest by design. Sylvia's brief: this project does not
need a research narrative, only what the system is, what CSTRIDER's container-shaped
operations centre is as a product, and what the screens look like. Five sections, no
chapter numbering: hero, intro, the container idea, what is inside the container, the
three screens.

**Own visual system, per CLAUDE.md rule 1.** Archivo + IBM Plex Mono, near-white ground,
one dark section, hairline structure instead of cards. Route-scoped
`app/work/maritime-hmi/maritime-hmi.css`, imported only from that route's `page.tsx`;
verified in the browser that no maritime stylesheet loads on `/`.

**The accent is CSTRIDER's brand green (`#A8CF38`, `#CCE67D`), on Sylvia's instruction.**
It computes to about 1.7:1 on the paper ground, so it is never a text colour on light. The
CSS header documents the three roles it is allowed: text on the dark section (about 10:1
there), non-text graphics on paper (rules, the marker bar under each number, the caption
leader), and link underlines where the text itself stays ink. The navy from the
screenshots' "Initiate Departure" button was considered as the accent in the first pass and
dropped: one accent per page.

**Deck callouts rebuilt natively, in three passes.** Sylvia asked for the arrows and labels
from her portfolio deck. The deck was exported to PNG via PowerPoint COM automation
(`$app.Presentations.Open(...)` then `$slide.Export(...)`) to read the annotations off slides
3, 4 and 5.

  1. First pass put numbered dots on each screenshot and a numbered key underneath. Sylvia:
     not what she asked for, she wants the label pointed at the thing directly, as in the deck.
  2. Second pass moved the labels into side margins with SVG leader lines. Sylvia: the lines
     float around at random, follow the deck's routing.
  3. Third pass is the current one, and the rule it follows is the thing the deck was doing
     all along: **every leader is ONE straight line**, horizontal for a label in a side margin,
     vertical for one in the band above or below. No diagonals, no elbows. That makes a
     label's position a consequence of its anchor rather than a second thing to place, so
     `content.ts` now sets only `x`, `y` and `side` per callout; the CSS derives the rest.
     Leaders are plain absolutely-positioned boxes, not SVG, which is all a straight line needs.

The margin apparatus is dropped below 1000px, where a 150px margin would eat a third of the
screen: leaders and labels hide, the dots become numbered badges, and a numbered key under the
figure carries the same text. Both halves render from the same `notes` array.

One layout trap worth remembering: the label bands were first set as a margin on the image and
collapsed straight out of the figure, reserving no space at all. They are padding on the
wrapper now, with a comment saying why.

  4. Fourth pass put the descriptions back. Pass three had cut every label to the deck's
     terse wording ("Camera views", "Technical information") and demoted the descriptive key
     to a narrow-screen-only fallback, so the desktop figures became a field of green dots
     with a couple of words beside them. Sylvia: where did the information go, all I see is
     green dots. Each callout now carries a `detail` line beside its `label`, and the label
     renders as two tiers, bold name over description. This is what the deck was doing too
     ("Safety checklist" over "Runs automatically"); pass three had only copied the top tier.
  5. Fifth pass fixed the geometry that two tiers exposed: the leader started at the label
     box's far edge and therefore ran straight through its own text. `--lead-start` (20px)
     and `--label-gap` (28px) now govern it, and the gap must stay the larger of the two so
     a leader always begins after the text. The CSS says so at the declaration.

**The Safetyheaven explainer** (slide 4's three-state reading of the safe corridor) is on the
page too, at Sylvia's request, as a sub-figure hanging off the vessel view. The two "outside
box" states only exist in the deck and are cropped from a 7680px slide export; the "stay in
box" state is cropped from Sylvia's own screenshot instead, since the deck's copy of it has an
unrelated white card overlapping the circle.

**Slides 2, 3 and 6 had been dropped without saying so.** Sylvia asked where they went. The
honest answer is that the approved scope was five sections and the call to leave them out was
never flagged. What each one turned out to be worth:

  - **Slide 3 (Wall screens)** was already half-used: its text carries the fleet-view caption
    and callouts. Only its diagram is unused, and there is a reason to keep it that way, below.
  - **Slide 2 (UI screens)** is a contents page for the three screens, each of which already
    gets a full-width figure. But it carries one fact the page was getting wrong by omission:
    `FLEET VIEW/ROUTE PLANNING (EXTERNAL SYSTEM)`. Slide 3 says the same, `Traffic management
    system (Extern)`. The page was presenting the wall/fleet view as a designed deliverable.

    Sylvia then corrected the first fix too. It is not simply "an external system we did not
    build": the wall is *meant* to carry an external traffic-management system, there was no
    such system to show, and what is on that screen is a **simplified stand-in she built to
    hold it**. The wall-screen caption now says exactly that. Worth keeping straight, because
    both wrong readings flatter the work in different directions.
  - **Slide 6 (Scenario)** carries the operating cycle: Boarding 45s, Undocking 15s, Travel
    3 min, Docking 15s, Off-boarding 45s, a five-minute round trip over 0.2 nm. This is the
    argument for the "3" in section 04's numbers row, so it went in there rather than as a
    sixth section: three vessels per operator works because the demanding moments are two
    45-second dockings and they interleave.

    The first attempt only lifted the numbers into a plain hairline track. Sylvia: the slide's
    image is wanted and the deck's interface has to be reproduced as closely as possible,
    writing the text out is not enough. So the slide is now rebuilt whole: route map with two
    quay markers, the Virtual Bridge timeline with its slanted phase labels, and the Two
    Operators diagram of two operators bracketed to three vessel tiles each. The icon art is
    the deck's own, pulled straight out of the .pptx (operator, ferry hull, wave, stopwatch,
    distance arrows, route arrow) rather than redrawn, so it is the deck's figure and not a
    lookalike. The slanted labels lie flat below 860px, where a 28-degree label stops being
    readable, and the track turns vertical.

**Three corrections on the rebuilt slide 6**, all from Sylvia looking at it:

  - **The map was zoomed too far out.** The first crop was the whole archipelago and the
    strait the ferries actually cross was a sliver in the middle. Re-cropped tight on the
    crossing. Note the trap: overwriting the .webp in place does not change the URL, so Next's
    image cache kept serving the old crop through `/_next/image?url=...`. The asset was
    renamed to `route-map-strait.webp` rather than trying to bust the cache.
  - **The green block is the operations centre, and nothing said so.** On the deck's map it is
    the container parked at the quay, which is the whole "order one and put it where you like"
    idea made literal. It was rendering as an unlabelled green marker among other markers. It
    now carries a "ROC container" label with the deck's own arrow pointing at it.
  - **"Virtual Bridge" was crowded by the slanted phase labels.** They rise about 55px above
    the line, and the gap under the heading was 64px, leaving 9px of clearance. Now 100px, for
    45px of clearance (measured, not eyeballed).

**A CSS specificity bug worth remembering.** Sylvia: there is a blob of green on the map. It
was the deck's arrow overlay rendering at 547x798, covering the whole figure. `.mh-scn-map img`
is (0,1,1) and beat `.mh-scn-arrow` at (0,1,0), so the "make the map image fill its box" rule
was also stretching every other image inside the figure. The map image now has its own class.
The lesson generalises: inside a figure that layers overlays on an image, never size the image
with a bare `.parent img`.

Also from the same look: the vessel tiles were reading as three big green buttons per operator
(111px tiles, 69px icons) where the deck draws small marks, so the tile row is capped at 240px
(75px tiles, 42px icons) and the operator icon went 42px to 34px; the timeline rule ran the
full width past its last stop, and now ends on it (`right: calc(20% - 11px)`, five equal
columns with the dot at each column's left edge); and the container and its arrow were sitting
on top of the Marstrand berth marker, so both moved clear.

Two placements in `scenario.map` are guesses and carry `TODO(sylvia)` markers: which quay is
Marstrand and which is Koon (taken from the app's own labels in the underlying screenshot,
which puts "Marstrand" on the right-hand quay), and where the ROC container belongs. Both are
one-line edits in `content.ts`.

**The route conflict.** Slide 6 draws the scenario on Jarntorget to Lindholmen in central
Gothenburg, and slide 3's traffic-management map is Lindholmen too. Every screenshot on the
page runs Koon to Marstrand. Sylvia settled it: the route is Koon to Marstrand and the
Gothenburg version is the older course-era scenario. So the cycle is stated against Koon to
Marstrand, and **neither Gothenburg image is used**. Slide 3's wall diagram stays out for the
same reason: its centre is that Lindholmen map. Slide 2's fleet thumbnail was checked and is
Marstrand, so it is not affected.

The scenario map is therefore not the deck's. It is the Koon to Marstrand map lifted out of
Sylvia's own fleet-view screenshot and recoloured into the deck's map palette, so the figure
still reads as the deck's while the geography matches the screenshots. The recolour is a
per-pixel pass in the asset script: blue-dominant pixels become near-black water, everything
else is mapped onto a grey-green land-to-road ramp (land and roads sit only about 20 levels
apart in the source, so the ramp has to amplify that gap). The reasoning is repeated in
`content.ts` at `scenario` so it does not get "fixed" back later.

**Figures escape the canvas.** Sylvia: the screens are too small to read. The screens section
now runs the full window instead of `--canvas`, since a 3800px operator screenshot squeezed
into 70% of 1500px defeats the point of showing it. Captions and the numbered key come back to
the reading width. On the 2048px viewport this was tested at, the figure went from about
1050px wide to 1664px, then back to 1544px once the margins grew to 210px to hold the
two-tier labels.

**Screenshot sharpness.** First pass downscaled the screens to 2400px at WebP q88 and
Sylvia immediately caught that they were mushy. Two causes: the downscale, and Next's image
optimiser re-encoding at its default quality of 75. Now encoded at native resolution
(3168x1768, 3835x1570, 3816x1826) at q94, served with `quality={92}`, which needed
`images.qualities: [75, 92]` in `next.config.ts` (Next 16 rejects a non-listed quality).
75 stays first in that array so it remains the default everywhere else. About 450KB each,
below the fold and lazy-loaded.

**Hero headline.** "Running six autonomous ferries from a shipping container" set five
lines in the first pass, because `.mh-hero-copy` was capped in `ch` measured against the
root font size rather than the 62px display size. Shortened to "Six autonomous ferries, run
from a container" and the cap changed to a plain 720px, which holds it at two lines.

**Assets.** `public/media/Cstrider/` was an untracked drop that included the source .pptx,
which `public/` would have had Vercel serve publicly. Originals moved to
`design-source/cstrider-source/` (outside `public/`, not deployed); web assets converted
to WebP under `public/maritime-hmi/{roc,screen}/`, following Post Harvest's per-project
layout rather than the flat `public/media/`. `screen 2.png` and `screen 3.png` are Ferry
2 and Ferry 3 in the same layout as `screen 1.png` and are not shipped.

**Facts confirmed by Sylvia, so no TODO left for them:** project course Sep 2025 to Jan
2026, internship Jan 2026 to Jun 2026, the 20 ft container is CSTRIDER's settled product
form, and teammates are not credited by name (consistent with the other case pages). The
demo audience stays "a range of maritime experts" because CSTRIDER does not permit naming
them; `content.ts` says so in a plain comment rather than a `TODO(sylvia)`, so nobody
later mistakes it for missing copy. The one real TODO is an exterior photo of a container on
site or a vessel at sea, which the asset set does not contain.

**Homepage.** `app/data/projects.ts`'s `coming-soon-1` entry became the real project:
slug `maritime-hmi`, `comingSoon: false`, real `href`, and real tags replacing
`PLACEHOLDER_TAGS`. Card position and cover image unchanged.

**A note on the tooling, since it cost real time.** Chrome's screenshot capture went blank
intermittently on this page (blank frames, `Page.captureScreenshot` timeouts, "renderer may be
frozen" errors), and it was misread as a rendering bug in the page. It was not: the DOM,
computed styles and element geometry checked out live the whole time, and a fresh navigation
followed by a single scroll captures fine. If it happens again, reload before concluding
anything, and trust `getBoundingClientRect` over the screenshot.

Related: `next start` keeps serving the previous build's asset hashes until the process is
actually restarted, and `pkill -f "next start"` does not match it on Windows. Kill it by the
PID from `netstat -ano | grep :3005`, or the browser shows stale CSS and the change looks like
it did not land.

**Verified for the final state**, on a 2048px viewport against the production build: 18
callouts across the three figures, zero label-on-label overlaps, zero leader-through-label
crossings, nothing off-screen, figures 1544px wide (checked with a script over
`getBoundingClientRect`, not by eye).

**Not verified:** phone width. The browser would not resize below about 1536px, so the
`1000px`, `860px` and `460px` collapses are written but were never seen rendered.

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
