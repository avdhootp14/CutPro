export const getResetPasswordTemplate = (resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f7f6;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    .header {
      background-color: #1a1a1a;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      color: #1a1a1a;
      margin-top: 0;
    }
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    .button {
      background-color: #6366f1;
      color: #ffffff;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      display: inline-block;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #4f46e5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      color: #64748b;
      font-size: 13px;
      border-top: 1px solid #e2e8f0;
    }
    .url-text {
      font-size: 12px;
      color: #94a3b8;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>CutPro</h1>
    </div>
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your CutPro account. If you made this request, please click the button below to choose a new password:</p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="button" style="color: #ffffff;">Reset Password</a>
      </div>
      
      <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="margin-bottom: 5px;">If the button above doesn't work, copy and paste the following link into your browser:</p>
      <p class="url-text">${resetUrl}</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} CutPro. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

export const getVerificationTemplate = (verificationUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f7f6;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    .header {
      background-color: #1a1a1a;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      color: #1a1a1a;
      margin-top: 0;
    }
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    .button {
      background-color: #10b981;
      color: #ffffff;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      display: inline-block;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #059669;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      color: #64748b;
      font-size: 13px;
      border-top: 1px solid #e2e8f0;
    }
    .url-text {
      font-size: 12px;
      color: #94a3b8;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>CutPro</h1>
    </div>
    <div class="content">
      <h2>Welcome to CutPro!</h2>
      <p>Hello,</p>
      <p>Thank you for registering with CutPro. To complete your setup and ensure the security of your account, please verify your email address by clicking the button below:</p>
      
      <div class="button-container">
        <a href="${verificationUrl}" class="button" style="color: #ffffff;">Verify Email Address</a>
      </div>
      
      <p>If you did not create an account using this email address, please ignore this email.</p>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="margin-bottom: 5px;">If the button above doesn't work, copy and paste the following link into your browser:</p>
      <p class="url-text">${verificationUrl}</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} CutPro. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;
