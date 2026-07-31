import { useEffect, useState } from 'react';

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
*/
export default function Navigation({ ready }) {
  const [scrolled,       setScrolled]       = useState(false);
  const [activeSection,  setActiveSection]  = useState('home');

  /* Glass blur effect on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Active section tracker — waits for `ready` before observing
     so sections actually exist in the DOM when we try to observe them */
  useEffect(() => {
    if (!ready) return;

    const sections = NAV_LINKS.map((l) => l.href.replace('#', ''));

    // Use a slightly generous rootMargin so the active state changes
    // just before the section reaches the middle of the screen
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

  return (
    <nav
      className={`nav ${scrolled ? 'scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo — plain ANUP, no red dot, no separator */}
      <a href="#home" className="nav-logo" aria-label="Back to top">
        ANUP
      </a>

      {/* Navigation links */}
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
    </nav>
  );
}
