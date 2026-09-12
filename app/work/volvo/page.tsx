import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asset, project, chapters, brief, research, focus, development, modes, greeting, evaluation } from "./content";
import MoodExplorer from "./mood-explorer";
import ProjectFilm from "./project-film";
import "./volvo.css";

const title = "AURORA / Volvo Trucks / Sylvia Xie";
const description = "A sensory cab concept developed with Volvo Trucks at Chalmers. Exploring light, sound and connection for the next generation of long-haul drivers.";
export const metadata: Metadata = {
  title, description,
  icons: { icon: asset("icon.png") },
  openGraph: { title, description, images: [{ url: asset("aurora-cab.webp"), width: 1920, height: 1080, alt: "AURORA truck cab with green ambient lighting" }] },
  twitter: { card: "summary_large_image", title, description, images: [asset("aurora-cab.webp")] },
};

export default function VolvoPage() {
  return (
    <main className="au-root" id="aurora-top">
      <a className="au-skip" href="#brief">Skip to case study</a>
      <div className="au-topbar au-wrap">
        <Link href="/" prefetch={false} className="au-wordmark">Sylvia Xie<span>Industrial designer</span></Link>
        <Link href="/" prefetch={false} className="au-back">All work <span aria-hidden="true">↗</span></Link>
      </div>

      <header className="au-hero au-wrap">
        <div className="au-hero-label">Volvo Trucks / Sensory design / 2022</div>
        <div className="au-hero-heading">
          <h1>{project.title}</h1>
          <p>{project.tagline}</p>
        </div>
        <p className="au-hero-description">{project.description}</p>
        <figure className="au-hero-image">
          <Image src={asset("aurora-cab.webp")} width={1920} height={1080} priority fetchPriority="high" quality={92}
            alt="AURORA concept interior: green light follows the dashboard, steering wheel and edges of the truck cab"
            sizes="(max-width: 1400px) 100vw, 1280px" />
        </figure>
        <dl className="au-project-meta">
          {project.meta.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
        </dl>
      </header>

      <nav className="au-chapters" aria-label="Project chapters">
        <div className="au-wrap">
          <a href="#aurora-top" className="au-chapter-brand" aria-label="AURORA, back to top">AURORA</a>
          <div>{chapters.map(chapter => <a key={chapter.id} href={`#${chapter.id}`}>{chapter.label}</a>)}</div>
        </div>
      </nav>

      <section id="brief" className="au-section au-wrap" aria-labelledby="brief-title">
        <div className="au-brief-grid">
          <div>
            <h2 id="brief-title">{brief.title}</h2>
            {brief.body.map(paragraph => <p className="au-body" key={paragraph}>{paragraph}</p>)}
            <p className="au-question">{brief.question}</p>
          </div>
          <figure>
            <Image src={asset("life-on-the-road.webp")} alt="A driver beside a parked truck at dusk, photographed by Volvo Trucks"
              width={1024} height={683} sizes="(max-width: 767px) 100vw, 45vw" />
            <figcaption className="au-caption">Life on the road continues after the engine stops.</figcaption>
          </figure>
        </div>
      </section>

      <section id="research" className="au-section au-research" aria-labelledby="research-title">
        <div className="au-wrap">
          <h2 id="research-title">{research.title}</h2>
          <p className="au-lead">{research.intro}</p>
          <div className="au-audiences">
            {research.groups.map(group => (
              <article className="au-audience" key={group.name}>
                <div className="au-audience-image">
                  <Image src={asset(group.image)} alt={group.alt} width={group.width} height={group.height}
                    sizes="(max-width: 767px) 100vw, 50vw" />
                </div>
                <div className="au-audience-title"><h3>{group.name}</h3><span>{group.tag}</span></div>
                <p className="au-audience-question">{group.question}</p>
                <ul>{group.findings.map(finding => <li key={finding}>{finding}</li>)}</ul>
              </article>
            ))}
          </div>
          <dl className="au-research-numbers">
            {research.methods.map(method => <div key={method.label}><dd>{method.number}</dd><dt>{method.label}</dt></div>)}
          </dl>
          <div className="au-synthesis">
            <div><h3>From individual stories to shared needs.</h3><p className="au-body">{research.synthesis}</p>
              <details className="au-disclosure"><summary>Research methods & samples</summary><p>{research.surveys}</p><p>Interviews and observations were complemented by benchmarking and literature research. Student interviewees studied transport; the broader youth survey explored expectations beyond that group.</p></details>
            </div>
            <figure>
              <a href={asset("research-kj.webp")} target="_blank" rel="noreferrer" className="au-evidence-link" aria-label="View research board at full size">
                <Image src={asset("research-kj.webp")} alt="Original Swedish affinity map, with colour-coded responses grouped into driver needs"
                  width={1492} height={669} quality={92} sizes="(max-width: 767px) 100vw, 60vw" />
                <span>View research board <span aria-hidden="true">↗</span></span>
              </a>
              <figcaption className="au-caption">{research.caption}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="loneliness" className="au-section au-wrap au-focus" aria-labelledby="focus-title">
        <h2 id="focus-title">{focus.title}</h2>
        <p className="au-lead">{focus.intro}</p>
        <ul className="au-problem-areas" aria-label="Six research problem areas">
          {focus.areas.map((area, index) => <li key={area} className={index === 5 ? "au-area-selected" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{area}{index === 5 && <small>Selected focus</small>}</li>)}
        </ul>
        <div className="au-loneliness-pair">
          {focus.distinctions.map(item => <article key={item.title}><h3>{item.title}</h3><span>{item.subtitle}</span><p>{item.body}</p></article>)}
        </div>
        <p className="au-focus-statement">{focus.conclusion}</p>
        <p className="au-body au-focus-context">{focus.context}</p>
      </section>

      <section id="development" className="au-section au-development" aria-labelledby="development-title">
        <div className="au-wrap">
          <h2 id="development-title">{development.title}</h2>
          <p className="au-lead">{development.intro}</p>
          <ul className="au-approaches" aria-label="Four exploration approaches">{development.approaches.map(item => <li key={item}>{item}</li>)}</ul>
          <div className="au-concepts">
            {development.concepts.map((concept, index) => <article className={`au-concept ${!concept.image ? "au-concept-text" : ""}`} key={concept.name}>
              {concept.image && <div className="au-concept-image"><Image src={asset(concept.image)} alt={concept.alt} width={concept.width} height={concept.height} quality={92} sizes="(max-width: 767px) 100vw, 50vw" /></div>}
              <div className="au-concept-copy"><div className="au-concept-name"><span>{String(index + 1).padStart(2, "0")}</span><h3>{concept.name}</h3></div>
                <h4>{concept.purpose}</h4><p>{concept.body}</p></div>
            </article>)}
          </div>
          <div className="au-decision"><p className="au-decision-title">{development.decision}</p><p>{development.reasoning}</p><p>{development.tradeoff}</p></div>
        </div>
      </section>

      <section id="concept" className="au-section au-wrap au-sensory" aria-labelledby="concept-title">
        <h2 id="concept-title">{modes.title}</h2>
        <p className="au-lead">{modes.intro}</p>
        <ProjectFilm src={asset("aurora-cab.mp4")} poster={asset("aurora-cab.webp")} title="Inside AURORA" duration="10 sec"
          description="Original concept animation showing how green lighting follows the cab’s interior surfaces. A visual exploration of the proposed sensory environment." />
        <MoodExplorer />
        <div className="au-default-mode">
          <h3>Default mode</h3>
          <p className="au-body">{modes.default}</p>
          <div className="au-day-pair">
            <figure><Image src={asset("default-morning.webp")} alt="AURORA cab with cool morning lighting" width={1200} height={675} sizes="(max-width: 767px) 100vw, 50vw" />
              <figcaption><span>Morning</span><span>Cooler light to start the day</span></figcaption></figure>
            <figure><Image src={asset("default-evening.webp")} alt="AURORA cab with warm evening lighting" width={1200} height={675} sizes="(max-width: 767px) 100vw, 50vw" />
              <figcaption><span>Evening</span><span>Warmer light to wind down</span></figcaption></figure>
          </div>
        </div>
        <div className="au-secondary-modes">{modes.secondary.map(mode => <article key={mode.name}><h3>{mode.name}</h3><h4>{mode.title}</h4><p>{mode.body}</p></article>)}</div>
      </section>

      <section id="greeting" className="au-section au-greeting" aria-labelledby="greeting-title">
        <div className="au-wrap">
          <h2 id="greeting-title">{greeting.title}</h2>
          <p className="au-lead">{greeting.intro}</p>
          <ProjectFilm src={asset("greeting.mp4")} poster={asset("greeting-poster.webp")} title="The greeting" duration="8 sec" description={greeting.caption} />
          <ol className="au-greeting-steps">{greeting.steps.map((step, index) => <li key={step.title}><span className="au-step-number">{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
        </div>
      </section>

      <section id="reflection" className="au-section au-wrap au-evaluation" aria-labelledby="evaluation-title">
        <h2 id="evaluation-title">{evaluation.title}</h2>
        <div className="au-evaluation-grid">
          <div className="au-stat"><span>{evaluation.statistic}</span><p>{evaluation.statisticLabel}</p><small>{evaluation.sample}</small></div>
          <div className="au-evaluation-copy"><h3>Interest in an idea, before testing in use.</h3><p className="au-body">{evaluation.body}</p><p className="au-caption">Concept evaluation reported in the 2022 bachelor’s thesis, chapter 9.5.</p></div>
        </div>
        <h3 className="au-next-heading">What comes next</h3>
        <div className="au-next-steps">{evaluation.next.map(step => <article key={step.title}><h4>{step.title}</h4><p>{step.body}</p></article>)}</div>
        <div className="au-personal"><h3>What I took from this project.</h3><p>{evaluation.reflection}</p></div>
        <details className="au-disclosure au-credits"><summary>Project credits & sources</summary>
          <p>A bachelor’s thesis at Chalmers University of Technology, developed with Volvo Trucks in 2022.</p>
          <p><strong>Team:</strong> {evaluation.team} I participated across research, analysis and concept development as part of this team.</p>
          <p><strong>Project material:</strong> <cite>Förarmiljöer för framtidens fjärrtransportfordon</cite>, the final project presentation, and Sylvia Xie’s portfolio. Source imagery, concept sketches and animations are presented as team project material, not individually attributed work.</p>
          <p><strong>Images:</strong> Volvo truck and cab photographs originate from Volvo Trucks, as credited in the project material. Nature references originate from the presentation and report, which credit Unsplash. Research visuals were produced by the project team.</p>
        </details>
      </section>

      <footer className="au-footer"><div className="au-wrap"><span>Sylvia Xie / AURORA / 2022</span><Link href="/" prefetch={false}>All work <span aria-hidden="true">↗</span></Link></div></footer>
    </main>
  );
}
