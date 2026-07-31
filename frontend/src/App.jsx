import { useState, useEffect, useRef, useCallback } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

/* ─────────────────────────────────────────
   STARFIELD CANVAS
───────────────────────────────────────── */
function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const stars = [];
    const STAR_COUNT = 160;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x:     Math.random() * canvas.width,
          y:     Math.random() * canvas.height,
          r:     Math.random() * 1.2 + 0.2,
          alpha: Math.random() * 0.6 + 0.1,
          speed: Math.random() * 0.015 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    init();

    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
function CustomCursor({ killMode }) {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e) => {
      const interactive = e.target.closest(
        'a, button, .btn, .nav-link, .social-link, .filter-btn, .project-link, .skill-card, .project-card'
      );
      ringRef.current?.classList.toggle('hovering', !!interactive);
    };

    let raf;
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouse.current.x}px`;
        dotRef.current.style.top  = `${mouse.current.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top  = `${ring.current.y}px`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${killMode ? 'kill-mode' : ''}`} />
    </>
  );
}

/* ─────────────────────────────────────────
   KILL ANIMATION OVERLAY
───────────────────────────────────────── */
function KillOverlay({ active, onDone }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, 750);
    return () => clearTimeout(t);
  }, [active, onDone]);

  return (
    <div className={`kill-overlay ${active ? 'active' : ''}`} aria-hidden="true">
      <div className="kill-scene">
        <svg width="220" height="180" viewBox="0 0 220 180" fill="none">
          <g style={{ animation: active ? 'killVictim 0.75s ease forwards' : 'none' }}>
            <ellipse cx="80" cy="70" rx="32" ry="38" fill="#cccccc"/>
            <ellipse cx="80" cy="62" rx="20" ry="15" fill="#c5e8ff" opacity="0.85"/>
            <rect x="53" y="97" width="22" height="20" rx="7" fill="#aaaaaa"/>
            <rect x="85" y="97" width="22" height="20" rx="7" fill="#aaaaaa"/>
            <rect x="100" y="55" width="16" height="26" rx="6" fill="#bbbbbb"/>
          </g>
          <g style={{ animation: active ? 'killImposter 0.75s ease forwards' : 'none' }}>
            <ellipse cx="155" cy="68" rx="30" ry="36" fill="#ff4655"/>
            <ellipse cx="155" cy="61" rx="18" ry="13" fill="#c5e8ff" opacity="0.9"/>
            <rect x="130" y="93" width="20" height="18" rx="6" fill="#cc2233"/>
            <rect x="160" y="93" width="20" height="18" rx="6" fill="#cc2233"/>
            <rect x="183" y="53" width="14" height="24" rx="5" fill="#cc2233"/>
            <line x1="118" y1="75" x2="95" y2="85"
              stroke="#ffffff" strokeWidth="3" strokeLinecap="round"
              style={{ animation: active ? 'knifeStab 0.75s ease forwards' : 'none' }}
            />
            <polygon points="95,85 88,92 98,88"
              fill="#ffffff"
              style={{ animation: active ? 'knifeStab 0.75s ease forwards' : 'none' }}
            />
          </g>
          {active && (
            <g style={{ animation: 'bloodSplat 0.75s ease forwards' }}>
              <circle cx="82" cy="80" r="4" fill="#ff4655" opacity="0.9"/>
              <circle cx="70" cy="72" r="3" fill="#ff4655" opacity="0.7"/>
              <circle cx="90" cy="90" r="2.5" fill="#ff4655" opacity="0.8"/>
              <circle cx="65" cy="85" r="2" fill="#ff4655" opacity="0.6"/>
              <circle cx="78" cy="65" r="2" fill="#ff4655" opacity="0.5"/>
            </g>
          )}
        </svg>

        <style>{`
          @keyframes killVictim {
            0%   { transform: translateX(0) rotate(0deg); opacity: 1; }
            60%  { transform: translateX(-8px) rotate(-5deg); opacity: 1; }
            100% { transform: translateX(-12px) rotate(-20deg) translateY(10px); opacity: 0.6; }
          }
          @keyframes killImposter {
            0%   { transform: translateX(0); }
            30%  { transform: translateX(-18px); }
            60%  { transform: translateX(-10px); }
            100% { transform: translateX(0); }
          }
          @keyframes knifeStab {
            0%   { opacity: 0; transform: translate(0, 0); }
            20%  { opacity: 1; transform: translate(-12px, 6px); }
            60%  { opacity: 1; transform: translate(-14px, 8px); }
            100% { opacity: 0.5; transform: translate(-10px, 5px); }
          }
          @keyframes bloodSplat {
            0%   { opacity: 0; transform: scale(0); }
            40%  { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0.8; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
   BUG FIX: Original ran with [] deps on first
   render while loading=true, so no .reveal
   elements existed yet and zero got observed.
   Fix: accept `ready` flag and re-run the
   observer only after loading completes.
───────────────────────────────────────── */
function useScrollReveal(ready) {
  useEffect(() => {
    if (!ready) return;

    // Small RAF delay so the DOM has painted
    const raf = requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            // Also animate skill bars inside revealed elements
            entry.target.querySelectorAll('.skill-bar-fill').forEach((bar) => {
              bar.classList.add('animate');
            });
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    });

    return () => cancelAnimationFrame(raf);
  }, [ready]); // re-runs when ready flips to true
}

/* ─────────────────────────────────────────
   PROJECT CARD SLIDE-IN HOOK
   Same fix: wait until ready
───────────────────────────────────────── */
function useProjectSlide(ready) {
  useEffect(() => {
    if (!ready) return;

    const raf = requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const card  = entry.target;
            const index = parseInt(card.dataset.index || '0', 10);
            setTimeout(() => card.classList.add('slide-in'), index * 90);
            observer.unobserve(card);
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll('.project-card').forEach((card, i) => {
        card.dataset.index = i;
        observer.observe(card);
      });

      return () => observer.disconnect();
    });

    return () => cancelAnimationFrame(raf);
  }, [ready]);
}

