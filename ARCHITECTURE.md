# Architecture & Technical Documentation

## 🏗️ System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   HTML5      │  │   CSS3       │  │ JavaScript   │   │
│  │  (Markup)    │  │  (Styling)   │  │ (Logic)      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                           │                               │
│        ┌──────────────────┴──────────────────┐           │
│        ▼                                     ▼           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         JAVASCRIPT MODULES (ES6+)               │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │   │
│  │  │ config   │ │  auth    │ │  user    │        │   │
│  │  └──────────┘ └──────────┘ └──────────┘        │   │
│  │  ┌──────────┐ ┌──────────┐                     │   │
│  │  │  admin   │ │ realtime │                     │   │
│  │  └──────────┘ └──────────┘                     │   │
│  └──────────────────────────────────────────────────┘   │
│                        │                                 │
│        ┌───────────────┴───────────────┐               │
│        ▼                               ▼               │
│  ┌────────────────┐           ┌──────────────────┐    │
│  │ Browser APIs   │           │ LocalStorage     │    │
│  │ • Geolocation  │           │ (Persistent Data)│    │
│  │ • FileReader   │           └──────────────────┘    │
│  │ • EventTarget  │                                   │
│  └────────────────┘                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Module Architecture

### config.js
**Purpose**: Central configuration and demo data  
**Key Functions**:
- `CONFIG` object - Global settings
- `DEMO_DATA` object - Sample data
- `ConfigUtils` - Storage helper functions

```javascript
// Import and use
CONFIG.COMPLAINT_STATUS.PENDING
ConfigUtils.getStorageData(key)
```

### auth.js
**Purpose**: User authentication and session management  
**Key Functions**:
- `Auth.register(userData)` - Register new user
- `Auth.login(email, password)` - User login
- `Auth.logout()` - Logout user
- `Auth.isAuthenticated()` - Check if logged in
- `Auth.hasRole(role)` - Check user role
- `Auth.isAdmin()` - Admin check

```javascript
// Initialization
Auth.init() // Called automatically
Auth.currentUser // Current logged-in user

// Usage
if (Auth.isAdmin()) { /* show admin features */ }
```

### user.js
**Purpose**: User-specific operations  
**Key Functions**:
- `User.createComplaint(data)` - File new complaint
- `User.loadComplaints()` - Load user's complaints
- `User.getLocation()` - Get GPS location
- `User.uploadImage(file)` - Upload photo
- `User.getComplaintStats()` - Get statistics

```javascript
// Usage
const complaint = await User.createComplaint({
  title: "...",
  description: "...",
  category: "...",
  priority: "..."
})

const stats = User.getComplaintStats()
// { total: 5, pending: 2, inProgress: 1, onHold: 0, resolved: 2 }
```

### admin.js
**Purpose**: Admin-specific operations  
**Key Functions**:
- `Admin.createCommunity(data)` - Create community
- `Admin.getAllComplaints(filters)` - View all complaints
- `Admin.assignComplaint(complaintId, staffId)` - Assign staff
- `Admin.updateComplaintStatus(complaintId, status)` - Update status
- `Admin.addNote(complaintId, text)` - Add admin notes
- `Admin.getAnalytics()` - Get dashboard analytics
- `Admin.logAction(action, entityType, entityId, changes)` - Audit logging

```javascript
// Usage
const analytics = Admin.getAnalytics()
// { totalComplaints, byStatus, byCategory, byPriority, resolutionRate }

Admin.updateComplaintStatus(complaintId, 'In Progress')
Admin.assignComplaint(complaintId, staffId)
```

### realtime.js
**Purpose**: Real-time updates and notifications  
**Key Functions**:
- `RealTime.subscribe(event, callback)` - Listen to events
- `RealTime.emit(event, data)` - Trigger events
- `RealTime.createNotification(type, title, message)` - Show notification
- `RealTime.showSuccess/Error/Warning/Info(message)` - Quick toasts
- `RealTime.startPolling()` - Start update checks
- `RealTime.broadcastComplaintUpdate(complaint)` - Notify users

```javascript
// Usage
RealTime.subscribe('complaint-updated', (complaint) => {
  console.log('Complaint updated:', complaint)
})

RealTime.showSuccess('Complaint filed successfully!')

RealTime.subscribeToUserComplaints(userId, (complaint) => {
  updateUI(complaint)
})
```

