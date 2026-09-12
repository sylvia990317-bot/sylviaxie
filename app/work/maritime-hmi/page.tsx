import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./maritime-hmi.css";
import Reveal from "./reveal";
import ImageViewer from "./image-viewer";
import { project, meta, idea, layout, screens, corridor, scenario, chapters, backLink } from "./content";

/* Route-scoped fonts, the same pattern HALOGRIP and Post Harvest use: neither of these
   reaches `/` or any other route. Archivo is a grotesk with enough width range to carry
   both the display line and running text without the engineering-drawing stiffness a
   condensed face would add; IBM Plex Mono carries the labels and the numerals, which is
   the register the operator UI itself is in. */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--mh-sans",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--mh-mono",
});

const title = "Maritime HMI / Sylvia Xie";
const description =
  "A remote operations centre for autonomous passenger ferries, designed with CSTRIDER. An interface design case study by Sylvia Xie.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sylviaxie.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: "/maritime-hmi/roc/operators-hero.webp",
        width: 1672,
        height: 941,
        alt: project.heroAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/maritime-hmi/roc/operators-hero.webp"],
  },
};

function ChapterLabel({ index }: { index: number }) {
  const chapter = chapters[index];
  return <p className="mh-chapter-label">[ {chapter.n} / {chapter.label} ]</p>;
}

