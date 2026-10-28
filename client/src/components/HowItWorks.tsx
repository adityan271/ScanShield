import React from 'react';
import { ClipboardPaste, SearchCheck, FileWarning } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Analyse a suspicious message',
      description:
        'Paste any suspicious SMS, WhatsApp forward, internship letter, or payment request to check for common deception patterns.',
      icon: ClipboardPaste,
    },
    {
      step: '02',
      title: 'Review the warning signs',
      description:
        'Inspect extracted evidence, including OTP solicitations, artificial deadlines, fake prize fees, or unverified links.',
      icon: SearchCheck,
    },
    {
      step: '03',
      title: 'Prepare a report if necessary',
      description:
        'Generate an organized incident summary with screenshot evidence ready to file on India’s official cybercrime reporting portal.',
      icon: FileWarning,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 bg-[var(--bg-secondary)] border-y border-[var(--border-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            How ScamShield works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            From identifying suspicious patterns to preparing an actionable incident report.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 relative shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-md flex items-center justify-center text-[var(--brand-primary)]">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded border border-[var(--border-main)]">
                    STEP {item.step}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
