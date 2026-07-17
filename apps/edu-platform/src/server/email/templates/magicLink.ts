import type { MagicLinkTemplateProps, EmailContent, EmailLanguage } from '../types';

function plMinutesWord(minutes: number): string {
  const lastTwo = minutes % 100;
  if (lastTwo >= 12 && lastTwo <= 14) return 'minut';
  const last = minutes % 10;
  if (last >= 2 && last <= 4) return 'minuty';
  return 'minut';
}

const TRANSLATIONS = {
  pl: {
    main: {
      subject: 'Zaloguj się do platformy Przeprogramowani',
      greeting: 'Witaj!',
      instruction: 'Kliknij poniższy przycisk, aby zalogować się do platformy z kursami:',
      buttonText: 'Zaloguj się',
      linkFallback: 'Lub skopiuj ten link do przeglądarki:',
      expiry: (ttl: number) =>
        `Link jest ważny przez ${ttl} ${plMinutesWord(ttl)}. Jeśli nie prosiłeś o ten email, możesz go zignorować.`,
    },
    external: {
      subjectPrefix: 'Zaloguj się do kursu:',
      greeting: 'Witaj!',
      instructionPrefix: 'Kliknij poniższy przycisk, aby zalogować się i uzyskać dostęp do materiałów kursu',
      buttonText: 'Przejdź do kursu',
      linkFallback: 'Lub skopiuj ten link do przeglądarki:',
      expiry: (ttl: number) =>
        `Link jest ważny przez ${ttl} ${plMinutesWord(ttl)}. Jeśli nie prosiłeś o ten email, możesz go zignorować.`,
      byLine: 'by Przeprogramowani',
    },
  },
  en: {
    main: {
      subject: 'Sign in to Przeprogramowani Platform',
      greeting: 'Hello!',
      instruction: 'Click the button below to sign in to the course platform:',
      buttonText: 'Sign In',
      linkFallback: 'Or copy this link to your browser:',
      expiry: (ttl: number) =>
        `This link expires in ${ttl} minutes. If you didn't request this email, you can ignore it.`,
    },
    external: {
      subjectPrefix: 'Sign in to course:',
      greeting: 'Hello!',
      instructionPrefix: 'Click the button below to sign in and access course materials for',
      buttonText: 'Go to Course',
      linkFallback: 'Or copy this link to your browser:',
      expiry: (ttl: number) =>
        `This link expires in ${ttl} minutes. If you didn't request this email, you can ignore it.`,
      byLine: 'by Przeprogramowani',
    },
  },
} as const;

const DEFAULT_EXTERNAL_COLOR = '#10b981';

export function generateMagicLinkEmail(props: MagicLinkTemplateProps): EmailContent {
  const { magicLink, type, lang, ttlMinutes, courseName, brandColor } = props;

  if (type === 'external') {
    if (!courseName) {
      throw new Error('courseName is required for external template');
    }
    return generateExternalTemplate(magicLink, courseName, lang, ttlMinutes, brandColor || DEFAULT_EXTERNAL_COLOR);
  }
  return generateMainTemplate(magicLink, lang, ttlMinutes);
}

function generateMainTemplate(magicLink: string, lang: EmailLanguage, ttlMinutes: number): EmailContent {
  const t = TRANSLATIONS[lang].main;

  return {
    subject: t.subject,
    html: `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Przeprogramowani</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">${t.greeting}</h2>
    <p style="color: #4b5563;">${t.instruction}</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${magicLink}"
         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                display: inline-block;">
        ${t.buttonText}
      </a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">
      ${t.linkFallback}<br>
      <a href="${magicLink}" style="color: #667eea; word-break: break-all;">${magicLink}</a>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

    <p style="color: #9ca3af; font-size: 12px;">
      ${t.expiry(ttlMinutes)}
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>&copy; 2026 Przeprogramowani.pl</p>
  </div>
</body>
</html>
    `.trim(),
  };
}

function generateExternalTemplate(
  magicLink: string,
  courseName: string,
  lang: EmailLanguage,
  ttlMinutes: number,
  brandColor: string
): EmailContent {
  const t = TRANSLATIONS[lang].external;

  return {
    subject: `${t.subjectPrefix} ${courseName}`,
    html: `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subjectPrefix} ${courseName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: ${brandColor}; padding: 30px; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">${courseName}</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">${t.byLine}</p>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">${t.greeting}</h2>
    <p style="color: #4b5563;">
      ${t.instructionPrefix} <strong>${courseName}</strong>:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${magicLink}"
         style="background: ${brandColor};
                color: white;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                display: inline-block;">
        ${t.buttonText}
      </a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">
      ${t.linkFallback}<br>
      <a href="${magicLink}" style="color: ${brandColor}; word-break: break-all;">${magicLink}</a>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

    <p style="color: #9ca3af; font-size: 12px;">
      ${t.expiry(ttlMinutes)}
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>&copy; 2026 Przeprogramowani.pl</p>
  </div>
</body>
</html>
    `.trim(),
  };
}
