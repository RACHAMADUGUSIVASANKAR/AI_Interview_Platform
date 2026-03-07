const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (toEmail, userName) => {
    try {
        await transporter.sendMail({
            from: `"AI Interview Platform" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Welcome to AI Interview Platform!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #21A4C0, #1a8ba3); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome, ${userName}!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Thank you for creating an account with us.</p>
            <p style="font-size: 14px; color: #666;">You can now access AI-powered interview preparation tools including:</p>
            <ul style="color: #666;">
              <li>AI Mock Interviews (HR, Technical, Behavioral)</li>
              <li>Coding Practice with AI Evaluation</li>
              <li>Resume Analysis</li>
              <li>Performance Tracking</li>
            </ul>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL}/login" style="background: #21A4C0; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Get Started</a>
            </div>
          </div>
        </div>
      `
        });
        console.log('Welcome email sent to:', toEmail);
    } catch (error) {
        console.error('Error sending welcome email:', error.message);
    }
};

const sendResetEmail = async (toEmail, resetToken) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    try {
        await transporter.sendMail({
            from: `"AI Interview Platform" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Password Reset Request',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #21A4C0, #1a8ba3); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">You requested a password reset. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetLink}" style="background: #21A4C0; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Reset Password</a>
            </div>
            <p style="font-size: 13px; color: #999;">This link will expire in 15 minutes. If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `
        });
        console.log('Reset email sent to:', toEmail);
    } catch (error) {
        console.error('Error sending reset email:', error.message);
    }
};

module.exports = { sendWelcomeEmail, sendResetEmail };
