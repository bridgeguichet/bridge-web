import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@bridge-guichet.com";

/**
 * Send OTP verification email
 */
export async function sendOTPEmail(email: string, otp: string, name?: string): Promise<void> {
  const displayName = name || email.split("@")[0];

  await resend.emails.send({
    from: `Bridge Guichet <${FROM_EMAIL}>`,
    to: email,
    subject: "Votre code de vérification Bridge Guichet",
    html: getOTPEmailTemplate(otp, displayName),
  });
}

/**
 * HTML email template for OTP verification
 */
function getOTPEmailTemplate(otp: string, name: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérification de votre adresse email</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #0f172a;
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .otp-container {
      background-color: #f8fafc;
      border: 2px dashed #e2e8f0;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      font-size: 42px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #0f172a;
      font-family: 'Courier New', monospace;
    }
    .message {
      font-size: 16px;
      color: #64748b;
      margin-bottom: 20px;
    }
    .warning {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin-top: 20px;
      font-size: 14px;
      color: #92400e;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
    .brand {
      font-weight: 700;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bridge Guichet</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${escapeHtml(name)}</strong>,</p>
      <p class="message">Voici votre code de vérification pour finaliser la création de votre compte :</p>
      
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
      </div>
      
      <div class="warning">
        <strong>Important :</strong> Ce code est valable pendant 10 minutes. Ne le partagez avec personne.
      </div>
      
      <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
        Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
      </p>
    </div>
    <div class="footer">
      <p><span class="brand">Bridge Guichet</span> — Le guichet diaspora & expat</p>
      <p>© ${new Date().getFullYear()} Bridge Digital Platform. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = { toString: () => text };
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
