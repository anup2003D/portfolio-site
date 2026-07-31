/* ─────────────────────────────────────────
   FOOTER — Among Us Space Station theme
   BUG FIX: This file was exporting Contact
   instead of Footer. Fixed to export the
   correct component with sleeping crewmate
   and Download CV link.
───────────────────────────────────────── */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">

      <div className="footer-logo">
        AN<span>.</span>UP
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <p className="footer-copy">
          © {year} &nbsp;·&nbsp; Built in Kolkata &nbsp;·&nbsp; All systems operational
        </p>

        {/* Download CV — kept from B&W version as requested */}
        <a
          href="/Anup_Dutta_New_Resume.pdf"
          download
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--red)',
            textDecoration: 'none',
            border: '0.5px solid rgba(255,70,85,0.4)',
            padding: '5px 14px',
            clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,70,85,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <i className="fas fa-download" aria-hidden="true" />
          Download CV
        </a>
      </div>

      {/* Sleeping crewmate with ZZZ */}
      <svg
        className="footer-crewmate"
        width="28"
        height="36"
        viewBox="0 0 60 78"
        fill="none"
        aria-hidden="true"
        title="Crewmate sleeping"
      >
        <ellipse cx="30" cy="32" rx="22" ry="28" fill="#ff4655" opacity="0.5" />
        <ellipse cx="30" cy="28" rx="14" ry="10" fill="#c5e8ff" opacity="0.4" />
        <rect x="14" y="55" width="14" height="18" rx="5" fill="#cc2233" opacity="0.5" />
        <rect x="32" y="55" width="14" height="18" rx="5" fill="#cc2233" opacity="0.5" />
        {/* ZZZ */}
        <text x="38" y="22" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">z</text>
        <text x="44" y="16" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="monospace">z</text>
        <text x="49" y="11" fill="rgba(255,255,255,0.2)" fontSize="4" fontFamily="monospace">z</text>
      </svg>

    </footer>
  );
}
