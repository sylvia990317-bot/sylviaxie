/**
 * Post Harvest — all visible copy, with the provenance of every factual claim.
 *
 * Sources: docs/kenya-case-audit.md (claim table, §5) and docs/kenya-content-plan.md.
 * `p` numbers refer to PDF pages of references/kenya/full-booklet/BOOKLET final.pdf.
 *
 * Rules enforced here (see docs/kenya-content-plan.md):
 *  - no em dashes in visible strings
 *  - "maize" never "corn"
 *  - nothing is stated as a measured or validated result, because none exists
 *
 * VISUAL SALVAGE PASS (approved). Copy that a photograph, drawing or diagram already
 * proves has been cut and converted into captions and labels. What survives as prose is
 * here because no image carries it: numbers, quotes, decisions and qualifications.
 * 535 words across sections 02 to 10 is a ceiling, not a quota. Where a factual
 * qualification needs the words, it keeps them.
 */

import { HANDBOOK_TOTAL } from "./handbook-pages";

/** Evidence class for a factual claim. `validated` is intentionally never used. */
export type Evidence =
  | "observation"
  | "interview"
  | "calculation"
  | "assumption"
  | "feedback"
  | "prototype";

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  observation: "Observation",
  interview: "Interview",
  calculation: "Calculation",
  assumption: "Design assumption",
  feedback: "Concept feedback",
  prototype: "Prototype activity",
};

export const project = {
  title: "Post Harvest",
  headline: "Rethinking maize drying with farmers in Seme",
  subtitle: "A maize drying concept developed with farmers in Seme, western Kenya.",
  concept: "The Drying Tower",
  /**
   * Hero eyebrow row (2026-09-07 hero rebuild). Mirrors HALOGRIP's own hero, where the
   * left eyebrow names the artefact and the right one carries place and year
   * (`[ CASE STUDY 001 ]` … `GOTHENBURG, SE / 2025`). Both strings here are assembled from
   * facts already on the page: the place comes from `context.dateline`, the year from the
   * course dates in `meta` below.
   */
  heroEyebrow: "Case study / Post Harvest",
  heroPlaceYear: "Seme, Kenya / 2024",
};

/**
 * Hero metadata. RE-CUT 2026-09-08 (per Sylvia, reviewing the hero directly).
 *
 * Was five columns (Role / Team / Context / Location / Year). Cut to four:
 *   - Role dropped: worded identically across every project's hero, so on a page read in
 *     isolation it adds no distinguishing information.
 *   - Team dropped, at Sylvia's request.
 *   - Deliverable added, mirroring HALOGRIP's own hero meta pattern (`["Deliverable",
 *     "Fallback steering"]` in app/work/halogrip/content.ts).
 * Context/Location/Year are unchanged from the 2026-09-07 rebuild, which split them out of
 * a single "Context" sentence (course+school -> Context, place -> Location, same place
 * named in `context.dateline`, dates -> Year).
 */
export const meta: [string, string][] = [
  ["Deliverable", "Solar maize drying tower"],
  ["Context", "MSc Industrial Design Engineering, Chalmers. Reality Studio."],
  ["Location", "Seme, Kisumu County, Kenya"],
  ["Year", "April to June 2024"],
];

/**
 * 02. Context.
 *
 * The course description and the assignment sentence are both gone from here. The course
 * is a dateline; the assignment is an annotation on the lifecycle diagram in section 04,
 * where it does actual work against the finding. What is left is the place and two
 * numbers, because a photograph cannot carry a number.
 */
export const context = {
  heading: "Where this happened",
  dateline: "Seme, Kisumu County, Kenya. April to May 2024.",
  lead:
    "Seme is a rural farming sub-county in western Kenya, on the north east shore of Lake Victoria. Maize is the crop most households depend on, for food and for income.",
  /**
   * Reordered and ranked (Sylvia, 2026-09-07, visual-hierarchy audit). The loss figure is
   * the reason this project exists, and it was set at the same weight as the population
   * count and placed second, so the section's actual argument was the smaller half of a
   * two-up row while the locator map took the visual lead. `lead: true` marks the one
   * statistic allowed to be large; the population figure stays, as scale for the place,
   * but at supporting size.
   */
  stats: [
    {
      value: "up to 30%",
      label: "of Kenya's key cereals lost within six months of harvest",
      cite: "World Bank et al., 2011",
      lead: true,
    },
    {
      value: "122,000",
      label: "people in Seme sub-county, about 450 per square kilometre",
      cite: "City Population, 2019",
    },
  ] as { value: string; label: string; cite: string; lead?: boolean }[],
  /** Captions carry what the paragraphs used to say. */
  captions: {
    locator: "Seme sits on the north east shore of the Winam Gulf, at the western tip of Kisumu County. Siaya County is its neighbour to the west.",
    road: "The road into Seme.",
    /**
     * RENAMED from `roof` (Sylvia, 2026-09-07). The roof-drying photo behind this caption
     * turned out to be a low-resolution camera preview, not a real export (see the note at
     * its call site in page.tsx); Sylvia replaced it with a sharp photo of a different
     * moment, a bowl of grain shown during an interview, so the caption is rewritten to
     * describe what is actually in that photo rather than a roof that is no longer
     * pictured. TODO(sylvia): if a properly exported roof-drying photo turns up later, it
     * can go back in the mosaic's lead slot, and this key can revert to describing it.
     */
    grain: "Grain from the harvest, shown during an interview.",
    planting: "Planting by hand, the start of the same year's harvest.",
  },
};

