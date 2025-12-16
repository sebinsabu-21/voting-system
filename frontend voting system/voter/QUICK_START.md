# Quick Start Guide - Voter Portal Supabase Setup

## 🚀 Fast Setup (5 Minutes)

### Step 1: Create Supabase Account
```
1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up (GitHub or Email)
```

### Step 2: Create Project
```
1. Click "New Project"
2. Project Name: voter-portal
3. Set Database Password (save it!)
4. Choose Region
5. Click "Create new project"
6. Wait 2-3 minutes
```

### Step 3: Get API Keys
```
1. Go to: Settings → API
2. Copy "Project URL"
3. Copy "anon public" key
```

### Step 4: Create Database Tables
```
1. Go to: SQL Editor
2. Click "New query"
3. Copy ALL content from: supabase-schema.sql
4. Paste in SQL Editor
5. Click "Run"
6. Verify: Table Editor → should see "voters" and "otp_verifications"
```

### Step 5: Configure App
```
1. Open: supabase-config.js
2. Replace YOUR_SUPABASE_URL with your Project URL
3. Replace YOUR_SUPABASE_ANON_KEY with your anon key
4. Save file
```

### Step 6: Test
```
1. Open: index.html in browser
2. Enter username: testuser
3. Enter phone: 1234567890
4. Click "Generate OTP"
5. Enter OTP from alert/console
6. Create password
7. Click "Register"
8. Check Supabase → Table Editor → voters (should see your user)
```

## ⚡ Common Commands

**Open Browser Console:**
- Windows/Linux: `F12` or `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

**Verify Tables Created:**
- Supabase Dashboard → Table Editor → Check for "voters" and "otp_verifications"

**Check for Errors:**
- Browser Console (F12) → Console tab → Look for red errors

## 🔧 File Locations

```
Your Project Folder:
├── index.html              ← Main page (open this first!)
├── supabase-config.js      ← EDIT THIS with your keys
├── supabase-schema.sql     ← Copy this to SQL Editor
└── SETUP_GUIDE.md          ← Detailed instructions
```

## ❗ Important Notes

- ⚠️ Save your database password somewhere safe
- ⚠️ Don't share your anon key publicly
- ⚠️ Keep quotes around values in supabase-config.js
- ✅ Use 10-digit phone numbers for testing
- ✅ OTP expires after 5 minutes

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Check quotes, no spaces, full key copied |
| "Table doesn't exist" | Run SQL schema again in SQL Editor |
| OTP not working | Check expiration (5 min), generate new one |
| Can't see OTP | Check browser console (F12) or alert popup |

---

**For detailed instructions, see: SETUP_GUIDE.md**


