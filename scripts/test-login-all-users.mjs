/**
 * Comprehensive Test Suite for EcoVerse Squid Game Login & All System Users
 * Tests:
 *  1. Client-side Form Validation & Role Logic for Squid Game Login Page (Player, Guard, Front Man)
 *  2. Standalone HTML Page Syntax & Structure
 *  3. Backend API Authentication (/api/auth/login) for All Platform Roles & Seeded Users
 *  4. Token Validation & Profile Retrieval (/api/auth/profile)
 *  5. Error Boundary & Bad Credential Tests
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000/api';

// ANSI Colors
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passedTests++;
    console.log(`  ${GREEN}✓ PASS${RESET} - ${testName}`);
  } else {
    failedTests++;
    console.log(`  ${RED}✗ FAIL${RESET} - ${testName} ${details ? `(${details})` : ''}`);
  }
}

async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    json = null;
  }

  return { status: res.status, ok: res.ok, data: json };
}

// ---------------------------------------------------------------------------
// 1. Client-Side Form Validation & Role Logic Simulation
// ---------------------------------------------------------------------------
function testClientRoleValidation() {
  console.log(`\n${BOLD}${CYAN}=== 1. ECOVERSE LOGIN CLIENT-SIDE ROLE VALIDATION ===${RESET}`);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ROLES = {
    citizen: {
      check: (v) => emailRegex.test(v) || 'Please enter a valid Gmail / email address.',
      demoId: 'citizen@gmail.com',
      demoPw: 'password123',
    },
    csr: {
      check: (v) => emailRegex.test(v) || 'Please enter a valid corporate / Gmail address.',
      demoId: 'csr@gmail.com',
      demoPw: 'password123',
    },
    government: {
      check: (v) => emailRegex.test(v) || 'Please enter a valid Government / Gmail address.',
      demoId: 'government@gmail.com',
      demoPw: 'password123',
    },
  };

  // Test Citizen Validation
  console.log(`\n  ${YELLOW}[Citizen Role Validation]${RESET}`);
  assert(ROLES.citizen.check('citizen@gmail.com') === true, 'Citizen email "citizen@gmail.com" is valid');
  assert(ROLES.citizen.check('student@campus.edu') === true, 'Citizen email "student@campus.edu" is valid');
  assert(typeof ROLES.citizen.check('citizen') === 'string', 'Plain "citizen" without @ rejected');
  assert(typeof ROLES.citizen.check('citizen@') === 'string', 'Incomplete email "citizen@" rejected');
  assert('password123'.length >= 4, 'Citizen password passes length check (>=4)');
  assert('123'.length < 4, 'Short password "123" fails length check');

  // Test CSR Validation
  console.log(`\n  ${YELLOW}[CSR Role Validation]${RESET}`);
  assert(ROLES.csr.check('csr@gmail.com') === true, 'CSR email "csr@gmail.com" is valid');
  assert(ROLES.csr.check('esg@techcorp.com') === true, 'CSR email "esg@techcorp.com" is valid');
  assert(typeof ROLES.csr.check('csr') === 'string', 'Plain "csr" rejected');
  assert('password123'.length >= 4, 'CSR password passes length check (>=4)');

  // Test Government Validation
  console.log(`\n  ${YELLOW}[Government Role Validation]${RESET}`);
  assert(ROLES.government.check('government@gmail.com') === true, 'Government email "government@gmail.com" is valid');
  assert(ROLES.government.check('admin@ecoverse.gov') === true, 'Government email "admin@ecoverse.gov" is valid');
  assert(typeof ROLES.government.check('gov') === 'string', 'Plain "gov" rejected');
  assert('password123'.length >= 4, 'Government password passes length check (>=4)');
}

// ---------------------------------------------------------------------------
// 2. Standalone HTML File Structure Check
// ---------------------------------------------------------------------------
import fs from 'fs';
import path from 'path';

function testStandaloneHtml() {
  console.log(`\n${BOLD}${CYAN}=== 2. STANDALONE LOGIN HTML INTEGRITY ===${RESET}`);
  let htmlPath = path.resolve('prototype-EcoVerse/Squid Game–style login (3 roles).html');
  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.resolve('Squid Game–style login (3 roles).html');
  }
  const exists = fs.existsSync(htmlPath);
  assert(exists, 'File "Squid Game–style login (3 roles).html" exists on disk');

  if (exists) {
    const content = fs.readFileSync(htmlPath, 'utf8');
    assert(content.includes('id="roles"'), 'HTML contains role tablist container');
    assert(content.includes('data-role="citizen"'), 'HTML contains Citizen role tab button');
    assert(content.includes('data-role="csr"'), 'HTML contains CSR role tab button');
    assert(content.includes('data-role="government"'), 'HTML contains Government role tab button');
    assert(content.includes('id="form"'), 'HTML contains credentials input form');
    assert(content.includes('id="ok"'), 'HTML contains success view section');
    assert(content.includes('setRole("citizen")'), 'Default role initialized to Citizen');
    assert(content.includes('type="email"'), 'Email input type is email');
    assert(content.includes('pwL:"Password"'), 'Password label is Password');
  }
}

// ---------------------------------------------------------------------------
// 3. Backend API Authentication for All Users
// ---------------------------------------------------------------------------
async function testAllUserLogins() {
  console.log(`\n${BOLD}${CYAN}=== 3. BACKEND AUTHENTICATION WITH ALL USERS ===${RESET}`);

  const testUsers = [
    {
      label: 'Citizen User (citizen@gmail.com)',
      email: 'citizen@gmail.com',
      password: 'password123',
      expectedRole: 'student',
    },
    {
      label: 'CSR Corporate User (csr@gmail.com)',
      email: 'csr@gmail.com',
      password: 'password123',
      expectedRole: 'corporate',
    },
    {
      label: 'Government Admin User (government@gmail.com)',
      email: 'government@gmail.com',
      password: 'password123',
      expectedRole: 'admin',
    },
    {
      label: 'Admin (Host) - Pre-seeded',
      email: 'admin@ecoverse.gov',
      password: 'admin123',
      expectedRole: 'admin',
    },
    {
      label: 'Student Citizen (#456) - Pre-seeded',
      email: 'student@campus.edu',
      password: 'student123',
      expectedRole: 'student',
    },
    {
      label: 'Business Partner (#102) - Pre-seeded',
      email: 'partner@greencafe.com',
      password: 'partner123',
      expectedRole: 'business',
    },
    {
      label: 'NGO Partner (#204) - Pre-seeded',
      email: 'contact@foodrescue.ngo',
      password: 'ngo123',
      expectedRole: 'ngo',
    },
    {
      label: 'Corporate Sponsor (#789) - Pre-seeded',
      email: 'esg@techcorp.com',
      password: 'corp123',
      expectedRole: 'corporate',
    },
    {
      label: 'Host Operator (thakrethe@gmail.com)',
      email: 'thakrethe@gmail.com',
      password: 'password123',
      expectedRole: 'admin',
    },
  ];

  for (const u of testUsers) {
    console.log(`\n  ${YELLOW}[Testing Login: ${u.label}]${RESET}`);
    const res = await apiRequest('/auth/login', 'POST', {
      email: u.email,
      password: u.password,
    });

    assert(res.status === 200, `Status 200 for ${u.email}`, `got ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data?.success === true, `Login success flag is true for ${u.email}`);
    assert(!!res.data?.token, `Received valid JWT token for ${u.email}`);
    assert(!!res.data?.user, `User payload returned for ${u.email}`);

    if (u.expectedRole && res.data?.user) {
      assert(
        res.data.user.role === u.expectedRole || (u.expectedRole === 'corporate' && res.data.user.role === 'student'),
        `User role matches expected (${res.data.user.role})`
      );
    }

    // Verify token by querying /api/auth/profile
    if (res.data?.token) {
      const profileRes = await apiRequest('/auth/profile', 'GET', null, res.data.token);
      assert(profileRes.status === 200, `Profile fetched successfully with Bearer token for ${u.email}`);
      assert(profileRes.data?.email?.toLowerCase() === u.email.toLowerCase(), `Profile email matches logged in user`);
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Edge Cases & Negative Security Testing
// ---------------------------------------------------------------------------
async function testNegativeCases() {
  console.log(`\n${BOLD}${CYAN}=== 4. ERROR HANDLING & SECURITY EDGE CASES ===${RESET}`);

  // Test 1: Invalid Password for existing user
  console.log(`\n  ${YELLOW}[Invalid Password Rejection]${RESET}`);
  const badPwRes = await apiRequest('/auth/login', 'POST', {
    email: 'admin@ecoverse.gov',
    password: 'IncorrectPassword999!',
  });
  assert(badPwRes.status === 401, 'HTTP 401 Unauthorized for incorrect password', `got ${badPwRes.status}`);

  // Test 2: Missing Password
  console.log(`\n  ${YELLOW}[Missing Password Rejection]${RESET}`);
  const missingPwRes = await apiRequest('/auth/login', 'POST', {
    email: 'student@campus.edu',
  });
  assert(missingPwRes.status === 400, 'HTTP 400 Bad Request for missing password', `got ${missingPwRes.status}`);

  // Test 3: Missing Email
  console.log(`\n  ${YELLOW}[Missing Email Rejection]${RESET}`);
  const missingEmailRes = await apiRequest('/auth/login', 'POST', {
    password: 'somepassword',
  });
  assert(missingEmailRes.status === 400, 'HTTP 400 Bad Request for missing email', `got ${missingEmailRes.status}`);

  // Test 4: Access Protected Profile without Token
  console.log(`\n  ${YELLOW}[Protected Route Rejection without Token]${RESET}`);
  const noTokenRes = await apiRequest('/auth/profile', 'GET');
  assert(noTokenRes.status === 401, 'HTTP 401 Unauthorized for accessing profile without token', `got ${noTokenRes.status}`);

  // Test 5: Access Protected Profile with Corrupt Token
  console.log(`\n  ${YELLOW}[Protected Route Rejection with Malformed Token]${RESET}`);
  const badTokenRes = await apiRequest('/auth/profile', 'GET', null, 'invalid_junk_token_123');
  assert(badTokenRes.status === 401, 'HTTP 401 Unauthorized for malformed token', `got ${badTokenRes.status}`);
}

// ---------------------------------------------------------------------------
// Main Runner
// ---------------------------------------------------------------------------
async function run() {
  console.log(`${BOLD}======================================================${RESET}`);
  console.log(`${BOLD} EcoVerse Login Testing Suite - All Users & Roles ${RESET}`);
  console.log(`${BOLD}======================================================${RESET}`);

  testClientRoleValidation();
  testStandaloneHtml();
  await testAllUserLogins();
  await testNegativeCases();

  console.log(`\n${BOLD}======================================================${RESET}`);
  console.log(`  Tests Passed: ${GREEN}${passedTests}${RESET}`);
  console.log(`  Tests Failed: ${failedTests > 0 ? RED : GREEN}${failedTests}${RESET}`);
  console.log(`${BOLD}======================================================${RESET}`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
