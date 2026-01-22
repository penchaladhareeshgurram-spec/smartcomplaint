/* ========================================
   ADMIN MODULE
   ========================================
   Admin-only operations:
   - Community management
   - Complaint management & assignment
   - Staff management
   - Advanced filtering and analytics
   - Audit logging
*/

const Admin = {
  // Caches
  communities: [],
  complaints: [],
  staff: [],
  auditLogs: [],
  
  /**
   * Initialize admin module
   */
  init: function() {
    if (Auth.isAdmin()) {
      this.loadCommunities();
      this.loadComplaints();
      this.loadStaff();
      this.loadAuditLogs();
      console.log('✓ Admin module initialized');
    }
  },
  
  /* ========================================
     COMMUNITY MANAGEMENT
     ======================================== */
  
  /**
   * Load all communities
   */
  loadCommunities: function() {
    this.communities = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.COMMUNITIES) || [];
    return this.communities;
  },
  
  /**
   * Create new community
   */
  createCommunity: function(communityData) {
    return new Promise((resolve, reject) => {
      if (!communityData.name || !communityData.location) {
        reject('Name and location are required');
        return;
      }
      
      const newCommunity = {
        id: 'comm_' + Date.now(),
        name: communityData.name,
        description: communityData.description || '',
        location: communityData.location,
        adminId: Auth.currentUser.id,
        members: [],
        createdAt: new Date(),
        inviteLink: this.generateInviteLink(),
        totalComplaints: 0
      };
      
      this.communities.push(newCommunity);
      ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMMUNITIES, this.communities);
      
      this.logAction('CREATE_COMMUNITY', 'Community', newCommunity.id, { name: newCommunity.name });
      resolve(newCommunity);
    });
  },
  
  /**
   * Update community
   */
  updateCommunity: function(communityId, updates) {
    const community = this.communities.find(c => c.id === communityId);
    if (!community) {
      return false;
    }
    
    const oldValues = { ...community };
    Object.assign(community, updates);
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMMUNITIES, this.communities);
    
    this.logAction('UPDATE_COMMUNITY', 'Community', communityId, { 
      before: oldValues, 
      after: community 
    });
    return true;
  },
  
  /**
   * Delete community
   */
  deleteCommunity: function(communityId) {
    const index = this.communities.findIndex(c => c.id === communityId);
    if (index === -1) return false;
    
    const community = this.communities[index];
    this.communities.splice(index, 1);
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMMUNITIES, this.communities);
    
    this.logAction('DELETE_COMMUNITY', 'Community', communityId, { name: community.name });
    return true;
  },
  
  /**
   * Get community by ID
   */
  getCommunity: function(communityId) {
    return this.communities.find(c => c.id === communityId);
  },
  
  /**
   * Add member to community
   */
  addMemberToCommunity: function(communityId, userId) {
    const community = this.getCommunity(communityId);
    if (!community) return false;
    
    if (!community.members.includes(userId)) {
      community.members.push(userId);
      ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMMUNITIES, this.communities);
      
      this.logAction('ADD_MEMBER', 'Community', communityId, { userId });
      return true;
    }
    return false;
  },
  
  /**
   * Remove member from community
   */
  removeMemberFromCommunity: function(communityId, userId) {
    const community = this.getCommunity(communityId);
    if (!community) return false;
    
    const index = community.members.indexOf(userId);
    if (index !== -1) {
      community.members.splice(index, 1);
      ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMMUNITIES, this.communities);
      
      this.logAction('REMOVE_MEMBER', 'Community', communityId, { userId });
      return true;
    }
    return false;
  },
  
  /* ========================================
     COMPLAINT MANAGEMENT
     ======================================== */
  
  /**
   * Load all complaints
   */
  loadComplaints: function() {
    this.complaints = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS) || [];
    return this.complaints;
  },
  
  /**
   * Get all complaints with admin view
   */
  getAllComplaints: function(filters = {}) {
    let filtered = [...this.complaints];
    
    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    if (filters.priority) {
      filtered = filtered.filter(c => c.priority === filters.priority);
    }
    if (filters.communityId) {
      filtered = filtered.filter(c => c.communityId === filters.communityId);
    }
    if (filters.assignedTo) {
      filtered = filtered.filter(c => c.assignedTo === filters.assignedTo);
    }
    if (filters.unassigned) {
      filtered = filtered.filter(c => !c.assignedTo);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(c => new Date(c.createdAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(c => new Date(c.createdAt) <= new Date(filters.dateTo));
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filtered;
  },
  
  /**
   * Assign complaint to staff
   */
  assignComplaint: function(complaintId, staffId) {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (!complaint) return false;
    
    const oldAssignment = complaint.assignedTo;
    complaint.assignedTo = staffId;
    complaint.updatedAt = new Date();
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS, this.complaints);
    
    this.logAction('ASSIGN_COMPLAINT', 'Complaint', complaintId, { 
      from: oldAssignment, 
      to: staffId 
    });
    return true;
  },
  
  /**
   * Update complaint status
   */
  updateComplaintStatus: function(complaintId, newStatus) {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (!complaint) return false;
    
    const oldStatus = complaint.status;
    complaint.status = newStatus;
    complaint.updatedAt = new Date();
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS, this.complaints);
    
    this.logAction('UPDATE_STATUS', 'Complaint', complaintId, { 
      from: oldStatus, 
      to: newStatus 
    });
    return true;
  },
  
  /**
   * Add admin note to complaint
   */
  addNote: function(complaintId, noteText) {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (!complaint) return false;
    
    const note = {
      author: Auth.currentUser.id,
      text: noteText,
      timestamp: new Date()
    };
    
    complaint.notes = complaint.notes || [];
    complaint.notes.push(note);
    complaint.updatedAt = new Date();
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS, this.complaints);
    
    this.logAction('ADD_NOTE', 'Complaint', complaintId, { noteAuthor: Auth.currentUser.name });
    return true;
  },
  
  /**
   * Add resolution proof
   */
  addResolutionProof: function(complaintId, proof) {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (!complaint) return false;
    
    complaint.resolutionProof = proof;
    complaint.updatedAt = new Date();
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS, this.complaints);
    
    this.logAction('ADD_RESOLUTION_PROOF', 'Complaint', complaintId, {});
    return true;
  },
  
  /**
   * Get complaint analytics
   */
  getAnalytics: function(communityId = null) {
    let complaints = this.complaints;
    if (communityId) {
      complaints = complaints.filter(c => c.communityId === communityId);
    }
    
    return {
      totalComplaints: complaints.length,
      byStatus: {
        pending: complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.PENDING).length,
        inProgress: complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.IN_PROGRESS).length,
        onHold: complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.ON_HOLD).length,
        resolved: complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.RESOLVED).length
      },
      byCategory: this.groupBy(complaints, 'category'),
      byPriority: {
        low: complaints.filter(c => c.priority === CONFIG.PRIORITY_LEVELS.LOW).length,
        medium: complaints.filter(c => c.priority === CONFIG.PRIORITY_LEVELS.MEDIUM).length,
        high: complaints.filter(c => c.priority === CONFIG.PRIORITY_LEVELS.HIGH).length,
        urgent: complaints.filter(c => c.priority === CONFIG.PRIORITY_LEVELS.URGENT).length
      },
      avgResolutionTime: this.calculateAvgResolutionTime(complaints),
      resolutionRate: Math.round((complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.RESOLVED).length / complaints.length) * 100) || 0
    };
  },
  
  /* ========================================
     STAFF MANAGEMENT
     ======================================== */
  
  /**
   * Load staff members
   */
  loadStaff: function() {
    this.staff = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.STAFF) || [];
    return this.staff;
  },
  
  /**
   * Get staff members for community
   */
  getStaffForCommunity: function(communityId) {
    return this.staff.filter(s => s.communityId === communityId);
  },
  
  /**
   * Assign staff to community
   */
  assignStaffToCommunity: function(staffId, communityId) {
    const staff = this.staff.find(s => s.id === staffId);
    if (!staff) return false;
    
    staff.communityId = communityId;
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.STAFF, this.staff);
    
    this.logAction('ASSIGN_STAFF', 'Staff', staffId, { communityId });
    return true;
  },
  
  /* ========================================
     AUDIT LOGGING
     ======================================== */
  
  /**
   * Load audit logs
   */
  loadAuditLogs: function() {
    this.auditLogs = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.AUDIT_LOGS) || [];
    return this.auditLogs;
  },
  
  /**
   * Log admin action
   */
  logAction: function(action, entityType, entityId, changes = {}) {
    const log = {
      id: 'audit_' + Date.now(),
      adminId: Auth.currentUser.id,
      action,
      entityType,
      entityId,
      changes,
      timestamp: new Date()
    };
    
    this.auditLogs.push(log);
    ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
    
    console.log('📋 Audit log:', action, entityType);
  },
  
  /**
   * Get audit logs with filters
   */
  getAuditLogs: function(filters = {}) {
    let logs = [...this.auditLogs];
    
    if (filters.action) {
      logs = logs.filter(l => l.action === filters.action);
    }
    if (filters.entityType) {
      logs = logs.filter(l => l.entityType === filters.entityType);
    }
    if (filters.adminId) {
      logs = logs.filter(l => l.adminId === filters.adminId);
    }
    
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },
  
  /* ========================================
     HELPER FUNCTIONS
     ======================================== */
  
  /**
   * Generate unique invite link
   */
  generateInviteLink: function() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let link = '';
    for (let i = 0; i < 8; i++) {
      link += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return link;
  },
  
  /**
   * Group complaints by field
   */
  groupBy: function(complaints, field) {
    return complaints.reduce((acc, complaint) => {
      const key = complaint[field];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  },
  
  /**
   * Calculate average resolution time
   */
  calculateAvgResolutionTime: function(complaints) {
    const resolved = complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.RESOLVED);
    if (resolved.length === 0) return 0;
    
    const totalTime = resolved.reduce((sum, c) => {
      const created = new Date(c.createdAt);
      const updated = new Date(c.updatedAt);
      return sum + (updated - created);
    }, 0);
    
    const avgMilliseconds = totalTime / resolved.length;
    return Math.round(avgMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
  },
  
  /**
   * Get community name by ID
   */
  getCommunityName: function(communityId) {
    const community = this.communities.find(c => c.id === communityId);
    return community ? community.name : 'Unknown Community';
  }
};

// Initialize admin module on page load
document.addEventListener('DOMContentLoaded', () => {
  if (Auth.isAdmin()) {
    Admin.init();
  }
});
