const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendPasswordResetEmail(email, resetURL) {
  const mailOptions = {
    from: `"InterviewPal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your InterviewPal Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your InterviewPal password.</p>
        <p>Click the button below to create a new password.</p>
        <a href="${resetURL}"
           style="display: inline-block; padding: 12px 20px;
           background-color: #d20d3d; color: white;
           text-decoration: none; border-radius: 6px;">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail };
