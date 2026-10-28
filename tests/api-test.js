/**
 * ScamShield India - Automated Integration Test Suite
 * Tests all core API endpoints, input validation, and risk assessment logic.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000';

async function runTests() {
  console.log(`\n==============================================`);
  console.log(`ScamShield India — Integration Test Suite`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`==============================================\n`);

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

  try {
    // Test 1: Health check endpoint
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(
      healthRes.status === 200 && healthData.status === 'ok',
      'GET /api/health returns 200 and status: ok'
    );

    // Test 2: Reject empty message
    const emptyRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '   ' }),
    });
    const emptyData = await emptyRes.json();
    assert(
      emptyRes.status === 400 && emptyData.success === false,
      'POST /api/analyze rejects empty/whitespace input with 400'
    );

    // Test 3: Reject >5000 characters
    const longRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'A'.repeat(5001) }),
    });
    const longData = await longRes.json();
    assert(
      longRes.status === 413 && longData.success === false,
      'POST /api/analyze enforces 5000-char limit with 413'
    );

    // Test 4: OTP Bank Scam message
    const otpMsg =
      'URGENT: Your HDFC bank account has been blocked due to missing PAN KYC. Update immediately at https://hdfc-kyc-verify.me or send your OTP to 9876543210 to restore access within 2 hours.';
    const otpRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: otpMsg }),
    });
    const otpData = await otpRes.json();
    assert(
      otpRes.status === 200 &&
        otpData.success === true &&
        otpData.analysis.riskLevel === 'HIGH' &&
        otpData.analysis.warningSigns.length >= 2,
      'POST /api/analyze accurately identifies OTP Bank Scam as HIGH RISK with multiple warning signs'
    );

    // Test 5: Internship Upfront Fee Scam message
    const internMsg =
      'Congratulations! Selected for Google Data Internship with Rs 45,000/month stipend. Pay Rs 1,499 refundable registration fee via UPI to secure slot.';
    const internRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: internMsg }),
    });
    const internData = await internRes.json();
    assert(
      internRes.status === 200 &&
        internData.success === true &&
        internData.analysis.riskLevel === 'HIGH' &&
        internData.analysis.warningSigns.some((w) =>
          w.title.includes('Advance Fee Demand')
        ),
      'POST /api/analyze detects Internship Advance Fee Scam as HIGH RISK'
    );

    // Test 6: Benign personal message
    const benignMsg =
      'Hi Ramesh, reaching home by 8:30 PM this evening. Please keep dinner ready. Will call once I board the metro.';
    const benignRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: benignMsg }),
    });
    const benignData = await benignRes.json();
    assert(
      benignRes.status === 200 &&
        benignData.success === true &&
        benignData.analysis.riskLevel === 'LOW' &&
        benignData.analysis.warningSigns.length === 0,
      'POST /api/analyze categorises normal personal message as LOW RISK with 0 warnings'
    );

    // Test 7: Insufficient information
    const shortMsg = 'hello';
    const shortRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: shortMsg }),
    });
    const shortData = await shortRes.json();
    assert(
      shortRes.status === 200 &&
        shortData.success === true &&
        shortData.analysis.riskLevel === 'INSUFFICIENT_INFORMATION',
      'POST /api/analyze flags brief/vague message as INSUFFICIENT_INFORMATION'
    );
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log(`\n==============================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`==============================================\n`);

  process.exitCode = failed > 0 ? 1 : 0;
}

runTests();
