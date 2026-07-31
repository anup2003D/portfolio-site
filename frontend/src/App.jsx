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
import LoadingScreen from './components/LoadingScreen';

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
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const init = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.2, alpha: Math.random() * 0.6 + 0.1,
          speed: Math.random() * 0.015 + 0.005, phase: Math.random() * Math.PI * 2,
        });
      }
    };
    resize(); init();
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

/* ─────────────────────────────────────────
   CREWMATE SVG CURSOR
   Replaces the plain dot+ring with an actual
   mini Among Us crewmate shape that follows
   the mouse.
───────────────────────────────────────── */
function CrewmateCursor({ killMode }) {
  const cursorRef = useRef(null);
  const mouse     = useRef({ x: -100, y: -100 });
  const pos       = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    let raf;
    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18;
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${pos.current.x - 14}px, ${pos.current.y - 20}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  // Hide on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99999,
        pointerEvents: 'none', willChange: 'transform',
        filter: killMode
          ? 'drop-shadow(0 0 8px #ff4655) drop-shadow(0 0 20px rgba(255,70,85,0.5))'
          : 'drop-shadow(0 0 4px rgba(255,255,255,0.3))',
        transition: 'filter 0.2s ease',
      }}
    >
      <svg width="28" height="36" viewBox="0 0 60 78" fill="none">
        {/* Backpack */}
        <rect x="46" y="22" width="10" height="18" rx="4" fill={killMode ? '#8b0000' : '#555'} />
        {/* Body */}
        <ellipse cx="28" cy="30" rx="20" ry="26" fill={killMode ? '#ff4655' : '#e0e0e0'} />
        {/* Visor */}
        <ellipse cx="28" cy="25" rx="13" ry="10" fill="#c5e8ff" opacity="0.92" />
        <ellipse cx="24" cy="23" rx="5" ry="4" fill="white" opacity="0.35" />
        {/* Legs */}
        <rect x="12" y="50" width="14" height="16" rx="5" fill={killMode ? '#cc2233' : '#aaa'} />
        <rect x="30" y="50" width="14" height="16" rx="5" fill={killMode ? '#cc2233' : '#aaa'} />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   KILL ANIMATION OVERLAY
