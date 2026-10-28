import { AnalysisResult, RiskLevel, WarningSign } from '../schemas/analysis.schema.js';

interface RulePattern {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  regex: RegExp;
  explanation: string;
  action: string;
}

const RULES: RulePattern[] = [
  {
    id: 'otp_request',
    title: 'Solicitation of One-Time Password (OTP) or Security Code',
    severity: 'high',
    regex: /\b(?:otp|one[- ]time password|verification code|security pin|cvv|password|passcode)\b/i,
    explanation:
      'An OTP or verification code authorises transactions or account recovery. Legitimate banks and service providers never ask users to disclose or forward an OTP.',
    action:
      'Never share an OTP, password, or security PIN with anyone, even if the sender claims to be a bank official or customer executive.',
  },
  {
    id: 'account_threat',
    title: 'Threat of Account Suspension or Service Deactivation',
    severity: 'high',
    regex: /\b(?:account (?:has been |will be |is )?(?:blocked|suspended|deactivated|frozen|restricted)|kyc (?:expired|update|missing|pending|verification)|sim (?:block|deactivation)|pan (?:link|update|blocked)|card (?:blocked|restricted))\b/i,
    explanation:
      'Scammers invoke urgency by threatening imminent account closure or service disruption to provoke panic, bypassing critical thinking.',
    action:
      'Do not rely on links or contact numbers in the message. Check your account status directly via your bank\'s official app or net banking portal.',
  },
  {
    id: 'electricity_threat',
    title: 'Imminent Utility or Electricity Disconnection Threat',
    severity: 'high',
    regex: /\b(?:electricity|power|bijli|bses|tneb|wbpsdcl|dhbvn|bescom).{0,50}(?:disconnect|cut|power supply|unpaid bill|bill overdue)\b/i,
    explanation:
      'Impersonating regional electricity boards and threatening immediate power cutoff is a widespread extortion tactic across India.',
    action:
      'Do not dial phone numbers listed in unexpected utility notices. Verify your bill status on your electricity provider\'s verified website or consumer app.',
  },
  {
    id: 'job_advance_fee',
    title: 'Advance Fee Demand for Job or Internship',
    severity: 'high',
    regex: /\b(?:internship|job offer|work from home|part[- ]time job|hiring).{0,60}(?:registration fee|refundable fee|security deposit|processing charge|pay rs|pay ₹|upi payment)\b/i,
    explanation:
      'Legitimate employers and verified recruitment agencies never demand upfront registration fees, security deposits, or refundable payments from candidates.',
    action:
      'Never pay money to secure a job or internship. Verify job openings directly on the organisation\'s official careers portal.',
  },
  {
    id: 'lottery_advance_fee',
    title: 'Unsolicited Prize or Lottery Claim with Advance Tax/Fee',
    severity: 'high',
    regex: /\b(?:won|winner|lucky draw|kbc|lottery|reward of rs|jackpot).{0,60}(?:tax fee|processing fee|clearance charge|claim fee|remit|pay)\b/i,
    explanation:
      'Unsolicited lottery wins and prize notifications requiring advance payment for taxes or processing are classic advance-fee fraud schemes.',
    action:
      'Delete and ignore the message. You cannot win a prize or contest you never actively entered.',
  },
  {
    id: 'remote_access_apk',
    title: 'Request to Install Remote Support Tool or Unverified APK',
    severity: 'high',
    regex: /\b(?:anydesk|teamviewer|rustdesk|quicksupport|download apk|\.apk|install this app|screen share)\b/i,
    explanation:
      'Remote desktop tools allow attackers to remotely view your phone screen, access banking apps, and intercept incoming SMS/OTPs.',
    action:
      'Never install screen-sharing software or sideload APK files upon the instruction of an unverified caller or message sender.',
  },
  {
    id: 'urgency_pressure',
    title: 'Artificial Urgency and Coercive Deadline',
    severity: 'medium',
    regex: /\b(?:immediately|urgent|within (?:[0-9]+|two|three|24) hours?|today only|without delay|action required now|expires today)\b/i,
    explanation:
      'Creating an artificial deadline forces hasty decisions before you can cross-check facts with official sources or trusted family members.',
    action:
      'Pause and take time to verify. Legitimate formal procedures always provide adequate time and official escalation paths.',
  },
  {
    id: 'suspicious_link',
    title: 'Unverified, Suspicious, or Shortened Web Link',
    severity: 'medium',
    regex: /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/i,
    explanation:
      'Phishing links frequently mimic genuine domain names with slight spelling modifications or use shortened URLs to disguise fake credential-harvesting pages.',
    action:
      'Avoid tapping unfamiliar links. Navigate to official services by typing their known, verified web address directly into your browser.',
  },
  {
    id: 'unrealistic_returns',
    title: 'Unrealistic Guaranteed Investment or Task Earnings',
    severity: 'medium',
    regex: /\b(?:guaranteed returns?|double your money|daily profit|earn rs\.? [0-9,]+ daily|like youtube videos|crypto investment|telegram task)\b/i,
    explanation:
      'Promises of effortless daily income or guaranteed high financial returns without risk are typical hallmarks of investment or Ponzi schemes.',
    action:
      'Disregard unsolicited investment schemes or daily task payment offers. Consult a certified financial adviser for legitimate investments.',
  },
  {
    id: 'courier_parcel_hold',
    title: 'Suspicious Courier Delivery or Customs Hold Notice',
    severity: 'medium',
    regex: /\b(?:india post|courier|parcel|delivery failed|customs clearance|address incomplete).{0,50}(?:confirm address|update address|redelivery fee|pay rs)\b/i,
    explanation:
      'Fake parcel delivery notices prompt victims to click malicious links to confirm addresses or pay nominal redelivery fees, exposing payment credentials.',
    action:
      'Track your consignment exclusively through the postal or courier company\'s official website using your original tracking number.',
  },
];

