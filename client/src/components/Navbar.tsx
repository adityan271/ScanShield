import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, FileWarning } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.js';

const navLinkClass = (isActive: boolean) =>
  `px-3.5 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] ${
    isActive
      ? 'text-[var(--brand-primary)] bg-[var(--brand-accent)] font-semibold'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
  }`;

const mobileNavLinkClass = (isActive: boolean) =>
  `block w-full text-left px-3 py-2.5 text-base font-medium rounded-md ${
    isActive
      ? 'text-[var(--brand-primary)] bg-[var(--brand-accent)] font-semibold'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
  }`;

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomeSection = location.pathname !== '/report-scam';

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-card)] border-b border-[var(--border-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] rounded-md py-1 px-1.5"
            aria-label="ScamShield India Home"
          >
            <div className="w-9 h-9 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-lg flex items-center justify-center text-[var(--brand-primary)]">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                ScamShield
              </span>
              <span className="text-xs font-semibold text-[var(--brand-primary)] ml-1.5 px-1.5 py-0.5 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded">
                India
              </span>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            <NavLink
              to="/analyse"
              className={({ isActive }) => navLinkClass(isActive || (isHomeSection && location.pathname === '/'))}
            >
              Analyse
            </NavLink>
            <NavLink to="/how-it-works" className={({ isActive }) => navLinkClass(isActive)}>
              How It Works
            </NavLink>
            <NavLink to="/learn" className={({ isActive }) => navLinkClass(isActive)}>
              Learn
            </NavLink>
            <NavLink to="/report-scam" className={({ isActive }) => navLinkClass(isActive)}>
              Report a Scam
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => navLinkClass(isActive)}>
              About
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/report-scam"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-primary)]"
            >
              <FileWarning className="w-4 h-4" aria-hidden="true" />
              <span>Report a Scam</span>
            </NavLink>

            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border-main)] px-4 pt-2 pb-4 space-y-2">
          <NavLink
            to="/analyse"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              mobileNavLinkClass(isActive || (isHomeSection && location.pathname === '/'))
            }
          >
            Analyse
          </NavLink>
          <NavLink
            to="/how-it-works"
            onClick={closeMobileMenu}
            className={({ isActive }) => mobileNavLinkClass(isActive)}
          >
            How It Works
          </NavLink>
          <NavLink
            to="/learn"
            onClick={closeMobileMenu}
            className={({ isActive }) => mobileNavLinkClass(isActive)}
          >
            Learn to Spot Scams
          </NavLink>
          <NavLink
            to="/report-scam"
            onClick={closeMobileMenu}
            className={({ isActive }) => mobileNavLinkClass(isActive)}
          >
            Report a Scam
          </NavLink>
          <NavLink
            to="/about"
            onClick={closeMobileMenu}
            className={({ isActive }) => mobileNavLinkClass(isActive)}
          >
            About ScamShield
          </NavLink>
          <div className="pt-2">
            <NavLink
              to="/report-scam"
              onClick={closeMobileMenu}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md shadow-xs"
            >
              <FileWarning className="w-4 h-4" aria-hidden="true" />
              <span>Report a Scam</span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
