// Face Verification JavaScript functionality
document.addEventListener('DOMContentLoaded', async function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const verifyBtn = document.getElementById('verifyBtn');
    const backBtn = document.getElementById('backBtn');
    const faceStatus = document.getElementById('faceStatus');
    
    // UI elements
    const faceVerificationSection = document.getElementById('faceVerificationSection');
    const permissionRequest = document.getElementById('permissionRequest');
    const faceVerifyContent = document.getElementById('faceVerifyContent');
    const allowBtn = document.getElementById('allowBtn');
    const cancelVerifyBtn = document.getElementById('cancelVerifyBtn');

    // Get username from sessionStorage (set during OTP verification)
    const username = sessionStorage.getItem('username');
    const phone = sessionStorage.getItem('phone');

    if (!username || !phone) {
        alert('Please complete the login process first.');
        window.location.href = 'index.html';
        return;
    }

    let stream = null;
    let modelsLoaded = false;
    let storedEmbedding = null;
    let cameraPermissionGranted = false;
    let currentUsername = username;

    // Load face-api.js models
    async function loadModels() {
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models')
            ]);
            
            modelsLoaded = true;
        } catch (error) {
            console.error('Error loading models:', error);
            alert('Error loading face recognition models. Please check that model files are in /models directory.');
        }
    }

    // Start camera (called when user clicks Allow)
    async function startCamera() {
        try {
            faceStatus.innerHTML = '<p>Requesting camera access...</p>';
            
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 400, 
                    height: 300,
                    facingMode: 'user'
                } 
            });
            
            video.srcObject = stream;
            await video.play();
            
            cameraPermissionGranted = true;
            
            // Hide permission request, show verification content
            permissionRequest.style.display = 'none';
            faceVerifyContent.style.display = 'block';
            
            faceStatus.innerHTML = '<p style="color: #4CAF50;">Camera started. Position your face and click "Verify Face".</p>';
            verifyBtn.disabled = false;
            
            // Start face detection
            if (modelsLoaded) {
                detectFace();
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            
            // Show error in permission request
            permissionRequest.innerHTML = `
                <div class="permission-icon" style="color: #f44336;">❌</div>
                <h3>Camera Access Denied</h3>
                <p style="color: #f44336;">Camera access is required for face verification.</p>
                <p class="permission-note">To enable camera access:</p>
                <ul style="text-align: left; display: inline-block; margin: 20px 0;">
                    <li>Click the camera icon in your browser's address bar</li>
                    <li>Select "Allow" for camera permissions</li>
                    <li>Click "Try Again" below</li>
                </ul>
                <div class="button-group" style="margin-top: 30px;">
                    <button id="tryAgainBtn" class="btn btn-primary">Try Again</button>
                </div>
                <div class="button-group">
                    <button id="cancelVerifyBtn2" class="btn btn-outline">Cancel</button>
                </div>
            `;
            
            // Add event listeners for try again and cancel buttons
            document.getElementById('tryAgainBtn').addEventListener('click', startCamera);
            document.getElementById('cancelVerifyBtn2').addEventListener('click', function() {
                faceVerificationSection.style.display = 'none';
                verifyUsernameInput.value = '';
            });
        }
    }

    // Detect face continuously (for visual feedback)
    async function detectFace() {
        if (!modelsLoaded || !video.videoWidth || !verifyBtn.disabled === false) {
            setTimeout(detectFace, 100);
            return;
        }

        try {
            const detection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                faceStatus.innerHTML = '<p style="color: #4CAF50;">✓ Face detected. Click "Verify Face" when ready.</p>';
            } else {
                faceStatus.innerHTML = '<p style="color: #f44336;">No face detected. Please position your face in the camera view.</p>';
            }
        } catch (error) {
            console.error('Face detection error:', error);
        }

        setTimeout(detectFace, 100);
    }

    // Load stored face embedding from database
    async function loadStoredFace(username) {
        try {
            const { data, error } = await supabaseClient
                .from('voters')
                .select('face_embedding, face_enrolled')
                .eq('username', username)
                .single();

            if (error || !data) {
                return { error: 'User not found or face not enrolled' };
            }

            if (!data.face_enrolled || !data.face_embedding) {
                return { error: 'Face not enrolled for this user' };
            }

            return { embedding: data.face_embedding };
        } catch (error) {
            console.error('Error loading face data:', error);
            return { error: 'Error loading face data' };
        }
    }

    // Calculate Euclidean distance between two face embeddings
    function calculateDistance(embedding1, embedding2) {
        let sum = 0;
        for (let i = 0; i < embedding1.length; i++) {
            sum += Math.pow(embedding1[i] - embedding2[i], 2);
        }
        return Math.sqrt(sum);
    }

    // Update welcome message with username
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.innerHTML = `Welcome back, <strong>${username}</strong>!<br>Please position your face in the center of the camera view for verification.`;
    }

    // Verify face
    verifyBtn.addEventListener('click', async function() {
        if (!currentUsername) {
            alert('Please enter your username first.');
            return;
        }

        try {
            verifyBtn.disabled = true;
            faceStatus.innerHTML = '<p>Verifying face...</p>';

            // Load stored face embedding
            const storedData = await loadStoredFace(currentUsername);
            if (storedData.error) {
                alert(storedData.error + '\n\nPlease use OTP login instead.');
                verifyBtn.disabled = false;
                return;
            }

            // Detect face from video
            const detection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                alert('No face detected. Please try again.');
                verifyBtn.disabled = false;
                return;
            }

            // Get current face embedding
            const currentEmbedding = Array.from(detection.descriptor);
            const storedEmbedding = storedData.embedding;

            // Calculate distance (lower = more similar)
            const distance = calculateDistance(currentEmbedding, storedEmbedding);
            
            // Threshold for face match (adjust as needed, typically 0.4-0.6)
            const threshold = 0.5;

            // Stop camera
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            if (distance < threshold) {
                // Face verified!
                alert(`Face Verified Successfully!\n\nWelcome back, ${currentUsername}!\n\nYou have been authenticated successfully.`);
                
                // Here you would typically redirect to dashboard or voting page
                // window.location.href = 'dashboard.html';
                
                // For now, redirect to main page
                window.location.href = 'index.html';
            } else {
                // Face verification failed
                alert(`Face verification failed.\n\nDistance: ${distance.toFixed(3)} (threshold: ${threshold})\n\nPlease try again or use OTP login.`);
                verifyBtn.disabled = false;
                
                // Restart camera if it was stopped
                if (stream) {
                    await video.play();
                    detectFace();
                }
            }
        } catch (error) {
            console.error('Error during face verification:', error);
            alert('Error verifying face. Please try again.');
            verifyBtn.disabled = false;
        }
    });

    // Back button
    backBtn.addEventListener('click', function() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        window.location.href = 'index.html';
    });

    // Allow button - request camera permission
    allowBtn.addEventListener('click', async function() {
        allowBtn.disabled = true;
        allowBtn.textContent = 'Requesting...';
        await startCamera();
    });

    // Cancel button - go back to login
    cancelVerifyBtn.addEventListener('click', function() {
        if (confirm('Cancel face verification and return to login?')) {
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('phone');
            window.location.href = 'index.html';
        }
    });

    // Initialize models
    await loadModels();
    
    // Show permission request automatically (user already logged in via OTP)
    // Permission request is shown by default in HTML
});
