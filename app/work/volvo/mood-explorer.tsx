"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { asset, themes } from "./content";

export default function MoodExplorer() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const theme = themes[selected];

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % themes.length; break;
      case "ArrowLeft": next = (index - 1 + themes.length) % themes.length; break;
      case "Home": next = 0; break;
      case "End": next = themes.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="au-mood">
      <div className="au-mood-heading">
        <h3>Mood mode</h3>
        <p>Five ways to make the space feel your own.</p>
      </div>
      <div className="au-theme-tabs" role="tablist" aria-label="Cab atmosphere themes">
        {themes.map((item, index) => (
          <button key={item.id} type="button" role="tab" id={`theme-${item.id}`}
            aria-selected={selected === index} aria-controls={`mood-panel-${item.id}`}
            tabIndex={selected === index ? 0 : -1} ref={el => { tabs.current[index] = el; }}
            onKeyDown={event => navigate(event, index)} onClick={() => setSelected(index)}>
            <span className="au-theme-swatch" style={{ "--swatch": item.color } as CSSProperties} aria-hidden="true" />
            {item.name}
          </button>
        ))}
      </div>
      {themes.map((item, index) => (
        <div key={item.id} role="tabpanel" id={`mood-panel-${item.id}`} aria-labelledby={`theme-${item.id}`}
          hidden={selected !== index} tabIndex={0}>
          {selected === index && <ThemePanel key={theme.id} theme={theme} />}
        </div>
      ))}
      <noscript><p className="au-caption">The northern lights theme is shown above. Other proposed themes include fire, forest, sea and sunset.</p></noscript>
    </div>
  );
}

function ThemePanel({ theme }: { theme: typeof themes[number] }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="au-theme-content">
      <div className="au-theme-cab">
        {failed ? <p role="status">The {theme.name.toLowerCase()} visual could not load. The concept is described below.</p> : (
          <Image src={asset(theme.image)} alt={`AURORA cab concept in the ${theme.name.toLowerCase()} theme`}
            width={2000} height={1126} quality={92} sizes="(max-width: 1400px) 100vw, 1280px"
            onError={() => setFailed(true)} />
        )}
      </div>
      <div className="au-theme-note">
        <Image src={asset(theme.nature)} alt={theme.natureAlt} width={720} height={480}
          sizes="(max-width: 767px) 100px, 180px" />
        <div><h4>{theme.title}</h4><p>{theme.body}</p><span className="au-theme-sound">{theme.sound}</span></div>
      </div>
    </div>
  );
}
