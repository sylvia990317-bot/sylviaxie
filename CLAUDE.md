# CLAUDE.md

Rules and context for working on Sylvia Xie's portfolio site. Read this before making changes.

## What this project is

A Next.js 16 (App Router) + React 19 + TypeScript portfolio site for Sylvia Xie, an industrial
designer. It has two kinds of pages:

- **`/` — the homepage.** A general portfolio landing page (hero, project grid, about,
  experience, testimonials, contact) styled to match Sylvia's Framer reference site
  (https://sylviaxie.framer.website/).
- **`/work/<slug>` — individual project case-study pages.** Each one is a self-contained,
  bespoke-designed page for a single project. Two so far:
  - `/work/halogrip` — an emergency steering wheel concept for autonomous vehicles, a
    master's thesis with Autoliv/Chalmers. Red/black/Koulen-and-Roboto-Mono.
  - `/work/post-harvest` — a solar maize-drying tower for smallholder farmers in Seme,
    Kenya, an MSc Industrial Design Engineering project with architecture students
    (Reality Studio, Chalmers, 2024). Editorial/documentary: Bodoni Moda serif + Geist
    sans, blue accent, ten numbered chapters (`chapterLabel()` in `content.ts`) reading
    01 Hero through 10 Reflection.

More project pages will be added over time as Sylvia has content for them.

## Hard rules — read before touching styles or structure

1. **Each project case-study page keeps its own bespoke visual style.** Do not unify
   `/work/halogrip`, `/work/post-harvest` (or future project pages) into the homepage's design
   system, or into each other. This was an explicit decision from Sylvia. HALOGRIP is
   red/black/Koulen-and-Roboto-Mono on purpose (see CHANGELOG.md — swapped from Nimbus Sans
   Narrow/DejaVu Sans Mono in an earlier session); Post Harvest is Bodoni Moda/Geist with a blue
   accent, on purpose too — leave each alone unless Sylvia asks to redesign that specific page.
   One narrow, explicitly-approved exception: Post Harvest's wide-container mechanism
   (`--shell`/`.ph-shell` in `post-harvest.css`) is a deliberate structural mirror of HALOGRIP's
   own `.shell`/`--gutter` pattern in `halogrip.css`, at HALOGRIP's own numbers — Sylvia asked
   for that specific cross-project reference (see CHANGELOG.md, "measured against HALOGRIP
   directly"). That is a layout/sizing borrow, not a visual-style unification (type, colour and
   voice stayed Post Harvest's own) — don't read it as license to unify anything else the two
   pages share just because this one mechanism was intentionally matched.
2. **CSS isolation is load-bearing, not incidental.** `app/globals.css` is shared across every
   route (Tailwind import + `@theme` tokens + a minimal reset). `app/work/halogrip/halogrip.css`
   and `app/work/post-harvest/post-harvest.css` are each imported *only* from their own route's
   `page.tsx` — Next.js code-splits them per route, so neither ever loads on `/` or on each
   other's route. When adding a new project page with its own custom CSS, follow the same
   pattern: a route-scoped `<slug>.css` imported only from that route's `page.tsx`, never added to
   `globals.css`.
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
                             1:1 from Sylvia's PowerPoint reference — see CHANGELOG.md
      need-scene.tsx         02.2 / REAL-WORLD NEED — one-shot route-line draw-in synced to
                             the annotations/frame/stat, see CHANGELOG.md
      close-project-button.tsx Client component for the fixed top-right pill — IntersectionObserver
                             toggles a dark/light opaque state to match whatever section is
                             behind it, see CHANGELOG.md
    post-harvest/
      page.tsx              Post Harvest case study — own `metadata` export, own CSS import,
                             10 numbered chapters (see `content.ts`'s `sections`/`chapterLabel`)
      post-harvest.css      Post Harvest-only styles (`--canvas`/`--shell` width tokens, all
                             component classes) — see CLAUDE.md hard rule 7 for the three
                             container widths, and CHANGELOG.md for why each exists
      content.ts             All page copy, evidence-sourced (each factual claim carries an
                             `Evidence` tag and a booklet page number — see the file's own
                             header comment). Edit copy here, not in page.tsx
      handbook-pages.ts      Page list for the in-page handbook reader (see below)
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
      scroll-steps.tsx        Client component, GSAP ScrollTrigger-driven step tracker for
                             section 04's scrollytelling stage (one trigger per step, a fixed
                             48% reading line, no pin/scrub) — see CHANGELOG.md for why this
                             replaced an earlier IntersectionObserver version
public/
  media/                   HALOGRIP's images (kept flat at /media/*.webp; not yet reorganized
                            per-project since it predates post-harvest/'s per-project layout)
  post-harvest/             Post Harvest's images, already organized per-project (unlike
                            media/ above): concept/, diagram/ (includes the inlined SVGs
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
  HALOGRIP's card still uses `PLACEHOLDER_TAGS`
- Whether the 2018–2019 "Bachelor Thesis Student · Apple" entry (seen in the Framer reference) is
  real — it looked like unedited template filler and was deliberately omitted from
  `app/data/experience.ts`
- Confirm intended assignment of the still-unused `Namnlös design (1).jpg` (grey concept car
  render), left in `public/mainpage picture/` — not wired into any project card yet
- The homepage's logo marquee (`chalmers logo.svg`) markup looks scraped from a web page (purple
  `#6746EB` before recoloring, Tailwind-style classes baked into the SVG) rather than Chalmers'
  official seal — flagging in case it's the wrong sub-brand mark
- Post Harvest, all in `content.ts` (grep `TODO(sylvia)` there for the exact call sites):
  - `field.contribution`'s attribution to Apollo is sourced from a portfolio deck, not the
    booklet — needs confirming ("Open question B" in the file's own comment)
  - Whether the construction handbook was actually delivered to farmers is unconfirmed (Sylvia
    believes it probably was, but was not the teammate responsible) — if confirmed, it becomes a
    statable fact belonging in section 09 beside `status.completed.items`
  - A properly-exported roof-drying photo, if one turns up, would replace the current
    interview-bowl photo in the needs-mosaic's lead slot (`focus.captions.grain`)
  - A surviving sketch of the round-one storage concept (mentioned in the report, no image in
    the asset set) would let section 04's "method check" become something shown, not just told

## Deployment

- Hosted on **Vercel**, live at https://sylviaxie.vercel.app (renamed from
  `halogrip-portfolio.vercel.app` — HALOGRIP is one case-study project, not the whole site;
  Sylvia asked for the site-level project/repo/domain to say "Sylvia Xie", not "HALOGRIP". The
  old `halogrip-portfolio.vercel.app` domain was deliberately **not** kept as a redirect, per
  Sylvia's explicit choice — old links to it will break.)
- Source pushed to GitHub: `sylvia990317-bot/sylviaxie` (renamed from `halogrip-portfolio` in the
  same pass — GitHub auto-redirects the old repo URL, so this rename is low-risk unlike the
  Vercel domain one above)
- GitHub → Vercel auto-deploy-on-push is **not yet connected** (Vercel account needs a GitHub
  login connection added manually in the Vercel dashboard first). Until then, deploy manually
  from this directory with `vercel --prod --yes`.

## Change history

Detailed session-by-session notes (what changed, why, how it was verified) live in
`CHANGELOG.md` in this same directory — not auto-loaded, so it doesn't cost context on
every session. Read it when you need the rationale behind an existing decision or an
asset's history; add new entries there (not here) when finishing a session with notable
changes.
