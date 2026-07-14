import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

/* Animated counter hook */
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState('0');
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // Extract number and suffix (e.g., "3+" → num=3, suffix="+")
          const match = target.match(/^(\d+)(.*)$/);
          if (!match) { setCount(target); return; }
          const num = parseInt(match[1], 10);
          const suffix = match[2] || '';
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(num * ease) + suffix);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatCard({ value, label }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-number">{count}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function About() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;

  const stats = portfolio.stats || {};

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">About Me</h2>
          <div className="section-line" />
        </div>
        <div className="about-content reveal">
          <p className="about-description">{portfolio.about}</p>
          <div className="about-stats reveal-stagger">
            {stats.yearsExperience && (
              <StatCard value={stats.yearsExperience} label="Years Experience" />
            )}
            {stats.projectsCompleted && (
              <StatCard value={stats.projectsCompleted} label="Projects Completed" />
            )}
            {stats.usersImpacted && (
              <StatCard value={stats.usersImpacted} label="Users Impacted" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
