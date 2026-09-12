/**
 * Maritime HMI (CSTRIDER) — all page copy lives here, not in page.tsx.
 * Same convention as app/work/post-harvest/content.ts.
 *
 * SOURCING RULE for this page: every functional claim about a screen comes from Sylvia's
 * own CSTRIDER portfolio deck (design-source/cstrider-source/portfolio cstrider.pptx) or
 * is visible in the screenshots themselves. Nothing about the interface is inferred.
 *
 * DELIBERATE VAGUENESS, not a gap to fill: the demo audience is described only as
 * "a range of maritime experts". CSTRIDER does not allow the participants or their
 * organisations to be named. Do not add detail here later thinking it was an oversight.
 */

export const project = {
  eyebrow: "Case study 002",
  client: "CSTRIDER / 2025–2026",
  title: "Maritime HMI",
  descriptor: "Six autonomous ferries, run from a container.",
  lede:
    "A remote operations centre for small self-driving passenger vessels, designed at Chalmers and built out at CSTRIDER.",
  heroAlt:
    "Interior of the CSTRIDER remote operations centre: two operator desks facing a wall of screens",
};

export const meta = {
  heading: "From a course project to an interactive prototype",
  heroFacts: [
    { k: "Deliverable", v: "Remote operations interface & prototype" },
    { k: "Context", v: "Chalmers project course & CSTRIDER internship" },
    { k: "Client", v: "CSTRIDER" },
    { k: "Period", v: "Sep 2025 to Jun 2026" },
  ],
  /** Sylvia's own account of the project, split into its three real stages. */
  body: [
    "This started as a project course at Chalmers. Together with my teammates I designed a system for CSTRIDER for controlling and monitoring a fleet of self-driving autonomous passenger vessels, each carrying up to twelve people.",
    "After the course ended I continued at CSTRIDER, where I refined the design that came out of the course and built it into an interactive prototype.",
    "The prototype was demonstrated and tested in a demo session with a range of maritime experts. The screens on this page are the ones that came out of that internship.",
  ],
  /** Right-hand metadata rail. Dates confirmed by Sylvia. */
  facts: [
    { k: "Client", v: "CSTRIDER" },
    { k: "Project course", v: "Sep 2025 to Jan 2026" },
    { k: "Internship", v: "Jan 2026 to Jun 2026" },
    { k: "Role", v: "Interface design, interactive prototype" },
    { k: "Tested with", v: "Maritime experts, demo session" },
  ],
};

export const idea = {
  heading: "The centre is the product",
  body: [
    "A CSTRIDER remote operations centre is not a building. It is a standard 20 ft container, fitted out and delivered as one unit.",
    "An operator sits inside it and runs vessels that may be nowhere near. A customer orders the container, puts it where it suits them, and monitors their own fleet from there.",
  ],
  /** Alt text for the wide interior render used beside this section. */
  figureAlt:
    "A green CSTRIDER autonomous passenger ferry travelling through a marina",
};

export const layout = {
  heading: "What is inside the container",
  body:
    "Two operator stations face a shared wall. Each operator runs three vessels. The wall screen belongs to neither of them: it gives both operators the same overview, including basic awareness of the vessels currently under the other operator's control.",
  figureAlt:
    "Front view of the CSTRIDER operations centre showing two five-display operator stations and a shared wall screen",
  /** Real, from the deck and the brief. No invented precision. */
  numbers: [
    { v: "20 ft", k: "Standard container" },
    { v: "2", k: "Operator stations" },
    { v: "3", k: "Vessels per operator" },
    { v: "12", k: "Passengers per vessel" },
  ],
};

/** Keep the source slide intact and explicitly distinguish its course-era route
 * from the later internship screenshots. Its timings apply only to that scenario. */
export const scenario = {
  title: "Course scenario / Järntorget–Lindholmen",
  body:
    "The course scenario places the remote operations centre beside the ferry route, giving two operators a direct view of the vessels. Each supervises three vessels, while an onboard host assists passengers.",
  caption:
    "Original course scenario: Järntorget–Lindholmen. The five-minute round trip and 0.2 nautical mile distance belong to this scenario.",
  src: "/maritime-hmi/scenario/portfolio-slide-6.webp",
  alt: "Course scenario showing the Järntorget to Lindholmen route, a five-stage virtual bridge timeline, and two operators supervising three vessels each",
  w: 2400,
  h: 1350,
  facts: [
    { k: "Round trip", v: "5 min" },
    { k: "Distance", v: "0.2 nm" },
    { k: "Per operator", v: "3 vessels" },
  ],
};

export const chapters = [
  { n: "01", id: "overview", label: "Overview" },
  { n: "02", id: "operating-model", label: "Operating model" },
  { n: "03", id: "interface-system", label: "Interface system" },
] as const;

