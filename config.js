/* ========================================
   CONFIGURATION MODULE
   ========================================
   Centralized configuration for the complaint system
   - API endpoints
   - Firebase config (if using Firebase)
   - App settings
   - Demo data
*/

const CONFIG = {
  // App Information
  APP_NAME: 'Smart Complaint System',
  VERSION: '1.0.0',
  
  // Environment
  ENVIRONMENT: 'development', // 'development' or 'production'
  
  // API Endpoints (for Node.js backend simulation)
  API_BASE_URL: 'http://localhost:3000/api',
  
  // Firebase Configuration (if switching to Firebase)
  FIREBASE_CONFIG: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  },
  
  // Local Storage Keys
  STORAGE_KEYS: {
    USER: 'scs_user',
    AUTH_TOKEN: 'scs_auth_token',
    COMMUNITIES: 'scs_communities',
    COMPLAINTS: 'scs_complaints',
    STAFF: 'scs_staff',
    AUDIT_LOGS: 'scs_audit_logs'
  },
  
  // Complaint Status Options
  COMPLAINT_STATUS: {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    ON_HOLD: 'On Hold',
    RESOLVED: 'Resolved'
  },
  
  // Complaint Categories
  COMPLAINT_CATEGORIES: [
    'Infrastructure',
    'Cleanliness',
    'Security',
    'Utilities',
    'Maintenance',
    'Noise',
    'Other'
  ],
  
  // Priority Levels
  PRIORITY_LEVELS: {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent'
  },
  
  // User Roles
  USER_ROLES: {
    USER: 'user',
    STAFF: 'staff',
    ADMIN: 'admin'
  },
  
  // Validation Rules
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
  },
  
  // UI Settings
  UI: {
    NOTIFICATION_TIMEOUT: 5000, // 5 seconds
    PAGE_SIZE: 10
  }
};

// Demo Data for Testing
const DEMO_DATA = {
  users: [
    {
      id: 'user_001',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123', // Only for demo
      phone: '+1-555-0101',
      role: 'user',
      communityId: 'comm_001',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      verified: true
    },
    {
      id: 'user_002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+1-555-0102',
      role: 'user',
      communityId: 'comm_001',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      verified: true
    },
    {
      id: 'staff_001',
      name: 'Mike Johnson',
      email: 'mike@admin.com',
      password: 'staffpass123',
      phone: '+1-555-0201',
      role: 'staff',
      communityId: 'comm_001',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      verified: true
    },
    {
      id: 'admin_001',
      name: 'Admin User',
      email: 'admin@smartcomplaint.com',
      password: 'admin123456',
      phone: '+1-555-9999',
      role: 'admin',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      verified: true
    }
  ],
  
  communities: [
    {
      id: 'comm_001',
      name: 'Green Valley Apartments',
      description: 'Modern residential community with 500+ units',
      location: '123 Main St, Springfield',
      adminId: 'admin_001',
      members: ['user_001', 'user_002', 'staff_001'],
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      inviteLink: 'gva-2024-001',
      totalComplaints: 24
    },
    {
      id: 'comm_002',
      name: 'Sunrise Complex',
      description: 'Mixed-use development with offices and residences',
      location: '456 Oak Ave, Springfield',
      adminId: 'admin_001',
      members: [],
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      inviteLink: 'sunrise-2024-001',
      totalComplaints: 0
    }
  ],
  
  complaints: [
    {
      id: 'comp_001',
      userId: 'user_001',
      communityId: 'comm_001',
      title: 'Broken water pipeline in Block A',
      description: 'Water is leaking from the main pipeline near building A2. Urgent repair needed.',
      category: 'Utilities',
      priority: 'High',
      status: 'In Progress',
      location: { lat: 40.7128, lng: -74.0060 },
      image: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      assignedTo: 'staff_001',
      notes: [
        { author: 'staff_001', text: 'Inspection scheduled for tomorrow', timestamp: new Date() }
      ]
    },
    {
      id: 'comp_002',
      userId: 'user_002',
      communityId: 'comm_001',
      title: 'Graffiti on common wall',
      description: 'Graffiti found on the wall near the main entrance. Needs cleaning.',
      category: 'Cleanliness',
      priority: 'Medium',
      status: 'Pending',
      location: { lat: 40.7120, lng: -74.0065 },
      image: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      assignedTo: null,
      notes: []
    },
    {
      id: 'comp_003',
      userId: 'user_001',
      communityId: 'comm_001',
      title: 'Faulty street light',
      description: 'Street light near parking lot C is not working. Safety concern.',
      category: 'Infrastructure',
      priority: 'High',
      status: 'Resolved',
      location: { lat: 40.7130, lng: -74.0055 },
      image: null,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      assignedTo: 'staff_001',
      notes: [
        { author: 'staff_001', text: 'Maintenance team replaced bulb and fixture', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
      ],
      resolutionProof: 'Light replaced and tested successfully'
    },
    {
      id: 'comp_004',
      userId: 'user_002',
      communityId: 'comm_001',
      title: 'Excessive noise from construction',
      description: 'Ongoing construction noise before 7 AM violates community rules.',
      category: 'Noise',
      priority: 'Medium',
      status: 'On Hold',
      location: { lat: 40.7125, lng: -74.0062 },
      image: null,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      assignedTo: null,
      notes: [
        { author: 'admin_001', text: 'Awaiting construction company response', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
      ]
    }
  ],
  
  auditLogs: [
    {
      id: 'audit_001',
      adminId: 'admin_001',
      action: 'CREATE_COMMUNITY',
      entityType: 'Community',
      entityId: 'comm_001',
      changes: { name: 'Green Valley Apartments' },
      timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'audit_002',
      adminId: 'admin_001',
      action: 'ASSIGN_COMPLAINT',
      entityType: 'Complaint',
      entityId: 'comp_001',
      changes: { assignedTo: 'staff_001' },
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]
};

// Utility Functions for Config
const ConfigUtils = {
  /**
   * Get storage data with fallback
   */
  getStorageData: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return defaultValue;
    }
  },
  
  /**
   * Set storage data
   */
  setStorageData: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error);
      return false;
    }
  },
  
  /**
   * Remove storage data
   */
  removeStorageData: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  },
  
  /**
   * Clear all storage
   */
  clearStorage: () => {
    try {
      Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};

// Initialize demo data on first load
(function initializeDemoData() {
  const isInitialized = localStorage.getItem('scs_initialized');
  if (!isInitialized) {
    try {
      ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMMUNITIES, DEMO_DATA.communities);
      ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS, DEMO_DATA.complaints);
      ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.STAFF, DEMO_DATA.users.filter(u => u.role === 'staff'));
      ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.AUDIT_LOGS, DEMO_DATA.auditLogs);
      localStorage.setItem('scs_initialized', 'true');
      console.log('✓ Demo data initialized');
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  }
})();