/**
 * 03. Learning in the field.
 *
 * Photography leads. The team walking in and sitting with farmers is the evidence of
 * field participation; the five portraits support it rather than replacing it.
 *
 * `run` (2026-09-09, per Sylvia directly) is the actual method narrative: two primary
 * beats (informal first visits, then the patterns that shaped a structured interview
 * guide). `role` is a short, quieter attribution note rendered alongside it in
 * `.ph-fieldnote` -- deliberately compact, not a second retelling of `run`'s content.
 * The camera anecdote that used to sit here (2026-09-09) was cut: Sylvia felt it read
 * as contextless next to the real method narrative and added too little.
 */
export const field = {
  heading: "Learning in the field",
  lead: "Three visits over five weeks. Apollo, a local handcraft and agriculture expert, introduced us to the community.",
  /**
   * The two primary "how it ran" beats (2026-09-09, per Sylvia directly, replacing the
   * six-date field-timeline.svg, which she felt carried little practical meaning).
   * Labels are headings, not sentences, so no full stop -- same convention as
   * `beats.people`/`beats.method` below.
   */
  run: [
    {
      label: "We started broad",
      text: "Our first visits were informal. We walked between homesteads in Seme and talked with farmers about their everyday routines, crops, storage and the problems they encountered along the way.",
    },
    {
      label: "Patterns gradually emerged",
      text: "Although many farmers grew similar crops, their circumstances differed considerably. Access to water, animals, tools and storage varied from household to household. As recurring issues became clearer, I turned them into a more structured interview guide for the following visits.",
    },
  ] as { label: string; text: string }[],
  /**
   * Secondary, quieter than `run` above -- kept short on purpose (2026-09-09, per
   * Sylvia) since the structured-interview-guide detail is already told in `run`, not
   * repeated here. Confirmed by Sylvia directly in session, replacing the earlier
   * pending-confirmation wording sourced only to a portfolio deck
   * (`docs/kenya-content-plan.md`, "Open question B", now resolved).
   */
  role:
    "I led the farmer interviews, while my teammates documented the sessions and took notes.",
  /**
   * Two beats (2026-09-07): the five farmers, then how the fieldwork ran. `portraits`
   * below heads the first beat, so only the second needs a new string. Same device
   * section 05 already uses for its two beats.
   */
  beats: {
    /* No full stop on either: these are headings now, not the sentence-case caption
       `captions.portraits` used to be when it labelled a small support strip. */
    people: "The five farmers who took part",
    method: "How the fieldwork ran",
  },
  captions: {
    walking: "Walking in to a homestead in Seme with Apollo.",
    team: "Sitting with farmers. Interviews began structured, then loosened as we learned what to ask.",
  },
  quote: {
    text:
      "During a great harvest season, I could produce one bag of beans, but I could only harvest a half bag in time.",
    attribution: "Theresa",
    page: 27,
  },
};

/** Participants. Names are Sylvia's confirmed canonical spellings (audit §4.2). */
export const participants: {
  name: string;
  slug: string;
  note: string;
  evidence: Evidence;
  page: number;
}[] = [
  {
    // Report p.16 gives Theresa her own biography, which the older booklet had misaligned.
    // Her difference comes from knowledge, which is exactly the section 04 finding.
    name: "Theresa",
    slug: "theresa",
    note: "Attends One Acre Fund meetings. Does not have the weevil and theft problems the others describe.",
    evidence: "observation",
    page: 16,
  },
  { name: "Christine", slug: "christine", note: "Fetches water from a lake an hour away.", evidence: "interview", page: 27 },
  { name: "Magarite", slug: "magarite", note: "Runs her farm largely by herself.", evidence: "interview", page: 17 },
  { name: "Jakob", slug: "jakob", note: "Ran out of safe space to store his harvest.", evidence: "interview", page: 26 },
  { name: "Philister", slug: "philister", note: "Narrow mud paths make the harvest hard to move.", evidence: "interview", page: 26 },
];

