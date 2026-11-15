import { useEffect, useState } from 'react';
import './Navigation.css';

const NAV_LINKS = [
  { label: 'Home',       href: '#home'       },
  { label: 'About',      href: '#about'      },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Contact',    href: '#contact'    },
];

/*
  FIXES:
  1. Removed <MiniCrewmate /> from top-right (user asked to remove it)
  2. Removed red dot from logo — now just "ANUP" in Orbitron
  3. Active section observer now receives `ready` prop and only starts
     after the page content has fully rendered, fixing the bug where
     only "Home" ever showed as active
  4. Added hamburger menu for mobile/tablet (<=900px) — previously
     nav links were hidden with no replacement, leaving mobile users
     with no navigation at all.
*/
export default function Navigation({ ready }) {
  const [scrolled,       setScrolled]       = useState(false);
  const [activeSection,  setActiveSection]  = useState('home');
  const [mobileOpen,     setMobileOpen]     = useState(false);

  /* Glass blur effect on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile drawer on resize back to desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* Active section tracker — waits for `ready` before observing
     so sections actually exist in the DOM when we try to observe them */
  useEffect(() => {
    if (!ready) return;

    const sections = NAV_LINKS.map((l) => l.href.replace('#', ''));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ready]);

  const handleMobileNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo — plain ANUP, no red dot, no separator */}
        <a href="#home" className="nav-logo" aria-label="Back to top">
          ANUP
        </a>

        {/* Desktop navigation links */}
        <ul className="nav-links" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const sectionId = href.replace('#', '');
            const isActive  = activeSection === sectionId;
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  style={isActive ? { color: 'var(--white)' } : {}}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Hamburger button — only visible on mobile/tablet */}
        <button
          className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile backdrop overlay */}
      <div
        className={`nav-mobile-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile slide-in drawer */}
      <div
        id="mobile-nav-drawer"
        className={`nav-mobile-drawer ${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        {/* Drawer header */}
        <div className="nav-mobile-header">
          <span className="nav-mobile-logo">ANUP</span>
          <button
            className="nav-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Drawer links */}
        <ul className="nav-mobile-links" role="list">
          {NAV_LINKS.map(({ label, href }, i) => {
            const sectionId = href.replace('#', '');
            const isActive  = activeSection === sectionId;
            return (
              <li key={href} style={{ animationDelay: mobileOpen ? `${i * 55}ms` : '0ms' }}>
                <a
                  href={href}
                  className={`nav-mobile-link ${isActive ? 'active' : ''}`}
                  onClick={handleMobileNavClick}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-mobile-link-num">0{i + 1}</span>
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Drawer footer */}
        <div className="nav-mobile-footer">
          <span className="nav-mobile-footer-text">// anup dutta · built with react</span>
        </div>
      </div>
    </>
  );
}
