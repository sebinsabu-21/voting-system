// Password Creation JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerBtn = document.getElementById('registerBtn');

    // Check if user came from OTP verification
    const username = sessionStorage.getItem('username');
    const phone = sessionStorage.getItem('phone');

    if (!username || !phone) {
        alert('Please complete the OTP verification first.');
        window.location.href = 'index.html';
        return;
    }

    // Password validation function
    function validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password)
        };
        return requirements;
    }

    // Update requirement indicators
    function updateRequirements(password) {
        const requirements = validatePassword(password);
        
        document.getElementById('length-req').style.color = requirements.length ? '#4CAF50' : '#f44336';
        document.getElementById('uppercase-req').style.color = requirements.uppercase ? '#4CAF50' : '#f44336';
        document.getElementById('lowercase-req').style.color = requirements.lowercase ? '#4CAF50' : '#f44336';
        document.getElementById('number-req').style.color = requirements.number ? '#4CAF50' : '#f44336';
    }

    // Check if passwords match and all requirements are met
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const requirements = validatePassword(password);
        
        const allRequirementsMet = Object.values(requirements).every(req => req);
        const passwordsMatch = password === confirmPassword && password.length > 0;
        
        if (allRequirementsMet && passwordsMatch) {
            registerBtn.disabled = false;
            registerBtn.style.opacity = '1';
        } else {
            registerBtn.disabled = true;
            registerBtn.style.opacity = '0.6';
        }
    }

    // Password input event listeners
    passwordInput.addEventListener('input', function() {
        updateRequirements(this.value);
        checkPasswordMatch();
    });

    confirmPasswordInput.addEventListener('input', function() {
        checkPasswordMatch();
    });

    // Hash password function (simple hash - in production, use stronger hashing)
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Register button functionality
    registerBtn.addEventListener('click', async function() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        const requirements = validatePassword(password);
        const allRequirementsMet = Object.values(requirements).every(req => req);

        if (!allRequirementsMet) {
            alert('Password does not meet all requirements. Please check the requirements list.');
            return;
        }

        // Hash the password
        try {
            const hashedPassword = await hashPassword(password);
            
            // Register user in Supabase
            const { data, error } = await supabaseClient
                .from('voters')
                .insert([
                    {
                        username: username,
                        phone: phone,
                        password_hash: hashedPassword,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                console.error('Registration error:', error);
                if (error.code === '23505') { // Unique constraint violation
                    alert('Username or phone number already exists. Please use different credentials.');
                } else {
                    alert('Registration failed. Please try again.');
                }
                return;
            }

            // Registration successful - redirect to face enrollment
            alert(`Password Created Successfully!\n\nNow let's enroll your face for secure authentication.`);
            
            // Redirect to face enrollment page (keep session data for face enrollment)
            window.location.href = 'face-enroll.html';
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Error during registration. Please try again.');
        }
    });

    // Add Enter key support for form submission
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !registerBtn.disabled) {
            registerBtn.click();
        }
    });

    // Add visual feedback for button interactions
    registerBtn.addEventListener('mousedown', function() {
        if (!this.disabled) {
            this.style.transform = 'translateY(1px)';
        }
    });
    
    registerBtn.addEventListener('mouseup', function() {
        if (!this.disabled) {
            this.style.transform = 'translateY(-2px)';
        }
    });
    
    registerBtn.addEventListener('mouseleave', function() {
        if (!this.disabled) {
            this.style.transform = 'translateY(0)';
        }
    });

    // Auto-focus on password input
    passwordInput.focus();
});