/**
 * 04. Finding the focus.
 *
 * THE BAGS HAVE TO BE NAMED. The section's whole finding is that a working storage
 * product already existed and was being misused, so "the bags" cannot appear without an
 * antecedent. Sources: report p.15 (One Acre Fund supplies PICS bags), p.24 (they are
 * Purdue Improved Crop Storage bags, non-chemical, up to three years if handled
 * properly, and farmers wrongly believed they lost potency after a season or two) and
 * p.28 (Theresa followed the instructions and was the only one of the five without a
 * weevil problem). A photograph of a PICS bag in Seme was found and is now shown
 * (pics-bag-1400.webp); this stale note previously said none existed.
 *
 * `body` was trimmed to one paragraph (2026-09-09, per Sylvia, layout pass on the
 * scrollytelling stage): the second paragraph this step used to carry ("the group was
 * not uniform... a storage concept was carried into the first farmer evaluation to test
 * that conclusion") is a real, sourced claim (report p.24: "We still decided to provide
 * one of the concepts for storage in idea evaluation with the farmers, and the thought
 * was confirmed"), but it's a secondary methodological aside next to this step's actual
 * thesis (the knowledge gap), and nothing later in section 04 depends on it appearing
 * here. Cut, not rewritten -- if it needs a home later, the quote above is its source.
 */
export const focus = {
  heading: "Finding the focus",
  lead: "We were assigned grain storage. The research pointed somewhere else.",
  /** Named AND shown: Sylvia photographed one of these bags in Seme. */
  bags: {
    label: "The storage product that already existed",
    text: "One Acre Fund supplies farmers in Seme with PICS bags, airtight sacks that protect grain without chemicals and last about three years if they are used as instructed.",
    caption: "A PICS bag in Seme. The printing on it reads Purdue Improved Crop Storage, 100 kg.",
    page: 15,
  },
  body: "Most farmers believed the bags lost their potency after a season or two, so they were not using them as intended. Theresa followed the instructions, and she was the only one of the five without a weevil problem. The gap was knowledge, not hardware.",
  captions: {
    /** Step 02's own `.ph-lbl` heading, same role as `bags.label` / `redirect.label` for
     * steps 01/03 -- added on request, reusing the needs-map diagram's own title
     * ("Expressed vs latent need") rather than writing new copy. */
    needsLabel: "Expressed vs latent need",
    /** No "Booklet p.21" here or in the diagram's own corner label (2026-09-09, Sylvia:
     * readers never see the physical booklet and have no way to know one exists, so a
     * page citation to it is meaningless to them -- source, p.21, still lives in this
     * comment for anyone maintaining the copy, just not in anything rendered). */
    needs: "Needs from the interviews, sorted into what farmers said and what they did not.",
    cycle: "Drying is one stage of six, and the stage where the harvest is most exposed.",
  },
  /**
   * The sentence the maize-year drawing exists to make. It used to be carried only by the
   * two annotations inside the SVG ("The brief we were given" / "Where the research
   * pointed"), which meant the section's turn was legible only to a reader who studied the
   * drawing. Stated as page copy, it lets the drawing be sized as a closing figure rather
   * than as a second full-width argument (2026-09-07).
   */
  redirect: {
    label: "The turn",
    text: "So we moved upstream. Storage was the brief, but the losses were already decided one stage earlier, while the maize was drying.",
  },
};

/**
 * 05. Defining the challenge.
 *
 * The four vignettes state the problem and the photograph proves one of them. Each
 * vignette maps 1:1 to a design priority directly beneath it (define-problem-reference
 * pass, 2026-09-08) -- that connection is carried by the shared four-column alignment
 * between `threats` and `priorities` (same order, same width, same gaps), not by an
 * arrow or a restated label. Weevils is a plain fourth column now, not a scaled-down
 * inset behind a divider -- it was never actually a different KIND of problem, just a
 * different DRAWING SCALE (kernel-level, since it's already inside the grain rather than
 * arriving at the tarp), and that distinction reads fine from the drawing and its own
 * caption alone. The requirement list, drawn blank, is a supporting research artifact:
 * presented small, opens full-size on click, and is deliberately not the largest object
 * in this part of the section -- the priorities and the two farmer figures are.
 */
