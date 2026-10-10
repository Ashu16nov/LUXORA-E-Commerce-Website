// LUXORA Official Email Dispatcher via Brevo Transactional HTTPS REST API
const sendOtpEmail = async (email, otp, userName = 'Valued Atelier Member') => {
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = (process.env.EMAIL || 'mranonymous16nov@gmail.com').trim();

  if (!brevoApiKey) {
    throw new Error('Brevo API key is missing. Please set BREVO_API_KEY in your .env or Render Dashboard.');
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LUXORA Security Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: 'Playfair Display', 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f19; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #111827; border-radius: 20px; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.35); box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
              
              <!-- HEADER / BRANDING -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #171e2e 0%, #0b0f19 100%); padding: 40px 30px 30px; border-bottom: 2px solid #D4AF37;">
                  <div style="background: rgba(212, 175, 55, 0.12); border: 1px solid #D4AF37; color: #D4AF37; font-size: 10px; font-weight: 700; letter-spacing: 2px; padding: 5px 14px; border-radius: 30px; display: inline-block; text-transform: uppercase; margin-bottom: 12px;">
                    ✨ LUXORA ATELIER
                  </div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 6px; font-weight: 700; font-family: 'Times New Roman', serif;">LUXORA</h1>
                  <p style="color: #9CA3AF; margin: 6px 0 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Haute Couture &amp; Seamless Luxury</p>
                </td>
              </tr>

              <!-- HERO CAPTION & CONTENT -->
              <tr>
                <td style="padding: 40px 40px 30px;">
                  <div style="text-align: center; margin-bottom: 25px;">
                    <h2 style="color: #F3E5AB; font-size: 24px; font-weight: 500; margin: 0 0 10px 0; font-family: 'Times New Roman', serif;">Security Access Code</h2>
                    <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin: 0;">
                      Welcome to the world of exclusive high fashion and curated craftsmanship.
                    </p>
                  </div>

                  <!-- CARD CONTAINER -->
                  <div style="background: rgba(31, 41, 55, 0.6); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 14px; padding: 30px; text-align: center; margin-bottom: 25px;">
                    <p style="color: #E5E7EB; font-size: 15px; margin: 0 0 20px 0; line-height: 1.5;">
                      Dear <strong style="color: #ffffff;">${userName}</strong>,<br/>
                      Use the single-use verification code below to authorize your request:
                    </p>

                    <!-- OTP DISPLAY BOX -->
                    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(197, 160, 89, 0.08) 100%); border: 1.5px solid #D4AF37; border-radius: 12px; padding: 18px 24px; display: inline-block; letter-spacing: 14px; color: #F3E5AB; font-size: 38px; font-weight: 800; font-family: 'Courier New', monospace; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15);">
                      ${otp}
                    </div>

                    <p style="color: #9CA3AF; font-size: 12px; margin: 20px 0 0 0;">
                      ⏱️ Valid for <strong>10 minutes</strong>. Please do not disclose this code to anyone.
                    </p>
                  </div>

                  <p style="color: #6B7280; font-size: 13px; text-align: center; line-height: 1.5; margin: 0;">
                    If you did not request this security code, please ignore this email or contact LUXORA Atelier Concierge Support immediately.
                  </p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #080c14; padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.08);">
                  <p style="color: #D4AF37; font-size: 13px; font-style: italic; margin: 0 0 8px 0;">
                    "Elegance is not standing out, but being remembered."
                  </p>
                  <p style="color: #4B5563; font-size: 11px; margin: 0;">
                    — GIORGIO ARMANI &bull; &copy; 2026 LUXORA House of Fashion &bull; 256-Bit SSL Encrypted Access
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'LUXORA Atelier', email: senderEmail },
        to: [{ email: email.trim().toLowerCase() }],
        subject: `✨ ${otp} is your LUXORA Security Verification Code`,
        htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`[LUXORA BREVO API ERROR] Status ${response.status}:`, data);
      throw new Error(data.message || 'Failed to dispatch email via Brevo API');
    }

    console.log(`[LUXORA BREVO API SUCCESS] Verification OTP sent to ${email} (MessageId: ${data.messageId})`);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error(`[LUXORA EMAIL ERROR] Failed to send email to ${email}:`, error.message);
    throw error;
  }
};

module.exports = sendOtpEmail;
