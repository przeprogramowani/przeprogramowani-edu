import type { Page } from '@playwright/test';
import { expect } from '../fixtures/test';

export class ExternalLoginPage {
  private readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto(courseId: string, returnPath: string): Promise<void> {
    await this.page.context().clearCookies();
    await this.page.addInitScript(() => {
      window.turnstile = {
        render: (_container: string, options: { callback?: (token: string) => void }) => {
          window.setTimeout(() => options.callback?.('e2e-turnstile-token'), 0);
          return 'e2e-turnstile-widget';
        },
      };
    });
    await this.page.route('**/api/captcha/verify', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    const searchParams = new URLSearchParams({ returnUrl: returnPath });
    await this.page.goto(`/external/${courseId}/login?${searchParams.toString()}`);

    await this.page.waitForFunction(() => typeof window.onloadTurnstileCallback === 'function');
    await this.page.evaluate(() => window.onloadTurnstileCallback?.());
    await expect(this.page.getByRole('button', { name: /wyślij link do logowania|send sign-in link/i })).toBeEnabled();
  }

  async submitEmail(email: string): Promise<void> {
    await this.page.getByLabel(/adres email|email address/i).fill(email);
    await this.page.getByRole('button', { name: /wyślij link do logowania|send sign-in link/i }).click();
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(
      this.page.getByText(/na wskazany email wysłaliśmy link do logowania|we sent a sign-in link/i)
    ).toBeVisible();
  }
}
