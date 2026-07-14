import { usePortfolio } from '../context/PortfolioContext';

export default function Projects() {
  const { projects } = usePortfolio();

  if (!projects.length) return null;

  return (
    <section id="projects" className="portfolio">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">Featured Projects</h2>
          <div className="section-line" />
        </div>
        <div className="portfolio-grid reveal-stagger">
          {projects.map((project) => (
            <div key={project._id} className="portfolio-card">
              <div className="portfolio-image">
                <img src={project.image || '/Profile CV.jpg'} alt={project.title} />
                <div className="portfolio-overlay">
                  <div className="portfolio-links">
                    {project.demoLink && project.demoLink !== '#' && (
                      <a href={project.demoLink} className="portfolio-link" target="_blank" rel="noreferrer" aria-label="Live Demo">
                        <i className="fas fa-eye" />
                      </a>
                    )}
                    {project.githubLink && project.githubLink !== '#' && (
                      <a href={project.githubLink} className="portfolio-link" target="_blank" rel="noreferrer" aria-label="Source Code">
                        <i className="fab fa-github" />
                      </a>
                    )}
                    {/* If both are placeholder #, show a "coming soon" icon */}
                    {(!project.demoLink || project.demoLink === '#') && (!project.githubLink || project.githubLink === '#') && (
                      <span className="portfolio-link" style={{ opacity: 0.6 }} aria-label="Coming Soon">
                        <i className="fas fa-clock" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="portfolio-content">
                <h3 className="portfolio-title">{project.title}</h3>
                <p className="portfolio-description">{project.description}</p>
                <div className="portfolio-tech">
                  {project.techStack?.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="portfolio-actions">
                  <a 
                    href={project.githubLink && project.githubLink !== '#' ? project.githubLink : '#'} 
                    className="portfolio-btn" 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <i className="fab fa-github"></i> <span>Visit Github</span>
                  </a>
                  <a 
                    href={project.demoLink && project.demoLink !== '#' ? project.demoLink : '#'} 
                    className="portfolio-btn" 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <i className="fas fa-external-link-alt"></i> <span>Visit Project</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
