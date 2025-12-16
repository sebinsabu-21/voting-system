# Step-by-Step Setup Guide for Voter Portal with Supabase

This guide will walk you through setting up your voter portal with Supabase integration from start to finish.

## 📋 Prerequisites

- A web browser (Chrome, Firefox, Edge, etc.)
- A valid email address
- Basic understanding of copying and pasting text

---

## 🎯 Step 1: Create a Supabase Account

### 1.1 Go to Supabase Website
1. Open your web browser
2. Go to: **https://supabase.com**
3. Click the **"Start your project"** button (or "Sign Up" if you see it)

### 1.2 Sign Up for Free
1. Choose to sign up with:
   - **GitHub** (recommended if you have a GitHub account), OR
   - **Email** (if you prefer)
2. If using email:
   - Enter your email address
   - Enter a password
   - Click **"Create Account"**
   - Check your email and verify your account

### 1.3 Complete Your Profile (if prompted)
- Fill in your name and organization (optional)
- Click **"Continue"** or **"Next"**

---

## 🏗️ Step 2: Create a New Supabase Project

### 2.1 Access the Dashboard
- After signing in, you'll see the Supabase dashboard

### 2.2 Create New Project
1. Click the **"New Project"** button (usually green, top right or center)
2. Fill in the project details:

   **Project Name:**
   - Enter: `voter-portal` (or any name you prefer)

   **Database Password:**
   - Enter a strong password (save this somewhere safe!)
   - Example: `MySecurePassword123!`
   - ⚠️ **IMPORTANT:** Write this password down - you'll need it later

   **Region:**
   - Choose the region closest to you (e.g., "East US", "West Europe")

   **Pricing Plan:**
   - Select **"Free"** plan (perfect for testing)

### 2.3 Wait for Project Setup
- Click **"Create new project"**
- Wait 2-3 minutes for Supabase to set up your project
- You'll see a progress indicator - don't close this page!

---

## 🔑 Step 3: Get Your Supabase Credentials

### 3.1 Navigate to API Settings
1. Once your project is ready, you'll see the project dashboard
2. On the left sidebar, click **"Settings"** (gear icon)
3. Click **"API"** from the settings menu

### 3.2 Copy Your Credentials
You'll see several sections. Copy these two values:

**A. Project URL:**
1. Find the section labeled **"Project URL"** or **"API"**
2. You'll see a URL like: `https://abcdefghijklmnop.supabase.co`
3. Click the **copy icon** (📋) next to it, OR
4. Select all the text and copy it (Ctrl+C or Cmd+C)
5. ⚠️ **Save this somewhere** - you'll need it in Step 5

**B. Anon/Public Key:**
1. Find the section labeled **"anon public"** or **"Project API keys"**
2. Under **"anon public"**, you'll see a long key starting with `eyJ...`
3. Click the **eye icon** 👁️ to reveal it (if hidden)
4. Click the **copy icon** (📋) next to it
5. ⚠️ **Save this somewhere** - you'll need it in Step 5

**Example of what you should have:**
```
Project URL: https://abcdefghijklmnop.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQ1Njc4OSwiZXhwIjoxOTM5MDMyNzg5fQ.abcdefghijklmnopqrstuvwxyz1234567890
```

---

## 🗄️ Step 4: Set Up Database Tables

### 4.1 Open SQL Editor
1. In your Supabase dashboard, look at the left sidebar
2. Click **"SQL Editor"** (or find it under "Database" section)
3. Click the **"New query"** button (top right)

### 4.2 Open the Schema File
1. Open the file `supabase-schema.sql` in your project folder
   - You can open it with Notepad, VS Code, or any text editor
2. **Select ALL** the content (Ctrl+A or Cmd+A)
3. **Copy** all the content (Ctrl+C or Cmd+C)

### 4.3 Paste and Run SQL
1. Go back to Supabase SQL Editor
2. In the SQL editor box, **paste** the copied SQL (Ctrl+V or Cmd+V)
3. Click the **"Run"** button (or press Ctrl+Enter)
4. Wait for it to execute (usually 1-2 seconds)

### 4.4 Verify Tables Were Created
1. Look at the left sidebar again
2. Click **"Table Editor"**
3. You should see two tables:
   - ✅ **voters**
   - ✅ **otp_verifications**

If you see both tables, **Step 4 is complete!** ✅

---

## ⚙️ Step 5: Configure Your Application

### 5.1 Open the Config File
1. Open the file `supabase-config.js` in your project folder
2. You should see something like this:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 5.2 Replace the Placeholder Values

**Replace `YOUR_SUPABASE_URL`:**
1. Find the line: `const SUPABASE_URL = 'YOUR_SUPABASE_URL';`
2. Replace `YOUR_SUPABASE_URL` with the Project URL you copied in Step 3
3. Keep the quotes around it

