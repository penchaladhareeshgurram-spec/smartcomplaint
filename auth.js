/* ========================================
   AUTHENTICATION MODULE
   ========================================
   Handles user login, registration, and session management
   - User authentication
   - Session management
   - Role-based access control
   - JWT-like token handling (localStorage-based for demo)
*/

const Auth = {
  // Current user session
  currentUser: null,
  
  /**
   * Initialize authentication
   */
  init: function() {
    const token = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    const user = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.USER);
    
    if (token && user) {
      this.currentUser = user;
      console.log('✓ Session restored:', user.name);
    }
    
    // Check authentication on page load
    this.checkAuthStatus();
  },
  
  /**
   * Register new user
   */
  register: function(userData) {
    return new Promise((resolve, reject) => {
      // Validation
      if (!userData.name || !userData.email || !userData.password) {
        reject('All fields are required');
        return;
      }
      
      if (userData.password.length < CONFIG.VALIDATION.MIN_PASSWORD_LENGTH) {
        reject(`Password must be at least ${CONFIG.VALIDATION.MIN_PASSWORD_LENGTH} characters`);
        return;
      }
      
      if (!this.isValidEmail(userData.email)) {
        reject('Invalid email format');
        return;
      }
      
      // Check if user already exists
      const users = ConfigUtils.getStorageData('scs_all_users') || DEMO_DATA.users;
      if (users.find(u => u.email === userData.email)) {
        reject('Email already registered');
        return;
      }
      
      // Create new user
      const newUser = {
        id: 'user_' + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        password: this.hashPassword(userData.password), // In production, hash on backend
        role: CONFIG.USER_ROLES.USER,
        communityId: userData.communityId || null,
        createdAt: new Date(),
        verified: false
      };
      
      // Save user
      users.push(newUser);
      ConfigUtils.setStorageData('scs_all_users', users);
      
      // Auto-login after registration
      this.createSession(newUser);
      resolve(newUser);
    });
  },
  
  /**
   * Login user
   */
  login: function(email, password) {
    return new Promise((resolve, reject) => {
      if (!email || !password) {
        reject('Email and password are required');
        return;
      }
      
      // Get users (demo data)
      const users = ConfigUtils.getStorageData('scs_all_users') || DEMO_DATA.users;
      
      // Find user
      const user = users.find(u => u.email === email);
      if (!user) {
        reject('Invalid email or password');
        return;
      }
      
      // Verify password (in production, verify on backend)
      if (!this.verifyPassword(password, user.password)) {
        reject('Invalid email or password');
        return;
      }
      
      // Create session
      this.createSession(user);
      resolve(user);
    });
  },
  
  /**
   * Create user session
   */
  createSession: function(user) {
    // Remove password from stored data
    const sessionUser = { ...user };
    delete sessionUser.password;
    
    // Create token (simple JWT-like structure for demo)
    const token = this.generateToken(sessionUser);
    
    // Store session
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.USER, sessionUser);
    
    this.currentUser = sessionUser;
    
    // Log session creation
    console.log('✓ Session created for:', user.name);
  },
  
  /**
   * Logout user
   */
  logout: function() {
    return new Promise((resolve) => {
      ConfigUtils.removeStorageData(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      ConfigUtils.removeStorageData(CONFIG.STORAGE_KEYS.USER);
      this.currentUser = null;
      
      console.log('✓ Logged out successfully');
      
      // Redirect to login
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
      
      resolve();
    });
  },
  
  /**
   * Get current user
   */
  getCurrentUser: function() {
    return this.currentUser;
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: function() {
    const token = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    return !!token && !!this.currentUser;
  },
  
  /**
   * Check if user has specific role
   */
  hasRole: function(requiredRole) {
    if (!this.currentUser) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(this.currentUser.role);
    }
    
    return this.currentUser.role === requiredRole;
  },
  
  /**
   * Check if user is admin
   */
  isAdmin: function() {
    return this.hasRole(CONFIG.USER_ROLES.ADMIN);
  },
  
  /**
   * Check if user is staff
   */
  isStaff: function() {
    return this.hasRole([CONFIG.USER_ROLES.STAFF, CONFIG.USER_ROLES.ADMIN]);
  },
  
  /**
   * Check authentication status and redirect if needed
   */
  checkAuthStatus: function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const protectedPages = ['user-dashboard.html', 'admin-dashboard.html'];
    const isProtectedPage = protectedPages.includes(currentPage);
    
    if (isProtectedPage && !this.isAuthenticated()) {
      window.location.href = 'login.html';
    }
    
    // Check admin-only pages
    if (currentPage === 'admin-dashboard.html' && !this.isAdmin()) {
      window.location.href = 'user-dashboard.html';
    }
  },
  
  /**
   * Get user by ID
   */
  getUserById: function(userId) {
    const users = ConfigUtils.getStorageData('scs_all_users') || DEMO_DATA.users;
    return users.find(u => u.id === userId);
  },
  
  /**
   * Update user profile
   */
  updateProfile: function(updates) {
    if (!this.currentUser) return false;
    
    const updatedUser = { ...this.currentUser, ...updates };
    const users = ConfigUtils.getStorageData('scs_all_users') || DEMO_DATA.users;
    
    const index = users.findIndex(u => u.id === this.currentUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      ConfigUtils.setStorageData('scs_all_users', users);
      ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.USER, updatedUser);
      this.currentUser = updatedUser;
      return true;
    }
    
    return false;
  },
  
  /* ========================================
     HELPER FUNCTIONS
     ======================================== */
  
  /**
   * Validate email format
   */
  isValidEmail: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  /**
   * Hash password (simple hash for demo - use bcrypt in production)
   */
  hashPassword: function(password) {
    // Simple hash for demo purposes only
    // In production, use backend with bcrypt or similar
    return btoa(password) + '_hashed';
  },
  
  /**
   * Verify password
   */
  verifyPassword: function(password, hashedPassword) {
    // Simple verification for demo
    return hashedPassword === btoa(password) + '_hashed';
  },
  
  /**
   * Generate token (JWT-like for demo)
   */
  generateToken: function(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa('secret-key');
    
    return `${header}.${payload}.${signature}`;
  }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
