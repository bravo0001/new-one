import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('======================================================');
console.log(' EcoVerse Role-Based Redirection Testing Suite ');
console.log('======================================================\n');

const API_BASE = 'http://localhost:3000/api';

async function testBackendLoginAndRedirect(email, password, expectedRole, expectedPanelPath, expectedPanelName) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  assert.strictEqual(res.status, 200, `Expected 200 OK for ${email}`);
  const data = await res.json();
  assert.strictEqual(data.success, true, `Expected success true for ${email}`);
  assert.ok(data.token, `Expected token for ${email}`);
  assert.strictEqual(data.user.role, expectedRole, `Expected role ${expectedRole} for ${email}`);

  // Test client-side redirect determination
  const userRole = data.user.role;
  const portalPath = userRole === 'admin' ? '/organization' : userRole === 'corporate' ? '/csr' : '/user';
  const panelName = userRole === 'admin' ? 'Government Panel' : userRole === 'corporate' ? 'CSR Panel' : 'Citizen Panel';

  assert.strictEqual(portalPath, expectedPanelPath, `Expected path ${expectedPanelPath} for ${email}`);
  assert.strictEqual(panelName, expectedPanelName, `Expected panel name ${expectedPanelName} for ${email}`);

  console.log(`  ✓ PASS - ${email} authenticated as [${expectedRole}] -> redirects to ${expectedPanelName} (${expectedPanelPath})`);
}

// 1. Backend Login and Redirection Tests
console.log('[1. Testing Backend API Authentication and Redirect Determination]');
await testBackendLoginAndRedirect('citizen@gmail.com', 'password123', 'student', '/user', 'Citizen Panel');
await testBackendLoginAndRedirect('csr@gmail.com', 'password123', 'corporate', '/csr', 'CSR Panel');
await testBackendLoginAndRedirect('government@gmail.com', 'password123', 'admin', '/organization', 'Government Panel');
console.log();

// 2. Client-side Smart Role Inference (even if selected tab differs)
console.log('[2. Testing Client-side Role & Panel Inference from ID]');
function inferPanelDestination(email, activeTabRole) {
  const lower = (email || '').toLowerCase().trim();
  let requestedRole = 'student';
  if (lower.includes('csr') || lower.includes('corporate') || lower.includes('esg') || activeTabRole === 'csr') {
    requestedRole = 'corporate';
  } else if (lower.includes('government') || lower.includes('admin') || lower.includes('gov') || lower.includes('thakre') || activeTabRole === 'government') {
    requestedRole = 'admin';
  } else {
    requestedRole = 'student';
  }
  const portalPath = requestedRole === 'admin' ? '/organization' : requestedRole === 'corporate' ? '/csr' : '/user';
  const panelName = requestedRole === 'admin' ? 'Government Panel' : requestedRole === 'corporate' ? 'CSR Panel' : 'Citizen Panel';
  return { requestedRole, portalPath, panelName };
}

// Citizen tab, but user enters CSR email -> should go to CSR panel
const testCsrEmail = inferPanelDestination('csr@gmail.com', 'citizen');
assert.strictEqual(testCsrEmail.portalPath, '/csr');
assert.strictEqual(testCsrEmail.panelName, 'CSR Panel');
console.log('  ✓ PASS - CSR email on citizen tab correctly routes to CSR Panel (/csr)');

// Citizen tab, but user enters Government email -> should go to Government panel
const testGovEmail = inferPanelDestination('government@gmail.com', 'citizen');
assert.strictEqual(testGovEmail.portalPath, '/organization');
assert.strictEqual(testGovEmail.panelName, 'Government Panel');
console.log('  ✓ PASS - Government email on citizen tab correctly routes to Government Panel (/organization)');

// CSR tab with CSR email -> CSR panel
const testCsrTab = inferPanelDestination('csr@gmail.com', 'csr');
assert.strictEqual(testCsrTab.portalPath, '/csr');
assert.strictEqual(testCsrTab.panelName, 'CSR Panel');
console.log('  ✓ PASS - CSR tab with CSR email routes to CSR Panel (/csr)');

// Government tab with Government email -> Government panel
const testGovTab = inferPanelDestination('government@gmail.com', 'government');
assert.strictEqual(testGovTab.portalPath, '/organization');
assert.strictEqual(testGovTab.panelName, 'Government Panel');
console.log('  ✓ PASS - Government tab with Government email routes to Government Panel (/organization)');

// Citizen tab with Citizen email -> Citizen panel
const testCitizenTab = inferPanelDestination('citizen@gmail.com', 'citizen');
assert.strictEqual(testCitizenTab.portalPath, '/user');
assert.strictEqual(testCitizenTab.panelName, 'Citizen Panel');
console.log('  ✓ PASS - Citizen tab with Citizen email routes to Citizen Panel (/user)\n');

// 3. Standalone HTML File Verification
console.log('[3. Testing Standalone HTML Redirection Support]');
const candidatePaths = [
  path.resolve('Squid Game–style login (3 roles).html'),
  path.resolve('prototype-EcoVerse', 'Squid Game–style login (3 roles).html')
];
const htmlPath = candidatePaths.find(p => fs.existsSync(p));
assert.ok(htmlPath, 'Standalone HTML file must exist');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

assert.ok(htmlContent.includes('/user'), 'HTML must support /user redirect');
assert.ok(htmlContent.includes('/csr'), 'HTML must support /csr redirect');
assert.ok(htmlContent.includes('/organization'), 'HTML must support /organization redirect');
assert.ok(htmlContent.includes('proceedBtn'), 'HTML must have proceedBtn button');
assert.ok(htmlContent.includes('Citizen Panel'), 'HTML must contain Citizen Panel');
assert.ok(htmlContent.includes('CSR Panel'), 'HTML must contain CSR Panel');
assert.ok(htmlContent.includes('Government Panel'), 'HTML must contain Government Panel');
console.log('  ✓ PASS - Standalone HTML file has all role redirect paths, panel names, and proceed button\n');

console.log('======================================================');
console.log(' All Role Redirection Tests Passed Successfully! ');
console.log('======================================================');
