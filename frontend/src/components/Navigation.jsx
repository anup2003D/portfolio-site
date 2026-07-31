import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'Home',       href: '#home'       },
  { label: 'About',      href: '#about'      },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Contact',    href: '#contact'    },
];

function MiniCrewmate() {
  return (
    <svg className="nav-crewmate" viewBox="0 0 60 78" fill="none" aria-hidden="true">
      <ellipse cx="30" cy="32" rx="22" ry="28" fill="#ff4655" />
      <ellipse cx="30" cy="28" rx="14" ry="10" fill="#c5e8ff" opacity="0.9" />
      <ellipse cx="25" cy="26" rx="6" ry="4" fill="white" opacity="0.3" />
      <rect x="44" y="24" width="12" height="20" rx="5" fill="#cc2233" />
      <rect x="14" y="55" width="14" height="18" rx="5" fill="#cc2233" />
      <rect x="32" y="55" width="14" height="18" rx="5" fill="#cc2233" />
    </svg>
  );
}

export default function Navigation() {
  const [scrolled,  setScrolled]  = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  /* Scroll-aware glass effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Active section tracker */
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">

      {/* Logo */}
      <a href="#home" className="nav-logo" aria-label="Back to top">
        AN<span className="nav-logo-dot">.</span>UP
      </a>

      {/* Links */}
      <ul className="nav-links" role="list">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className={`nav-link ${activeSection === href.replace('#', '') ? 'active' : ''}`}
              style={
                activeSection === href.replace('#', '')
                  ? { color: 'var(--white)' }
                  : {}
              }
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mini crewmate mascot */}
      <MiniCrewmate />

    </nav>
  );
}
