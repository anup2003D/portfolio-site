import { useEffect, useRef, useState } from 'react';

/*
  HORIZONTAL CAROUSEL — scroll-driven
  ─────────────────────────────────────────
  The section is tall (scrollHeight vh).
  The inner content sticks to the top and
  stays pinned while the user scrolls through
  the section height. Scroll progress drives
  horizontal movement of the card track.

  Adapted from the reference component:
  - Among Us theme: void black bg, red accents,
    Orbitron/Space Grotesk fonts, no white cards
  - Cards show full project data: title, description,
    category badge, tech tags, demo button
  - Giant background text parallaxes slower than cards

  CHANGE POINTS are marked inline.
*/
export default function HorizontalCarousel({
  projects = [],
  /*
    CHANGE POINT — scroll height:
    How many vh the section takes up to give
    the user scroll distance to drive the carousel.
    Increase for slower scroll feel, decrease for faster.
  */
  scrollHeight = 380,
  /*
    CHANGE POINT — card dimensions & gap:
    cardWidth / cardHeight control each card size in px.
    gap controls space between cards in px.
  */
  gap        = 40,
  cardWidth  = 300,
  cardHeight = 420,
}) {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  /* ── Scroll-to-progress loop ── */
  useEffect(() => {
    let raf;
    let targetProgress  = 0;
    let currentProgress = 0;

    const tick = () => {
      const section = sectionRef.current;
      if (!section) { raf = requestAnimationFrame(tick); return; }

      const rect                  = section.getBoundingClientRect();
      const totalScrollable       = section.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) {
        targetProgress = 0;
      } else {
        targetProgress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      }

      /*
        CHANGE POINT — interpolation smoothness:
        0.12 = fairly smooth. Lower = smoother/slower,
        higher (e.g. 0.3) = snappier/more direct.
      */
      currentProgress += (targetProgress - currentProgress) * 0.12;
      setProgress(currentProgress);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Track translation ── */
  const vw           = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const totalTrack   = projects.length * cardWidth + (projects.length - 1) * gap;
  const overflow     = Math.max(0, totalTrack - vw + 120);
  const translateX   = -overflow * progress;

  /* ── Background text parallax ── */
  const bgTranslateX = -overflow * progress * 0.35;

  return (
    <section
      ref={sectionRef}
      className="hc-section"
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="hc-sticky">

        {/* Giant background label */}
        <div
          className="hc-bg-title"
          aria-hidden="true"
          style={{ transform: `translate3d(${bgTranslateX}px, -50%, 0)` }}
        >
          PROJECTS
        </div>

        {/* Carousel viewport */}
        <div className="hc-viewport">
          <div
            className="hc-track"
            style={{
              gap:       `${gap}px`,
              transform: `translate3d(${translateX}px, 0, 0)`,
            }}
          >
            {projects.map((project, index) => {
              /* Opacity fades cards that are far from current focus */
              const cardPos = index / Math.max(1, projects.length - 1);
              const dist    = Math.abs(cardPos - progress);
              const opacity = Math.max(0.55, 1 - dist * 0.45);

              const hasDemo = project.demoLink && project.demoLink !== '#';

              return (
                <article
                  key={project._id || project.title}
                  className={`hc-card hc-card-${index % 4}`}
                  style={{
                    width:    `${cardWidth}px`,
                    minWidth: `${cardWidth}px`,
                    height:   `${cardHeight}px`,
                    opacity,
                  }}
                >
                  {/* Top: index + category */}
                  <div className="hc-card-top">
                    <span className="hc-card-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {project.category && (
                      <span className="hc-card-cat">{project.category}</span>
                    )}
                  </div>

                  {/* Main copy */}
                  <div className="hc-card-body">
                    <h3 className="hc-card-title">{project.title}</h3>
                    <p  className="hc-card-desc">{project.description}</p>
                  </div>

                  {/* Footer: tech tags + demo button */}
                  <div className="hc-card-footer">
                    <div className="hc-card-tags">
                      {project.techStack?.slice(0, 3).map((tag) => (
                        <span key={tag} className="hc-card-tag">{tag}</span>
                      ))}
                    </div>

                    {hasDemo ? (
                      <a
                        href={project.demoLink}
                        className="hc-card-btn"
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} demo`}
                      >
                        <i className="fas fa-arrow-up-right-from-square" />
                      </a>
                    ) : (
                      <span className="hc-card-btn hc-card-btn--disabled" title="Coming soon">
                        <i className="fas fa-clock" />
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="hc-progress">
          <span className="hc-progress-num">
            {String(Math.min(projects.length, Math.max(1, Math.round(progress * projects.length) + 1))).padStart(2, '0')}
          </span>
          <span className="hc-progress-track">
            <span style={{ transform: `scaleX(${progress})` }} />
          </span>
          <span className="hc-progress-num">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>

      </div>
    </section>
  );
}