---

## 🔄 Data Flow

### User Registration Flow
```
User fills form
    ↓
Auth.register() validates input
    ↓
Create user object
    ↓
Save to localStorage
    ↓
Create session
    ↓
Redirect to dashboard
```

### File Complaint Flow
```
User fills complaint form
    ↓
User.createComplaint() validates
    ↓
Get optional location (Geolocation API)
    ↓
Get optional image (FileReader API)
    ↓
Create complaint object
    ↓
Save to localStorage
    ↓
RealTime notifies admin
    ↓
Show success & redirect
```

### Assign Complaint Flow (Admin)
```
Admin clicks complaint
    ↓
Shows complaint modal
    ↓
Admin selects staff member
    ↓
Admin.assignComplaint()
    ↓
Update complaint in storage
    ↓
Log action to audit
    ↓
RealTime broadcasts update
    ↓
User dashboard reflects change
```

---

## 🗄️ Data Storage

### LocalStorage Keys
```javascript
// In CONFIG.STORAGE_KEYS:
{
  USER: 'scs_user',                    // Current user
  AUTH_TOKEN: 'scs_auth_token',        // Session token
  COMMUNITIES: 'scs_communities',      // All communities
  COMPLAINTS: 'scs_complaints',        // All complaints
  STAFF: 'scs_staff',                  // Staff members
  AUDIT_LOGS: 'scs_audit_logs'         // Admin actions
}
```

### Data Relationships
```
User (1) ──────→ (many) Complaints
                    ↓
User (many) ←──── (1) Community
                    ↓
Admin (1) ──────→ (many) Communities
                    ↓
Staff (many) ←──── (1) Community
                    ↓
Staff (1) ──────→ (many) Complaints (assigned)
```

---

## 🎨 Component Structure

### Reusable Components
```
Buttons
├── .btn-primary
├── .btn-secondary
├── .btn-danger
└── .btn-success

Cards
├── .card (base)
├── .card-header
├── .card-body
└── .card-footer

Forms
├── .form-group
├── input, textarea, select
└── .checkbox-label, .radio-label

Badges
├── .badge-primary
├── .badge-success
├── .badge-danger
└── .badge-warning

Tables
├── <table>
├── <thead> with <th>
└── <tbody> with <tr>

Modals
├── .modal
├── .modal-content
├── .modal-header
└── .modal-close
```

---

## 🔐 Security Implementation

### Authentication
```javascript
// Password hashing (demo - use bcrypt in production)
Auth.hashPassword(password)         // btoa(password) + '_hashed'

// Token generation (JWT-like)
Auth.generateToken(user)            // header.payload.signature

// Session check
Auth.isAuthenticated()              // Check token + user
```

### Authorization
```javascript
// Role checking
Auth.isAdmin()                      // Check if admin
Auth.hasRole(requiredRole)          // Check specific role
Auth.checkAuthStatus()              // Redirect if not authenticated

// Admin-only routes
if (Auth.isAdmin()) { showAdminDashboard() }
else { redirectToDashboard() }
```

### Input Validation
```javascript
// Email validation
Auth.isValidEmail(email)            // Regex check

// Password validation
password.length >= MIN_PASSWORD      // Min length check

// File validation
file.type in ALLOWED_IMAGE_TYPES    // File type check
file.size <= MAX_FILE_SIZE          // Size check

// Form validation
required fields check               // HTML5 + JavaScript
```

---

## 📡 Real-Time Architecture

### Polling System
```
Every 3 seconds:
    ↓
Check LocalStorage for changes
    ↓
Compare timestamps
    ↓
Find updated items
    ↓
Emit events to subscribers
    ↓
Trigger UI updates
```

### Event System
```
RealTime.subscribe('event-name', callback)
                    ↓
Event happens
                    ↓
RealTime.emit('event-name', data)
                    ↓
All callbacks executed
                    ↓
UI updated
```

### Notification System
```
Action occurs
    ↓
Create notification object
    ↓
Store in RealTime.notifications
    ↓
Emit 'notification' event
    ↓
Render to DOM (toast/alert)
    ↓
Auto-remove after timeout (or manual)
```

---

