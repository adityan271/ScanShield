import React from 'react';
import { ArrowDown, FileWarning, ShieldCheck, CheckCircle2, LockKeyhole, AlertCircle } from 'lucide-react';

interface HeroProps {
  onAnalyseClick: () => void;
  onReportClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyseClick, onReportClick }) => {
  return (
    <section id="hero" className="py-12 md:py-16 bg-[var(--bg-page)] border-b border-[var(--border-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-md text-xs font-medium text-[var(--brand-primary)]">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden="true" />
              <span>Cybersecurity Assistance &amp; Reporting for India</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
              Think a message might be a scam?{' '}
              <span className="text-[var(--brand-primary)]">Know what to do next.</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Analyse suspicious messages, understand potential warning signs, and prepare a report when you need to take action.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onAnalyseClick}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer"
              >
                <span>Analyse a Message</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onReportClick}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md transition-colors shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer"
              >
                <FileWarning className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden="true" />
                <span>Report a Scam</span>
              </button>
            </div>

            <div className="pt-2 flex items-start gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border-main)] p-3 rounded-md">
              <AlertCircle className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong className="text-[var(--text-primary)]">Important Notice:</strong> ScamShield is an independent educational cybersecurity tool, not a government agency. Analysing a message does not automatically file a complaint with authorities.
              </span>
            </div>
          </div>

          {/* Restrained Technical Security Graphic (Solid surface, zero glass) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-main)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-main)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-main)]"></div>
                </div>
                <div className="text-xs font-mono text-[var(--text-muted)]">scamshield.engine:v2.0</div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Heuristic Engine</span>
                  <span className="text-[var(--risk-low-text)] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Active
                  </span>
                </div>

                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Target Threat Vectors</span>
                  <span className="text-[var(--text-primary)] font-medium">OTP, UPI, KYC, Fake Jobs</span>
                </div>

                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Official Handoff</span>
                  <span className="text-[var(--brand-primary)] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> cybercrime.gov.in
                  </span>
                </div>

                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Privacy Architecture</span>
                  <span className="text-[var(--risk-low-text)] font-semibold flex items-center gap-1">
                    <LockKeyhole className="w-3.5 h-3.5" aria-hidden="true" /> In-Memory Only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
