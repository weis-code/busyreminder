import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Locale = "en" | "da" | "sv" | "no";

const emailTranslations: Record<Locale, {
  subject_first: string;
  subject_followup: string;
  greeting: string;
  followup_intro: string;
  body: string;
  body2: string;
  cta: string;
  closing: string;
  footer: string;
  unsubscribe: string;
  lang: string;
}> = {
  en: {
    subject_first: "Can you help us with a quick review?",
    subject_followup: "Reminder: Your opinion matters to us",
    greeting: "Hi {name},",
    followup_intro: "We wanted to follow up on our previous message.",
    body: "Thank you for choosing {company}. We hope you're satisfied with your experience!",
    body2: "It would mean a lot to us if you could take 2 minutes to leave a review. It helps us improve and helps others make a great decision.",
    cta: "Write a review →",
    closing: "Best regards,",
    footer: "You're receiving this email because you've been a customer of {company}.",
    unsubscribe: "Unsubscribe from future emails",
    lang: "en",
  },
  da: {
    subject_first: "Kan du hjælpe os med en hurtig anmeldelse?",
    subject_followup: "Påmindelse: Din mening er vigtig for os",
    greeting: "Hej {name},",
    followup_intro: "Vi ville bare følge op på vores tidligere besked.",
    body: "Tak fordi du valgte {company}. Vi håber, du er tilfreds med din oplevelse!",
    body2: "Det ville betyde utroligt meget for os, hvis du ville tage 2 minutter og efterlade en anmeldelse. Det hjælper os med at forbedre vores service og hjælper andre med at træffe en god beslutning.",
    cta: "Skriv en anmeldelse →",
    closing: "Venlig hilsen,",
    footer: "Du modtager denne e-mail fordi du har været kunde hos {company}.",
    unsubscribe: "Afmeld fremtidige e-mails",
    lang: "da",
  },
  sv: {
    subject_first: "Kan du hjälpa oss med en snabb recension?",
    subject_followup: "Påminnelse: Din åsikt är viktig för oss",
    greeting: "Hej {name},",
    followup_intro: "Vi ville bara följa upp på vårt tidigare meddelande.",
    body: "Tack för att du valde {company}. Vi hoppas att du är nöjd med din upplevelse!",
    body2: "Det skulle betyda otroligt mycket för oss om du kunde ta 2 minuter och lämna en recension. Det hjälper oss att förbättra vår service och hjälper andra att fatta ett bra beslut.",
    cta: "Skriv en recension →",
    closing: "Med vänliga hälsningar,",
    footer: "Du får det här mejlet eftersom du har varit kund hos {company}.",
    unsubscribe: "Avregistrera framtida mejl",
    lang: "sv",
  },
  no: {
    subject_first: "Kan du hjelpe oss med en rask anmeldelse?",
    subject_followup: "Påminnelse: Din mening er viktig for oss",
    greeting: "Hei {name},",
    followup_intro: "Vi ville bare følge opp på vår forrige melding.",
    body: "Takk for at du valgte {company}. Vi håper du er fornøyd med opplevelsen din!",
    body2: "Det ville bety utrolig mye for oss om du kunne ta 2 minutter og legge igjen en anmeldelse. Det hjelper oss med å forbedre tjenesten vår og hjelper andre med å ta en god beslutning.",
    cta: "Skriv en anmeldelse →",
    closing: "Med vennlig hilsen,",
    footer: "Du mottar denne e-posten fordi du har vært kunde hos {company}.",
    unsubscribe: "Avmeld fremtidige e-poster",
    lang: "no",
  },
};

function interpolate(str: string, vars: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => vars[key] || "");
}

export function getReviewEmailHtml(
  customerName: string,
  companyName: string,
  reviewUrl: string,
  reminderNumber: number,
  locale: Locale = "da"
): string {
  const tr = emailTranslations[locale] || emailTranslations.da;
  const isFollowUp = reminderNumber > 1;

  const greeting = interpolate(tr.greeting, { name: customerName });
  const body = interpolate(tr.body, { company: companyName });
  const footer = interpolate(tr.footer, { company: companyName });

  return `
<!DOCTYPE html>
<html lang="${tr.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tr.subject_first}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
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
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.6;">${greeting}</p>
              ${isFollowUp ? `<p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.6;">${tr.followup_intro}</p>` : ""}
              <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.6;">${body}</p>
              <p style="margin:0 0 32px;font-size:16px;color:#374151;line-height:1.6;">${tr.body2}</p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td align="center" style="background:#1E90FF;border-radius:12px;">
                    <a href="${reviewUrl}" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;border-radius:12px;">
                      ${tr.cta}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;">
                ${tr.closing}<br><strong>${companyName}</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
                ${footer}<br>
                <a href="${reviewUrl}" style="color:#1E90FF;text-decoration:none;">${tr.unsubscribe}</a>
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
  locale = "da",
}: {
  to: string;
  customerName: string;
  companyName: string;
  senderName: string;
  reviewUrl: string;
  reminderNumber: number;
  locale?: Locale;
}) {
  const tr = emailTranslations[locale] || emailTranslations.da;
  const subject = reminderNumber === 1 ? tr.subject_first : tr.subject_followup;

  const { data, error } = await resend.emails.send({
    from: `${senderName} <onboarding@resend.dev>`,
    to,
    subject,
    html: getReviewEmailHtml(customerName, companyName, reviewUrl, reminderNumber, locale),
  });

  if (error) throw error;
  return data;
}