export const challenge = {
  heading: "Defining the challenge",
  lead: "Maize is spread on a tarp on the ground to dry in the sun, and has to come back indoors every evening.",
  /** Two beats, each a single visual argument that fits one viewport. */
  beats: {
    threats: "What threatens maize while it dries",
    needs: "What the design needed to do",
  },
  threatsLabel: "Four problems found",
  /* `w`/`h` are each drawing's true pixel size. They differ, because the originals were
     drawn freehand at different extents, so they must be declared per item: a shared
     placeholder ratio makes the layout size its columns from the images and overflow.
     Weevils keeps its own true size too -- its outer frame matches the other three
     exactly (same `.ph-strip-frame`), only the drawing inside reads smaller, same as the
     scale difference the caption already states in words. */
  threats: [
    { slug: "chicken", name: "Chickens", note: "Eating and contaminating the crop", w: 1200, h: 761 },
    { slug: "theft", name: "Theft", note: "The reason it cannot be left out overnight", w: 1200, h: 981 },
    { slug: "rain", name: "Rain", note: "Arriving without warning", w: 1200, h: 1065 },
    {
      slug: "weevils", name: "Weevils", note: "Already inside the grain", w: 1200, h: 867,
      /* The longer version, kept as an optional detail rather than the default caption --
         it explained the scale change well but was the one item breaking the four-column
         rhythm the other three keep. Not wired to any interaction yet (no hover/click
         affordance exists on this row); kept here as the fuller research note in case a
         future pass adds one. */
      detail: "Drawn at the scale of a single kernel, because this one does not arrive at the tarp. It is already inside the grain, and a door that locks does not stop it.",
    },
  ],
  /** One design priority per threat above, same order and same four-column alignment --
   *  that shared position is the connection, not a restated label or an arrow. */
  priorityLabel: "Design priority",
  priorities: [
    { heading: "Keep animals out" },
    { heading: "Protect from theft" },
    { heading: "Keep rain out" },
    { heading: "Eradicate weevils" },
  ],
  /** The wider framework, left column of the lower composition -- design intentions the
   *  team held, not outcomes the final concept was shown to achieve. */
  context: {
    label: "A wider design context",
    text: "The broader framework also considered one-person use and familiar working practices. These remained design intentions rather than validated outcomes.",
  },
  captions: {
    chickenPhoto: "Maize drying on a tarp in Seme, with the first of those four problems walking across it.",
    /** Sits under the two farmer figures now, not the carrying arithmetic paragraph
     *  (removed, 2026-09-08: it implied the final concept solved carrying/transport,
     *  which was never validated -- see the figures' own caption instead). The figures
     *  illustrate familiar local practice, not proof of improved carrying. */
    figures: "Familiar tools and one-person use informed the wider framework.",
    checklist: "Created before concept work to guide exploration.",
  },
  /** The requirement-list preview, right column of the lower composition.
   * `meta` ("Booklet p.26") removed (2026-09-09, Sylvia): readers never see the physical
   * booklet, so a page citation to it means nothing to them -- source, p.26, is still
   * documented at this object's other citation sites in this file. */
  requirementFramework: {
    label: "The broader requirement framework",
    viewLabel: "View full list ↗",
  },
};

/**
 * 06. Developing with farmers.
 *
 * Rebuilt (2026-09-09) to match a reference layout Sylvia supplied directly
 * (public/post-harvest/photo/"concept development reference.png"): a small fieldwork
 * photo beside the evaluation sequence that caused the method change, then a carousel of
 * the three concepts. Replaces the earlier two-column layout (tall photo, rounds list,
 * annotation-code legend, three-equal-card strip) entirely -- that version is still in git
 * history if any of it is wanted back.
 *
 * The carousel's own copy was simplified a second time (2026-09-09, same session, per
 * Sylvia directly: "太多没有用的内容了... 参考halogrip的[ 05 / CONCEPT EXPLORATION ]的结构"):
 * the first version ran a compact "DRYING TABLE -> CONSISTENT REDRAWING -> DRYING TOWER"
 * process line plus a separate always-visible selected-direction statement beneath the
 * carousel. Both are gone. `options[].name` is now the only copy under each concept
 * (concept-carousel.tsx renders it plainly, mirroring HALOGRIP's own
 * `app/work/halogrip/concept-carousel.tsx`, which names every concept the same quiet way
 * and only calls out the last one). `selected` now holds just the one line that appears
 * when the carousel is cycled to the Drying Tower and the other two concepts fade out --
 * same "reaching the end reveals the decision" beat HALOGRIP's deck uses, not a permanent
 * fixture under the carousel. `options` is ordered table -> box -> tower on purpose: the
 * selected concept has to be last for that reveal to land on arrival, not mid-cycle.
 *
 * The three-step sequence above the carousel (first evaluation / potential bias / method
 * adjustment) is unchanged -- Sylvia's "too much" note was about the carousel's own copy,
 * not this row.
 */
