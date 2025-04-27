const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <title>OTP Verification Email</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #333333;
        margin: 0;
        padding: 0;
      }
  
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
      }
  
      .logo {
        max-width: 200px;
        margin-bottom: 20px;
      }
  
      .message {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
  
      .body {
        font-size: 16px;
        margin-bottom: 20px;
      }
  
      .otp-box {
        background-color: #f3f3f3;
        padding: 10px 20px;
        border-radius: 6px;
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
        margin: 20px 0;
      }
  
      .support {
        font-size: 14px;
        color: #999999;
        margin-top: 20px;
      }
  
      .footer {
        font-size: 12px;
        color: #cccccc;
        margin-top: 40px;
      }
  
      .cta {
        display: inline-block;
        padding: 10px 20px;
        background-color: #FFD60A;
        color: #000000;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  
  <body>
    <div class="container">      
        <img class="logo"
          src=""
          alt="JobSphere logo">      
      <div class="message">OTP Verification Email</div>
      <div class="body">
        <p>Dear User,</p>
        <p>Thank you for registering with JobSphere. To complete your registration, please use the following OTP (One-Time Password) to verify your account:</p>
        <div class="otp-box">${otp}</div>
        <p>This OTP is valid for 10 minutes. If you have not request this verification, please disregard this email.</p>
        <p>Once your account is verified, you will have access to our platform and its features.</p>
      </div>
      <div class="support">
        If you have any questions or need assistance, feel free to reach out to us at 
        <a href="mailto:adminatddu@gmail.com">adminatddu@gmail.com</a>. We are here to help!
      </div>
    //   <div class="footer">&copy; ${new Date().getFullYear()} StudyNotion. All rights reserved.</div>
    </div>
  </body>
  
  </html>`;
  };
  
export default otpTemplate 