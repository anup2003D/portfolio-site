import { useRef, useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

/* ─────────────────────────────────────────
   3D OBJECT COMPONENTS  (static, pop on hover)
───────────────────────────────────────── */
function RingObject() {
  return (
    <div className="proj-obj proj-ring">
      <span />
    </div>
  );
}
function SphereObject() {
  return <div className="proj-obj proj-sphere"><span /></div>;
}
function PrismObject() {
  return <div className="proj-obj proj-prism"><span /><span /></div>;
}
function CubeObject() {
  return <div className="proj-obj proj-cube"><span /><span /><span /></div>;
}
function DiamondObject() {
  return <div className="proj-obj proj-diamond"><span /></div>;
}

const SHAPES = [RingObject, SphereObject, PrismObject, CubeObject, DiamondObject];

/* ─────────────────────────────────────────
   TILT CARD
───────────────────────────────────────── */
function TiltCard({ project, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const ShapeEl = SHAPES[index % SHAPES.length];

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.setProperty('--rot-x', `${(0.5 - y) * 14}deg`);
    card.style.setProperty('--rot-y', `${(x - 0.5) * 14}deg`);
    card.style.setProperty('--spot-x', `${x * 100}%`);
    card.style.setProperty('--spot-y', `${y * 100}%`);
  };

  const reset = () => {
    setHovered(false);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--rot-x', '0deg');
    card.style.setProperty('--rot-y', '0deg');
  };

  const hasDemo = project.demoLink && project.demoLink !== '#';

  return (
    <div
      ref={cardRef}
      className={`proj-card proj-card-${index}`}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
    >
      {/* Noise texture overlay */}
      <div className="proj-noise" />

      {/* Cursor spotlight */}
      <div className="proj-shine" />

      {/* Bottom ambient glow */}
      <div className="proj-ambient" />

      {/* 3D object */}
      <div className={`proj-obj-wrap ${hovered ? 'obj-active' : ''}`}>
        <ShapeEl />
      </div>

      {/* Content layer */}
      <div className="proj-content">

        {/* Top row */}
        <div className="proj-topline">
          <span className="proj-num">{String(index + 1).padStart(2, '0')}</span>
          <span className="proj-cat-pill">{project.category}</span>
        </div>

        {/* Spacer pushes copy to bottom */}
        <div className="proj-spacer" />

        {/* Copy */}
        <div className="proj-copy">
          <div className="proj-title-row">
            <h3 className="proj-title">{project.title}</h3>
            {hasDemo ? (
              <a
                href={project.demoLink}
                className="proj-arrow-btn proj-arrow-primary"
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} Demo`}
                onClick={(e) => e.stopPropagation()}
              >
                <i className="fas fa-arrow-up-right-from-square" />
              </a>
            ) : (
              <span className="proj-arrow-btn proj-arrow-disabled" title="Coming soon">
                <i className="fas fa-clock" />
              </span>
            )}
          </div>
          <p className="proj-desc">{project.description}</p>
        </div>

        {/* Tags */}
        <div className="proj-tags">
          {project.techStack?.slice(0, 4).map((tag) => (
            <span key={tag} className="proj-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PROJECTS SECTION
───────────────────────────────────────── */
export default function Projects() {
  const { projects } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = useMemo(() => {
    const cats = projects.map((p) => p.category).filter(Boolean);
    return ['All', ...new Set(cats)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  if (!projects.length) return null;

  return (
    <section className="section" id="projects" aria-labelledby="projects-heading">
      <div className="container">

        <div className="section-eyebrow reveal">
          <div className="section-eyebrow-line" />
          <span className="section-eyebrow-text">05 / Completed Tasks</span>
        </div>

        <h2
          className="section-title reveal"
          id="projects-heading"
          style={{ transitionDelay: '200ms' }}
        >
          Featured <span className="accent">Projects</span>
        </h2>

        {/* Filter bar */}
        <div className="filter-bar reveal" style={{ transitionDelay: '140ms' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tilt card grid */}
        <div className="proj-grid">
          {filtered.map((project, i) => (
            <TiltCard key={project._id || project.title} project={project} index={i} />
          ))}
        </div>

      </div>

      <style>{`

        /* ═══════════════════════════════════════
           GRID
        ═══════════════════════════════════════ */
        .proj-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-auto-rows: 1fr;
          gap: 18px;
        }
        .proj-grid::before {
          content: '';
          width: 0;
          padding-bottom: 100%;
          grid-row: 1;
          grid-column: 1;
        }
        .proj-grid > *:first-child {
          grid-row: 1;
          grid-column: 1;
        }
        @media (max-width: 760px) {
          .proj-grid { grid-template-columns: 1fr; }
          .proj-grid::before { display: none; }
        }

        /* ═══════════════════════════════════════
           CARD BASE
        ═══════════════════════════════════════ */
        .proj-card {
          position: relative;
          aspect-ratio: 1 / 1;
          min-height: 0;
          min-width: 0;
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(10, 10, 14, 0.96);
          transform-style: preserve-3d;
          transform: perspective(900px) rotateX(var(--rot-x,0deg)) rotateY(var(--rot-y,0deg));
          transition:
            transform 0.18s ease-out,
            border-color 0.55s ease,
            box-shadow 0.55s ease;
          cursor: default;
          isolation: isolate;
        }
        .proj-card:hover {
          border-color: rgba(255, 70, 85, 0.32);
          box-shadow:
            0 0 0 1px rgba(255, 70, 85, 0.12),
            0 32px 80px -20px rgba(0, 0, 0, 0.85),
            0 0 55px -18px rgba(255, 70, 85, 0.14);
        }

        /* Per-card background tints */
        .proj-card-0 { background: radial-gradient(ellipse at 15% 85%, rgba(28,10,16,0.98) 0%, rgba(8,8,12,1) 60%); }
        .proj-card-1 { background: radial-gradient(ellipse at 85% 15%, rgba(10,16,26,0.98) 0%, rgba(6,6,10,1) 60%); }
        .proj-card-2 { background: radial-gradient(ellipse at 15% 15%, rgba(18,18,12,0.98) 0%, rgba(8,8,12,1) 60%); }
        .proj-card-3 { background: radial-gradient(ellipse at 85% 85%, rgba(12,8,20,0.98) 0%, rgba(6,6,10,1) 60%); }
        .proj-card-4 { background: radial-gradient(ellipse at 50% 50%, rgba(16,12,18,0.98) 0%, rgba(8,8,12,1) 60%); }

        /* ═══════════════════════════════════════
           NOISE TEXTURE
        ═══════════════════════════════════════ */
        .proj-noise {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        /* ═══════════════════════════════════════
           CURSOR SPOTLIGHT
        ═══════════════════════════════════════ */
        .proj-shine {
          position: absolute;
          inset: -30%;
          background: radial-gradient(
            circle at var(--spot-x, 50%) var(--spot-y, 50%),
            rgba(255, 85, 90, 0.2) 0%,
            rgba(255, 70, 85, 0.05) 32%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.38s ease;
          pointer-events: none;
          z-index: 1;
        }
        .proj-card:hover .proj-shine { opacity: 1; }

        /* ═══════════════════════════════════════
           AMBIENT BOTTOM GLOW
        ═══════════════════════════════════════ */
        .proj-ambient {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 65%;
          height: 80px;
          background: radial-gradient(ellipse, rgba(255, 70, 85, 0.12) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.55s ease;
          z-index: 0;
        }
        .proj-card:hover .proj-ambient { opacity: 1; }

        /* ═══════════════════════════════════════
           3D OBJECT WRAPPER
        ═══════════════════════════════════════ */
        .proj-obj-wrap {
          position: absolute;
          left: 55%;
          top: 42%;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.2, 0.9, 0.1, 1), opacity 0.45s ease;
          pointer-events: none;
          z-index: 2;
          opacity: 0.5;
        }
        .proj-obj-wrap.obj-active {
          transform: translateZ(62px) scale(1.14) rotateZ(18deg);
          opacity: 0.78;
        }

        /* Sphere */
        .proj-sphere {
          width: 160px;
          height: 160px;
          margin: -80px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 28% 22%,
            #ffffff 0 3%,
            #c4c4c0 15%,
            #242424 50%,
            #060606 70%
          );
          box-shadow:
            -22px 13px 44px rgba(0,0,0,0.75),
            0 0 50px rgba(255,70,85,0.12),
            inset 0 0 22px rgba(255,70,85,0.04);
          position: relative;
        }
        .proj-sphere span {
          position: absolute;
          inset: -30px;
          border: 1.5px solid rgba(255, 70, 85, 0.42);
          border-radius: 50%;
          transform: rotateX(74deg);
          box-shadow: 0 0 14px rgba(255,70,85,0.12);
        }

        /* Ring */
        .proj-ring {
          width: 196px;
          height: 196px;
          margin: -98px;
          border-radius: 50%;
          border: 25px solid rgba(238, 238, 234, 0.88);
          border-right-color: var(--red);
          border-bottom-color: #1c1c1c;
          box-shadow: 0 0 30px rgba(255, 70, 85, 0.38), inset 0 0 10px rgba(255,70,85,0.06);
          transform: rotateX(65deg) rotateZ(-25deg);
          position: relative;
        }
        .proj-ring span {
          position: absolute;
          inset: -52px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 50%;
        }

        /* Prism */
        .proj-prism {
          width: 138px;
          height: 138px;
          margin: -69px;
          transform: rotate(28deg) skew(-9deg,-9deg);
          background: linear-gradient(135deg, #080808 3%, rgba(255,70,85,0.82) 4% 9%, #dcdcd7 10% 47%, #181818 48%);
          box-shadow: 27px 27px 0 rgba(118,118,116,0.65), 0 0 44px rgba(255,70,85,0.28);
          position: relative;
        }
        .proj-prism span:first-child { position: absolute; inset: -1px; border: 0.5px solid rgba(255,70,85,0.32); }
        .proj-prism span:last-child  { position: absolute; inset: 9px;  border: 0.5px solid rgba(255,255,255,0.09); }

        /* Cube */
        .proj-cube {
          width: 108px;
          height: 108px;
          margin: -54px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.16);
          box-shadow: 0 0 30px rgba(255,70,85,0.07);
          position: relative;
        }
        .proj-cube span:nth-child(1) { position: absolute; inset: -14px; border: 0.5px solid rgba(255,255,255,0.09); transform: rotateZ(22deg); }
        .proj-cube span:nth-child(2) { position: absolute; inset: -26px; border: 0.5px solid rgba(255,255,255,0.055); transform: rotateZ(-14deg); }
        .proj-cube span:nth-child(3) { position: absolute; inset: 12px;  border: 0.5px solid rgba(255,70,85,0.18); }

        /* Diamond */
        .proj-diamond {
          width: 98px;
          height: 98px;
          margin: -49px;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,70,85,0.22) 50%, rgba(255,255,255,0.03) 100%);
          border: 1px solid rgba(255,255,255,0.18);
          transform: rotate(45deg);
          box-shadow: 0 0 40px rgba(255,70,85,0.22), inset 0 0 18px rgba(255,255,255,0.03);
          position: relative;
        }
        .proj-diamond span {
          position: absolute;
          inset: 12px;
          border: 0.5px solid rgba(255,70,85,0.28);
        }

        /* ═══════════════════════════════════════
           CONTENT LAYER
        ═══════════════════════════════════════ */
        .proj-content {
          position: absolute;
          inset: 0;
          padding: 22px;
          display: flex;
          flex-direction: column;
          z-index: 3;
        }

        /* Top row */
        .proj-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .proj-num {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.22);
          letter-spacing: 2.5px;
        }

        /* Pill badge for category */
        .proj-cat-pill {
          font-family: var(--font-mono);
          font-size: 9px;
          color: rgba(255, 70, 85, 0.8);
          background: rgba(255, 70, 85, 0.08);
          border: 1px solid rgba(255, 70, 85, 0.2);
          padding: 3px 10px;
          border-radius: 999px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          transition: background 0.4s ease, border-color 0.4s ease;
        }
        .proj-card:hover .proj-cat-pill {
          background: rgba(255, 70, 85, 0.15);
          border-color: rgba(255, 70, 85, 0.42);
        }

        /* Spacer */
        .proj-spacer { flex: 1; }

        /* Copy block */
        .proj-copy {
          margin-bottom: 14px;
        }
        .proj-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 8px;
        }
        .proj-title {
          font-family: var(--font-display);
          font-size: clamp(14px, 1.7vw, 20px);
          font-weight: 700;
          color: var(--white);
          margin: 0;
          letter-spacing: -0.04em;
          line-height: 1.2;
          flex: 1;
        }
        /* Underline accent animates in on hover */
        .proj-title::after {
          content: '';
          display: block;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,70,85,0.65), transparent);
          margin-top: 6px;
          transition: width 0.42s ease;
        }
        .proj-card:hover .proj-title::after { width: 55%; }

        .proj-desc {
          font-size: 11.5px;
          color: rgba(255,255,255,0.38);
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.4s ease;
        }
        .proj-card:hover .proj-desc { color: rgba(255,255,255,0.58); }

        /* Tags */
        .proj-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .proj-tag {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: rgba(255,255,255,0.38);
          border: 1px solid rgba(255,255,255,0.09);
          padding: 4px 8px;
          border-radius: 5px;
          background: rgba(255,255,255,0.025);
          letter-spacing: 0.3px;
          transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
        }
        .proj-card:hover .proj-tag {
          color: rgba(255,255,255,0.62);
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.05);
        }

        /* ═══════════════════════════════════════
           ARROW BUTTON
        ═══════════════════════════════════════ */
        .proj-arrow-btn {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          display: grid;
          place-items: center;
          color: rgba(255,255,255,0.35);
          font-size: 11px;
          text-decoration: none;
          transition:
            transform 0.38s cubic-bezier(0.2,0.9,0.1,1),
            background 0.38s ease,
            color 0.38s ease,
            border-color 0.38s ease,
            box-shadow 0.38s ease;
          cursor: pointer;
          align-self: flex-start;
        }
        .proj-arrow-primary:hover,
        .proj-card:hover .proj-arrow-primary {
          transform: rotate(45deg) scale(1.08);
          background: var(--red);
          color: #fff;
          border-color: var(--red);
          box-shadow: 0 0 18px rgba(255,70,85,0.4);
          transition: all 0.5s ease;
        }
        .proj-arrow-disabled {
          opacity: 0.18;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
