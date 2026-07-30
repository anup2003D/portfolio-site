import { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Hero() {
  const { portfolio, loading } = usePortfolio();
  const [displayedName, setDisplayedName] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (!portfolio) return;
    const text = portfolio.name || '';
    setDisplayedName('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedName(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        // Blink cursor then hide
        setTimeout(() => setCursorVisible(false), 2000);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [portfolio]);

  // Blink cursor
  useEffect(() => {
    if (!cursorVisible) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (loading || !portfolio) return null;

  const isTyping = displayedName !== portfolio.name;

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="greeting">Hello, I'm</span>
              <span
                className="name"
                style={{
                  borderRight: isTyping ? '3px solid #ffffff' : 'none',
                }}
              >
                {displayedName}
              </span>
            </h1>
            <p className="hero-subtitle">{portfolio.title}</p>
            <p className="hero-description">{portfolio.tagline}</p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">
                <i className="fas fa-rocket" style={{ marginRight: '8px' }} />
                View My Work
              </a>
              <a href="#contact" className="btn btn-secondary">
                <i className="fas fa-paper-plane" style={{ marginRight: '8px' }} />
                Get In Touch
              </a>
            </div>
            <div className="hero-social">
              {portfolio.social?.github && (
                <a href={portfolio.social.github} className="social-link" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <i className="fab fa-github" />
                </a>
              )}
              {portfolio.social?.linkedin && (
                <a href={portfolio.social.linkedin} className="social-link" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin" />
                </a>
              )}
              {portfolio.social?.twitter && (
                <a href={portfolio.social.twitter} className="social-link" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <i className="fab fa-twitter" />
                </a>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="image-wrapper">
              <img src={`${import.meta.env.BASE_URL}Profile_CV.jpg`} alt={portfolio.name} className="profile-img" />
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow" />
        </div>
      </div>
    </section>
  );
}
