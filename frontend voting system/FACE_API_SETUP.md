# Face Recognition Setup Guide

This guide will help you set up face-api.js for face recognition in your voter portal.

## 📋 What You Need

- face-api.js library (already included via CDN in the HTML files)
- Model files (you need to download these)
- A web server (required for face-api.js to work properly)

## ⚠️ Important: HTTPS Required

Face recognition requires HTTPS or localhost. Camera access will not work on HTTP sites.

- ✅ `https://yourdomain.com` - Works
- ✅ `http://localhost` - Works (for development)
- ❌ `http://yourdomain.com` - Won't work

## 📥 Step 1: Download Model Files

### Option A: Direct Download (Easiest)

1. Go to the face-api.js GitHub repository:
   **https://github.com/justadudewhohacks/face-api.js/tree/master/weights**

2. Download these 3 files:
   - `tiny_face_detector_model-weights_manifest.json`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_recognition_model-weights_manifest.json`

3. Also download the corresponding `.shard` files for each model:
   - Look for files with matching names (e.g., `tiny_face_detector_model-shard1`)
   - Download all shard files for each model

### Option B: Download All Models at Once

1. Go to: **https://github.com/justadudewhohacks/face-api.js/tree/master/weights**
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file
5. Navigate to the `weights` folder
6. Copy only the files mentioned above

## 📁 Step 2: Create Models Folder

1. In your project root folder, create a new folder called `models`
   ```
   projectad/
   ├── models/          ← Create this folder
   ├── index.html
   ├── face-enroll.html
   └── ...
   ```

2. Place all downloaded model files into the `models` folder:
   ```
   projectad/
   └── models/
       ├── tiny_face_detector_model-weights_manifest.json
       ├── tiny_face_detector_model-shard1
       ├── face_landmark_68_model-weights_manifest.json
       ├── face_landmark_68_model-shard1
       ├── face_recognition_model-weights_manifest.json
       ├── face_recognition_model-shard1
       └── (any other shard files)
   ```

## 🌐 Step 3: Set Up Local Web Server

Since face-api.js needs to load model files, you need to run a web server (not just open HTML files directly).

### Option A: Using Python (Easiest)

1. Open terminal/command prompt in your project folder
2. Run one of these commands:

   **Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

3. Open browser and go to: `http://localhost:8000`

### Option B: Using Node.js (http-server)

1. Install http-server globally:
   ```bash
   npm install -g http-server
   ```

2. Navigate to your project folder and run:
   ```bash
   http-server -p 8000
   ```

3. Open browser and go to: `http://localhost:8000`

### Option C: Using VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🧪 Step 4: Test Face Recognition

1. Start your web server (see Step 3)
2. Open `http://localhost:8000` in your browser
3. Navigate to the registration flow:
   - Enter username and phone
   - Generate OTP
   - Verify OTP
   - Create password
   - You should see the Face Enrollment page

4. **Allow camera permissions** when prompted
5. Position your face in the camera view
6. Wait for "Face detected" message
7. Click "Capture Face"

## 🔍 Step 5: Verify Models Are Loading

1. Open browser Developer Tools (F12)
2. Go to the "Console" tab
3. Look for any errors about missing model files
4. Go to the "Network" tab
5. Refresh the page
6. Look for requests to `/models/` folder
7. All model files should load successfully (status 200)

## 📊 Model Files You Need (Summary)

| File Name | Purpose |
|-----------|---------|
| `tiny_face_detector_model-weights_manifest.json` | Detects faces in the image |
| `tiny_face_detector_model-shard1` | Weights for face detection |
| `face_landmark_68_model-weights_manifest.json` | Detects face landmarks (eyes, nose, etc.) |
| `face_landmark_68_model-shard1` | Weights for landmarks |
| `face_recognition_model-weights_manifest.json` | Creates face embeddings |
| `face_recognition_model-shard1` | Weights for recognition |

## 🐛 Troubleshooting

### Problem: "Models not found" Error

**Solution:**
- Check that `models` folder exists in project root
- Verify all JSON manifest files are in the folder
- Verify all `.shard` files are in the folder
- Check browser console for exact file names it's looking for

### Problem: "Camera access denied"

**Solution:**
- Make sure you're using `http://localhost` or HTTPS
- Check browser permissions (Settings → Site Settings → Camera)
- Try a different browser
- Make sure no other app is using the camera

### Problem: "No face detected"

**Solution:**
- Ensure good lighting
- Position face directly in front of camera
- Remove glasses/mask if possible
- Check that camera is working (test in other apps)

### Problem: "CORS error" when loading models

**Solution:**
- Make sure you're using a web server (not opening file:// directly)
- Check that models folder is in the correct location
- Verify web server is serving files from project root

## 🎯 Quick Checklist

- [ ] Created `models` folder in project root
- [ ] Downloaded all 3 model manifest files
- [ ] Downloaded all corresponding shard files
- [ ] Placed all files in `models` folder
- [ ] Set up local web server
- [ ] Opened site via `http://localhost:8000`
- [ ] Allowed camera permissions
- [ ] Tested face enrollment
- [ ] Models load without errors (check console)

## 📚 Additional Resources

- **face-api.js GitHub:** https://github.com/justadudewhohacks/face-api.js
- **face-api.js Documentation:** https://github.com/justadewhohacks/face-api.js/blob/master/README.md
- **Model Files Location:** https://github.com/justadudewhohacks/face-api.js/tree/master/weights

## 🔐 Security Notes

- Face embeddings are stored as JSON arrays in the database
- No actual images are stored, only numerical face descriptors
- Face verification uses Euclidean distance comparison
- Threshold is set to 0.5 (adjust if needed for your use case)
- Always use HTTPS in production

## ✅ Next Steps

Once face recognition is working:

1. Test face enrollment during registration
2. Test face verification for login
3. Adjust verification threshold if needed
4. Consider adding liveness detection (blink detection)
5. Add fallback authentication methods

---

**Need help?** Check the browser console (F12) for detailed error messages!