export const concepts = {
  heading: "Developing with farmers",
  lead: "Two evaluations revealed a problem in how the ideas were presented, and changed how we tested them.",
  captions: {
    review: "A farmer reading one of the concept sketches.",
  },
  process: [
    { label: "First evaluation", text: "Different team members presented concepts in different drawing styles." },
    { label: "Potential bias", text: "Representation quality could influence how the ideas were understood.", emphasis: true },
    { label: "Method adjustment", text: "One person redrew all three concepts consistently before the second evaluation." },
  ],
  /**
   * `ratio` (width/height, 2026-09-09) is the new high-res sketches' own untouched
   * camera aspect -- Sylvia supplied the new source photos; resized with sharp, no crop
   * ("为什么裁切这么贴边，按原本的大小来就好，直接放上去": an earlier pass trimmed each
   * photo tight to its drawing bounds, which read as cropped too close to the edge once
   * the carousel frame's own white mat was also removed -- reverted to the plain
   * untrimmed photo instead). All three happen to share one ratio because they were shot
   * the same way, not because it's forced. `concept-carousel.tsx` reads this instead of
   * a single hardcoded width/height for every slug.
   */
  options: [
    { name: "The Drying Table", slug: "table", selected: false, ratio: 760 / 950 },
    { name: "The Drying Box", slug: "box", selected: false, ratio: 760 / 950 },
    { name: "The Drying Tower", slug: "tower", selected: true, ratio: 760 / 950 },
  ],
  selected: {
    eyebrow: "Selected direction",
    note: "Strongest response after all three concepts were redrawn and evaluated consistently.",
  },
};

/**
 * 07. The Drying Tower — Final Concept.
 *
 * DELIVERABLE HIERARCHY (confirmed by Sylvia, 2026-09-02, and the source of truth for
 * this section. See docs/kenya-case-audit.md Resolution log #12):
 *   1. Final concept ............ The Drying Tower
 *   2. Primary deliverable ...... a construction handbook made by the team
 *   3. Handbook's purpose ....... to guide farmers in building the tower locally
 *   4. Physically prototyped .... the metal solar collector only
 *   5. Not completed ............ the full tower, and any real build from the handbook
 *
 * The handbook is the actual design outcome, not a supporting document, and holds the
 * dominant visual slot. Sources: booklet p.36 and p.44, TOC p.3 (HANDBOOK, printed p.49),
 * and Desktop - 11.pdf. Do NOT add claims about local material sourcing, independence,
 * affordability or successful replication: none are supported. Use "build" or
 * "construct", never "rebuild".
 */
