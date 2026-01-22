# Smart Complaint System - Testing Guide

## 🧪 Test Scenarios

### 1. Authentication Testing

#### Scenario 1.1: User Registration
**Steps:**
1. Navigate to http://localhost:8000/register.html
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Phone: +1-555-1234
   - Password: TestPass123
   - Confirm: TestPass123
3. Check "I agree to Terms"
4. Click "Create Account"

**Expected:**
- ✓ Success notification
- ✓ Redirect to user dashboard
- ✓ User info displayed in header

#### Scenario 1.2: User Login
**Steps:**
1. Navigate to http://localhost:8000/login.html
2. Enter: john@example.com / password123
3. Click "Sign In"

**Expected:**
- ✓ Success message
- ✓ Redirect to user dashboard
- ✓ Dashboard loads with complaints

#### Scenario 1.3: Admin Login
**Steps:**
1. Navigate to http://localhost:8000/login.html
2. Enter: admin@smartcomplaint.com / admin123456
3. Click "Sign In"

**Expected:**
- ✓ Success message
- ✓ Redirect to admin dashboard
- ✓ Full admin interface visible

#### Scenario 1.4: Failed Login
**Steps:**
1. Navigate to login page
2. Enter: wrong@email.com / wrongpass
3. Click "Sign In"

**Expected:**
- ✗ Error message: "Invalid email or password"
- ✓ Stay on login page

---

### 2. User Dashboard Testing

#### Scenario 2.1: File New Complaint
**Steps:**
1. Login as user (john@example.com)
2. Click "New Complaint"
3. Fill form:
   - Title: "Broken water pipe"
   - Category: "Utilities"
   - Description: "Water leaking from main line"
   - Priority: "High"
4. Click "Add Location"
5. Allow location permission
6. Select an image
7. Click "Submit Complaint"

**Expected:**
- ✓ "Complaint created successfully" message
- ✓ Form clears
- ✓ Redirect to complaints view
- ✓ New complaint appears in list
- ✓ Location data captured
- ✓ Image uploaded

#### Scenario 2.2: View Complaint History
**Steps:**
1. Login as user
2. Click "My Complaints"
3. View complaint list

**Expected:**
- ✓ All user's complaints displayed
- ✓ Status badges shown
- ✓ Priority levels visible
- ✓ Created dates displayed

#### Scenario 2.3: Filter Complaints
**Steps:**
1. Go to "My Complaints"
2. Select Status: "Resolved"
3. Select Priority: "High"
4. Select Category: "Infrastructure"

**Expected:**
- ✓ List filters correctly
- ✓ Only matching complaints shown
- ✓ Filters can be cleared

#### Scenario 2.4: View Complaint Details
**Steps:**
1. In complaint list, click on any complaint
2. Modal opens with details

**Expected:**
- ✓ Full complaint details displayed
- ✓ Status progress bar shown
- ✓ Admin notes visible (if any)
- ✓ Close button works

#### Scenario 2.5: Dashboard Statistics
**Steps:**
1. Login as user
2. View dashboard overview

**Expected:**
- ✓ Total complaints count correct
- ✓ Pending count matches filtered list
- ✓ In Progress count matches
- ✓ Resolved count matches
- ✓ Stats update in real-time

---

### 3. Admin Dashboard Testing

#### Scenario 3.1: View Overview
**Steps:**
1. Login as admin
2. Stay on Overview tab

**Expected:**
- ✓ KPI cards loaded (Total, Pending, Resolution Rate, Communities)
- ✓ Status breakdown chart displayed
- ✓ Category breakdown shown
- ✓ Recent complaints table visible

#### Scenario 3.2: Manage Complaints
**Steps:**
1. Go to "Complaints" section
2. View complaint list

**Expected:**
- ✓ All complaints from all users shown
- ✓ Table columns: ID, Title, Community, Status, Priority, Assigned To, Date, Action
- ✓ Can scroll horizontally on mobile

#### Scenario 3.3: Filter Complaints
**Steps:**
1. In Complaints section
2. Use Status, Priority, Category, Community filters
3. Use search box to search by title

