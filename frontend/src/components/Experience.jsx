import { usePortfolio } from '../context/PortfolioContext';

export default function Experience() {
  const { experiences } = usePortfolio();
  if (!experiences.length) return null;

  return (
    <section className="section" id="experience" aria-labelledby="exp-heading">
      <div className="container">

        <div className="section-eyebrow reveal">
          <div className="section-eyebrow-line" />
          <span className="section-eyebrow-text">04 / Mission Log</span>
        </div>

        <h2 className="section-title reveal" id="exp-heading" style={{ transitionDelay: '80ms' }}>
          Work <span className="accent">Experience</span>
        </h2>

        <div className="experience-list">
          {experiences.map((exp, i) => (
            <div
              key={exp._id}
              className="exp-item reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="exp-period">
                <i className="fas fa-calendar-alt" aria-hidden="true" style={{ marginRight: 6 }} />
                {exp.period}
                {exp.location && (
                  <span style={{ marginLeft: 12, color: 'var(--text-muted)' }}>
                    · {exp.location}
                  </span>
                )}
              </div>

              <h3 className="exp-role">{exp.position}</h3>
              <p className="exp-company">{exp.company}</p>

              {Array.isArray(exp.description) && (
                <ul className="exp-bullets" aria-label="Responsibilities">
                  {exp.description.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}

              {exp.technologies?.length > 0 && (
                <div className="exp-tech">
                  {exp.technologies.map((t) => (
                    <span key={t} className="exp-tech-tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
