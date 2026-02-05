export function generateOTPEmailHTML( otp: string, expiryInMinutes: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your One-Time Password (OTP)</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 40px;
        text-align: center;
      }
      h1 {
        color: #2563eb;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      .otp-box {
        display: inline-block;
        margin-top: 20px;
        padding: 16px 32px;
        background-color: #2563eb;
        color: #ffffff;
        font-size: 24px;
        letter-spacing: 4px;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 14px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Your OTP Code</h1>
      <p>Hi there!</p>
      <p>
        Use the following One-Time Password (OTP) to continue with your action. 
        This code is valid for <strong>${expiryInMinutes} minute(s)</strong>.
      </p>
      <div class="otp-box">${otp}</div>
      <p style="margin-top: 30px;">
        If you did not request this OTP, please ignore this email. Your account remains secure.
      </p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ${process.env.APP_NAME} · All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

export function generateOTPForForgotPassword( otp: string, expiryInMinutes: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your One-Time Password (OTP)</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 40px;
        text-align: center;
      }
      h1 {
        color: #2563eb;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      .otp-box {
        display: inline-block;
        margin-top: 20px;
        padding: 16px 32px;
        background-color: #2563eb;
        color: #ffffff;
        font-size: 24px;
        letter-spacing: 4px;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 14px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Your OTP Code</h1>
      <p>Seems you forgot your password.We've got you, don't worry :) </p>
      <p>
        Use the following One-Time Password (OTP) to continue with your action. 
        This code is valid for <strong>${expiryInMinutes} minute(s)</strong>.
      </p>
      <div class="otp-box">${otp}</div>
      <p style="margin-top: 30px;">
        If you did not request this OTP, please ignore this email. Your account remains secure.
      </p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ${process.env.APP_NAME} · All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}


export const adminPasswordTemplate =(ADMIN_PASSWORD:string) =>{
 return ` <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Access Credentials</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 10px;">
          <table width="100%" max-width="600px" style="background: #ffffff; border-radius: 8px; padding: 30px;">
            <tr>
              <td style="text-align: left;">
                <h2 style="color: #1f2937; margin-bottom: 10px;">
                  Admin Account Access
                </h2>

                <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                  Hello,
                </p>

                <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                  Your admin account has been successfully verified. Below is your
                  temporary password, which you can use to sign in.
                </p>

                <div
                  style="
                    margin: 25px 0;
                    padding: 15px;
                    background: #f9fafb;
                    border: 1px dashed #d1d5db;
                    border-radius: 6px;
                    text-align: center;
                  "
                >
                  <p style="margin: 0; color: #6b7280; font-size: 13px;">
                    Your Admin Password
                  </p>
                  <p
                    style="
                      margin: 8px 0 0;
                      font-size: 22px;
                      font-weight: bold;
                      letter-spacing: 2px;
                      color: #111827;
                    "
                  >
                    ${ADMIN_PASSWORD}
                  </p>
                </div>

                <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                  Use this password together with your email address to log in.
                  For security reasons, we strongly recommend that you change
                  this password after signing in.
                </p>

                <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                  You can change your password at any time from your account
                  settings.
                </p>

                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                  If you did not request this access or believe this email was
                  sent in error, please contact support immediately.
                </p>

                <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
                  Regards,<br />
                  <strong>The Admin Team</strong>
                </p>
              </td>
            </tr>
          </table>

          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}