export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Email Verify</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: #f4f6fa;
      color: #1f2937;
    }
    .container {
      max-width: 520px;
      margin: 40px auto;
      border-radius: 12px;
      background: #fff;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(90deg, #2563eb, #7c3aed);
      padding: 20px;
      text-align: center;
      color: #fff;
      font-size: 22px;
      font-weight: 700;
    }
    .content {
      padding: 30px;
    }
    .content p {
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 15px;
    }
    .otp-box {
      margin: 25px 0;
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #2563eb;
      border: 2px dashed #2563eb;
    }
    .footer {
      padding: 20px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      background: #f9fafb;
    }
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px;
      }
      .otp-box {
        font-size: 24px;
        letter-spacing: 6px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Verify Your Email</div>
    <div class="content">
      <p>Hello,</p>
      <p>You are just one step away from verifying your account with this email: <b>{{email}}</b>.</p>
      <p>Please use the OTP below:</p>
      <div class="otp-box">{{otp}}</div>
      <p>This OTP is valid for <b>24 hours</b>. Do not share it with anyone.</p>
    </div>
    <div class="footer">
      &copy; 2025 YourApp. All rights reserved.
    </div>
  </div>
</body>
</html>
`
export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: #fdf4ff;
      color: #1f2937;
    }
    .container {
      max-width: 520px;
      margin: 40px auto;
      border-radius: 12px;
      background: #fff;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(90deg, #ec4899, #a855f7);
      padding: 20px;
      text-align: center;
      color: #fff;
      font-size: 22px;
      font-weight: 700;
    }
    .content {
      padding: 30px;
    }
    .content p {
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 15px;
    }
    .otp-box {
      margin: 25px 0;
      background: #fff0f6;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #db2777;
      border: 2px dashed #db2777;
    }
    .footer {
      padding: 20px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      background: #f9fafb;
    }
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px;
      }
      .otp-box {
        font-size: 24px;
        letter-spacing: 6px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Password Reset Request</div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset the password for your account: <b>{{email}}</b>.</p>
      <p>Use the OTP below to reset your password:</p>
      <div class="otp-box">{{otp}}</div>
      <p>This OTP is valid for <b>15 minutes</b>. If you did not request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; 2025 YourApp. Security first.
    </div>
  </div>
</body>
</html>
`
