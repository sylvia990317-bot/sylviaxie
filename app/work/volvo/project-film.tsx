"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Native controls remain usable without JS. No media bytes are requested until play. */
export default function ProjectFilm({ src, poster, title, duration, description }: {
  src: string; poster: string; title: string; duration: string; description: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const descriptionId = useId();
  const [state, setState] = useState<"paused" | "playing" | "ended" | "error">("paused");
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !video.paused) video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  async function togglePlayback() {
    const video = ref.current;
    if (!video) return;
    if (!video.paused) { video.pause(); return; }
    try {
      if (video.ended) video.currentTime = 0;
      await video.play();
    } catch {
      // A rejected play() (e.g. interrupted request) is not necessarily a broken file.
      setWaiting(false);
      setState(video.error ? "error" : "paused");
    }
  }

  return (
    <figure className="au-film">
      <div className="au-film-screen">
        {state === "error" ? (
          <img src={poster} alt={`${title}: concept still`} width={1920} height={1080} />
        ) : (
          <video ref={ref} src={src} poster={poster} width={1920} height={1080}
            controls playsInline muted preload="none" aria-label={title} aria-describedby={descriptionId}
            onPlay={() => {
              setState("playing");
              document.querySelectorAll<HTMLVideoElement>(".au-film video").forEach(video => {
                if (video !== ref.current) video.pause();
              });
            }}
            onPlaying={() => setWaiting(false)} onWaiting={() => setWaiting(true)}
            onPause={() => {
              // Browsers also dispatch pause after a media error. Keep that terminal
              // state instead of mounting the broken video again over its fallback.
              const video = ref.current;
              setState(current => current === "error" || video?.error ? "error" : video?.ended ? "ended" : "paused");
              setWaiting(false);
            }}
            onEnded={() => { setState("ended"); setWaiting(false); }}
            onError={() => { setState("error"); setWaiting(false); }}>
            <a href={src}>Open the {title.toLowerCase()} video</a>
          </video>
        )}
      </div>
      <div className="au-film-bar">
        <span>{title} <span className="au-film-duration">/ {duration}</span></span>
        {state === "error" ? <a href={src} className="au-text-link">Open video</a> : (
          <button type="button" onClick={togglePlayback} className="au-text-link"
            aria-label={`${state === "playing" ? "Pause" : state === "ended" ? "Replay" : "Play"} film: ${title}`}>
            {state === "playing" ? "Pause film" : state === "ended" ? "Replay film" : "Play film"}
            <span aria-hidden="true">{state === "playing" ? "Ⅱ" : "↗"}</span>
          </button>
        )}
      </div>
      <figcaption id={descriptionId} className="au-caption">{description}</figcaption>
      <p className="au-film-status" role="status">
        {state === "error" ? "The video could not load. The concept still and description remain available." : waiting ? "Loading video…" : ""}
      </p>
    </figure>
  );
}
