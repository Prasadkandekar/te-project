const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async (to, subject, html, text = '') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"StartupLaunch" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to StartupLaunch!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5FA8D3;">Welcome to StartupLaunch, ${name}!</h2>
        <p>Thank you for joining our community of entrepreneurs and mentors.</p>
        <p>You can now:</p>
        <ul>
          <li>Submit and validate your startup ideas</li>
          <li>Connect with mentors and co-founders</li>
          <li>Access our startup toolkit</li>
        </ul>
        <p>Get started by exploring the platform!</p>
        <p>Best regards,<br>The StartupLaunch Team</p>
      </div>
    `,
  }),

  passwordReset: (name, resetLink) => ({
    subject: 'Reset Your Password - StartupLaunch',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5FA8D3;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #5FA8D3; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The StartupLaunch Team</p>
      </div>
    `,
  }),

  connectionRequest: (requesterName, receiverName, message) => ({
    subject: `New Connection Request from ${requesterName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5FA8D3;">New Connection Request</h2>
        <p>Hi ${receiverName},</p>
        <p><strong>${requesterName}</strong> wants to connect with you on StartupLaunch.</p>
        ${message ? `<p><strong>Message:</strong> "${message}"</p>` : ''}
        <p>Log in to your account to accept or decline this request.</p>
        <p>Best regards,<br>The StartupLaunch Team</p>
      </div>
    `,
  }),
};

module.exports = {
  sendEmail,
  emailTemplates,
};