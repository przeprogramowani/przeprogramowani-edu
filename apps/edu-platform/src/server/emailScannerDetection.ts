interface ScannerDetectionResult {
  isScanner: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason?: string;
  scannerType?: string;
}

const SCANNER_USER_AGENTS = [
  /Microsoft Office (Excel|Word|Outlook|PowerPoint)/i,
  /Microsoft-Threat-Protection/i,
  /Microsoft\s+URL\s+Protection/i,
  /Microsoft-Azure-Application-Insights/i,
  /Google-Safety/i,
  /Google-SMTP-Relay/i,
  /Google-HTTP-Java-Client/i,
  /Proofpoint/i,
  /Mimecast/i,
  /Barracuda/i,
  /Cisco\s+Email\s+Security/i,
  /Email\s+Scanner/i,
  /Link\s+Checker/i,
  /URL\s+Validation/i,
  /Security\s+Scanner/i,
];

function isKnownScanner(userAgent: string): { match: boolean; type?: string } {
  for (const pattern of SCANNER_USER_AGENTS) {
    const match = pattern.exec(userAgent);
    if (match) {
      return { match: true, type: match[0] };
    }
  }
  return { match: false };
}

export function detectEmailScanner(request: Request): ScannerDetectionResult {
  const userAgent = request.headers.get('user-agent') || '';
  const method = request.method;
  const accept = request.headers.get('accept') || '';
  const referer = request.headers.get('referer') || '';

  const scannerMatch = isKnownScanner(userAgent);
  if (scannerMatch.match) {
    return {
      isScanner: true,
      confidence: 'high',
      reason: 'User-Agent matches known email scanner',
      scannerType: scannerMatch.type,
    };
  }

  if (method === 'HEAD') {
    return {
      isScanner: true,
      confidence: 'medium',
      reason: 'HEAD request typically used by scanners',
    };
  }

  if (!referer && !accept.includes('text/html')) {
    return {
      isScanner: true,
      confidence: 'medium',
      reason: 'Missing referer and non-browser Accept header',
    };
  }

  const botPatterns = [/bot/i, /crawler/i, /spider/i, /scanner/i, /checker/i, /validator/i, /monitor/i];
  for (const pattern of botPatterns) {
    if (pattern.test(userAgent)) {
      return {
        isScanner: true,
        confidence: 'medium',
        reason: 'User-Agent matches bot pattern',
      };
    }
  }

  if (userAgent.length < 20) {
    return {
      isScanner: true,
      confidence: 'low',
      reason: 'Suspiciously short or empty user agent',
    };
  }

  return { isScanner: false, confidence: 'high' };
}

export function shouldBlockScanner(
  result: ScannerDetectionResult,
  minConfidence: 'high' | 'medium' | 'low' = 'medium',
): boolean {
  if (!result.isScanner) return false;
  const levels = { high: 3, medium: 2, low: 1 };
  return levels[result.confidence] >= levels[minConfidence];
}

function createScannerResponse(url: URL, detectionResult: ScannerDetectionResult): Response {
  console.log('[EMAIL-SCANNER-DETECTION]', {
    detected: detectionResult.isScanner,
    confidence: detectionResult.confidence,
    reason: detectionResult.reason,
    scannerType: detectionResult.scannerType,
    timestamp: new Date().toISOString(),
  });

  const continueUrl = new URL(url.toString());
  continueUrl.searchParams.set('confirm', '1');

  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Email Verification</title>
  <meta name="robots" content="noindex, nofollow">
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #111827; color: #fff; font-family: system-ui, -apple-system, sans-serif; }
    .container { text-align: center; max-width: 420px; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    p { color: #9ca3af; line-height: 1.6; }
    a { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #7c3aed; color: #fff; text-decoration: none; border-radius: 0.5rem; font-weight: 500; }
    a:hover { background: #6d28d9; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Email Verification Link</h1>
    <p>This link was opened automatically by your email security system. If you are a real person, click the button below to continue.</p>
    <a href="${continueUrl.toString()}">Click here to continue</a>
  </div>
</body>
</html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export function emailScannerMiddleware(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.searchParams.get('confirm')) return null;

  const detection = detectEmailScanner(request);
  if (shouldBlockScanner(detection, 'medium')) {
    return createScannerResponse(url, detection);
  }

  return null;
}
