import { usePortfolio } from '../context/PortfolioContext';

export default function Skills() {
  const { skillCategories } = usePortfolio();

  if (!skillCategories.length) return null;

  const iconMap = {
    'data-analysis': 'fa-chart-bar',
    'data-visualization': 'fa-chart-line',
    'web-development': 'fa-code',
    'machine-learning': 'fa-brain',
  };

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">Skills & Expertise</h2>
          <div className="section-line" />
        </div>
        <div className="skills-grid reveal-stagger">
          {skillCategories.map((cat) => (
            <div key={cat.category} className="skill-card">
              <div className="skill-card-inner">
                <div className="skill-card-front">
                  <div
                    className="skill-icon"
                    style={{
                      background: cat.categoryColor
                        ? `linear-gradient(135deg, ${cat.categoryColor}, var(--neon-pink))`
                        : undefined,
                    }}
                  >
                    <i className={`fas ${iconMap[cat.category] || 'fa-cog'}`} />
                  </div>
                  <h3 className="skill-title">{cat.categoryLabel}</h3>
                  <div className="skill-tech">
                    {cat.skills.map((s) => (
                      <span key={s.name} className="tech-tag">{s.name}</span>
                    ))}
                  </div>
                </div>
                <div className="skill-card-back">
                  {cat.skills.map((s) => (
                    <div key={s.name} className="skill-bar-container">
                      <div className="skill-bar-label">
                        <span>{s.name}</span>
                        <span>{s.level}%</span>
                      </div>
                      <div className="skill-bar-track">
                        <div
                          className="skill-bar-fill"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
