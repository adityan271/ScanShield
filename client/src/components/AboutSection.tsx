import React from 'react';
import {
  ShieldCheck,
  AlertCircle,
  LockKeyhole,
  HelpCircle,
  FileSearch,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 bg-[var(--bg-secondary)] border-b border-[var(--border-main)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-md text-xs font-medium text-[var(--brand-primary)] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Product Disclosure &amp; Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            About ScamShield India
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            Understanding our analysis methodology, limitations, and commitment to user privacy.
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-6">
          {/* What ScamShield Does */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden="true" />
              What ScamShield Does
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              ScamShield India helps individuals identify potential red flags in digital messages. People receive hundreds of suspicious SMS texts, WhatsApp forwards, fake job offers, and payment demands. ScamShield highlights the specific elements of a message that indicate risk—such as demands for OTPs, upfront registration fees, or artificial deadlines—and explains why they matter.
            </p>
          </div>

          {/* How Analysis Works */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden="true" />
              How Analysis Works
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              <p>
                <strong className="text-[var(--text-primary)]">1. Demo Mode (Rule-based Heuristic Engine):</strong> Runs entirely on deterministic pattern-matching rules covering common Indian scam tactics (e.g. KYC suspension threats, KBC lottery scams, electricity bill disconnection, and fake courier messages). It operates at zero software cost and without an API key.
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">2. Live AI Mode:</strong> When configured with an AI provider key on the backend, ScamShield sends the message to a structured language model for deep semantic evaluation. Live results are always explicitly labelled as such.
              </p>
            </div>
          </div>

          {/* Meaning of Risk Categories */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Understanding Risk Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-[var(--risk-high-bg)] border border-[var(--risk-high-border)] rounded-md">
                <span className="text-xs font-bold text-[var(--risk-high-text)] uppercase tracking-wider block mb-1">
                  High Risk
                </span>
                <p className="text-xs text-[var(--text-secondary)]">
                  Strong scam indicators detected, such as credential or OTP solicitation, advance fees, or threats of suspension.
                </p>
              </div>

              <div className="p-3.5 bg-[var(--risk-med-bg)] border border-[var(--risk-med-border)] rounded-md">
                <span className="text-xs font-bold text-[var(--risk-med-text)] uppercase tracking-wider block mb-1">
                  Medium Risk
                </span>
                <p className="text-xs text-[var(--text-secondary)]">
                  Unusual patterns or potential pressure tactics observed. Requires independent cross-verification before taking action.
                </p>
              </div>

              <div className="p-3.5 bg-[var(--risk-low-bg)] border border-[var(--risk-low-border)] rounded-md">
                <span className="text-xs font-bold text-[var(--risk-low-text)] uppercase tracking-wider block mb-1">
                  Low Risk
                </span>
                <p className="text-xs text-[var(--text-secondary)]">
                  No prominent warning signs found. However, low risk does not guarantee complete authenticity or safety.
                </p>
              </div>

              <div className="p-3.5 bg-[var(--risk-info-bg)] border border-[var(--risk-info-border)] rounded-md">
                <span className="text-xs font-bold text-[var(--risk-info-text)] uppercase tracking-wider block mb-1">
                  Insufficient Information
                </span>
                <p className="text-xs text-[var(--text-secondary)]">
                  The text is too brief or lacks sufficient context to identify scam indicators with reasonable confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Critical Limitations & What We Cannot Verify */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--risk-med-text)]" aria-hidden="true" />
              Critical Limitations
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--brand-primary)] font-bold mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">Sender Authenticity:</strong> ScamShield only examines the text content pasted by the user. It cannot verify telecommunication headers, caller identity, or technical SMS routing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--brand-primary)] font-bold mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">No Legal Proof of Fraud:</strong> An assessment is an educational risk evaluation, not definitive legal proof that a sender is fraudulent.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--brand-primary)] font-bold mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--text-primary)]">Independent Verification is Crucial:</strong> Never use a phone number or link contained inside a suspicious message to verify that message. Always visit the institution&rsquo;s verified website independently.
                </span>
              </li>
            </ul>
          </div>

          {/* Privacy Statement */}
          <div className="bg-[var(--bg-card)] border border-[var(--brand-accent-border)] rounded-lg p-6 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <LockKeyhole className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden="true" />
              Privacy Statement
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              ScamShield does not save message history or report data to any database. In live mode, submitted text is sent to the configured AI provider for analysis and is subject to that provider&rsquo;s processing policies. In demo mode and report preparation, information is handled strictly in your browser and local memory without persistent storage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
