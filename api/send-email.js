const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Configure Nodemailer transporter
    // Note: In a real production environment, you should use environment variables for sensitive data.
    // For this example, we'll use a standard SMTP configuration. 
    // Ideally, the user should provide their SMTP credentials or use a service like SendGrid/Resend.
    // Since the user is using QQ mail (1753720535@qq.com), they likely want to RECEIVE mail there.
    // To SEND mail, we need a sender account. 
    // We will assume the user has configured environment variables or we'll use a placeholder structure 
    // that informs the user to set up SMTP.
    
    // HOWEVER, for a static site deployed on Vercel without a dedicated backend, 
    // we usually use a third-party service like Formspree or EmailJS which is client-side 
    // OR we use Vercel Functions with a configured SMTP sender.
    
    // Since the user asked for "Directly send to mailbox", a Vercel Function + Nodemailer is the "Backend" way.
    // We need a SENDER email. We cannot send FROM the user's email directly (spoofing).
    // We send FROM our system TO the user's QQ.
    
    // IMPORTANT: Without real SMTP credentials (host, user, pass), this code WILL NOT WORK.
    // I will write the code to assume environment variables are present, 
    // and instruct the user to configure them in Vercel project settings.

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com', // Default placeholder
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER, // Sender address
            to: '1753720535@qq.com', // User's receiving address
            subject: `New Inquiry from ${firstName} ${lastName}`,
            text: `
                Name: ${firstName} ${lastName}
                Email: ${email}
                
                Message:
                ${message}
            `,
            html: `
                <h3>New Inquiry Received</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};
