import { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

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

        <h2 className="section-title reveal" id="projects-heading" style={{ transitionDelay: '80ms' }}>
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

        {/* Grid — slide-in animation handled by useProjectSlide in App.jsx */}
        <div className="projects-grid">
          {filtered.map((project) => (
            <article key={project._id} className="project-card">

              <div className="project-category">{project.category || 'Project'}</div>

              <h3 className="project-title">{project.title}</h3>

              <p className="project-desc">{project.description}</p>

              {project.techStack?.length > 0 && (
                <div className="project-chips">
                  {project.techStack.map((t) => (
                    <span key={t} className="project-chip">{t}</span>
                  ))}
                </div>
              )}

              <div className="project-links">
                {project.githubLink && project.githubLink !== '#' && (
                  <a
                    href={project.githubLink}
                    className="project-link"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} GitHub repository`}
                  >
                    <i className="fab fa-github" aria-hidden="true" />
                    GitHub
                  </a>
                )}
                {project.demoLink && project.demoLink !== '#' && (
                  <a
                    href={project.demoLink}
                    className="project-link"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} live demo`}
                  >
                    <i className="fas fa-external-link-alt" aria-hidden="true" />
                    Live Demo
                  </a>
                )}
                {(!project.githubLink || project.githubLink === '#') &&
                 (!project.demoLink   || project.demoLink   === '#') && (
                  <span className="project-link" style={{ opacity: 0.4 }}>
                    <i className="fas fa-clock" aria-hidden="true" />
                    Coming Soon
                  </span>
                )}
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
