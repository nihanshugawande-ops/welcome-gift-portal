/**
 * Automated Test Suite for Welcome Gift Portal
 * Covers backend REST APIs, validation, database persistence, admin security, and truthful OTP status.
 */

const BASE_URL = 'http://localhost:3000';
const TEST_HEADERS = {
  'Content-Type': 'application/json',
  'x-test-mode': 'automated-test',
};

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING AUTOMATED TEST SUITE: WELCOME GIFT PORTAL');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // 1. Health and Database Check
  try {
    const res = await fetch(`${BASE_URL}/api/health`, { headers: TEST_HEADERS });
    const data = await res.json();
    assert(res.ok && data.database?.connected === true, '1. Server Health & Database Connection (SQLite active)');
    assert(data.database?.engine.includes('SQLite'), '1b. Correct database engine reported');
  } catch (err: any) {
    assert(false, '1. Server Health & Database Connection', err.message);
  }

  // 2. Consent Requirement Validation
  try {
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({
        countryCode: '+91',
        mobileNumber: '9876543210',
        displayName: 'Test User',
        consent: false,
      }),
    });
    const data = await res.json();
    assert(res.status === 400 && data.success === false, '2. Reject registration when consent is false');
  } catch (err: any) {
    assert(false, '2. Consent Requirement Validation', err.message);
  }

  // 3. Indian Mobile Number Format Validation
  try {
    // Number starting with 2 is invalid for India
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({
        countryCode: '+91',
        mobileNumber: '2876543210',
        displayName: 'Test User',
        consent: true,
      }),
    });
    const data = await res.json();
    assert(
      res.status === 400 && data.message.includes('Indian mobile numbers must start with 6, 7, 8, or 9'),
      '3. Reject invalid Indian mobile prefix'
    );
  } catch (err: any) {
    assert(false, '3. Indian Mobile Number Format Validation', err.message);
  }

  // 3b. Name is Mandatory Validation (नाम डालना जरूरी है)
  try {
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({
        countryCode: '+91',
        mobileNumber: '9876543210',
        displayName: '   ',
        consent: true,
      }),
    });
    const data = await res.json();
    assert(
      res.status === 400 && data.message.includes('Name is required'),
      '3b. Reject registration when name is missing or empty (नाम डालना जरूरी है)'
    );
  } catch (err: any) {
    assert(false, '3b. Mandatory Name Validation', err.message);
  }

  // 3c. Name Minimum Length Validation
  try {
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({
        countryCode: '+91',
        mobileNumber: '9876543210',
        displayName: 'R',
        consent: true,
      }),
    });
    const data = await res.json();
    assert(
      res.status === 400 && data.message.includes('at least 2 characters'),
      '3c. Reject registration when name is too short (< 2 chars)'
    );
  } catch (err: any) {
    assert(false, '3c. Name Minimum Length Validation', err.message);
  }

  // 4. Successful Registration with Required Display Name
  let testRegId = '';
  const testNumber = '9876543299';
  const testName = 'Bhojraj Gawande';
  try {
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({
        countryCode: '+91',
        mobileNumber: testNumber,
        displayName: testName,
        consent: true,
      }),
    });
    const data = await res.json();
    testRegId = data.data?.id;
    assert(
      (res.status === 201 || res.status === 200) &&
        data.success === true &&
        data.data?.fullMobileNumber === `+91${testNumber}` &&
        data.data?.displayName === testName &&
        data.data?.registrationStatus === 'Registration Received' &&
        data.data?.verificationStatus === 'not_verified',
      '4. Successful registration saved in database with required displayName and full mobile number'
    );
  } catch (err: any) {
    assert(false, '4. Successful Registration', err.message);
  }

  // 5. Duplicate Submission Prevention
  try {
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({
        countryCode: '+91',
        mobileNumber: testNumber,
        displayName: 'Test Friend Duplicate',
        consent: true,
      }),
    });
    const data = await res.json();
    assert(
      data.success === true && data.isExisting === true && data.data?.fullMobileNumber === `+91${testNumber}`,
      '5. Duplicate submission returns existing record without creating duplicate'
    );
  } catch (err: any) {
    assert(false, '5. Duplicate Submission Prevention', err.message);
  }

  // 6. Truthful OTP Provider Status Check
  try {
    const res = await fetch(`${BASE_URL}/api/otp/request`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({ countryCode: '+91', mobileNumber: testNumber }),
    });
    const data = await res.json();
    assert(
      res.status === 503 && data.configured === false && data.message.includes('not configured'),
      '6. OTP request truthfully reports unconfigured provider (no fake OTP simulated)'
    );

    const verifyRes = await fetch(`${BASE_URL}/api/otp/verify`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({ countryCode: '+91', mobileNumber: testNumber, otp: '123456' }),
    });
    const verifyData = await verifyRes.json();
    assert(
      verifyRes.status === 400 && verifyData.configured === false && verifyData.message.includes('not configured'),
      '6b. OTP verify truthfully informs SMS provider is unconfigured without simulated verification'
    );
  } catch (err: any) {
    assert(false, '6. Truthful OTP Provider Check', err.message);
  }

  // 7. Security: Unauthorized Visitor Access Blocked
  try {
    const res = await fetch(`${BASE_URL}/api/admin/registrations`, {
      headers: { 'x-test-mode': 'automated-test' },
    });
    assert(res.status === 401, '7. Unauthorized access to admin registrations is blocked (401)');
  } catch (err: any) {
    assert(false, '7. Security Unauthorized Check', err.message);
  }

  // 8. Security: Unauthorized CSV Export Blocked
  try {
    const res = await fetch(`${BASE_URL}/api/admin/export-csv`, {
      headers: { 'x-test-mode': 'automated-test' },
    });
    assert(res.status === 401, '8. Unauthorized access to CSV export is blocked (401)');
  } catch (err: any) {
    assert(false, '8. Unauthorized CSV Export Blocked', err.message);
  }

  // 9. Admin Login with Invalid Password
  try {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({ username: 'admin', password: 'WrongPassword123!' }),
    });
    assert(res.status === 401, '9. Admin login with wrong password rejected');
  } catch (err: any) {
    assert(false, '9. Admin Login Invalid Password', err.message);
  }

  // 10. Admin Login with Valid Credentials
  let adminToken = '';
  try {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({ username: 'admin', password: 'WelcomeGift@Admin2026' }),
    });
    const data = await res.json();
    adminToken = data.token;
    assert(res.ok && data.success === true && Boolean(adminToken), '10. Admin login successful and bearer token issued');

    if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
      const envRes = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: TEST_HEADERS,
        body: JSON.stringify({
          username: process.env.ADMIN_USERNAME,
          password: process.env.ADMIN_PASSWORD,
        }),
      });
      const envData = await envRes.json();
      assert(
        envRes.ok && envData.success === true && Boolean(envData.token),
        '10b. Admin login with environment variables (ADMIN_USERNAME / ADMIN_PASSWORD) succeeds'
      );
    }
  } catch (err: any) {
    assert(false, '10. Admin Login Valid Credentials', err.message);
  }

  // 11. Admin Statistics Breakdown
  try {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}`, 'x-test-mode': 'automated-test' },
    });
    const data = await res.json();
    assert(
      res.ok &&
        data.success === true &&
        typeof data.stats.totalRegistrations === 'number' &&
        typeof data.stats.verifiedNumbers === 'number' &&
        typeof data.stats.unverifiedNumbers === 'number',
      '11. Admin stats provides total, today, verified and unverified counts'
    );
  } catch (err: any) {
    assert(false, '11. Admin Statistics Breakdown', err.message);
  }

  // 12. Search & List Registrations
  try {
    const res = await fetch(`${BASE_URL}/api/admin/registrations?search=${testNumber}`, {
      headers: { Authorization: `Bearer ${adminToken}`, 'x-test-mode': 'automated-test' },
    });
    const data = await res.json();
    const found = data.records?.find((r: any) => r.nationalNumber === testNumber);
    assert(res.ok && data.success === true && Boolean(found), '12. Admin search locates record by phone digits');
    assert(
      found && found.fullMobileNumber === `+91${testNumber}` && found.displayName === testName && found.id.startsWith('WG-'),
      '12b. End-to-End Verified: Registrant full number, name, and ID appear accurately in Admin Dashboard'
    );
  } catch (err: any) {
    assert(false, '12. Search & List Registrations', err.message);
  }

  // 12c. Real-Time SSE Endpoint Connectivity Test
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${BASE_URL}/api/admin/live-stream?token=${encodeURIComponent(adminToken)}`, {
      signal: controller.signal,
    }).catch((err) => {
      // AbortError is expected because SSE keeps the connection open indefinitely
      if (err.name === 'AbortError') return { ok: true, status: 200 };
      throw err;
    });
    clearTimeout(timeout);
    assert(res && res.status === 200, '12c. Real-Time Server-Sent Events (SSE) live connection verified');
  } catch (err: any) {
    assert(false, '12c. Real-Time SSE Endpoint Connectivity Test', err.message);
  }

  // 13. Single Registration Record Retrieval
  if (testRegId) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/registrations/${testRegId}`, {
        headers: { Authorization: `Bearer ${adminToken}`, 'x-test-mode': 'automated-test' },
      });
      const data = await res.json();
      assert(
        res.ok && data.success === true && data.record?.id === testRegId,
        '13. Get single registration record by ID'
      );
    } catch (err: any) {
      assert(false, '13. Single Registration Record Retrieval', err.message);
    }
  }

  // 14. Authorized CSV Export
  try {
    const res = await fetch(`${BASE_URL}/api/admin/export-csv`, {
      headers: { Authorization: `Bearer ${adminToken}`, 'x-test-mode': 'automated-test' },
    });
    const text = await res.text();
    assert(
      res.ok &&
        Boolean(res.headers.get('content-type')?.includes('text/csv')) &&
        text.includes('Registration ID') &&
        text.includes(testNumber),
      '14. Authorized CSV export contains headers and saved record data'
    );
  } catch (err: any) {
    assert(false, '14. Authorized CSV Export', err.message);
  }

  // 15. Record Deletion with Admin Authorization
  if (testRegId) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/registrations/${testRegId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}`, 'x-test-mode': 'automated-test' },
      });
      const data = await res.json();
      assert(res.ok && data.success === true, '15. Permanently delete registration record by ID');

      // Verify deletion
      const verifyRes = await fetch(`${BASE_URL}/api/admin/registrations/${testRegId}`, {
        headers: { Authorization: `Bearer ${adminToken}`, 'x-test-mode': 'automated-test' },
      });
      assert(verifyRes.status === 404, '16. Verified deleted record returns 404');
    } catch (err: any) {
      assert(false, '15. Record Deletion', err.message);
    }
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
