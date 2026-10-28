import type { LearningScenario } from '../types/index.js';

export const LEARNING_SCENARIOS: LearningScenario[] = [
  {
    id: 'scenario-1',
    title: 'Scenario 1: Urgent Bank Account Suspension',
    category: 'Banking / Phishing',
    message:
      'Dear Customer, your State Bank account will be blocked today due to incomplete KYC documents. Send your 6-digit OTP to 9823019281 to restore access and unblock your debit card.',
    correctRisk: 'HIGH',
    explanation:
      'This message combines artificial urgency ("will be blocked today") with a direct solicitation for your confidential One-Time Password (OTP). Legitimate banks possess internal verification mechanisms and will never ask you to forward an OTP to a private phone number.',
    warningSigns: [
      'Demand for a confidential OTP via SMS/phone',
      'Coercive urgency threatening immediate account suspension',
      'Unverified 10-digit mobile number claiming to be a bank system',
    ],
    safetyTip:
      'Never disclose an OTP, password, or UPI PIN under any circumstances. If in doubt, independently call your bank branch or use their official banking application.',
  },
  {
    id: 'scenario-2',
    title: 'Scenario 2: Guaranteed Internship with Registration Fee',
    category: 'Employment / Career',
    message:
      'Congratulations! You have been selected for the Remote Tech Internship 2026 with a guaranteed stipend of Rs 35,000/month. To confirm your enrollment, remit a refundable security deposit of Rs 1,200 to our UPI ID within 24 hours.',
    correctRisk: 'HIGH',
    explanation:
      'Genuine corporate employers, technology firms, and startups never require candidates to pay "refundable deposits", processing charges, or training registration fees to receive an internship or employment offer.',
    warningSigns: [
      'Demand for upfront payment or refundable deposit via UPI',
      'Offer made without interview, test, or proper screening',
      'Artificial deadline pressure to transfer funds quickly',
    ],
    safetyTip:
      'Treat any job or internship opportunity that demands money as fraudulent. Legitimate organisations pay employees, not the reverse.',
  },
  {
    id: 'scenario-3',
    title: 'Scenario 3: Lottery Jackpot with Tax Processing Charge',
    category: 'Lottery / Advance-Fee Fraud',
    message:
      'Attention! Your mobile number was drawn as 1st prize winner of Rs 15,00,000 in the National Telecom Festival. Remit Rs 3,500 government processing and GST clearance fee to release your demand draft.',
    correctRisk: 'HIGH',
    explanation:
      'This is classic advance-fee fraud. You cannot win a lottery or prize draw that you never purchased a ticket for or enrolled in. Scammers claim taxes or fees must be paid upfront to release nonexistent money.',
    warningSigns: [
      'Unsolicited claim of lottery or contest winnings',
      'Demand for advance fee or tax payment before funds are released',
      'Fabricated government or tax clearance claims',
    ],
    safetyTip:
      'Ignore unsolicited lottery or prize claims entirely. In legitimate prize situations, mandatory taxes are deducted at source (TDS) rather than collected via advance payment.',
  },
];
