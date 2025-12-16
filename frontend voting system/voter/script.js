// Voter Portal JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const generateOtpBtn = document.getElementById('generateOtpBtn');
    const usernameInput = document.getElementById('username');
    const phoneInput = document.getElementById('phone');

    // Generate OTP button functionality
    generateOtpBtn.addEventListener('click', async function() {
        const username = usernameInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!username || !phone) {
            alert('Please enter both username and phone number.');
            return;
        }

        // Basic phone number validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        // Check if user already exists
        try {
            const { data: existingUser, error: checkError } = await supabaseClient
                .from('voters')
                .select('username, phone')
                .or(`username.eq.${username},phone.eq.${phone}`)
                .single();

            if (existingUser && !checkError) {
                alert('Username or phone number already exists. Please use different credentials.');
                return;
            }
        } catch (error) {
            // User doesn't exist, continue with registration
        }

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // Store OTP in Supabase with expiration (5 minutes)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        
        try {
            const { error: otpError } = await supabaseClient
                .from('otp_verifications')
                .insert([
                    {
                        username: username,
                        phone: phone,
                        otp: otp.toString(),
                        expires_at: expiresAt.toISOString(),
                        created_at: new Date().toISOString()
                    }
                ]);

            if (otpError) {
                console.error('Error storing OTP:', otpError);
                alert('Error generating OTP. Please try again.');
                return;
            }

            // Store user data in sessionStorage for the next page
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('phone', phone);
            
            // Navigate to OTP verification page
            window.location.href = 'otp.html';
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating OTP. Please try again.');
        }
    });

    // Add Enter key support for form submission
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateOtpBtn.click();
        }
    });

    // Add visual feedback for button interactions
    generateOtpBtn.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(1px)';
    });
    
    generateOtpBtn.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    generateOtpBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});
