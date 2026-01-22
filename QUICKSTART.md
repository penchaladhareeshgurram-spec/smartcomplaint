# 🚀 Quick Start Guide

## Installation (30 seconds)

### Option 1: Python Server (Recommended for Windows)
```bash
cd smart-complaint-system
python server.py
```
Then open: **http://localhost:8000**

### Option 2: Node.js Server
```bash
cd smart-complaint-system
npm install
npm start
```
Then open: **http://localhost:8000**

### Option 3: PHP Server
```bash
cd smart-complaint-system
php -S localhost:8000
```
Then open: **http://localhost:8000**

### Option 4: Direct File Access (Geolocation won't work)
- Just open `index.html` in your browser
- No server needed for basic functionality

---

## 🔐 Demo Credentials

### User Account
```
Email: john@example.com
Password: password123
```

### Admin Account
```
Email: admin@smartcomplaint.com
Password: admin123456
```

---

## 📍 Quick Navigation

### Pages
| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page |
| Login | `/login.html` | Authentication |
| Register | `/register.html` | New account |
| User Dashboard | `/user-dashboard.html` | File complaints |
| Admin Dashboard | `/admin-dashboard.html` | Manage system |

---

## 👤 For Users (5 min)

1. **Login** with john@example.com / password123
2. **Click "New Complaint"** to file a complaint
3. **Fill in the form**:
   - Title: What's the issue?
   - Description: More details
   - Category: Choose from list
   - Priority: Low/Medium/High/Urgent
4. **Add Location** (click 📍 button)
5. **Upload Photo** (optional)
6. **Click "Submit"**
7. **Track Status** in "My Complaints"

---

## 👨‍💼 For Admins (5 min)

1. **Login** with admin@smartcomplaint.com / admin123456
2. **View Dashboard** - See overview KPIs
3. **Go to Complaints** - View all complaints
4. **Assign Staff** - Click Edit > Select Staff
5. **Update Status** - Change to "In Progress" → "Resolved"
6. **Add Notes** - Type admin notes
7. **View Analytics** - See trends and metrics
8. **Check Audit Logs** - Track all actions

---

## 📁 File Structure at a Glance

```
smart-complaint-system/
├── index.html                 ← Landing page (start here!)
├── login.html                 ← Login form
├── register.html              ← Sign up form
├── user-dashboard.html        ← User complaint page
├── admin-dashboard.html       ← Admin control panel
│
├── css/
│   └── style.css             ← All styling (3000+ lines)
│
├── js/
│   ├── config.js             ← Settings & demo data
│   ├── auth.js               ← Login/Register logic
│   ├── user.js               ← Complaint operations
│   ├── admin.js              ← Admin operations
│   └── realtime.js           ← Live updates
│
├── assets/
│   └── logo.svg              ← Logo
│
├── README.md                 ← Full documentation
├── TESTING.md                ← Test guide
├── package.json              ← Node config
└── server.py                 ← Python server
```

---

## 🎨 Design Features

✨ **Dark Theme** with Blue (#0066ff) & Yellow (#ffff00)  
🎯 **Glassmorphism** UI style  
📱 **Responsive** - Works on desktop, tablet, mobile  
⚡ **Real-time Updates** - Live notifications  
🔐 **Secure** - Role-based access control  

---

## 🧪 Quick Test

1. **File Complaint**: User Dashboard → New Complaint → Submit
2. **Check Admin Dashboard**: Go to admin dashboard, complaint appears
3. **Assign**: Click Edit, assign to staff
4. **Update Status**: Change to "In Progress"
5. **Check User**: Return to user dashboard, status updated!

---

## 🔧 Troubleshooting

### Page looks broken
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (Ctrl+F5)

### Geolocation not working
- Must use http://localhost or https
- Can't use file:// protocol
- Check browser location permissions

### Data not saving
- Check LocalStorage in DevTools (F12 → Application)
- Try Incognito/Private mode
- Check browser storage isn't full

### Styles not loading
- Verify CSS file path
- Check Network tab for 404 errors
- Try different browser

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `Enter` → Submit form
- `Esc` → Close modal
- `Ctrl+F5` → Hard refresh

### DevTools Tricks
- **F12** → Open developer tools
- **Application** tab → View/edit LocalStorage
- **Console** → See errors
- **Network** → Check file loading

### View All Data
```javascript
// In DevTools Console:
console.log(localStorage)
console.log(JSON.parse(localStorage.getItem('scs_complaints')))
```

### Reset System
```javascript
// In DevTools Console:
ConfigUtils.clearStorage()
location.reload()
```

---

## 📊 Features Overview

### User Features ✓
- ✅ Register & Login
- ✅ File complaints with photos
- ✅ Auto-capture GPS location
- ✅ Track complaint status
- ✅ View history
- ✅ Get notifications
- ✅ View admin notes

### Admin Features ✓
- ✅ Manage communities
- ✅ View all complaints
- ✅ Assign to staff
- ✅ Update workflow status
- ✅ Add notes
- ✅ View analytics
- ✅ Audit logs
- ✅ Advanced filtering

---

## 🎓 Learning Resources

### Understanding the Code
1. **config.js** - Start here for configuration
2. **auth.js** - How authentication works
3. **user.js** - User operations
4. **admin.js** - Admin operations
5. **realtime.js** - Real-time updates

### Code Quality
- Clean, commented code
- Modular design
- No dependencies (vanilla JS)
- SEO-friendly HTML
- Accessibility features

---

## 🚀 Next Steps

### To Customize
1. Edit `js/config.js` for settings
2. Modify `css/style.css` for colors
3. Update demo data in `config.js`

### To Deploy
1. See README.md for deployment options
2. Firebase integration guide included
3. Backend API template available

### To Extend
- Add new pages (copy HTML structure)
- Create new modules (follow JS pattern)
- Add more features (update relevant modules)

---

## 📞 Support

### Issues?
1. Check TESTING.md for test scenarios
2. Review README.md for detailed docs
3. Check browser console (F12) for errors
4. Check code comments for details

### Need Help?
- All features are documented inline
- Error messages are descriptive
- Demo data included for testing

---

## ⚡ System Requirements

| Item | Requirement |
|------|-------------|
| Browser | Modern (Chrome, Firefox, Safari, Edge) |
| OS | Windows, Mac, Linux |
| RAM | 512MB+ |
| Disk | 5MB |
| Network | Required for geolocation only |
| Database | None (uses browser storage) |

---

## 🎉 You're Ready!

1. Start server (choose one above)
2. Open http://localhost:8000
3. Click "Login" or "Get Started"
4. Use demo credentials
5. Explore the system!

---

**Happy Testing! 🚀**

*Last Updated: January 2026*  
*Version: 1.0.0*
