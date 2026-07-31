import { useEffect, useRef, useState } from 'react';

/*
  LOADING SCREEN — Among Us theme
  Shows "Welcome Crewmate" intro before the portfolio loads.
  Plays /public/audio/loading_sound.mp3 during the sequence.
  Calls onDone() when animation finishes (~3.8s).
*/
export default function LoadingScreen({ onDone }) {
  const [phase, setPhase]   = useState('intro');  // intro → text → tasks → exit
  const [tasks, setTasks]   = useState([]);
  const [barW,  setBarW]    = useState(0);
  const audioRef = useRef(null);

  const TASK_LIST = [
    'Initialising crew manifest...',
    'Scanning for impostors...',
    'Loading mission data...',
    'Calibrating visor display...',
    'All systems nominal.',
  ];

  useEffect(() => {
    // Play loading sound
    audioRef.current = new Audio('/audio/loading_sound.mp3');
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(() => {}); // silently fail if file not added yet

    // Phase timeline
    const t1 = setTimeout(() => setPhase('text'),  600);
    const t2 = setTimeout(() => setPhase('tasks'), 1200);

    // Add tasks one by one
    TASK_LIST.forEach((task, i) => {
      setTimeout(() => {
        setTasks((prev) => [...prev, task]);
        setBarW(Math.round(((i + 1) / TASK_LIST.length) * 100));
      }, 1400 + i * 360);
    });

    // Exit
    const t3 = setTimeout(() => setPhase('exit'), 1400 + TASK_LIST.length * 360 + 300);
    const t4 = setTimeout(() => {
      audioRef.current?.pause();
      onDone();
    }, 1400 + TASK_LIST.length * 360 + 1000);

    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
      audioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '32px',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.7s ease' : 'none',
        fontFamily: "'Space Grotesk', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Stars background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.7) 0%, transparent 100%),
          radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 30% 70%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 60% 50%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.7) 0%, transparent 100%),
          radial-gradient(2px 2px at 45% 90%, rgba(255,255,255,0.8) 0%, transparent 100%),
          radial-gradient(1px 1px at 15% 55%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.6) 0%, transparent 100%)
        `,
      }} />

      {/* Crewmate walking animation */}
      <div style={{
        position: 'relative',
        animation: 'crewWalk 0.5s steps(2) infinite',
        opacity: phase === 'intro' ? 0 : 1,
        transition: 'opacity 0.4s ease',
        filter: 'drop-shadow(0 0 24px rgba(255,70,85,0.5))',
      }}>
        <svg width="90" height="117" viewBox="0 0 200 260" fill="none">
          <ellipse cx="100" cy="250" rx="70" ry="10" fill="rgba(255,70,85,0.15)" />
          <rect x="143" y="88" width="32" height="52" rx="12" fill="#cc2233" />
          <ellipse cx="100" cy="110" rx="58" ry="74" fill="#ff4655" />
          <ellipse cx="100" cy="96"  rx="38" ry="28" fill="#c5e8ff" opacity="0.92" />
          <ellipse cx="90"  cy="90"  rx="16" ry="11" fill="white" opacity="0.3" />
          <circle  cx="112" cy="84"  r="4"            fill="white" opacity="0.18" />
          <ellipse cx="76"  cy="100" rx="18" ry="28"  fill="rgba(255,255,255,0.08)" />
          {/* Legs animate */}
          <rect x="52"  y="168" width="36" height="44" rx="14" fill="#cc2233"
            style={{ transformOrigin: '70px 168px', animation: 'legL 0.5s steps(2) infinite' }} />
          <rect x="112" y="168" width="36" height="44" rx="14" fill="#cc2233"
            style={{ transformOrigin: '130px 168px', animation: 'legR 0.5s steps(2) infinite' }} />
        </svg>
      </div>

      {/* Title */}
      <div style={{
        textAlign: 'center',
        opacity: phase === 'intro' ? 0 : 1,
        transform: phase === 'intro' ? 'translateY(20px)' : 'translateY(0)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        <h1 style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 'clamp(22px, 5vw, 42px)',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '4px',
          marginBottom: '8px',
        }}>
          WELCOME{' '}
          <span style={{ color: '#ff4655' }}>CREWMATE</span>
        </h1>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '12px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
        }}>
          // emergency meeting initiated
        </p>
      </div>

      {/* Task checklist */}
      <div style={{
        width: 'min(340px, 80vw)',
        opacity: phase === 'tasks' || phase === 'exit' ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        {/* Progress bar */}
        <div style={{
          height: '2px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '2px',
          marginBottom: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${barW}%`,
            background: 'linear-gradient(90deg, #ff4655, rgba(255,70,85,0.4))',
            transition: 'width 0.35s ease',
          }} />
        </div>

        {/* Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasks.map((task, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '12px',
                color: i === tasks.length - 1 && barW === 100
                  ? '#4ade80'
                  : 'rgba(255,255,255,0.6)',
                letterSpacing: '0.5px',
                animation: 'taskIn 0.25s ease forwards',
              }}
            >
              <span style={{ color: i === tasks.length - 1 && barW === 100 ? '#4ade80' : '#ff4655', fontSize: '10px' }}>
                {i === tasks.length - 1 && barW === 100 ? '✓' : '›'}
              </span>
              {task}
            </div>
          ))}
        </div>
      </div>

      {/* Skip hint */}
      <button
        onClick={onDone}
        style={{
          position: 'absolute', bottom: '28px', right: '28px',
          background: 'transparent',
          border: '0.5px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.3)',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px', letterSpacing: '2px',
          padding: '6px 14px',
          cursor: 'pointer',
          transition: 'color 0.2s ease, border-color 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
      >
        SKIP ›
      </button>

      <style>{`
        @keyframes crewWalk {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        @keyframes legL {
          0%   { transform: rotate(-15deg); }
          100% { transform: rotate(15deg); }
        }
        @keyframes legR {
          0%   { transform: rotate(15deg); }
          100% { transform: rotate(-15deg); }
        }
        @keyframes taskIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
