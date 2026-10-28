export interface SampleMessage {
  id: string;
  label: string;
  category: string;
  text: string;
}

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: 'bank-alert',
    label: 'Bank account alert',
    category: 'Banking / KYC',
    text: 'URGENT: Your HDFC bank account has been blocked due to missing PAN KYC. Update immediately at https://hdfc-kyc-verify.me or send your OTP to 9876543210 to restore access within 2 hours.',
  },
  {
    id: 'internship-offer',
    label: 'Internship offer',
    category: 'Employment',
    text: 'Congratulations! You have been shortlisted for the Google Summer Data Analytics Internship. Guaranteed stipend of Rs 45,000/month. Pay Rs 1,499 refundable registration fee via UPI to secure your candidate slot. Contact hr@google-careers-portal.xyz',
  },
  {
    id: 'prize-notification',
    label: 'Prize notification',
    category: 'Lottery / Winnings',
    text: 'Dear Customer, Your mobile number has won Rs 25,00,000 in KBC All India Lucky Draw 2026. Contact WhatsApp Manager at +91 9988776655. Remit processing tax fee of Rs 4,999 to bank account to release the prize cheque.',
  },
  {
    id: 'delivery-update',
    label: 'Delivery update',
    category: 'Postal / Courier',
    text: 'India Post: Your package IN8291048 cannot be delivered due to incomplete street address. Please confirm your delivery address: https://indiapost.gov.in-track.info before your parcel is returned to sender.',
  },
  {
    id: 'benign-message',
    label: 'Ordinary message',
    category: 'Personal Communication',
    text: 'Hi Ramesh, reaching home by 8:30 PM this evening. Please keep dinner ready. Will call you once I board the metro from Rajiv Chowk.',
  },
];
