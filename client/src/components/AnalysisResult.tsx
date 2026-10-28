import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Quote,
  ShieldCheck,
  Check,
  FileWarning,
} from 'lucide-react';
import type { AnalysisResult as IAnalysisResult, RiskLevel } from '../types/index.js';

interface AnalysisResultProps {
  result: IAnalysisResult | null;
  onAnalyseAnother: () => void;
  onClear: () => void;
  onLearnClick: () => void;
  onReportThisScam: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultProps> = ({
  result,
  onAnalyseAnother,
  onClear,
  onLearnClick,
  onReportThisScam,
}) => {
  // Empty State before any analysis is run
  if (!result) {
    return (
      <section className="py-8 bg-[var(--bg-page)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--bg-secondary)] border border-dashed border-[var(--border-main)] rounded-lg p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full flex items-center justify-center text-[var(--text-muted)] shadow-xs">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Your analysis will appear here
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto">
              Paste a suspicious message above or choose a sample shortcut, then click &ldquo;Analyse Message&rdquo; to review evidence and recommendations.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Visual styling parameters based on risk level using semantic variables
  const getRiskConfig = (level: RiskLevel) => {
    switch (level) {
      case 'HIGH':
        return {
          label: 'HIGH RISK',
          textColor: 'text-[var(--risk-high-text)]',
          bgColor: 'bg-[var(--risk-high-bg)]',
          borderColor: 'border-[var(--risk-high-border)]',
          badgeBg: 'bg-[var(--bg-card)]',
          icon: AlertTriangle,
        };
      case 'MEDIUM':
        return {
          label: 'MEDIUM RISK',
          textColor: 'text-[var(--risk-med-text)]',
          bgColor: 'bg-[var(--risk-med-bg)]',
          borderColor: 'border-[var(--risk-med-border)]',
          badgeBg: 'bg-[var(--bg-card)]',
          icon: AlertTriangle,
        };
      case 'LOW':
        return {
          label: 'LOW RISK',
          textColor: 'text-[var(--risk-low-text)]',
          bgColor: 'bg-[var(--risk-low-bg)]',
          borderColor: 'border-[var(--risk-low-border)]',
          badgeBg: 'bg-[var(--bg-card)]',
          icon: CheckCircle2,
        };
      case 'INSUFFICIENT_INFORMATION':
      default:
        return {
          label: 'INSUFFICIENT INFORMATION',
          textColor: 'text-[var(--risk-info-text)]',
          bgColor: 'bg-[var(--risk-info-bg)]',
          borderColor: 'border-[var(--risk-info-border)]',
          badgeBg: 'bg-[var(--bg-card)]',
          icon: Info,
        };
    }
  };

  const riskConfig = getRiskConfig(result.riskLevel);
  const RiskIcon = riskConfig.icon;

  return (
    <section id="results" className="py-8 bg-[var(--bg-page)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section A: Risk Summary Banner */}
        <div className={`p-6 rounded-lg border shadow-xs ${riskConfig.bgColor} ${riskConfig.borderColor}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[var(--border-main)]/60 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-md border border-[var(--border-main)] flex items-center justify-center ${riskConfig.badgeBg} ${riskConfig.textColor}`}
              >
                <RiskIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Assessed Risk Category
                </span>
                <h3 className={`text-xl font-bold tracking-tight ${riskConfig.textColor}`}>
                  {riskConfig.label}
                </h3>
              </div>
            </div>

            {/* Mode Tag */}
            <div>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-medium bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-secondary)]">
                {result.mode === 'live' ? 'Live AI Analysis' : 'Demo analysis · Rule-based'}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed">
            {result.summary}
          </p>
        </div>

        {/* Section B: Warning Signs Detected */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-[var(--brand-primary)]" aria-hidden="true" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Warning signs detected
            </h3>
          </div>

          {result.warningSigns.length > 0 ? (
            <div className="space-y-4">
              {result.warningSigns.map((sign, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md p-4 space-y-2.5"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[var(--brand-accent)] text-[var(--brand-primary)] border border-[var(--brand-accent-border)] mt-0.5 font-bold">
                      #{idx + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                      {sign.title}
                    </h4>
                  </div>

                  {/* Evidence quote */}
                  <div className="pl-3 border-l-3 border-[var(--brand-primary)] py-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] rounded-r flex items-start gap-2 border border-[var(--border-main)]">
                    <Quote className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-semibold text-[var(--text-primary)] mr-1">Evidence:</span>
                      <span className="font-mono text-[var(--text-primary)]">&ldquo;{sign.evidence}&rdquo;</span>
                    </div>
                  </div>

                  {/* Explanation */}
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pl-1">
                    {sign.explanation}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[var(--risk-low-bg)] border border-[var(--risk-low-border)] rounded-md p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[var(--risk-low-text)] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs sm:text-sm text-[var(--risk-low-text)]">
                <p className="font-semibold text-[var(--text-primary)]">No prominent warning signs identified</p>
                <p className="mt-1 text-[var(--text-secondary)]">
                  The submitted text does not contain common keywords or patterns typically associated with phishing or scam attempts. Always confirm unsolicited requests with the sender directly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section C: Safe Next Steps */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-[var(--risk-low-text)]" aria-hidden="true" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              What you should do next
            </h3>
          </div>

          <div className="space-y-2.5">
            {result.safeActions.map((action, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--risk-low-bg)] border border-[var(--risk-low-border)] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[var(--risk-low-text)]" aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section D: Limitations Disclaimer */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md p-4 flex items-start gap-3 text-xs text-[var(--text-muted)]">
          <Info className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="text-[var(--text-primary)]">Important Limitation:</strong> {result.limitations}
          </p>
        </div>

        {/* Section E: Result Action Buttons including Report This Scam */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onReportThisScam}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors flex items-center gap-2 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer"
            >
              <FileWarning className="w-4 h-4" aria-hidden="true" />
              <span>Report This Scam</span>
            </button>

            <button
              onClick={onAnalyseAnother}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer"
            >
              <span>Analyse Another Message</span>
              <ArrowRight className="w-4 h-4 text-[var(--text-secondary)]" aria-hidden="true" />
            </button>

            <button
              onClick={onClear}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Clear</span>
            </button>
          </div>

          <button
            onClick={onLearnClick}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-[var(--brand-primary)] bg-[var(--brand-accent)] hover:bg-[var(--brand-accent-border)] border border-[var(--brand-accent-border)] rounded-md transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Learn How to Spot Scams</span>
          </button>
        </div>
      </div>
    </section>
  );
};