/* ─────────────────────────────────────────
   SKILL CARD SPOTLIGHT (mouse-tracking)
───────────────────────────────────────── */
function useSkillSpotlight(ready) {
  useEffect(() => {
    if (!ready) return;

    const handler = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x - 80}px`);
      card.style.setProperty('--my', `${y - 80}px`);
    };

    const cards = document.querySelectorAll('.skill-card');
    cards.forEach((c) => c.addEventListener('mousemove', handler));
    return () => cards.forEach((c) => c.removeEventListener('mousemove', handler));
  }, [ready]);
}

/* ─────────────────────────────────────────
   MAIN APP CONTENT
───────────────────────────────────────── */
function AppContent() {
  const [killActive, setKillActive] = useState(false);
  const [killMode,   setKillMode]   = useState(false);
  const pendingNav   = useRef(null);

  // Get loading state to know when DOM is ready
  const { loading } = usePortfolio();
  const ready = !loading;

  useScrollReveal(ready);
  useProjectSlide(ready);
  useSkillSpotlight(ready);

  /* Kill animation trigger */
  const triggerKill = useCallback((callback) => {
    pendingNav.current = callback;
    setKillMode(true);
    setKillActive(true);
  }, []);

  const onKillDone = useCallback(() => {
    setKillActive(false);
    setKillMode(false);
    if (pendingNav.current) {
      pendingNav.current();
      pendingNav.current = null;
    }
  }, []);

  /* Intercept anchor clicks for kill animation */
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"], a.kill-nav');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      triggerKill(() => {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [triggerKill]);

  return (
    <>
      <Starfield />
      <CustomCursor killMode={killMode} />
      <KillOverlay active={killActive} onDone={onKillDone} />

      <Navigation />

      {loading ? (
        /* Loading spinner while context fetches/falls back */
        <div style={{
          height: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: 32, height: 32,
            border: '2px solid rgba(255,70,85,0.2)',
            borderTop: '2px solid #ff4655',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--text-muted)' }}>
            LOADING CREWMATE...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
      )}

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
