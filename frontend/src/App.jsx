import { useState, useEffect, useRef, useCallback } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
//import HorizontalCarousel from "./components/HorizontalCarousel";
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

/* CrewmateCursor removed — using default system cursor */
/* AUDIO MANAGER — DISABLED: Among_us_bgm.mp3, kill_sound.mp3 auto-start removed */

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
            <rect x="106" y="60" width="14" height="24" rx="5" fill="#bbbbbb" />
            <ellipse cx="82" cy="72" rx="30" ry="36" fill="#cccccc" />
            <ellipse cx="82" cy="63" rx="19" ry="14" fill="#c5e8ff" opacity="0.85" />
            <rect x="57" y="100" width="20" height="18" rx="6" fill="#aaaaaa" />
            <rect x="87" y="100" width="20" height="18" rx="6" fill="#aaaaaa" />
          </g>
          {/* Imposter (red crewmate) */}
          <g style={{ animation: active ? 'killImposter 0.9s ease forwards' : 'none' }}>
            <rect x="175" y="56" width="13" height="22" rx="4" fill="#cc2233" />
            <ellipse cx="158" cy="70" rx="28" ry="34" fill="#ff4655" />
            <ellipse cx="158" cy="62" rx="17" ry="12" fill="#c5e8ff" opacity="0.9" />
            <rect x="135" y="96" width="18" height="17" rx="6" fill="#cc2233" />
            <rect x="163" y="96" width="18" height="17" rx="6" fill="#cc2233" />
            {/* Knife arm */}
            <line x1="132" y1="76" x2="107" y2="88" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"
              style={{ animation: active ? 'knifeStab 0.9s ease forwards' : 'none' }} />
            <polygon points="107,88 99,96 110,91" fill="#dddddd"
              style={{ animation: active ? 'knifeStab 0.9s ease forwards' : 'none' }} />
          </g>
          {/* Blood */}
          {active && (
            <g style={{ animation: 'bloodSplat 0.9s ease forwards' }}>
              <circle cx="85" cy="82" r="5" fill="#ff4655" opacity="0.95" />
              <circle cx="72" cy="74" r="3.5" fill="#ff4655" opacity="0.8" />
              <circle cx="94" cy="93" r="3" fill="#ff4655" opacity="0.85" />
              <circle cx="67" cy="88" r="2.5" fill="#ff4655" opacity="0.7" />
              <circle cx="80" cy="65" r="2" fill="#ff4655" opacity="0.6" />
              <circle cx="100" cy="78" r="2" fill="#ff4655" opacity="0.5" />
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
   AUDIO MANAGER — DISABLED
   Among_us_bgm.mp3 and kill_sound.mp3 removed.
   kill sound functionality disabled.
   Files live in /public/audio/ [disabled]
───────────────────────────────────────── */
function useAudio(loadingDone) {
  /* const bgRef    = useRef(null);
  const killRef  = useRef(null);
  const started  = useRef(false);

  // Initialise audio elements once
  useEffect(() => {
    bgRef.current   = new Audio('/audio/Among_us_bgm.mp3');
    killRef.current = new Audio('/audio/kill_sound.mp3');
    bgRef.current.loop   = true;
    bgRef.current.volume = 0.25;   // subtle background level
    killRef.current.volume = 0.6;

    return () => {
      bgRef.current?.pause();
      killRef.current?.pause();
    };
  }, []); */

  /* // Auto-start BGM the moment the loading screen finishes.
  // The loading_sound that played during the loading screen
  // already unlocked the browser's autoplay gate, so we can
  // play without waiting for another user click.
  useEffect(() => {
    if (!loadingDone || started.current || !bgRef.current) return;
    started.current = true;
    bgRef.current.play().catch(() => {
      // Autoplay still blocked (e.g. fresh tab with no prior interaction).
      // Fall back to first click/key as a silent safety net.
      const unlock = () => {
        bgRef.current?.play().catch(() => {});
        window.removeEventListener('click',   unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('click',   unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
    });
  }, [loadingDone]); */

  /* const playKillSound = useCallback(() => {
    if (killRef.current) {
      killRef.current.currentTime = 0;
      killRef.current.play().catch(() => {});
    }
  }, []); */

  return { playKillSound: () => { } };
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

/* ─────────────────────────────────────────
   MAIN APP CONTENT
───────────────────────────────────────── */
function AppContent() {
  const [loadingDone, setLoadingDone] = useState(false);

  const { loading } = usePortfolio();
  const ready = !loading && loadingDone;

  useScrollReveal(ready);
  useProjectSlide(ready);

  /* Audio hook DISABLED — playKillSound not functional */
  {/* const { playKillSound } = useAudio(loadingDone); */ }

  return (
    <>
      {/* Loading screen shown first, dismissed when its animation ends */}
      {!loadingDone && (
        <LoadingScreen onDone={() => setLoadingDone(true)} />
      )}

      <Starfield />
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
