// Run after npm run build: node --test scripts/maritime-regression.test.cjs
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const sharp = require("sharp");
const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read(".next/server/app/work/maritime-hmi.html").match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];

test("the built page exposes one project title and four reachable chapters", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<h1[^>]*>Maritime HMI<\/h1>/);
  assert.match(html, /Case study 002/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "IDs must be unique");
  const chapters = ["overview", "operating-model", "interface-system", "prototype-validation"];
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(anchors, chapters);
  for (const id of anchors) assert.ok(ids.includes(id), "Missing destination: " + id);
  for (const match of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
    for (const id of match[1].split(" ")) assert.ok(ids.includes(id), "Missing heading: " + id);
  }
});

test("source links work without JavaScript, and prototype limits precede the fleet image", () => {
  const viewerLinks = [...html.matchAll(/<a\b[^>]*aria-haspopup="dialog"[^>]*>/g)];
  assert.equal(viewerLinks.length, 4);
  for (const [link] of viewerLinks) {
    const href = link.match(/href="([^"]+)"/)[1];
    assert.ok(fs.existsSync(path.join(root, "public", href)));
  }
  const fleet = html.slice(html.indexOf('id="fleet-view"'));
  assert.ok(fleet.indexOf("simplified placeholder") < fleet.indexOf("<img"));
  assert.match(html, /Original course scenario: Järntorget–Lindholmen/);
  assert.match(html, /Koön–Marstrand, a different route/);
});

test("every rendered image exists, has correct dimensions, and uses an allowed quality", async () => {
  const images = [...html.matchAll(/<img\b[^>]*>/g)];
  assert.ok(images.length >= 10);
  for (const [tag] of images) {
    const src = tag.match(/\bsrc="([^"]+)"/)[1].replaceAll("&amp;", "&");
    const url = new URL(src, "http://localhost");
    const file = url.pathname === "/_next/image" ? url.searchParams.get("url") : url.pathname;
    if (url.pathname === "/_next/image") assert.ok(["75", "92"].includes(url.searchParams.get("q")));
    const metadata = await sharp(path.join(root, "public", file)).metadata();
    const width = Number(tag.match(/\bwidth="(\d+)"/)[1]);
    const height = Number(tag.match(/\bheight="(\d+)"/)[1]);
    assert.equal(width / height, metadata.width / metadata.height, file + " aspect ratio");
    assert.match(tag, /\balt="[^"]+"/);
  }
});

test("project identities remain aligned with homepage ordering", () => {
  assert.match(read(".next/server/app/work/halogrip.html"), /CASE STUDY 001/);
  assert.match(read(".next/server/app/work/post-harvest.html"), /Case study 004/);
  const homepage = read("app/data/projects.ts");
  assert.ok(homepage.indexOf('slug: "halogrip"') < homepage.indexOf('slug: "maritime-hmi"'));
  assert.ok(homepage.indexOf('slug: "maritime-hmi"') < homepage.indexOf('slug: "post-harvest"'));
});

function revealHarness({ reduced = false, observerAvailable = true, top = 1200 } = {}) {
  let effect;
  let callback;
  let options;
  let disconnected = 0;
  let animated = 0;
  let cancelled = 0;
  const listeners = new Set();
  const preference = {
    matches: reduced,
    addEventListener: (_, fn) => listeners.add(fn),
    removeEventListener: (_, fn) => listeners.delete(fn),
  };
  const element = {
    getBoundingClientRect: () => ({ top }),
    animate: () => { animated++; return { cancel: () => cancelled++ }; },
  };
  class Observer {
    constructor(cb, opts) { callback = cb; options = opts; }
    observe() {}
    disconnect() { disconnected++; }
  }
  const exports = {};
  const code = ts.transpileModule(read("app/work/maritime-hmi/reveal.tsx"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const window = { innerHeight: 800, matchMedia: () => preference };
  if (observerAvailable) window.IntersectionObserver = Observer;
  vm.runInNewContext(code, {
    exports, window, IntersectionObserver: Observer,
    require(name) {
      if (name === "react") return { useRef: () => ({ current: element }), useEffect: (fn) => { effect = fn; } };
      if (name === "react/jsx-runtime") return { jsx: () => null };
      throw new Error(name);
    },
  });
  exports.default({ children: "content" });
  const cleanup = effect();
  return {
    get options() { return options; },
    get animated() { return animated; },
    get cancelled() { return cancelled; },
    get disconnected() { return disconnected; },
    get listeners() { return listeners.size; },
    enter(intersecting = true) { callback([{ isIntersecting: intersecting }]); },
    reduce() { preference.matches = true; for (const fn of listeners) fn(); },
    cleanup,
  };
}

test("offscreen content animates only when it approaches the viewport", () => {
  const h = revealHarness();
  assert.equal(h.animated, 0);
  assert.equal(h.options.rootMargin, "0px 0px 120px 0px");
  h.enter(false);
  assert.equal(h.animated, 0);
  h.enter();
  assert.equal(h.animated, 1);
  assert.equal(h.disconnected, 1);
  h.cleanup();
  assert.equal(h.cancelled, 1);
  assert.equal(h.listeners, 0);
});

test("reduced motion, unavailable observers and above-fold content remain unanimated", () => {
  for (const options of [{ reduced: true }, { observerAvailable: false }, { top: 100 }]) {
    const h = revealHarness(options);
    assert.equal(h.options, undefined);
    assert.equal(h.animated, 0);
  }
});

test("changing the motion preference cancels an active entrance", () => {
  const h = revealHarness();
  h.enter();
  h.reduce();
  assert.equal(h.cancelled, 1);
  h.cleanup();
  assert.equal(h.listeners, 0);
});
