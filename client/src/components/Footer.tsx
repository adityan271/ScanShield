import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, FileWarning } from 'lucide-react';

const footerLinkClass =
  'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--border-main)] py-12 text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[var(--border-main)] pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-md flex items-center justify-center text-[var(--brand-primary)]">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-base font-bold text-[var(--text-primary)]">
                ScamShield India
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              Spot the warning signs. Stay one step ahead. Open-source educational tool assisting users in identifying scam patterns and preparing cybercrime reports.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium" aria-label="Footer Navigation">
            <Link to="/analyse" className={footerLinkClass}>
              Analyse Message
            </Link>
            <Link to="/how-it-works" className={footerLinkClass}>
              How It Works
            </Link>
            <Link to="/learn" className={footerLinkClass}>
              Learn Scams
            </Link>
            <Link
              to="/report-scam"
              className="text-[var(--brand-primary)] hover:text-[var(--brand-hover)] font-semibold transition-colors inline-flex items-center gap-1"
            >
              <FileWarning className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Report a Scam</span>
            </Link>
            <Link to="/about" className={footerLinkClass}>
              About &amp; Privacy
            </Link>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:text-[var(--brand-hover)] transition-colors"
            >
              <span>Cybercrime Portal (India)</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p className="max-w-2xl leading-relaxed">
            <strong className="text-[var(--text-primary)]">Cybersecurity Disclaimer:</strong> ScamShield India is an independent educational tool. It does not provide legal, banking, or law-enforcement advice. If you suspect you have fallen victim to financial cyber fraud in India, report immediately to the National Cyber Crime Helpline by dialling <strong>1930</strong> or visiting <strong>cybercrime.gov.in</strong>.
          </p>
          <div className="whitespace-nowrap font-mono text-[11px] text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} ScamShield India
          </div>
        </div>
      </div>
    </footer>
  );
};
