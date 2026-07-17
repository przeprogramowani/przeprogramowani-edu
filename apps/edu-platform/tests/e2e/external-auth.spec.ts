import { ExternalCoursePage } from './pages/ExternalCoursePage';
import { ExternalLoginPage } from './pages/ExternalLoginPage';
import { test } from './fixtures/test';

test.describe.serial('external auth magic link', () => {
  test.setTimeout(60_000);

  test('authenticates 10xDevs 3 prework through Resend magic link', async ({
    page,
    e2eEnv,
    resendMagicLinks,
  }) => {
    const startedAt = new Date();
    const loginPage = new ExternalLoginPage(page);
    const coursePage = new ExternalCoursePage(page);

    await loginPage.goto(e2eEnv.externalCourseId, e2eEnv.externalReturnPath);
    await loginPage.submitEmail(e2eEnv.externalLoginEmail);
    await loginPage.expectSuccessMessage();

    const verifyUrl = await resendMagicLinks.findExternalVerifyUrl({
      courseId: e2eEnv.externalCourseId,
      inboxEmail: e2eEnv.resendInboxEmail,
      startedAt,
    });

    await page.goto(verifyUrl);
    await coursePage.expectAuthenticatedPrework(e2eEnv.externalReturnPath, e2eEnv.externalLoginEmail);
  });
});
