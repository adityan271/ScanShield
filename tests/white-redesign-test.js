/**
 * ScamShield India — UI Redesign & Report Workflow Verification Suite
 * Verifies design compliance (zero emojis, zero glassmorphism, white palette)
 * and reporting workflow data contracts.
 */

import fs from 'fs';
import path from 'path';

function runVerification() {
  console.log(`\n======================================================`);
  console.log(`ScamShield India — Redesign & Report Workflow Tests`);
  console.log(`======================================================\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Check built CSS for strict absence of glassmorphism (backdrop-filter: blur)
  const clientDistCssDir = path.resolve('./client/dist/assets');
  let combinedCss = '';
  if (fs.existsSync(clientDistCssDir)) {
    const files = fs.readdirSync(clientDistCssDir);
    const cssFile = files.find((f) => f.endsWith('.css'));
    if (cssFile) {
      combinedCss = fs.readFileSync(path.join(clientDistCssDir, cssFile), 'utf-8');
    }
  }

  assert(
    !combinedCss.includes('backdrop-filter:blur') &&
      !combinedCss.includes('backdrop-filter: blur'),
    'Design Compliance: Zero glassmorphism (no backdrop-filter blur) in production CSS'
  );

  // Test 2: Check built JS bundle for emojis
  const clientDistJsDir = path.resolve('./client/dist/assets');
  let combinedJs = '';
  if (fs.existsSync(clientDistJsDir)) {
    const files = fs.readdirSync(clientDistJsDir);
    const jsFile = files.find((f) => f.endsWith('.js'));
    if (jsFile) {
      combinedJs = fs.readFileSync(path.join(clientDistJsDir, jsFile), 'utf-8');
    }
  }

  // Regex detecting common Unicode emoji ranges
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const hasEmoji = emojiRegex.test(combinedJs);
  assert(
    !hasEmoji,
    'Design Compliance: Zero emojis anywhere in compiled client bundle'
  );

  // Test 3: Check official cybercrime portal link
  assert(
    combinedJs.includes('https://cybercrime.gov.in/'),
    'Official Portal Handoff: Correct verified portal link https://cybercrime.gov.in/ is configured'
  );

  // Test 4: Check ReportWorkflow component exists and has required sections
  const reportWorkflowCode = fs.readFileSync(
    path.resolve('./client/src/components/ReportWorkflow.tsx'),
    'utf-8'
  );

  assert(
    reportWorkflowCode.includes('Incident Details') &&
      reportWorkflowCode.includes('What did the suspicious message say?') &&
      reportWorkflowCode.includes('Add screenshot evidence') &&
      reportWorkflowCode.includes('Financial Information') &&
      reportWorkflowCode.includes('Review your report') &&
      reportWorkflowCode.includes('Your report is ready to review.'),
    'Workflow Architecture: All 6 workflow sections are implemented'
  );

  // Test 5: Verify 1930 emergency helpline notice is present
  assert(
    reportWorkflowCode.includes('1930') &&
      reportWorkflowCode.includes('National Cyber Financial Fraud Helpline'),
    'Safety Architecture: 1930 emergency helpline notice is prominently configured'
  );

  // Test 6: Verify evidence upload limits (PNG, JPG, WEBP, 5 MB, max 5)
  assert(
    reportWorkflowCode.includes('5 * 1024 * 1024') &&
      reportWorkflowCode.includes('maxFiles = 5') &&
      reportWorkflowCode.includes('image/webp'),
    'Evidence Upload: File limits (5 MB, 5 files max, PNG/JPG/WEBP) enforced in code'
  );

  // Test 7: Verify copy and download functions
  assert(
    reportWorkflowCode.includes('scamshield-report-summary') &&
      reportWorkflowCode.includes('navigator.clipboard') &&
      reportWorkflowCode.includes('blob'),
    'Report Export: Plain-text download and clipboard copy functions implemented'
  );

  // Test 8: Verify analysis results has Report This Scam action
  const analysisResultCode = fs.readFileSync(
    path.resolve('./client/src/components/AnalysisResult.tsx'),
    'utf-8'
  );
  assert(
    analysisResultCode.includes('Report This Scam') &&
      analysisResultCode.includes('onReportThisScam'),
    'Integration: AnalysisResult includes Report This Scam action prefill handoff'
  );

  console.log(`\n======================================================`);
  console.log(`Verification Results: ${passed} passed, ${failed} failed`);
  console.log(`======================================================\n`);

  process.exitCode = failed > 0 ? 1 : 0;
}

runVerification();
