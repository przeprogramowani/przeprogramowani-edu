import { describe, it, expect } from 'vitest';
import { detectEmailScanner, shouldBlockScanner, emailScannerMiddleware } from './emailScannerDetection';

function makeRequest(options: { ua?: string; method?: string; accept?: string; referer?: string; url?: string } = {}) {
  const { ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', method = 'GET', accept = 'text/html', referer = 'https://mail.google.com', url = 'https://example.com/verify?token=abc123' } = options;
  const headers = new Headers();
  if (ua) headers.set('user-agent', ua);
  if (accept) headers.set('accept', accept);
  if (referer) headers.set('referer', referer);
  return new Request(url, { method, headers });
}

describe('detectEmailScanner', () => {
  describe('known scanner User-Agents (high confidence)', () => {
    const knownScanners = [
      ['Microsoft Office Outlook', 'Microsoft Office Outlook'],
      ['Microsoft-Threat-Protection/1.0', 'Microsoft-Threat-Protection'],
      ['Microsoft URL Protection Service', 'Microsoft URL Protection'],
      ['Microsoft-Azure-Application-Insights/2.0', 'Microsoft-Azure-Application-Insights'],
      ['Google-Safety/1.0', 'Google-Safety'],
      ['Google-SMTP-Relay', 'Google-SMTP-Relay'],
      ['Google-HTTP-Java-Client/1.0', 'Google-HTTP-Java-Client'],
      ['Proofpoint URL Defense/1.0', 'Proofpoint'],
      ['Mimecast Email Scanner', 'Mimecast'],
      ['Barracuda/3.0', 'Barracuda'],
      ['Cisco Email Security Appliance', 'Cisco Email Security'],
    ];

    it.each(knownScanners)('detects %s', (ua) => {
      const result = detectEmailScanner(makeRequest({ ua }));
      expect(result.isScanner).toBe(true);
      expect(result.confidence).toBe('high');
    });
  });

  it('detects HEAD requests (medium confidence)', () => {
    const result = detectEmailScanner(makeRequest({ method: 'HEAD', ua: 'SomeUnknownAgent/1.0 (compatible)' }));
    expect(result.isScanner).toBe(true);
    expect(result.confidence).toBe('medium');
    expect(result.reason).toContain('HEAD');
  });

  it('detects missing referer + non-browser Accept (medium confidence)', () => {
    const result = detectEmailScanner(makeRequest({ referer: '', accept: 'application/json', ua: 'SomeUnknownAgent/1.0 (compatible)' }));
    expect(result.isScanner).toBe(true);
    expect(result.confidence).toBe('medium');
    expect(result.reason).toContain('referer');
  });

  describe('bot-like User-Agent patterns (medium confidence)', () => {
    const botUAs = ['Googlebot/2.1', 'AhrefsBot/7.0', 'web-spider/3.0', 'link-scanner/1.0', 'url-checker/2.0', 'html-validator/1.0', 'uptime-monitor/3.1'];

    it.each(botUAs)('detects %s', (ua) => {
      const result = detectEmailScanner(makeRequest({ ua }));
      expect(result.isScanner).toBe(true);
      expect(result.confidence).toBe('medium');
    });
  });

  it('detects short User-Agent (low confidence)', () => {
    const result = detectEmailScanner(makeRequest({ ua: 'curl/7.0', referer: 'https://x.com', accept: 'text/html' }));
    expect(result.isScanner).toBe(true);
    expect(result.confidence).toBe('low');
  });

  it('allows normal browser requests', () => {
    const result = detectEmailScanner(makeRequest());
    expect(result.isScanner).toBe(false);
  });

  it('allows requests with referer even without text/html Accept', () => {
    const result = detectEmailScanner(makeRequest({ accept: '*/*', referer: 'https://mail.google.com' }));
    expect(result.isScanner).toBe(false);
  });
});

describe('shouldBlockScanner', () => {
  it('blocks high confidence at medium threshold', () => {
    expect(shouldBlockScanner({ isScanner: true, confidence: 'high' }, 'medium')).toBe(true);
  });

  it('blocks medium confidence at medium threshold', () => {
    expect(shouldBlockScanner({ isScanner: true, confidence: 'medium' }, 'medium')).toBe(true);
  });

  it('does not block low confidence at medium threshold', () => {
    expect(shouldBlockScanner({ isScanner: true, confidence: 'low' }, 'medium')).toBe(false);
  });

  it('does not block non-scanner results', () => {
    expect(shouldBlockScanner({ isScanner: false, confidence: 'high' }, 'low')).toBe(false);
  });
});

describe('emailScannerMiddleware', () => {
  it('returns Response for known scanner', () => {
    const response = emailScannerMiddleware(makeRequest({ ua: 'Microsoft-Threat-Protection/1.0' }));
    expect(response).toBeInstanceOf(Response);
    expect(response!.status).toBe(200);
  });

  it('returns null for normal browser', () => {
    const response = emailScannerMiddleware(makeRequest());
    expect(response).toBeNull();
  });

  it('bypasses detection when confirm=1 is present', () => {
    const response = emailScannerMiddleware(makeRequest({ ua: 'Microsoft-Threat-Protection/1.0', url: 'https://example.com/verify?token=abc&confirm=1' }));
    expect(response).toBeNull();
  });

  it('does not block low-confidence detections', () => {
    const response = emailScannerMiddleware(makeRequest({ ua: 'curl/7.0', referer: 'https://x.com', accept: 'text/html' }));
    expect(response).toBeNull();
  });

  it('response contains continue link with confirm param', async () => {
    const response = emailScannerMiddleware(makeRequest({ ua: 'Microsoft-Threat-Protection/1.0', url: 'https://example.com/verify?token=abc' }));
    const html = await response!.text();
    expect(html).toContain('confirm=1');
    expect(html).toContain('Click here to continue');
    expect(html).toContain('noindex, nofollow');
  });

  it('response has no-cache headers', () => {
    const response = emailScannerMiddleware(makeRequest({ ua: 'Microsoft-Threat-Protection/1.0' }));
    expect(response!.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
  });
});