export const screens = {
  eyebrow: "Internship prototype",
  introduction: "The following screens come from the CSTRIDER internship prototype and show Koön–Marstrand, a different route from the earlier course scenario above.",
  heading: "Five screens, three jobs",
  overview: {
    src: "/maritime-hmi/roc/station-five-screens-2560.webp",
    w: 2560,
    h: 1440,
    alt: "One CSTRIDER operator station with three vessel displays above a fleet view and docking control display",
    caption:
      "One operator works across five displays: three persistent vessel views above, with fleet awareness and active docking controls below.",
    groups: [
      {
        id: "single-vessel",
        label: "Single-vessel view",
        detail: "Three vessels monitored in parallel",
      },
      {
        id: "fleet-route",
        label: "Fleet overview / route planning",
        detail: "External system",
      },
      {
        id: "docking",
        label: "Docking / undocking",
        detail: "Focused control for the active vessel",
      },
    ],
  },
  items: [
    {
      id: "vessel-view",
      // Coordinates locate desktop markers; the same notes remain below images on mobile.
      notes: [
        { x: 2.7, y: 28, label: "Camera views", detail: "Port, centre and starboard, from the bow" },
        { x: 2.7, y: 65, label: "Cabin camera", detail: "Inside the passenger cabin" },
        { x: 2.7, y: 88.4, label: "Journey progress bar", detail: "Where the vessel is in its round trip" },
        { x: 97, y: 64, label: "Safe corridor", detail: "Green is safe, yellow warns, red is danger" },
        { x: 45, y: 57, label: "Technical information", detail: "Battery, pitch and roll, motor load, speed, link to the operations centre" },
        { x: 63, y: 38, label: "Camera position", detail: "Where on the vessel that feed comes from" },
      ],
      src: "/maritime-hmi/screen/vessel-view.webp",
      w: 3168,
      h: 1768,
      order: 1,
      name: "Upper displays",
      role: "Vessel view",
      body:
        "A backburner view. Its job is to hold situational awareness across every vessel at an individual level without asking for attention, so an operator can keep half an eye on it while working somewhere else.",
      alt: "Vessel view screen: three forward camera feeds, a cabin camera, and technical readouts for Ferry 1",
    },
    {
      id: "docking-alarm",
      // Callouts from slide 5 of the source deck.
      notes: [
        { x: 14, y: 2.4, label: "Name of docking ferry", detail: "Which vessel this screen is driving" },
        { x: 36, y: 7, label: "Docking assist view", detail: "Approach line and heading into the berth" },
        { x: 63, y: 3, label: "Camera views", detail: "Cabin, fore and aft" },
        { x: 1.5, y: 50, label: "Safety checklist", detail: "Runs automatically through the docking sequence" },
        { x: 1.6, y: 83.5, label: "Reopen and close doors", detail: "Doors open for off-boarding and boarding, and can be closed early" },
        { x: 15.2, y: 83.5, label: "Initiate departure", detail: "Committed with a slide, not a click" },
        { x: 99, y: 25, label: "Alarm list", detail: "All three vessels, not just this one" },
        { x: 99, y: 78, label: "Emergency panel", detail: "Slide to activate" },
      ],
      src: "/maritime-hmi/screen/docking-alarm.webp",
      w: 3835,
      h: 1570,
      order: 3,
      name: "Lower-right display",
      role: "Docking and alarm",
      body:
        "The task screen. The split down the middle is the point: the left side is task-focused information for the vessel being docked, the right side is global, carrying alarms for all three vessels and the emergency controls.",
      alt: "Docking screen: automatic safety checklist, docking assist view, camera feeds, alarm list and emergency panel",
    },
    {
      id: "fleet-view",
      /* A quiet reading rail rather than callouts on the image. The fleet screenshot must
         remain completely untouched; these four notes describe it in reading order. */
      notes: [
        { x: 8, y: 27, label: "Assigned ferries", detail: "Primary vessels, battery and connection." },
        { x: 8, y: 63, label: "Other ferries", detail: "Awareness beyond the operator’s own vessels." },
        { x: 53, y: 56, label: "Live positions", detail: "Every vessel’s current route position." },
        { x: 22, y: 3, label: "Route status", detail: "The active route is persistently visible." },
      ],
      src: "/maritime-hmi/screen/fleet-view.webp",
      w: 3816,
      h: 1826,
      order: 2,
      name: "Lower-left display",
      role: "Fleet view / route planning",
      /* Sylvia, on what this screen actually is: this position is meant to carry an external
         traffic-management system, and there was not one to show. So she built this
         simplified stand-in. The page has to say that, or it reads as a designed deliverable. */
      body:
        "This is not the final fleet-management interface. The display was intended to carry an external traffic-management system that was not yet available, so I built this simplified placeholder for the prototype. It tests the information hierarchy only: assigned and other ferries, live positions and persistent route status.",
      alt: "Fleet view screen: vessel list with battery and signal state beside a chart of the Koön to Marstrand route",
    },
  ],
};

/** The deck's Safetyheaven explainer (slide 4), which reads the safe-corridor indicator
 *  in three states. The two "outside box" states only exist in the deck, so they are cropped
 *  from a 7680px slide export; the "stay in box" state was cropped from Sylvia's own
 *  screenshot instead, which carries it at higher fidelity than the deck does. Wording is
 *  the deck's own. */
export const corridor = {
  heading: "Reading the safe corridor",
  body:
    "The indicator answers two questions at once, and the colour says how bad it is: green is safe, yellow is a warning, red is danger.",
  states: [
    {
      src: "/maritime-hmi/corridor/stay-in-box.webp",
      name: "Stay in box",
      body: "In time, and inside the operational area.",
      alt: "Safe corridor indicator with the vessel inside a green box",
    },
    {
      src: "/maritime-hmi/corridor/sideways-warning-matched.webp",
      name: "Outside the box, sideways",
      body: "Outside the operational area.",
      alt: "Safe corridor indicator with the vessel displaced sideways out of the box, shown yellow",
    },
    {
      src: "/maritime-hmi/corridor/outside-vertical-v2.webp",
      name: "Outside the box, lengthways",
      body: "Not aligned with the timetable.",
      alt: "Safe corridor indicator with the vessel displaced along the box, shown yellow",
    },
  ],
};

export const backLink = { href: "/", label: "Close project" };
