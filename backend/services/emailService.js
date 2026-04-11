const https = require('https');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER = {
  name: process.env.EMAIL_FROM_NAME || 'Flora',
  email: process.env.EMAIL_FROM_ADDRESS || 'floraladdaofficial@gmail.com'
};

function sendBrevoEmail(to, subject, htmlContent) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      sender: SENDER,
      to: [to],
      subject,
      htmlContent
    });

    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Brevo API error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function sendVerificationEmail(toEmail, toName, otp) {
  await sendBrevoEmail(
    { email: toEmail, name: toName },
    'Your Flora verification code',
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #fbbf24; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #000;">Flora</h1>
      </div>
      <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
        <h2 style="font-size: 22px; font-weight: 800; color: #111; margin-bottom: 8px;">Welcome, ${toName}!</h2>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
          Use the OTP below to verify your email and activate your Flora account.
        </p>
        <div style="background: #f9fafb; border: 2px dashed #fbbf24; border-radius: 12px; padding: 24px; margin-bottom: 28px; display: inline-block; min-width: 200px;">
          <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; color: #9ca3af; letter-spacing: 2px; text-transform: uppercase;">Your OTP</p>
          <p style="margin: 0; font-size: 42px; font-weight: 900; color: #111; letter-spacing: 10px;">${otp}</p>
        </div>
        <p style="color: #9ca3af; font-size: 13px; margin: 0;">
          This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.
        </p>
      </div>
    </div>
    `
  );
}

async function sendPasswordResetEmail(toEmail, toName, otp) {
  await sendBrevoEmail(
    { email: toEmail, name: toName },
    'Your Flora password reset OTP',
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #fbbf24; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #000;">Flora</h1>
      </div>
      <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
        <h2 style="font-size: 22px; font-weight: 800; color: #111; margin-bottom: 8px;">Password Reset</h2>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
          Hi ${toName}, use the OTP below to reset your Flora account password.
        </p>
        <div style="background: #f9fafb; border: 2px dashed #111; border-radius: 12px; padding: 24px; margin-bottom: 28px; display: inline-block; min-width: 200px;">
          <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; color: #9ca3af; letter-spacing: 2px; text-transform: uppercase;">Your OTP</p>
          <p style="margin: 0; font-size: 42px; font-weight: 900; color: #111; letter-spacing: 10px;">${otp}</p>
        </div>
        <p style="color: #9ca3af; font-size: 13px; margin: 0;">
          This OTP expires in <strong>10 minutes</strong>. If you didn't request this, ignore the email.
        </p>
      </div>
    </div>
    `
  );
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
