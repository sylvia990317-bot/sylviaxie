# CLAUDE.md

Rules and context for working on Sylvia Xie's portfolio site. Read this before making changes.

Last synchronized with local source: 2026-09-12. This is current guidance; older entries in
[CHANGELOG.md](CHANGELOG.md) and the Kenya planning documents are historical where they differ.

## What this project is

A Next.js 16 (App Router) + React 19 + TypeScript portfolio site for Sylvia Xie, an industrial
designer. It has two kinds of pages:

- **`/` — the homepage.** A general portfolio landing page (hero, project grid, about,
  experience, testimonials, contact) styled to match Sylvia's Framer reference site
  (https://sylviaxie.framer.website/).
- **`/work/<slug>` — individual project case-study pages.** Each one is a self-contained,
  bespoke-designed page for a single project. Three are currently linked from the homepage:
  - `/work/halogrip` — an emergency steering wheel concept for autonomous vehicles, a
    master's thesis with Autoliv/Chalmers. Red/black/Koulen-and-Roboto-Mono.
  - `/work/maritime-hmi` — a remote operations centre for CSTRIDER's autonomous
    passenger ferries: a project course at Chalmers (Sep 2025 to Jan 2026) continued as an
    internship (Jan 2026 to Jun 2026). Near-white/Archivo-and-IBM-Plex-Mono, CSTRIDER green,
    with a dark product-idea section and a dark technical-grid interface sequence. The shortest
    of the three pages on purpose: three numbered chapters (Overview, Operating model,
    Interface system), a project-name opening and image detail viewers. There is no separate
    `prototype-validation` chapter in the current source.
  - `/work/post-harvest` — a solar maize-drying tower for smallholder farmers in Seme,
    Kenya, an MSc Industrial Design Engineering project with architecture students
    (Reality Studio, Chalmers, 2024). Editorial/documentary: Bodoni Moda serif + Geist
    sans and Geist Mono, blue accent. Ten internal sections, but only five visibly numbered
    phases: Discover, Reframe, Develop, Deliver, Reflect. `chapterLabel()` returns a name
    without a number, avoiding two competing numbering sequences.

Homepage order and case identifiers: HALOGRIP 01/001, Maritime 02/002, Truck 03/003 reserved,
Post Harvest 04/004. The Truck card remains `comingSoon: true` with no `href`. Volvo route/assets
are work in progress in this workspace, not evidence of a completed or published case study.

## Hard rules — read before touching styles or structure

1. **Each project case-study page keeps its own bespoke visual style.** Do not unify
   `/work/halogrip`, `/work/post-harvest` (or future project pages) into the homepage's design
   system, or into each other. This was an explicit decision from Sylvia. HALOGRIP is
   red/black/Koulen-and-Roboto-Mono on purpose (see CHANGELOG.md — swapped from Nimbus Sans
   Narrow/DejaVu Sans Mono in an earlier session); Post Harvest is Bodoni Moda/Geist with a blue
   accent, on purpose too — leave each alone unless Sylvia asks to redesign that specific page.
   Approved 2026-09-11: Maritime now shares the portfolio's project-name opening, project
   identifiers (001 / 002 / 004), chapter orientation, reading-width conventions and close
   button shape. Its colour, type and source imagery remain distinct. Course-era Scenario
   and internship interfaces are explicitly labelled as different routes.
   Another explicitly-approved exception: Post Harvest's wide-container mechanism
   (`--shell`/`.ph-shell` in `post-harvest.css`) is a deliberate structural mirror of HALOGRIP's
   own `.shell`/`--gutter` pattern in `halogrip.css`, at HALOGRIP's own numbers — Sylvia asked
   for that specific cross-project reference (see CHANGELOG.md, "measured against HALOGRIP
   directly"). That is a layout/sizing borrow, not a visual-style unification (type, colour and
   voice stayed Post Harvest's own) — don't read it as license to unify anything else the two
   pages share just because this one mechanism was intentionally matched.
2. **CSS isolation is load-bearing, not incidental.** `app/globals.css` is shared across every
   route (Tailwind import + `@theme` tokens + a minimal reset). `app/work/halogrip/halogrip.css`,
   `app/work/post-harvest/post-harvest.css` and `app/work/maritime-hmi/maritime-hmi.css` are
   each imported *only* from their own route's `page.tsx`. This import convention is not
   automatic selector scoping: retain project namespaces/root scoping and check cross-route
   navigation for style leakage. When adding a case, import its `<slug>.css` from that route,
   never add it to `globals.css`.
3. **Any addition to the shared reset in `globals.css` must go inside `@layer base { ... }`.**
   Unlayered CSS beats Tailwind's `@layer utilities` regardless of class specificity — this
   already caused a real bug once (a bare `a{color:inherit}` silently broke every `text-*` utility
   on links, e.g. made the Contact section's "Let's talk" button text invisible). Do not add plain
   unlayered rules to `globals.css` again.
4. **The homepage uses Tailwind v4 utility classes**, not hand-written CSS (see `@theme` block in
   `app/globals.css` for the custom tokens: `--color-bg`, `--color-ink`, `--color-muted`,
   `--color-tertiary`, `--color-line`, `--radius-card`, `--font-heading`, `--font-body`,
   `--font-mono`). Keep new homepage components consistent with this — don't introduce more
   hand-written CSS classes there.
5. **Placeholder content stays obviously fake until Sylvia replaces it.** Use the
   `PlaceholderImage` component (`app/components/PlaceholderImage.tsx`) for any image without a
   real asset yet — never a broken `<img src>`. Flag placeholder text/links with a
   `// TODO(sylvia): ...` comment at the definition site (see `app/data/*.ts` and the homepage
   components for examples) so they're easy to grep later.
6. **"Coming soon" project cards are intentionally non-clickable** (`comingSoon: true`, no `href`
   in `app/data/projects.ts`) — plain `<div>`, not a link to a dead-end page. Only add a real
   `<Link>` once a project actually has a page to link to.
7. **Post Harvest has three different container widths; know which one a section is on before
   widening anything.** `.ph-canvas` (`--canvas`, 1600px) is the default reading width, used by
   most sections. `.ph-shell` (`--shell`, 1700px) is the wide container, mirroring HALOGRIP's own
   `.shell` — currently on section 09 and 10 only. `.ph-04-canvas` (literal `1680px`) is section
   04's own one-off, sized for its sticky two-column diagram stage and not shared with anything
   else. This split exists because Sylvia asked, across several sessions, to widen specific
   sections without touching `--canvas` globally (see CHANGELOG.md, the whole "large-screen
   whitespace" thread) — before changing any section's width, check which container class it's
   actually on, and don't assume `.ph-canvas` alone is "the" canvas.
8. **Never restore HALOGRIP's retired full Hero.** Sylvia explicitly rejected `HeroFallback`,
   including as a loading, mobile, reduced-motion or failure fallback. Server render and first
   hydration show a full-height near-white shell with an accessible, visually hidden H1.
   Enhanced loading uses an empty near-white cover; readiness fades it away and enables the pin.
   Unsupported enhancement or a 15-second timeout/render/WebGL failure shows `StaticIntro`:
   the animation's outline HALOGRIP title and small case/place/year line, with no old image or
   metadata grid. No JavaScript leaves the blank shell and server-rendered body, not StaticIntro.
   Product metadata remains below the opening; the old image may remain in social metadata.
9. **Keep Maritime's latest screen grouping and evidence boundaries.** A/B/C detail captions
   use a freestanding large letter, title and explanatory column, with no separator rules.
   The detail sequence is dark with a subtle 72px grid; the station overview stays light.
   Its top bracket starts at 18.2%, spans 64.2%, and centres on the 50.3% label/connector.
   Do not revert to the old left-shifted bracket or green caption dividers. Original slide 6
   describes Järntorget–Lindholmen; the internship screens describe Koön–Marstrand. The course
   timings do not validate the internship route. The lower-left Fleet screen is a simplified
   placeholder for an unavailable external traffic-management system, not the shared wall.
   Keep this qualification before the image. Do not invent expert identities or test metrics.

## Structure reference

```
app/
  layout.tsx              Root layout — generic site metadata, next/font/google (Inter Tight,
                           Inter, DM Mono) loaded here as CSS variables
  page.tsx                Homepage, composed from app/components/home/*
  globals.css              Shared: Tailwind import + @theme tokens + @layer base reset
  data/
    projects.ts            Drives the homepage project grid
    experience.ts           Homepage Experience timeline entries
    testimonials.ts        Homepage testimonial placeholders
  components/
    PlaceholderImage.tsx    Shared placeholder box (div, not a broken <img>)
    home/                   Homepage-only components (SiteHeader, Hero, ProjectGrid/ProjectCard,
                             ScrollZoomImage, TwoColumnSection, LogoMarquee, AboutCard,
                             ExperienceTimeline, TestimonialsCarousel, ContactSection, SiteFooter)
  work/
    halogrip/
      page.tsx              HALOGRIP case study — own `metadata` export, own CSS import
      halogrip.css          HALOGRIP-only styles (font-size tokens + --display/--mono
                             tokens, all component classes) — see CHANGELOG.md for the
                             Koulen/Roboto Mono type-scale overhaul
      interaction-deck.tsx  Client component, steering-state demo ("use client")
      scroll-intro*.tsx/css Pinned scroll-driven 3D opening (R3F + GSAP ScrollTrigger), ported
                             from Sylvia's PowerPoint reference; blank loading shell and
                             minimal StaticIntro replace the old full Hero. Poppins is a
                             deliberate opening-only type exception. See docs/halogrip-debug.md.
      pin-provider.tsx      Page-instance pin readiness; pin-coordinator.ts owns scheduling.
      scene-boundary.tsx    Render-error fallback for the 3D scene.
      need-scene.tsx         02.2 / REAL-WORLD NEED — one-shot route-line draw-in synced to
                             the annotations/frame/stat, see CHANGELOG.md
      close-project-button.tsx Client component for the fixed top-right pill — IntersectionObserver
                             toggles a dark/light opaque state to match whatever section is
                             behind it, see CHANGELOG.md
    maritime-hmi/
      page.tsx              Maritime HMI case study — own `metadata`, own CSS import, own
                             next/font (Archivo + IBM Plex Mono), three numbered chapters
      maritime-hmi.css      Maritime-only styles. Bright CSTRIDER green is for dark-surface
                             text and non-text marks; --accent-dark is readable on paper.
                             Reading canvas: 1600px; detailed interface rail: 1800px.
      content.ts             Project copy, three chapters, source scenario and screen notes.
                             Each note carries x/y image coordinates plus label/detail.
                             Numeric image markers are hidden on mobile; the reading rail
                             remains. Fleet screenshots carry no overlaid markers.
      reveal.tsx             Visible-by-default viewport entrance using the Web Animations
                             API. Reduced-motion and unavailable-observer paths stay static.
      image-viewer.tsx       Original-image links enhanced with native modal dialogs,
                             zoom and panning; supports keyboard and touch navigation.
    post-harvest/
      page.tsx              Post Harvest case study — own `metadata` export, own CSS import,
                             ten sections grouped under five numbered phase rails
      post-harvest.css      Post Harvest-only styles (`--canvas`/`--shell` width tokens, all
                             component classes) — see CLAUDE.md hard rule 7 for the three
                             container widths, and CHANGELOG.md for why each exists
      content.ts             All page copy, evidence-sourced (each factual claim carries an
                             `Evidence` tag and a booklet page number — see the file's own
                             header comment). Edit copy here, not in page.tsx
      handbook-pages.ts      53 handbook pages (report PDF pp.54–106); opens on a seven-page
                             overview, with all 46 assembly pages available in the full reader
      handbook-reader.tsx    Client component, `position: fixed` full-page handbook viewer —
                             mounted once at the bottom of page.tsx (not inside any section) so
                             its own cascade never inherits a section's local image rules, see
                             the mount-site comment in page.tsx
      inline-svg.tsx          Server component: reads a diagram SVG from
                             `public/post-harvest/diagram/*.svg` at build time and inlines its
                             markup, so the SVG's `<text>` binds to the page's own webfont
                             variables instead of falling back to the system sans
      reveal.tsx             Client component, one-time fail-open fade-up on scroll into view
                             (IntersectionObserver; content is visible by default even if JS
                             never runs) — used throughout the page for section entrances
public/
  media/                   HALOGRIP's images, mainly under media/halogrip图片/ by section
  maritime-hmi/             Maritime HMI's images: roc/ (operations-centre renders),
                             corridor/ (the deck's three safe-corridor states), scenario/
                             (original course slide 6, portfolio-slide-6.webp, with its
                             Järntorget–Lindholmen route intact), and
                             screen/ (the three operator screens, kept at their native
                             3168-3835px and served at `quality={92}` — see next.config.ts)
  post-harvest/             Post Harvest's images, organized per-project:
                            concept/, diagram/ (includes the inlined SVGs
                            inline-svg.tsx reads), figure/, handbook/ (+ handbook/pages/, the
                            handbook-reader.tsx page scans), photo/, portrait/, vignette/
  home/                    Homepage's real assets (avatar, portrait, logos/, projects/) — see
                            CHANGELOG.md for the source→destination mapping
  fonts/                   HALOGRIP's old self-hosted fonts (Nimbus Sans Narrow, DejaVu Sans
                            Mono) — superseded by Koulen/Roboto Mono (next/font/google, loaded
                            in page.tsx), left on disk unused, not deleted
design-source/              NOT deployed — outside public/, so Vercel never serves it.
                            halogrip-pitch-deck/, halogrip图片/ and section 2 reference/ are
                            HALOGRIP's raw source (the original pitch-deck pptx/mp4, every
                            exploratory render/sketch page.tsx doesn't import, and the
                            standalone HTML/CSS prototype need-scene.tsx was built from).
                            cstrider-source/ is Maritime HMI's: the portfolio .pptx plus
                            the original PNG screens and renders. It lived in public/ at
                            first, which would have had Vercel serve the .pptx publicly.
                            kenya-photo-originals/ is Post Harvest's: a handful of RAW (.ARW) +
                            JPEG field-photo originals, most already processed into
                            public/post-harvest/photo/*.webp. Kept for history, not wired into
                            the site — see CHANGELOG.md.
```

## Open items Sylvia still needs to supply

These currently ship as flagged placeholders (grep for `TODO(sylvia)`):

- Real contact email + social links (LinkedIn/Instagram hrefs are currently placeholder root URLs)
- Real CV link/file
- Real testimonials (3 placeholder slots currently in `app/data/testimonials.ts`)
- Real per-project tags for the hover ticker on each project card (`PLACEHOLDER_TAGS` in
  `app/data/projects.ts`, used by `ProjectCard.tsx`'s hover-reveal tag ticker) — Post Harvest's
  card already has its own real tags (`["Field research", "Concept development", "2024"]`);
  Maritime has real tags too; HALOGRIP and the Truck coming-soon card still use placeholders
- Whether the 2018–2019 "Bachelor Thesis Student · Apple" entry (seen in the Framer reference) is
  real — it looked like unedited template filler and was deliberately omitted from
  `app/data/experience.ts`
- Confirm intended assignment of the still-unused `Namnlös design (1).jpg` (grey concept car
  render), left in `public/mainpage picture/` — not wired into any project card yet
- The homepage's logo marquee (`chalmers logo.svg`) markup looks scraped from a web page (purple
  `#6746EB` before recoloring, Tailwind-style classes baked into the SVG) rather than Chalmers'
  official seal — flagging in case it's the wrong sub-brand mark
- Maritime HMI: the actual external traffic-management system remains unavailable. The
  lower-left Fleet screenshot is a labelled stand-in; any future replacement needs matching
  evidence and caption updates. The vessel image is already present, not a missing asset.
- Post Harvest, all in `content.ts` (grep `TODO(sylvia)` there for the exact call sites):
  - Whether the construction handbook was actually delivered to farmers is unconfirmed (Sylvia
    believes it probably was, but was not the teammate responsible) — if confirmed, it becomes a
    statable fact belonging in section 09 beside `status.completed.items`
  - A properly-exported roof-drying photo, if one turns up, would replace the current
    interview-bowl photo in the needs-mosaic's lead slot (`focus.captions.grain`)

The former interview-attribution question B is marked resolved in `content.ts`; do not reopen
it from the old Phase 2 plan. Preserve the handbook as primary deliverable, each tray's
81 × 70 × 2.5 cm dimensions, and the approximately 100 kg calculated batch across ten trays.
The 18-row evidence table distinguishes observations, calculations, intentions and untested
claims; its historical 13/18 review marks are not successful performance tests.

## Verification and known test drift

- `node --test scripts/halogrip-lifecycle.test.cjs`: six passing lifecycle tests on 2026-09-12.
  These cover pin coordination and cancellation, not visual loading or browser interaction.
- Run `npx tsc --noEmit --incremental false` and `npm run build` for implementation changes.
  Build first before `node --test scripts/maritime-regression.test.cjs`, which reads `.next` HTML.
- Documentation-sync recheck on 2026-09-12 used existing build artifacts, without rebuilding:
  13 tests total, 11 passed, two failed. The Maritime script still expects a fourth chapter
  `prototype-validation` and `CASE STUDY 001` in HALOGRIP's server HTML. Current source has
  three chapters and a blank initial HALOGRIP shell. Update those assertions in a test-fix
  task; do not restore retired UI to satisfy them. The tests were not changed in this pass.
- Browser discovery in the implementation passes found no connected session. Cold-load
  flicker, failure/resize paths, navigation, keyboard/touch dialogs, mobile layout and FPS
  remain browser acceptance checks, not claimed passes. See [HALOGRIP debug notes](docs/halogrip-debug.md).

## Deployment

- Configured for **Vercel**, with https://sylviaxie.vercel.app as the metadata URL (renamed from
  `halogrip-portfolio.vercel.app` — HALOGRIP is one case-study project, not the whole site;
  Sylvia asked for the site-level project/repo/domain to say "Sylvia Xie", not "HALOGRIP". The
  old `halogrip-portfolio.vercel.app` domain was deliberately **not** kept as a redirect, per
  Sylvia's explicit choice — old links to it will break.)
- Source pushed to GitHub: `sylvia990317-bot/sylviaxie` (renamed from `halogrip-portfolio` in the
  same pass — GitHub auto-redirects the old repo URL, so this rename is low-risk unlike the
  Vercel domain one above)
- Last recorded setup: GitHub → Vercel auto-deploy-on-push was not connected, and deployment
  used `vercel --prod --yes`. Recheck the actual integration and target before a requested
  deployment; the 2026-09-12 documentation update did not verify external state or publish.

## Change history

Detailed session-by-session notes (what changed, why, how it was verified) live in
`CHANGELOG.md` in this same directory — not auto-loaded, so it doesn't cost context on
every session. Read it when you need the rationale behind an existing decision or an
asset's history; add new entries there (not here) when finishing a session with notable
changes.