───────────────────────────────────────── */
function KillOverlay({ active, onDone }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [active, onDone]);

  return (
    <div className={`kill-overlay ${active ? 'active' : ''}`} aria-hidden="true">
      <div className="kill-scene">
        <svg width="240" height="200" viewBox="0 0 240 200" fill="none">
          {/* Victim (grey crewmate) */}
          <g style={{ animation: active ? 'killVictim 0.9s ease forwards' : 'none' }}>
            <rect x="106" y="60" width="14" height="24" rx="5" fill="#bbbbbb"/>
            <ellipse cx="82" cy="72" rx="30" ry="36" fill="#cccccc"/>
            <ellipse cx="82" cy="63" rx="19" ry="14" fill="#c5e8ff" opacity="0.85"/>
            <rect x="57" y="100" width="20" height="18" rx="6" fill="#aaaaaa"/>
            <rect x="87" y="100" width="20" height="18" rx="6" fill="#aaaaaa"/>
          </g>
          {/* Imposter (red crewmate) */}
          <g style={{ animation: active ? 'killImposter 0.9s ease forwards' : 'none' }}>
            <rect x="175" y="56" width="13" height="22" rx="4" fill="#cc2233"/>
            <ellipse cx="158" cy="70" rx="28" ry="34" fill="#ff4655"/>
            <ellipse cx="158" cy="62" rx="17" ry="12" fill="#c5e8ff" opacity="0.9"/>
            <rect x="135" y="96" width="18" height="17" rx="6" fill="#cc2233"/>
            <rect x="163" y="96" width="18" height="17" rx="6" fill="#cc2233"/>
            {/* Knife arm */}
            <line x1="132" y1="76" x2="107" y2="88" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"
              style={{ animation: active ? 'knifeStab 0.9s ease forwards' : 'none' }}/>
            <polygon points="107,88 99,96 110,91" fill="#dddddd"
              style={{ animation: active ? 'knifeStab 0.9s ease forwards' : 'none' }}/>
          </g>
          {/* Blood */}
          {active && (
            <g style={{ animation: 'bloodSplat 0.9s ease forwards' }}>
              <circle cx="85"  cy="82" r="5"   fill="#ff4655" opacity="0.95"/>
              <circle cx="72"  cy="74" r="3.5" fill="#ff4655" opacity="0.8"/>
              <circle cx="94"  cy="93" r="3"   fill="#ff4655" opacity="0.85"/>
              <circle cx="67"  cy="88" r="2.5" fill="#ff4655" opacity="0.7"/>
              <circle cx="80"  cy="65" r="2"   fill="#ff4655" opacity="0.6"/>
              <circle cx="100" cy="78" r="2"   fill="#ff4655" opacity="0.5"/>
            </g>
          )}
          {/* "DEAD" text */}
          {active && (
            <text x="120" y="160"
              textAnchor="middle"
              fill="rgba(255,70,85,0.9)"
              fontSize="18"
              fontFamily="'Orbitron', monospace"
              fontWeight="900"
              letterSpacing="4"
              style={{ animation: 'deadText 0.9s ease forwards' }}
            >
              DEAD
            </text>
          )}
        </svg>

        <style>{`
          @keyframes killVictim {
            0%   { transform: translateX(0) rotate(0deg); opacity:1; }
            50%  { transform: translateX(-10px) rotate(-8deg); opacity:1; }
            100% { transform: translateX(-14px) rotate(-25deg) translateY(12px); opacity:0.5; }
          }
          @keyframes killImposter {
            0%   { transform: translateX(0); }
            25%  { transform: translateX(-22px); }
            55%  { transform: translateX(-12px); }
            100% { transform: translateX(0); }
          }
          @keyframes knifeStab {
            0%   { opacity:0; transform:translate(0,0); }
            15%  { opacity:1; transform:translate(-16px,8px); }
            55%  { opacity:1; transform:translate(-18px,9px); }
            100% { opacity:0; transform:translate(-12px,5px); }
          }
          @keyframes bloodSplat {
            0%   { opacity:0; transform:scale(0) rotate(-20deg); }
            35%  { opacity:1; transform:scale(1.3) rotate(0deg); }
            100% { opacity:0.7; transform:scale(1) rotate(0deg); }
          }
          @keyframes deadText {
            0%   { opacity:0; transform:scale(0.5); }
            50%  { opacity:1; transform:scale(1.1); }
            100% { opacity:0.9; transform:scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   AUDIO MANAGER
   bg_music loops the whole session.
   kill_sound plays on every kill animation.
   Files live in /public/audio/
───────────────────────────────────────── */
function useAudio() {
  const bgRef   = useRef(null);
  const killRef = useRef(null);
  const [bgStarted, setBgStarted] = useState(false);

  // Initialise audio elements once
  useEffect(() => {
    bgRef.current   = new Audio('/audio/bg_music.mp3');
    killRef.current = new Audio('/audio/kill_sound.mp3');
    bgRef.current.loop   = true;
    bgRef.current.volume = 0.25;   // background music is subtle
    killRef.current.volume = 0.6;

    return () => {
      bgRef.current?.pause();
      killRef.current?.pause();
    };
  }, []);

  // Start bg music on first user interaction (browser autoplay policy)
  useEffect(() => {
    const start = () => {
      if (!bgStarted && bgRef.current) {
        bgRef.current.play().catch(() => {});
        setBgStarted(true);
        window.removeEventListener('click', start);
        window.removeEventListener('keydown', start);
      }
    };
    window.addEventListener('click',   start, { once: true });
    window.addEventListener('keydown', start, { once: true });
    return () => {
      window.removeEventListener('click',   start);
      window.removeEventListener('keydown', start);
    };
  }, [bgStarted]);

  const playKillSound = useCallback(() => {
    if (killRef.current) {
      killRef.current.currentTime = 0;
      killRef.current.play().catch(() => {});
    }
  }, []);

  return { playKillSound };
}

/* ─────────────────────────────────────────
   SCROLL REVEAL / SLIDE / SPOTLIGHT
   All hooks accept `ready` flag so they
   only observe after DOM is painted.
───────────────────────────────────────── */
function useScrollReveal(ready) {
  useEffect(() => {
    if (!ready) return;
    const raf = requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    });
    return () => cancelAnimationFrame(raf);
  }, [ready]);
}

function useProjectSlide(ready) {
  useEffect(() => {
    if (!ready) return;
    const raf = requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const i = parseInt(e.target.dataset.index || '0', 10);
            setTimeout(() => e.target.classList.add('slide-in'), i * 90);
            observer.unobserve(e.target);
          });
        },
        { threshold: 0.1 }
      );
      document.querySelectorAll('.project-card').forEach((c, i) => { c.dataset.index = i; observer.observe(c); });
      return () => observer.disconnect();
    });
    return () => cancelAnimationFrame(raf);
  }, [ready]);
}

function useSkillSpotlight(ready) {
  useEffect(() => {
    if (!ready) return;
    const handler = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left - 80}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top  - 80}px`);
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
  const [killActive,     setKillActive]     = useState(false);
  const [killMode,       setKillMode]       = useState(false);
  const [loadingDone,    setLoadingDone]    = useState(false);
  const pendingNav = useRef(null);

  const { loading } = usePortfolio();
  const ready = !loading && loadingDone;

  useScrollReveal(ready);
  useProjectSlide(ready);
  useSkillSpotlight(ready);

  const { playKillSound } = useAudio();

  /* Kill trigger */
  const triggerKill = useCallback((callback) => {
    pendingNav.current = callback;
    setKillMode(true);
    setKillActive(true);
    playKillSound();
  }, [playKillSound]);

  const onKillDone = useCallback(() => {
    setKillActive(false);
    setKillMode(false);
    if (pendingNav.current) { pendingNav.current(); pendingNav.current = null; }
  }, []);

  /* Intercept ALL interactive element clicks — anchor links AND buttons */
  useEffect(() => {
    const onClick = (e) => {
      // Anchor links that jump to a section
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        triggerKill(() => {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
        return;
      }

      // Filter buttons in the projects section (non-anchor buttons)
      const filterBtn = e.target.closest('.filter-btn');
      if (filterBtn) {
        triggerKill(() => filterBtn.click()); // re-fire after animation
        return;
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [triggerKill]);

  return (
    <>
      {/* Loading screen shown first, dismissed when its animation ends */}
      {!loadingDone && (
        <LoadingScreen onDone={() => setLoadingDone(true)} />
      )}

      <Starfield />
      <CrewmateCursor killMode={killMode} />
      <KillOverlay active={killActive} onDone={onKillDone} />
      <Navigation ready={ready} />

      {!loading && loadingDone && (
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