export const finalConcept = {
  /** Rendered as an eyebrow above the heading, not beside or beneath it (Sylvia, 2026-09-07). */
  label: "Final Concept",
  /**
   * Third name for this section (Sylvia, 2026-09-07). It was "The Drying Tower", which read
   * as a product name and never said a handbook was delivered. It was then "The Drying Tower
   * Handbook", which over-corrected: read under the "Final Concept" eyebrow, that says the
   * final concept IS a handbook, and the tower — the actual designed object — went unnamed
   * in every heading and sentence, surviving only as a picture and three measurements.
   * Naming both, in order, is the only version that carries the real relationship: the
   * concept is the tower, the deliverable is the means to build it.
   */
  heading: "The Drying Tower, and a handbook to build it",
  /**
   * Approved lead, used verbatim. It is also the section's ONLY statement that the handbook
   * was made for farmers to build from locally.
   *
   * INTENT, NOT A RECORDED HANDOVER (Sylvia, 2026-09-07). "designed to help farmers build
   * ... locally" is a statement of purpose, which the booklet supports. Whether the handbook
   * physically reached the farmers is NOT confirmed: Sylvia was not the person responsible
   * for delivering it and believes it probably was, which is an assumption, not a source.
   * TODO(sylvia): confirm with the teammate who handled it. If it was delivered, that becomes
   * a statable fact and belongs in section 09 beside `status.completed.items`, which is where
   * the collector's handover ("Prototyped, and left with a farmer") already lives. Do not turn
   * this lead into a delivery claim until then.
   *
   * A second line saying the same thing (`deliverable.madeFor`, "Written to be left in Seme
   * and built from with locally available materials and tools") was removed on 2026-09-07:
   * with the heading now naming both the tower and the handbook, three separate strings were
   * making the same point.
   */
  lead:
    "The project's final deliverable was a construction handbook designed to help farmers build the Drying Tower locally.",
  body: [
    "A black box collector heats air in the sun; a pipe carries it into a shelved tower. The door locks, so the crop can stay outside while the farmer is away.",
  ],
  /**
   * The handbook half of the section's own title (2026-09-07, second layout-reference
   * pass: "keep the existing title exactly... do not invent a new headline"). It is the
   * same string as `deliverable.title` below; kept as its own key because this one is the
   * section-level heading (rendered as an h3) and the other labels a plate.
   *
   * A numbered pair, "01 / Cover & purpose" then "02 / Selected pages", was tried in the
   * first layout-reference pass and removed in the second, whose brief explicitly excludes
   * numbering.
   */
  beats: {
    handbook: "The construction handbook",
  },
  deliverable: {
    /**
     * The caption is the title alone now. It used to continue "A construction manual, the
     * materials needed, the tools needed, and how to use it." -- which is the prose form of
     * the four `contents` entries rendered right beside it, so the handbook's own table of
     * contents appeared twice in one row.
     */
    title: "The construction handbook",
    /**
     * Why the deliverable is a document and not a machine. This is section 04's own finding
     * ("The gap was knowledge, not hardware", focus.body) carried forward to the point where
     * it explains a decision — without it the handbook reads as a consolation prize for the
     * tower nobody built, rather than as the answer to what the research actually found.
     * Cross-referencing a section by number is established voice here (see
     * challenge.captions.checklist, which points forward to 09).
     */
    rationale:
      "Section 04 found the gap was knowledge, not hardware. Instructions answer that; one finished prototype would not.",
    /** The handbook's own contents page, report p.54. */
    contents: ["Construction", "Materials", "Tools", "How to use"],
    evidence: "prototype" as Evidence,
    page: 54,
  },
  /**
   * The team's own words, from the handbook's opening page (report p.55). A first-hand
   * statement of status from inside the deliverable itself.
   */
  handbookQuote: {
    text:
      "The principles work, but we are not sure how efficient they will be in this version. The prototype needs to be built and tested in real-world conditions.",
    attribution: "From the construction handbook",
    page: 55,
  },
  /**
   * NOT RENDERED IN SECTION 07 ANY MORE (Sylvia, 2026-09-07). Kept as data, not dead code:
   * these are the cited p.44 statements, and section 09 is where they now belong.
   *
   * Why it left 07: `notBuilt` had drifted into saying exactly what `status.notValidated.text`
   * says in section 09 -- the two differed only by "an actual build" / "a real build" -- so
   * the page stated the same limitation twice in near-identical words. With the tower
   * caption ("It was never constructed.") and the handbook's own quote already in 07, this
   * made three consecutive hedges and ended the project's climax on its third apology.
   * `built` was covered too: 09's `claimSolid` and `completed.items` both carry the collector
   * and its handover. 07 now closes on the handbook's own quote, and 09 is the single full
   * account of what was and was not finished.
   */
  status: {
    built: "We prototyped the metal solar collector and left it with a farmer.",
    notBuilt: "The full tower was not constructed, and the handbook was not tested through an actual build.",
    page: 44,
  },
  /**
   * SUPERSEDED (2026-09-07, second layout-reference pass). The handbook half of section 07
   * is no longer "cover beside an explanation column, then a numbered pages header" — it is
   * one centred sequence: title, intro, cover (itself the entrance), a contents line, then
   * "Selected pages" and the two spreads. No numbering anywhere in it ("01 /", "02 /"), on
   * this pass's explicit instruction. `previewsLabel` and `handbookCta` below are kept, not
   * deleted, so nothing importing them breaks; nothing in 07 renders them any more.
   */
  previewsLabel: "Inside the handbook",
  handbookCta: {
    label: "Browse the full handbook →",
  },
  /**
   * The centred sequence itself. The intro text is `deliverable.rationale` (not repeated
   * here) -- same sentence, now centred above the cover instead of set beside it. `ctaLabel`
   * names the real destination (the in-page reader, not a PDF — see the note on
   * `HandbookCoverOpen` in handbook-reader.tsx) and doubles as that control's own caption,
   * sitting under the cover rather than beside it.
   */
  sequence: {
    ctaLabel: `Browse the full ${HANDBOOK_TOTAL}-page handbook →`,
    pagesLabel: "Selected pages",
    pagesSub: "Two examples from inside the handbook",
  },
  captions: {
    step: "One assembly step. Every joint is drawn, with the tubes it needs listed beneath it.",
    tower: "The tower the handbook guides people to build. It was never constructed.",
    cutlist: "The cut list. Every part is measured before anything is welded.",
  },
};

