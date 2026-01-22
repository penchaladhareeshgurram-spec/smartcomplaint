/* ========================================
   REAL-TIME UPDATES MODULE
   ========================================
   Handles real-time notifications and updates:
   - WebSocket simulation (using localStorage polling)
   - Real-time complaint status updates
   - Notifications system
   - Live data sync
*/

const RealTime = {
  // State
  listeners: [],
  pollInterval: null,
  lastUpdate: null,
  notifications: [],
  
  /**
   * Initialize real-time module
   */
  init: function() {
    this.startPolling();
    this.setupNotificationHandlers();
    console.log('✓ Real-time module initialized');
  },
  
  /**
   * Start polling for updates (simulates WebSocket)
   */
  startPolling: function() {
    // Poll every 3 seconds for changes
    this.pollInterval = setInterval(() => {
      this.checkForUpdates();
    }, 3000);
  },
  
  /**
   * Stop polling
   */
  stopPolling: function() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  },
  
  /**
   * Check for updates
   */
  checkForUpdates: function() {
    const complaints = ConfigUtils.getStorageData(CONFIG.STORAGE_KEYS.COMPLAINTS) || [];
    const currentTime = Date.now();
    
    if (!this.lastUpdate) {
      this.lastUpdate = currentTime;
      return;
    }
    
    // Look for recently updated complaints
    complaints.forEach(complaint => {
      const updateTime = new Date(complaint.updatedAt).getTime();
      if (updateTime > this.lastUpdate) {
        this.notifyUpdate('complaint', complaint);
        this.emit('complaint-updated', complaint);
      }
    });
    
    this.lastUpdate = currentTime;
  },
  
  /**
   * Subscribe to real-time events
   */
  subscribe: function(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  },
  
  /**
   * Emit event
   */
  emit: function(event, data) {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  },
  
  /**
   * Create notification
   */
  createNotification: function(type, title, message, data = null) {
    const notification = {
      id: 'notif_' + Date.now(),
      type, // 'success', 'error', 'info', 'warning'
      title,
      message,
      data,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.push(notification);
    this.emit('notification', notification);
    
    // Auto-remove success notifications after timeout
    if (type === 'success') {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, CONFIG.UI.NOTIFICATION_TIMEOUT);
    }
    
    return notification;
  },
  
  /**
   * Remove notification
   */
  removeNotification: function(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.emit('notification-removed', notificationId);
    }
  },
  
  /**
   * Get all notifications
   */
  getNotifications: function() {
    return this.notifications;
  },
  
  /**
   * Get unread notifications count
   */
  getUnreadCount: function() {
    return this.notifications.filter(n => !n.read).length;
  },
  
  /**
   * Mark notification as read
   */
  markAsRead: function(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.emit('notification-read', notificationId);
    }
  },
  
  /**
   * Notify about update
   */
  notifyUpdate: function(type, data) {
    if (type === 'complaint') {
      let message = '';
      
      switch (data.status) {
        case CONFIG.COMPLAINT_STATUS.IN_PROGRESS:
          message = `Your complaint "${data.title}" is now being processed`;
          break;
        case CONFIG.COMPLAINT_STATUS.ON_HOLD:
          message = `Your complaint "${data.title}" is on hold`;
          break;
        case CONFIG.COMPLAINT_STATUS.RESOLVED:
          message = `Your complaint "${data.title}" has been resolved!`;
          break;
        default:
          message = `Complaint "${data.title}" has been updated`;
      }
      
      this.createNotification(
        data.status === CONFIG.COMPLAINT_STATUS.RESOLVED ? 'success' : 'info',
        'Complaint Updated',
        message,
        { complaintId: data.id }
      );
    }
  },
  
  /**
   * Show toast notification
   */
  showToast: function(message, type = 'info', duration = CONFIG.UI.NOTIFICATION_TIMEOUT) {
    return this.createNotification(type, type.charAt(0).toUpperCase() + type.slice(1), message);
  },
  
  /**
   * Show success notification
   */
  showSuccess: function(message) {
    return this.showToast(message, 'success');
  },
  
  /**
   * Show error notification
   */
  showError: function(message) {
    return this.showToast(message, 'error', 0); // Don't auto-remove errors
  },
  
  /**
   * Show warning notification
   */
  showWarning: function(message) {
    return this.showToast(message, 'warning');
  },
  
  /**
   * Show info notification
   */
  showInfo: function(message) {
    return this.showToast(message, 'info');
  },
  
  /**
   * Setup notification handlers
   */
  setupNotificationHandlers: function() {
    // Listen for notifications and render them
    this.subscribe('notification', (notification) => {
      this.renderNotification(notification);
    });
    
    this.subscribe('notification-removed', (notificationId) => {
      this.removeNotificationDOM(notificationId);
    });
  },
  
  /**
   * Render notification to DOM
   */
  renderNotification: function(notification) {
    const container = document.getElementById('notifications-container') || 
                     this.createNotificationsContainer();
    
    const notificationEl = document.createElement('div');
    notificationEl.id = notification.id;
    notificationEl.className = `alert alert-${notification.type}`;
    notificationEl.innerHTML = `
      <div class="flex-col">
        <strong>${notification.title}</strong>
        <p>${notification.message}</p>
      </div>
      <button class="alert-close" onclick="RealTime.removeNotification('${notification.id}')">
        ✕
      </button>
    `;
    
    container.appendChild(notificationEl);
    
    // Animate in
    setTimeout(() => {
      notificationEl.style.animation = 'slideDown 0.3s ease';
    }, 10);
  },
  
  /**
   * Create notifications container
   */
  createNotificationsContainer: function() {
    const container = document.createElement('div');
    container.id = 'notifications-container';
    container.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      max-width: 400px;
      z-index: 999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
    return container;
  },
  
  /**
   * Remove notification from DOM
   */
  removeNotificationDOM: function(notificationId) {
    const element = document.getElementById(notificationId);
    if (element) {
      element.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        element.remove();
      }, 300);
    }
  },
  
  /**
   * Get complaint updates for user
   */
  subscribeToUserComplaints: function(userId, callback) {
    return this.subscribe(`user-complaints-${userId}`, callback);
  },
  
  /**
   * Get real-time analytics
   */
  subscribeToAnalytics: function(callback) {
    return this.subscribe('analytics-update', callback);
  },
  
  /**
   * Broadcast update (for admin)
   */
  broadcastComplaintUpdate: function(complaint) {
    this.emit(`user-complaints-${complaint.userId}`, complaint);
    
    if (Auth.isAdmin()) {
      this.emit('analytics-update', Admin.getAnalytics());
    }
  }
};

// Initialize real-time module on page load
document.addEventListener('DOMContentLoaded', () => {
  RealTime.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  RealTime.stopPolling();
});
