import axios from 'axios';
import type { CaptchaResponse } from '../server/verifyCaptcha';

export type CaptchaStatus = 'checking' | 'interactive' | 'verifying' | 'verified' | 'failed';

export function useCaptchaCallback(
  cfSiteKey: string,
  verificationResult: (success: boolean) => void,
  statusChanged?: (status: CaptchaStatus) => void
) {
  window.onloadTurnstileCallback = function () {
    statusChanged?.('checking');
    window.turnstile.render('#cf-captcha-container', {
      theme: 'dark',
      sitekey: cfSiteKey,
      callback: async function (captchaToken: string) {
        statusChanged?.('verifying');
        try {
          const captchaResult = await axios.post<CaptchaResponse>('/api/captcha/verify', {
            captchaToken,
          });
          verificationResult(captchaResult.data.success);
          statusChanged?.(captchaResult.data.success ? 'verified' : 'failed');
        } catch (error) {
          console.error('Captcha verification error:', error);
          verificationResult(false);
          statusChanged?.('failed');
        }
      },
      'before-interactive-callback': function () {
        statusChanged?.('interactive');
      },
      'after-interactive-callback': function () {
        statusChanged?.('checking');
      },
      'error-callback': function () {
        verificationResult(false);
        statusChanged?.('failed');
      },
      'expired-callback': function () {
        verificationResult(false);
        statusChanged?.('checking');
      },
      'timeout-callback': function () {
        verificationResult(false);
        statusChanged?.('failed');
      },
      'unsupported-callback': function () {
        verificationResult(false);
        statusChanged?.('failed');
      },
    });
  };
}
