import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { LEARNING_SCENARIOS } from '../data/learningScenarios.js';
import type { RiskLevel } from '../types/index.js';

export const LearningQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentScenario = LEARNING_SCENARIOS[currentIndex];
  const isCorrect = selectedRisk === currentScenario?.correctRisk;

  const riskOptions: { level: RiskLevel; label: string; desc: string }[] = [
    {
      level: 'HIGH',
      label: 'High Risk',
      desc: 'Likely scam or deceptive attempt requiring urgent caution',
    },
    {
      level: 'MEDIUM',
      label: 'Medium Risk',
      desc: 'Suspicious elements present, requires careful verification',
    },
    {
      level: 'LOW',
      label: 'Low Risk',
      desc: 'Standard communication, no apparent threat indicators',
    },
  ];

  const handleSubmitAnswer = () => {
    if (!selectedRisk || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedRisk === currentScenario.correctRisk) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < LEARNING_SCENARIOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedRisk(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedRisk(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <section id="learn" className="py-12 bg-[var(--bg-page)] border-b border-[var(--border-main)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-md text-xs font-medium text-[var(--brand-primary)] mb-3">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Interactive Learning Module</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Learn to spot scams
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            Test your ability to spot digital fraud warning signs through realistic Indian scenarios.
          </p>
        </div>

        {/* Completion Screen */}
        {isCompleted ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-8 text-center space-y-6 shadow-xs">
            <div className="w-16 h-16 mx-auto bg-[var(--risk-low-bg)] border border-[var(--risk-low-border)] rounded-full flex items-center justify-center text-[var(--risk-low-text)]">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Learning Module Complete
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                You correctly evaluated{' '}
                <span className="font-bold text-[var(--text-primary)]">
                  {score} of {LEARNING_SCENARIOS.length}
                </span>{' '}
                scenarios.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
              Remember: Legitimate banks never ask for OTPs via text, real employers do not charge candidate fees, and unsolicited lotteries are always fraudulent.
            </p>

            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Restart Quiz</span>
            </button>
          </div>
        ) : (
          /* Active Scenario Card */
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Progress & Category Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-main)] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--brand-primary)] font-semibold">
                  {currentScenario.category}
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {currentScenario.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">
                  Scenario {currentIndex + 1} of {LEARNING_SCENARIOS.length}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] text-[var(--brand-primary)] font-semibold">
                  Score: {score}
                </span>
              </div>
            </div>

            {/* Fictional Message Display */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-2">
                Incoming Message:
              </span>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md p-4 text-sm font-sans text-[var(--text-primary)] leading-relaxed select-all">
                &ldquo;{currentScenario.message}&rdquo;
              </div>
            </div>

            {/* Risk Selection Options */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] block">
                What risk level would you assign to this message?
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {riskOptions.map((opt) => {
                  const isSelected = selectedRisk === opt.level;
                  return (
                    <button
                      key={opt.level}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedRisk(opt.level)}
                      className={`p-3.5 text-left rounded-md border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--brand-accent)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]'
                          : 'bg-[var(--bg-card)] border-[var(--border-main)] hover:border-[var(--brand-accent-border)] text-[var(--text-secondary)]'
                      } ${isAnswerSubmitted ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-bold ${
                            opt.level === 'HIGH'
                              ? 'text-[var(--risk-high-text)]'
                              : opt.level === 'MEDIUM'
                              ? 'text-[var(--risk-med-text)]'
                              : 'text-[var(--risk-low-text)]'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]'
                              : 'border-[var(--border-main)] bg-transparent'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-btn-text)]" />}
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-tight">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Answer Action */}
            {!isAnswerSubmitted ? (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedRisk}
                  onClick={handleSubmitAnswer}
                  className="px-5 py-2.5 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] shadow-xs cursor-pointer"
                >
                  Check Answer
                </button>
              </div>
            ) : (
              /* Answer Feedback & Breakdown */
              <div className="pt-4 border-t border-[var(--border-main)] space-y-5">
                {/* Result Status Banner */}
                <div
                  className={`p-4 rounded-md border flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-[var(--risk-low-bg)] border-[var(--risk-low-border)] text-[var(--risk-low-text)]'
                      : 'bg-[var(--risk-high-bg)] border-[var(--risk-high-border)] text-[var(--risk-high-text)]'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold">
                      {isCorrect ? 'Correct Assessment!' : 'Incorrect Assessment'}
                    </h4>
                    <p className="text-xs mt-1 text-[var(--text-primary)] leading-relaxed">
                      {currentScenario.explanation}
                    </p>
                  </div>
                </div>

                {/* Warning Signs Breakdown */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md p-4 space-y-2">
                  <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[var(--brand-primary)]" aria-hidden="true" />
                    Key Warning Signs in this Message:
                  </span>
                  <ul className="space-y-1.5 pl-2">
                    {currentScenario.warningSigns.map((sign, idx) => (
                      <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                        <span className="text-[var(--brand-primary)] font-bold">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Safety Tip */}
                <div className="bg-[var(--risk-med-bg)] border border-[var(--risk-med-border)] rounded-md p-4 flex items-start gap-3 text-xs text-[var(--risk-med-text)]">
                  <Lightbulb className="w-4 h-4 text-[var(--risk-med-text)] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-[var(--text-primary)]">Safety Tip:</strong>{' '}
                    <span>{currentScenario.safetyTip}</span>
                  </div>
                </div>

                {/* Next Scenario Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] shadow-xs cursor-pointer"
                  >
                    <span>
                      {currentIndex < LEARNING_SCENARIOS.length - 1
                        ? 'Next Scenario'
                        : 'View Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
