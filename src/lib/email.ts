import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export function getReviewEmailHtml(
  customerName: string,
  companyName: string,
  reviewUrl: string,
  reminderNumber: number
): string {
  const isFollowUp = reminderNumber > 1;

  return `
<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kan du hjælpe os med en hurtig anmeldelse?</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
          <!-- Header -->
          <tr>
            <td style="background:#1E90FF;padding:32px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:rgba(255,255,255,0.2);border-radius:10px;padding:8px 16px;">
                    <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">
                      🔔 ${companyName}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.6;">
                Hej ${customerName},
              </p>
              ${isFollowUp ? `
              <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.6;">
                Vi ville bare følge op på vores tidligere besked.
              </p>
              ` : ''}
              <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.6;">
                Tak fordi du valgte <strong>${companyName}</strong>. Vi håber, du er tilfreds med din oplevelse!
              </p>
              <p style="margin:0 0 32px;font-size:16px;color:#374151;line-height:1.6;">
                Det ville betyde utroligt meget for os, hvis du ville tage 2 minutter og efterlade en anmeldelse. Det hjælper os med at forbedre vores service og hjælper andre med at træffe en god beslutning.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td align="center" style="background:#1E90FF;border-radius:12px;">
                    <a href="${reviewUrl}"
                       style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;border-radius:12px;">
                      Skriv en anmeldelse →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;">
                Venlig hilsen,<br>
                <strong>${companyName}</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
                Du modtager denne e-mail fordi du har været kunde hos ${companyName}.<br>
                <a href="${reviewUrl}" style="color:#1E90FF;text-decoration:none;">Afmeld fremtidige e-mails</a>
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
}

export async function sendReviewEmail({
  to,
  customerName,
  companyName,
  senderName,
  reviewUrl,
  reminderNumber,
}: {
  to: string;
  customerName: string;
  companyName: string;
  senderName: string;
  reviewUrl: string;
  reminderNumber: number;
}) {
  const subject =
    reminderNumber === 1
      ? `Kan du hjælpe os med en hurtig anmeldelse?`
      : `Påmindelse: Din mening er vigtig for os`;

  const { data, error } = await resend.emails.send({
    from: `${senderName} <onboarding@resend.dev>`,
    to,
    subject,
    html: getReviewEmailHtml(customerName, companyName, reviewUrl, reminderNumber),
  });

  if (error) throw error;
  return data;
}
