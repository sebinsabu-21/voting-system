// Face Enrollment JavaScript functionality
document.addEventListener('DOMContentLoaded', async function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const skipBtn = document.getElementById('skipBtn');
    const faceStatus = document.getElementById('faceStatus');
    
    // Permission UI elements
    const permissionRequest = document.getElementById('permissionRequest');
    const faceEnrollment = document.getElementById('faceEnrollment');
    const allowBtn = document.getElementById('allowBtn');
    const denyBtn = document.getElementById('denyBtn');

    // Check if user came from password creation
    const username = sessionStorage.getItem('username');
    const phone = sessionStorage.getItem('phone');

    if (!username || !phone) {
        alert('Please complete the registration process first.');
        window.location.href = 'index.html';
        return;
    }

    let stream = null;
    let modelsLoaded = false;
    let cameraPermissionGranted = false;

    // Load face-api.js models
    async function loadModels() {
        try {
            faceStatus.innerHTML = '<p>Loading face recognition models...</p>';
            
            // Load models from /models directory (adjust path as needed)
            // If models are in a different location, update these paths
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models')
            ]);
            
            modelsLoaded = true;
            faceStatus.innerHTML = '<p style="color: #4CAF50;">Models loaded successfully! Position your face in the camera.</p>';
            
            // Start face detection loop if camera is already started
            if (cameraPermissionGranted) {
                detectFace();
            }
        } catch (error) {
            console.error('Error loading models:', error);
            faceStatus.innerHTML = '<p style="color: #f44336;">Error loading models. Please check that model files are in /models directory.</p>';
            
            // Provide fallback message
            alert('Face recognition models not found. Please ensure model files are in the /models directory.\n\nFor now, you can skip face enrollment and complete registration.');
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
                    facingMode: 'user' // Use front-facing camera
                } 
            });
            
            video.srcObject = stream;
            await video.play();
            
            cameraPermissionGranted = true;
            
            // Hide permission request, show face enrollment
            permissionRequest.style.display = 'none';
            faceEnrollment.style.display = 'block';
            
            faceStatus.innerHTML = '<p style="color: #4CAF50;">Camera started. Please position your face in the center.</p>';
            
            // Start face detection if models are loaded
            if (modelsLoaded) {
                detectFace();
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            
            // Show error message
            permissionRequest.innerHTML = `
                <div class="permission-icon" style="color: #f44336;">❌</div>
                <h3>Camera Access Denied</h3>
                <p style="color: #f44336;">Camera access is required for face enrollment.</p>
                <p class="permission-note">To enable camera access:</p>
                <ul style="text-align: left; display: inline-block; margin: 20px 0;">
                    <li>Click the camera icon in your browser's address bar</li>
                    <li>Select "Allow" for camera permissions</li>
                    <li>Refresh this page and try again</li>
                </ul>
                <div class="button-group" style="margin-top: 30px;">
                    <button id="tryAgainBtn" class="btn btn-primary">Try Again</button>
                </div>
                <div class="button-group">
                    <button id="skipFromDenyBtn" class="btn btn-outline">Skip Face Enrollment</button>
                </div>
            `;
            
            // Add event listeners for try again and skip buttons
            document.getElementById('tryAgainBtn').addEventListener('click', function() {
                location.reload();
            });
            
            document.getElementById('skipFromDenyBtn').addEventListener('click', function() {
                skipFaceEnrollment();
            });
        }
    }

    // Detect face continuously
    async function detectFace() {
        if (!modelsLoaded || !video.videoWidth) {
            setTimeout(detectFace, 100);
            return;
        }

        try {
            const detection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                faceStatus.innerHTML = '<p style="color: #4CAF50;">✓ Face detected! Click "Capture Face" when ready.</p>';
                captureBtn.disabled = false;
            } else {
                faceStatus.innerHTML = '<p style="color: #f44336;">No face detected. Please position your face in the camera view.</p>';
                captureBtn.disabled = true;
            }
        } catch (error) {
            console.error('Face detection error:', error);
        }

        // Continue detection loop
        setTimeout(detectFace, 100);
    }

    // Capture face and save to database
    captureBtn.addEventListener('click', async function() {
        try {
            captureBtn.disabled = true;
            faceStatus.innerHTML = '<p>Capturing face data...</p>';

            const detection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                alert('No face detected. Please try again.');
                captureBtn.disabled = false;
                return;
            }

            // Convert face descriptor to array
            const faceEmbedding = Array.from(detection.descriptor);
            
            // Store face embedding in Supabase
            // Note: User should already exist from password registration
            const { data, error } = await supabaseClient
                .from('voters')
                .update({ 
                    face_embedding: faceEmbedding,
                    face_enrolled: true,
                    updated_at: new Date().toISOString()
                })
                .eq('username', username)
                .select();

            if (error) {
                console.error('Error saving face data:', error);
                alert('Error saving face data. Please try again.');
                captureBtn.disabled = false;
                return;
            }

            // Stop camera
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Success message
            alert(`Face Enrollment Successful!\n\nWelcome ${username}!\n\nYour face has been enrolled for secure voting authentication.\n\nRegistration complete!`);
            
            // Clear session storage
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('phone');
            
            // Redirect to main page
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error during face capture:', error);
            alert('Error capturing face. Please try again.');
            captureBtn.disabled = false;
        }
    });

    // Skip face enrollment function
    function skipFaceEnrollment() {
        if (confirm('Are you sure you want to skip face enrollment? You can enroll your face later for enhanced security.')) {
            // Stop camera if it's running
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            
            alert(`Registration Complete!\n\nWelcome ${username}!\n\nYour voter account has been created successfully.\n\nNote: Face enrollment skipped. You can enroll your face later for secure authentication.`);
            
            // Clear session storage
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('phone');
            
            // Redirect to main page
            window.location.href = 'index.html';
        }
    }

    // Skip face enrollment button (in face enrollment section)
    skipBtn.addEventListener('click', skipFaceEnrollment);

    // Allow button - request camera permission
    allowBtn.addEventListener('click', async function() {
        allowBtn.disabled = true;
        allowBtn.textContent = 'Requesting...';
        await startCamera();
    });

    // Deny button - skip face enrollment
    denyBtn.addEventListener('click', function() {
        if (confirm('Camera access is required for face enrollment. Without it, you cannot enroll your face.\n\nDo you want to skip face enrollment?')) {
            skipFaceEnrollment();
        }
    });

    // Initialize - Load models but don't start camera yet
    await loadModels();
    // Camera will start only when user clicks "Allow"
});