/**
 * Extracts a concise snippet matching the pattern with surrounding context
 */
function extractEvidence(text: string, regex: RegExp): string {
  const match = text.match(regex);
  if (!match || match.index === undefined) {
    return 'Observed in submitted text';
  }

  const start = Math.max(0, match.index - 20);
  const end = Math.min(text.length, match.index + match[0].length + 20);
  let snippet = text.slice(start, end).trim();

  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}

export function runDemoAnalysis(message: string): AnalysisResult {
  const trimmed = message.trim();

  // Check for insufficient information
  if (trimmed.length < 15 || trimmed.split(/\s+/).length <= 2) {
    return {
      riskLevel: 'INSUFFICIENT_INFORMATION',
      summary:
        'The submitted message is too brief or lacks sufficient context to evaluate potential scam indicators reliably.',
      warningSigns: [],
      safeActions: [
        'Provide the complete text of the message, including any sender name, links, or instructions.',
        'If the sender is unknown and demanding an action, pause before responding.',
      ],
      limitations:
        'ScamShield provides an AI-assisted assessment, not proof of fraud or sender identity. A low-risk result does not guarantee safety. Verify important requests independently.',
      mode: 'demo',
    };
  }

  const detectedSigns: WarningSign[] = [];
  const safeActionsSet = new Set<string>();
  let highSeverityCount = 0;
  let mediumSeverityCount = 0;

  for (const rule of RULES) {
    if (rule.regex.test(trimmed)) {
      const evidence = extractEvidence(trimmed, rule.regex);
      detectedSigns.push({
        title: rule.title,
        evidence,
        explanation: rule.explanation,
      });

      safeActionsSet.add(rule.action);

      if (rule.severity === 'high') {
        highSeverityCount++;
      } else if (rule.severity === 'medium') {
        mediumSeverityCount++;
      }
    }
  }

  let riskLevel: RiskLevel;
  let summary: string;

  if (highSeverityCount >= 2 || (highSeverityCount >= 1 && mediumSeverityCount >= 1)) {
    riskLevel = 'HIGH';
    summary =
      'This message displays strong, high-risk warning signs commonly associated with digital fraud, such as credential solicitation, coercion, or financial demands.';
  } else if (highSeverityCount === 1) {
    riskLevel = 'HIGH';
    summary =
      'This message contains a severe warning sign commonly associated with digital fraud (such as credential requests or upfront fee demands). Do not proceed without independent verification.';
  } else if (mediumSeverityCount >= 2) {
    riskLevel = 'MEDIUM';
    summary =
      'This message contains multiple noticeable warning signs that warrant high caution. Do not follow instructions without independent verification.';
  } else if (mediumSeverityCount === 1) {
    riskLevel = 'MEDIUM';
    summary =
      'This message contains potential warning signs such as urgency or an unverified link. Exercise caution before acting.';
  } else {
    riskLevel = 'LOW';
    summary =
      'No common scam patterns or high-risk indicators were detected in this message. However, always exercise normal digital hygiene.';
    safeActionsSet.add('Never disclose passwords, OTPs, or banking PINs to anyone.');
    safeActionsSet.add('If this message is from an unknown sender, confirm their identity through an independent channel.');
  }

  // Ensure baseline practical advice is always present
  if (safeActionsSet.size === 0) {
    safeActionsSet.add('Do not share personal or financial information with unverified contacts.');
    safeActionsSet.add('Verify any critical requests directly with the organisation using official contact details.');
  }

  return {
    riskLevel,
    summary,
    warningSigns: detectedSigns,
    safeActions: Array.from(safeActionsSet).slice(0, 5),
    limitations:
      'ScamShield provides an AI-assisted assessment, not proof of fraud or sender identity. A low-risk result does not guarantee safety. Verify important requests independently.',
    mode: 'demo',
  };
}