/**
 * 08. How it was intended to work.
 *
 * The two-state drawing carries the mechanism, so the four steps are labels on it rather
 * than four paragraphs. The ghosted frames carry the handling, so the three-row table is
 * gone. The report's own hedge stays as prose: it is the section's honesty valve.
 */
export const mechanism = {
  heading: "How it was intended to work",
  lead: "Hot air rises. The design puts that to work.",
  /** Four labels placed against the two frames, not four blocks of copy. */
  steps: [
    { n: "1", name: "Collect", text: "Black box absorbs sun, warms the air." },
    { n: "2", name: "Rise", text: "Inlet sits low, where air is cooler and drier." },
    { n: "3", name: "Dry", text: "Rising air passes the shelves, drawing moisture out." },
    { n: "4", name: "Exit", text: "Out through the chimney. One low inlet, one high outlet." },
  ],
  frameCaptions: { sun: "Capturing heat", airflow: "Creating airflow" },
  handling: [
    { name: "Loading", text: "Pull the shelves out, spread the maize." },
    { name: "Releasing", text: "Pull a shelf, or pour from the base." },
  ],
  handlingNote: "Ghosted body, inked action.",
  quote: { text: "So in theory this should work, but there are a lot of variables.", attribution: "Project report, 2024", page: 35 },
};

/**
 * 09. What we completed, and what remained open.
 *
 * The team's own marked requirement list is the primary visual. An unmarked box records
 * that the item was not assessed, which is all it can record: no tower was built and no
 * harvest season was observed. WORDING GUARDRAIL, approved: unmarked items are
 * "could not yet be evaluated", "not validated" or "still open", never "unmet" or
 * "failed". The interpretation of why they stayed open is a separate page caption, set
 * outside the drawing, so it can never read as the team's own annotation.
 */
export const status = {
  heading: "What we completed, and what remained open",

  claimSolid: "We completed the construction handbook and the solar collector.",
  claimOpen: "The full tower remained unbuilt and untested.",

  collectorPhoto: {
    built: "The metal solar collector the team built, the one part of the design that physically exists.",
    /** Added 2026-09-09, per Sylvia directly: a close-up of the outlet with a taped
     * strip, showing the hot air the collector actually produced during testing --
     * stronger evidence for this section's claim than the still-unused `handover`
     * caption below (that only proves it was delivered, not that it worked). */
    detail: "The collector's outlet, tested with a taped strip that moved in the hot air it produced.",
    handover: "Leaving the collector in Seme, May 2024.",
  },
  completed: {
    label: "Completed",
    items: [
      { name: "Construction handbook", note: "Measurements, cut list, tools and assembly steps.", page: 44 },
      { name: "Metal solar collector", note: "Prototyped, and left with a farmer.", page: 44 },
    ],
  },

  /** Caption for the marked checklist. Deliberately outside the drawing.
   * Booklet p.38. No longer rendered as "Booklet p.38." after the caption (2026-09-09,
   * Sylvia: readers never see the physical booklet, so a page citation to it means
   * nothing to them) -- kept here as the source note instead. */
  checklist: {
    label: "The list, marked by the team",
    caption: "Thirteen of eighteen requirements marked. Five were left unmarked.",
  },

  /** Approved decision 3: separate, clearly titled, and never in the team's voice. */
  whyOpen: {
    heading: "Why these remained open",
    text: "Each of the five compares the design against the traditional method, or against time. Both need a built tower and a season to run it in, so none could yet be evaluated.",
  },

  notValidated: {
    text: "The full tower was not constructed, and the handbook was not tested through a real build.",
    /* The missed season is the cause of that limitation, so it is stated with it. */
    season: "We also visited outside the harvest season, so we could not establish a baseline or test drying performance.",
  },

  nextStep: {
    label: "Next step",
    text: "Build the complete tower from the handbook, then test it during the harvest season.",
    page: 44,
  },
};

/**
 * 10. Reflection. Sylvia's own account, restored from her portfolio deck
 * (`Desktop - 15.pdf`): communication barriers, misaligned workflows and risk of
 * oversight, condensed but not reworded into anything she did not write. The fourth,
 * research timing, comes from booklet p.45 and is the one that explains why section 09
 * has nothing to validate.
 *
 * Deliberately prose-led with no explanatory icons or diagrams. DSCF0457, the dusk
 * homestead, closes the page.
 */
