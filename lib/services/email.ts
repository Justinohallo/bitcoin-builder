/**
 * Email Service
 * Handles sending emails via Resend
 */

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.NEWSLETTER_FROM_EMAIL || "newsletter@builder.van";
const FROM_NAME = process.env.NEWSLETTER_FROM_NAME || "Builder Vancouver";

/**
 * Send welcome email to new subscribers
 */
export async function sendWelcomeEmail(
  email: string,
  unsubscribeToken: string
): Promise<void> {
  if (!resend) {
    console.warn(
      "Resend API key not configured. Skipping welcome email to",
      email
    );
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://builder.van";
  const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  try {
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [email],
      subject: "Welcome to Builder Vancouver Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 20px; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; background: #171717; border: 1px solid #404040; border-radius: 12px; padding: 40px;">
              <h1 style="color: #fb923c; margin-top: 0;">Welcome to Builder Vancouver!</h1>
              <p style="color: #a3a3a3;">Thank you for subscribing to our newsletter. You'll now receive updates about:</p>
              <ul style="color: #a3a3a3;">
                <li>Upcoming meetups and workshops</li>
                <li>Event recaps and highlights</li>
                <li>New educational content</li>
                <li>Community announcements</li>
              </ul>
              <p style="color: #a3a3a3;">We're excited to have you as part of our Bitcoin builder community!</p>
              <hr style="border: none; border-top: 1px solid #404040; margin: 30px 0;">
              <p style="color: #737373; font-size: 12px;">
                <a href="${unsubscribeUrl}" style="color: #737373;">Unsubscribe</a> | 
                <a href="${siteUrl}" style="color: #737373;">Visit Builder Vancouver</a>
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome to Builder Vancouver!

Thank you for subscribing to our newsletter. You'll now receive updates about:
- Upcoming meetups and workshops
- Event recaps and highlights
- New educational content
- Community announcements

We're excited to have you as part of our Bitcoin builder community!

Unsubscribe: ${unsubscribeUrl}
Visit: ${siteUrl}
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't throw - email sending failure shouldn't break subscription
  }
}

/**
 * Send newsletter to all active subscribers
 */
export async function sendNewsletter(
  subject: string,
  htmlContent: string,
  textContent: string,
  subscriberEmails: string[]
): Promise<{ success: number; failed: number }> {
  if (!resend) {
    console.warn("Resend API key not configured. Cannot send newsletter.");
    return { success: 0, failed: subscriberEmails.length };
  }

  let success = 0;
  let failed = 0;

  // Resend supports batch sending, but we'll send individually to track failures
  // For production, consider using Resend's batch API
  for (const email of subscriberEmails) {
    try {
      await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [email],
        subject,
        html: htmlContent,
        text: textContent,
      });
      success++;
    } catch (error) {
      console.error(`Failed to send newsletter to ${email}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Check if email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return resend !== null;
}
