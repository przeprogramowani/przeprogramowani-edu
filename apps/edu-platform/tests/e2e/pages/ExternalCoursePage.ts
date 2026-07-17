import type { Page } from '@playwright/test';
import { expect } from '../fixtures/test';

export class ExternalCoursePage {
  private readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async expectAuthenticatedPrework(returnPath: string, email: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${returnPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
    await expect(this.page.getByRole('heading', { name: '10xDevs 3.0: Prework' })).toBeVisible();
    await expect(this.page.getByText(email)).toBeVisible();
  }
}
