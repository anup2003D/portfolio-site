import { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import HorizontalCarousel from './HorizontalCarousel';

/*
  PROJECTS SECTION
  ─────────────────────────────────────────
  The tilt-card grid has been replaced with
  the scroll-driven HorizontalCarousel.
  Filter buttons are kept above so users can
  still narrow projects by category before
  the carousel begins.

  CHANGE POINTS:
  • scrollHeight — how tall the sticky scroll zone is (vh)
  • cardWidth / cardHeight — px dimensions of each card
  • gap — px between cards
  All three props are passed directly to HorizontalCarousel.
*/
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
    <section id="projects" aria-labelledby="projects-heading">

      {/* ── Header + filter bar ── */}
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '32px' }}>

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

        {/* Filter bar — sits above the carousel */}
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

      </div>

      {/* ── Horizontal scroll carousel ── */}
      <HorizontalCarousel
        projects={filtered}
        scrollHeight={380}
        gap={40}
        cardWidth={300}
        cardHeight={420}
      />

    </section>
  );
}
