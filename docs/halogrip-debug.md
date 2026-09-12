# HALOGRIP debug implementation — 2026-09-10

Scope: `/work/halogrip`, preview `http://localhost:3005/work/halogrip`.
Preserve the opening's original poses, lighting, model quality and `+=750%` scroll length.

## Implemented

- Opening 3D uses demand rendering, invalidated by the GSAP timeline, Canvas resize and
  visibility restoration. Scrub updates continue requesting frames after the pin releases;
  idle frames no longer render continuously. Rotated silhouette bounds are cached until
  pitch, yaw or roll changes.
- The actual static hero stays visible while the model loads. Pin creation waits for model
  readiness. A 15-second loading timeout, render error boundary and WebGL context-loss
  handler switch back to the static hero. Width and reduced-motion changes update the mode.
- Pin readiness is owned by a page provider. Cancelling a subscriber cancels both its
  fallback deadline and queued delivery. Section readiness schedules a coalesced refresh.
- Design-gap progress is now an actual scrubbed tween, rather than reading raw trigger
  progress despite declaring `scrub: 1`. Full-screen animated blur is removed. Nodes and
  connector shafts move through transforms; collapsed connectors are hidden. Crossfades
  retain an opaque base image to prevent opacity stacking from darkening the transition.
- The design-gap static fallback is server-rendered. Section reveals fail open, including
  above-fold content and unsupported observers. On desktop, the concept carousel keeps its
  original zero-size measurement state until `ResizeObserver` calculates the space available
  between its heading and caption. The close button observes sections added after hydration.
- The sketch dialog's lifecycle depends on open/closed state, not the selected slide.
  Previous, close and next controls belong to one focus trap; background elements become
  inert. Scroll lock and focus return no longer reset when cycling sketches.
- Carousel transitions overwrite/cancel previous tweens. Functional index changes handle
  rapid navigation, endpoints stay disabled, and the active caption is announced.
- A follow-up visual regression restored the concept carousel's original desktop sizing after
  a `70vw` fallback made the sketches too large. Its existing 0.6-second position, rotation,
  scale and opacity animation remains intact. The design-gap blur removal and updated 2D
  interaction angles were intentionally retained.
- Narrative distinguishes four concept families from five sketches (4A/4B), matrix
  shortlisting of 2 and 4B from interview selection of 2, B-pillar entry identification from
  dashboard steering-device activation, and design constraints/targets from validation.
  `DECELERATION` spelling and the 2D brake illustration's neutral pose are corrected.

## Evidence and limits

The concept-selection sequence follows the original presentation's evaluation slide (17).
CAD / printed model evidence is shown in slide 4; the two authorization locations are
distinguished in slide 39. This does not establish vehicle-level safety or performance.
The existing source TODO for the 74-disruptions statistic remains unresolved.

The GLB is 15,595,032 bytes, with 21 meshes, 13 materials and approximately 70,110 triangles.
The largest embedded PNG is 2742 × 2673 pixels. Asset quality was preserved; loading/decode
and GPU cost remain candidates for measurement before any texture or geometry reduction.

## Verification

- `node --test scripts/halogrip-lifecycle.test.cjs`: six passing tests covering cancellation
  before/after readiness, multiple dependencies, single deadline delivery, page isolation,
  and unsubscribe before dependency readiness.
- `npx tsc --noEmit --incremental false`: passed during implementation.
- `npm run build`: production compilation, TypeScript and static generation passed.
- Browser runtime returned no available browser sessions. No FPS, visual, mobile or keyboard
  results are claimed from browser execution in this implementation pass.
- Port 3005 was an existing `next start` process serving an older in-memory build. Restarted
  that project's preview after rebuilding. HTTP verification returned 200 and confirmed the
  new concept heading, server-rendered design-gap fallback and validation-boundary copy.
- After the carousel-size correction, the six lifecycle tests, TypeScript check and production
  build passed again. Port 3005 was restarted and returned HTTP 200 with the updated page.

## Browser regression checklist still to run

1. Desktop opening: cold load, slow load, blocked GLB, WebGL context loss, rapid forward and
   reverse scrolling, idle CPU/GPU, tab hide/restore, and the final scrub frames after release.
2. Navigate away/back repeatedly, including during loading; inspect duplicate pins, detached
   animations and console errors. Test deep anchors before and after model readiness.
3. Resize across 760px and toggle reduced motion while viewing either pinned sequence.
4. Modal: repeated next/previous, Tab and Shift+Tab cycling all three controls, Escape,
   background inertness, and focus returning to the originating sketch without scrolling.
5. Carousel: rapid alternating clicks and arrow keys, endpoint disabled states, captions.
6. Desktop 1363 × 936 and a narrow phone viewport: overflow, clipped copy, blank scroll
   regions, image transitions and all links.

No production deployment is included.
