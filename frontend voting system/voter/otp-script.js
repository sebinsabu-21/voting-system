// OTP Verification JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const submitBtn = document.getElementById('submitBtn');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const otpInput = document.getElementById('otp');

    // Check if user came from the main page
    const username = sessionStorage.getItem('username');
    const phone = sessionStorage.getItem('phone');

    if (!username || !phone) {
        alert('Please generate an OTP first.');
        window.location.href = 'index.html';
        return;
    }

    // Display user info
    const otpInfo = document.querySelector('.otp-info');
    if (otpInfo) {
        otpInfo.innerHTML = `<p>Please enter the 6-digit OTP sent to <strong>${phone}</strong>.</p>`;
    }

    // Verify OTP button functionality
    verifyOtpBtn.addEventListener('click', async function() {
        const enteredOtp = otpInput.value.trim();

        if (!enteredOtp) {
            alert('Please enter the OTP.');
            return;
        }

        if (enteredOtp.length !== 6) {
            alert('Please enter a valid 6-digit OTP.');
            return;
        }

        // Verify OTP from Supabase
        try {
            const { data: otpData, error: otpError } = await supabaseClient
                .from('otp_verifications')
                .select('*')
                .eq('username', username)
                .eq('phone', phone)
                .eq('otp', enteredOtp)
                .gte('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (otpError || !otpData) {
                alert('Invalid or expired OTP. Please try again.');
                otpInput.value = '';
                otpInput.focus();
                return;
            }

            // OTP verified successfully - no alert, will redirect to next step
            
            // Delete the used OTP
            await supabaseClient
                .from('otp_verifications')
                .delete()
                .eq('id', otpData.id);

            // Check if user exists (login) or is new (registration)
            const { data: userData, error: userError } = await supabaseClient
                .from('voters')
                .select('password_hash, face_enrolled')
                .eq('username', username)
                .single();

            if (userError || !userData || !userData.password_hash) {
                // New user - Registration flow: go to password creation
                window.location.href = 'password.html';
            } else {
                // Existing user - Login flow
                if (userData.face_enrolled) {
                    // Face enrolled - go to face verification
                    window.location.href = 'face-verify.html';
                } else {
                    // Face not enrolled - login successful, redirect to main page
                    alert(`Login Successful!\n\nWelcome back, ${username}!\n\nNote: Face verification skipped (not enrolled).`);
                    sessionStorage.removeItem('username');
                    sessionStorage.removeItem('phone');
                    window.location.href = 'index.html';
                }
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
        }
    });

    // Submit button functionality
    submitBtn.addEventListener('click', async function() {
        const enteredOtp = otpInput.value.trim();

        if (!enteredOtp) {
            alert('Please enter the OTP before submitting.');
            return;
        }

        if (enteredOtp.length !== 6) {
            alert('Please enter a valid 6-digit OTP.');
            return;
        }

        // Verify OTP from Supabase
        try {
            const { data: otpData, error: otpError } = await supabaseClient
                .from('otp_verifications')
                .select('*')
                .eq('username', username)
                .eq('phone', phone)
                .eq('otp', enteredOtp)
                .gte('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (otpError || !otpData) {
                alert('Invalid or expired OTP. Please verify the OTP and try again.');
                otpInput.value = '';
                otpInput.focus();
                return;
            }

            // Delete the used OTP
            await supabaseClient
                .from('otp_verifications')
                .delete()
                .eq('id', otpData.id);

            // Check if user exists (login) or is new (registration)
            const { data: userData, error: userError } = await supabaseClient
                .from('voters')
                .select('password_hash, face_enrolled')
                .eq('username', username)
                .single();

            if (userError || !userData || !userData.password_hash) {
                // New user - Registration flow: go to password creation
                window.location.href = 'password.html';
            } else {
                // Existing user - Login flow
                if (userData.face_enrolled) {
                    // Face enrolled - go to face verification
                    window.location.href = 'face-verify.html';
                } else {
                    // Face not enrolled - login successful, redirect to main page
                    alert(`Login Successful!\n\nWelcome back, ${username}!\n\nNote: Face verification skipped (not enrolled).`);
                    sessionStorage.removeItem('username');
                    sessionStorage.removeItem('phone');
                    window.location.href = 'index.html';
                }
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
        }
    });

    // Resend OTP button functionality
    resendOtpBtn.addEventListener('click', async function() {
        // Generate a new OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000);
        
        // Store new OTP in Supabase with expiration (5 minutes)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        
        try {
            const { error: otpError } = await supabaseClient
                .from('otp_verifications')
                .insert([
                    {
                        username: username,
                        phone: phone,
                        otp: newOtp.toString(),
                        expires_at: expiresAt.toISOString(),
                        created_at: new Date().toISOString()
                    }
                ]);

            if (otpError) {
                console.error('Error storing OTP:', otpError);
                alert('Error generating new OTP. Please try again.');
                return;
            }

            alert(`New OTP Generated!\n\nYour new OTP is: ${newOtp}\n\nThis OTP has been sent to ${phone}\n\nNote: In a real application, this OTP would be sent via SMS.`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating new OTP. Please try again.');
        }
    });


    // Add Enter key support for form submission
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyOtpBtn.click();
        }
    });

    // Auto-focus on OTP input
    otpInput.focus();

    // Add visual feedback for button interactions
    [verifyOtpBtn, submitBtn, resendOtpBtn].forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Only allow numeric input for OTP
    otpInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});
