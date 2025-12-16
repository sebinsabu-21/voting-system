# Voter Portal Setup Checklist

Print this page or keep it open while setting up your Supabase integration!

## Phase 1: Supabase Account Setup
- [ ] Created Supabase account at supabase.com
- [ ] Logged into Supabase dashboard
- [ ] Created new project named "voter-portal"
- [ ] Saved database password in a safe place
- [ ] Project finished setting up (no loading indicators)

## Phase 2: Get Credentials
- [ ] Opened Settings → API
- [ ] Copied Project URL
- [ ] Saved Project URL somewhere safe
- [ ] Copied anon/public key
- [ ] Saved anon/public key somewhere safe

**My Credentials (fill in):**
```
Project URL: ________________________________
Anon Key: ________________________________
```

## Phase 3: Database Setup
- [ ] Opened SQL Editor
- [ ] Created new query
- [ ] Opened supabase-schema.sql file
- [ ] Copied entire SQL file content
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run" button
- [ ] No errors in SQL Editor
- [ ] Opened Table Editor
- [ ] Verified "voters" table exists
- [ ] Verified "otp_verifications" table exists

## Phase 4: Application Configuration
- [ ] Opened supabase-config.js file
- [ ] Replaced YOUR_SUPABASE_URL with actual URL
- [ ] Replaced YOUR_SUPABASE_ANON_KEY with actual key
- [ ] Verified quotes are around both values
- [ ] Saved the file (Ctrl+S)

**Before:**
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

**After (example):**
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## Phase 5: Testing
- [ ] Opened index.html in browser
- [ ] Page loaded without errors
- [ ] Entered test username: _______________
- [ ] Entered test phone: _______________
- [ ] Clicked "Generate OTP"
- [ ] No errors in browser console (F12)
- [ ] Redirected to OTP page
- [ ] Entered OTP from alert/console
- [ ] Clicked "Submit"
- [ ] Redirected to password page
- [ ] Created valid password
- [ ] Confirmed password matches
- [ ] Register button became enabled
- [ ] Clicked "Register"
- [ ] Saw success message

## Phase 6: Verification
- [ ] Opened Supabase dashboard
- [ ] Opened Table Editor
- [ ] Selected "voters" table
- [ ] Saw my test user in the table
- [ ] Verified username is correct
- [ ] Verified phone number is correct
- [ ] Verified password_hash is not empty

## 🎉 Setup Complete!
- [ ] All phases completed
- [ ] User data appears in database
- [ ] No console errors
- [ ] Ready to use!

---

## Troubleshooting Notes

**If something didn't work, note it here:**

___________________________________________________
___________________________________________________
___________________________________________________

**Browser Console Errors (F12 → Console):**
___________________________________________________
___________________________________________________

**Supabase Errors:**
___________________________________________________
___________________________________________________

---

**Need help?** Refer to SETUP_GUIDE.md for detailed instructions.


