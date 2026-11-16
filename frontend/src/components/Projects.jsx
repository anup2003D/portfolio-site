import { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

function ProjectCard({ project, index }) {
  const targetLink =
    project.demoLink && project.demoLink !== '#'
      ? project.demoLink
      : project.githubLink && project.githubLink !== '#'
        ? project.githubLink
        : null;

  const isGithub = targetLink && targetLink.includes('github.com');
  const hasLink = Boolean(targetLink);

  return (
    <div className="proj-card">
      {/* Noise texture overlay */}
      <div className="proj-noise" aria-hidden="true" />

      {/* Top Header: Domain Pill & Index */}
      <div className="proj-header">
        <div className="proj-cat-badge">
          <span className="proj-dot" aria-hidden="true" />
          <span className="proj-cat-text">{project.category || 'Project'}</span>
        </div>
        <span className="proj-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>

      {/* Main Content: Title & Description */}
      <div className="proj-body">
        <h3 className="proj-title">{project.title}</h3>
        <p className="proj-desc">{project.description}</p>
      </div>

      {/* Footer: Tech Stack Badges & Launch Button */}
      <div className="proj-footer">
        <div className="proj-tags">
          {project.techStack?.map((tag) => (
            <span key={tag} className="proj-tag">{tag}</span>
          ))}
        </div>

        <div className="proj-action">
          {hasLink ? (
            <a
              href={targetLink}
              target="_blank"
              rel="noreferrer"
              className="proj-btn"
              aria-label={`Visit ${project.title}`}
            >
              <span>View Project</span>
              <i className={isGithub ? 'fab fa-github' : 'fas fa-arrow-up-right-from-square'} aria-hidden="true" />
            </a>
          ) : (
            <span className="proj-btn proj-btn-disabled" title="Project link coming soon">
              <span>Coming Soon</span>
              <i className="fas fa-clock" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

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
          style={{ transitionDelay: '80ms' }}
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

        {/* Projects Grid */}
        <div className="proj-grid">
          {filtered.map((project, i) => (
            <ProjectCard key={project._id || project.title} project={project} index={i} />
          ))}
        </div>

      </div>

      <style>{`
        /* ═══════════════════════════════════════
           GRID LAYOUT
        ═══════════════════════════════════════ */
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 24px;
        }

        @media (max-width: 768px) {
          .proj-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }

        /* ═══════════════════════════════════════
           PROJECT CARD BASE
        ═══════════════════════════════════════ */
        .proj-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(12, 12, 16, 0.88);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 28px 26px;
          min-height: 290px;
          overflow: hidden;
          transition:
            opacity var(--slow) var(--ease),
            transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.35s ease,
            box-shadow 0.35s ease,
            background 0.3s ease;
          transition-delay: 0s !important;
          will-change: transform;
        }

        /* Hover: Same lift, enlargement, and ambient red backlight as skill cards */
        .proj-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 70, 85, 0.42);
          background: rgba(14, 14, 18, 0.94);
          box-shadow:
            0 0 0 1px rgba(255, 70, 85, 0.28),
            0 0 35px 8px rgba(255, 70, 85, 0.24),
            0 0 75px 20px rgba(255, 70, 85, 0.12),
            0 22px 50px -15px rgba(0, 0, 0, 0.95);
          z-index: 2;
        }

        /* Top-edge animated red line on hover */
        .proj-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--red), transparent);
          transform: scaleX(0);
          transition: transform var(--base) var(--ease);
        }
        .proj-card:hover::after {
          transform: scaleX(1);
        }

        /* Subtle noise texture */
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
           CARD HEADER (Domain badge & index)
        ═══════════════════════════════════════ */
        .proj-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .proj-cat-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 4px 12px;
          border-radius: 999px;
          background: rgba(255, 70, 85, 0.08);
          border: 1px solid rgba(255, 70, 85, 0.22);
          transition: background 0.35s ease, border-color 0.35s ease;
        }
        .proj-card:hover .proj-cat-badge {
          background: rgba(255, 70, 85, 0.14);
          border-color: rgba(255, 70, 85, 0.45);
        }

        .proj-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 6px rgba(255, 70, 85, 0.7);
        }

        .proj-cat-text {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }

        .proj-index {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.25);
          letter-spacing: 2px;
          transition: color 0.35s ease;
        }
        .proj-card:hover .proj-index {
          color: rgba(255, 70, 85, 0.6);
        }

        /* ═══════════════════════════════════════
           CARD BODY (Title & Description)
        ═══════════════════════════════════════ */
        .proj-body {
          flex: 1;
          margin-bottom: 22px;
          position: relative;
          z-index: 1;
        }

        .proj-title {
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 10px;
          letter-spacing: 0.5px;
          line-height: 1.3;
          transition: color 0.3s ease;
        }
        .proj-title::after {
          content: '';
          display: block;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--red), transparent);
          margin-top: 6px;
          transition: width 0.4s ease;
        }
        .proj-card:hover .proj-title::after {
          width: 50%;
        }

        .proj-desc {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.65;
          margin: 0;
        }

        /* ═══════════════════════════════════════
           CARD FOOTER (Tags & Action Button)
        ═══════════════════════════════════════ */
        .proj-footer {
          display: flex;
          flex-direction: column;
          gap: 18px;
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 16px;
        }

        .proj-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .proj-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-secondary);
          border: 0.5px solid var(--hull-border);
          padding: 3px 9px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.02);
          letter-spacing: 0.5px;
          transition: border-color var(--fast) ease, color var(--fast) ease, background var(--fast) ease;
        }
        .proj-card:hover .proj-tag {
          border-color: rgba(255, 70, 85, 0.28);
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 70, 85, 0.04);
        }

        /* ═══════════════════════════════════════
           VISIT PROJECT BUTTON
        ═══════════════════════════════════════ */
        .proj-action {
          display: flex;
          align-items: center;
        }

        .proj-btn {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          padding: 10px 18px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
          text-decoration: none;
          transition:
            background 0.35s ease,
            border-color 0.35s ease,
            color 0.35s ease,
            box-shadow 0.35s ease,
            transform 0.25s ease;
        }

        .proj-btn i {
          font-size: 12px;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .proj-btn:hover {
          background: linear-gradient(90deg, rgba(255, 70, 85, 0.9), rgba(211, 47, 47, 0.9));
          border-color: var(--red);
          color: #ffffff;
          box-shadow: 0 0 20px rgba(255, 70, 85, 0.4);
          transform: translateY(-2px);
        }

        .proj-btn:hover i {
          transform: translate(2px, -2px);
        }

        .proj-btn-disabled {
          opacity: 0.4;
          cursor: not-allowed;
          justify-content: center;
        }
      `}</style>
    </section>
  );
}
