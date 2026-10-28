export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_INFORMATION';

export interface WarningSign {
  title: string;
  evidence: string;
  explanation: string;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  summary: string;
  warningSigns: WarningSign[];
  safeActions: string[];
  limitations: string;
  mode: 'live' | 'demo';
}

export interface AnalysisApiResponse {
  success: boolean;
  analysis?: AnalysisResult;
  error?: string;
  canFallbackToDemo?: boolean;
}

export interface HealthStatus {
  status: string;
  mode: 'live' | 'demo';
  provider: string;
  timestamp: string;
}

export interface LearningScenario {
  id: string;
  title: string;
  category: string;
  message: string;
  correctRisk: RiskLevel;
  explanation: string;
  warningSigns: string[];
  safetyTip: string;
}

export interface ScreenshotEvidence {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

export type MoneyTransferredOption =
  | 'no'
  | 'yes'
  | 'not_sure'
  | 'not_applicable';

export type PaymentMethodOption =
  | 'UPI'
  | 'Bank transfer'
  | 'Card'
  | 'Wallet'
  | 'Other'
  | 'Not sure';

export interface ReportFormData {
  incidentType: string;
  platform: string;
  incidentDate: string;
  description: string;
  senderDetails: string;
  suspiciousUrl: string;
  stateOrUt: string;
  suspiciousMessage: string;
  includeAiObservations: boolean;
  aiObservationsText: string;
  screenshots: ScreenshotEvidence[];
  moneyTransferred: MoneyTransferredOption;
  amountLost: string;
  transactionDate: string;
  paymentMethod: PaymentMethodOption;
  transactionReference: string;
  reviewedAndConfirmed: boolean;
}
