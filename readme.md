# ScamShield India

AI-powered cybersecurity web app that analyzes suspicious messages, highlights potential scam warning signs, and recommends safe next steps to help users stay protected from digital fraud.

> **Think a message might be a scam? Know what to do next.**

An open-source, AI-assisted cybersecurity web application that analyses suspicious messages, explains potential warning signs with evidence-based reasoning, and prepares comprehensive scam reports for filing on the official Indian Cybercrime Portal.

---

## Table of Contents

- [Overview](#overview)
- [Design System & White Theme Redesign](#design-system--white-theme-redesign)
- [Key Features](#key-features)
- [Scam Report Preparation Workflow](#scam-report-preparation-workflow)
- [Evidence Upload & Privacy](#evidence-upload--privacy)
- [Official Portal Handoff & 1930 Helpline](#official-portal-handoff--1930-helpline)
- [Technical Architecture](#technical-architecture)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Environment Configuration](#environment-configuration)
- [Analysis Modes (Demo vs. Live AI)](#analysis-modes-demo-vs-live-ai)
- [API Reference](#api-reference)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Zero-Cost Deployment](#zero-cost-deployment)
- [Privacy & Responsible AI Disclaimers](#privacy--responsible-ai-disclaimers)
- [License](#license)

---

## Overview

Digital fraud, social engineering attacks, and phishing are prevalent threats across India. Individuals regularly receive suspicious SMS texts, WhatsApp forwards, fraudulent job offers, and coercive payment requests.

ScamShield India provides two critical capabilities:
1. **Evidence-Based Message Analysis:** Breaks down suspicious text messages, highlights specific indicators (e.g. OTP solicitations, artificial deadlines, fake prize fees) with verbatim evidence, and explains why they matter.
2. **Scam Incident Report Preparation:** Guides victims and vigilant citizens through a structured, multi-step incident report generator that compiles evidence and descriptions into a clean format ready to file on India's official National Cyber Crime Reporting Portal ([cybercrime.gov.in](https://cybercrime.gov.in/)).

---

## Design System & White Theme Redesign

The application features a professional, high-trust white theme designed to match modern enterprise security SaaS products.

### Strict Design Guidelines
- **Zero Glassmorphism:** Solid white and light slate surfaces with clean 1px borders (`#E1E6EF`). Absolutely no blurred panels, translucent cards, or `backdrop-filter: blur()`.
- **Zero Emojis:** Strictly professional cybersecurity iconography using Lucide React line icons. No emoji characters anywhere in the user interface.
- **No Generic AI Visuals:** No floating blobs, neon glows, or decorative clutter. Clean typography using Inter and system sans-serif.

### Colour Palette

| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Main Page Background** | `#FFFFFF` | Primary background surface |
| **Secondary Background** | `#F7F9FC` | Section backgrounds and contrast panels |
| **Card Background** | `#FFFFFF` | Form cards and content containers |
| **Primary Text** | `#172033` | Headings, labels, and primary copy |
| **Secondary Text** | `#5E687B` | Body copy and descriptions |
| **Muted Text** | `#7B8495` | Placeholders and helper hints |
| **Primary Brand Blue** | `#2457D6` | Primary action buttons and focal highlights |
| **Primary Hover** | `#1946B8` | Hover state for primary buttons |
| **Light Blue Accent** | `#EEF4FF` | Active step tabs and highlight backgrounds |
| **Border** | `#E1E6EF` | Card and input dividers |
| **High-Risk Red** | `#C93636` | Critical threats and error banners (`#FFF0F0` bg) |
| **Medium-Risk Amber** | `#A86408` | Warning alerts and caution notices (`#FEF8E8` bg) |
| **Low-Risk Green** | `#237A4B` | Safe indicators and success states (`#EAF7EF` bg) |

---

## Key Features

1. **Message Analyser:**
   - Textarea with live character counter (up to 5,000 characters).
   - Quick-fill sample shortcuts (Bank account alert, Internship offer, Prize notification, Delivery update, Ordinary message).
   - Instant client-side validation and responsive loading feedback.
   - Dual-engine analysis: Rule-based Demo Engine (free, offline) and Live AI mode (Gemini).

2. **Analysis Result View:**
   - Cautious risk categories: `HIGH RISK`, `MEDIUM RISK`, `LOW RISK`, `INSUFFICIENT INFORMATION`.
   - Verbatim evidence quotes from the message.
   - Plain-language explanations of deception mechanics.
   - Actionable safe next steps.
   - **"Report This Scam" Action:** Direct handoff to the reporting workflow, automatically prefilling the analysed message and offering AI-assisted observations as educational notes.

3. **Interactive Learning Module:**
   - Three realistic Indian scenarios: Bank Account Alert, Internship Offer, Prize Notification.
   - Immediate answer feedback with breakdown of warning signs and practical safety tips.
   - React state score tracking (100% offline).

4. **Complete Scam Reporting Workflow:**
   - Multi-step, guided report preparation wizard.
   - Screenshot evidence upload with drag-and-drop support.
   - Financial loss section with immediate 1930 helpline guidance.
   - Full review screen with per-section editing.
   - One-click copy and plain-text `.txt` export.
   - Direct link to official Indian government portal.

---

## Scam Report Preparation Workflow

The reporting workflow is accessible from the top navigation, homepage hero, and analysis results.

### Multi-Step Guided Structure

```
[1. Incident Details] ──> [2. Suspicious Message] ──> [3. Evidence Upload]
          │
          ▼
[4. Financial Loss]   ──> [5. Review & Confirm]  ──> [6. Portal Handoff]
```

1. **Step 1: Incident Details:**
   - Incident type classification (Phishing, Fake job, UPI fraud, Bank impersonation, etc.).
   - Platform / Medium (SMS, WhatsApp, Email, Phone call, Telegram, Instagram, etc.).
   - Incident date (approximate dates permitted).
   - Detailed incident description (up to 2,000 characters).
   - Optional: Sender phone/email, suspicious website URL, and Indian State/UT.

2. **Step 2: Suspicious Message Input:**
   - Complete message text (up to 5,000 characters).
   - Live character counter and clear button.
   - Optional toggle to include ScamShield's AI-assisted observations as educational notes.
   - Explicit privacy warning against entering authentication secrets.

3. **Step 3: Screenshot Evidence Upload:**
   - Working drag-and-drop zone and file picker.
   - Image previews with file names and size indicators.
   - Individual remove buttons.

4. **Step 4: Optional Financial Information:**
   - Records whether money was transferred.
   - If funds were lost: Amount in INR, payment method (UPI, Bank transfer, Card, Wallet), date, and transaction reference/UTR.
   - Prominent 1930 emergency banner for rapid bank account freezes.

5. **Step 5: Review & Confirmation:**
   - Summary view of all entered fields with individual **"Edit"** buttons.
   - Mandatory review checkbox confirming user understanding that ScamShield does not file complaints directly.
   - **"Prepare Report and Continue"** action.

6. **Step 6: Report Prepared & Portal Handoff:**
   - Success status notification: *"Your report is ready to review."*
   - **Copy Report Details:** Formatted plain-text summary copied to clipboard (with manual fallback).
   - **Download Report Summary:** Generates `scamshield-report-summary.txt`.
   - **Continue to Official Government Portal:** Directly opens `https://cybercrime.gov.in/` in a secure tab.
   - Step-by-step guidance on how to submit the complaint on the government portal.

---

## Evidence Upload & Privacy

- **Supported Image Formats:** PNG, JPG, JPEG, WEBP.
- **Size Limits:** Up to 5 MB per file; maximum 5 screenshots.
- **In-Memory Storage:** For privacy and security, uploaded screenshots are kept strictly in local browser memory via object URLs during the form session.
- **No Automatic Transfer:** Screenshots and reports are **never** uploaded to external servers, cloud buckets, or databases by ScamShield. Users must attach the original files directly when filing on the official government portal.

---

## Official Portal Handoff & 1930 Helpline

### Distinction Between Preparation and Government Submission
> **Important:** ScamShield prepares your incident summary for your convenience. It **does NOT** automatically submit the complaint to the police or cybercrime authorities. You must complete and submit your complaint on the official portal.

### Official Portal
- **Website:** [National Cyber Crime Reporting Portal (cybercrime.gov.in)](https://cybercrime.gov.in/)
- **Link Security:** Configured with `target="_blank"` and `rel="noopener noreferrer"`.

### Financial Fraud Emergency Helpline (1930)
If you have transferred funds to a fraudulent party in India:
- **Call `1930` immediately** (available 24/7).
- Request an immediate transaction freeze through the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS).
- Inform your bank's fraud monitoring department without delay.

---

## Technical Architecture

- **Frontend:** React 19, Vite 8, TypeScript, Tailwind CSS v4, Lucide React.
- **Backend API:** Node.js (v18+), Express.js 4, TypeScript, Zod.
- **State Management:** Reactive component state with browser hash routing (`#report` for reporting flow).
- **Security:** In-memory image processing, strict prompt injection defense for LLM calls, and zero external database dependencies.

---

## Installation & Setup

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### 1. Clone Repository
```bash
git clone https://github.com/adityan271/Scam-Shield.git
cd Scam-Shield
```

### 2. Install Dependencies
```bash
npm install
npm --prefix server install
npm --prefix client install
```

---

## Running the Application

### Development Mode (Runs Frontend & Backend Concurrently)
```bash
npm run dev
```
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

### Running Individually
```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client
```

### Production Build & Serve
```bash
npm run build
npm start
```
The production Express server automatically serves the compiled frontend assets from `client/dist` at `http://localhost:5000`.

---

## Environment Configuration

ScamShield works in **Demo Mode by default** with **zero configuration and zero API keys**.

To optionally configure Live AI analysis, copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `5000` | Backend API port |
| `CLIENT_ORIGIN` | *(empty)* | Comma-separated allowed frontend origins; local Vite origins are allowed outside production |
| `ANALYSIS_MODE` | `demo` | `demo` (rule-based) or `live` (AI provider) |
| `AI_API_KEY` | *(empty)* | Google Gemini API key (optional) |
| `AI_MODEL` | `gemini-1.5-flash` | Gemini model variant |

---

## Analysis Modes (Demo vs. Live AI)

### Demo Mode (Default, Zero Software Cost)
- Deterministic heuristic engine covering Indian digital scam patterns: OTP requests, account deactivations, UPI job fees, KBC prizes, electricity threats, unverified APKs/AnyDesk, and lookalike domains.
- Labelled visibly as: **"Demo analysis · Rule-based"**.
- Completely free and functions offline without an external API.

### Live AI Mode (Optional)
- Requires a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/).
- Structured JSON output validated at runtime via Zod.
- Includes a 15-second timeout with fallback to Demo Mode if unavailable.

---

## API Reference

### Health Check
`GET /api/health`
```json
{
  "status": "ok",
  "mode": "demo",
  "provider": "Rule-based Demo Engine",
  "timestamp": "2026-10-28T08:00:00.000Z"
}
```

### Analyse Message
`POST /api/analyze`
```json
{
  "message": "URGENT: Your HDFC bank account has been blocked due to missing PAN KYC. Update immediately at https://hdfc-kyc-verify.me or send your OTP to 9876543210 to restore access within 2 hours.",
  "forceDemo": false
}
```

---

## Testing & Quality Assurance

Run the automated test suite covering both API endpoints and UI/design compliance:

```bash
npm test
```

### Test Coverage
1. **API Integration Tests (`tests/api-test.js`):**
   - Health check response.
   - Empty input validation (400).
   - Input length limit enforcement (413).
   - OTP bank scam detection (HIGH risk with warning signs).
   - Internship upfront fee scam detection (HIGH risk).
   - Benign personal message evaluation (LOW risk).
   - Insufficient information handling (`INSUFFICIENT_INFORMATION`).
2. **Design & Workflow Tests (`tests/white-redesign-test.js`):**
   - Absence of glassmorphism (`backdrop-filter: blur`).
   - Absence of emojis across compiled client code.
   - Verified official cybercrime portal link.
   - All 6 reporting workflow sections verified.
   - 1930 helpline notice verified.
   - File upload limits (PNG/JPG/WEBP, 5 MB, max 5) enforced.
   - Export (.txt download and clipboard copy) verified.
   - Integration between Analyser results and Report workflow verified.

---

## Zero-Cost Deployment

### Single Full-Stack Service (Render / Railway / Koyeb)
1. **Build Command:** `npm install && npm run build`
2. **Start Command:** `npm start`
3. **Environment:** `PORT=5000`, `ANALYSIS_MODE=demo`

### Separate Frontend & Backend
- **Frontend (Vercel / Cloudflare Pages):**
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com`
- **Backend (Render / Railway):**
  - Root directory: `server`
  - Build command: `npm run build`
  - Start command: `node dist/server.js`
  - Environment variable: `CLIENT_ORIGIN=https://your-frontend.vercel.app`

---

## Privacy & Responsible AI Disclaimers

### Privacy
- ScamShield does not save or log message text, incident details, or uploaded screenshots to a database.
- Report text and the current workflow step are saved in tab-scoped `sessionStorage` so a report can be resumed after a reload; they are cleared when the tab's session ends or the user starts a new report.
- Uploaded screenshots remain in browser memory only and must be reattached after a reload. They are never uploaded automatically.
- The backend only allows browser origins listed in `CLIENT_ORIGIN` (plus local Vite origins outside production), and configured remote API URLs must use HTTPS.

### Legal Notice
- ScamShield is an educational cybersecurity tool. It does not provide legal, banking, or law enforcement advice.
- Low-risk assessments do not guarantee safety. Always verify suspicious communications through official channels.

---

## License

This project is licensed under the [MIT License](LICENSE).
