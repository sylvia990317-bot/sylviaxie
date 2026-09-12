/**
 * The construction handbook, page by page — the data behind section 07's reader.
 *
 * The handbook is the project's primary deliverable and it is not an excerpt: it is the
 * final appendix of `references/kenya/RS24_kenya_Post Harvest_Final Report.pdf`, PDF pages
 * 54 to 106, 53 sheets of 842 x 595 pt landscape. Every one is rendered to
 * `public/post-harvest/handbook/pages/handbook-NN-{1600,900}.webp` by
 * `node scripts/convert-pdf-pages.mjs --handbook`. Numbering here is the handbook's own,
 * 1-based: handbook page 01 is report p.54.
 *
 * TWO TIERS (Sylvia's call, 2026-09-05). The reader opens on the 7-page overview — cover,
 * what it is, the principle, tools, raw materials, and the two cut lists. The 46 assembly
 * sheets are behind "View all 53 pages", so a visitor is not dropped into a welding manual
 * on the first click but can still read the whole thing.
 *
 * Per-page titles stop at chapter level on purpose. The handbook's headings are outlined
 * vector type, not live text, so pages 08 onward carry no extractable string to label them
 * with — inventing "Step 4" captions would be guessing at the source. The seven overview
 * pages are described individually because they were read directly.
 */

export type HandbookChapter = {
  /** Stable id, used as the quick-jump key. */
  id: string;
  /** Chapter name, taken from the handbook's own heading on its first page. */
  title: string;
  /** Inclusive handbook page range, 1-based. */
  from: number;
  to: number;
};

export type HandbookPage = {
  /** 1-based handbook page number. */
  n: number;
  src: string;
  srcSmall: string;
  width: number;
  height: number;
  chapter: HandbookChapter;
  alt: string;
};

/** Total sheets. Kept as a constant so the copy and the array cannot drift apart. */
export const HANDBOOK_TOTAL = 53;

/** How many pages the reader shows before "View all 53 pages" is used. */
export const HANDBOOK_OVERVIEW = 7;

/** The report PDF page that handbook page 01 corresponds to. For provenance only. */
export const HANDBOOK_REPORT_OFFSET = 53;

/**
 * Chapter boundaries, read off the handbook's own section title pages: "Black Box" opens
 * handbook p.08 (report p.61), "Drying Tower" p.23 (report p.76), "Metal shelves" p.49
 * (report p.102) and "How to use" p.51 (report p.104).
 */
export const HANDBOOK_CHAPTERS: HandbookChapter[] = [
  { id: "cover", title: "Cover", from: 1, to: 1 },
  { id: "about", title: "What is this?", from: 2, to: 2 },
  { id: "principle", title: "The principals", from: 3, to: 3 },
  { id: "tools", title: "Tools needed", from: 4, to: 4 },
  { id: "materials", title: "Raw materials", from: 5, to: 5 },
  { id: "cutlist", title: "Cutlist of materials", from: 6, to: 7 },
  { id: "blackbox", title: "Black Box assembly", from: 8, to: 22 },
  { id: "tower", title: "Drying Tower assembly", from: 23, to: 48 },
  { id: "shelves", title: "Metal shelves", from: 49, to: 50 },
  { id: "howto", title: "How to use", from: 51, to: 53 },
];

/** Descriptions of the seven overview sheets, which were read directly from the source. */
const OVERVIEW_ALT: Record<number, string> = {
  1: "Handbook cover: a line drawing of the Drying Tower with its collector, titled Drying Tower, first (1st) version, and listing a construction manual, the materials needed, the tools needed and how to use it.",
  2: "A page headed What is this?, explaining Reality Studio and the project in the team's own words, with small orientation drawings of the Drying Tower and the Black Box down the right-hand side.",
  3: "A page headed The principals, explaining the two ideas the dryer works by: the Black Box capturing solar energy to make hot air, and the stack effect pulling that air up through the tower.",
  4: "A page headed Tools needed, showing each tool as a drawing: tape measure, hammer, drill and metal bits, pliers, wrench, welding machine, angle grinder, paint brush and silicon gun.",
  5: "A page headed Raw materials needed, a table of every part with its dimensions and quantity, from square tube and angle iron to screws, silicon, paint and the transparent plastic sheet.",
  6: "A page headed Cutlist of materials, Black Box: dimensioned drawings of the square tube, flat iron bars, the perforated metal sheet, the transparent plastic sheet and the steel pipe.",
  7: "A page headed Cutlist of materials, Drying Tower: dimensioned drawings of the square tube, angle iron, flat iron, metal sheet and pipe, with the cut angles marked on each.",
};

const chapterOf = (n: number): HandbookChapter => {
  const c = HANDBOOK_CHAPTERS.find((ch) => n >= ch.from && n <= ch.to);
  if (!c) throw new Error(`handbook page ${n} falls outside every chapter range`);
  return c;
};

/**
 * Built from the chapter table rather than written out 53 times: the files are a generated
 * sequence, so hand-listing them would only create a second thing to keep in sync.
 */
export const HANDBOOK_PAGES: HandbookPage[] = Array.from({ length: HANDBOOK_TOTAL }, (_, i) => {
  const n = i + 1;
  const nn = String(n).padStart(2, "0");
  const chapter = chapterOf(n);
  const span = chapter.to - chapter.from + 1;
  return {
    n,
    src: `/post-harvest/handbook/pages/handbook-${nn}-1600.webp`,
    srcSmall: `/post-harvest/handbook/pages/handbook-${nn}-900.webp`,
    width: 1600,
    height: 1132,
    chapter,
    alt:
      OVERVIEW_ALT[n] ??
      `Handbook page ${n} of ${HANDBOOK_TOTAL}, sheet ${n - chapter.from + 1} of ${span} in the ${chapter.title} chapter: a drawn assembly step with its dimensions and the parts it uses.`,
  };
});

/**
 * Where section 07's three static plates sit inside the sequence, so clicking one opens the
 * reader on the sheet it is showing. Matched against the rendered pages pixel by pixel, not
 * guessed: the cover, the tools page and the Drying Tower cut list are exact, and the two
 * plates cropped for the page (`handbook-step`, `handbook-howto`) matched p.24 and p.52.
 */
export const HANDBOOK_PLATE_PAGE = {
  cover: 1,
  tools: 4,
  cutlist: 7,
  step: 24,
  howto: 52,
} as const;
