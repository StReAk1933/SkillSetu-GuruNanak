/**
 * SkillSetu Authentication Module
 * 
 * Manages role-based authentication, user session persistence,
 * credential validation, and access control.
 */

const AUTH_STORAGE_KEY = 'skillsetu_auth_token';
const USER_STORAGE_KEY = 'skillsetu_user';

// Demo credentials for the two platform roles
export const DEMO_USERS = {
  ADMIN: {
    email: 'admin@skillsetu.com',
    password: 'admin123',
    user: {
      id: 'usr_admin_01',
      name: 'Platform Administrator',
      email: 'admin@skillsetu.com',
      role: 'ADMIN',
      title: 'Enterprise Platform Lead & Reviewer',
      organization: 'SkillSetu Enterprise Hub',
      avatar: 'AD',
    },
  },
  EMPLOYEE: {
    email: 'rahul@skillsetu.com',
    password: '123456',
    user: {
      id: 'usr_emp_01',
      name: 'Rahul Sharma',
      email: 'rahul@skillsetu.com',
      role: 'EMPLOYEE',
      title: 'Official / Senior AI Engineer',
      organization: 'SkillSetu Enterprise Hub',
      avatar: 'RS',
    },
  },
};

/**
 * Validates email and password format.
 * @param {string} email
 * @param {string} password
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateLoginForm(email, password) {
  const cleanEmail = (email || '').trim();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail) {
    return { isValid: false, error: 'Email address is required' };
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (!cleanPassword) {
    return { isValid: false, error: 'Password is required' };
  }

  return { isValid: true };
}

/**
 * Attempts to log the user in with role verification.
 * @param {string} email 
 * @param {string} password 
 * @param {boolean} rememberMe 
 * @returns {Promise<{success: boolean, message?: string, user?: object}>}
 */
export async function login(email, password, rememberMe = true) {
  // Input validation
  const validation = validateLoginForm(email, password);
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.error || 'Invalid email or password',
    };
  }

  // Simulate network latency for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 300));

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  let matchedUser = null;

  if (cleanEmail === DEMO_USERS.ADMIN.email.toLowerCase() && cleanPassword === DEMO_USERS.ADMIN.password) {
    matchedUser = DEMO_USERS.ADMIN.user;
  } else if (cleanEmail === DEMO_USERS.EMPLOYEE.email.toLowerCase() && cleanPassword === DEMO_USERS.EMPLOYEE.password) {
    matchedUser = DEMO_USERS.EMPLOYEE.user;
  }

  if (matchedUser) {
    // Generate mock JWT-like token containing role identifier
    const mockToken = `mock_jwt_${matchedUser.role.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userData = matchedUser;

    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    // Clean other storage to avoid token mismatch
    otherStorage.removeItem(AUTH_STORAGE_KEY);
    otherStorage.removeItem(USER_STORAGE_KEY);

    storage.setItem(AUTH_STORAGE_KEY, mockToken);
    storage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

    return {
      success: true,
      user: userData,
    };
  }

  return {
    success: false,
    message: 'Invalid email or password',
  };
}

/**
 * Logs out the current user and clears stored session data.
 */
export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Checks if the user is currently authenticated.
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
  return Boolean(token);
}

/**
 * Gets the currently logged-in user profile if available.
 * @returns {object|null}
 */
export function getCurrentUser() {
  const userJson = localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

/**
 * Gets the role of the currently logged-in user.
 * @returns {'ADMIN'|'EMPLOYEE'|null}
 */
export function getUserRole() {
  const user = getCurrentUser();
  return user ? user.role : null;
}

/**
 * Checks if the logged-in user matches the specified role(s).
 * @param {string|string[]} allowedRoles
 * @returns {boolean}
 */
export function hasRole(allowedRoles) {
  const role = getUserRole();
  if (!role) return false;
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(role);
  }
  return role === allowedRoles;
}

/**
 * Access Control Helper: Checks if the current user can access a specific employee's records.
 * - ADMIN / REVIEWER: Can access all records.
 * - EMPLOYEE: Can ONLY access their own records.
 * @param {string} targetIdentifier - Target employee ID or email
 * @returns {boolean}
 */
export function canAccessEmployeeRecord(targetIdentifier) {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  return user.id === targetIdentifier || user.email.toLowerCase() === (targetIdentifier || '').toLowerCase();
}