**Expected:**
- ✓ Filters work individually
- ✓ Filters combine correctly
- ✓ Search works by title, ID, description
- ✓ Results update dynamically

#### Scenario 3.4: Assign Complaint
**Steps:**
1. Click "Edit" on a complaint
2. Select "Assign to Staff..."
3. Choose staff member
4. Complaint updates

**Expected:**
- ✓ Dropdown shows available staff
- ✓ Assignment saved
- ✓ Table reflects assignment
- ✓ Staff member notified (if notifications enabled)

#### Scenario 3.5: Update Complaint Status
**Steps:**
1. Open complaint modal
2. Change "Status" dropdown
3. Select new status

**Expected:**
- ✓ Status updates immediately
- ✓ Table reflects change
- ✓ Audit log created
- ✓ User notified (if notifications enabled)

#### Scenario 3.6: Add Admin Note
**Steps:**
1. Open complaint modal
2. Type in "Add Admin Note" field
3. Click "Add Note"

**Expected:**
- ✓ Note saved
- ✓ User can see note in their detail view
- ✓ Timestamp recorded
- ✓ Admin name shown

#### Scenario 3.7: Manage Communities
**Steps:**
1. Go to "Communities"
2. Click "New Community"
3. Fill form:
   - Name: "Test Community"
   - Location: "123 Main St"
   - Description: "Test community"
4. Click "Create"

**Expected:**
- ✓ Community created
- ✓ Invite link generated
- ✓ Card appears in list
- ✓ Invite link is copyable

#### Scenario 3.8: View Analytics
**Steps:**
1. Go to "Analytics" section
2. Review metrics

**Expected:**
- ✓ Average resolution time shown
- ✓ Overall resolution rate calculated
- ✓ Total users count correct
- ✓ Active communities count correct

#### Scenario 3.9: View Audit Logs
**Steps:**
1. Go to "Audit Logs"
2. Review entries

**Expected:**
- ✓ All admin actions logged
- ✓ Timestamp shown
- ✓ Admin name displayed
- ✓ Action type clear
- ✓ Can filter by action/admin/date

---

### 4. Real-Time Updates Testing

#### Scenario 4.1: Notification System
**Steps:**
1. Open two browser windows
2. Login as user in first window
3. Login as admin in second window
4. As admin, update a complaint status
5. Watch first window

**Expected:**
- ✓ User receives notification in real-time (within 3 seconds)
- ✓ Notification appears as toast/alert
- ✓ Dashboard stats update automatically
- ✓ Complaint details reflect new status

#### Scenario 4.2: Live Dashboard Updates
**Steps:**
1. Open admin overview
2. In another window (as user), file new complaint
3. Watch admin dashboard

**Expected:**
- ✓ Total complaint count increases
- ✓ New complaint appears in table (within 3 seconds)
- ✓ Status breakdown updates

---

### 5. UI/UX Testing

#### Scenario 5.1: Responsive Design - Desktop
**Steps:**
1. Open in Chrome at 1920x1080
2. Navigate all pages
3. Test all interactions

**Expected:**
- ✓ Layout looks professional
- ✓ All elements visible
- ✓ No horizontal scroll
- ✓ Tables display properly

#### Scenario 5.2: Responsive Design - Tablet
**Steps:**
1. Open DevTools (F12)
2. Set device to iPad (768x1024)
3. Navigate all pages

**Expected:**
- ✓ Layout adapts to tablet size
- ✓ Mobile menu works (if applicable)
- ✓ Tables readable
- ✓ Forms usable

#### Scenario 5.3: Responsive Design - Mobile
**Steps:**
1. Open DevTools
2. Set device to iPhone 12 (390x844)
3. Navigate all pages

**Expected:**
- ✓ Mobile-first design active
- ✓ Hamburger menu works
- ✓ All buttons touch-friendly
- ✓ No horizontal scroll
- ✓ Tables collapse/reformat

#### Scenario 5.4: Dark Theme
**Steps:**
1. Load any page
2. Observe colors

