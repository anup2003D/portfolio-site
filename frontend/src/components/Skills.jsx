import { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const ICON_MAP = {
  'data-analysis':      '📊',
  'data-visualization': '📈',
  'web-development':    '⚡',
  'machine-learning':   '🤖',
};

/*
  BUG FIX: skill bars had width: s.level% set as inline style at render time,
  so they jumped to full width immediately with no animation.
  Fix: bars start at 0%, and an IntersectionObserver transitions them to
  their target width when the card enters the viewport.
*/
function useBarAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.skill-bar-fill[data-target]').forEach((bar) => {
            bar.style.width = bar.dataset.target;
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.skill-card').forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);
}

function SkillCard({ cat }) {
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (0.5 - y) * 16;
    const rotY = (x - 0.5) * 16;
    card.style.setProperty('--rot-x', `${rotX.toFixed(2)}deg`);
    card.style.setProperty('--rot-y', `${rotY.toFixed(2)}deg`);
    card.style.setProperty('--mx', `${e.clientX - rect.left - 80}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top - 80}px`);
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--rot-x', '0deg');
    card.style.setProperty('--rot-y', '0deg');
  };

  return (
    <div
      ref={cardRef}
      className="skill-card reveal"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className="skill-card-icon" aria-hidden="true">
        {ICON_MAP[cat.category] || '🔧'}
      </span>

      <h3 className="skill-card-title">{cat.categoryLabel}</h3>

      <div className="skill-tags">
        {cat.skills.map((s) => (
          <span key={s.name} className="skill-tag">{s.name}</span>
        ))}
      </div>

      {/* Skill bars — start at 0%, animate to target on scroll */}
      <div>
        {cat.skills.map((s) => (
          <div key={s.name} className="skill-bar-row">
            <div className="skill-bar-meta">
              <span className="skill-bar-name">{s.name}</span>
              <span className="skill-bar-pct">{s.level}%</span>
            </div>
            <div className="skill-bar-track">
              <div
                className="skill-bar-fill"
                data-target={`${s.level}%`}
                style={{
                  width: '0%',
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const { skillCategories } = usePortfolio();
  useBarAnimation();

  if (!skillCategories.length) return null;

  return (
    <section className="section" id="skills" aria-labelledby="skills-heading">
      <div className="container">

        <div className="section-eyebrow reveal">
          <div className="section-eyebrow-line" />
          <span className="section-eyebrow-text">03 / Arsenal</span>
        </div>

        <h2 className="section-title reveal" id="skills-heading" style={{ transitionDelay: '80ms' }}>
          Skills &amp; <span className="accent">Expertise</span>
        </h2>

        <div className="skills-grid">
          {skillCategories.map((cat) => (
            <SkillCard key={cat.category} cat={cat} />
          ))}
        </div>

      </div>
    </section>
  );
}