export default function MaritimeHmiPage() {
  return (
    <main className={`mh-root ${archivo.variable} ${plexMono.variable}`}>
      <Link href={backLink.href} className="mh-back">{backLink.label}</Link>

      <header className="mh-hero" id="hero">
        <div className="mh-canvas">
          <div className="mh-hero-eyebrows">
            <p className="mh-eyebrow">[ {project.eyebrow} ]</p>
            <p className="mh-eyebrow">{project.client}</p>
          </div>
          <h1 className="mh-hero-title">{project.title}</h1>
          <p className="mh-hero-descriptor">{project.descriptor}</p>
          <p className="mh-body mh-hero-lede">{project.lede}</p>
          <dl className="mh-hero-meta">
            {meta.heroFacts.map((fact) => (
              <div key={fact.k}>
                <dt>[ {fact.k} ]</dt>
                <dd>{fact.v}</dd>
              </div>
            ))}
          </dl>
          <figure className="mh-hero-figure">
            <Image src="/maritime-hmi/roc/operators-hero.webp" alt={project.heroAlt}
              width={1672} height={941} priority quality={92}
              sizes="(max-width: 1600px) 100vw, 1488px" />
          </figure>
          <nav className="mh-chapter-nav" aria-label="Project chapters">
            {chapters.map((chapter) => (
              <a key={chapter.id} href={`#${chapter.id}`}>
                <span>{chapter.n}</span> {chapter.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section className="mh-intro" id="overview" aria-labelledby="overview-title">
        <div className="mh-canvas">
          <ChapterLabel index={0} />
          <Reveal className="mh-intro-grid">
            <div>
              <h2 id="overview-title" className="mh-h2 mh-intro-head">{meta.heading}</h2>
              {meta.body.map((p) => <p key={p.slice(0, 32)} className="mh-body">{p}</p>)}
            </div>
            <dl className="mh-facts">
              {meta.facts.map((f) => (
                <div key={f.k} className="mh-fact"><dt>{f.k}</dt><dd>{f.v}</dd></div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section id="operating-model" aria-labelledby="operating-model-title">
        <div className="mh-idea">
          <div className="mh-canvas">
            <ChapterLabel index={1} />
            <Reveal className="mh-idea-grid">
              <figure className="mh-idea-figure">
                <Image src="/maritime-hmi/r01.webp" alt={idea.figureAlt}
                  width={1600} height={1200} quality={92}
                  sizes="(max-width: 860px) 100vw, (max-width: 1600px) 55vw, 790px" />
              </figure>
              <div>
                <h2 id="operating-model-title" className="mh-h2">{idea.heading}</h2>
                {idea.body.map((p) => <p key={p.slice(0, 32)} className="mh-body">{p}</p>)}
              </div>
            </Reveal>
          </div>
        </div>
        <div className="mh-layout">
          <div className="mh-canvas">
            <Reveal className="mh-layout-head">
              <h3 className="mh-h2">{layout.heading}</h3>
              <p className="mh-body">{layout.body}</p>
            </Reveal>
            <Reveal tag="figure" className="mh-layout-figure">
              <Image src="/maritime-hmi/roc/canal-wide-2560.webp" alt={layout.figureAlt}
                width={2560} height={1440} quality={92}
                sizes="(max-width: 1600px) 100vw, 1488px" />
            </Reveal>
            <Reveal className="mh-numbers">
              {layout.numbers.map((n) => (
                <div key={n.k} className="mh-number">
                  <span className="mh-number-v">{n.v}</span>
                  <span className="mh-number-k">{n.k}</span>
                </div>
              ))}
            </Reveal>

            <Reveal className="mh-scn">
              <div className="mh-scn-explainer">
                <div className="mh-scn-copy">
                  <h3 className="mh-eyebrow">{scenario.title}</h3>
                  <p className="mh-body">{scenario.body}</p>
                </div>
                <dl className="mh-scn-metrics" aria-label="Course scenario figures">
                  {scenario.facts.map((fact) => (
                    <div key={fact.k}><dt>{fact.k}</dt><dd>{fact.v}</dd></div>
                  ))}
                </dl>
              </div>
              <figure className="mh-scn-slide">
                <ImageViewer src={scenario.src} alt={scenario.alt} title={scenario.title}>
                  <Image src={scenario.src} alt={scenario.alt} width={scenario.w}
                    height={scenario.h} quality={92}
                    sizes="(max-width: 1600px) 100vw, 1488px" />
                </ImageViewer>
                <figcaption className="mh-caption">{scenario.caption}</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mh-screens" id="interface-system" aria-labelledby="interface-title">
        <div className="mh-canvas">
          <ChapterLabel index={2} />
          <Reveal className="mh-screens-head">
            <p className="mh-eyebrow">{screens.eyebrow}</p>
            <h2 id="interface-title" className="mh-h2">{screens.heading}</h2>
            <p className="mh-body">{screens.introduction}</p>
          </Reveal>
          <Reveal tag="figure" className="mh-station-overview">
            <div className="mh-station-top-label">
              <b><span>A</span> {screens.overview.groups[0].label}</b>
              <span>{screens.overview.groups[0].detail}</span>
            </div>
            <div className="mh-station-media">
              <Image src={screens.overview.src} alt={screens.overview.alt}
                width={screens.overview.w} height={screens.overview.h} quality={92}
                sizes="(max-width: 1600px) 100vw, 1488px" className="mh-station-img" />
              <span className="mh-station-top-connector" aria-hidden="true" />
              <span className="mh-station-top-bracket" aria-hidden="true" />
              <span className="mh-station-lower-connector is-left" aria-hidden="true" />
              <span className="mh-station-lower-connector is-right" aria-hidden="true" />
            </div>
            <div className="mh-station-bottom-labels">
              {screens.overview.groups.slice(1).map((group, i) => (
                <div key={group.id} className={i === 0 ? "is-left" : "is-right"}>
                  <b><span>{i === 0 ? "B" : "C"}</span> {group.label}</b>
                  <span>{group.detail}</span>
                </div>
              ))}
            </div>
            <figcaption className="mh-station-caption">{screens.overview.caption}</figcaption>
          </Reveal>
        </div>
        <div className="mh-screens-figures">
          {screens.items.toSorted((a, b) => a.order - b.order).map((s) => (
            <Reveal key={s.id} tag="article" id={s.id} className="mh-screen">
              <header className="mh-screen-cap">
                <span className="mh-screen-index" aria-hidden="true">
                  {String.fromCharCode(64 + s.order)}
                </span>
                <div className="mh-screen-name">
                  <p className="mh-screen-role">{s.name}</p>
                  <h3>{s.role}</h3>
                </div>
                <p className="mh-body">{s.body}</p>
              </header>
              <div className="mh-fleet-reading">
                <div className="mh-fleet-image">
                  <ImageViewer src={s.src} alt={s.alt} title={s.role}>
                    <Image src={s.src} alt={s.alt} width={s.w} height={s.h}
                      quality={92} sizes="(max-width: 900px) 100vw, (max-width: 1800px) 70vw, 1260px"
                      className="mh-screen-img" />
                    {s.id !== "fleet-view" && s.notes.map((n, i) => (
                      <span key={n.label} className="mh-interface-marker"
                        style={{ left: `${n.x}%`, top: `${n.y}%` }} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    ))}
                  </ImageViewer>
                </div>
                <ol className="mh-fleet-rail" aria-label={`${s.role} annotations`}>
                  {s.notes.map((n, i) => (
                    <li key={n.label}>
                      <span className="mh-fleet-rail-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <span className="mh-fleet-rail-copy"><b>{n.label}</b><span>{n.detail}</span></span>
                    </li>
                  ))}
                </ol>
              </div>
              {s.id === "vessel-view" && (
                <div className="mh-corridor">
                  <div className="mh-corridor-head">
                    <h4>{corridor.heading}</h4>
                    <p className="mh-body">{corridor.body}</p>
                  </div>
                  <ul className="mh-corridor-list">
                    {corridor.states.map((c) => (
                      <li key={c.name}>
                        <Image src={c.src} alt={c.alt} width={760} height={760}
                          sizes="(max-width: 700px) 150px, 210px" />
                        <b>{c.name}</b><span>{c.body}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="mh-foot">
        <div className="mh-canvas">
          <span>SYLVIA XIE / CSTRIDER</span>
          <Link href="/">Back to all work</Link>
        </div>
      </footer>
    </main>
  );
}
