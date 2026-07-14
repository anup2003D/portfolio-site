import { usePortfolio } from '../context/PortfolioContext';

export default function Experience() {
  const { experiences } = usePortfolio();

  if (!experiences.length) return null;

  return (
    <section id="experience" className="experience">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">Experience</h2>
          <div className="section-line" />
        </div>
        <div className="experience-timeline reveal-stagger">
          {experiences.map((exp) => (
            <div key={exp._id} className="experience-card">
              <div className="experience-dot" />
              <div className="experience-content">
                <div className="experience-header">
                  <h3 className="experience-position">{exp.position}</h3>
                  <span className="experience-company">{exp.company}</span>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className="experience-period">
                    <i className="far fa-calendar-alt" /> {exp.period}
                  </span>
                  {exp.location && (
                    <span className="experience-location">
                      <i className="fas fa-map-marker-alt" /> {exp.location}
                    </span>
                  )}
                </div>
                {exp.description?.length > 0 && (
                  <ul className="experience-description">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies?.length > 0 && (
                  <div className="experience-tech">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
