# Face Recognition Integration Guide

## 🎯 Overview

Face recognition has been integrated into your voter portal for secure authentication. This document explains how it works and how to use it.

## 🔄 Complete Registration Flow (with Face Recognition)

1. **Main Page** (`index.html`)
   - User enters username and phone number
   - Clicks "Generate OTP"
   - OTP is generated and stored in database

2. **OTP Verification** (`otp.html`)
   - User enters 6-digit OTP
   - OTP is verified against database
   - On success, redirects to password page

3. **Password Creation** (`password.html`)
   - User creates password meeting requirements
   - Password is hashed and stored in database
   - User account is created
   - Redirects to face enrollment

4. **Face Enrollment** (`face-enroll.html`) ⭐ NEW
   - Camera accesses user's webcam
   - User positions face in camera view
   - Face is detected and converted to embedding
   - Face embedding is stored in database
   - Registration complete!

## 🔐 Face Verification Flow

1. **Face Verification Page** (`face-verify.html`)
   - User enters username
   - Camera accesses webcam
   - User positions face in camera view
   - Face is detected and converted to embedding
   - Embedding is compared with stored embedding
   - If match → User authenticated
   - If no match → Use OTP login instead

## 📊 How Face Recognition Works

### Face Embedding

Instead of storing photos, the system:
1. Captures face from webcam
2. Detects facial features (eyes, nose, mouth, etc.)
3. Converts face to a **128-dimensional vector** (array of numbers)
4. Stores this "face code" in the database

**Example face embedding:**
```
[0.123, -0.456, 0.789, ..., 128 numbers total]
```

### Face Matching

When verifying:
1. New face is captured and converted to embedding
2. System calculates distance between new and stored embedding
3. If distance < threshold (0.5) → Match
4. If distance >= threshold → No match

**This is secure because:**
- No actual photos are stored
- Only mathematical face descriptors
- Cannot reconstruct original face from embedding
- Encrypted in database

## 📁 New Files Added

### HTML Files
- `face-enroll.html` - Face enrollment page
- `face-verify.html` - Face verification page

### JavaScript Files
- `face-enroll.js` - Face enrollment logic
- `face-verify.js` - Face verification logic

### Database Schema
- Updated `voters` table with:
  - `face_embedding` (JSONB) - Stores face descriptor
  - `face_enrolled` (BOOLEAN) - Whether face is enrolled

## 🗄️ Database Schema Updates

The voters table now includes:

```sql
face_embedding JSONB        -- Stores the 128-dimensional face vector
face_enrolled BOOLEAN       -- True if face is enrolled
```

## 🔧 Configuration

### Face Verification Threshold

In `face-verify.js`, you can adjust the matching threshold:

```javascript
const threshold = 0.5;  // Lower = stricter, Higher = more lenient
```

- **0.3-0.4**: Very strict (fewer false positives, more false negatives)
- **0.5**: Balanced (recommended)
- **0.6-0.7**: Lenient (more false positives, fewer false negatives)

### Model Files Path

Models are loaded from `/models` directory. If you change the location, update:

```javascript
// In face-enroll.js and face-verify.js
await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
```

## 🎨 User Experience

### Face Enrollment
- User sees live webcam feed
- Real-time face detection feedback
- "Face detected" indicator
- Can skip enrollment if desired
- Clear instructions

### Face Verification
- Simple username + face scan
- Visual feedback during detection
- Clear success/failure messages
- Fallback to OTP login available

## 🛡️ Security Features

1. **No Image Storage**
   - Only mathematical face descriptors stored
   - Cannot reconstruct original face

2. **Encryption**
   - Face embeddings stored securely in database
   - Password-protected database access

3. **HTTPS Required**
   - Camera only works on HTTPS or localhost
   - Prevents man-in-the-middle attacks

4. **Consent**
   - User must explicitly allow camera access
   - Can skip face enrollment
   - Clear privacy messaging

5. **Fallback Authentication**
   - OTP login still available
   - Multiple authentication methods

## 🧪 Testing Face Recognition

### Test Enrollment
1. Complete registration flow
2. On face enrollment page:
   - Allow camera permissions
   - Position face in view
   - Wait for "Face detected"
   - Click "Capture Face"
3. Verify in database:
   - Check `voters` table
   - `face_enrolled` should be `true`
   - `face_embedding` should contain array

### Test Verification
1. Go to Face Verification page
2. Enter enrolled username
3. Allow camera permissions
4. Position face in view
5. Click "Verify Face"
6. Should authenticate successfully

### Test with Different Person
1. Use same username
2. Position different person's face
3. Should fail verification
4. Shows "Face verification failed"

## 🐛 Common Issues

### Camera Not Working
- **Solution:** Check browser permissions, use HTTPS/localhost

### Models Not Loading
- **Solution:** Verify models folder exists and contains all files
- See `FACE_API_SETUP.md` for details

### Face Not Detected
- **Solution:** Check lighting, position face directly, remove glasses

### Verification Always Fails
- **Solution:** Adjust threshold, ensure good lighting during enrollment and verification

## 📚 Technical Details

### face-api.js Models Used

1. **Tiny Face Detector**
   - Fast face detection
   - Good performance on web

2. **Face Landmark 68**
   - Detects 68 facial landmarks
   - Used for face alignment

3. **Face Recognition Net**
   - Creates face embeddings
   - 128-dimensional vectors

### Distance Calculation

Uses Euclidean distance:
```
distance = √[(a₁-b₁)² + (a₂-b₂)² + ... + (a₁₂₈-b₁₂₈)²]
```

Where:
- `a` = new face embedding
- `b` = stored face embedding

## 🔮 Future Enhancements

Possible improvements:
- [ ] Liveness detection (blink detection)
- [ ] Multiple face enrollment (different angles)
- [ ] Face update/retraining option
- [ ] Age/gender detection
- [ ] Mask detection
- [ ] Better error messages
- [ ] Progress indicators

## 📖 Additional Resources

- **face-api.js Docs:** https://github.com/justadudewhohacks/face-api.js
- **Setup Guide:** See `FACE_API_SETUP.md`
- **Supabase Setup:** See `SETUP_GUIDE.md`

---

**Need help?** Check browser console (F12) for detailed error messages!