**Expected:**
- ✓ Dark background (#0a0e27)
- ✓ Blue accents (#0066ff)
- ✓ Yellow highlights (#ffff00)
- ✓ Good contrast for readability
- ✓ Glassmorphic cards visible

---

### 6. Data Validation Testing

#### Scenario 6.1: Form Validation - Registration
**Steps:**
1. Try to submit empty form
2. Try email without @
3. Try password with < 8 chars
4. Try mismatched passwords

**Expected:**
- ✗ Each error caught and shown
- ✓ Validation messages clear
- ✓ Form not submitted

#### Scenario 6.2: Form Validation - Complaint
**Steps:**
1. Try to submit with empty title
2. Try with empty description
3. Try without selecting category

**Expected:**
- ✗ Error for each required field
- ✓ Form not submitted

---

### 7. Security Testing

#### Scenario 7.1: Protected Routes
**Steps:**
1. Clear localStorage
2. Try to access: /user-dashboard.html
3. Try to access: /admin-dashboard.html

**Expected:**
- ✓ Redirected to login page
- ✓ Session check working

#### Scenario 7.2: Admin-Only Access
**Steps:**
1. Login as regular user
2. Try to manually navigate to /admin-dashboard.html

**Expected:**
- ✓ Redirected to user dashboard
- ✓ Cannot access admin features

#### Scenario 7.3: Session Persistence
**Steps:**
1. Login as user
2. Refresh page (F5)
3. Close browser tab, reopen

**Expected:**
- ✓ Session persists after refresh
- ✓ User stays logged in
- ✓ Data loads correctly

---

### 8. Performance Testing

#### Scenario 8.1: Page Load Time
**Expected:**
- ✓ Landing page: < 2 seconds
- ✓ Login page: < 1 second
- ✓ Dashboard: < 2 seconds

#### Scenario 8.2: Complaint Loading
**Steps:**
1. Load complaints list
2. Monitor network tab (F12)

**Expected:**
- ✓ Data loaded from localStorage
- ✓ No external API calls
- ✓ Instant rendering

---

### 9. Data Management Testing

#### Scenario 9.1: Data Persistence
**Steps:**
1. File complaint as user
2. Refresh page
3. Complaint still visible

**Expected:**
- ✓ Data persists in localStorage
- ✓ Data survives page refresh
- ✓ Data survives browser restart

#### Scenario 9.2: Clear All Data
**Steps:**
1. Open DevTools Console
2. Run: `ConfigUtils.clearStorage()`
3. Refresh page

**Expected:**
- ✓ All data cleared
- ✓ Demo data reinitialized
- ✓ App works normally

---

## 🐛 Bug Report Template

When testing, use this format for bugs:

**Title**: [Feature] Brief description

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. Step one
2. Step two

**Expected Result**:
- What should happen

**Actual Result**:
- What actually happens

**Browser**: Chrome 90+ / Firefox 88+ / Safari 14+ / Edge 90+

**Screenshots**: (if applicable)

---

## ✅ Test Checklist

### Pre-Launch Testing
- [ ] All pages load without errors
- [ ] Navigation works on all pages
- [ ] Forms validate correctly
- [ ] Authentication works (user + admin)
- [ ] Complaints can be filed
- [ ] Complaints can be viewed
- [ ] Filters work correctly
- [ ] Admin features work
- [ ] Real-time updates work
- [ ] Responsive design tested (desktop, tablet, mobile)
- [ ] No console errors
- [ ] No console warnings
- [ ] Demo data loads
- [ ] Session persists
- [ ] Logout works
- [ ] No hardcoded test data visible
- [ ] All buttons functional
- [ ] All links work
- [ ] Images load (if any)
- [ ] Colors display correctly

### Browser Compatibility
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🚀 Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| First Paint | < 1s | |
| Page Load | < 2s | |
| Dashboard Load | < 2s | |
| Complaint List | < 1s | |
| Filter Update | < 500ms | |
| Modal Open | < 300ms | |
| Notification Show | < 100ms | |

---

**Last Updated**: January 2026  
**Version**: 1.0.0
