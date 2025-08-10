const emailTemplates = {
  // Password Reset Template
  passwordReset: (userName, resetLink) => ({
    subject: "UpCoder - Password Reset Request",
    text: `Hi ${userName},

You requested a password reset for your UpCoder account.

Click the following link to reset your password:

${resetLink}

This link is valid for 1 hour.

If you didn't request this password reset, please ignore this email and your password will remain unchanged.

Best regards,
Riyaz Ahmad - Owner, UpCoder`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - UpCoder</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                margin: 0; 
                padding: 0; 
                background-color: #f8fafc; 
                line-height: 1.6;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: #ffffff; 
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .header { 
                background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); 
                padding: 40px 20px; 
                text-align: center; 
            }
            .header h1 { 
                color: white; 
                margin: 0; 
                font-size: 28px; 
                font-weight: 600; 
                letter-spacing: -0.025em;
            }
            .header .subtitle {
                color: rgba(255, 255, 255, 0.9);
                margin-top: 8px;
                font-size: 16px;
                font-weight: 400;
            }
            .content { 
                padding: 40px 30px; 
            }
            .welcome-text { 
                font-size: 16px; 
                color: #374151; 
                margin-bottom: 32px; 
                line-height: 1.7; 
            }
            .reset-container { 
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border: 1px solid #f59e0b;
                border-radius: 12px; 
                padding: 32px; 
                text-align: center; 
                margin: 32px 0; 
            }
            .reset-button { 
                display: inline-block; 
                background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); 
                color: white; 
                padding: 16px 32px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0; 
                transition: all 0.2s ease;
                box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.3);
            }
            .reset-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 8px -1px rgba(249, 115, 22, 0.4);
            }
            .expiry-text { 
                color: #6b7280; 
                font-size: 14px; 
                margin-top: 16px; 
                font-weight: 500;
            }
            .footer { 
                background-color: #f9fafb; 
                padding: 32px 30px; 
                text-align: center; 
                border-top: 1px solid #e5e7eb; 
            }
            .footer p { 
                margin: 4px 0; 
                color: #6b7280; 
                font-size: 14px;
            }
            .signature { 
                font-weight: 600; 
                color: #374151; 
                font-size: 16px;
            }
            .warning { 
                background-color: #fef2f2; 
                border: 1px solid #fecaca; 
                border-radius: 8px; 
                padding: 20px; 
                margin: 24px 0; 
                color: #991b1b;
                font-size: 14px;
            }
            .warning strong {
                color: #dc2626;
            }
            .features {
                display: flex;
                justify-content: space-around;
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid #e5e7eb;
            }
            .feature {
                text-align: center;
                color: #6b7280;
                font-size: 12px;
            }
            .feature-icon {
                font-size: 20px;
                margin-bottom: 4px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset</h1>
                <div class="subtitle">Secure your UpCoder account</div>
            </div>
            
            <div class="content">
                <div class="welcome-text">
                    Hi <strong>${userName}</strong>,<br><br>
                    We received a request to reset your password for your UpCoder account. 
                    If this was you, please use the button below to create a new secure password.
                </div>
                
                <div class="reset-container">
                    <h3 style="color: #92400e; margin-bottom: 20px; font-size: 18px; font-weight: 600;">Reset Your Password</h3>
                    <p style="color: #92400e; margin-bottom: 20px; font-size: 15px;">Click the button below to securely reset your password:</p>
                    <a href="${resetLink}" class="reset-button" style="color:#ffffff !important; text-decoration:none !important;">Reset Password</a>
                    <div class="expiry-text">This link expires in 1 hour for your security</div>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, 
                    please ignore this email immediately. Your password will remain unchanged.
                </div>
            </div>
            
            <div class="footer">
                <p>Best regards,</p>
                <p class="signature">Riyaz Ahmad - Owner, UpCoder</p>
                <div class="features">
                    <div class="feature">
                        <div class="feature-icon">🎯</div>
                        <div>Master DSA</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🏆</div>
                        <div>Compete</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">📈</div>
                        <div>Track Progress</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`,
  }),
};

module.exports = emailTemplates;
