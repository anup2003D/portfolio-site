import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const ROLES = [
  'AI Developer',
  'Data Engineer',
  'ML Engineer',
  'Backend Developer',
  'LangChain Builder',
];

function CrewmateSVG({ size = 200 }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 200 260"
      fill="none"
      aria-label="Among Us crewmate character"
    >
      <ellipse cx="100" cy="250" rx="70" ry="10" fill="rgba(255,70,85,0.2)" />
      <rect x="143" y="88" width="32" height="52" rx="12" fill="#cc2233" />
      <rect x="148" y="96" width="10" height="20" rx="4" fill="rgba(255,255,255,0.12)" />
      <ellipse cx="100" cy="110" rx="58" ry="74" fill="#ff4655" />
      <ellipse cx="100" cy="96" rx="38" ry="28" fill="#c5e8ff" opacity="0.92" />
      <ellipse cx="90" cy="90" rx="16" ry="11" fill="white" opacity="0.3" className="visor-scanline" />
      <circle cx="112" cy="84" r="4" fill="white" opacity="0.18" />
      <ellipse cx="76" cy="100" rx="18" ry="28" fill="rgba(255,255,255,0.08)" />
      <rect x="52" y="168" width="36" height="44" rx="14" fill="#cc2233" />
      <rect x="56" y="174" width="12" height="20" rx="5" fill="rgba(255,255,255,0.12)" />
      <rect x="112" y="168" width="36" height="44" rx="14" fill="#cc2233" />
      <rect x="116" y="174" width="12" height="20" rx="5" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}

