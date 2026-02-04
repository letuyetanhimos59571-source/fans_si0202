document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const captchaDisplay = document.getElementById('captcha-display');
    const captchaInput = document.getElementById('captcha');
    const submitBtn = document.querySelector('.btn-submit');
    let currentCaptcha = '';

    // Generate random 4-digit/char captcha
    function generateCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Refresh captcha
    function refreshCaptcha() {
        currentCaptcha = generateCaptcha();
        if (captchaDisplay) {
            captchaDisplay.textContent = currentCaptcha;
        }
    }

    // Initial load
    refreshCaptcha();

    // Click to refresh
    if (captchaDisplay) {
        captchaDisplay.addEventListener('click', refreshCaptcha);
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate Captcha
            if (captchaInput.value.toUpperCase() !== currentCaptcha) {
                alert('Invalid verification code! Please try again.');
                refreshCaptcha();
                captchaInput.value = '';
                return;
            }

            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!email) {
                alert('Email is required!');
                return;
            }

            // Disable button and show loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        message
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully.');
                    form.reset();
                    refreshCaptcha();
                } else {
                    alert(`Failed to send message: ${result.message || 'Unknown error'}. Please try again later.`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while sending the message. Please check your network and try again.');
            } finally {
                // Restore button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
