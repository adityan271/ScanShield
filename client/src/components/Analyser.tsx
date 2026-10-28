import React from 'react';
import {
  Search,
  RotateCcw,
  AlertTriangle,
  LockKeyhole,
  Loader2,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { SAMPLE_MESSAGES, type SampleMessage } from '../data/sampleMessages.js';

interface AnalyserProps {
  message: string;
  setMessage: (val: string) => void;
  isLoading: boolean;
  validationError: string | null;
  serverError: string | null;
  canFallbackToDemo: boolean;
  forceDemo: boolean;
  setForceDemo: (val: boolean) => void;
  onAnalyse: () => void;
  onClear: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const Analyser: React.FC<AnalyserProps> = ({
  message,
  setMessage,
  isLoading,
  validationError,
  serverError,
  canFallbackToDemo,
  forceDemo,
  setForceDemo,
  onAnalyse,
  onClear,
  textareaRef,
}) => {
  const MAX_CHARS = 5000;
  const charCount = message.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleShortcutClick = (sample: SampleMessage) => {
    setMessage(sample.text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onAnalyse();
    }
  };

  return (
    <section id="analyser" className="py-12 bg-[var(--bg-page)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Check a suspicious message
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            Paste the text below. ScamShield will look for potential warning signs and explain what you should check.
          </p>
        </div>

        {/* Shortcuts Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--brand-primary)]" aria-hidden="true" />
              <span>Sample message shortcuts:</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleShortcutClick(sample)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--brand-accent)] border border-[var(--border-main)] hover:border-[var(--brand-accent-border)] rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] disabled:opacity-50 cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Analyser Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-5 sm:p-6 shadow-xs">
          <form onSubmit={handleSubmit} noValidate>
            {/* Input Label & Counter */}
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="suspicious-message-input"
                className="text-sm font-semibold text-[var(--text-primary)]"
              >
                Message content
              </label>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono ${
                    isOverLimit ? 'text-[var(--risk-high-text)] font-bold' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                </span>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                id="suspicious-message-input"
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste the suspicious SMS, WhatsApp message, email excerpt, or job offer here..."
                disabled={isLoading}
                aria-invalid={Boolean(validationError || isOverLimit)}
                aria-describedby={
                  validationError ? 'input-error' : isOverLimit ? 'input-limit-error' : undefined
                }
                className={`w-full p-4 bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm font-sans rounded-md border resize-y focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors leading-relaxed ${
                  validationError || isOverLimit
                    ? 'border-[var(--risk-high-text)] focus:ring-[var(--risk-high-text)]'
                    : 'border-[var(--border-main)]'
                }`}
              />
            </div>

            {/* Inline Validation Error */}
            {validationError && (
              <div
                id="input-error"
                role="alert"
                className="mt-2.5 flex items-center gap-2 p-3 bg-[var(--risk-high-bg)] border border-[var(--risk-high-border)] rounded text-xs text-[var(--risk-high-text)]"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Server Error Alert */}
            {serverError && (
              <div
                role="alert"
                className="mt-2.5 p-3 bg-[var(--risk-high-bg)] border border-[var(--risk-high-border)] rounded text-xs text-[var(--risk-high-text)] space-y-2"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{serverError}</span>
                </div>
                {canFallbackToDemo && !forceDemo && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setForceDemo(true);
                        setTimeout(() => onAnalyse(), 50);
                      }}
                      className="px-3 py-1 bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--risk-high-border)] rounded text-xs text-[var(--text-primary)] font-medium cursor-pointer"
                    >
                      Retry using Demo Mode (Rule-based)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Controls Bar */}
            <div className="mt-4 pt-4 border-t border-[var(--border-main)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Mode indicator & toggle */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--brand-primary)]" aria-hidden="true" />
                  <span>Mode:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setForceDemo(!forceDemo)}
                  disabled={isLoading}
                  className={`px-2.5 py-1 rounded border font-mono transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)] cursor-pointer ${
                    forceDemo
                      ? 'bg-[var(--brand-accent)] border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  title="Toggle between Rule-based Demo Engine and Live AI Mode"
                >
                  {forceDemo ? 'Demo Mode · Rule-based' : 'Auto / Server Mode'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClear}
                  disabled={isLoading || (!message && !validationError && !serverError)}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer"
                  aria-label="Clear message input and results"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Clear</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading || isOverLimit}
                  className="px-5 py-2 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Analysing message...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" aria-hidden="true" />
                      <span>Analyse Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Privacy Reminder */}
          <div className="mt-4 pt-3 border-t border-[var(--border-main)] flex items-start gap-2 text-xs text-[var(--text-muted)]">
            <LockKeyhole className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong className="text-[var(--text-primary)]">Privacy reminder:</strong> Do not paste passwords, OTPs, full card numbers, or other sensitive information. Submitted text is processed in memory to inspect scam indicators and is not permanently stored by ScamShield.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
