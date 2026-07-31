import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

function useCounter(target, duration = 1400) {
  const [count, setCount] = useState('0');
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const match = target.match(/^(\d+)(.*)$/);
          if (!match) { setCount(target); return; }
          const num    = parseInt(match[1], 10);
          const suffix = match[2] || '';
          const start  = performance.now();
          const tick   = (now) => {
            const p    = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(num * ease) + suffix);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
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
      <span className="stat-num">{count}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function About() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;

  const stats = portfolio.stats || {};

  return (
    <section className="section about" id="about" aria-labelledby="about-heading">
      <div className="container">

        <div className="section-eyebrow reveal">
          <div className="section-eyebrow-line" />
          <span className="section-eyebrow-text">02 / Who Am I</span>
        </div>

        <div className="about-grid">

          {/* Left: text */}
          <div>
            <h2 className="section-title reveal" id="about-heading" style={{ transitionDelay: '80ms' }}>
              About <span className="accent">Me</span>
            </h2>

            <span className="about-tag reveal" style={{ transitionDelay: '120ms' }}>
              // crew member profile
            </span>

            <p className="about-text reveal" style={{ transitionDelay: '160ms' }}>
              {portfolio.about ||
                `I'm a <strong>CS graduate from Kolkata</strong> obsessed with building AI systems that actually ship.
                From published research on IoT water-quality prediction to LangChain-powered Chrome extensions,
                I turn complex data into products people use.`
              }
            </p>

            <p className="about-text reveal" style={{ transitionDelay: '200ms' }}>
              Currently building at <strong>Arohanum Elevate</strong> as an AI Developer — architecting
              influencer audit pipelines, LLM agents, and full-stack platforms.
              Actively looking for my next mission in AI/backend/data engineering.
            </p>

            <div className="about-stats reveal" style={{ transitionDelay: '280ms' }}>
              {stats.yearsExperience && (
                <StatCard value={stats.yearsExperience} label="Years Building" />
              )}
              {stats.projectsCompleted && (
                <StatCard value={stats.projectsCompleted} label="Projects Shipped" />
              )}
              {stats.usersImpacted && (
                <StatCard value={stats.usersImpacted} label="Users Impacted" />
              )}
            </div>
          </div>

          {/* Right: image */}
          <div className="about-image-wrap reveal-right" style={{ transitionDelay: '160ms' }}>
            <div className="about-image-frame">
              <img
                src={`${import.meta.env.BASE_URL}Profile_CV.jpg`}
                alt="Anup Dutta"
                loading="lazy"
              />
            </div>
            <div className="about-image-badge">
              <span>Open to work</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
