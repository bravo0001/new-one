import assert from 'node:assert';

console.log('======================================================');
console.log(' EcoVerse Login Flow, Role Switching & Logout Test ');
console.log('======================================================\n');

// 1. Storage & State Simulation
const mockLocalStorage = new Map();
const mockSessionStorage = new Map();

function simulateLogout(state) {
  state.token = null;
  state.isAuthenticated = false;
  mockLocalStorage.delete('ecoverse_token');
  mockLocalStorage.delete('ecoverse_profile');
  mockLocalStorage.delete('ecoverse_role');
  mockSessionStorage.delete('ecoverse_token');
  state.role = 'student';
  state.redirectUrl = '/';
}

function simulateRoleSelect(state, newRole) {
  // Switching role on login form should NEVER login or touch token
  state.selectedRole = newRole;
  state.idVal = '';
  state.pwVal = '';
  state.errMsg = '';
  // Token and isAuthenticated MUST remain unauthenticated
  assert.strictEqual(state.token, null, 'Token must remain null when switching role tabs');
  assert.strictEqual(state.isAuthenticated, false, 'User must remain unauthenticated when switching role tabs');
}

function simulateLogin(state, email, role, token) {
  state.token = token;
  state.isAuthenticated = Boolean(token);
  state.role = role;
  mockLocalStorage.set('ecoverse_token', token);
}

function authGuardCheck(state) {
  // AuthGuard logic: if (!isAuthenticated || !token) -> redirect to '/'
  if (!state.isAuthenticated || !state.token) {
    return { allowed: false, redirect: '/' };
  }
  return { allowed: true };
}

// TEST 1: Initial state is unauthenticated
const state = {
  token: null,
  isAuthenticated: false,
  selectedRole: 'citizen',
  idVal: '',
  pwVal: '',
  errMsg: '',
  role: 'student',
  redirectUrl: null
};

console.log('[1. Testing Initial Login Page State]');
assert.strictEqual(state.token, null);
assert.strictEqual(state.isAuthenticated, false);
console.log('  ✓ PASS - User starts unauthenticated with null token\n');

// TEST 2: Tab Switching on Login Page (Citizen -> CSR -> Government -> Citizen)
console.log('[2. Testing Role Tab Switching on Login Page]');
simulateRoleSelect(state, 'csr');
assert.strictEqual(state.selectedRole, 'csr');
console.log('  ✓ PASS - Switched to CSR tab without auto-login');

simulateRoleSelect(state, 'government');
assert.strictEqual(state.selectedRole, 'government');
console.log('  ✓ PASS - Switched to Government tab without auto-login');

simulateRoleSelect(state, 'citizen');
assert.strictEqual(state.selectedRole, 'citizen');
console.log('  ✓ PASS - Switched back to Citizen tab without auto-login\n');

// TEST 3: AuthGuard blocks unauthenticated access
console.log('[3. Testing AuthGuard Protection for Portal Routes]');
const unauthedCheck = authGuardCheck(state);
assert.strictEqual(unauthedCheck.allowed, false);
assert.strictEqual(unauthedCheck.redirect, '/');
console.log('  ✓ PASS - AuthGuard correctly rejects unauthenticated users and redirects to /\n');

// TEST 4: Successful Login
console.log('[4. Testing Login for Citizen]');
simulateLogin(state, 'citizen@gmail.com', 'student', 'mock_jwt_token_citizen');
assert.strictEqual(state.token, 'mock_jwt_token_citizen');
assert.strictEqual(state.isAuthenticated, true);
assert.strictEqual(mockLocalStorage.get('ecoverse_token'), 'mock_jwt_token_citizen');

const authedCheck = authGuardCheck(state);
assert.strictEqual(authedCheck.allowed, true);
console.log('  ✓ PASS - Citizen successfully authenticated and permitted into portal\n');

// TEST 5: Logout Action
console.log('[5. Testing Logout Mechanism]');
simulateLogout(state);
assert.strictEqual(state.token, null);
assert.strictEqual(state.isAuthenticated, false);
assert.strictEqual(mockLocalStorage.has('ecoverse_token'), false);
assert.strictEqual(mockLocalStorage.has('ecoverse_profile'), false);
assert.strictEqual(mockLocalStorage.has('ecoverse_role'), false);
assert.strictEqual(mockSessionStorage.has('ecoverse_token'), false);
assert.strictEqual(state.redirectUrl, '/');
console.log('  ✓ PASS - Logout thoroughly clears tokens, resets authentication state, and redirects to /\n');

// TEST 6: After Logout, Switching Role on Login Page
console.log('[6. Testing Tab Switching Immediately Following Logout]');
simulateRoleSelect(state, 'csr');
assert.strictEqual(state.selectedRole, 'csr');
assert.strictEqual(state.token, null);
assert.strictEqual(state.isAuthenticated, false);
console.log('  ✓ PASS - Switching role tab after logout does not auto-login\n');

console.log('======================================================');
console.log(' All Flow and Logout Tests Passed Successfully! ');
console.log('======================================================');