export default function Hero() {
  const { portfolio, loading } = usePortfolio();

  const [displayName,  setDisplayName]  = useState('');
  const [nameComplete, setNameComplete] = useState(false);
  const [roleIndex,    setRoleIndex]    = useState(0);
  const [displayRole,  setDisplayRole]  = useState('');
  const [roleTyping,   setRoleTyping]   = useState(true);

  const crewmateRef = useRef(null);
  const heroRef     = useRef(null);
  const scrollRef   = useRef(0);

  /* ── Name typewriter ── */
  useEffect(() => {
    if (!portfolio?.name) return;
    const name = portfolio.name;
    let i = 0;
    setDisplayName('');
    setNameComplete(false);

    const t = setInterval(() => {
      setDisplayName(name.slice(0, i + 1));
      i++;
      if (i >= name.length) {
        clearInterval(t);
        setNameComplete(true);
      }
    }, 75);

    return () => clearInterval(t);
  }, [portfolio]);

  /* ── Role cycling typewriter ── */
  useEffect(() => {
    if (!nameComplete) return;

    const role = ROLES[roleIndex];
    let i = 0;
    setDisplayRole('');
    setRoleTyping(true);

    const typeIn = setInterval(() => {
      setDisplayRole(role.slice(0, i + 1));
      i++;
      if (i >= role.length) {
        clearInterval(typeIn);
        setRoleTyping(false);

        const pause = setTimeout(() => {
          let j = role.length;
          const erase = setInterval(() => {
            setDisplayRole(role.slice(0, j - 1));
            j--;
            if (j <= 0) {
              clearInterval(erase);
              setRoleIndex((prev) => (prev + 1) % ROLES.length);
              setRoleTyping(true);
            }
          }, 40);
        }, 2000);

        return () => clearTimeout(pause);
      }
    }, 65);

    return () => clearInterval(typeIn);
  }, [nameComplete, roleIndex]);

  /* ── Mouse parallax / cursor tilt on crewmate ── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      const tiltX = dy * -8;
      const tiltY = dx *  8;
      const moveX = dx * 14;
      const moveY = dy * 8;

      if (crewmateRef.current) {
        crewmateRef.current.style.transform =
          `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate(${moveX}px, ${moveY}px)`;
      }
    };

    const onLeave = () => {
      if (crewmateRef.current) {
        crewmateRef.current.style.transform =
          'perspective(800px) rotateX(0deg) rotateY(0deg) translate(0, 0)';
      }
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  /* ── Scroll parallax ── */
  useEffect(() => {
    let raf;
    const onScroll = () => { scrollRef.current = window.scrollY; };

    const animate = () => {
      const sy   = scrollRef.current;
      const hero = heroRef.current;
      if (hero) {
        const textEl = hero.querySelector('.hero-text');
        if (textEl) textEl.style.transform = `translateY(${sy * 0.25}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (loading) return null;

  const name    = portfolio?.name    || 'Anup Dutta';
  const tagline = portfolio?.tagline || 'Turning data into products that matter.';
  const social  = portfolio?.social  || {};

  const parts    = name.split(' ');
  const first    = parts[0]  || '';
  const last     = parts.slice(1).join(' ') || '';
  const firstDone = displayName.length >= first.length;
  const shownLast = firstDone ? displayName.slice(first.length + 1) : '';

  return (
    <section className="hero" id="home" ref={heroRef} aria-label="Hero section">

      <div className="hero-ambient" aria-hidden="true" />

      {/* Decorative grid */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,70,85,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,70,85,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
      }} />

      <div className="hero-inner">

        {/* ── LEFT: Text ── */}
        <div className="hero-text">

          <div className="hero-eyebrow reveal">
            <div className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">// emergency meeting called</span>
          </div>

          <h1 className="hero-name reveal" style={{ transitionDelay: '100ms' }}>
            <span className="first">
              {firstDone ? first : displayName}
              {!firstDone && <span className="hero-cursor" aria-hidden="true" />}
            </span>
            <span className="last" style={{ color: 'var(--red)' }}>
              {firstDone ? shownLast : ''}
              {firstDone && !nameComplete && <span className="hero-cursor" aria-hidden="true" />}
            </span>
          </h1>

          <p className="hero-role reveal" style={{ transitionDelay: '180ms' }}>
            &gt;&nbsp;
            <span className="rotating-role">{displayRole}</span>
            <span className="hero-cursor" aria-hidden="true" style={{ opacity: roleTyping ? 1 : 0 }} />
          </p>

          <p className="hero-desc reveal" style={{ transitionDelay: '240ms' }}>
            {tagline}{' '}LangChain agents, ML pipelines, and full-stack platforms —
            built by a CS grad from Kolkata who ships.
          </p>

          {/*
            BUG FIX: Hero previously had no visible Resume button in the button row.
            The resume link was hidden as an icon-only social-link.
            Added a proper "Download Resume" button matching the B&W version behaviour.
          */}
          <div className="hero-btns reveal" style={{ transitionDelay: '320ms' }}>
            <a href="#projects" className="btn btn-primary">
              <i className="fas fa-rocket" aria-hidden="true" />
              View Work
            </a>
            <a href="#contact" className="btn btn-outline">
              <i className="fas fa-paper-plane" aria-hidden="true" />
              Get In Touch
            </a>
            <a
              href="/Anup_Dutta_New_Resume.pdf"
              className="btn btn-outline"
              target="_blank"
              rel="noreferrer"
              download
            >
              <i className="fas fa-file-alt" aria-hidden="true" />
              Resume
            </a>
          </div>

          <div className="hero-socials reveal" style={{ transitionDelay: '400ms' }}>
            {social.github && (
              <a href={social.github} className="social-link" target="_blank" rel="noreferrer" aria-label="GitHub">
                <i className="fab fa-github" aria-hidden="true" />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} className="social-link" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" aria-hidden="true" />
              </a>
            )}
          </div>

        </div>

        {/* ── RIGHT: Crewmate ── */}
        <div className="crewmate-wrap reveal-right" style={{ transitionDelay: '200ms' }}>
          <div className="crewmate-bob">
            <div
              ref={crewmateRef}
              className="crewmate-svg-wrap"
              style={{ transition: 'transform 0.8s ease-out' }}
            >
              <CrewmateSVG size={200} />
            </div>
          </div>
          <div className="crewmate-glow-ring" aria-hidden="true" />
        </div>

      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <span className="scroll-text">scroll</span>
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>

    </section>
  );
}
