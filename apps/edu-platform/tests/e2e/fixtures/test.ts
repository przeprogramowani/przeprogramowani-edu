import { test as base, expect } from '@playwright/test';
import { getE2EEnv, type E2EEnv } from '../support/env';
import { ResendMagicLinks } from '../support/resendMagicLinks';

interface Fixtures {
  e2eEnv: E2EEnv;
  resendMagicLinks: ResendMagicLinks;
}

const test = base.extend<Fixtures>({
  e2eEnv: async ({}, use) => {
    await use(getE2EEnv());
  },
  resendMagicLinks: async ({ e2eEnv }, use) => {
    await use(new ResendMagicLinks(e2eEnv));
  },
});

export { expect, test };
