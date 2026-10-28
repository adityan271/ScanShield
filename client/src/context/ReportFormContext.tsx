import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReportFormData } from '../types/index.js';

const REPORT_DRAFT_STORAGE_KEY = 'scamshield-report-draft';

type PersistedReportFormData = Omit<ReportFormData, 'screenshots'>;

interface StoredReportDraft {
  currentStep: number;
  formData: PersistedReportFormData;
}

interface InitialReportFormState {
  formData: ReportFormData;
  currentStep: number;
  storageError: string | null;
}

function todayIsoDate(): string {
  return new Date().toISOString().split('T')[0];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStoredReportDraft(value: unknown): value is StoredReportDraft {
  if (!isRecord(value) || !isRecord(value.formData)) {
    return false;
  }

  const data = value.formData;
  return (
    Number.isInteger(value.currentStep) &&
    Number(value.currentStep) >= 1 &&
    Number(value.currentStep) <= 6 &&
    typeof data.incidentType === 'string' &&
    typeof data.platform === 'string' &&
    typeof data.incidentDate === 'string' &&
    typeof data.description === 'string' &&
    typeof data.senderDetails === 'string' &&
    typeof data.suspiciousUrl === 'string' &&
    typeof data.stateOrUt === 'string' &&
    typeof data.suspiciousMessage === 'string' &&
    typeof data.includeAiObservations === 'boolean' &&
    typeof data.aiObservationsText === 'string' &&
    (data.moneyTransferred === 'no' ||
      data.moneyTransferred === 'yes' ||
      data.moneyTransferred === 'not_sure' ||
      data.moneyTransferred === 'not_applicable') &&
    typeof data.amountLost === 'string' &&
    typeof data.transactionDate === 'string' &&
    (data.paymentMethod === 'UPI' ||
      data.paymentMethod === 'Bank transfer' ||
      data.paymentMethod === 'Card' ||
      data.paymentMethod === 'Wallet' ||
      data.paymentMethod === 'Other' ||
      data.paymentMethod === 'Not sure') &&
    typeof data.transactionReference === 'string' &&
    typeof data.reviewedAndConfirmed === 'boolean'
  );
}

function loadReportDraft(): InitialReportFormState {
  try {
    const storedDraft = sessionStorage.getItem(REPORT_DRAFT_STORAGE_KEY);
    if (!storedDraft) {
      return {
        formData: createEmptyReportForm(),
        currentStep: 1,
        storageError: null,
      };
    }

    const parsed: unknown = JSON.parse(storedDraft);
    if (!isStoredReportDraft(parsed)) {
      return {
        formData: createEmptyReportForm(),
        currentStep: 1,
        storageError: 'The saved report draft could not be restored. A new draft has been started.',
      };
    }

    return {
      formData: { ...parsed.formData, screenshots: [] },
      currentStep: parsed.currentStep,
      storageError: null,
    };
  } catch {
    return {
      formData: createEmptyReportForm(),
      currentStep: 1,
      storageError: 'The saved report draft could not be read. A new draft has been started.',
    };
  }
}

export function createEmptyReportForm(): ReportFormData {
  return {
    incidentType: '',
    platform: '',
    incidentDate: todayIsoDate(),
    description: '',
    senderDetails: '',
    suspiciousUrl: '',
    stateOrUt: '',
    suspiciousMessage: '',
    includeAiObservations: false,
    aiObservationsText: '',
    screenshots: [],
    moneyTransferred: 'no',
    amountLost: '',
    transactionDate: '',
    paymentMethod: 'Not sure',
    transactionReference: '',
    reviewedAndConfirmed: false,
  };
}

export function reportFormHasUserData(data: ReportFormData): boolean {
  return Boolean(
    data.incidentType ||
      data.platform ||
      data.description.trim() ||
      data.senderDetails.trim() ||
      data.suspiciousUrl.trim() ||
      data.stateOrUt ||
      data.suspiciousMessage.trim() ||
      data.screenshots.length > 0 ||
      data.moneyTransferred !== 'no' ||
      data.amountLost.trim() ||
      data.transactionDate ||
      data.transactionReference.trim() ||
      data.reviewedAndConfirmed ||
      data.aiObservationsText.trim()
  );
}

interface ReportFormContextValue {
  formData: ReportFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReportFormData>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  updateField: <K extends keyof ReportFormData>(field: K, value: ReportFormData[K]) => void;
  applyAnalysisPrefill: (message: string, aiObservations: string) => void;
  resetForm: () => void;
  hasUserData: boolean;
  draftStorageError: string | null;
}

const ReportFormContext = createContext<ReportFormContextValue | undefined>(undefined);

export const ReportFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialState] = useState(loadReportDraft);
  const [formData, setFormData] = useState<ReportFormData>(initialState.formData);
  const [currentStep, setCurrentStep] = useState(initialState.currentStep);
  const [draftStorageError, setDraftStorageError] = useState(initialState.storageError);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        REPORT_DRAFT_STORAGE_KEY,
        JSON.stringify({
          currentStep,
          formData: { ...formData, screenshots: [] },
        })
      );
      setDraftStorageError(null);
    } catch {
      setDraftStorageError('Your report draft could not be saved in this browser tab.');
    }
  }, [formData, currentStep]);

  const updateField = useCallback(<K extends keyof ReportFormData>(
    field: K,
    value: ReportFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyAnalysisPrefill = useCallback((message: string, aiObservations: string) => {
    setFormData((prev) => ({
      ...prev,
      suspiciousMessage: message || prev.suspiciousMessage,
      includeAiObservations: Boolean(aiObservations),
      aiObservationsText: aiObservations || prev.aiObservationsText,
    }));
    setCurrentStep(1);
  }, []);

  const resetForm = useCallback(() => {
    setFormData((prev) => {
      prev.screenshots.forEach((screenshot) => {
        URL.revokeObjectURL(screenshot.previewUrl);
      });
      return createEmptyReportForm();
    });
    setCurrentStep(1);
  }, []);

  const hasUserData = reportFormHasUserData(formData);

  const value = useMemo(
    () => ({
      formData,
      setFormData,
      currentStep,
      setCurrentStep,
      updateField,
      applyAnalysisPrefill,
      resetForm,
      hasUserData,
      draftStorageError,
    }),
    [
      formData,
      currentStep,
      updateField,
      applyAnalysisPrefill,
      resetForm,
      hasUserData,
      draftStorageError,
    ]
  );

  return <ReportFormContext.Provider value={value}>{children}</ReportFormContext.Provider>;
};

export const useReportForm = (): ReportFormContextValue => {
  const context = useContext(ReportFormContext);
  if (!context) {
    throw new Error('useReportForm must be used within a ReportFormProvider');
  }
  return context;
};
