export type EmailTemplateType = 'main' | 'external';

export interface SendMagicLinkOptions {
  to: string;
  magicLink: string;
  mailingServiceUrl: string;
  template: EmailTemplateType;
  courseName?: string; // Required for 'external' template
}

export async function sendMagicLink(options: SendMagicLinkOptions): Promise<boolean> {
  const { to, magicLink, mailingServiceUrl, template, courseName } = options;

  if (!mailingServiceUrl) {
    console.error('MAILING_SERVICE_URL is not set in environment variables');
    return false;
  }

  const message = {
    email: to,
    magicLink,
    template,
    ...(template === 'external' && courseName ? { courseName } : {}),
  };

  try {
    const response = await fetch(mailingServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Magic link email sent successfully (template: ${template})`);
    return true;
  } catch (error) {
    console.error('Error sending magic link email:', error);
    return false;
  }
}
