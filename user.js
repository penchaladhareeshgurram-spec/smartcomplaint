/* ========================================
   USER MODULE
   ========================================
   Handles user-specific operations:
   - Raise complaints
   - View complaint history
   - Upload media
   - Track status
   - Real-time updates
*/

const User = {
  // Current complaints cache
  userComplaints: [],
  
  /**
   * Initialize user module
   */
  init: function() {
    if (Auth.isAuthenticated()) {
      this.loadComplaints();
      console.log('✓ User module initialized');
    }
  },
  
  /**
   * Create new complaint
   */
  createComplaint: function(complaintData) {
    return new Promise((resolve, reject) => {
      // Validation
      if (!complaintData.title || !complaintData.description) {
        reject('Title and description are required');
        return;
      }
      
      if (!complaintData.category) {
        reject('Category is required');
        return;
      }
      
      // Create complaint object
      const complaint = {
        id: 'comp_' + Date.now(),
        userId: Auth.currentUser.id,
        communityId: Auth.currentUser.communityId,
        title: complaintData.title,
        description: complaintData.description,
        category: complaintData.category,
        priority: complaintData.priority || CONFIG.PRIORITY_LEVELS.MEDIUM,
        status: CONFIG.COMPLAINT_STATUS.PENDING,
        location: complaintData.location || { lat: null, lng: null },
        image: complaintData.image || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: null,
        notes: [],
        resolutionProof: null
      };
      
      // Save complaint
      const complaints = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS) || [];
      complaints.push(complaint);
      ConfigUtils.setStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS, complaints);
      
      this.userComplaints.push(complaint);
      
      // Log action
      console.log('✓ Complaint created:', complaint.id);
      resolve(complaint);
    });
  },
  
  /**
   * Get user's complaints
   */
  loadComplaints: function() {
    const allComplaints = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS) || [];
    this.userComplaints = allComplaints.filter(c => c.userId === Auth.currentUser.id);
    return this.userComplaints;
  },
  
  /**
   * Get single complaint by ID
   */
  getComplaint: function(complaintId) {
    return this.userComplaints.find(c => c.id === complaintId);
  },
  
  /**
   * Get all user complaints
   */
  getAllComplaints: function() {
    return this.loadComplaints();
  },
  
  /**
   * Get complaints filtered by status
   */
  getComplaintsByStatus: function(status) {
    return this.userComplaints.filter(c => c.status === status);
  },
  
  /**
   * Get complaint statistics
   */
  getComplaintStats: function() {
    const complaints = this.userComplaints;
    
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.PENDING).length,
      inProgress: complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.IN_PROGRESS).length,
      onHold: complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.ON_HOLD).length,
      resolved: complaints.filter(c => c.status === CONFIG.COMPLAINT_STATUS.RESOLVED).length,
      highPriority: complaints.filter(c => c.priority === CONFIG.PRIORITY_LEVELS.HIGH || c.priority === CONFIG.PRIORITY_LEVELS.URGENT).length
    };
  },
  
  /**
   * Upload image to complaint
   */
  uploadImage: function(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No file selected');
        return;
      }
      
      // Validate file type
      if (!CONFIG.VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        reject('Only JPEG, PNG, and WebP images are allowed');
        return;
      }
      
      // Validate file size
      if (file.size > CONFIG.VALIDATION.MAX_FILE_SIZE) {
        reject('File size must be less than 5MB');
        return;
      }
      
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = function(event) {
        resolve(event.target.result);
      };
      reader.onerror = function() {
        reject('Error reading file');
      };
      reader.readAsDataURL(file);
    });
  },
  
  /**
   * Get user's location using Geolocation API
   */
  getLocation: function() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported by this browser');
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(`Geolocation error: ${error.message}`);
        }
      );
    });
  },
  
  /**
   * Format complaint for display
   */
  formatComplaint: function(complaint) {
    return {
      ...complaint,
      createdAtFormatted: this.formatDate(complaint.createdAt),
      updatedAtFormatted: this.formatDate(complaint.updatedAt),
      categoryBadge: this.getCategoryBadge(complaint.category),
      priorityBadge: this.getPriorityBadge(complaint.priority),
      statusBadge: this.getStatusBadge(complaint.status)
    };
  },
  
  /**
   * Get category badge color
   */
  getCategoryBadge: function(category) {
    const badges = {
      'Infrastructure': 'primary',
      'Cleanliness': 'info',
      'Security': 'danger',
      'Utilities': 'warning',
      'Maintenance': 'primary',
      'Noise': 'warning',
      'Other': 'secondary'
    };
    return badges[category] || 'secondary';
  },
  
  /**
   * Get priority badge color
   */
  getPriorityBadge: function(priority) {
    const badges = {
      'Low': 'primary',
      'Medium': 'info',
      'High': 'warning',
      'Urgent': 'danger'
    };
    return badges[priority] || 'secondary';
  },
  
  /**
   * Get status badge and color
   */
  getStatusBadge: function(status) {
    const badges = {
      'Pending': 'warning',
      'In Progress': 'info',
      'On Hold': 'warning',
      'Resolved': 'success'
    };
    return badges[status] || 'secondary';
  },
  
  /**
   * Format date for display
   */
  formatDate: function(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  },
  
  /**
   * Get status progress percentage
   */
  getStatusProgress: function(status) {
    const progressMap = {
      'Pending': 0,
      'In Progress': 50,
      'On Hold': 25,
      'Resolved': 100
    };
    return progressMap[status] || 0;
  }
};

// Initialize user module on page load
document.addEventListener('DOMContentLoaded', () => {
  if (Auth.isAuthenticated()) {
    User.init();
  }
});