## 🎯 Page Load Sequence

### Landing Page (index.html)
```
1. HTML loads
2. CSS loads
3. config.js loads
4. auth.js loads (initializes session)
5. DOMContentLoaded → Init mobile menu
6. Page ready
```

### User Dashboard (user-dashboard.html)
```
1. HTML loads
2. CSS loads
3. config.js, auth.js, user.js, realtime.js load
4. Auth.checkAuthStatus() → Redirect if not authenticated
5. DOMContentLoaded → initDashboard()
   ├── Check auth
   ├── Load user info
   ├── Load complaints
   ├── Setup real-time
   └── Render UI
6. RealTime.startPolling() → Watch for updates
7. Page interactive
```

### Admin Dashboard (admin-dashboard.html)
```
1. HTML loads
2. CSS loads
3. config.js, auth.js, admin.js, realtime.js load
4. Auth.checkAuthStatus() → Verify admin role
5. DOMContentLoaded → initAdminDashboard()
   ├── Check admin role
   ├── Load communities
   ├── Load complaints
   ├── Load analytics
   └── Render UI
6. RealTime.startPolling() → Watch for updates
7. Page interactive
```

---

## 🔧 Customization Points

### To Change Colors
Edit `:root` in `css/style.css`:
```css
:root {
  --primary-blue: #0066ff;        /* Change this */
  --accent-yellow: #ffff00;       /* Or this */
  /* ... */
}
```

### To Change Complaint Categories
Edit `CONFIG.COMPLAINT_CATEGORIES` in `config.js`:
```javascript
CONFIG.COMPLAINT_CATEGORIES = [
  'Your Category 1',
  'Your Category 2',
  // ...
]
```

### To Add New Pages
1. Create HTML file with same structure
2. Import: config.js, auth.js, style.css
3. Import additional modules as needed
4. Add auth check if protected page
5. Add navigation links

### To Add New Features
1. Create module if not exists
2. Export functions on module object
3. Call functions from HTML event handlers
4. Use RealTime for notifications
5. Log actions for audit trail

---

## 📊 Performance Considerations

### Optimization Techniques Used
- ✓ Vanilla JS (no framework overhead)
- ✓ LocalStorage (instant access)
- ✓ Event delegation (fewer listeners)
- ✓ Debounced filtering
- ✓ Lazy modal creation
- ✓ CSS Grid for layouts
- ✓ Minimal re-renders

### Scalability Notes
- LocalStorage limit: ~5-10MB per domain
- For ~1000 complaints: ~2-3MB
- For larger data: Implement backend
- Real-time: Switch to WebSocket

---

## 🚀 Deployment Architecture

### Current (Standalone)
- Single HTML file served
- All logic in browser
- Data in LocalStorage
- No backend needed

### Recommended (Production)
```
┌─────────────────┐
│  Client (SPA)   │
└────────┬────────┘
         │ HTTPS/API
         ▼
┌─────────────────┐
│  Backend API    │
│  (Node/Express) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│  (MongoDB/SQL)  │
└─────────────────┘

         ↓
┌─────────────────┐
│ Cloud Storage   │
│ (AWS S3/etc)    │
└─────────────────┘
```

---

## 📝 Code Style Guide

### Naming Conventions
- Functions: camelCase (`loadComplaints()`)
- Classes/Objects: PascalCase (`Auth`, `Admin`)
- Constants: UPPER_SNAKE_CASE (`CONFIG`, `DEMO_DATA`)
- CSS classes: kebab-case (`.btn-primary`)

### File Organization
- HTML: Semantic structure, no inline scripts
- CSS: Organized by component
- JS: Modular, self-contained functions
- Comments: Explain WHY, not WHAT

### Error Handling
- Try-catch for async operations
- Validation before processing
- User-friendly error messages
- Console logging for debugging

---

## 🧪 Testing Strategy

### Unit Testing Approach
- Test each module independently
- Test data transformations
- Test validation logic
- Test error handling

### Integration Testing
- Test module interactions
- Test data flow between modules
- Test real-time updates
- Test UI rendering

### E2E Testing
- Test complete user journeys
- Test authentication flows
- Test complaint workflows
- Test admin operations

---

**Version**: 1.0.0  
**Last Updated**: January 2026