export const reflection = {
  heading: "What I would do differently",
  lead: "This was my first cross-disciplinary collaboration, working with architecture students.",
  insights: [
    {
      what: "Communication barriers",
      detail:
        "We spent a long time grasping each other's domain language. I learned some of the terminology architects use, but that takes time.",
      next: "Build a shared vocabulary deliberately in the first week.",
    },
    {
      what: "Misaligned workflows",
      detail:
        "Each discipline followed a distinct process. With limited time, merging them proved difficult and led to confusion over responsibilities.",
      next: "Map every member's key steps on one timeline before starting.",
    },
    {
      what: "Risk of oversight",
      detail:
        "We divided the work late, so some of us designed while others wrote the report. Crucial details slipped through the cracks.",
      next: "Hold regular check-ins and keep responsibilities overlapping.",
    },
    {
      what: "The wrong time of year",
      detail:
        "Visiting outside the harvest season meant we never saw the process at its most stressful, or measured what we set out to improve.",
      next: "Treat the timing of field research as a design constraint.",
    },
  ],
  takeaway: "The research is what holds up. The concept is honest about where it stops.",
  closingCaption: "Dusk in Seme, at the end of a field day.",
};

/**
 * Ordered section registry. NOW ACTUALLY CONSUMED (2026-09-07): it had existed unused since
 * the page was built; `chapterLabel()` below reads it so the ten chapter labels have exactly
 * one source instead of being hard-coded ten times in page.tsx.
 *
 * `label` is the short uppercase name that follows the number in the rendered chapter label
 * ("02 / CONTEXT"), matching HALOGRIP's `[ 01 / OVERVIEW ]` convention. It is deliberately
 * NOT the same string as `title`: the label names the chapter's subject in one or two words,
 * the title is the declarative sentence underneath it. Where they would collide the label is
 * the shorter noun ("CHALLENGE" over "Defining the challenge").
 *
 * The numbers are a real sequence (the case study's narrative order), which is why numbered
 * markers are appropriate here at all.
 */
export const sections: { n: string; id: string; title: string; label: string }[] = [
  { n: "01", id: "hero", title: "Post Harvest", label: "Post Harvest" },
  { n: "02", id: "context", title: "Where this happened", label: "Context" },
  { n: "03", id: "field", title: "Learning in the field", label: "Field research" },
  { n: "04", id: "focus", title: "Finding the focus", label: "Focus" },
  { n: "05", id: "challenge", title: "Defining the challenge", label: "Challenge" },
  { n: "06", id: "concepts", title: "Developing with farmers", label: "Concept development" },
  { n: "07", id: "final-concept", title: "The Drying Tower", label: "Final concept" },
  { n: "08", id: "mechanism", title: "How it was intended to work", label: "Mechanism" },
  { n: "09", id: "status", title: "What we completed, and what remained open", label: "Status" },
  { n: "10", id: "reflection", title: "What I would do differently", label: "Reflection" },
];

/**
 * The rendered chapter label for a section id, e.g. `chapterLabel("context")` -> "Context".
 * No longer prefixed with the section number (2026-09-07, Sylvia: the phase rail's own
 * number sat close enough to this one, visually, that the two independent sequences --
 * five phases vs. ten sections -- read as one skipping count. The phase rail keeps its
 * number; this one drops it, so only one numbered sequence is ever on screen at once.
 * `sections[].n` itself is untouched (still the source of truth for section order), only
 * this rendered string changes. The brackets and the uppercasing are still presentation
 * and still live in CSS (`.ph-chapter-label`), not here.
 */
export function chapterLabel(id: string): string {
  const s = sections.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown section id: ${id}`);
  return s.label;
}

/**
 * Narrative phase rail (2026-09-07, chapter-orientation pass). Five semantic story
 * phases grouping the ten sections above -- Discover (02-03), Reframe (04-05), Develop
 * (06), Deliver (07-09), Reflect (10). This is a SEPARATE registry from `sections`, not
 * a replacement: section numbers, ids and `chapterLabel()` output are unchanged, and
 * nothing here renumbers or renames a single existing section. `page.tsx` groups the
 * sections into `<div className="ph-phase">` wrappers by hand (the grouping is fixed,
 * not data-driven) and reads this array only for each phase's own rail text.
 */
export const phases: { n: string; name: string; descriptor: string }[] = [
  { n: "01", name: "Discover", descriptor: "Fieldwork and context" },
  { n: "02", name: "Reframe", descriptor: "From brief to actual need" },
  { n: "03", name: "Develop", descriptor: "Concepts tested with farmers" },
  { n: "04", name: "Deliver", descriptor: "A buildable system" },
  { n: "05", name: "Reflect", descriptor: "What remains open" },
];
