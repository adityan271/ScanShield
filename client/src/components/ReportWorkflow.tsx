import React, { useState, useRef } from 'react';
import {
  FileWarning,
  Upload,
  X,
  Copy,
  Download,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  LockKeyhole,
  PhoneCall,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react';
import type {
  ReportFormData,
  ScreenshotEvidence,
  MoneyTransferredOption,
  PaymentMethodOption,
} from '../types/index.js';
import { useReportForm } from '../context/ReportFormContext.js';
import { useNavigate } from 'react-router-dom';

const INDIAN_STATES_AND_UTS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other / Outside India',
];

const INCIDENT_TYPES = [
  'Suspicious message or phishing',
  'Fake job or internship offer',
  'Online payment or UPI fraud',
  'Bank or account impersonation',
  'Prize or reward scam',
  'Social media scam',
  'Identity theft',
  'Other',
  'Not sure',
];

const PLATFORMS = [
  'SMS',
  'WhatsApp',
  'Email',
  'Phone call',
  'Instagram',
  'Facebook',
  'Telegram',
  'Website',
  'Online marketplace',
  'Other',
  'Not sure',
];

export const ReportWorkflow: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    updateField: updateFormField,
    resetForm,
    hasUserData,
    draftStorageError,
  } = useReportForm();

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copySuccessToast, setCopySuccessToast] = useState(false);
  const [showManualCopyModal, setShowManualCopyModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateField = <K extends keyof ReportFormData>(
    field: K,
    value: ReportFormData[K]
  ) => {
    updateFormField(field, value);
    if (validationErrors[field as string]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleStartNewReport = () => {
    if (hasUserData) {
      const confirmed = window.confirm(
        'Start a new report? The details and screenshots entered in this session will be cleared.'
      );
      if (!confirmed) {
        return;
      }
    }
    resetForm();
    setValidationErrors({});
    setUploadError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Screenshot upload validation & handler
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxFiles = 5;
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    const currentCount = formData.screenshots.length;
    if (currentCount >= maxFiles) {
      setUploadError(`Maximum limit of ${maxFiles} screenshots has already been reached.`);
      return;
    }

    const newScreenshots: ScreenshotEvidence[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (currentCount + newScreenshots.length >= maxFiles) {
        setUploadError(`Only up to ${maxFiles} screenshots can be attached. Remaining files were skipped.`);
        break;
      }

      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setUploadError(`"${file.name}" is not a supported format. Please upload PNG, JPG, or WEBP images.`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        setUploadError(`"${file.name}" exceeds the 5 MB size limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newScreenshots.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
      });
    }

    if (newScreenshots.length > 0) {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, ...newScreenshots],
      }));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveScreenshot = (id: string) => {
    setFormData((prev) => {
      const target = prev.screenshots.find((s) => s.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return {
        ...prev,
        screenshots: prev.screenshots.filter((s) => s.id !== id),
      };
    });
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.incidentType.trim()) {
        errors.incidentType = 'Please select the type of incident.';
      }
      if (!formData.platform.trim()) {
        errors.platform = 'Please select the platform where this occurred.';
      }
      if (!formData.description.trim()) {
        errors.description = 'Please describe what occurred in the incident.';
      } else if (formData.description.trim().length < 10) {
        errors.description = 'Please provide a little more detail (at least 10 characters).';
      }
      if (formData.suspiciousUrl.trim()) {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
        if (!urlPattern.test(formData.suspiciousUrl.trim())) {
          errors.suspiciousUrl = 'Please enter a valid website address (e.g. https://example.com).';
        }
      }
    }

    if (step === 2) {
      if (formData.suspiciousMessage.length > 5000) {
        errors.suspiciousMessage = 'Message cannot exceed 5,000 characters.';
      }
    }

    if (step === 4) {
      if (formData.moneyTransferred === 'yes') {
        if (!formData.amountLost.trim()) {
          errors.amountLost = 'Please enter the approximate amount lost in INR.';
        } else {
          const num = Number(formData.amountLost.replace(/,/g, ''));
          if (isNaN(num) || num < 0) {
            errors.amountLost = 'Please enter a valid non-negative number.';
          }
        }
      }
    }

    if (step === 5) {
      if (!formData.reviewedAndConfirmed) {
        errors.reviewedAndConfirmed =
          'You must confirm that you reviewed this report and understand ScamShield is not filing the complaint directly.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep < 6) {
      handleNextStep();
    }
  };

  const handlePrevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleJumpToStep = (step: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(step);
  };

  // Compile structured plain-text report summary
  const generateReportSummaryText = (): string => {
    const lines: string[] = [];
    lines.push('================================================================');
    lines.push('SCAMSHIELD INDIA — INCIDENT REPORT SUMMARY');
    lines.push('Prepared locally for user submission on cybercrime.gov.in');
    lines.push('================================================================\n');

    lines.push(`Date Prepared: ${new Date().toLocaleString('en-IN')}`);
    lines.push(`Incident Category: ${formData.incidentType || 'Not specified'}`);
    lines.push(`Platform / Medium: ${formData.platform || 'Not specified'}`);
    lines.push(`Incident Date: ${formData.incidentDate || 'Approximate / Unknown'}`);
    if (formData.stateOrUt) {
      lines.push(`Location (State/UT): ${formData.stateOrUt}`);
    }
    if (formData.senderDetails) {
      lines.push(`Sender / Contact Details: ${formData.senderDetails}`);
    }
    if (formData.suspiciousUrl) {
      lines.push(`Suspicious URL / Link: ${formData.suspiciousUrl}`);
    }

    lines.push('\n----------------------------------------------------------------');
    lines.push('INCIDENT DESCRIPTION:');
    lines.push('----------------------------------------------------------------');
    lines.push(formData.description || 'None provided');

    if (formData.suspiciousMessage) {
      lines.push('\n----------------------------------------------------------------');
      lines.push('SUSPICIOUS MESSAGE / TEXT CONTENT:');
      lines.push('----------------------------------------------------------------');
      lines.push(formData.suspiciousMessage);
    }

    if (formData.includeAiObservations && formData.aiObservationsText) {
      lines.push('\n----------------------------------------------------------------');
      lines.push('SCAMSHIELD AI-ASSISTED OBSERVATIONS (EDUCATIONAL HEURISTIC):');
      lines.push('----------------------------------------------------------------');
      lines.push(formData.aiObservationsText);
      lines.push('(Note: These observations are educational indicators, not verified legal proof)');
    }

    lines.push('\n----------------------------------------------------------------');
    lines.push('FINANCIAL DETAILS:');
    lines.push('----------------------------------------------------------------');
    if (formData.moneyTransferred === 'yes') {
      lines.push(`Money Transferred: Yes`);
      lines.push(`Approximate Amount Lost: INR ${formData.amountLost}`);
      if (formData.transactionDate) {
        lines.push(`Transaction Date: ${formData.transactionDate}`);
      }
      lines.push(`Payment Method: ${formData.paymentMethod}`);
      if (formData.transactionReference) {
        lines.push(`Transaction Reference / UTR: ${formData.transactionReference}`);
      }
    } else if (formData.moneyTransferred === 'no') {
      lines.push('Money Transferred: No financial loss reported');
    } else {
      lines.push(`Money Transferred: ${formData.moneyTransferred}`);
    }

    lines.push('\n----------------------------------------------------------------');
    lines.push('ATTACHED EVIDENCE SCREENSHOTS:');
    lines.push('----------------------------------------------------------------');
    if (formData.screenshots.length > 0) {
      formData.screenshots.forEach((s, idx) => {
        lines.push(
          `${idx + 1}. ${s.name} (${(s.size / (1024 * 1024)).toFixed(2)} MB)`
        );
      });
      lines.push('\nImportant: Attach your original image files directly when filing on cybercrime.gov.in.');
    } else {
      lines.push('No screenshots attached in this summary.');
    }

    lines.push('\n================================================================');
    lines.push('IMPORTANT NOTICE & DISCLAIMER:');
    lines.push('Prepared using ScamShield India. This document is a user-prepared');
    lines.push('summary and is NOT an official government complaint or police');
    lines.push('acknowledgement. You must file and submit your complaint on the');
    lines.push('National Cyber Crime Reporting Portal at https://cybercrime.gov.in/');
    lines.push('For immediate cyber financial fraud in India, dial 1930.');
    lines.push('================================================================');

    return lines.join('\n');
  };

  // Copy to clipboard
  const handleCopyReport = async () => {
    const text = generateReportSummaryText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopySuccessToast(true);
        setTimeout(() => setCopySuccessToast(false), 3000);
      } else {
        setShowManualCopyModal(true);
      }
    } catch {
      setShowManualCopyModal(true);
    }
  };

  // Download plain text file
  const handleDownloadReport = () => {
    const text = generateReportSummaryText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scamshield-report-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stepsList = [
    { num: 1, title: 'Incident Details' },
    { num: 2, title: 'Suspicious Message' },
    { num: 3, title: 'Evidence' },
    { num: 4, title: 'Financial Loss' },
    { num: 5, title: 'Review & Confirm' },
    { num: 6, title: 'Portal Handoff' },
  ];

  return (
    <div className="py-10 bg-[var(--bg-page)] min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <p
          className="text-xs text-[var(--text-muted)]"
          role={draftStorageError ? 'alert' : undefined}
        >
          {draftStorageError ||
            'Your report text is saved in this browser tab until you close it. Uploaded screenshots are kept in memory and must be reattached after a reload.'}
        </p>

        {/* Header & Return Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-main)] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-md text-xs font-semibold text-[var(--brand-primary)] mb-2">
              <FileWarning className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Report Preparation Workflow</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Prepare a Scam Incident Report
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Organise your evidence and details into a structured complaint ready for India&rsquo;s official Cybercrime Portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleStartNewReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Start New Report</span>
            </button>
            <button
              type="button"
              onClick={handleBackToHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Progress Step Indicator */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-lg p-4" aria-label="Report Steps">
          <div className="hidden sm:grid grid-cols-6 gap-2 text-center">
            {stepsList.map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  className={`px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive
                      ? 'bg-[var(--brand-primary)] text-[var(--brand-btn-text)] font-semibold shadow-xs'
                      : isPast
                      ? 'bg-[var(--brand-accent)] text-[var(--brand-primary)] font-medium'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  <div className="font-mono text-[11px]">Step {step.num}</div>
                  <div className="truncate">{step.title}</div>
                </div>
              );
            })}
          </div>

          <div className="sm:hidden flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
            <span>
              Step {currentStep} of 6: {stepsList[currentStep - 1]?.title}
            </span>
            <span className="text-[var(--brand-primary)] font-mono">
              {Math.round((currentStep / 6) * 100)}%
            </span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} noValidate>
        {/* STEP 1: Incident Details */}
        {currentStep === 1 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[var(--border-main)] pb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                1. Incident Details
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Specify the nature of the scam, the platform where it was received, and what happened.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Type of Incident */}
              <div>
                <label
                  htmlFor="incident-type-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                >
                  Type of incident <span className="text-[var(--risk-high-text)]">*</span>
                </label>
                <select
                  id="incident-type-select"
                  value={formData.incidentType}
                  onChange={(e) => updateField('incidentType', e.target.value)}
                  className={`w-full p-2.5 bg-[var(--bg-input)] border rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] ${
                    validationErrors.incidentType ? 'border-[var(--risk-high-text)]' : 'border-[var(--border-main)]'
                  }`}
                >
                  <option value="">Select incident category...</option>
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {validationErrors.incidentType && (
                  <p className="text-xs text-[var(--risk-high-text)] mt-1">{validationErrors.incidentType}</p>
                )}
              </div>

              {/* Platform */}
              <div>
                <label
                  htmlFor="platform-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                >
                  Platform or channel <span className="text-[var(--risk-high-text)]">*</span>
                </label>
                <select
                  id="platform-select"
                  value={formData.platform}
                  onChange={(e) => updateField('platform', e.target.value)}
                  className={`w-full p-2.5 bg-[var(--bg-input)] border rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] ${
                    validationErrors.platform ? 'border-[var(--risk-high-text)]' : 'border-[var(--border-main)]'
                  }`}
                >
                  <option value="">Select platform...</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {validationErrors.platform && (
                  <p className="text-xs text-[var(--risk-high-text)] mt-1">{validationErrors.platform}</p>
                )}
              </div>

              {/* Incident Date */}
              <div>
                <label
                  htmlFor="incident-date-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                >
                  Date of incident <span className="text-[var(--risk-high-text)]">*</span>
                </label>
                <input
                  type="date"
                  id="incident-date-input"
                  value={formData.incidentDate}
                  onChange={(e) => updateField('incidentDate', e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
                <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                  Select approximate date if exact date is unknown.
                </span>
              </div>

              {/* State / UT */}
              <div>
                <label
                  htmlFor="state-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                >
                  State / Union Territory <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                </label>
                <select
                  id="state-select"
                  value={formData.stateOrUt}
                  onChange={(e) => updateField('stateOrUt', e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                >
                  <option value="">Select state/UT where incident occurred...</option>
                  {INDIAN_STATES_AND_UTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Incident Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="incident-desc-input"
                  className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]"
                >
                  Description of the incident <span className="text-[var(--risk-high-text)]">*</span>
                </label>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {formData.description.length} / 2,000 characters
                </span>
              </div>
              <textarea
                id="incident-desc-input"
                rows={4}
                maxLength={2000}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Explain how you received the message, what the sender asked you to do, and whether you clicked a link, shared information, or made a payment."
                className={`w-full p-3 bg-[var(--bg-input)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] ${
                  validationErrors.description ? 'border-[var(--risk-high-text)]' : 'border-[var(--border-main)]'
                }`}
              />
              {validationErrors.description && (
                <p className="text-xs text-[var(--risk-high-text)] mt-1">{validationErrors.description}</p>
              )}
            </div>

            {/* Optional Sender Details & Suspicious Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-[var(--border-main)]">
              <div>
                <label
                  htmlFor="sender-details-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                >
                  Sender contact details <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="sender-details-input"
                  value={formData.senderDetails}
                  onChange={(e) => updateField('senderDetails', e.target.value)}
                  placeholder="e.g. +91 9876543210 or sender@fake-bank.xyz"
                  className="w-full p-2.5 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
                <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                  Include only information you are comfortable sharing with cyber authorities.
                </span>
              </div>

              <div>
                <label
                  htmlFor="suspicious-url-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                >
                  Suspicious link or website <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="suspicious-url-input"
                  value={formData.suspiciousUrl}
                  onChange={(e) => updateField('suspiciousUrl', e.target.value)}
                  placeholder="e.g. https://hdfc-kyc-verify.me"
                  className={`w-full p-2.5 bg-[var(--bg-input)] border rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] ${
                    validationErrors.suspiciousUrl ? 'border-[var(--risk-high-text)]' : 'border-[var(--border-main)]'
                  }`}
                />
                {validationErrors.suspiciousUrl && (
                  <p className="text-xs text-[var(--risk-high-text)] mt-1">{validationErrors.suspiciousUrl}</p>
                )}
                <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                  ScamShield does not visit, scrape, or verify this URL.
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <span>Continue to Message Text</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Suspicious Message Input */}
        {currentStep === 2 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[var(--border-main)] pb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                2. What did the suspicious message say?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Paste the exact text of the message, email, or chat exchange received from the sender.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="report-msg-input"
                  className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]"
                >
                  Message Text
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {formData.suspiciousMessage.length} / 5,000 characters
                  </span>
                  {formData.suspiciousMessage && (
                    <button
                      type="button"
                      onClick={() => updateField('suspiciousMessage', '')}
                      className="text-xs text-[var(--risk-high-text)] hover:underline cursor-pointer"
                    >
                      Clear text
                    </button>
                  )}
                </div>
              </div>

              <textarea
                id="report-msg-input"
                rows={7}
                value={formData.suspiciousMessage}
                onChange={(e) => updateField('suspiciousMessage', e.target.value)}
                placeholder="Paste the suspicious SMS, WhatsApp message, email excerpt, or job offer here..."
                className={`w-full p-3 bg-[var(--bg-input)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] ${
                  validationErrors.suspiciousMessage ? 'border-[var(--risk-high-text)]' : 'border-[var(--border-main)]'
                }`}
              />
              {validationErrors.suspiciousMessage && (
                <p className="text-xs text-[var(--risk-high-text)] mt-1">{validationErrors.suspiciousMessage}</p>
              )}

              {/* Privacy reminder */}
              <div className="mt-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md flex items-start gap-2 text-xs text-[var(--text-muted)]">
                <LockKeyhole className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-[var(--text-primary)]">Privacy Reminder:</strong> Do not include passwords, OTPs, PINs, CVVs, or full payment-card numbers.
                </span>
              </div>
            </div>

            {/* Optional: Include AI observations if coming from analysis */}
            {formData.aiObservationsText && (
              <div className="p-4 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-md space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="include-ai-obs"
                    checked={formData.includeAiObservations}
                    onChange={(e) => updateField('includeAiObservations', e.target.checked)}
                    className="mt-1 h-4 w-4 text-[var(--brand-primary)] rounded border-[var(--border-main)] focus:ring-[var(--brand-primary)] cursor-pointer"
                  />
                  <label htmlFor="include-ai-obs" className="text-xs font-semibold text-[var(--text-primary)] cursor-pointer">
                    Include ScamShield AI-assisted observations in report summary
                  </label>
                </div>
                {formData.includeAiObservations && (
                  <div className="pl-6 text-xs text-[var(--text-secondary)] border-l-2 border-[var(--brand-primary)] ml-2">
                    <p className="italic bg-[var(--bg-card)] p-2.5 rounded border border-[var(--border-main)] text-[var(--text-primary)]">
                      &ldquo;{formData.aiObservationsText}&rdquo;
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">
                      Note: These observations will be labelled as educational heuristic observations, not legal facts.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-[var(--border-main)]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-md cursor-pointer"
              >
                Back to Details
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <span>Continue to Evidence</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Screenshot Evidence Upload */}
        {currentStep === 3 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[var(--border-main)] pb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                3. Add screenshot evidence
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Upload screenshots of suspicious messages, conversations, payment requests, or other relevant evidence that may help explain the incident.
              </p>
            </div>

            {/* Upload Box */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`p-6 border-2 border-dashed rounded-lg text-center transition-colors ${
                dragActive
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-accent)]'
                  : 'border-[var(--border-main)] bg-[var(--bg-secondary)]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="screenshot-file-picker"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />

              <div className="w-12 h-12 mx-auto mb-3 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-full flex items-center justify-center text-[var(--brand-primary)]">
                <Upload className="w-6 h-6" aria-hidden="true" />
              </div>

              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Upload screenshot files
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
                Drag and drop your files here, or click the button below to browse your device.
              </p>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  Upload Screenshot
                </button>
              </div>

              <div className="mt-3 text-[11px] text-[var(--text-muted)]">
                Accepted formats: PNG, JPG, JPEG, WEBP &bull; Max 5 MB per file &bull; Up to 5 images
              </div>
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div
                role="alert"
                className="p-3 bg-[var(--risk-high-bg)] border border-[var(--risk-high-border)] rounded-md text-xs text-[var(--risk-high-text)] flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Evidence Previews List */}
            {formData.screenshots.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                  <span>
                    Selected Evidence ({formData.screenshots.length} of 5 images)
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Stored in local browser memory only
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.screenshots.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-md shadow-xs"
                    >
                      <img
                        src={s.previewUrl}
                        alt={s.name}
                        className="w-14 h-14 object-cover rounded border border-[var(--border-main)] shrink-0"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="font-medium text-[var(--text-primary)] truncate" title={s.name}>
                          {s.name}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          {(s.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(s.id)}
                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--risk-high-text)] hover:bg-[var(--risk-high-bg)] rounded cursor-pointer"
                        aria-label={`Remove screenshot ${s.name}`}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Privacy Notice */}
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md flex items-start gap-2 text-xs text-[var(--text-secondary)]">
              <Info className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
              <p>
                <strong className="text-[var(--text-primary)]">Evidence Privacy:</strong> Screenshot files are held in local browser memory during this session and are not uploaded to any external server or database. ScamShield will not transfer screenshots to the government portal automatically; you will need to attach them on the official portal if required.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[var(--border-main)]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-md cursor-pointer"
              >
                Back to Message
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <span>Continue to Financial Loss</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Financial Loss (Optional) */}
        {currentStep === 4 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[var(--border-main)] pb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                4. Financial Information
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Indicate if any money was transferred to the fraudulent party.
              </p>
            </div>

            {/* Money transferred radio */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] block">
                Was money transferred to the scammer or fraudster?
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'no', label: 'No money was transferred' },
                  { id: 'yes', label: 'Money was transferred' },
                  { id: 'not_sure', label: 'I am not sure' },
                  { id: 'not_applicable', label: 'Not applicable' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      formData.moneyTransferred === opt.id
                        ? 'bg-[var(--brand-accent)] border-[var(--brand-primary)]'
                        : 'bg-[var(--bg-card)] border-[var(--border-main)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="moneyTransferred"
                      value={opt.id}
                      checked={formData.moneyTransferred === opt.id}
                      onChange={() => updateField('moneyTransferred', opt.id as MoneyTransferredOption)}
                      className="text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                    />
                    <span className="text-xs font-medium text-[var(--text-primary)]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* If money transferred = yes, show financial fields & 1930 Notice */}
            {formData.moneyTransferred === 'yes' && (
              <div className="space-y-5 pt-3 border-t border-[var(--border-main)]">
                {/* 1930 Emergency Helpline Banner */}
                <div className="p-4 bg-[var(--risk-high-bg)] border border-[var(--risk-high-border)] rounded-md space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--risk-high-text)]">
                    <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Immediate Action for Financial Fraud in India</span>
                  </div>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    If you have transferred funds within the last 24–48 hours, dial <strong>1930</strong> (National Cyber Financial Fraud Helpline) immediately to request a temporary freeze on the fraudster&rsquo;s receiving bank account, and inform your bank right away.
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Disclaimer: ScamShield is an educational tool and cannot freeze accounts, reverse transactions, or recover funds.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Amount Lost */}
                  <div>
                    <label
                      htmlFor="amount-lost-input"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                    >
                      Approximate Amount Lost (INR) <span className="text-[var(--risk-high-text)]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-[var(--text-muted)] font-semibold">
                        ₹
                      </span>
                      <input
                        type="number"
                        id="amount-lost-input"
                        min="0"
                        value={formData.amountLost}
                        onChange={(e) => updateField('amountLost', e.target.value)}
                        placeholder="e.g. 5000"
                        className={`w-full pl-8 pr-3 py-2.5 bg-[var(--bg-input)] border rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] ${
                          validationErrors.amountLost ? 'border-[var(--risk-high-text)]' : 'border-[var(--border-main)]'
                        }`}
                      />
                    </div>
                    {validationErrors.amountLost && (
                      <p className="text-xs text-[var(--risk-high-text)] mt-1">{validationErrors.amountLost}</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label
                      htmlFor="payment-method-select"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                    >
                      Payment Method
                    </label>
                    <select
                      id="payment-method-select"
                      value={formData.paymentMethod}
                      onChange={(e) => updateField('paymentMethod', e.target.value as PaymentMethodOption)}
                      className="w-full p-2.5 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    >
                      <option value="UPI">UPI (Google Pay, PhonePe, Paytm, BHIM)</option>
                      <option value="Bank transfer">Bank Transfer (IMPS, NEFT, RTGS)</option>
                      <option value="Card">Debit / Credit Card</option>
                      <option value="Wallet">Digital Wallet</option>
                      <option value="Other">Other</option>
                      <option value="Not sure">Not sure</option>
                    </select>
                  </div>

                  {/* Transaction Date */}
                  <div>
                    <label
                      htmlFor="transaction-date-input"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                    >
                      Date of Transaction <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      id="transaction-date-input"
                      value={formData.transactionDate}
                      onChange={(e) => updateField('transactionDate', e.target.value)}
                      className="w-full p-2.5 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                  </div>

                  {/* Transaction Reference / UTR */}
                  <div>
                    <label
                      htmlFor="transaction-ref-input"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5"
                    >
                      Transaction Reference / UTR <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="transaction-ref-input"
                      value={formData.transactionReference}
                      onChange={(e) => updateField('transactionReference', e.target.value)}
                      placeholder="e.g. 12-digit UPI UTR or bank reference"
                      className="w-full p-2.5 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                    <span className="text-[11px] text-[var(--risk-high-text)] mt-1 block">
                      Never enter your banking PIN, OTP, or CVV.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-[var(--border-main)]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-md cursor-pointer"
              >
                Back to Evidence
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <span>Review Report</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review Report Before Continuing */}
        {currentStep === 5 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[var(--border-main)] pb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                5. Review your report
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Review all the entered incident information. You can edit any section before preparing the final report.
              </p>
            </div>

            {/* Review Cards */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Incident Details Card */}
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2">
                  <h3 className="font-semibold text-[var(--text-primary)]">Incident Details</h3>
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(1)}
                    className="text-[var(--brand-primary)] hover:underline font-medium text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[var(--text-secondary)]">
                  <p>
                    <strong className="text-[var(--text-primary)]">Type:</strong> {formData.incidentType}
                  </p>
                  <p>
                    <strong className="text-[var(--text-primary)]">Platform:</strong> {formData.platform}
                  </p>
                  <p>
                    <strong className="text-[var(--text-primary)]">Date:</strong> {formData.incidentDate}
                  </p>
                  <p>
                    <strong className="text-[var(--text-primary)]">State/UT:</strong> {formData.stateOrUt || 'Not provided'}
                  </p>
                  {formData.senderDetails && (
                    <p className="sm:col-span-2">
                      <strong className="text-[var(--text-primary)]">Sender Details:</strong> {formData.senderDetails}
                    </p>
                  )}
                  {formData.suspiciousUrl && (
                    <p className="sm:col-span-2">
                      <strong className="text-[var(--text-primary)]">Suspicious Link:</strong> {formData.suspiciousUrl}
                    </p>
                  )}
                </div>
                <div className="pt-2 border-t border-[var(--border-main)]">
                  <p className="text-[var(--text-primary)] font-semibold mb-1">Description:</p>
                  <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">{formData.description}</p>
                </div>
              </div>

              {/* Message Content Card */}
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md space-y-2">
                <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2">
                  <h3 className="font-semibold text-[var(--text-primary)]">Suspicious Message</h3>
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(2)}
                    className="text-[var(--brand-primary)] hover:underline font-medium text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                  {formData.suspiciousMessage || 'No message text provided'}
                </p>
                {formData.includeAiObservations && formData.aiObservationsText && (
                  <div className="pt-2 border-t border-[var(--border-main)] text-xs">
                    <strong className="text-[var(--brand-primary)]">AI-assisted observations included:</strong>
                    <p className="text-[var(--text-secondary)] italic mt-0.5">&ldquo;{formData.aiObservationsText}&rdquo;</p>
                  </div>
                )}
              </div>

              {/* Evidence Screenshots Card */}
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md space-y-2">
                <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2">
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    Evidence Screenshots ({formData.screenshots.length} files)
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(3)}
                    className="text-[var(--brand-primary)] hover:underline font-medium text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                {formData.screenshots.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.screenshots.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-2 p-1.5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded text-xs text-[var(--text-primary)]"
                      >
                        <img
                          src={s.previewUrl}
                          alt={s.name}
                          className="w-6 h-6 object-cover rounded"
                        />
                        <span className="truncate max-w-[150px]">{s.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--text-muted)] italic">No screenshots attached</p>
                )}
              </div>

              {/* Financial Information Card */}
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md space-y-2">
                <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2">
                  <h3 className="font-semibold text-[var(--text-primary)]">Financial Information</h3>
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(4)}
                    className="text-[var(--brand-primary)] hover:underline font-medium text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                {formData.moneyTransferred === 'yes' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[var(--text-secondary)]">
                    <p>
                      <strong className="text-[var(--text-primary)]">Amount Lost:</strong> ₹{formData.amountLost}
                    </p>
                    <p>
                      <strong className="text-[var(--text-primary)]">Method:</strong> {formData.paymentMethod}
                    </p>
                    {formData.transactionDate && (
                      <p>
                        <strong className="text-[var(--text-primary)]">Transaction Date:</strong> {formData.transactionDate}
                      </p>
                    )}
                    {formData.transactionReference && (
                      <p>
                        <strong className="text-[var(--text-primary)]">Ref / UTR:</strong> {formData.transactionReference}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[var(--text-secondary)]">
                    Money Transferred:{' '}
                    {formData.moneyTransferred === 'no'
                      ? 'No financial loss reported'
                      : formData.moneyTransferred}
                  </p>
                )}
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 bg-[var(--brand-accent)] border border-[var(--brand-accent-border)] rounded-md cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reviewedAndConfirmed}
                  onChange={(e) => updateField('reviewedAndConfirmed', e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-[var(--brand-primary)] rounded border-[var(--border-main)] focus:ring-[var(--brand-primary)] cursor-pointer"
                />
                <span className="text-xs text-[var(--text-primary)] leading-relaxed">
                  I have reviewed the information above and understand that ScamShield is preparing a report summary for my use, and is <strong>not itself submitting a complaint</strong> to law enforcement or government authorities.
                </span>
              </label>
              {validationErrors.reviewedAndConfirmed && (
                <p className="text-xs text-[var(--risk-high-text)] mt-1.5">{validationErrors.reviewedAndConfirmed}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-[var(--border-main)]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-md cursor-pointer"
              >
                Back to Financial Info
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <span>Prepare Report and Continue</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Report Prepared & Portal Handoff */}
        {currentStep === 6 && (
          <div className="space-y-6">
            {/* Success Status Banner */}
            <div
              role="alert"
              className="p-6 bg-[var(--risk-low-bg)] border border-[var(--risk-low-border)] rounded-lg shadow-xs space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--risk-low-border)] flex items-center justify-center text-[var(--risk-low-text)] shrink-0">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-bold text-[var(--risk-low-text)]">
                  Your report is ready to review.
                </h2>
              </div>
              <p className="text-sm text-[var(--text-primary)] pl-11 leading-relaxed">
                ScamShield has prepared your incident details. Your complaint has not been submitted to the government. Continue to the official portal to complete the reporting process.
              </p>
            </div>

            {/* Report Prepared Summary Card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-main)] pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--brand-primary)] font-semibold">
                    Document Status: Prepared Locally
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Incident Summary: {formData.incidentType}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-main)] text-xs font-medium text-[var(--text-secondary)]">
                    {formData.screenshots.length} screenshot(s) ready
                  </span>
                </div>
              </div>

              {/* Action Buttons: Copy, Download, Portal Link, Edit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden="true" />
                  <span>Copy Report Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden="true" />
                  <span>Download Report Summary (.txt)</span>
                </button>
              </div>

              {copySuccessToast && (
                <div className="p-2.5 bg-[var(--risk-low-bg)] border border-[var(--risk-low-border)] rounded text-xs text-[var(--risk-low-text)] font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Report details copied to clipboard successfully!</span>
                </div>
              )}

              {/* Primary Action: Official Portal Link */}
              <div className="pt-3 border-t border-[var(--border-main)]">
                <a
                  href="https://cybercrime.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] rounded-md transition-colors shadow-sm cursor-pointer"
                >
                  <span>Continue to Official Government Portal</span>
                  <ExternalLink className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Official Portal Notice */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                <Info className="w-4 h-4 text-[var(--brand-primary)]" aria-hidden="true" />
                <span>Official Portal Notice</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                ScamShield prepares your report but does not submit it on your behalf. You must complete and submit your complaint on the official government portal. Your report details and screenshots will not be transferred automatically.
              </p>
            </div>

            {/* Step-by-Step Filing Guide for cybercrime.gov.in */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                What to do on the Government Portal (cybercrime.gov.in):
              </h3>
              <ol className="space-y-2.5 text-xs text-[var(--text-secondary)] list-decimal list-inside leading-relaxed">
                <li>
                  Click <strong>&ldquo;Report Cyber Crime&rdquo;</strong> on the official website.
                </li>
                <li>
                  Accept the mandatory terms and register or login with your Indian mobile number and OTP.
                </li>
                <li>
                  Select the appropriate complaint category (e.g. <em>Financial Fraud</em> or <em>Other Cyber Crime</em>).
                </li>
                <li>
                  Paste your copied description from ScamShield into the complaint description field.
                </li>
                <li>
                  Attach your original screenshot files directly from your computer or phone.
                </li>
                <li>
                  Review the summary, enter the portal CAPTCHA, and submit to receive your official government Acknowledgement / Complaint Number.
                </li>
              </ol>
            </div>

            {/* Back to Edit Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleJumpToStep(5)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Back to Edit Report</span>
              </button>

              <button
                type="button"
                onClick={handleBackToHome}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[var(--brand-primary)] hover:underline cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
        </form>

        {/* Fallback Manual Copy Modal if navigator.clipboard fails */}
        {showManualCopyModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-card)] rounded-lg max-w-lg w-full p-6 space-y-4 border border-[var(--border-main)] shadow-lg">
              <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Manual Copy Fallback
                </h3>
                <button
                  type="button"
                  onClick={() => setShowManualCopyModal(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)]">
                Your browser prevented direct clipboard access. Select the text below and press <strong>Ctrl+C</strong> (or Cmd+C) to copy:
              </p>

              <textarea
                readOnly
                rows={10}
                value={generateReportSummaryText()}
                className="w-full p-3 font-mono text-xs bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-md text-[var(--text-primary)]"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowManualCopyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[var(--brand-btn-text)] bg-[var(--brand-primary)] rounded-md cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