**Example:**
```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
```

**Replace `YOUR_SUPABASE_ANON_KEY`:**
1. Find the line: `const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';`
2. Replace `YOUR_SUPABASE_ANON_KEY` with the Anon Key you copied in Step 3
3. Keep the quotes around it

**Example:**
```javascript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 5.3 Save the File
1. After making both changes, **save** the file (Ctrl+S or Cmd+S)
2. Your `supabase-config.js` should now look like:

```javascript
const SUPABASE_URL = 'https://your-actual-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-actual-key-here';
```

---

## 🧪 Step 6: Test Your Setup

### 6.1 Open Your Website
1. In your project folder, find the file `index.html`
2. **Right-click** on `index.html`
3. Select **"Open with"** → Choose your web browser (Chrome, Firefox, etc.)
   - OR double-click it if HTML files open in your browser by default

### 6.2 Test Registration Flow

**A. Generate OTP:**
1. You should see the "Voter Portal" page
2. Enter a username (e.g., `testuser`)
3. Enter a 10-digit phone number (e.g., `1234567890`)
4. Click **"Generate OTP"**
5. Check the browser's **Developer Console** for the OTP:
   - Press **F12** (or right-click → "Inspect")
   - Click the **"Console"** tab
   - Look for the OTP number (or check the alert message)

**B. Verify OTP:**
1. You should be automatically redirected to the OTP page
2. Enter the 6-digit OTP you saw in the console/alert
3. Click **"Submit"**

**C. Create Password:**
1. You should be redirected to the password page
2. Create a password that meets all requirements:
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
3. Confirm the password
4. Click **"Register"**

### 6.3 Verify Data in Supabase
1. Go back to your Supabase dashboard
2. Click **"Table Editor"** in the left sidebar
3. Click on the **"voters"** table
4. You should see your registered user with:
   - Username
   - Phone number
   - Hashed password
   - Timestamps

**If you see your user data, everything is working! 🎉**

---

## ❓ Troubleshooting Common Issues

### Issue 1: "Invalid API key" Error

**Problem:** The website shows an error about invalid API key

**Solution:**
1. Double-check `supabase-config.js`
2. Make sure you copied the **entire** anon key (it's very long)
3. Make sure there are quotes around both values
4. Make sure there are no extra spaces before/after the values
5. Save the file and refresh your browser

---

### Issue 2: "Table does not exist" Error

**Problem:** Error saying table doesn't exist

**Solution:**
1. Go to Supabase → **Table Editor**
2. Check if `voters` and `otp_verifications` tables exist
3. If they don't exist, go back to **Step 4** and run the SQL again
4. Make sure you copied the **entire** SQL file content

---

### Issue 3: Can't See OTP

**Problem:** OTP is generated but I can't see it

**Solution:**
1. Open browser Developer Tools (F12)
2. Go to the **Console** tab
3. Look for any error messages (in red)
4. For testing, the OTP is shown in an alert popup
5. Check that you're looking at the correct alert/message

---

### Issue 4: OTP Verification Fails

**Problem:** OTP doesn't verify even though I entered it correctly

**Solution:**
1. Check that OTP hasn't expired (5 minutes limit)
2. Generate a new OTP
3. Check browser console for errors (F12 → Console)
4. Verify the OTP was saved in database:
   - Go to Supabase → Table Editor → `otp_verifications`
   - Check if a record exists with your username/phone

---

### Issue 5: Registration Fails

**Problem:** Can't register even with valid password

**Solution:**
1. Check that username and phone are unique
2. Try a different username/phone combination
3. Check browser console for specific error messages (F12)
4. Verify all password requirements are met (all should turn green)

---

## ✅ Checklist: Did You Complete Everything?

Before considering your setup complete, verify:

- [ ] Created Supabase account
- [ ] Created new Supabase project
- [ ] Saved database password safely
- [ ] Copied Project URL and saved it
- [ ] Copied Anon Key and saved it
- [ ] Ran SQL schema in SQL Editor
- [ ] Verified both tables exist (voters, otp_verifications)
- [ ] Updated `supabase-config.js` with your credentials
- [ ] Saved `supabase-config.js` file
- [ ] Tested the full registration flow
- [ ] Verified user appears in Supabase `voters` table

---

## 🎓 Next Steps

Now that your voter portal is set up with Supabase:

1. **Test thoroughly:** Try registering multiple users
2. **Explore Supabase:** Check out other features in your dashboard
3. **Customize:** Modify the design or add features
4. **Deploy:** Consider hosting your website online

---

## 📞 Need More Help?

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Check Browser Console:** Always check for error messages (F12)

---

**Congratulations! 🎉** Your voter portal is now integrated with Supabase!


